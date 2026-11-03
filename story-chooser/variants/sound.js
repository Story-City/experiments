// Variant 16 · Sound pick (Instagram). Swipe through four photo places; the sound follows the slide.
// Synthesised with the Web Audio API: no audio files, no network. The AudioContext starts on the first tap
// (browsers need a gesture); one sound plays at a time, crossfading over 300 ms, and loops while you stay.
// Picking works even with no audio at all.

const DUR = 10;      // seconds (offline test render default)
const LOOP = 90;     // seconds scheduled per pass while you stay on a slide; then it restarts
const FADE = 0.3;    // seconds, in and out

/* ---------- the four places ---------- */
const PLACES = [
  {
    id: 'rain', name: 'Rain on cobblestones', desc: 'Steady on the stones, a drip somewhere close.', key: 'deck.rain',
    colour: 'var(--accent)', make: rain,
    weights: { eerie: 2, downtown: 2, night: 1, calm: 1, mystery: 1 },
    why: 'You stayed in the rain on the cobblestones. This is the story it led to.',
  },
  {
    id: 'tavern', name: 'A tavern after midnight', desc: 'Low voices, a glass set down, the fire nearly out.', key: 'rooms.kitchen',
    colour: 'var(--story)', make: tavern,
    weights: { cozy: 2, friends: 1, history: 1, fantasy: 1, night: 1 },
    why: 'You stayed in the tavern after midnight. This is the story it led to.',
  },
  {
    id: 'clocks', name: 'A room full of clocks', desc: 'A hundred ticks that never quite agree.', key: 'deck.clockwork',
    colour: 'var(--hunt)', make: clocks,
    weights: { mysterious: 2, thoughtful: 2, scifi: 2, solo: 1 },
    why: 'You stayed in the room full of clocks. This is the story it led to.',
  },
  {
    id: 'forest', name: 'A forest at night', desc: 'Wind in the tops, crickets below, something calling.', key: 'deck.forest',
    colour: 'var(--gem)', make: forest,
    weights: { fantasy: 2, park: 2, calm: 1, tender: 1, night: 1 },
    why: 'You stayed in the forest at night. This is the story it led to.',
  },
];

/* ---------- synth helpers (work in AudioContext and OfflineAudioContext) ---------- */
const BUFFERS = new WeakMap(); // ac -> { white, pink, brown }
function noise(ac, kind) {
  let set = BUFFERS.get(ac);
  if (!set) { set = {}; BUFFERS.set(ac, set); }
  if (set[kind]) return set[kind];
  const n = ac.sampleRate * 3, buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, last = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === 'white') d[i] = w;
    else if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    else { b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.25; }
  }
  set[kind] = buf; return buf;
}
// A smooth random curve between lo and hi: `steps` random points, linearly interpolated to 256 samples per second.
function wander(dur, lo, hi, steps) {
  const pts = Array.from({ length: steps + 1 }, () => lo + Math.random() * (hi - lo));
  const n = Math.max(2, Math.floor(dur * 256)), out = new Float32Array(n);
  for (let i = 0; i < n; i++) { const p = i / (n - 1) * steps, k = Math.min(steps - 1, Math.floor(p)), f = p - k; out[i] = pts[k] + (pts[k + 1] - pts[k]) * f; }
  return out;
}
// Shared plumbing: an output gain that fades in, tracks sources and fades out on stop().
function voice(ac, dest, dur) {
  const out = ac.createGain(); out.connect(dest);
  const t0 = ac.currentTime + 0.01;
  out.gain.setValueAtTime(0, t0); out.gain.linearRampToValueAtTime(1, t0 + FADE);
  const srcs = [];
  return {
    out, t0, end: t0 + dur,
    src(buf, loop, offset = 0) { const s = ac.createBufferSource(); s.buffer = buf; s.loop = loop; srcs.push(s); s.start(t0, offset); return s; },
    osc(type, freq) { const o = ac.createOscillator(); o.type = type; o.frequency.value = freq; srcs.push(o); o.start(t0); return o; },
    gain(v) { const g = ac.createGain(); g.gain.value = v; return g; },
    filter(type, freq, q = 1) { const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f; },
    // short pluck on a gain param: jumps to `peak` at t and decays to silence over `len`
    pluck(param, t, peak, len) { param.setValueAtTime(0.0001, t); param.linearRampToValueAtTime(peak, t + 0.004); param.exponentialRampToValueAtTime(0.0001, t + len); },
    stop() {
      const t = Math.max(ac.currentTime, t0);
      out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0, t + FADE);
      for (const s of srcs) { try { s.stop(t + FADE + 0.05); } catch (e) { /* already stopped */ } }
    },
  };
}

