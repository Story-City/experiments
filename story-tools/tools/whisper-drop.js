// Whisper Drop: Story City characters leave voices at a spot. Listen, then reply
// with a kind preset phrase spoken in your own "agent voice" (no real voice is ever recorded).
const TEXT = {
  walk: 'On a Walk',
  home: 'At Home',
  kicker: 'You’re standing at',
  count: (n, mine) => `${n} voices here${mine ? ' · 1 is your reply' : ''}`,
  play: 'Play whisper',
  leave: 'Leave a Reply',
  sayKicker: 'Your reply · what to say',
  sayTitle: 'Pick something kind',
  voiceKicker: 'Your agent voice',
  voiceHint: 'Tap a voice to hear it. Nobody ever hears your real voice.',
  hear: 'Hear It Again',
  drop: 'Leave It for the Next Walker',
  noVoice: 'No speaker voice here. Imagine it!',
  yours: 'Your reply',
  doneKicker: 'Left for the next walker',
  doneTitle: 'Your reply is waiting at the spot',
  doneSub: (spot) => `It plays in your agent voice for the next walker at ${spot}.`,
  again: 'Listen Again',
  back: 'Back to Tools',
};

const SPOTS = {
  walk: { name: 'The red door on 104 St', short: 'the red door', door: true },
  home: { name: 'The Kitchen', short: 'the kitchen', door: false },
};
const STREET = { name: 'A Spot on Your Street', short: 'that spot on your street', door: true };

// Voices of Story City characters (all fictional). pitch/rate shape each speaking voice.
const WHISPERS = [
  { who: 'Wren', role: 'The Society', avatar: 'img/wren.svg', pitch: 1.1, rate: 0.85,
    say: 'You found the spot, agent. Look closely. The Society hides little owls in plain sight.' },
  { who: 'Tam', role: 'the lamplighter', pitch: 0.6, rate: 0.75,
    say: 'Evening. I light the lamps on this street, and every one of them hums a different note.' },
  { who: 'Mabel', role: 'keeper of the clock tower', pitch: 1.4, rate: 0.95,
    say: 'The clock skipped a tick at noon today. That only happens when a new agent arrives.' },
];

// Kind preset replies: the only things a player can say.
const PHRASES = [
  'Thank you for the clue, Wren.',
  'Hello from a new agent. The city is full of surprises.',
  'I hope your walk is a happy one.',
  'Keep looking up. There is magic everywhere.',
  'Good luck, agent. You’ve got this.',
  'I left a smile here for you.',
];

// Agent voices: speechSynthesis settings, never a recording.
const VOICES = [
  { id: 'low', label: 'Low and Mysterious', pitch: 0.3, rate: 0.75, volume: 0.9 },
  { id: 'bright', label: 'Bright', pitch: 1.7, rate: 1.1, volume: 1 },
  { id: 'whisper', label: 'Whisper', pitch: 1.2, rate: 0.7, volume: 0.35 },
  { id: 'grand', label: 'Slow and Grand', pitch: 0.8, rate: 0.6, volume: 1 },
];
const KEY = 'st-whisper-drop-v2';   // new key: the old version stored real recordings' metadata

