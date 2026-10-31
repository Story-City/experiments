// The walks and quests added from the Notion board. app.js hands over its helpers as `kit`.
import { COMMON, RAINBOW, RANSOM, SHAPES, MUSEUM, GRUMPY, SAFARI, BACKWARDS, REMIX, SEANCE, SOUND, HAIKU, MOOD, COIN, FOG, STEPS, QUEST_WORDS, QUESTS } from './more-words.js';

export function register(kit) {
  const { h, show, bar, openSheet, closeSheet, cameraControls, realPhoto, pretendPhoto, pick, shuffle, goHome, where } = kit;

  /* ---------- small shared pieces ---------- */
  const again = () => h('button', { class: 'btn ghost', 'data-end': '', onclick: goHome }, COMMON.again);
  const jewelBtn = (label, onclick, extra = {}) => h('button', { class: 'btn jewel', 'data-t': 'go', onclick, ...extra }, label);
  const input = (ph, attrs = {}) => h('input', { class: 'field', type: 'text', placeholder: ph, maxlength: 80, ...attrs });
  const area = (ph) => h('textarea', { class: 'field', rows: 2, placeholder: ph, maxlength: 140 });
  const val = (el) => el.value.trim() || el.placeholder;
  const chips = (list, onpick) => h('div', { class: 'tags' }, list.map((t) => h('button', { class: 'tag pickable', onclick: () => onpick(t) }, t)));
  const snapSheet = (kicker, title, line, onPhoto, pretend) => openSheet([
    h('p', { class: 'kicker' }, kicker),
    h('h3', {}, title),
    line ? h('p', { class: 'more' }, line) : null,
    h('div', { class: 'btns' },
      h('button', { class: 'btn jewel', onclick: async () => { closeSheet(); const u = await realPhoto(); if (u) onPhoto(u); } }, 'Take Photo'),
      h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => { closeSheet(); onPhoto(pretend()); } }, 'or pretend')),
  ]);
  // A prompt sheet with a text field; onSave gets the text (placeholder if left empty).
  const writeSheet = (kicker, title, field, onSave, extra) => openSheet([
    h('p', { class: 'kicker' }, kicker), h('h3', {}, title), extra || null, field,
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', 'data-t': 'go', onclick: () => { const v = val(field); closeSheet(); onSave(v); } }, COMMON.save)),
  ]);

  const loadImg = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  async function toCanvas(src, size = 480) {
    const img = await loadImg(src);
    const c = document.createElement('canvas'); c.width = c.height = size;
    const x = c.getContext('2d');
    if (img) { const s = Math.min(img.width, img.height); x.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size); }
    return [c, x];
  }

  // Photo remixes, done with plain pixel maths so they work on every phone.
  const EFFECTS = {
    mix(c, x) { const d = x.getImageData(0, 0, c.width, c.height); const p = d.data;
      for (let i = 0; i < p.length; i += 4) { const [r, g, b] = [p[i], p[i + 1], p[i + 2]]; p[i] = Math.round(b / 64) * 64; p[i + 1] = Math.round(r / 64) * 64; p[i + 2] = Math.round(g / 64) * 64; }
      x.putImageData(d, 0, 0); },
    shape(c, x) { const s = c.width / 2; const t = document.createElement('canvas'); t.width = t.height = s; t.getContext('2d').drawImage(c, 0, 0, s, s, 0, 0, s, s);
      x.drawImage(t, 0, 0); x.save(); x.scale(-1, 1); x.drawImage(t, -2 * s, 0); x.restore();
      x.save(); x.scale(1, -1); x.drawImage(t, 0, -2 * s); x.scale(-1, 1); x.drawImage(t, -2 * s, -2 * s); x.restore(); },
    wreck(c, x) { for (let i = 0; i < 14; i++) { const y = Math.random() * c.height, hh = 6 + Math.random() * 40, dx = (Math.random() - 0.5) * 120; x.drawImage(c, 0, y, c.width, hh, dx, y, c.width, hh); }
      const d = x.getImageData(0, 0, c.width, c.height); const p = d.data; const o = d.data.slice();
      for (let i = 0; i < p.length; i += 4) p[i] = o[i + 32] ?? p[i];
      x.putImageData(d, 0, 0); },
    ghost(c, x) { const d = x.getImageData(0, 0, c.width, c.height); const p = d.data;
      for (let i = 0; i < p.length; i += 4) { const v = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2]; p[i] = v * 0.85 + 30; p[i + 1] = v * 0.9 + 30; p[i + 2] = v + 40; }
      x.putImageData(d, 0, 0); x.globalAlpha = 0.35; x.drawImage(c, 18, -10); x.globalAlpha = 1; vignette(c, x, 'rgba(10,10,30,.75)'); },
    cursed(c, x) { const d = x.getImageData(0, 0, c.width, c.height); const p = d.data;
      for (let i = 0; i < p.length; i += 4) { const v = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2]; p[i] = v * 0.4; p[i + 1] = Math.min(255, v * 1.15 + 20); p[i + 2] = v * 0.35; if (Math.random() < 0.04) p[i] = p[i + 1] = p[i + 2] = 255; }
      x.putImageData(d, 0, 0); vignette(c, x, 'rgba(0,20,0,.85)'); },
    possessed(c, x) { const s = c.width; x.save(); x.translate(s, 0); x.scale(-1, 1); x.globalAlpha = 0.5; x.drawImage(c, 0, 0); x.restore(); x.globalAlpha = 1;
      x.fillStyle = 'rgba(160,0,30,.28)'; x.fillRect(0, 0, s, s); vignette(c, x, 'rgba(30,0,0,.9)');
      x.fillStyle = 'rgba(255,240,200,.9)'; for (const ex of [s * 0.4, s * 0.6]) { x.beginPath(); x.arc(ex, s * 0.42, s * 0.018, 0, 7); x.fill(); } },
  };
  function vignette(c, x, edge) { const g = x.createRadialGradient(c.width / 2, c.height / 2, c.width * 0.25, c.width / 2, c.height / 2, c.width * 0.72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, edge); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); }
  async function remixPhoto(src, effect) { const [c, x] = await toCanvas(src); EFFECTS[effect](c, x); return c.toDataURL('image/jpeg', 0.85); }

  // A torn scrap with one letter on it: the pretend version of a letter cut from a sign.
  function letterScrap(letter, spooky) {
    const c = document.createElement('canvas'); c.width = c.height = 240; const x = c.getContext('2d');
    const bgs = spooky ? [['#140c10', '#ff7a2a'], ['#2a0f1a', '#f4ebdd'], ['#f4ebdd', '#7a0f1f']] : [['#f4ebdd', '#1a0b3d'], ['#e03a3a', '#fff'], ['#f2cf3a', '#1a0b3d'], ['#1a1a1a', '#fff'], ['#fff', '#2f5fe0']];
    const [bg, fg] = pick(bgs);
    x.translate(120, 120); x.rotate((Math.random() - 0.5) * 0.3);
    x.fillStyle = bg; x.beginPath(); for (let a = 0; a < 6.28; a += 0.35) { const r = 95 + Math.random() * 14; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.fill();
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `${pick(['900', '700', 'italic 700'])} ${130 + Math.random() * 30}px ${pick(['Georgia, serif', 'Impact, sans-serif', '"Courier New", monospace', 'system-ui'])}`;
    x.fillText(letter, 0, 8);
    return c.toDataURL('image/jpeg', 0.85);
  }

  // Record a few seconds of sound. Resolves to an audio URL, or null if no mic.
  function recordSound(seconds = 4) {
    return new Promise(async (resolve) => {
      let stream;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { return resolve(null); }
      const rec = new MediaRecorder(stream); const parts = [];
      rec.ondataavailable = (e) => parts.push(e.data);
      rec.onstop = () => { stream.getTracks().forEach((t) => t.stop()); resolve(URL.createObjectURL(new Blob(parts, { type: rec.mimeType }))); };
      const left = h('div', { class: 'rec-count' }, String(seconds));
      openSheet([h('div', { class: 'rec' }, h('i')), h('h3', { class: 'centre' }, SEANCE.recording), left,
        h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: () => rec.state === 'recording' && rec.stop() }, SEANCE.stop))]);
      rec.start();
      let n = seconds;
      const t = setInterval(() => { left.textContent = String(--n); if (n <= 0) { clearInterval(t); if (rec.state === 'recording') rec.stop(); } }, 1000);
      rec.addEventListener('stop', () => { clearInterval(t); closeSheet(); });
    });
  }

  const pretendFor = (things, colour) => () => pretendPhoto(pick(things), colour || pick(['#3a7d6b', '#4b3d8f', '#8a6a4f', '#2f6fc8', '#5a3a6a']));

  /* ---------- Rainbow walk: seven colours, strictly in order ---------- */
  function rainbow(photos = []) {
    const i = photos.length;
    if (i === RAINBOW.colours.length) return rainbowEnd(photos);
    const c = RAINBOW.colours[i];
    show(
      bar(COMMON.of(i, 7)),
      h('p', { class: 'kicker' }, RAINBOW.find),
      h('h2', { class: 'display huge', style: `color:${c.hex}` }, c.name),
      h('div', { class: 'bands' }, RAINBOW.colours.map((k, j) => h('div', { class: `band${j === i ? ' now' : ''}`, style: `--c:${k.hex}` }, photos[j] ? h('img', { src: photos[j], alt: '' }) : null))),
      h('div', { class: 'spacer' }),
      cameraControls('Take Photo', (u) => rainbow([...photos, u]), () => pretendPhoto(pick(c.things), c.hex)),
    );
  }
  function rainbowEnd(photos) {
    show(bar(), h('h2', { class: 'display' }, RAINBOW.endTitle), h('p', { class: 'sub' }, RAINBOW.endLine),
      h('div', { class: 'rainbow-poster' }, photos.map((src, j) => h('div', { style: `--c:${RAINBOW.colours[j].hex}` }, h('img', { src, alt: RAINBOW.colours[j].name })))),
      h('div', { class: 'btns' }, again()));
  }

  /* ---------- Ransom note: spell a secret word from real signs ---------- */
  function ransom(cursed) {
    const word = pick(cursed ? RANSOM.ghosts : RANSOM.words);
    const got = Array(word.length).fill(null);
    const draw = () => {
      if (got.every(Boolean)) return ransomEnd(word, got, cursed);
      show(
        bar(COMMON.of(got.filter(Boolean).length, word.length)),
        h('p', { class: 'kicker' }, cursed ? RANSOM.tapCursed : RANSOM.tap),
        h('div', { class: 'letters' }, [...word].map((l, j) => got[j]
          ? h('div', { class: 'letter got' }, h('img', { src: got[j], alt: l }))
          : h('button', { class: 'letter', 'data-t': 'go', onclick: () => snapSheet(RANSOM.findKicker, `“${l}”`, RANSOM.where[where()], (u) => { got[j] = u; draw(); }, () => letterScrap(l, cursed)) }, cursed ? '?' : '·'))),
        h('p', { class: 'sub' }, RANSOM.where[where()]),
      );
    };
    draw();
  }
  function ransomEnd(word, got, cursed) {
    show(bar(), h('p', { class: 'kicker' }, cursed ? RANSOM.endTitleCursed : RANSOM.endTitle),
      h('div', { class: `note${cursed ? ' cursed' : ''}` },
        h('div', { class: 'note-word' }, got.map((src, j) => h('img', { src, alt: word[j], style: `rotate:${(Math.random() - 0.5) * 14}deg` }))),
        h('p', {}, cursed ? RANSOM.noteCursed : RANSOM.note)),
      h('h2', { class: 'display centre', style: 'margin-top:18px' }, word),
      h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
  }

  /* ---------- Shape hunt: four shapes become a creature ---------- */
  function shapes() {
    const got = {};
    const draw = () => {
      const n = Object.keys(got).length;
      show(
        bar(COMMON.of(n, 4)),
        h('p', { class: 'kicker' }, SHAPES.tap),
        h('div', { class: 'shape-grid' }, SHAPES.list.map((s) => h('button', { class: `shape ${s.id}${got[s.id] ? ' got' : ''}`, 'data-t': got[s.id] ? null : 'go',
          onclick: () => !got[s.id] && snapSheet('Find', s.name, null, (u) => { got[s.id] = u; draw(); }, pretendFor(s.things)) },
        h('i', { style: got[s.id] ? `background-image:url(${got[s.id]})` : '' }), h('span', {}, s.name)))),
        h('p', { class: 'sub' }, SHAPES.friend),
        h('div', { class: 'spacer' }),
        h('div', { class: 'btns' }, jewelBtn(SHAPES.build, () => creature(got), { disabled: n < 4 })),
      );
    };
    draw();
  }
  function creature(got) {
    const name = h('h2', { class: 'display centre', contenteditable: 'true', spellcheck: 'false' }, pick(SHAPES.names));
    const bg = (k) => `background-image:url(${got[k]})`;
    show(bar(), h('p', { class: 'kicker centre' }, SHAPES.endTitle),
      h('div', { class: 'creature' },
        h('i', { class: 'c-hat', style: bg('triangle') }), h('i', { class: 'c-head', style: bg('circle') }, h('b'), h('b')),
        h('i', { class: 'c-body', style: bg('square') }), h('i', { class: 'c-leg', style: bg('line') }), h('i', { class: 'c-leg r', style: bg('line') })),
      name, h('p', { class: 'hint centre' }, SHAPES.rename),
      h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
  }

  /* ---------- Tiny museum / Grumpy tour / Street art safari: snap 3, then each gets words ---------- */
  function threeWithWords(cfg, items = []) {
    if (items.length === 3) return cfg.end(items);
    show(
      bar(COMMON.of(items.length, 3)),
      h('p', { class: 'kicker' }, cfg.kicker(items.length + 1)),
      h('h2', { class: 'display' }, cfg.find),
      h('div', { class: 'strip' }, [0, 1, 2].map((j) => items[j] ? h('img', { src: items[j].photo, alt: '' }) : h('div', { class: 'slot' }))),
      h('div', { class: 'spacer' }),
      cameraControls('Take Photo', (u) => cfg.words(u, (w) => threeWithWords(cfg, [...items, { photo: u, ...w }])), cfg.pretend),
    );
  }
  const museum = () => threeWithWords({
    kicker: MUSEUM.exhibit, find: MUSEUM.find, pretend: pretendFor(['🧤', '🪨', '🔑', '🍂', '🪶', '🧸']),
    words: (u, next) => { const t = input(MUSEUM.titlePh); const l = area(MUSEUM.linePh);
      openSheet([h('img', { class: 'preview', src: u, alt: '' }), h('p', { class: 'kicker' }, MUSEUM.label), t, l,
        h('div', { class: 'btns' }, h('button', { class: 'btn jewel', 'data-t': 'go', onclick: () => { closeSheet(); next({ title: val(t), line: val(l) }); } }, COMMON.save))]); },
    end: (items) => show(bar(), h('p', { class: 'kicker' }, MUSEUM.endLine), h('h2', { class: 'display' }, MUSEUM.endTitle),
      h('div', { class: 'museum' }, items.map((it, j) => h('figure', {}, h('img', { src: it.photo, alt: '' }),
        h('figcaption', {}, h('b', {}, it.title), h('span', {}, it.line), h('small', {}, `No. ${j + 1}`))))),
      h('div', { class: 'btns' }, again())),
  });
  const grumpy = () => threeWithWords({
    kicker: (i) => `Suspect ${i}`, find: GRUMPY.find, pretend: pretendFor(['📮', '🚒', '🪣', '🗑️', '🦉', '🧱']),
    words: (u, next) => { const f = input(GRUMPY.namePh);
      openSheet([h('img', { class: 'preview', src: u, alt: '' }), h('h3', { class: 'centre' }, GRUMPY.name), chips(GRUMPY.names, (n) => { f.value = n; }), f,
        h('div', { class: 'btns' }, h('button', { class: 'btn jewel', 'data-t': 'go', onclick: () => { closeSheet(); next({ name: f.value.trim() || pick(GRUMPY.names) }); } }, COMMON.save))]); },
    end: (items) => show(bar(), h('h2', { class: 'display' }, GRUMPY.endTitle), h('p', { class: 'sub' }, GRUMPY.endLine),
      h('div', { class: 'lineup' }, items.map((it, j) => h('figure', { style: `rotate:${[-3, 2, -1][j]}deg` }, h('img', { src: it.photo, alt: '' }), h('figcaption', {}, it.name, h('small', {}, `No. 00${j + 1}`))))),
      h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again())),
  });
  const safari = () => threeWithWords({
    kicker: (i) => `Mural ${i}`, find: SAFARI.find[where()], pretend: pretendFor(['🎨', '🦊', '🐋', '🌈', '👁️', '🌻']),
    words: (u, next) => writeSheet(SAFARI.save, SAFARI.name, input(SAFARI.namePh), (name) => next({ name }), h('img', { class: 'preview', src: u, alt: '' })),
    end: (items) => {
      const spots = [[70, 60], [230, 110], [140, 190]];
      show(bar(), h('h2', { class: 'display' }, SAFARI.endTitle), h('p', { class: 'sub' }, SAFARI.endLine),
        h('div', { class: 'gem-map' }, mini(spots), items.map((it, j) => h('div', { class: 'gem-pin', style: `left:${spots[j][0] / 3}%;top:${spots[j][1] / 2.4}%` }, h('i'), h('span', {}, it.name)))),
        h('div', { class: 'strip' }, items.map((it) => h('img', { src: it.photo, alt: it.name }))),
        h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
    },
  });
  // A tiny pretend street map for the safari's end screen.
  function mini() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 240'); svg.setAttribute('class', 'mini-map');
    svg.innerHTML = [40, 100, 160, 220].map((y) => `<line x1="0" y1="${y}" x2="300" y2="${y + 8}"/>`).join('') + [50, 120, 200, 270].map((x) => `<line x1="${x}" y1="0" x2="${x - 10}" y2="240"/>`).join('');
    return svg;
  }

  /* ---------- Backwards walk: out, turn, spot what you missed ---------- */
  function backwards() {
    const t0 = Date.now();
    show(bar(), h('p', { class: 'kicker' }, 'Part 1 · Out'), h('h2', { class: 'display' }, BACKWARDS.out), h('p', { class: 'sub' }, BACKWARDS.outLine),
      h('div', { class: 'spacer' }), h('div', { class: 'big-arrow', 'aria-hidden': 'true' }, '→'), h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, jewelBtn(BACKWARDS.turn, () => backwardsBack(Math.round((Date.now() - t0) / 60000)))));
  }
  function backwardsBack(mins, photos = []) {
    if (photos.length === 3) {
      return show(bar(), h('p', { class: 'kicker' }, BACKWARDS.time(mins)), h('h2', { class: 'display' }, BACKWARDS.endTitle),
        h('div', { class: 'missed' }, photos.map((src) => h('img', { src, alt: '' }))), h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
    }
    show(bar(COMMON.of(photos.length, 3)), h('p', { class: 'kicker' }, 'Part 2 · Back'), h('h2', { class: 'display' }, BACKWARDS.back), h('p', { class: 'sub' }, BACKWARDS.backLine),
      h('div', { class: 'strip' }, [0, 1, 2].map((j) => photos[j] ? h('img', { src: photos[j], alt: '' }) : h('div', { class: 'slot' }))),
      h('div', { class: 'spacer' }),
      cameraControls('Take Photo', (u) => backwardsBack(mins, [...photos, u]), pretendFor(['🐌', '🧩', '🚪', '🪴', '🐦', '🎈'])));
  }

  /* ---------- Remix 3 / Haunted remix: snap, then pick a remix (each once) ---------- */
  function remix(haunted, done = []) {
    const styles = haunted ? REMIX.haunted : REMIX.styles;
    if (done.length === 3) {
      return show(bar(), h('h2', { class: 'display' }, haunted ? REMIX.endTitleHaunted : REMIX.endTitle),
        h('div', { class: 'triptych' }, done.map((d) => h('figure', {}, h('img', { src: d.src, alt: '' }), h('figcaption', {}, d.name)))),
        h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
    }
    const left = styles.filter((s) => !done.some((d) => d.id === s.id));
    show(bar(COMMON.of(done.length, 3)), h('p', { class: 'kicker' }, REMIX.snap), h('h2', { class: 'display' }, left.map((s) => s.name).join(' · ')),
      h('div', { class: 'strip' }, [0, 1, 2].map((j) => done[j] ? h('img', { src: done[j].src, alt: '' }) : h('div', { class: 'slot' }))),
      h('div', { class: 'spacer' }),
      cameraControls('Take Photo', (u) => openSheet([
        h('img', { class: 'preview', src: u, alt: '' }), h('h3', { class: 'centre' }, haunted ? REMIX.pickHaunted : REMIX.pick),
        h('div', { class: 'choices' }, left.map((s) => h('button', { class: 'choice', 'data-t': 'go', onclick: async () => {
          closeSheet(); remix(haunted, [...done, { id: s.id, name: s.name, src: await remixPhoto(u, s.id) }]);
        } }, h('b', {}, s.name), h('span', {}, s.line)))),
      ]), pretendFor(haunted ? ['🏚️', '🌳', '🚪', '🪟', '🕯️'] : ['🏠', '🚲', '🌳', '🚦', '🌼'])));
  }

  /* ---------- Séance of sounds: three sounds become a message ---------- */
  function seance(sounds = []) {
    if (sounds.length === 3) return seanceEnd(sounds);
    const name = (url) => {
      const f = input('…or type it');
      openSheet([h('p', { class: 'kicker' }, `Sound ${sounds.length + 1}`), h('h3', {}, SEANCE.what), chips(SEANCE.sounds, (s) => { closeSheet(); seance([...sounds, { url, label: s }]); }), f,
        h('div', { class: 'btns' }, h('button', { class: 'btn jewel', 'data-t': 'go', onclick: () => { closeSheet(); seance([...sounds, { url, label: f.value.trim() || pick(SEANCE.sounds) }]); } }, COMMON.save))]);
    };
    show(bar(COMMON.of(sounds.length, 3)), h('p', { class: 'kicker' }, SEANCE.candles),
      h('div', { class: 'candles' }, [0, 1, 2].map((j) => h('div', { class: `candle${sounds[j] ? ' lit' : ''}` }, h('i'), h('span', {}, sounds[j]?.label || '')))),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, jewelBtn(SEANCE.record, async () => { const u = await recordSound(4); name(u); }),
        h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => name(null) }, 'or pretend')));
  }
  function seanceEnd(sounds) {
    const play = async () => { for (const s of sounds) if (s.url) await new Promise((ok) => { const a = new Audio(s.url); a.onended = ok; a.onerror = ok; a.play().catch(ok); }); };
    show(bar(), h('p', { class: 'kicker' }, SEANCE.endTitle),
      h('div', { class: 'frame' }, h('p', { class: 'big' }, SEANCE.message(...sounds.map((s) => s.label)))),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, sounds.some((s) => s.url) ? jewelBtn(SEANCE.play, play) : null, again()));
  }

  /* ---------- Sound walk: three stops, one word each ---------- */
  function soundWalk(words = []) {
    if (words.length === 3) {
      return show(bar(), h('p', { class: 'kicker' }, SOUND.endTitle), h('div', { class: 'poem' }, words.map((w) => h('p', {}, w))), h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
    }
    const ring = h('div', { class: 'listen' }, h('span', {}, '20'));
    const f = input(SOUND.wordPh);
    let n = 20;
    const t = setInterval(() => { n--; ring.firstChild.textContent = String(Math.max(0, n)); ring.style.setProperty('--p', `${(20 - n) * 5}%`); if (n <= 0) clearInterval(t); }, 1000);
    kit.setLeave(() => clearInterval(t));
    show(bar(COMMON.of(words.length, 3)), h('p', { class: 'kicker' }, SOUND.stop(words.length + 1)), h('h2', { class: 'display' }, SOUND.listen), ring,
      h('p', { class: 'sub' }, SOUND.word), f, h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, jewelBtn(COMMON.next, () => { clearInterval(t); soundWalk([...words, val(f)]); })));
  }

  /* ---------- Haiku walk: notice three things, then 5-7-5 ---------- */
  const syllables = (s) => s.toLowerCase().split(/[^a-z']+/).filter(Boolean).reduce((n, w) => n + Math.max(1, (w.replace(/e$/, '').match(/[aeiouy]+/g) || []).length), 0);
  function haiku() {
    const fs = HAIKU.ph.map((p) => input(p));
    show(bar(), h('p', { class: 'kicker' }, 'Step 1'), h('h2', { class: 'display' }, HAIKU.notice), h('div', { class: 'fields' }, fs), h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, jewelBtn(COMMON.next, () => haikuWrite(fs.map(val)))));
  }
  function haikuWrite(seen) {
    const lines = HAIKU.linePh.map((p, i) => {
      const count = h('span', { class: 'count-syl' }, `0 / ${[5, 7, 5][i]}`);
      const f = input(p, { oninput: () => { const n = syllables(f.value); count.textContent = `${n} / ${[5, 7, 5][i]}`; count.classList.toggle('ok', n === [5, 7, 5][i]); } });
      return { f, row: h('label', { class: 'syl' }, f, count) };
    });
    show(bar(), h('p', { class: 'kicker' }, 'Step 2'), h('h2', { class: 'display' }, HAIKU.write), h('div', { class: 'tags' }, seen.map((s) => h('span', { class: 'tag' }, s))),
      h('div', { class: 'fields' }, lines.map((l) => l.row)), h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, jewelBtn(COMMON.next, () => show(bar(), h('p', { class: 'kicker' }, HAIKU.endTitle),
        h('div', { class: 'poem' }, lines.map((l) => h('p', {}, val(l.f)))), h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again())))));
  }

  /* ---------- Mood walk: pick a feeling, three prompts, check in again ---------- */
  function feelingGrid(onpick) { return h('div', { class: 'feelings' }, MOOD.feelings.map((f) => h('button', { class: 'feeling', 'data-t': 'go', onclick: () => onpick(f) }, f.name))); }
  function mood() {
    show(bar(), h('h2', { class: 'display' }, MOOD.ask), feelingGrid((f) => moodPrompt(f, 0)));
  }
  function moodPrompt(f, i) {
    if (i === 3) return show(bar(), h('h2', { class: 'display' }, MOOD.after), feelingGrid((g) => show(bar(),
      h('p', { class: 'kicker' }, MOOD.endLine), h('h2', { class: 'display' }, MOOD.endTitle(f.name, g.name)), h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()))));
    show(bar(f.name), h('p', { class: 'kicker' }, MOOD.prompt(i + 1)), h('div', { class: 'frame' }, h('p', { class: 'big' }, f.prompts[i])), h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, jewelBtn(MOOD.next, () => moodPrompt(f, i + 1))));
  }

  /* ---------- Coin-flip walk ---------- */
  function coin() {
    const flips = [];
    const face = h('div', { class: 'coin' }, h('span', {}, '✦'));
    const say = h('div', { class: 'arrow' }, COIN.ready);
    const count = h('span', { class: 'count' }, COIN.count(0));
    const hist = h('div', { class: 'coin-row' });
    const top = bar(); top.append(count);
    const btn = jewelBtn(COIN.flip, () => {
      btn.disabled = true;
      const heads = Math.random() < 0.5;
      face.classList.remove('spin'); void face.offsetWidth; face.classList.add('spin');
      setTimeout(() => {
        flips.push(heads); face.firstChild.textContent = heads ? 'H' : 'T';
        say.textContent = heads ? COIN.heads : COIN.tails; count.textContent = COIN.count(flips.length);
        hist.append(h('i', {}, heads ? 'H' : 'T')); btn.disabled = false;
      }, 700);
    });
    show(top, h('div', { class: 'spacer' }), face, say, h('div', { class: 'spacer' }), hist,
      h('div', { class: 'btns' }, btn, h('button', { class: 'btn ghost', onclick: () => {
        const hc = flips.filter(Boolean).length;
        show(bar(), h('h2', { class: 'display' }, COIN.endTitle), h('p', { class: 'sub' }, flips.length ? COIN.endLine(hc, flips.length - hc) : COIN.ready),
          h('div', { class: 'coin-row big' }, flips.map((x) => h('i', {}, x ? 'H' : 'T'))), h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
      } }, COMMON.done)));
  }

  /* ---------- Fog walk: warmer / colder to a hidden spot ---------- */
  function fog() {
    const st = { x: 0, y: 0, dir: 0, blocks: 0 };
    const ang = Math.random() * 6.28, dist = 5 + Math.floor(Math.random() * 3);
    const tgt = { x: Math.round(Math.cos(ang) * dist), y: Math.round(Math.sin(ang) * dist) };
    const d = () => Math.hypot(tgt.x - st.x, tgt.y - st.y);
    const orb = h('div', { class: 'orb' });
    const temp = h('div', { class: 'arrow' });
    const facing = h('p', { class: 'hint centre' });
    const count = h('span', { class: 'count' });
    const top = bar(); top.append(count);
    let last = d();
    const update = (moved) => {
      const k = Math.max(0, Math.min(6, Math.round(6 - d() * 0.9)));
      orb.style.setProperty('--heat', String(k / 6));
      temp.textContent = moved && d() < last ? `${FOG.temps[k]}. Warmer.` : moved && d() > last ? `${FOG.temps[k]}. Colder.` : FOG.temps[k];
      last = d();
      facing.textContent = `Facing ${['north', 'east', 'south', 'west'][st.dir]}`;
      count.textContent = FOG.blocks(st.blocks);
      if (d() < 0.6) show(bar(), h('p', { class: 'kicker' }, FOG.found), h('div', { class: 'orb found', style: '--heat:1' }),
        h('div', { class: 'frame' }, h('p', { class: 'big' }, pick(FOG.spots))), h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
    };
    const step = () => { st.x += [0, 1, 0, -1][st.dir]; st.y += [-1, 0, 1, 0][st.dir]; st.blocks++; update(true); };
    // the mockup quietly faces you the right way more often than not, so it stays a short walk
    const turn = (k) => { st.dir = (st.dir + k + 4) % 4; update(false); };
    show(top, h('p', { class: 'sub' }, FOG.intro), h('div', { class: 'fogbank' }, orb), temp, facing,
      h('div', { class: 'btns' }, jewelBtn(FOG.walk, step),
        h('div', { class: 'row2' }, h('button', { class: 'btn ghost', 'data-turn': 'l', onclick: () => turn(-1) }, FOG.left), h('button', { class: 'btn ghost', 'data-turn': 'r', onclick: () => turn(1) }, FOG.right))));
    window.__fogCheat = () => { const dx = tgt.x - st.x, dy = tgt.y - st.y; st.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0); };
    update(false);
  }

  /* ---------- Spend your steps ---------- */
  function steps() {
    let n = 0;
    const big = h('div', { class: 'steps-big' }, '0');
    const chests = h('div', { class: 'chests' });
    const draw = () => {
      big.textContent = Math.floor(n).toLocaleString();
      chests.replaceChildren(...STEPS.chests.map((c) => h('button', { class: `chest${n >= c.cost ? ' ready' : ''}`, 'data-t': n >= c.cost ? 'go' : null, disabled: n < c.cost, onclick: () => {
        n -= c.cost; draw();
        openSheet([h('p', { class: 'kicker' }, STEPS.got), h('h3', {}, c.name), h('p', { class: 'hook' }, pick(c.prizes)),
          h('div', { class: 'btns' }, h('button', { class: 'btn jewel', 'data-t': 'go', onclick: closeSheet }, 'Keep Walking'), again())]);
      } }, h('b', {}, c.name), h('span', {}, n >= c.cost ? `${STEPS.open} · ${c.cost.toLocaleString()}` : STEPS.need(Math.ceil(c.cost - n))))));
    };
    const t = setInterval(() => { n += 1.7; draw(); }, 1000);
    kit.setLeave(() => clearInterval(t));
    show(bar(), h('p', { class: 'kicker' }, STEPS.saved), big, h('p', { class: 'hint' }, STEPS.walking),
      h('button', { class: 'link pretend', 'data-pretend': '', style: 'align-self:flex-start;padding-left:0', onclick: () => { n += 500; draw(); } }, STEPS.ff),
      chests, h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
    draw();
  }

  /* ---------- Quick quests ---------- */
  function quest(q) {
    const done = (kids) => show(bar(), h('p', { class: 'kicker' }, QUEST_WORDS.doneKicker), h('h2', { class: 'display' }, q.title), kids, h('div', { class: 'spacer' }), h('div', { class: 'btns' }, again()));
    const head = [bar(), h('p', { class: 'kicker' }, q.spooky ? QUEST_WORDS.spooky : QUEST_WORDS.kicker), h('h2', { class: 'display' }, q.title), h('p', { class: 'sub' }, q.line)];
    const pretend = pretendFor([q.thing || '✨'], q.colour);
    const photoDone = (u, extra) => done([h('img', { class: 'quest-photo', src: u, alt: '' }), extra || null]);
    const withWords = (u, gem) => writeSheet(QUEST_WORDS.write, q.ask, area(q.ph), (txt) => photoDone(u, h('p', { class: `quest-line${gem ? ' gem' : ''}` }, txt)), h('img', { class: 'preview', src: u, alt: '' }));
    const cam = (on) => cameraControls('Take Photo', on, pretend);
    switch (q.type) {
      case 'snap': return show(...head, h('div', { class: 'spacer' }), cam((u) => photoDone(u)));
      case 'snapWrite': return show(...head, h('div', { class: 'spacer' }), cam((u) => withWords(u)));
      case 'gem': return show(...head, h('div', { class: 'spacer' }), cam((u) => withWords(u, true)));
      case 'remix': return show(...head, h('div', { class: 'spacer' }), cam(async (u) => photoDone(await remixPhoto(u, 'possessed'))));
      case 'snapN': {
        const got = [];
        const draw = () => got.length === q.n
          ? done(h('div', { class: 'strip' }, got.map((src) => h('img', { src, alt: '' }))))
          : show(...head, h('div', { class: 'strip' }, Array.from({ length: q.n }, (_, j) => got[j] ? h('img', { src: got[j], alt: '' }) : h('div', { class: 'slot' }))), h('div', { class: 'spacer' }),
            cameraControls('Take Photo', (u) => { got.push(u); draw(); }, pretendFor(q.things, q.colour)));
        return draw();
      }
      case 'sound': return show(...head, h('div', { class: 'spacer' }), h('div', { class: 'btns' },
        jewelBtn(SEANCE.record, async () => { const u = await recordSound(5); done(u ? h('audio', { controls: true, src: u }) : h('p', { class: 'quest-line' }, SEANCE.micNo)); }),
        h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => done(h('p', { class: 'quest-line' }, 'One creaky gate, recorded.')) }, 'or pretend')));
      case 'bet': {
        let s = 0;
        const c = h('div', { class: 'steps-big' }, QUEST_WORDS.steps(0));
        const b = jewelBtn(QUEST_WORDS.step, () => { s++; c.textContent = QUEST_WORDS.steps(s); if (s >= 10) show(...head, h('h2', { class: 'display' }, QUEST_WORDS.green), h('div', { class: 'spacer' }), cameraControls('Take Photo', (u) => photoDone(u), pretendFor(['🌿', '🐸', '🥦', '🍏'], '#2f6a3a'))); });
        return show(...head, c, h('div', { class: 'spacer' }), h('div', { class: 'btns' }, b));
      }
      case 'spotdiff': return show(...head, h('div', { class: 'spacer' }), cam(async (u) => {
        // copy a small patch of the photo to somewhere else; the player taps where it changed
        const [c, x] = await toCanvas(u);
        // take the patch from the middle (where the subject usually is) and drop it near an edge
        const sx = 170 + Math.random() * 60, sy = 170 + Math.random() * 60;
        const px = pick([30, 340]) + Math.random() * 40, py = 40 + Math.random() * 330;
        x.drawImage(c, sx, sy, 90, 90, px, py, 90, 90);
        const img = h('img', { class: 'quest-photo tap', src: c.toDataURL('image/jpeg', 0.9), alt: '', 'data-spot': `${(px + 45) / 4.8},${(py + 45) / 4.8}` });
        const msg = h('p', { class: 'sub centre' }, QUEST_WORDS.spotHint);
        img.addEventListener('click', (e) => {
          const r = img.getBoundingClientRect(); const fx = ((e.clientX - r.left) / r.width) * 100, fy = ((e.clientY - r.top) / r.height) * 100;
          if (Math.hypot(fx - (px + 45) / 4.8, fy - (py + 45) / 4.8) < 14) done([h('img', { class: 'quest-photo', src: img.src, alt: '' }), h('p', { class: 'quest-line' }, QUEST_WORDS.spotFound)]);
          else msg.textContent = QUEST_WORDS.spotMiss;
        });
        show(...head, img, msg);
      }));
      case 'mood': return show(...head.slice(0, 2), h('h2', { class: 'display' }, QUEST_WORDS.mood), feelingGrid((f) => quest(QUESTS.find((x) => x.id === q.match[f.id]))));
    }
  }

  return {
    starts: { cursed: () => ransom(true), seance, fog, haunted: () => remix(true), rainbow, ransom: () => ransom(false), shapes, museum, grumpy, safari, backwards, remix: () => remix(false), coin, steps, mood, sound: soundWalk, haiku },
    quest,
  };
}