/* ---------- one small factory per place: { start(ac, dest, dur), stop() } ---------- */
function rain() {
  let v;
  return {
    start(ac, dest, dur = DUR) {
      v = voice(ac, dest, dur);
      // body of the rain: brown + pink noise through a low-pass, with a slow swell
      const lp = v.filter('lowpass', 900, 0.7), swell = v.gain(1);
      swell.gain.setValueCurveAtTime(wander(dur, 0.55, 1, Math.ceil(dur / 1.6)), v.t0, dur);
      v.src(noise(ac, 'brown'), true).connect(lp); lp.connect(swell);
      const hiss = v.filter('highpass', 2500), hissG = v.gain(0.08);
      v.src(noise(ac, 'pink'), true, 1.3).connect(hiss); hiss.connect(hissG); hissG.connect(swell);
      swell.connect(v.out);
      // drips: one sine whose pitch jumps, plucked at random moments
      const drip = v.osc('sine', 3000), dg = v.gain(0);
      drip.connect(dg); dg.connect(v.out);
      for (let t = v.t0 + 0.4; t < v.end; t += 0.12 + Math.random() * 0.5) {
        drip.frequency.setValueAtTime(1800 + Math.random() * 3200, t);
        v.pluck(dg.gain, t, 0.05 + Math.random() * 0.08, 0.05 + Math.random() * 0.05);
      }
      return v.out;
    },
    stop() { v && v.stop(); },
  };
}

function tavern() {
  let v;
  return {
    start(ac, dest, dur = DUR) {
      v = voice(ac, dest, dur);
      // murmur: band-passed noise at speech-like centres, each with its own slow random gain
      const pink = noise(ac, 'pink');
      [[190, 0.9], [280, 1], [420, 0.8], [640, 0.55], [1100, 0.3]].forEach(([f, lvl], i) => {
        const bp = v.filter('bandpass', f, 6), g = v.gain(1);
        g.gain.setValueCurveAtTime(wander(dur, 0, lvl * 1.4, Math.ceil(dur * 3)), v.t0, dur);
        v.src(pink, true, i * 0.7).connect(bp); bp.connect(g); g.connect(v.out);
      });
      // low warm hum (the room, the fire)
      const hum = v.osc('sine', 55), hum2 = v.osc('triangle', 110), hg = v.gain(0.06), hlp = v.filter('lowpass', 180);
      hum.connect(hg); hum2.connect(hlp); hlp.connect(hg); hg.connect(v.out);
      // glass clinks: two partials plucked together
      const c1 = v.osc('sine', 2600), c2 = v.osc('sine', 4100), cg = v.gain(0);
      c1.connect(cg); c2.connect(cg); cg.connect(v.out);
      for (let t = v.t0 + 1 + Math.random(); t < v.end - 0.3; t += 1.6 + Math.random() * 2.4) {
        const f = 2300 + Math.random() * 900;
        c1.frequency.setValueAtTime(f, t); c2.frequency.setValueAtTime(f * 1.58, t);
        v.pluck(cg.gain, t, 0.09, 0.25);
      }
      return v.out;
    },
    stop() { v && v.stop(); },
  };
}