export default function run(k) {
  const { h, show, bar, openSheet, closeSheet, css, tool, home, toast, onLeave } = k;
  css('whisper-drop', CSS);

  const synth = window.speechSynthesis;
  let mode = 'walk';
  let street = false;   // at home: kitchen or a spot on your street
  let timers = [];
  onLeave(cleanup);

  function spot() { return mode === 'walk' ? SPOTS.walk : (street ? STREET : SPOTS.home); }

  function spotScreen() {
    cleanup();
    const s = spot();
    const mine = left();
    const rows = WHISPERS.map((w) => whisperRow(w));
    if (mine) rows.push(whisperRow({ who: TEXT.yours, role: voiceOf(mine.voice).label, say: mine.say, ...voiceOf(mine.voice), you: true }));
    show(
      bar(),
      h('div', { class: 'wd-where', role: 'group' },
        ['walk', 'home'].map((m) => h('button', { class: 'chip', 'aria-pressed': String(mode === m), onclick: () => { mode = m; spotScreen(); } }, TEXT[m]))),
      mode === 'home' ? h('div', { class: 'wd-where' },
        [[false, SPOTS.home.name], [true, STREET.name]].map(([st, label]) => h('button', { class: 'chip', 'aria-pressed': String(street === st), onclick: () => { street = st; spotScreen(); } }, label))) : null,
      h('div', { class: 'frame wd-spot' },
        s.door ? h('div', { class: 'wd-door', 'aria-hidden': 'true' }, h('i')) : h('div', { class: 'wd-kettle', 'aria-hidden': 'true' }),
        h('div', {},
          h('p', { class: 'kicker' }, TEXT.kicker),
          h('p', { class: 'big' }, s.name),
          h('p', { class: 'hint' }, TEXT.count(rows.length, !!mine)))),
      h('div', { class: 'wd-list' }, rows),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: replyScreen }, TEXT.leave)),
    );
  }

  // One voice: play button, animated bars, transcript appears as it plays.
  function whisperRow(w) {
    const bars = waveBars(18);
    const line = h('p', { class: 'wd-line' }, '“…”');
    const row = h('div', { class: `wd-row${w.you ? ' wd-you' : ''}` });
    const btn = h('button', { class: 'wd-play', 'aria-label': `${TEXT.play}: ${w.who}`, onclick: () => {
      if (row.classList.contains('on')) return stopVoice();
      line.textContent = `“${w.say}”`;
      speak(w.say, w, row);
    } });
    row.append(btn, h('div', { class: 'wd-body' },
      h('div', { class: 'wd-who' },
        w.avatar ? h('img', { class: 'wd-av', src: w.avatar, alt: '' }) : null,
        h('b', {}, w.who), h('span', {}, w.role)),
      bars, line));
    return row;
  }

  // Say a line out loud with a voice preset; the row (or bars) animate while it plays.
  function speak(text, v, el) {
    stopVoice();
    clearTimers();
    el.classList.add('on');
    const end = () => el.classList.remove('on');
    if (!synth || !window.SpeechSynthesisUtterance) {
      toast(TEXT.noVoice);
      timers.push(setTimeout(end, 3000));
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = v.pitch; u.rate = v.rate; u.volume = v.volume ?? 0.7;
    u.onend = end;
    // No voices installed (or onend never fires): the bars still play for about as long as the line.
    timers.push(setTimeout(end, 1500 + text.length * 90 / v.rate));
    synth.speak(u);
  }

  /* ---------- reply: a kind phrase + an agent voice ---------- */
  function replyScreen() {
    cleanup();
    let say = null, voice = null;
    const card = h('div', { class: 'wd-preview' }, waveBars(14), h('p', { class: 'wd-line' }, '“…”'));
    const hear = h('button', { class: 'link', hidden: true, onclick: () => speak(say, voiceOf(voice), card) }, TEXT.hear);
    const drop = h('button', { class: 'btn jewel', disabled: true, onclick: () => dropIt(say, voice) }, TEXT.drop);
    const phraseList = h('div', { class: 'wd-phrases', role: 'radiogroup', 'aria-label': TEXT.sayTitle }, PHRASES.map((p) =>
      h('button', { class: 'wd-phrase', role: 'radio', 'aria-checked': 'false', onclick: (e) => {
        say = p;
        mark(phraseList, e.currentTarget);
        update(true);
      } }, p)));
    const voiceList = h('div', { class: 'wd-voices', role: 'radiogroup', 'aria-label': TEXT.voiceKicker }, VOICES.map((v) =>
      h('button', { class: 'wd-voice', role: 'radio', 'aria-checked': 'false', 'data-voice': v.id, onclick: (e) => {
        voice = v.id;
        mark(voiceList, e.currentTarget);
        update(true);
      } }, h('span', { class: 'wd-dot', 'aria-hidden': 'true' }), v.label)));

    function mark(list, btn) { list.querySelectorAll('[role=radio]').forEach((b) => b.setAttribute('aria-checked', String(b === btn))); }
    function update(play) {
      card.querySelector('.wd-line').textContent = `“${say || '…'}”`;
      const ready = say && voice;
      drop.disabled = !ready;
      hear.hidden = !ready;
      if (ready && play) speak(say, voiceOf(voice), card);
    }

    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.sayKicker),
      h('h1', { class: 'display' }, TEXT.sayTitle),
      phraseList,
      h('p', { class: 'kicker wd-vk' }, TEXT.voiceKicker),
      voiceList,
      h('p', { class: 'hint' }, TEXT.voiceHint),
      card,
      h('div', { class: 'wd-after' }, hear),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, drop),
    );
  }

  function dropIt(say, voice) {
    stopVoice();
    try { localStorage.setItem(KEY, JSON.stringify({ spot: spot().name, say, voice, at: Date.now() })); } catch (e) { /* ignore */ }
    const s = spot();
    openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.doneKicker),
        h('div', { class: 'wd-bars wd-sheetbars on' }, Array.from({ length: 12 }, (_, i) => h('i', { style: `--d:${i * 0.08}s; --hgt:${35 + ((i * 41) % 55)}%` }))),
        h('h3', {}, TEXT.doneTitle),
        h('p', { class: 'wd-quote' }, `“${say}”`),
        h('p', { class: 'more' }, TEXT.doneSub(s.short))),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { closeSheet(); spotScreen(); } }, TEXT.again),
        h('button', { class: 'link', onclick: home }, TEXT.back)),
    ], null, tool.jewel);
  }

  /* ---------- pieces + cleanup ---------- */
  function waveBars(n) {
    return h('div', { class: 'wd-bars' }, Array.from({ length: n }, (_, i) => h('i', { style: `--d:${(i * 0.07) % 0.6}s; --hgt:${30 + ((i * 37) % 60)}%` })));
  }
  function voiceOf(id) { return VOICES.find((v) => v.id === id) || VOICES[0]; }
  function left() {
    try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && v.say ? v : null; } catch (e) { return null; }
  }
  function stopVoice() {
    try { synth?.cancel(); } catch (e) { /* ignore */ }
    document.querySelectorAll('.wd-row.on, .wd-preview.on').forEach((r) => r.classList.remove('on'));
  }
  function clearTimers() { timers.forEach((t) => clearTimeout(t)); timers = []; }
  function cleanup() { clearTimers(); stopVoice(); }

  spotScreen();
}

