// Case Card: a spoiler-free "chapter complete" card. Route shape, clue squares, time and steps. Never the answers.
const TEXT = {
  kicker: 'Chapter complete',
  title: 'Case 2 closed',
  sub: 'Here’s your report card. It shows how you did, never what you found, so friends can still play it.',
  styleLabel: 'Card style',
  styles: { night: 'Night', pearl: 'Pearl', jewel: 'Jewel' },
  share: 'Share My Card',
  copy: 'Copy as Text',
  save: 'Save Image',
  copied: 'Copied. Paste it anywhere.',
  saved: 'Card saved',
  shareFallback: 'Sharing isn’t on here, so I copied it instead',
  copyFail: 'Couldn’t copy on this device',
  // the card itself
  brand: 'STORY CITY',
  chapter: 'The Summons · Chapter 2',
  cardTitle: 'Case 2 closed',
  cluesLine: (f, n, hints) => `${f}/${n} clues · ${hints} hint${hints === 1 ? '' : 's'}`,
  walked: 'walked',
  steps: 'steps',
  footer: 'storycity.app · no spoilers inside',
  textTail: 'Can you close it faster?',
  // payoff
  doneKicker: 'Report filed',
  doneTitle: 'Perfectly vague',
  doneSub: 'Wren: “Not a single spoiler. The Society approves.”',
  another: 'Try Another Style',
  home: 'Back to Tools',
};

// The pretend chapter: clue results in the order found, plus walk stats.
const RUN = {
  clues: ['found', 'found', 'hint', 'found', 'missed', 'found'],
  minutes: 38,
  steps: 4212,
  km: 2.6,
};
// The route as an abstract squiggle (shares of the box). No map, no streets.
const ROUTE = [[0.08, 0.72], [0.2, 0.5], [0.33, 0.6], [0.42, 0.3], [0.58, 0.22], [0.66, 0.48], [0.8, 0.4], [0.92, 0.16]];
const CLUE_AT = [1, 2, 3, 4, 5, 6];   // which route point each clue sits on (index into ROUTE)

// Three looks. Every colour is from the brand palette.
const LOOKS = {
  night: { bg: ['#1a0b3d', '#2a1658'], ink: '#fbf7ff', soft: '#a493d6', line: '#46337e', route: '#c49bff', found: '#9883F8', hint: '#F5B82E', empty: '#46337e' },
  pearl: { bg: ['#f4ebdd', '#fbf7ff'], ink: '#1a0b3d', soft: '#46337e', line: '#C9C6D3', route: '#9883F8', found: '#9883F8', hint: '#ED8D00', empty: '#C9C6D3' },
  jewel: { bg: ['#9883F8', '#ED54B3'], ink: '#1a0b3d', soft: '#2a1658', line: '#fbf7ff', route: '#fbf7ff', found: '#1a0b3d', hint: '#F5B82E', empty: '#DA82ED' },
};
const EMOJI = { found: '🟪', hint: '🟨', missed: '⬛' };
const W = 600, H = 780;