function clocks() {
  let v;
  return {
    start(ac, dest, dur = DUR) {
      v = voice(ac, dest, dur);
      const white = noise(ac, 'white');
      // three schedulers, slightly detuned, each a filtered noise click at about 1 Hz
      [[1.0, 0, 3200, 0.5], [1.045, 0.37, 2400, 0.4], [0.962, 0.71, 4200, 0.3]].forEach(([period, phase, f, lvl], i) => {
        const hp = v.filter('highpass', f, 2), g = v.gain(0);
        v.src(white, true, i * 0.5).connect(hp); hp.connect(g); g.connect(v.out);
        for (let t = v.t0 + 0.2 + phase; t < v.end; t += period) {
          g.gain.setValueAtTime(lvl, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.014); g.gain.setValueAtTime(0, t + 0.015);
          // the quieter half-tick ("tock")
          const t2 = t + period / 2; if (t2 < v.end) { g.gain.setValueAtTime(lvl * 0.45, t2); g.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.01); g.gain.setValueAtTime(0, t2 + 0.011); }
        }
      });
      // soft low hum of the room
      const hum = v.osc('sine', 62), hg = v.gain(0.035); hum.connect(hg); hg.connect(v.out);
      // a distant chime every few seconds
      const ch = v.osc('sine', 880), ch2 = v.osc('sine', 1320), cg = v.gain(0), clp = v.filter('lowpass', 2000);
      ch.connect(cg); ch2.connect(cg); cg.connect(clp); clp.connect(v.out);
      for (let t = v.t0 + 1.5 + Math.random() * 1.5; t < v.end - 0.5; t += 2.8 + Math.random() * 2.2) {
        const f = [660, 784, 880, 988][Math.floor(Math.random() * 4)];
        ch.frequency.setValueAtTime(f, t); ch2.frequency.setValueAtTime(f * 1.5, t);
        v.pluck(cg.gain, t, 0.07, 1.4);
      }
      return v.out;
    },
    stop() { v && v.stop(); },
  };
}

function forest() {
  let v;
  return {
    start(ac, dest, dur = DUR) {
      v = voice(ac, dest, dur);
      // wind: pink noise through a wandering band-pass with a slow swell
      const bp = v.filter('bandpass', 320, 0.6), wg = v.gain(1);
      bp.frequency.setValueCurveAtTime(wander(dur, 180, 700, Math.ceil(dur / 1.3)), v.t0, dur);
      wg.gain.setValueCurveAtTime(wander(dur, 0.35, 1.1, Math.ceil(dur / 1.1)), v.t0, dur);
      v.src(noise(ac, 'pink'), true, 0.4).connect(bp); bp.connect(wg); wg.connect(v.out);
      // crickets: high sines, amplitude-modulated fast, gated into chirps
      [[4300, 41, 0.33, 0.13], [4900, 36, 0.41, 0.09]].forEach(([f, rate, period, len]) => {
        const o = v.osc('sine', f), am = v.gain(0.5), lfo = v.osc('sine', rate), lfoG = v.gain(0.5), gate = v.gain(0);
        lfo.connect(lfoG); lfoG.connect(am.gain); o.connect(am); am.connect(gate); gate.connect(v.out);
        for (let t = v.t0 + Math.random() * 0.3; t < v.end; t += period + (Math.random() - 0.5) * 0.06) {
          if (Math.random() < 0.15) { t += period * 2; continue; }   // a pause now and then
          gate.gain.setValueAtTime(0, t); gate.gain.linearRampToValueAtTime(0.028, t + 0.02);
          gate.gain.setValueAtTime(0.028, t + len); gate.gain.linearRampToValueAtTime(0, t + len + 0.02);
        }
      });
      // an owl-ish two-note hoot now and then
      const owl = v.osc('sine', 330), og = v.gain(0), olp = v.filter('lowpass', 700);
      owl.connect(olp); olp.connect(og); og.connect(v.out);
      for (let t = v.t0 + 1.2 + Math.random() * 1.5; t < v.end - 1.2; t += 3.5 + Math.random() * 3) {
        owl.frequency.setValueAtTime(335, t); owl.frequency.linearRampToValueAtTime(300, t + 0.5);
        og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(0.22, t + 0.12); og.gain.linearRampToValueAtTime(0.0001, t + 0.5);
        const t2 = t + 0.62;
        owl.frequency.setValueAtTime(300, t2); owl.frequency.linearRampToValueAtTime(265, t2 + 0.7);
        og.gain.setValueAtTime(0, t2); og.gain.linearRampToValueAtTime(0.2, t2 + 0.14); og.gain.linearRampToValueAtTime(0.0001, t2 + 0.75);
      }
      return v.out;
    },
    stop() { v && v.stop(); },
  };
}