const CSS = `
.wd-where { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.wd-where .chip { min-height: 44px; height: auto; }
.wd-spot { display: flex; gap: 16px; align-items: center; padding: 20px; margin-top: 4px; }
.wd-spot .big { font-size: 24px; }
.wd-spot .kicker { margin-bottom: 6px; }
.wd-spot .hint { margin: 6px 0 0; }
.wd-door { flex: 0 0 auto; width: 58px; height: 92px; border-radius: 28px 28px 4px 4px; background: #FF4F79; position: relative; box-shadow: inset 0 0 0 5px color-mix(in srgb, #FF4F79 70%, var(--ink)); }
.wd-door::before { content: ""; position: absolute; left: 12px; right: 12px; top: 14px; height: 26px; border-radius: 14px 14px 2px 2px; border: 2px solid color-mix(in srgb, #FF4F79 60%, var(--ink)); }
.wd-door i { position: absolute; right: 10px; top: 52px; width: 7px; height: 7px; border-radius: 50%; background: #F5B82E; }
.wd-kettle { flex: 0 0 auto; width: 70px; height: 62px; border-radius: 30px 30px 10px 10px; background: #35C6D7; position: relative; margin-top: 16px; }
.wd-kettle::before { content: ""; position: absolute; left: 22px; top: -14px; width: 26px; height: 12px; border-radius: 12px 12px 0 0; border: 4px solid #35C6D7; border-bottom: 0; }
.wd-list { display: grid; gap: 10px; margin-top: 16px; }
.wd-row { display: flex; gap: 12px; align-items: flex-start; padding: 12px; border-radius: 12px; background: var(--velvet); border: 1px solid var(--line); }
.wd-row.on { border-color: var(--jewel); }
.wd-play { flex: 0 0 auto; width: 48px; height: 48px; border-radius: 50%; border: 0; background: var(--jewel); position: relative; }
.wd-play::after { content: ""; position: absolute; left: 19px; top: 15px; border-left: 14px solid var(--midnight); border-top: 9px solid transparent; border-bottom: 9px solid transparent; }
.wd-row.on .wd-play::after { left: 17px; top: 16px; width: 14px; height: 16px; border: 0; background: linear-gradient(90deg, var(--midnight) 35%, transparent 35% 65%, var(--midnight) 65%); }
.wd-body { flex: 1; min-width: 0; }
.wd-body b { font: 700 11px var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--glow); }
.wd-bars { display: flex; align-items: center; gap: 3px; height: 28px; margin: 6px 0 4px; }
.wd-bars i { flex: 1; height: 20%; border-radius: 2px; background: color-mix(in srgb, var(--jewel) 55%, var(--line)); transition: height 0.2s; }
.wd-row.on .wd-bars i, .wd-bars.on i { background: var(--jewel); animation: wd-bar 0.6s var(--d) ease-in-out infinite alternate; }
@keyframes wd-bar { from { height: 15%; } to { height: var(--hgt); } }
.wd-line { margin: 0; font: italic 500 16px/1.3 var(--f-head); color: var(--mist); }
.wd-who { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.wd-who span { font-size: 12px; color: var(--lilac); }
.wd-av { width: 22px; height: 22px; border-radius: 50%; box-shadow: 0 0 0 1.5px var(--line); }
.wd-you { border-style: dashed; border-color: color-mix(in srgb, var(--jewel) 60%, var(--line)); }
.wd-phrases { display: grid; gap: 8px; margin-top: 14px; }
.wd-phrase { text-align: left; min-height: 48px; padding: 10px 14px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--velvet); color: var(--starlight); font: italic 500 17px/1.3 var(--f-head); }
.wd-phrase[aria-checked="true"] { border-color: var(--jewel); background: color-mix(in srgb, var(--jewel) 20%, var(--velvet)); }
.wd-vk { margin: 22px 0 10px; }
.wd-voices { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.wd-voice { display: flex; align-items: center; gap: 8px; min-height: 48px; padding: 8px 12px; border-radius: 999px; border: 1.5px solid var(--line); background: none; color: var(--mist); font: 600 14px/1.15 var(--f-body); text-align: left; }
.wd-voice[aria-checked="true"] { background: var(--jewel); border-color: var(--jewel); color: var(--midnight); }
.wd-dot { flex: 0 0 auto; width: 10px; height: 10px; border-radius: 50%; border: 2px solid currentColor; }
.wd-voice[aria-checked="true"] .wd-dot { background: currentColor; }
.wd-preview { margin-top: 14px; padding: 12px 14px; border-radius: 12px; background: var(--velvet); border: 1px solid var(--line); }
.wd-preview.on { border-color: var(--jewel); }
.wd-preview.on .wd-bars i { background: var(--jewel); animation: wd-bar 0.6s var(--d) ease-in-out infinite alternate; }
.wd-quote { margin: 0 0 8px; font: italic 500 18px/1.3 var(--f-head); color: var(--starlight); }
.wd-after { display: flex; justify-content: center; gap: 8px; }
.wd-sheetbars { width: 140px; margin: 4px auto 12px; height: 36px; }
`;
