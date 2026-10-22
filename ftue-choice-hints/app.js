// Real The Summons beats from script/summons.ts:
// 1) opening → single reply
// 2) mailbox → two replies
const TYPING_DELAY_MS = 550;
const READ_PAUSE_MS = 650;
const HINT_IDLE_MS = 1000;
const HINT_HOLD_MS = 1600;
const HINT_FADE_MS = 280;
const HINT_GAP_MS = 320;

const BEATS = [
  {
    id: 'opening',
    messages: [
      'Hello.',
      "Don't bother asking how I got this number.",
      'Look out your window. The one facing the street.',
      'Are you looking?',
    ],
    options: [{ label: 'Yes… what am I looking for?' }],
  },
  {
    id: 'mailbox',
    messages: [
      'You found it.',
      'Enter the code from the seal, then slide the letter in.',
      'Do it, and all will be revealed.',
      "Or walk away. Some people do. We don't ask them twice.",
    ],
    options: [
      { label: 'Okay here goes…' },
      { label: "I'm done with this goose chase!" },
    ],
  },
];

const thread = document.getElementById('thread');
const choicesEl = document.getElementById('choices');

let hintAnim = null;
let hintTimer = null;
let hintTourToken = 0;
let audioCtx = null;
let beatIndex = 0;
let busy = false;

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTapClick() {
  ensureAudio();
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.exponentialRampToValueAtTime(420, t + 0.08);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.14);
}

function scrollEnd() {
  thread.scrollTop = thread.scrollHeight;
}

function showTyping() {
  const row = document.createElement('div');
  row.className = 'typing';
  row.id = 'typing';
  row.innerHTML = '<i></i><i></i><i></i>';
  thread.insertBefore(row, choicesEl);
  scrollEnd();
}

function hideTyping() {
  document.getElementById('typing')?.remove();
}

function addMessage(text, mine) {
  const el = document.createElement('div');
  el.className = mine ? 'msg me' : 'msg';
  el.textContent = text;
  thread.insertBefore(el, choicesEl);
  scrollEnd();
}

function clearHintTimer() {
  if (hintTimer) {
    window.clearTimeout(hintTimer);
    hintTimer = null;
  }
}

function destroyHint() {
  clearHintTimer();
  hintTourToken += 1;
  if (hintAnim) {
    hintAnim.destroy();
    hintAnim = null;
  }
  document.querySelectorAll('.tap-hint').forEach((node) => node.remove());
}

function fadeOutHint() {
  clearHintTimer();
  const hint = document.querySelector('.tap-hint');
  if (!hint) return Promise.resolve();
  hint.classList.remove('is-in');
  hint.classList.add('is-out');
  return wait(HINT_FADE_MS).then(() => {
    if (hintAnim) {
      hintAnim.destroy();
      hintAnim = null;
    }
    hint.remove();
  });
}

function mountHint(button) {
  const hint = document.createElement('div');
  hint.className = 'tap-hint';
  hint.setAttribute('aria-hidden', 'true');
  button.append(hint);

  if (window.lottie) {
    hintAnim = window.lottie.loadAnimation({
      container: hint,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'tap-hint.json',
    });
  }

  return hint;
}

async function showHintOn(button, token) {
  if (token !== hintTourToken) return;
  document.querySelectorAll('.tap-hint').forEach((node) => node.remove());
  if (hintAnim) {
    hintAnim.destroy();
    hintAnim = null;
  }

  const hint = mountHint(button);
  // next frame so opacity transition runs
  await wait(16);
  if (token !== hintTourToken) return;
  hint.classList.add('is-in');
}

async function runHintTour(buttons) {
  const token = ++hintTourToken;
  if (!buttons.length) return;

  await wait(HINT_IDLE_MS);
  if (token !== hintTourToken) return;

  // One reply: stay on it. Two replies: first → fade → second → fade → loop.
  let index = 0;
  while (token === hintTourToken) {
    await showHintOn(buttons[index], token);
    if (token !== hintTourToken) return;

    if (buttons.length === 1) return;

    await wait(HINT_HOLD_MS);
    if (token !== hintTourToken) return;

    await fadeOutHint();
    if (token !== hintTourToken) return;

    await wait(HINT_GAP_MS);
    if (token !== hintTourToken) return;

    index = (index + 1) % buttons.length;
  }
}

function clearChoices() {
  destroyHint();
  choicesEl.replaceChildren();
  choicesEl.hidden = true;
  choicesEl.classList.remove('is-on');
}

function showChoices(options) {
  clearChoices();
  choicesEl.hidden = false;
  choicesEl.classList.add('is-on');
  const buttons = [];

  options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    btn.style.animationDelay = `${index * 60}ms`;
    btn.innerHTML = '<span class="pulse" aria-hidden="true"></span><span class="label"></span>';
    btn.querySelector('.label').textContent = option.label;
    btn.addEventListener('click', () => onChoice(option.label));
    choicesEl.append(btn);
    buttons.push(btn);
  });

  runHintTour(buttons);
  scrollEnd();
}

function clearThreadMessages() {
  [...thread.children].forEach((node) => {
    if (node !== choicesEl) node.remove();
  });
}

async function playMessages(messages) {
  for (const text of messages) {
    showTyping();
    await wait(TYPING_DELAY_MS);
    hideTyping();
    addMessage(text, false);
    await wait(READ_PAUSE_MS);
  }
}

async function onChoice(label) {
  if (busy) return;
  busy = true;
  playTapClick();
  await fadeOutHint();
  clearChoices();
  addMessage(label, true);
  await wait(500);

  beatIndex += 1;
  if (beatIndex >= BEATS.length) {
    beatIndex = 0;
    clearThreadMessages();
  }

  busy = false;
  runBeat();
}

async function runBeat() {
  if (busy) return;
  busy = true;
  const beat = BEATS[beatIndex];
  await playMessages(beat.messages);
  busy = false;
  showChoices(beat.options);
}

runBeat();
