// Zoom Mystery: a super-close crop of something; zoom out for hints, guess, then go find one.
const TEXT = {
  kicker: 'From the Society’s camera',
  title: 'What is it?',
  hintsLeft: (n) => `${n} hint${n === 1 ? '' : 's'} left`,
  zoomOut: 'Zoom Out a Bit',
  breakthrough: ['It’s coming into focus…', 'Wait, look at that edge…', 'Almost there…'],
  noMore: 'No more zooming. Take a guess!',
  wrong: 'Not quite. Look again.',
  revealKicker: 'You got it',
  isIt: (a) => `It’s ${a.charAt(0).toLowerCase()}${a.slice(1)}!`,
  goFind: 'Go Find It',
  findKicker: 'Hunt mode',
  lookingFor: 'Looking for',
  aim: 'Frame it in the corners',
  findSnap: 'Snap What You Found',
  doneKicker: 'Mystery solved',
  doneTitle: 'Saved as a gem',
  gemNote: 'Wren: “Good eye. I’ve pinned it to your map.”',
  shareLine: (n) => `Zoom Mystery ✦ solved with ${n === 0 ? 'no hints' : `${n} hint${n === 1 ? '' : 's'}`}`,
  share: 'Share',
  copied: 'Copied. Paste it anywhere.',
  hints: (n) => (n === 0 ? 'Solved with no hints. Eagle eyes!' : `Solved with ${n} hint${n === 1 ? '' : 's'}.`),
  clueLabel: 'The clue',
  youLabel: 'Your find',
  again: 'Play Again',
  home: 'Back to Tools',
};

// One mystery per sample photo: interesting points (shares of the photo), the true answer, decoys.
const MYSTERIES = [
  { sample: 0, points: [[0.6, 0.38], [0.62, 0.86], [0.42, 0.5]], answer: 'A big street tree',
    decoys: ['A garden hedge', 'A head of lettuce', 'A green umbrella'], find: 'Find a tree with a trunk you could hug.' },
  { sample: 1, points: [[0.52, 0.25], [0.23, 0.6], [0.4, 0.62]], answer: 'A green front door',
    decoys: ['A garden shed', 'A mailbox', 'A wooden fence'], find: 'Find a painted door you can see from the sidewalk.' },
  { sample: 2, points: [[0.22, 0.33], [0.8, 0.47], [0.5, 0.77]], answer: 'An old orange truck',
    decoys: ['A pumpkin', 'A traffic cone', 'A fire hydrant'], find: 'Find something orange parked on the street.' },
  { sample: 3, points: [[0.55, 0.42], [0.58, 0.82], [0.68, 0.41]], answer: 'A fallen maple leaf',
    decoys: ['A slice of cheese', 'A sunflower petal', 'A yellow raincoat'], find: 'Find a fallen leaf on the path.' },
];
const ZOOMS = [0.08, 0.16, 0.3, 0.55];   // crop size as a share of the photo's short side
const SIDE = 600;                         // canvas size