export default function run(k) {
  const { h, show, bar, toast, openSheet, closeSheet, css, tool, home } = k;
  css('case-card', CSS);
  let look = 'night';
  let filed = false;
  const found = RUN.clues.filter((c) => c !== 'missed').length;
  const hints = RUN.clues.filter((c) => c === 'hint').length;

  const canvas = h('canvas', { class: 'cc-card', width: W, height: H, role: 'img', 'aria-label': `${TEXT.cardTitle}. ${TEXT.cluesLine(found, RUN.clues.length, hints)}` });
  const tabs = Object.keys(LOOKS).map((id) => h('button', {
    class: 'cc-tab', 'data-look': id, 'aria-pressed': String(id === look), style: `--a:${LOOKS[id].bg[0]};--b:${LOOKS[id].bg[1]}`,
    onclick: () => { look = id; tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.look === id))); draw(); },
  }, h('i', { 'aria-hidden': 'true' }), TEXT.styles[id]));

  function screen() {
    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('p', { class: 'sub' }, TEXT.sub),
      h('div', { class: 'cc-wrap' }, canvas),
      h('div', { class: 'cc-tabs', role: 'group', 'aria-label': TEXT.styleLabel }, tabs),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', id: 'ccShare', onclick: share }, TEXT.share),
        h('div', { class: 'cc-row' },
          h('button', { class: 'link', id: 'ccCopy', onclick: copy }, TEXT.copy),
          h('button', { class: 'link', id: 'ccSave', onclick: save }, TEXT.save))),
    );
    // Wait for Erode so the canvas title isn't drawn in a fallback font.
    draw();
    document.fonts?.ready.then(draw);
  }

  /* ---------- the card, drawn on canvas (so Save Image matches what you see) ---------- */
  function draw() {
    const L = LOOKS[look];
    const c = canvas.getContext('2d');
    const head = getComputedStyle(document.body).getPropertyValue('--f-head') || 'Georgia, serif';
    const body = getComputedStyle(document.body).getPropertyValue('--f-body') || 'system-ui, sans-serif';
    const g = c.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, L.bg[0]); g.addColorStop(1, L.bg[1]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // inner frame
    c.strokeStyle = L.line; c.lineWidth = 2; roundRect(c, 22, 22, W - 44, H - 44, 22); c.stroke();
    c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.fillStyle = L.soft; c.font = `700 20px ${body}`; spaced(c, TEXT.brand, W / 2, 84, 6);
    c.font = `500 24px ${body}`; c.fillText(TEXT.chapter, W / 2, 122);
    c.fillStyle = L.ink; c.font = `600 58px ${head}`; c.fillText(TEXT.cardTitle, W / 2, 196);
    route(c, L, 70, 236, W - 140, 200);
    squares(c, L, 280 + 196);
    c.fillStyle = L.ink; c.font = `700 24px ${body}`;
    c.fillText(TEXT.cluesLine(found, RUN.clues.length, hints), W / 2, 580);
    stats(c, L, head, body, 628);
    c.fillStyle = L.soft; c.font = `500 18px ${body}`; c.fillText(TEXT.footer, W / 2, H - 52);
  }

  // The route: a smooth line through the points, start ring, finish star, a dot at each clue.
  function route(c, L, x, y, w, hh) {
    const P = ROUTE.map(([px, py]) => [x + px * w, y + py * hh]);
    c.save();
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = L.route; c.lineWidth = 7;
    c.beginPath(); c.moveTo(...P[0]);
    for (let i = 1; i < P.length - 1; i++) {
      const mx = (P[i][0] + P[i + 1][0]) / 2, my = (P[i][1] + P[i + 1][1]) / 2;
      c.quadraticCurveTo(P[i][0], P[i][1], mx, my);
    }
    c.lineTo(...P[P.length - 1]); c.stroke();
    RUN.clues.forEach((r, i) => {
      if (r === 'missed') return;
      const [px, py] = P[CLUE_AT[i]];
      c.fillStyle = r === 'hint' ? L.hint : L.found;
      c.strokeStyle = L.bg[0]; c.lineWidth = 4;
      c.beginPath(); c.arc(px, py, 9, 0, Math.PI * 2); c.fill(); c.stroke();
    });
    c.strokeStyle = L.ink; c.lineWidth = 4;
    c.beginPath(); c.arc(...P[0], 11, 0, Math.PI * 2); c.stroke();
    star(c, ...P[P.length - 1], 18, L.ink);
    c.restore();
  }

  // The Wordle-like row: one square per clue.
  function squares(c, L, y) {
    const n = RUN.clues.length, s = 56, gap = 12;
    let x = (W - (n * s + (n - 1) * gap)) / 2;
    RUN.clues.forEach((r) => {
      roundRect(c, x, y - s, s, s, 10);
      if (r === 'missed') { c.strokeStyle = L.empty; c.lineWidth = 4; c.stroke(); } else { c.fillStyle = r === 'hint' ? L.hint : L.found; c.fill(); }
      x += s + gap;
    });
  }

  function stats(c, L, head, body, y) {
    const cols = [[`${RUN.minutes} min`, TEXT.walked], [RUN.steps.toLocaleString('en-CA'), TEXT.steps], [`${RUN.km} km`, '']];
    cols.forEach(([big, small], i) => {
      const x = W / 2 + (i - 1) * 170;
      c.fillStyle = L.ink; c.font = `600 34px ${head}`; c.fillText(big, x, y);
      c.fillStyle = L.soft; c.font = `600 16px ${body}`; spaced(c, small.toUpperCase(), x, y + 28, 3);
    });
    c.strokeStyle = L.line; c.lineWidth = 2;
    [-1, 1].forEach((d) => { c.beginPath(); c.moveTo(W / 2 + d * 85, y - 30); c.lineTo(W / 2 + d * 85, y + 30); c.stroke(); });
  }

  /* ---------- copy / share / save ---------- */
  function asText() {
    return [
      `Story City · ${TEXT.chapter}`,
      `${TEXT.cardTitle} ✦`,
      RUN.clues.map((r) => EMOJI[r]).join(''),
      TEXT.cluesLine(found, RUN.clues.length, hints),
      `${RUN.minutes} min · ${RUN.steps.toLocaleString('en-CA')} ${TEXT.steps} · ${RUN.km} km`,
      TEXT.textTail,
    ].join('\n');
  }

  async function copy() {
    try { await navigator.clipboard.writeText(asText()); toast(TEXT.copied); } catch (e) { toast(TEXT.copyFail); }
    payoff();
  }

  async function share() {
    const text = asText();
    if (navigator.share) {
      try {
        const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.92));
        const file = blob && new File([blob], 'case-card.jpg', { type: 'image/jpeg' });
        const data = file && navigator.canShare?.({ files: [file] }) ? { text, files: [file] } : { text };
        await navigator.share(data);
        return payoff();
      } catch (e) {
        if (e.name === 'AbortError') return;   // they closed the share sheet
      }
    }
    try { await navigator.clipboard.writeText(text); } catch (e) { /* toast still explains */ }
    toast(TEXT.shareFallback);
    payoff();
  }

  function save() {
    const a = h('a', { href: canvas.toDataURL('image/jpeg', 0.92), download: `case-card-${look}.jpg` });
    document.body.append(a); a.click(); a.remove();
    toast(TEXT.saved);
    payoff();
  }

  // The payoff sheet, once per visit (later actions just toast).
  function payoff() {
    if (filed) return;
    filed = true;
    setTimeout(() => openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.doneKicker),
        h('div', { class: 'cc-mini', 'aria-hidden': 'true' }, RUN.clues.map((r) => h('i', { class: `cc-sq ${r}` }))),
        h('h3', {}, TEXT.doneTitle),
        h('p', { class: 'more' }, TEXT.doneSub)),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: closeSheet }, TEXT.another),
        h('button', { class: 'link', onclick: home }, TEXT.home)),
    ], null, tool.jewel), 500);
  }

  screen();
}