/* ---------- styles ---------- */
const CSS = `
.v-sound .q { text-wrap: balance; }
.v-sound .sub { margin: -4px 0 6px; font-size: 17px; line-height: 1.25; text-wrap: balance; }
.v-sound .hook { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px 48px; text-align: center; color: #fff;
  background: radial-gradient(120% 80% at 20% 10%, #3a1d7a, transparent 60%), radial-gradient(100% 70% at 90% 100%, #0e5a6b, transparent 60%), linear-gradient(160deg, #1a0f3a, #07121f); font-family: var(--f-head); }
.v-sound .hook .ico { font-size: 54px; line-height: 1; }
.v-sound .hook b { font-size: 36px; line-height: 1; font-weight: 900; text-wrap: balance; }
.v-sound .hook span { font-size: 22px; color: #dcd6f5; text-wrap: balance; }
.v-sound .hook .go { margin-top: 6px; font-size: 16px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #fff; opacity: .8; }
.v-sound .ig-slide .cap { padding-right: 132px; }
.v-sound .ig-slide .cap b { text-wrap: balance; font-size: 28px; }
.v-sound .ig-slide .cap span { text-wrap: balance; font-size: 17px; }
.v-sound .viz { --c: var(--accent); position: absolute; top: 46px; right: 12px; height: 34px; padding: 6px 8px; border-radius: 10px; background: rgba(0,0,0,.5); backdrop-filter: blur(4px); display: flex; align-items: flex-end; gap: 3px; pointer-events: none; z-index: 2; }
.v-sound .viz i { width: 4px; height: 3px; min-height: 3px; border-radius: 2px; background: color-mix(in srgb, var(--c) 45%, #555); transition: height .08s linear; }
.v-sound .viz.on i { background: var(--c); }
.v-sound .viz.on.sim i { animation: v-sound-bob .9s ease-in-out infinite alternate; animation-delay: var(--d); }
@keyframes v-sound-bob { from { height: 3px; } to { height: var(--h); } }
.v-sound .stayhere { position: absolute; right: 12px; bottom: 18px; z-index: 3; min-height: 44px; padding: 0 16px; border: 0; border-radius: 999px; background: #fff; color: #120a2a; font-size: 16px; font-weight: 800; box-shadow: 0 6px 18px rgba(0,0,0,.4); }
.v-sound .stayhere:active { transform: scale(.96); }
.v-sound .pill { position: absolute; left: 50%; top: 12px; translate: -50% 0; z-index: 4; min-height: 32px; padding: 0 14px; border: 0; border-radius: 999px; background: rgba(0,0,0,.7); color: #fff; font-size: 14px; font-weight: 700; backdrop-filter: blur(4px); }
.v-sound .pill[hidden] { display: none; }
.v-sound .reel { margin: 4px 0 0; font-size: 15px; line-height: 1.3; text-wrap: balance; }
.v-sound .noaudio { font-size: 14px; margin: 0 0 8px; color: var(--story); }
@media (prefers-reduced-motion: reduce) { .v-sound .viz.on.sim i { animation: none; height: 14px; } }
`;

