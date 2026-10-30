// Story City website — "Play the first chapter right here".
// A playable taste of The Summons inside a phone frame: chat with Wren, a Walk-mode map moment,
// a colour-match decrypt, a location gem and the app call to action.
// Mounts into every [data-module="demo"]. No libraries. Progress is kept in localStorage (try/catch).

const KEY = 'sc-demo-summons-v1';
const SOUND_KEY = 'sc-demo-sound';
const GOAL = 30;
const CANCEL = Symbol('cancel');
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const COARSE = matchMedia('(pointer: coarse)');
const SPARK = 'M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z';

// Load the module's stylesheet once, next to this file, unless the page already links it.
(function loadCSS() {
  if (document.querySelector('link[href*="demo.css"]')) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = new URL('../css/demo.css', import.meta.url).href;
  document.head.append(l);
})();

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
};

const fresh = () => ({ stage: 'intro', mark: 0, log: [], named: false, steps: 0, solved: [], gem: null });

/* ---------- small art ---------- */
const ICON = {
  walk: '<path d="M8.5 3.5c1.6 0 2.4 1.9 2.4 4.2s-1 4.3-2.4 4.3-2.4-2-2.4-4.3.8-4.2 2.4-4.2zM6.6 15.5h3.8M15.5 8c1.6 0 2.4 1.9 2.4 4.2s-1 4.3-2.4 4.3-2.4-2-2.4-4.3.8-4.2 2.4-4.2zM13.6 20h3.8"/>',
  path: '<path d="M12 21s-6-5.4-6-10.5a6 6 0 0 1 12 0C18 15.6 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
  hunt: '<path d="M4 8.5V5.5A1.5 1.5 0 0 1 5.5 4h3M15.5 4h3A1.5 1.5 0 0 1 20 5.5v3M20 15.5v3a1.5 1.5 0 0 1-1.5 1.5h-3M8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3"/><circle cx="12" cy="12" r="3"/>',
  soundOn: '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6M18.2 6.6a7.8 7.8 0 0 1 0 10.8"/>',
  soundOff: '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  restart: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v3.8h3.8"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  get: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5.5 20h13"/>',
};
const icon = (n, cls = '') => `<svg class="demo-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const sparkSVG = (cls = '') => `<svg class="demo-spark ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${SPARK}"/></svg>`;
// Wren's avatar: the Society's hoodie symbol
const AVATAR = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 8.5L31 29H9z"/><circle cx="20" cy="22.2" r="4"/><circle class="demo-av-eye" cx="20" cy="22.2" r="1.5"/></svg>';

const GEMS = [
  { id: 'nature', name: 'Nature', shape: 'leaf', c: '--emerald',
    d: 'M12 2.5c5 3.2 7.5 7.6 6.6 12.2-.7 3.6-3.3 6-6.6 6.8-3.3-.8-5.9-3.2-6.6-6.8C4.5 10.1 7 5.7 12 2.5z', f: 'M12 6.5v14' },
  { id: 'art', name: 'Art', shape: 'pebble', c: '--turquoise',
    d: 'M6.5 7.5c2.6-3.2 8.3-3.6 11.2-.6 2.7 2.8 2.4 7.9-.6 10.6-3 2.7-8.6 2.8-11.2-.3-2.3-2.7-1.8-6.9.6-9.7z', f: 'M8.8 9.6c1-1 2.6-1.4 4-1.1' },
  { id: 'land', name: 'Landmarks', shape: 'shard', c: '--amber',
    d: 'M11 2l6.5 6.5L15 21.5 7.5 19 5 8.5z', f: 'M11 2l-1 9 5 10.5M10 11l7.5-2.5M10 11L5 8.5' },
  { id: 'eat', name: 'Eat & Shop', shape: 'wide cut', c: '--ruby',
    d: 'M2.5 9L7 4h10l4.5 5L12 20.5z', f: 'M2.5 9h19M7 4l2.5 5L12 20.5 14.5 9 17 4' },
  { id: 'cur', name: 'Curiosities', shape: 'cluster', c: '--amethyst',
    d: 'M6.5 21l-2.5-8 2.5-5 2.5 5zM12 21l-2.6-11L12 3l2.6 7zM17.5 21L15 14l2.5-4 2.5 4z', f: 'M6.5 8v13M12 3v18M17.5 10v11' },
];
const gemSVG = (g, cls = '') => `<svg class="demo-gem ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${g.d}" style="fill:var(${g.c})"/><path class="demo-gem-f" d="${g.f}"/></svg>`;

// Decrypt puzzle: three colours hidden in the letter, one per band of tiles.
const TARGETS = [
  { c: '--citrine', name: 'Citrine', what: 'the star', x: 76, y: 15, rows: [0, 1, 2] },
  { c: '--turquoise', name: 'Turquoise', what: 'the ink', x: 30, y: 56, rows: [3, 4, 5] },
  { c: '--ruby', name: 'Ruby', what: 'the seal', x: 72, y: 84, rows: [6, 7] },
];
const PALETTE = [
  { c: '--amber', name: 'Amber' }, { c: '--turquoise', name: 'Turquoise' }, { c: '--rhodolite', name: 'Rhodolite' },
  { c: '--citrine', name: 'Citrine' }, { c: '--emerald', name: 'Emerald' }, { c: '--ruby', name: 'Ruby' },
];
const COLS = 6, ROWS = 8;

const RAIL = [
  { id: 'chat', t: 'Stories told in chat', d: 'Characters message you, like a friend texting. This one is Wren.' },
  { id: 'choice', t: 'Your replies are choices', d: 'Tap a reply. What you choose changes what happens next.' },
  { id: 'walk', t: 'Walk mode', d: 'This is Walk mode — steps unlock the next chapter. The ring shrinks as you go. Path and Hunt sit right beside it.' },
  { id: 'decrypt', t: 'Puzzles in the story', d: 'Some puzzles hide a message under colours. Tap the matching colour to clear the letter. Puzzles never need steps.' },
  { id: 'gem', t: 'Location gems', d: 'Save the spots you love. Five types, each with its own shape and colour.' },
  { id: 'end', t: 'What happens next', d: 'The full story keeps going, out on your own streets.' },
];

/* ---------- colour helpers (values come from tokens.css) ---------- */
const tok = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#A493D6';
const hex2rgb = (h) => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((x) => x + x).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mix = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
function seeded(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

/* ---------- sound: tiny WebAudio blips, off by default ---------- */
const sound = {
  on: false, ac: null,
  ensure() { if (!this.ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) this.ac = new A(); } if (this.ac && this.ac.state === 'suspended') this.ac.resume(); },
  tone(f, d = 0.08, type = 'sine', vol = 0.05, when = 0) {
    if (!this.on || !this.ac) return;
    try {
      const t = this.ac.currentTime + when, o = this.ac.createOscillator(), g = this.ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(this.ac.destination); o.start(t); o.stop(t + d + 0.03);
    } catch (e) { /* ignore */ }
  },
  msg() { this.tone(988, 0.09, 'sine', 0.045); this.tone(1319, 0.08, 'sine', 0.03, 0.07); },
  send() { this.tone(660, 0.06, 'triangle', 0.035); },
  step(n) { this.tone(196 + n * 7, 0.05, 'triangle', 0.03); },
  good() { [659, 784].forEach((f, i) => this.tone(f, 0.12, 'sine', 0.045, i * 0.07)); },
  bad() { this.tone(180, 0.16, 'triangle', 0.04); },
  win() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.22, 'sine', 0.05, i * 0.09)); },
};

function buzz(ms = 8) { if (!COARSE.matches || (navigator.userActivation && !navigator.userActivation.hasBeenActive)) return; try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* ignore */ } }

/* ---------- markup ---------- */
function letterArt() {
  return `<svg class="demo-letter-art" viewBox="0 0 240 320" aria-hidden="true">
    <rect width="240" height="320" rx="8" class="demo-l-paper"/>
    <rect x="10" y="10" width="220" height="300" rx="4" class="demo-l-edge"/>
    <path class="demo-l-star" transform="translate(160 26) scale(2)" d="${SPARK}"/>
    <text x="26" y="104" class="demo-l-h">To the one Wren found,</text>
    <text x="26" y="148" class="demo-l-t">There is a door</text>
    <text x="26" y="170" class="demo-l-t">under this city.</text>
    <path class="demo-l-ink" d="M26 182c20-6 40 6 60 0s40-6 60 0 30 4 44 0"/>
    <text x="26" y="212" class="demo-l-t">It opens for the</text>
    <text x="26" y="234" class="demo-l-t">number on the seal.</text>
    <circle cx="172" cy="274" r="30" class="demo-l-seal"/>
    <circle cx="172" cy="274" r="23" class="demo-l-ring"/>
    <text x="172" y="278.5" text-anchor="middle" class="demo-l-code">786666</text>
  </svg>`;
}
function tilesHTML(solved = []) {
  const rnd = seeded(7);
  const bases = ['--velvet', '--midnight', '--line'].map(tok);
  let h = '';
  for (let r = 0; r < ROWS; r++) {
    const ti = TARGETS.findIndex((t) => t.rows.includes(r));
    const target = tok(TARGETS[ti].c);
    for (let c = 0; c < COLS; c++) {
      const base = bases[Math.floor(rnd() * bases.length)];
      const col = mix(base, target, 0.3 + rnd() * 0.6);
      h += `<i data-band="${ti}" class="${solved.includes(ti) ? 'gone' : ''}" style="background:${col};transition-delay:${Math.round(rnd() * 260)}ms"></i>`;
    }
  }
  return h;
}
function letterBlock(scrambled, solved = []) {
  return `<div class="demo-letter${scrambled ? '' : ' clear'}">${letterArt()}<div class="demo-tiles" aria-hidden="true">${scrambled ? tilesHTML(solved) : ''}</div></div>`;
}

function mapSVG() {
  // Drawn map: night blocks, velvet roads, a little park. Route walks up Quill St and along Lamplight Rd.
  return `<svg class="demo-mapsvg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="360" height="640" class="demo-m-bg"/>
    <g class="demo-m-bld">
      <rect x="72" y="100" width="76" height="56" rx="4"/><rect x="72" y="168" width="40" height="40" rx="4"/>
      <rect x="192" y="100" width="76" height="40" rx="4"/><rect x="72" y="252" width="76" height="60" rx="4"/>
      <rect x="72" y="326" width="48" height="62" rx="4"/><rect x="192" y="252" width="40" height="136" rx="4"/>
      <rect x="244" y="300" width="24" height="88" rx="4"/><rect x="312" y="100" width="60" height="108" rx="4"/>
      <rect x="312" y="252" width="60" height="70" rx="4"/><rect x="-10" y="252" width="38" height="136" rx="4"/>
      <rect x="72" y="432" width="76" height="70" rx="4"/><rect x="192" y="432" width="76" height="70" rx="4"/>
      <rect x="-10" y="100" width="38" height="108" rx="4"/><rect x="312" y="432" width="60" height="70" rx="4"/>
    </g>
    <rect x="192" y="152" width="76" height="56" rx="6" class="demo-m-park"/>
    <g class="demo-m-tree"><circle cx="208" cy="168" r="6"/><circle cx="226" cy="188" r="7"/><circle cx="250" cy="166" r="5"/><circle cx="254" cy="192" r="6"/></g>
    <g class="demo-m-road">
      <path d="M-10 80H370M-10 230H370M-10 410H370M50 -10V650M170 -10V650M290 -10V650"/>
    </g>
    <g class="demo-m-lane"><path d="M-10 80H370M-10 230H370M-10 410H370M50 -10V650M170 -10V650M290 -10V650"/></g>
    <text x="268" y="250" class="demo-m-label">Lamplight Rd</text>
    <text x="176" y="470" class="demo-m-label" transform="rotate(-90 176 470)">Quill St</text>
    <g data-ref="trail"></g>
    <g class="demo-m-dest" transform="translate(290 230)">
      <circle r="15" class="demo-m-dest-halo"/><circle r="7" class="demo-m-dest-dot"/>
    </g>
    <circle data-ref="ring" class="demo-m-ring" r="110" cx="170" cy="410"/>
    <g data-ref="me" transform="translate(170 410)"><circle r="16" class="demo-m-me-halo"/><circle r="7.5" class="demo-m-me"/></g>
  </svg>`;
}
const ROUTE = [[170, 410], [170, 230], [290, 230]];

function shell() {
  return `
  <div class="wrap demo-wrap">
    <header class="demo-head">
      <p class="eyebrow">Try a chapter</p>
      <h2 class="demo-title">Play the first chapter right here</h2>
      <p class="demo-lede">A two-minute taste of <em>The Summons</em>. Someone has found your number. Read, reply, walk a little, crack a letter.</p>
    </header>
    <div class="demo-stage">
      <div class="demo-phonecol">
        <div class="demo-phone" data-ref="phone">
          <div class="demo-screen" data-ref="screen">
            <div class="demo-status" aria-hidden="true"><span>9:41</span><i class="demo-island"></i><span class="demo-bat"><i></i></span></div>

            <div class="demo-view demo-intro" data-view="intro">
              <p class="demo-lock-time" aria-hidden="true">9:41</p>
              <p class="demo-lock-date" aria-hidden="true">A quiet evening</p>
              <div class="demo-notif">
                <span class="demo-av">${AVATAR}</span>
                <div><p class="demo-notif-top"><b>Unknown number</b><span>now</span></p>
                <p class="demo-notif-msg">Hello? Is this thing on?</p></div>
              </div>
              <div class="demo-intro-foot">
                <button class="btn demo-start" data-act="start">Start Story</button>
                <p class="demo-intro-note">About 2 minutes. No sign-up.</p>
              </div>
            </div>

            <div class="demo-view demo-chat" data-view="chat" hidden>
              <div class="demo-chathead">
                <span class="demo-av">${AVATAR}</span>
                <div><p class="demo-who" data-ref="who">Unknown number</p><p class="demo-sub" data-ref="sub">The Summons</p></div>
              </div>
              <div class="demo-log" data-ref="log" role="log" aria-live="polite" aria-label="Messages" tabindex="0"></div>
              <div class="demo-dock" data-ref="dock"></div>
            </div>

            <div class="demo-view demo-map" data-view="map" hidden>
              ${mapSVG()}
              <div class="demo-maptop">
                <div class="demo-modes" role="group" aria-label="Map mode">
                  <button class="demo-mode" data-mode="walk" aria-pressed="true">${icon('walk')}Walk</button>
                  <button class="demo-mode" data-mode="path" aria-pressed="false">${icon('path')}Path</button>
                  <button class="demo-mode" data-mode="hunt" aria-pressed="false">${icon('hunt')}Hunt</button>
                </div>
                <p class="demo-goal"><i class="demo-goal-dot"></i>Walk ${GOAL} steps</p>
              </div>
              <div class="demo-mappanel">
                <p class="demo-count"><b data-ref="count">0</b> <span>/ ${GOAL} steps</span></p>
                <div class="demo-bar" aria-hidden="true"><i data-ref="bar"></i></div>
                <button class="btn demo-hold" data-ref="hold" aria-describedby="demo-hint">${icon('walk')}Hold to Walk</button>
                <button class="btn txt demo-motion" data-ref="motion" hidden>Use My Phone's Steps</button>
                <p class="demo-hint" id="demo-hint" data-ref="hint">Or press and hold an arrow key.</p>
              </div>
            </div>

            <div class="demo-view demo-puzzle" data-view="puzzle" hidden>
              <div class="demo-ptop">
                <p class="eyebrow">Decrypt</p>
                <h3 class="demo-ptitle">Unscramble the letter</h3>
                <p class="demo-pmsg" data-ref="pmsg" aria-live="polite"></p>
              </div>
              <div class="demo-pletter" data-ref="pletter"></div>
              <div class="demo-palette" data-ref="palette" role="group" aria-label="Pick a matching colour"></div>
              <div class="demo-pfoot" data-ref="pfoot"></div>
            </div>

            <div class="demo-unlock" data-ref="unlock" hidden>
              <div class="demo-burst" aria-hidden="true">${sparkSVG('big')}${Array.from({ length: 8 }, (_, i) => `<span style="--a:${i * 45}deg">${sparkSVG('mini')}</span>`).join('')}</div>
              <p class="eyebrow">Chapter 2 unlocked</p>
              <h3 class="demo-unlock-title">The letter</h3>
              <p class="demo-unlock-text">${GOAL} steps. The signal is clear now.</p>
              <button class="btn" data-act="continue">Continue</button>
            </div>

            <div class="demo-sheet" data-ref="sheet" role="dialog" aria-labelledby="demo-sheet-title" hidden>
              <span class="demo-grab" aria-hidden="true"></span>
              <p class="eyebrow">Location gem</p>
              <h3 id="demo-sheet-title" class="demo-sheet-title">Save this spot as your first location gem</h3>
              <div class="demo-gems" role="radiogroup" aria-label="Gem type">
                ${GEMS.map((g) => `<button class="demo-gempick" role="radio" aria-checked="false" data-gem="${g.id}">${gemSVG(g)}<b>${g.name}</b><span>${g.shape}</span></button>`).join('')}
              </div>
              <button class="btn demo-savegem" data-act="savegem" disabled>Save Gem</button>
            </div>

            <div class="demo-toast" data-ref="toast" role="status" hidden></div>
          </div>
        </div>
        <div class="demo-tools">
          <button class="demo-tool" data-act="sound" aria-pressed="false">${icon('soundOff')}<span>Sound Off</span></button>
          <button class="demo-tool" data-act="restart">${icon('restart')}<span>Start Over</span></button>
        </div>
      </div>
      <aside class="demo-rail" aria-label="What's happening">
        <p class="eyebrow">What's happening</p>
        <ol class="demo-rail-list">
          ${RAIL.map((r, i) => `<li data-rail="${r.id}"><span class="demo-rail-n" aria-hidden="true"><b>${i + 1}</b>${icon('check')}</span><div><p class="demo-rail-t">${r.t}</p><p class="demo-rail-d">${r.d}</p></div></li>`).join('')}
        </ol>
        <p class="demo-rail-idle" data-ref="idle">Tap Start Story. Notes on each part of the game show up here as you play.</p>
      </aside>
    </div>
  </div>`;
}

/* ---------- the module ---------- */
function mount(root) {
  if (root.dataset.demoMounted) return;
  root.dataset.demoMounted = '1';
  root.classList.add('demo');
  if (!root.getAttribute('aria-labelledby')) root.setAttribute('aria-label', 'Play the first chapter of The Summons');
  root.innerHTML = shell();

  const $ = (s) => root.querySelector(s);
  const ref = (n) => root.querySelector(`[data-ref="${n}"]`);
  const R = { screen: ref('screen'), phone: ref('phone'), log: ref('log'), dock: ref('dock'), who: ref('who'), sub: ref('sub'),
    count: ref('count'), bar: ref('bar'), hold: ref('hold'), motion: ref('motion'), hint: ref('hint'), trail: ref('trail'),
    ring: ref('ring'), me: ref('me'), unlock: ref('unlock'), sheet: ref('sheet'), toast: ref('toast'),
    pmsg: ref('pmsg'), pletter: ref('pletter'), palette: ref('palette'), pfoot: ref('pfoot'), idle: ref('idle') };

  let S = Object.assign(fresh(), store.get(KEY) || {});
  let epoch = 0;
  let view = 'intro';
  let inView = false;
  const save = () => store.set(KEY, S);
  let kbd = false; // last interaction inside the demo was the keyboard
  root.addEventListener('keydown', () => { kbd = true; });
  root.addEventListener('pointerdown', () => { kbd = false; });
  const focusInside = () => root.contains(document.activeElement) || (kbd && document.activeElement === document.body);
  const softFocus = (el) => { if (el && focusInside()) try { el.focus({ preventScroll: true }); } catch (e) { /* ignore */ } };

  // Cancellable waits: Start Over bumps the epoch and every pending wait quietly stops.
  const sleep = (ms) => { const e = epoch; return new Promise((res, rej) => setTimeout(() => (e === epoch ? res() : rej(CANCEL)), ms)); };
  const guard = (p) => { const e = epoch; return p.then((v) => { if (e !== epoch) throw CANCEL; return v; }); };

  /* --- sound toggle --- */
  const soundBtn = $('[data-act="sound"]');
  function setSound(on) {
    sound.on = on;
    if (on) sound.ensure();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.innerHTML = `${icon(on ? 'soundOn' : 'soundOff')}<span>${on ? 'Sound On' : 'Sound Off'}</span>`;
    store.set(SOUND_KEY, on);
  }
  // Remembered preference applies only after a gesture (browsers block audio before one).
  if (store.get(SOUND_KEY) === true) { soundBtn.setAttribute('aria-pressed', 'true'); soundBtn.innerHTML = `${icon('soundOn')}<span>Sound On</span>`; }
  root.addEventListener('pointerdown', () => { if (soundBtn.getAttribute('aria-pressed') === 'true' && !sound.on) setSound(true); }, { once: true });

  /* --- micro motion --- */
  const nudge = (el = R.phone, px = 1.5) => { if (RM.matches || !el.animate) return; el.animate([{ transform: 'none' }, { transform: `translateY(${px}px)` }, { transform: 'none' }], { duration: 140, easing: 'ease-out' }); };

  /* --- caption rail --- */
  function setRail(id) {
    const idx = RAIL.findIndex((r) => r.id === id);
    root.querySelectorAll('[data-rail]').forEach((li, i) => {
      li.classList.toggle('on', i === idx);
      li.classList.toggle('done', idx > -1 && i < idx);
      if (i === idx) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    R.idle.hidden = idx > -1;
    root.querySelector('.demo-rail').classList.toggle('live', idx > -1);
  }

  /* --- views --- */
  async function show(name, flip = false) {
    if (view === name) return;
    const swap = () => { root.querySelectorAll('[data-view]').forEach((v) => { v.hidden = v.dataset.view !== name; }); view = name; };
    const scr = R.screen;
    if (flip && !RM.matches && scr.animate) {
      try {
        await scr.animate([{ transform: 'perspective(1400px) rotateY(0deg)' }, { transform: 'perspective(1400px) rotateY(90deg)' }], { duration: 230, easing: 'cubic-bezier(.5,0,.75,0)' }).finished;
        swap();
        await scr.animate([{ transform: 'perspective(1400px) rotateY(-90deg)' }, { transform: 'perspective(1400px) rotateY(0deg)' }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' }).finished;
      } catch (e) { swap(); }
    } else {
      swap();
      const v = root.querySelector(`[data-view="${name}"]`);
      if (!RM.matches && v.animate) v.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
    }
  }

  /* --- toast (closes on Esc, outside tap, or by itself) --- */
  let toastT = 0;
  function toast(text, ms = 3800) {
    R.toast.textContent = text; R.toast.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(hideToast, ms);
  }
  const hideToast = () => { R.toast.hidden = true; clearTimeout(toastT); };

  /* --- chat --- */
  const scrollLog = () => { R.log.scrollTo({ top: R.log.scrollHeight, behavior: RM.matches ? 'auto' : 'smooth' }); };
  function setName(named) {
    S.named = named;
    R.who.textContent = named ? 'Wren' : 'Unknown number';
  }
  function render(item, animate) {
    const row = document.createElement('div');
    row.className = `demo-row demo-${item.k === 'out' ? 'out' : 'in'}`;
    if (item.k === 'in' || item.k === 'out') {
      row.innerHTML = `<p class="demo-msg"></p>`;
      row.firstChild.textContent = item.text;
    } else if (item.k === 'letter') {
      row.innerHTML = `<div class="demo-msg demo-media" role="img" aria-label="A scrambled letter, hidden under coloured squares">${letterBlock(true)}</div>`;
    } else if (item.k === 'letterclear') {
      row.innerHTML = `<div class="demo-msg demo-media" role="img" aria-label="The letter reads: To the one Wren found. There is a door under this city. It opens for the number on the seal. The seal says 786666.">${letterBlock(false)}</div>`;
    } else if (item.k === 'gem') {
      const g = GEMS.find((x) => x.id === item.gem) || GEMS[0];
      row.className = 'demo-row demo-out';
      row.innerHTML = `<div class="demo-msg demo-gemcard">${gemSVG(g)}<div><b>My first location gem</b><span>${g.name} · ${g.shape}</span></div></div>`;
    } else if (item.k === 'cta') {
      row.className = 'demo-row demo-full';
      row.innerHTML = `<div class="demo-cta">
        ${sparkSVG('cta')}
        <p class="eyebrow">To be continued</p>
        <h3 class="demo-cta-title">Keep going in the app — every story free for 7 days</h3>
        <div class="demo-stores">
          <a class="btn sec demo-store" href="#get-app">${icon('get')}App Store</a>
          <a class="btn sec demo-store" href="#get-app">${icon('get')}Google Play</a>
        </div>
        <button class="btn txt demo-again" data-act="restart">Play Again</button>
      </div>`;
    }
    if (animate && !RM.matches) row.classList.add('pop');
    R.log.append(row);
    return row;
  }
  function add(item, animate = true) { S.log.push(item); save(); const r = render(item, animate); scrollLog(); return r; }
  const typingTime = (t) => (RM.matches ? 250 : Math.min(1700, 420 + t.length * 17));
  async function say(text) {
    R.sub.textContent = 'typing…';
    const dots = document.createElement('div');
    dots.className = 'demo-row demo-in demo-typing';
    dots.setAttribute('aria-hidden', 'true');
    dots.innerHTML = '<p class="demo-msg"><i></i><i></i><i></i></p>';
    R.log.append(dots); scrollLog();
    try { await sleep(typingTime(text)); } finally { dots.remove(); R.sub.textContent = 'The Summons'; }
    add({ k: 'in', text });
    sound.msg(); buzz(6); nudge(R.phone, 1);
    await sleep(RM.matches ? 120 : 360);
  }
  function choose(opts, { echo = true, primary = false } = {}) {
    return guard(new Promise((resolve) => {
      R.dock.innerHTML = '';
      R.dock.classList.add('open');
      opts.forEach((label, i) => {
        const b = document.createElement('button');
        b.className = primary ? 'btn demo-act' : 'demo-choice';
        b.textContent = label;
        if (!RM.matches) b.style.animationDelay = `${i * 70}ms`;
        b.addEventListener('click', () => {
          R.dock.innerHTML = ''; R.dock.classList.remove('open');
          if (echo) { add({ k: 'out', text: label }); sound.send(); }
          resolve(i);
        });
        R.dock.append(b);
      });
      softFocus(R.dock.querySelector('button'));
    }));
  }

  /* --- map: Walk mode --- */
  let walkResolve = null, holdTimer = 0, lastKey = 0;
  const routeLen = ROUTE.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - ROUTE[i - 1][0], p[1] - ROUTE[i - 1][1]) : 0), 0);
  function pointAt(d) {
    for (let i = 1; i < ROUTE.length; i++) {
      const a = ROUTE[i - 1], b = ROUTE[i], seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d <= seg) { const t = d / seg; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
      d -= seg;
    }
    return ROUTE[ROUTE.length - 1];
  }
  function drawWalk() {
    const t = Math.min(1, S.steps / GOAL);
    const c0 = tok('--walk-start'), c1 = tok('--walk-end');
    const want = Math.floor((routeLen * t) / 11);
    const have = R.trail.childElementCount;
    for (let i = have; i <= want; i++) {
      const p = pointAt(i * 11);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); dot.setAttribute('r', 3);
      dot.setAttribute('fill', mix(c0, c1, (i * 11) / routeLen));
      if (!RM.matches) dot.classList.add('pop');
      R.trail.append(dot);
    }
    const p = pointAt(routeLen * t);
    R.me.setAttribute('transform', `translate(${p[0]} ${p[1]})`);
    R.ring.setAttribute('cx', p[0]); R.ring.setAttribute('cy', p[1]);
    R.ring.setAttribute('r', Math.max(0, 110 * (1 - t)));
    R.ring.style.stroke = mix(c0, c1, t);
    R.ring.style.opacity = t >= 1 ? 0 : 1;
    R.count.textContent = Math.min(S.steps, GOAL);
    R.bar.style.width = `${t * 100}%`;
    R.bar.style.background = `linear-gradient(90deg, ${c0}, ${mix(c0, c1, t)})`;
  }
  function resetMap() { R.trail.innerHTML = ''; drawWalk(); }
  function step() {
    if (view !== 'map' || !walkResolve || S.steps >= GOAL) return;
    S.steps++; save(); drawWalk();
    sound.step(S.steps); buzz(5);
    if (!RM.matches && R.count.animate) R.count.animate([{ transform: 'scale(1.18)' }, { transform: 'none' }], { duration: 180, easing: 'ease-out' });
    nudge(R.phone, 1);
    if (S.steps % 10 === 0 && S.steps < GOAL) R.hint.textContent = `${S.steps} of ${GOAL} steps. ${GOAL - S.steps} to go.`;
    if (S.steps >= GOAL) { stopHold(); stopMotion(); const r = walkResolve; walkResolve = null; r(); }
  }
  function startHold(e) {
    if (e) { e.preventDefault(); try { R.hold.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } }
    if (holdTimer) return;
    R.hold.classList.add('pressing');
    step();
    holdTimer = setInterval(step, 240);
  }
  function stopHold() { clearInterval(holdTimer); holdTimer = 0; R.hold.classList.remove('pressing'); }
  R.hold.addEventListener('pointerdown', startHold);
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => R.hold.addEventListener(ev, stopHold));
  R.hold.addEventListener('contextmenu', (e) => e.preventDefault());
  R.hold.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); keyStep(); } });
  R.hold.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); });
  R.hold.addEventListener('click', (e) => { if (e.detail === 0) step(); }); // screen readers' activate
  function keyStep() { const now = performance.now(); if (now - lastKey < 150) return; lastKey = now; step(); }

  // Real steps on phones: offered, never required.
  let motionOn = false, motionSeen = false, smooth = 9.8, high = false, lastStep = 0, motionCheck = 0;
  function onMotion(e) {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null) return;
    motionSeen = true;
    smooth = smooth * 0.75 + Math.hypot(a.x, a.y, a.z) * 0.25;
    const now = performance.now();
    if (!high && smooth > 11.2 && now - lastStep > 330) { high = true; lastStep = now; step(); }
    else if (high && smooth < 10.3) high = false;
  }
  function stopMotion() {
    if (!motionOn) return;
    motionOn = false; window.removeEventListener('devicemotion', onMotion); clearTimeout(motionCheck);
    R.motion.textContent = "Use My Phone's Steps"; R.motion.setAttribute('aria-pressed', 'false');
  }
  async function startMotion() {
    if (motionOn) { stopMotion(); R.hint.textContent = 'Phone steps off. Hold the button instead.'; return; }
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== 'granted') { R.hint.textContent = 'No problem. Hold the button to walk instead.'; return; }
      }
      window.addEventListener('devicemotion', onMotion);
      motionOn = true; motionSeen = false;
      R.motion.textContent = 'Stop Phone Steps'; R.motion.setAttribute('aria-pressed', 'true');
      R.hint.textContent = 'Walking with your phone. Each real step counts.';
      motionCheck = setTimeout(() => { if (motionOn && !motionSeen) { stopMotion(); R.hint.textContent = "Your browser didn't share motion. Hold the button instead."; } }, 4000);
    } catch (err) { R.hint.textContent = 'Phone steps are not available here. Hold the button instead.'; }
  }
  R.motion.addEventListener('click', startMotion);
  if (typeof DeviceMotionEvent !== 'undefined' && COARSE.matches) { R.motion.hidden = false; R.motion.setAttribute('aria-pressed', 'false'); }

  root.querySelectorAll('.demo-mode').forEach((b) => b.addEventListener('click', () => {
    const m = b.dataset.mode;
    if (m === 'walk') { toast('Walk: steps unlock the next chapter.'); return; }
    if (!RM.matches && b.animate) b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }], { duration: 220 });
    toast(m === 'path'
      ? 'Path: walk to a real place nearby, following a blue route to a blue pin. This chapter wants steps, so Walk it is.'
      : 'Hunt: find something and take its picture. Not this chapter. For now, Walk.', 4800);
  }));

  const walkDone = () => guard(new Promise((res) => { if (S.steps >= GOAL) res(); else walkResolve = res; }));

  async function unlock() {
    R.unlock.hidden = false;
    R.unlock.classList.toggle('anim', !RM.matches);
    sound.win(); buzz(30);
    const btn = R.unlock.querySelector('[data-act="continue"]');
    softFocus(btn);
    await guard(new Promise((res) => { unlockResolve = res; }));
    R.unlock.hidden = true;
  }
  let unlockResolve = null;

  /* --- decrypt puzzle --- */
  let puzzleResolve = null;
  function setupPuzzle() {
    R.pletter.innerHTML = letterBlock(true, S.solved) +
      TARGETS.map((t, i) => `<span class="demo-target${S.solved.includes(i) ? ' got' : ''}" data-t="${i}" style="left:${t.x}%;top:${t.y}%;--tc:var(${t.c})" aria-hidden="true"><b>${i + 1}</b>${icon('check')}</span>`).join('');
    R.palette.innerHTML = PALETTE.map((p) => `<button class="demo-swatch" data-c="${p.c}" aria-label="${p.name}"><i style="background:var(${p.c})"></i><span>${p.name}</span></button>`).join('');
    R.pfoot.innerHTML = '<button class="btn txt demo-solve">Solve This for Me</button>';
    R.palette.querySelectorAll('.demo-swatch').forEach((b) => b.addEventListener('click', () => pick(b)));
    R.pfoot.querySelector('.demo-solve').addEventListener('click', solveAll);
    nextTarget();
  }
  const current = () => TARGETS.findIndex((_, i) => !S.solved.includes(i));
  function nextTarget() {
    const i = current();
    root.querySelectorAll('.demo-target').forEach((m) => m.classList.toggle('active', +m.dataset.t === i));
    if (i < 0) return finishPuzzle();
    R.pmsg.textContent = `Square ${i + 1} sits on ${TARGETS[i].what}. Which colour is hiding there?`;
  }
  function clearBand(i) {
    S.solved.push(i); save();
    R.pletter.querySelectorAll(`.demo-tiles i[data-band="${i}"]`).forEach((t) => t.classList.add('gone'));
    const m = R.pletter.querySelector(`.demo-target[data-t="${i}"]`); if (m) m.classList.add('got');
  }
  function pick(b) {
    const i = current(); if (i < 0) return;
    if (b.dataset.c === TARGETS[i].c) {
      clearBand(i); sound.good(); buzz(12);
      R.pmsg.textContent = `${TARGETS[i].name}. That's it.`;
      setTimeout(nextTarget, RM.matches ? 300 : 700);
    } else {
      sound.bad(); buzz(20);
      if (!RM.matches && b.animate) b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 300 });
      R.pmsg.textContent = `Not quite. Look again at square ${i + 1}, on ${TARGETS[i].what}.`;
    }
  }
  async function solveAll() {
    R.pfoot.innerHTML = '';
    for (let i = current(); i > -1; i = current()) { clearBand(i); sound.good(); await new Promise((r) => setTimeout(r, RM.matches ? 50 : 380)); }
    nextTarget();
  }
  function finishPuzzle() {
    R.pmsg.textContent = 'The letter is clear. Read it closely.';
    R.palette.innerHTML = '';
    R.pfoot.innerHTML = '<button class="btn demo-pdone">Continue</button>';
    sound.win();
    const b = R.pfoot.querySelector('button');
    b.addEventListener('click', () => { if (puzzleResolve) { const r = puzzleResolve; puzzleResolve = null; r(); } });
    softFocus(b);
  }

  /* --- gem sheet (closes on Esc / outside tap; a chip brings it back) --- */
  let gemResolve = null, gemPick = null;
  function openSheet() {
    R.dock.innerHTML = ''; R.dock.classList.remove('open');
    R.sheet.hidden = false;
    if (!RM.matches) R.sheet.classList.add('rise');
    softFocus(R.sheet.querySelector(gemPick ? `[data-gem="${gemPick}"]` : '.demo-gempick'));
  }
  function closeSheet() {
    if (R.sheet.hidden) return;
    R.sheet.hidden = true; R.sheet.classList.remove('rise');
    if (gemResolve) {
      R.dock.innerHTML = '<button class="btn demo-act">Choose a Gem</button>';
      R.dock.classList.add('open');
      const b = R.dock.querySelector('button');
      b.addEventListener('click', openSheet);
      softFocus(b);
    }
  }
  root.querySelectorAll('.demo-gempick').forEach((b) => b.addEventListener('click', () => {
    gemPick = b.dataset.gem;
    root.querySelectorAll('.demo-gempick').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    root.querySelector('[data-act="savegem"]').disabled = false;
    sound.send(); buzz(6);
    if (!RM.matches && b.animate) b.querySelector('svg').animate([{ transform: 'scale(.8) rotate(-8deg)' }, { transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 320, easing: 'ease-out' });
  }));
  // Arrow keys move between gem radios
  R.sheet.querySelector('.demo-gems').addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const all = [...root.querySelectorAll('.demo-gempick')];
    const i = all.indexOf(document.activeElement);
    const n = all[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : all.length - 1)) % all.length];
    n.focus(); n.click();
  });

  /* --- the story --- */
  const go = (stage) => { S.stage = stage; S.mark = S.log.length; save(); };
  const STAGES = {
    async hello() {
      setRail('chat');
      await say('Hello? Is this thing on? Tap anything if you can read me.');
      await say("Sorry about your screen. The Society doesn't do phone calls.");
      setRail('choice');
      const i = await choose(['Who is this?', 'I can read you']);
      await say(i ? 'Oh good. It works. It never works.' : 'Fair question. Hold on, let me get this right.');
      go('name');
    },
    async name() {
      setRail('choice');
      setName(true); save();
      await say("My name's Wren. I've been sent to find one person in this city, and my compass is pointing at you.");
      await say("The signal keeps cutting out. It's stronger if you move. Pick one:");
      const i = await choose(['Walk to the nearest corner', 'Walk to the far end of my home']);
      await say(i ? 'Your home counts. Thirty steps should do it.' : 'The corner, then. Thirty steps should do it.');
      await say('Let me see your map so I can guide you.');
      go('map');
    },
    async map() {
      resetMap();
      R.hint.textContent = COARSE.matches ? 'Hold the button, or walk with your phone.' : 'Or press and hold an arrow key.';
      await show('map', true);
      setRail('walk');
      if (S.steps === 0) toast('Walk mode. The ring shrinks as you get closer.', 3200);
      await walkDone();
      await sleep(RM.matches ? 100 : 450);
      await unlock();
      go('letter');
    },
    async letter() {
      await show('chat', true);
      setRail('decrypt');
      await say("There. A message came through, but it's scrambled.");
      add({ k: 'letter' });
      sound.msg();
      await sleep(RM.matches ? 100 : 500);
      await say('Match its colours to clear it. The Society loves a little theatre.');
      await choose(['Unscramble the Letter'], { echo: false, primary: true });
      go('puzzle');
    },
    async puzzle() {
      setRail('decrypt');
      setupPuzzle();
      await show('puzzle', true);
      const done = guard(new Promise((res) => { puzzleResolve = res; }));
      if (current() < 0) finishPuzzle();
      await done;
      await show('chat', true);
      add({ k: 'letterclear' });
      sound.msg();
      await sleep(RM.matches ? 100 : 600);
      go('after');
    },
    async after() {
      setRail('choice');
      await say("It's from the Society. They only write when it's serious.");
      await say('And that number on the seal? Remember it.');
      const i = await choose(['What does the door open to?', 'Why me?']);
      await say(i ? "Because you walked when I asked. Most people don't." : "Nobody I've asked has come back to say.");
      await say('Hang on. Something just came through on my end.');
      await say('Someone on the other side of that door just knocked back.');
      await say("Before anything else, mark this spot. You'll want to find it again.");
      go('gem');
    },
    async gem() {
      setRail('gem');
      gemPick = S.gem;
      const picked = guard(new Promise((res) => { gemResolve = res; }));
      openSheet();
      await picked;
      add({ k: 'gem', gem: S.gem });
      sound.good();
      await sleep(RM.matches ? 100 : 500);
      await say('Saved. Now it is yours.');
      await say('I can keep this line open, but only for members.');
      go('cta');
    },
    async cta() {
      setRail('end');
      R.dock.innerHTML = ''; R.dock.classList.remove('open');
      const row = render({ k: 'cta' }, true);
      scrollLog();
      softFocus(row.querySelector('a'));
      return 'stay';
    },
  };
  root.querySelector('[data-act="savegem"]').addEventListener('click', () => {
    if (!gemPick || !gemResolve) return;
    S.gem = gemPick; save();
    R.sheet.hidden = true; R.sheet.classList.remove('rise');
    const r = gemResolve; gemResolve = null; r();
  });

  async function run() {
    const e = epoch;
    try {
      while (e === epoch && STAGES[S.stage]) {
        const before = S.stage;
        const res = await STAGES[S.stage]();
        if (res === 'stay' || S.stage === before) break;
      }
    } catch (err) {
      if (err !== CANCEL) console.error('[demo]', err);
    }
  }

  function clearUI() {
    stopHold(); stopMotion(); hideToast();
    walkResolve = puzzleResolve = gemResolve = unlockResolve = null;
    gemPick = null;
    R.log.innerHTML = ''; R.dock.innerHTML = ''; R.dock.classList.remove('open');
    R.unlock.hidden = true; R.sheet.hidden = true;
    root.querySelectorAll('.demo-gempick').forEach((x) => x.setAttribute('aria-checked', 'false'));
    root.querySelector('[data-act="savegem"]').disabled = true;
  }
  function restart() {
    epoch++;
    clearUI();
    S = fresh(); save();
    setName(false);
    setRail(null);
    show('intro');
    softFocus(root.querySelector('[data-act="start"]'));
  }
  function resume() {
    // Rebuild the chat up to the start of the current stage, then play that stage again.
    S.log = S.log.slice(0, S.mark);
    setName(!!S.named);
    S.log.forEach((it) => render(it, false));
    R.log.scrollTop = R.log.scrollHeight;
    const v = { map: 'map', puzzle: 'chat' }[S.stage] || 'chat';
    if (v === 'map') { resetMap(); root.querySelectorAll('[data-view]').forEach((x) => { x.hidden = x.dataset.view !== 'chat'; }); view = 'chat'; }
    else { root.querySelectorAll('[data-view]').forEach((x) => { x.hidden = x.dataset.view !== v; }); view = v; }
    toast('Welcome back. Picking up where you left off.', 3000);
    run();
  }

  /* --- events --- */
  root.addEventListener('click', (e) => {
    const a = e.target.closest('[data-act]');
    if (!a || !root.contains(a)) return;
    const act = a.dataset.act;
    if (act === 'sound') { setSound(!sound.on); if (sound.on) sound.send(); }
    else if (act === 'restart') restart();
    else if (act === 'start') {
      sound.ensure && sound.on && sound.ensure();
      epoch++; clearUI();
      S = fresh(); S.stage = 'hello'; save();
      show('chat', true).then(() => { softFocus(R.log); run(); });
    } else if (act === 'continue' && unlockResolve) { const r = unlockResolve; unlockResolve = null; r(); }
  });
  // Outside taps close the sheet and the toast.
  document.addEventListener('pointerdown', (e) => {
    if (!R.toast.hidden && !R.toast.contains(e.target)) hideToast();
    if (!R.sheet.hidden && !R.sheet.contains(e.target)) closeSheet();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!R.sheet.hidden) { closeSheet(); e.preventDefault(); }
      else if (!R.toast.hidden) hideToast();
      else if (!R.unlock.hidden && unlockResolve) { const r = unlockResolve; unlockResolve = null; r(); }
      return;
    }
    if (view !== 'map' || !walkResolve) return;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const ae = document.activeElement;
    if (ae && ae !== document.body && !root.contains(ae)) return;
    if (!inView && !root.contains(ae)) return;
    if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return;
    e.preventDefault();
    R.hold.classList.add('pressing');
    keyStep();
  });
  document.addEventListener('keyup', (e) => { if (e.key.startsWith('Arrow') && !holdTimer) R.hold.classList.remove('pressing'); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((en) => { inView = en[0].isIntersecting; }, { threshold: 0.35 }).observe(R.phone);
  } else inView = true;

  // Boot: returning visitors pick up where they left off.
  setSound(false);
  if (store.get(SOUND_KEY) === true) { soundBtn.setAttribute('aria-pressed', 'true'); soundBtn.innerHTML = `${icon('soundOn')}<span>Sound On</span>`; }
  if (S.stage && S.stage !== 'intro' && STAGES[S.stage]) resume();
  else { S = fresh(); setRail(null); }

  window.SC_DEMO = { restart, state: () => JSON.parse(JSON.stringify(S)) };
}

function boot() { document.querySelectorAll('[data-module="demo"]').forEach(mount); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
