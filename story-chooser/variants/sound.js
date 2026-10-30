// Variant 16 · Sound pick (Instagram). Four ten-second places, synthesised with the Web Audio API.
// No audio files, no network. The AudioContext is created on the first tap; one sound plays at a time,
// fades in/out over 300 ms and stops itself after ten seconds. Picking works even with no audio at all.

const DUR = 10;      // seconds per place
const FADE = 0.3;    // seconds, in and out

/* ---------- the four places ---------- */
const PLACES = [
  {
    id: 'rain', name: 'Rain on cobblestones', desc: 'Steady on the stones, a drip somewhere close.',
    colour: 'var(--accent)', make: rain,
    weights: { eerie: 2, downtown: 2, night: 1, calm: 1, mystery: 1 },
    why: 'You stayed in the rain on the cobblestones, so your story starts on a wet street at night.',
  },
  {
    id: 'tavern', name: 'A tavern after midnight', desc: 'Low voices, a glass set down, the fire nearly out.',
    colour: 'var(--story)', make: tavern,
    weights: { cozy: 2, funny: 2, friends: 1, history: 1, fantasy: 1 },
    why: 'You stayed in the tavern after midnight, so your story starts with friends, a fire and a bad idea.',
  },
  {
    id: 'clocks', name: 'A room full of clocks', desc: 'A hundred ticks that never quite agree.',
    colour: 'var(--hunt)', make: clocks,
    weights: { mysterious: 2, thoughtful: 2, scifi: 1, solo: 1, quick: 1 },
    why: 'You stayed in the room full of clocks, so your story starts with a puzzle and no time to waste.',
  },
  {
    id: 'forest', name: 'A forest at night', desc: 'Wind in the tops, crickets below, something calling.',
    colour: 'var(--gem)', make: forest,
    weights: { fantasy: 2, park: 2, calm: 1, tender: 1, night: 1 },
    why: 'You stayed in the forest at night, so your story starts off the path, under the trees.',
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
.v-sound .sub { margin: -4px 0 16px; font-size: 17px; line-height: 1.25; }
.v-sound .snd { --c: var(--accent); position: relative; background: var(--raised); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 14px 12px; margin-bottom: 12px; transition: border-color .3s, box-shadow .3s; }
.v-sound .snd.playing { border-color: color-mix(in srgb, var(--c) 70%, transparent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 18%, transparent), 0 10px 30px -14px var(--c); }
.v-sound .head { display: flex; align-items: center; gap: 12px; }
.v-sound .play { position: relative; flex: none; width: 60px; height: 60px; border-radius: 50%; border: 0; padding: 0; background: color-mix(in srgb, var(--c) 18%, var(--raised-2)); color: var(--c); display: grid; place-items: center; }
.v-sound .play:active { transform: scale(.96); }
.v-sound .play svg.ring { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); pointer-events: none; }
.v-sound .play svg.ring circle { fill: none; stroke-width: 3; }
.v-sound .play svg.ring .track { stroke: rgba(255,255,255,.08); }
.v-sound .play svg.ring .left { stroke: var(--c); stroke-linecap: round; stroke-dasharray: 169.6; stroke-dashoffset: 169.6; opacity: 0; }
.v-sound .snd.playing .play svg.ring .left { opacity: 1; }
.v-sound .play svg.ico { width: 22px; height: 22px; fill: currentColor; position: relative; }
.v-sound .play svg.ico .pause { display: none; }
.v-sound .snd.playing .play svg.ico .go { display: none; }
.v-sound .snd.playing .play svg.ico .pause { display: block; }
.v-sound .t { min-width: 0; flex: 1; }
.v-sound .t b { display: block; font-size: 22px; font-weight: 800; line-height: 1.05; text-wrap: balance; }
.v-sound .t span { display: block; color: var(--muted); font-size: 15px; line-height: 1.2; margin-top: 3px; text-wrap: pretty; }
.v-sound .t .heard { display: none; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--c); margin-top: 5px; }
.v-sound .snd.heard .t .heard { display: block; }
.v-sound .foot { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.v-sound .bars { flex: 1; height: 48px; display: flex; align-items: center; gap: 4px; min-width: 0; }
.v-sound .bars i { flex: 1; height: 4px; min-height: 4px; border-radius: 3px; background: color-mix(in srgb, var(--c) 55%, var(--raised-2)); transition: height .08s linear; }
.v-sound .snd.playing .bars i { background: var(--c); }
.v-sound .snd.playing .bars.sim i { animation: v-sound-bob 1s ease-in-out infinite alternate; animation-delay: var(--d); }
@keyframes v-sound-bob { from { height: 6px; } to { height: var(--h); } }
.v-sound .stay { flex: none; min-height: 44px; padding: 0 16px; font-size: 17px; }
.v-sound .snd.heard .stay { background: var(--c); color: #120a2a; }
.v-sound .reel { margin: 18px 0 0; font-size: 15px; line-height: 1.3; }
.v-sound .noaudio { font-size: 14px; margin: -2px 0 14px; color: var(--story); }
@media (prefers-reduced-motion: reduce) { .v-sound .snd.playing .bars.sim i { animation: none; height: 18px; } }
`;

/* ---------- the screen ---------- */
export default {
  slug: 'sound', title: 'Close your eyes. Pick a sound.', short: 'Sound pick', channel: 'instagram',
  blurb: 'Four ten-second sounds. Pick the one you want to stay in.',
  mount(ctx) {
    const { el, root } = ctx;
    ctx.style(CSS);
    root.classList.add('v-sound');

    const AC = window.AudioContext || window.webkitAudioContext;
    let ac = null, analyser = null, master = null, audioBroken = !AC;
    let current = null;     // { place, synth, tile, startedAt, timer, raf }
    const heard = new Set();
    const bins = [1, 2, 3, 4, 6, 8, 11, 15, 20, 27];
    const data = new Uint8Array(64);
    const RING = 169.6;

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
      c.tile.classList.remove('playing'); c.tile.bars.classList.remove('sim');
      c.tile.play.setAttribute('aria-label', `Play ${c.place.name}`); c.tile.play.setAttribute('aria-pressed', 'false');
      c.tile.left.style.strokeDashoffset = RING;
      for (const b of c.tile.barEls) b.style.height = '';
    };

    const markHeard = (place, tile) => { if (heard.has(place.id)) return; heard.add(place.id); tile.classList.add('heard'); };

    const play = (place, tile) => {
      if (current && current.place === place) { markHeard(place, tile); stopCurrent(); return; }
      stopCurrent();
      const a = ensureAudio();
      let synth = null;
      if (a) {
        try { synth = place.make(); synth.start(a, master, DUR); }
        catch (e) { console.warn('Sound pick: synth failed', e); synth = null; }
      }
      if (!synth) { tile.bars.classList.add('sim'); if (!a) noteNoAudio(); }
      const c = { place, synth, tile, startedAt: performance.now(), timer: 0, raf: 0 };
      current = c;
      tile.classList.add('playing'); tile.play.setAttribute('aria-label', `Stop ${place.name}`); tile.play.setAttribute('aria-pressed', 'true');
      c.timer = setTimeout(() => { if (current === c) { markHeard(place, tile); stopCurrent(); } }, DUR * 1000);
      let quietFrames = 0;
      const frame = () => {
        if (current !== c) return;
        const t = (performance.now() - c.startedAt) / 1000;
        tile.left.style.strokeDashoffset = RING * (1 - Math.min(1, t / DUR));
        if (t > 2.5) markHeard(place, tile);
        if (synth && analyser) {
          analyser.getByteFrequencyData(data);
          let sum = 0; for (const i of bins) sum += data[i];
          if (sum === 0) { if (++quietFrames > 30 && !tile.bars.classList.contains('sim')) tile.bars.classList.add('sim'); }
          else {
            quietFrames = 0; tile.bars.classList.remove('sim');
            tile.barEls.forEach((b, k) => { b.style.height = (4 + (data[bins[k]] / 255) * 44) + 'px'; });
          }
        }
        c.raf = requestAnimationFrame(frame);
      };
      c.raf = requestAnimationFrame(frame);
    };

    let noAudioNote = null;
    const noteNoAudio = () => {
      if (noAudioNote) return;
      noAudioNote = el('p', { class: 'noaudio', text: 'No sound on this device, so imagine each place. Picking still works.' });
      list.before(noAudioNote);
    };

    const stay = (place, tile) => {
      markHeard(place, tile); stopCurrent();
      ctx.finish({ weights: { ...place.weights }, why: place.why });
    };

    const icon = () => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.classList.add('ico');
      s.innerHTML = '<path class="go" d="M8 5.5v13c0 .8.9 1.3 1.6.9l10-6.5c.6-.4.6-1.4 0-1.8l-10-6.5C8.9 4.2 8 4.7 8 5.5z"/><rect class="pause" x="6" y="6" width="12" height="12" rx="2"/>';
      return s;
    };
    const ring = () => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 60 60'); s.setAttribute('aria-hidden', 'true'); s.classList.add('ring');
      s.innerHTML = '<circle class="track" cx="30" cy="30" r="27"/><circle class="left" cx="30" cy="30" r="27"/>';
      return s;
    };

    const tileFor = (place) => {
      const barEls = Array.from({ length: 10 }, (_, i) => el('i', { style: `--d:${(i * 0.09 % 0.6).toFixed(2)}s;--h:${14 + ((i * 7) % 5) * 7}px` }));
      const bars = el('div', { class: 'bars', 'aria-hidden': 'true' }, barEls);
      const playBtn = el('button', { class: 'play', type: 'button', 'aria-label': `Play ${place.name}`, 'aria-pressed': 'false' }, ring(), icon());
      const tile = el('article', { class: 'snd', style: `--c:${place.colour}` },
        el('div', { class: 'head' }, playBtn,
          el('div', { class: 't' }, el('b', { text: place.name }), el('span', { text: place.desc }), el('span', { class: 'heard', text: 'You’ve been here' }))),
        el('div', { class: 'foot' }, bars,
          el('button', { class: 'btn ghost stay', type: 'button', text: 'Stay here', 'aria-label': `Stay here: ${place.name}`, onClick: () => stay(place, tile) })));
      tile.bars = bars; tile.barEls = barEls; tile.play = playBtn; tile.left = tile.querySelector('.left');
      playBtn.addEventListener('click', () => play(place, tile));
      return tile;
    };

    const list = el('div', { class: 'list' }, PLACES.map(tileFor));
    root.append(
      el('h2', { class: 'q', text: 'Close your eyes. Pick a sound.' }),
      el('p', { class: 'muted sub', text: 'Four places, ten seconds each. Stay in the one you don’t want to leave.' }),
      list,
      el('p', { class: 'muted reel', text: 'Reel version: four ten-second clips with sound on; comment the one you’d stay in.' }),
    );
    if (audioBroken) noteNoAudio();

    // Leaving the screen (result, restart, back) must not leave a sound running.
    const mo = new MutationObserver(() => { if (!list.isConnected) { stopCurrent(); mo.disconnect(); } });
    mo.observe(root, { childList: true });
    window.addEventListener('pagehide', stopCurrent, { once: true });

    // Test hook: render a place offline and report its peak amplitude (no speakers needed).
    window.__soundPick = {
      places: PLACES.map(p => p.name),
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
