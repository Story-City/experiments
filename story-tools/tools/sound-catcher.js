// Sound Catcher: five seconds of sound hatches a little creature with its own tune.
const TEXT = {
  kicker: 'Catch a sound',
  title: 'Five seconds of your street',
  sub: 'Birds, a bus, a laugh, your own voice. Loud or soft, high or low: it all hatches something.',
  record: 'Record 5 Seconds',
  sample: 'Use a Sample Sound',
  recording: 'Listening…',
  noMic: 'No mic here. Using a sample sound instead.',
  hatching: 'Something’s hatching',
  hatchedKicker: 'It hatched',
  nameLabel: 'Give it a name',
  tune: 'Play Its Tune',
  keep: 'Keep It',
  traits: { big: 'Big', small: 'Tiny', spiky: 'Spiky', round: 'Round', busy: 'Busy legs', calm: 'Calm' },
  doneKicker: 'Caught',
  doneSub: (n) => `${n} lives in your sound jar now. Every street makes a different one.`,
  again: 'Catch Another',
  back: 'Back to Tools',
};

const JEWELS = ['#35C6D7', '#9883F8', '#F5B82E', '#ED54B3', '#FA7423', '#DA82ED', '#FF4F79', '#00CD9D', '#58B0F6', '#93DC5E', '#4CBFE9', '#DEC523', '#5BD380', '#FF6050'];
const NAMES = ['Bimble', 'Squonk', 'Pip', 'Murmur', 'Tizzle', 'Hum', 'Clatter', 'Wisp', 'Bonk', 'Fizz'];
const SCALE = [261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3];   // C pentatonic, two octaves
const SECONDS = 5;
const KEY = 'st-sound-catcher';