/* ---------- the screen ---------- */
export default {
  slug: 'sound', title: 'Swipe. Listen. Stay.', short: 'Sound pick', channel: 'instagram',
  blurb: 'Four photo places. The sound changes as you swipe. Stay in the one you don’t want to leave.',
  mount(ctx) {
    const { el, root } = ctx;
    ctx.style(CSS);
    root.classList.add('v-sound');

    const AC = window.AudioContext || window.webkitAudioContext;
    let ac = null, analyser = null, master = null, audioBroken = !AC, unlocked = false, done = false;
    let current = null;     // { place, synth, viz, timer, raf }
    let slideIdx = 0;
    const bins = [2, 3, 5, 7, 10, 14, 19];
    const data = new Uint8Array(64);
    const vizzes = [];

    const ensureAudio = () => {
      if (audioBroken) return null;
      if (!ac) {
        try {
          ac = new AC(); master = ac.createGain(); master.gain.value = 0.85;
          analyser = ac.createAnalyser(); analyser.fftSize = 128; analyser.smoothingTimeConstant = 0.75;
          master.connect(analyser); analyser.connect(ac.destination);
        } catch (e) { console.warn('Sound pick: no audio', e); audioBroken = true; ac = null; return null; }
      }
      if (ac.state === 'suspended') ac.resume().catch(() => {});
      return ac;
    };

    const stopCurrent = () => {
      if (!current) return;
      const c = current; current = null;
      try { c.synth && c.synth.stop(); } catch (e) { /* ignore */ }
      clearTimeout(c.timer); cancelAnimationFrame(c.raf);
      c.viz.classList.remove('on', 'sim');
      for (const b of c.viz.children) b.style.height = '';
    };

    const startSynth = (place) => {
      const a = ensureAudio();
      if (!a) return null;
      try { const s = place.make(); s.start(a, master, LOOP); return s; }
      catch (e) { console.warn('Sound pick: synth failed', e); return null; }
    };

    const play = (i) => {          // i = index into PLACES
      const place = PLACES[i];
      if (current && current.place === place) return;
      stopCurrent();
      if (done) return;
      const viz = vizzes[i];
      const c = { place, synth: startSynth(place), viz, timer: 0, raf: 0 };
      current = c;
      viz.classList.add('on');
      if (!c.synth) { viz.classList.add('sim'); if (audioBroken) noteNoAudio(); }
      // loop: start a fresh pass just before this one runs out
      const again = () => {
        if (current !== c) return;
        try { c.synth && c.synth.stop(); } catch (e) { /* ignore */ }
        c.synth = startSynth(place);
        c.timer = setTimeout(again, (LOOP - FADE) * 1000);
      };
      c.timer = setTimeout(again, (LOOP - FADE) * 1000);
      let quietFrames = 0;
      const frame = () => {
        if (current !== c) return;
        if (c.synth && analyser) {
          analyser.getByteFrequencyData(data);
          let sum = 0; for (const k of bins) sum += data[k];
          if (sum === 0) { if (++quietFrames > 30) viz.classList.add('sim'); }
          else {
            quietFrames = 0; viz.classList.remove('sim');
            [...viz.children].forEach((b, k) => { b.style.height = (3 + (data[bins[k]] / 255) * 20) + 'px'; });
          }
        }
        c.raf = requestAnimationFrame(frame);
      };
      c.raf = requestAnimationFrame(frame);
    };

    // The sound follows the slide: slide 0 is the hook (silence), slides 1-4 are the places.
    const follow = () => {
      if (done || !unlocked) return;
      if (slideIdx >= 1 && slideIdx <= PLACES.length) play(slideIdx - 1);
      else stopCurrent();
    };
    const onSlide = (i) => { if (i === slideIdx) return; slideIdx = i; follow(); };

    const unlock = () => {
      if (unlocked || done) return;
      unlocked = true; pill.hidden = true;
      ensureAudio();
      follow();
    };

    let noAudioNote = null;
    const noteNoAudio = () => {
      if (noAudioNote) return;
      noAudioNote = el('p', { class: 'noaudio', text: 'No sound on this device, so imagine each place. Picking still works.' });
      post.before(noAudioNote);
    };

    const stopAll = () => { stopCurrent(); };
    const stay = (place) => {
      done = true; stopAll();
      ctx.finish({ weights: { ...place.weights }, why: place.why });
    };

    const vizFor = (place) => {
      const bars = Array.from({ length: 7 }, (_, k) => el('i', { style: `--d:${(k * 0.11 % 0.6).toFixed(2)}s;--h:${8 + ((k * 5) % 4) * 5}px` }));
      const v = el('div', { class: 'viz', style: `--c:${place.colour}`, 'aria-hidden': 'true' }, bars);
      vizzes.push(v);
      return v;
    };

    const hook = el('div', { class: 'hook' },
      el('div', { class: 'ico', 'aria-hidden': 'true', text: '🔊' }),
      el('b', { text: 'Turn your sound on' }),
      el('span', { text: 'Swipe through four places' }),
      el('div', { class: 'go', text: 'Swipe ›' }));

    const slides = [
      { node: hook, cls: 'hook-slide', onPick: () => { unlock(); post.go(1); } },
      ...PLACES.map((p, i) => ({ key: p.key, title: p.name, sub: p.desc, n: i + 1, cls: 'place-' + p.id })),
    ];
    const post = ctx.carousel(slides, { label: 'Four places with sound', onSlide, likes: '2,184 likes',
      caption: 'Sound on 🔊 Swipe, listen, and stay in the one you don’t want to leave.' });

    // overlays on each place slide: live visualiser (top-right) and Stay here (bottom-right)
    const slideEls = post.track.querySelectorAll('.ig-slide');
    PLACES.forEach((p, i) => {
      const s = slideEls[i + 1];
      s.append(vizFor(p), el('button', { class: 'stayhere', type: 'button', text: 'Stay here', 'aria-label': `Stay here: ${p.name}`,
        onClick: (e) => { e.stopPropagation(); unlock(); stay(p); } }));
    });
    const pill = el('button', { class: 'pill', type: 'button', text: 'Tap for sound 🔊', onClick: (e) => { e.stopPropagation(); unlock(); } });
    post.querySelector('.ig-carousel').append(pill);
    // any tap on the carousel unlocks audio (browsers need a gesture)
    post.querySelector('.ig-carousel').addEventListener('pointerdown', unlock);
    post.querySelector('.ig-carousel').addEventListener('click', unlock);

    root.append(
      el('h2', { class: 'q', text: 'Swipe. Listen. Stay.' }),
      el('p', { class: 'muted sub', text: 'Four places. The sound changes as you swipe. Stay in the one you don’t want to leave.' }),
      post,
      el('p', { class: 'muted reel', text: 'Reel version: four clips, sound on, comment the one you’d stay in.' }),
    );
    if (audioBroken) noteNoAudio();

    // Leaving the screen (result, restart, back) must not leave a sound running.
    const mo = new MutationObserver(() => { if (!post.isConnected) { done = true; stopAll(); mo.disconnect(); } });
    mo.observe(root, { childList: true });
    window.addEventListener('pagehide', () => { done = true; stopAll(); }, { once: true });

    // Test hooks.
    window.__soundPick = {
      places: PLACES.map(p => p.name),
      current: () => (current ? current.place.id : null),
      unlocked: () => unlocked,
      async render(i, seconds = 2) {
        const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        const sr = 44100, oc = new OAC(1, Math.floor(sr * seconds), sr);
        PLACES[i].make().start(oc, oc.destination, seconds);
        const buf = await oc.startRendering(); const d = buf.getChannelData(0);
        let peak = 0, sum = 0; for (let k = 0; k < d.length; k++) { const a = Math.abs(d[k]); if (a > peak) peak = a; sum += a * a; }
        return { name: PLACES[i].name, peak: +peak.toFixed(3), rms: +Math.sqrt(sum / d.length).toFixed(4) };
      },
    };
  },
};