export default function run(k) {
  const { h } = k;
  let last = -1;
  k.css('zoom-mystery', `
    .zm-stage { position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px var(--line); }
    .zm-stage canvas { display: block; width: 100%; height: auto; aspect-ratio: 1; }
    .zm-stage::after { content: ""; position: absolute; inset: 8px; border-radius: 8px; border: 1px solid color-mix(in srgb, var(--jewel) 45%, transparent); pointer-events: none; }
    .zm-shake { animation: zm-shake 0.35s ease; }
    @keyframes zm-shake { 20%, 60% { translate: -8px 0; } 40%, 80% { translate: 8px 0; } }
    .zm-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
    .zm-opts .btn { min-height: 56px; padding: 10px 12px; font-size: 15px; border-radius: 14px; }
    .zm-opts .btn.zm-no { opacity: 0.4; text-decoration: line-through; }
    .zm-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0 6px; }
    .zm-pair figure { margin: 0; }
    .zm-pair img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 10px; display: block; }
    .zm-pair figcaption { font: 700 10.5px var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); margin-top: 6px; text-align: center; }
    .zm-stage.zm-pop { animation: zm-pop 0.6s cubic-bezier(0.2, 1.4, 0.4, 1); }
    @keyframes zm-pop { 0% { scale: 1; } 30% { scale: 0.94; } 100% { scale: 1; } }
    .zm-flash { position: absolute; inset: 0; pointer-events: none; border-radius: 12px; box-shadow: inset 0 0 0 3px var(--jewel), inset 0 0 60px color-mix(in srgb, var(--jewel) 50%, transparent); opacity: 0; }
    .zm-pop .zm-flash { animation: zm-flash 0.7s ease-out; }
    @keyframes zm-flash { 20% { opacity: 1; } }
    .zm-lens { position: absolute; left: 50%; top: 50%; width: 30%; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; border: 2px solid var(--starlight); opacity: 0; pointer-events: none; }
    .zm-pop .zm-lens { animation: zm-lens 0.7s ease-out; }
    @keyframes zm-lens { 0% { opacity: 0.9; scale: 0.4; } 100% { opacity: 0; scale: 3.2; } }
    .zm-said { min-height: 1.3em; margin: 8px 0 0; text-align: center; font: italic 500 17px var(--f-head); color: var(--jewel); }
    .zm-said.zm-in { animation: pop 0.4s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
    .zm-hunt { --hunt: #9883F8; position: relative; flex: 1; min-height: 260px; margin-top: 10px; border-radius: 18px; overflow: hidden;
      background: radial-gradient(80% 70% at 50% 45%, color-mix(in srgb, #9883F8 22%, var(--velvet)), var(--ink)); display: flex; align-items: center; justify-content: center; }
    .zm-hunt .zm-c { position: absolute; width: 38px; height: 38px; border: 4px solid var(--hunt); filter: drop-shadow(0 0 8px var(--hunt)); }
    .zm-hunt .zm-c.tl { top: 18px; left: 18px; border-right: 0; border-bottom: 0; border-top-left-radius: 12px; }
    .zm-hunt .zm-c.tr { top: 18px; right: 18px; border-left: 0; border-bottom: 0; border-top-right-radius: 12px; }
    .zm-hunt .zm-c.bl { bottom: 18px; left: 18px; border-right: 0; border-top: 0; border-bottom-left-radius: 12px; }
    .zm-hunt .zm-c.br { bottom: 18px; right: 18px; border-left: 0; border-top: 0; border-bottom-right-radius: 12px; }
    .zm-hunt .zm-c { animation: zm-breathe 2.4s ease-in-out infinite; }
    @keyframes zm-breathe { 50% { scale: 0.9; } }
    .zm-aim { font: 700 12px var(--f-body); letter-spacing: 0.16em; text-transform: uppercase; color: var(--hunt); }
    .zm-thumb { position: absolute; top: 18px; left: 50%; translate: -50% 0; display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 999px;
      background: color-mix(in srgb, var(--ink) 75%, transparent); border: 1px solid var(--hunt); font: 700 11px var(--f-body); letter-spacing: 0.1em; text-transform: uppercase; color: var(--mist); white-space: nowrap; }
    .zm-thumb img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; display: block; }
    .zm-huntcam .shutter { border-color: #9883F8; box-shadow: 0 0 28px color-mix(in srgb, #9883F8 50%, transparent); }
    .zm-huntcam .shutter::before { content: ""; position: absolute; inset: 0; margin: auto; width: 26px; height: 20px; z-index: 1; border-radius: 5px; background: #9883F8;
      -webkit-mask: radial-gradient(circle at 50% 55%, transparent 5px, #000 6px); mask: radial-gradient(circle at 50% 55%, transparent 5px, #000 6px); }
    .zm-gem { position: relative; width: 74px; margin: 0 auto 8px; animation: land 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) both; filter: drop-shadow(0 8px 20px color-mix(in srgb, var(--jewel) 55%, transparent)); }
    .zm-gem svg { width: 100%; display: block; }
    .zm-share { display: flex; align-items: center; gap: 10px; margin: 14px 0 4px; padding: 8px 8px 8px 14px; border-radius: 999px; border: 1px solid var(--line); }
    .zm-share span { flex: 1; font: 700 13px var(--f-body); color: var(--starlight); min-width: 0; }
    .zm-share .btn { width: auto; min-height: 44px; padding: 8px 18px; }
    .zm-reveal { max-height: 46dvh; object-fit: cover; margin-top: 12px; animation: zm-out 0.6s cubic-bezier(0.2, 1, 0.3, 1) both; }
    @keyframes zm-out { from { scale: 2.2; opacity: 0.4; } }
  `);

  newMystery();

  async function newMystery() {
    let i;
    do { i = Math.floor(Math.random() * MYSTERIES.length); } while (i === last);
    last = i;
    const m = MYSTERIES[i];
    const img = await k.loadImage(k.samplePhoto(m.sample));
    clue(m, img, k.pick(m.points));
  }

  function clue(m, img, [fx, fy]) {
    const c = h('canvas', { width: SIDE, height: SIDE, 'aria-label': TEXT.title });
    const ctx = c.getContext('2d');
    let level = 0, shown = ZOOMS[0], raf = 0;
    k.onLeave(() => cancelAnimationFrame(raf));

    // crop around the point, kept inside the photo
    const paint = (z) => {
      const short = Math.min(img.naturalWidth, img.naturalHeight);
      const s = short * z;
      const sx = Math.min(img.naturalWidth - s, Math.max(0, fx * img.naturalWidth - s / 2));
      const sy = Math.min(img.naturalHeight - s, Math.max(0, fy * img.naturalHeight - s / 2));
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, s, s, 0, 0, SIDE, SIDE);
    };
    const glide = (to) => {
      cancelAnimationFrame(raf);
      const from = shown, t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 500), e = 1 - (1 - p) ** 3;
        shown = from + (to - from) * e; paint(shown);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    paint(shown);
    const firstCrop = c.toDataURL('image/jpeg', 0.85);

    const count = h('span', { class: 'count' }, TEXT.hintsLeft(ZOOMS.length - 1));
    const stage = h('div', { class: 'zm-stage' }, c, h('div', { class: 'zm-flash' }), h('div', { class: 'zm-lens' }));
    const said = h('p', { class: 'zm-said', 'aria-live': 'polite' });
    const zoom = h('button', { class: 'btn ghost', onclick: () => {
      if (level >= ZOOMS.length - 1) return k.toast(TEXT.noMore);
      level += 1; glide(ZOOMS[level]);
      // a little breakthrough: the lens pulls back, the frame flashes, Wren reacts
      stage.classList.remove('zm-pop'); void stage.offsetWidth; stage.classList.add('zm-pop');
      said.textContent = TEXT.breakthrough[level - 1] || '';
      said.classList.remove('zm-in'); void said.offsetWidth; said.classList.add('zm-in');
      count.textContent = TEXT.hintsLeft(ZOOMS.length - 1 - level);
      if (level >= ZOOMS.length - 1) zoom.disabled = true;
    } }, TEXT.zoomOut);
    const opts = k.shuffle([m.answer, ...m.decoys]).map((o) => h('button', { class: 'btn ghost', onclick: (e) => {
      if (o === m.answer) return reveal(m, img, level, firstCrop);
      e.currentTarget.classList.add('zm-no'); e.currentTarget.disabled = true;
      stage.classList.remove('zm-shake'); void stage.offsetWidth; stage.classList.add('zm-shake');
      k.toast(TEXT.wrong);
    } }, o));

    const head = k.bar();
    head.append(count);
    k.show(
      head,
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display', style: 'font-size:30px;margin-bottom:12px' }, TEXT.title),
      stage,
      said,
      h('div', { class: 'btns', style: 'margin-top:8px' }, zoom),
      h('div', { class: 'zm-opts' }, opts),
    );
  }

  function reveal(m, img, hints, crop) {
    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.revealKicker),
      h('h1', { class: 'display', style: 'font-size:30px' }, TEXT.isIt(m.answer)),
      h('img', { class: 'photo zm-reveal', src: img.src, alt: m.answer }),
      h('p', { class: 'sub' }, m.find),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: () => findIt(m, hints, crop) }, TEXT.goFind)),
    );
  }

  // Hunt mode: purple viewfinder corners, the clue in a pill, and the camera button.
  function findIt(m, hints, crop) {
    k.show(
      k.bar(),
      h('p', { class: 'kicker', style: 'color:#9883F8' }, TEXT.findKicker),
      h('h1', { class: 'display', style: 'font-size:26px' }, m.find),
      h('div', { class: 'zm-hunt' },
        ['tl', 'tr', 'bl', 'br'].map((c) => h('span', { class: `zm-c ${c}`, 'aria-hidden': 'true' })),
        h('div', { class: 'zm-thumb' }, h('img', { src: crop, alt: '' }), TEXT.lookingFor),
        h('span', { class: 'zm-aim' }, TEXT.aim)),
      h('div', { class: 'zm-huntcam' }, k.camera(TEXT.findSnap, (url) => done(hints, crop, url), () => k.samplePhoto(m.sample))),
    );
  }

  // Spoiler-free share: the phone's share sheet, else copy, else just a toast.
  async function share(text) {
    try { if (navigator.share) { await navigator.share({ text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text); } catch (e) { /* no clipboard */ }
    k.toast(TEXT.copied);
  }

  function gemSvg() {
    return h('svg', { viewBox: '0 0 120 110', 'aria-hidden': 'true' },
      h('polygon', { points: '30,10 90,10 115,40 60,105 5,40', style: 'fill: var(--jewel)' }),
      h('polygon', { points: '30,10 45,40 5,40', style: 'fill: var(--starlight)', opacity: '0.35' }),
      h('polygon', { points: '45,40 75,40 60,105', style: 'fill: var(--starlight)', opacity: '0.18' }),
      h('polygon', { points: '30,10 90,10 75,40 45,40', style: 'fill: var(--starlight)', opacity: '0.25' }),
      h('polygon', { points: '75,40 115,40 60,105', style: 'fill: var(--ink)', opacity: '0.14' }));
  }

  function done(hints, crop, url) {
    const line = TEXT.shareLine(hints);   // never names the answer
    k.openSheet([
      h('div', { class: 'celebrate' },
        h('div', { class: 'zm-gem' }, gemSvg()),
        h('p', { class: 'kicker' }, TEXT.doneKicker),
        h('h3', {}, TEXT.doneTitle),
        h('p', { class: 'more' }, TEXT.gemNote)),
      h('div', { class: 'zm-pair' },
        h('figure', {}, h('img', { src: crop, alt: TEXT.clueLabel }), h('figcaption', {}, TEXT.clueLabel)),
        h('figure', {}, h('img', { src: url, alt: TEXT.youLabel }), h('figcaption', {}, TEXT.youLabel))),
      h('p', { class: 'hint centre' }, TEXT.hints(hints)),
      h('div', { class: 'zm-share' }, h('span', {}, line), h('button', { class: 'btn ghost', onclick: () => share(line) }, TEXT.share)),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: newMystery }, TEXT.again),
        h('button', { class: 'link', onclick: k.home }, TEXT.home)),
    ], null, k.tool.jewel);
  }
}