export default function run(k) {
  const { h, show, bar, openSheet, closeSheet, css, tool, home, toast, pick, onLeave } = k;
  css('sound-catcher', CSS);

  let ctx = null, stream = null, raf = 0, timers = [];
  onLeave(stopAll);

  function audio() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function intro() {
    stopAll();
    const wave = h('canvas', { class: 'sc-wave', width: 716, height: 200 });
    const ring = h('div', { class: 'sc-ring' }, h('span', {}, `${SECONDS}`));
    const recBtn = h('button', { class: 'btn jewel', onclick: () => tryMic() }, TEXT.record);
    const sampleBtn = h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => capture(sampleSource(), true) }, TEXT.sample);
    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('p', { class: 'sub' }, TEXT.sub),
      h('div', { class: 'sc-stage' }, wave, ring),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, recBtn, sampleBtn),
    );

    async function tryMic() {
      audio();   // wake audio inside the tap, before the permission prompt
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        capture(audio().createMediaStreamSource(stream), false);
      } catch (e) {
        toast(TEXT.noMic);
        capture(sampleSource(), true);
      }
    }

    // Read loudness + brightness every 100 ms for 5 s; draw a live waveform.
    function capture(src, audible) {
      recBtn.disabled = true; recBtn.textContent = TEXT.recording; sampleBtn.hidden = true;
      ring.classList.add('on');
      const ac = audio();
      const an = ac.createAnalyser();
      an.fftSize = 1024;
      src.connect(an);
      if (audible) an.connect(ac.destination);
      const time = new Uint8Array(an.fftSize);
      const freq = new Uint8Array(an.frequencyBinCount);
      const levels = [], pitches = [];
      const x = wave.getContext('2d');
      const t0 = performance.now();

      // Drawing runs on animation frames; sampling + the 5 s clock run on a timer.
      const draw = () => {
        an.getByteTimeDomainData(time);
        drawWave(x, time, wave);
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
      const id = setInterval(() => {
        an.getByteTimeDomainData(time);
        let sum = 0;
        for (const v of time) sum += ((v - 128) / 128) ** 2;
        levels.push(Math.sqrt(sum / time.length));
        an.getByteFrequencyData(freq);
        let num = 0, den = 0;
        freq.forEach((m, i) => { num += m * i; den += m; });
        pitches.push(den ? num / den / freq.length : 0);
        const left = SECONDS - (performance.now() - t0) / 1000;
        ring.firstChild.textContent = Math.max(0, Math.ceil(left));
        if (left > 0) return;
        clearInterval(id);
        cancelAnimationFrame(raf);
        try { src.disconnect(); an.disconnect(); } catch (e) { /* ignore */ }
        src.stop?.();
        stopMic();
        hatch(levels, pitches);
      }, 100);
      timers.push(id);
    }
  }

  // A made-up street sound: a few chirps and a low rumble, played out loud.
  function sampleSource() {
    const ac = audio();
    const out = ac.createGain();
    out.gain.value = 0.5;
    const now = ac.currentTime;
    const rumble = ac.createOscillator();
    const rg = ac.createGain();
    rumble.type = 'sawtooth'; rumble.frequency.value = 70;
    rg.gain.setValueAtTime(0.0001, now);
    rg.gain.linearRampToValueAtTime(0.18, now + 1.5);
    rg.gain.linearRampToValueAtTime(0.02, now + 4.8);
    rumble.connect(rg).connect(out);
    rumble.start(now); rumble.stop(now + SECONDS);
    for (let i = 0; i < 9; i++) {
      const t = now + 0.3 + i * 0.5 + Math.random() * 0.2;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1800 + Math.random() * 1200, t);
      o.frequency.exponentialRampToValueAtTime(900 + Math.random() * 600, t + 0.15);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(out);
      o.start(t); o.stop(t + 0.2);
    }
    out.stop = () => { try { rumble.stop(); } catch (e) { /* ignore */ } };
    return out;
  }

  // Egg wobbles, cracks, the creature pops out.
  function hatch(levels, pitches) {
    const c = creature(levels, pitches);
    const egg = h('svg', { class: 'sc-egg', viewBox: '0 0 120 150', 'aria-hidden': 'true' },
      h('ellipse', { cx: '60', cy: '82', rx: '46', ry: '60', fill: 'var(--pearl)' }),
      h('circle', { cx: '42', cy: '60', r: '6', fill: c.colour, opacity: '0.7' }),
      h('circle', { cx: '74', cy: '96', r: '8', fill: c.colour, opacity: '0.7' }),
      h('circle', { cx: '66', cy: '48', r: '4', fill: c.colour, opacity: '0.7' }));
    show(bar(), h('div', { class: 'spacer' }), h('div', { class: 'sc-eggwrap' }, egg), h('p', { class: 'display centre sc-hatching' }, TEXT.hatching), h('div', { class: 'spacer' }));
    timers.push(setTimeout(() => meet(c), 1900));
  }

  function meet(c) {
    const name = h('input', { class: 'sc-name', value: pick(NAMES), 'aria-label': TEXT.nameLabel, maxlength: '18' });
    show(
      bar(),
      h('p', { class: 'kicker centre' }, TEXT.hatchedKicker),
      h('div', { class: 'sc-creature' }, c.svg),
      h('label', { class: 'sc-namewrap' }, h('span', { class: 'hint' }, TEXT.nameLabel), name),
      h('div', { class: 'tags sc-traits' }, c.traits.map((t) => h('span', { class: 'tag' }, t))),
      h('button', { class: 'link', onclick: () => playTune(c.notes) }, TEXT.tune),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: () => keep(c, name.value.trim() || 'It') }, TEXT.keep)),
    );
    playTune(c.notes);
  }

  function keep(c, name) {
    saveCreature(name, c);
    openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.doneKicker),
        h('div', { class: 'sc-sheetpet' }, c.make()),
        h('h3', {}, name),
        h('p', { class: 'more' }, TEXT.doneSub(name))),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { closeSheet(); intro(); } }, TEXT.again),
        h('button', { class: 'link', onclick: () => playTune(c.notes) }, TEXT.tune),
        h('button', { class: 'link', onclick: home }, TEXT.back)),
    ], null, c.colour);
  }

  // Sound features -> body size, shape, eyes, legs, colour and an 8-note tune.
  function creature(levels, pitches) {
    const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
    const loud = Math.min(1, avg(levels) * 6);
    const high = Math.min(1, avg(pitches) * 4);
    let changes = 0;
    for (let i = 1; i < levels.length; i++) if (Math.abs(levels[i] - levels[i - 1]) > 0.02) changes++;
    const busy = Math.min(1, changes / Math.max(1, levels.length) * 2);
    const colour = JEWELS[Math.floor((loud * 7 + high * 13 + busy * 5) * 10) % JEWELS.length];
    const r = 44 + loud * 26;
    const spiky = high > 0.45;
    const legs = 2 + Math.round(busy * 6);
    const eye = 9 - high * 5;
    const max = Math.max(0.001, ...levels);
    const notes = Array.from({ length: 8 }, (_, i) => {
      const v = levels[Math.floor(i * levels.length / 8)] || 0;
      return SCALE[Math.min(SCALE.length - 1, Math.floor((v / max) * SCALE.length))];
    });
    const traits = [loud > 0.5 ? TEXT.traits.big : TEXT.traits.small, spiky ? TEXT.traits.spiky : TEXT.traits.round, busy > 0.4 ? TEXT.traits.busy : TEXT.traits.calm];

    const make = () => {
      const cx = 100, cy = 100;
      const legEls = Array.from({ length: legs }, (_, i) => {
        const x = cx - r * 0.8 + (i * (r * 1.6)) / Math.max(1, legs - 1);
        return h('line', { x1: x, y1: cy + r * 0.6, x2: x + (i % 2 ? 5 : -5), y2: cy + r + 22, stroke: colour, 'stroke-width': '5', 'stroke-linecap': 'round' });
      });
      let body;
      if (spiky) {
        const pts = [];
        const n = 18;
        for (let i = 0; i < n * 2; i++) {
          const a = (i / (n * 2)) * Math.PI * 2;
          const rr = i % 2 ? r : r + 10 + high * 8;
          pts.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`);
        }
        body = h('polygon', { points: pts.join(' '), fill: colour, 'stroke-linejoin': 'round' });
      } else {
        body = h('ellipse', { cx, cy, rx: r * 1.1, ry: r, fill: colour });
      }
      const eyes = [-1, 1].map((s) => h('g', {},
        h('circle', { cx: cx + s * r * 0.38, cy: cy - r * 0.2, r: eye + 4, fill: 'var(--starlight)' }),
        h('circle', { cx: cx + s * r * 0.38 + 1.5, cy: cy - r * 0.2 + 1, r: eye * 0.55, fill: 'var(--ink)' })));
      const mouth = h('path', { d: `M${cx - 10} ${cy + r * 0.3} q10 ${8 + loud * 6} 20 0`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': '3', 'stroke-linecap': 'round' });
      return h('svg', { viewBox: '0 0 200 200', class: 'sc-pet', role: 'img', 'aria-label': 'Your sound creature' }, legEls, body, eyes, mouth);
    };
    return { svg: make(), make, colour, notes, traits };
  }

  function playTune(notes) {
    const ac = audio();
    const t0 = ac.currentTime + 0.05;
    notes.forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      const t = t0 + i * 0.22;
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g).connect(ac.destination);
      o.start(t); o.stop(t + 0.22);
    });
    document.querySelector('.sc-creature .sc-pet')?.classList.remove('sc-dance');
    void document.body.offsetWidth;
    document.querySelector('.sc-creature .sc-pet')?.classList.add('sc-dance');
  }

  function stopMic() {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  function stopAll() {
    cancelAnimationFrame(raf);
    timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers = [];
    stopMic();
  }
  onLeave(() => { try { ctx?.close(); } catch (e) { /* ignore */ } ctx = null; });

  intro();
}

function drawWave(x, data, cv) {
  const w = cv.width, ht = cv.height;
  x.clearRect(0, 0, w, ht);
  x.lineWidth = 4;
  x.strokeStyle = getComputedStyle(cv).getPropertyValue('--jewel').trim() || '#93DC5E';
  x.beginPath();
  for (let i = 0; i < data.length; i++) {
    const px = (i / (data.length - 1)) * w;
    const py = ht / 2 + ((data[i] - 128) / 128) * (ht / 2) * 1.6;
    if (i) x.lineTo(px, py); else x.moveTo(px, py);
  }
  x.stroke();
}

function saveCreature(name, c) {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    list.push({ name, colour: c.colour, traits: c.traits, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(-30)));
  } catch (e) { /* ignore */ }
}

const CSS = `
.sc-stage { position: relative; margin-top: 24px; height: 150px; border-radius: 12px; border: 1px solid var(--line); background: var(--velvet); overflow: hidden; }
.sc-wave { width: 100%; height: 100%; display: block; }
.sc-ring { position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--line); display: grid; place-items: center; font: 600 18px var(--f-head); color: var(--lilac); }
.sc-ring.on { border-color: var(--jewel); color: var(--starlight); box-shadow: 0 0 16px color-mix(in srgb, var(--jewel) 50%, transparent); }
.sc-eggwrap { width: 140px; margin: 0 auto; }
.sc-egg { width: 100%; display: block; transform-origin: 50% 90%; animation: sc-wobble 0.35s ease-in-out infinite alternate, sc-crack 1.9s forwards; }
@keyframes sc-wobble { from { rotate: -9deg; } to { rotate: 9deg; } }
@keyframes sc-crack { 85% { scale: 1; opacity: 1; } 100% { scale: 1.3; opacity: 0; } }
.sc-hatching { font-size: 28px; margin-top: 18px; }
.sc-creature { width: 220px; margin: 4px auto 0; animation: land 0.6s cubic-bezier(0.2, 1.4, 0.4, 1) both; }
.sc-pet { width: 100%; display: block; overflow: visible; }
.sc-dance { animation: sc-bop 0.22s ease-in-out 8 alternate; transform-origin: 50% 90%; }
@keyframes sc-bop { to { translate: 0 -8px; } }
.sc-namewrap { display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: 6px; }
.sc-name { width: 100%; max-width: 280px; border: 0; border-bottom: 1.5px dashed var(--line); background: none; text-align: center; font: 600 34px/1.2 var(--f-head); color: var(--starlight); padding: 4px; }
.sc-name:focus { outline: none; border-bottom-color: var(--jewel); }
.sc-traits { justify-content: center; }
.sc-sheetpet { width: 120px; margin: 4px auto 8px; }
`;