/* ---------- canvas helpers ---------- */
function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function star(c, x, y, r, fill) {
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2, rr = i % 2 ? r * 0.38 : r;
    c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath(); c.fillStyle = fill; c.fill();
}
// Letter-spaced text (canvas letterSpacing isn't everywhere yet).
function spaced(c, text, x, y, gap) {
  const chars = [...text];
  const total = chars.reduce((s, ch) => s + c.measureText(ch).width, 0) + gap * (chars.length - 1);
  let cx = x - total / 2;
  const align = c.textAlign; c.textAlign = 'left';
  chars.forEach((ch) => { c.fillText(ch, cx, y); cx += c.measureText(ch).width + gap; });
  c.textAlign = align;
}

const CSS = `
.cc-wrap { margin: 18px auto 0; width: min(100%, 300px); }
.cc-card { display: block; width: 100%; height: auto; border-radius: 14px; box-shadow: 0 14px 34px rgba(11, 6, 32, 0.6); }
.cc-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
.cc-tab { min-height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 999px; border: 1.5px solid var(--line); background: none; font: 600 14px var(--f-body); color: var(--mist); }
.cc-tab i { width: 16px; height: 16px; border-radius: 50%; background: linear-gradient(135deg, var(--a), var(--b)); box-shadow: 0 0 0 1px var(--line); }
.cc-tab[aria-pressed="true"] { border-color: var(--jewel); color: var(--starlight); background: color-mix(in srgb, var(--jewel) 14%, transparent); }
.cc-row { display: flex; justify-content: center; gap: 8px; }
.cc-mini { display: flex; justify-content: center; gap: 6px; margin: 6px 0 14px; }
.cc-sq { width: 26px; height: 26px; border-radius: 6px; background: #9883F8; }
.cc-sq.hint { background: #F5B82E; }
.cc-sq.missed { background: none; box-shadow: inset 0 0 0 3px var(--line); }
`;
