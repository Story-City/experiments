// Script tab: drop in a script; we find chapters, choices, chat lines, puzzles and asset slots.
export function createScriptView(root, ctx) {
  const { icon, esc, parseScript, toStory, prepare, toast } = ctx;
  const KEY = 'ct-script-draft';
  const WORDS_PER_MIN = 200;
  const SUGGEST_MAX = 7;
  const load = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* private window */ } };
  const OUTLINE = `# My new story

## 1: Opening · START
Generic location: First stop
Set the scene in a few lines.
GUIDE: Welcome. Ready?
- [Let's go] → 2: The second stop

## 2: The second stop
Generic location: Second stop
[Image of the place]
[Puzzle: riddle — answer ]
- [I solved it] → 3a: Good ending (needs: ANSWER)
- [Give up] → 3b: Another ending

## 3a: Good ending · END
Location off
Wrap it up.

## 3b: Another ending · END
Location off
Another way out.
`;
  const INSERTS = [
    { k: 'chapter', ic: 'script', label: 'Chapter', tip: 'New chapter heading' },
    { k: 'choice', ic: 'arrow', label: 'Choice', tip: 'A choice and where it goes' },
    { k: 'loc', ic: 'pin', label: 'Location', tip: 'A stop on the map' },
    { k: 'chat', ic: 'chat', label: 'Chat', tip: 'A chat bubble from a character' },
    { k: 'sms', ic: 'chat', label: 'Text msg', tip: 'A text message bubble' },
    { k: 'image', ic: 'image', label: 'Image', tip: 'A slot for an image' },
    { k: 'sound', ic: 'sound', label: 'Sound', tip: 'A slot for a sound' },
    { k: 'video', ic: 'video', label: 'Video', tip: 'A slot for a video' },
    { k: 'puzzle', ic: 'puzzle', label: 'Puzzle', tip: 'A puzzle with its answer' },
    { k: 'fr', ic: 'lang', label: 'French', tip: 'French version of this chapter' },
  ];

  root.innerHTML = `
    <div class="sbar"><div class="stats" id="stats"></div>
      <label class="btn btn--ghost" id="bulkLbl" title="Add several image, sound or video files. We match them to slots by name.">${icon('files')} Add files<input type="file" id="bulk" multiple accept="image/*,audio/*,video/*" hidden></label>
      <button class="btn" id="splay" disabled title="Test play the script">${icon('play')} Play</button>
      <button class="btn btn--fill" id="make" disabled>${icon('map')} Make chapters</button></div>
    <div class="split">
      <div class="editor" id="editor">
        <div class="editor__head">
          <h2>Your script</h2>
          <select class="btn btn--ghost exsel" id="examples" aria-label="Start from an example"><option value="">Examples…</option><option value="summons">The Summons (sample)</option><option value="outline">3-stop outline</option></select>
          <label class="btn btn--ghost">${icon('upload')} Open file<input type="file" id="file" accept=".txt,.md,.markdown,text/plain" hidden></label>
          <button class="iconbtn" id="fmt" aria-label="How to format a script" aria-expanded="false" title="How to format a script">${icon('help', 18)}</button>
          <button class="iconbtn" id="clear" aria-label="Clear" title="Clear">${icon('close', 18)}</button>
        </div>
        <div class="inserts" id="inserts" role="toolbar" aria-label="Insert">${INSERTS.map((x) => `<button class="ins" data-ins="${x.k}" title="${x.tip}">${icon(x.ic, 13)}${x.label}</button>`).join('')}</div>
        <div class="help" id="helpBox" hidden>
          <b>Write it the way you already do.</b> Or use the buttons above. We spot these:
          <table>
            <tr><td><code class="t-h">## 3a: The Mailbox</code></td><td>a chapter (add <code>· START</code> or <code>· END</code>)</td></tr>
            <tr><td><code class="t-loc">Location off</code><br><code class="t-loc">Generic location: Mailbox</code></td><td>no walk / a stop on the map</td></tr>
            <tr><td><code><span class="t-sp">WREN:</span> Hello there</code></td><td>a chat bubble</td></tr>
            <tr><td><code class="t-sms">***Look out your window***</code></td><td>a text message bubble</td></tr>
            <tr><td><code class="t-as">[Image of …]</code> <code class="t-as">[SFX - …]</code> <code class="t-as">[Video …]</code></td><td>a slot for a file</td></tr>
            <tr><td><code class="t-pz">[Puzzle: decrypt — answer 786666]</code></td><td>a puzzle (decrypt, remix, photo, riddle)</td></tr>
            <tr><td><code class="t-ch">- [I'm here] → 3a: The Mailbox</code></td><td>a choice and where it goes. Type <b>→</b> or <b>-&gt;</b> and pick a chapter.</td></tr>
            <tr><td><code class="t-ch">… (needs: MATCH_NUMBER)</code></td><td>a locked choice</td></tr>
            <tr><td><code class="t-fr">[FR]</code></td><td>the French version of that chapter follows</td></tr>
          </table>
        </div>
        <div class="code" id="code">
          <pre class="hl" id="hl" aria-hidden="true"></pre>
          <textarea id="src" spellcheck="false" placeholder="Paste your script here, or drop a .txt or .md file on this box.&#10;&#10;## 1: The Summons · START&#10;It's an ordinary day…&#10;- [I'm here] → 1b: A mysterious figure"></textarea>
        </div>
        <div class="suggest" id="suggest" hidden role="listbox" aria-label="Chapters"></div>
      </div>
      <div class="preview" id="preview">
        <svg class="rail" id="rail"></svg>
        <div id="checks"></div>
        <div id="chaps"></div>
      </div>
    </div>`;
  const $ = (s) => root.querySelector(s);
  const src = $('#src'); const preview = $('#preview'); const chapsEl = $('#chaps'); const rail = $('#rail');
  const hlEl = $('#hl'); const sug = $('#suggest');
  let parsed = { chapters: [] }; let model = null; let lang = 'en';
  const files = ctx.files; // "heading|block" -> { name, url }
  let timer = null; let curId = null;

  src.value = load();

  function storyTitle() {
    const m = src.value.match(/^\s*#\s+(?!#)(.+)$/m);
    return m && parsed.preamble ? m[1].trim() : (parsed.chapters[0] ? parsed.chapters[0].title : 'Your script');
  }

  function reparse() {
    parsed = parseScript(src.value);
    model = parsed.chapters.length ? prepare(toStory(parsed, storyTitle())) : null;
    render(); paintCode(); ctx.onScript && ctx.onScript(model);
  }

  // ---------- coloured script ----------
  function paintCode() {
    const bad = new Set(); const good = new Set();
    for (const c of parsed.chapters) for (const k of c.choices) (k.to ? good : bad).add(k.line);
    const lines = src.value.split('\n');
    hlEl.innerHTML = lines.map((raw, n) => {
      const t = raw.trim();
      if (/^\s*#{1,4}\s/.test(raw)) return `<span class="t-h">${esc(raw)}</span>`;
      if (/^\s*\[(FR|FRENCH|FRANÇAIS)\]\s*$/i.test(raw)) return `<span class="t-fr">${esc(raw)}</span>`;
      const ch = raw.match(/^(\s*[-*•]\s*\*{0,2}\[.+?\]\*{0,2}\s*)((?:→|->|=>)\s*)(.*)$/);
      if (ch) return `<span class="t-ch">${esc(ch[1])}${esc(ch[2])}</span><span class="${bad.has(n) ? 't-bad' : 't-to'}">${esc(ch[3])}</span>`;
      if (/^[-*•]\s*\*{0,2}\[/.test(t)) return `<span class="t-ch">${esc(raw)}</span>`;
      if (/^\*?(location off|(generic )?location\s*:)/i.test(t)) return `<span class="t-loc">${esc(raw)}</span>`;
      if (/^\*?\[\s*puzzle/i.test(t)) return `<span class="t-pz">${esc(raw)}</span>`;
      if (/^\*?[[(]\s*(image|picture|photo|overlay|sfx|sound|audio|music|voice ?over|vo|video)\b/i.test(t)) return `<span class="t-as">${esc(raw)}</span>`;
      if (/^\*{3}[^*].*\*{3}$/.test(t)) return `<span class="t-sms">${esc(raw)}</span>`;
      const sp = raw.match(/^(\s*\**(?:[A-Z][A-Z .'’-]{1,24}|[A-Z][a-z]+(?: [A-Z][a-z]+)?)\**\s*:)(\s+.+)$/);
      if (sp && !/^(\s*)(note|notes|location|generic location|needs|answer|todo|sfx|image)\s*:/i.test(sp[1])) return `<span class="t-sp">${esc(sp[1])}</span>${esc(sp[2])}`;
      return esc(raw);
    }).join('\n') + '\n ';
    hlEl.scrollTop = src.scrollTop;
  }
  src.addEventListener('scroll', () => { hlEl.scrollTop = src.scrollTop; });

  // ---------- checks ----------
  function checks() {
    const out = [];
    if (!model) return out;
    const starts = parsed.chapters.filter((c) => c.start);
    if (starts.length > 1) out.push({ id: starts[1].id, kind: 'block', text: `${starts.length} chapters are marked · START. Keep one.` });
    parsed.chapters.forEach((c) => {
      c.choices.forEach((k) => { if (!k.to) out.push({ id: c.id, line: k.line, kind: 'block', text: `“${k.label}” in ${c.code || c.title} goes to “${k.target}”, which isn't a chapter.` }); });
      const m = model.byId.get(c.id);
      if (!m.reached) out.push({ id: c.id, kind: 'block', text: `${c.code || c.title} can't be reached from the start.` });
      if (!c.end && !c.choices.length) out.push({ id: c.id, kind: 'block', text: `${c.code || c.title} has no choices. Add one, or mark it · END.` });
      c.blocks.forEach((b) => { if (b.type === 'puzzle' && !b.answer) out.push({ id: c.id, line: b.line, kind: 'check', text: `The puzzle in ${c.code || c.title} has no answer yet.` }); });
    });
    const slots = allSlots();
    const empty = slots.filter((x) => !files.has(key(x.c, x.i)));
    if (empty.length) out.push({ id: empty[0].c.id, kind: 'check', text: `${empty.length} of ${slots.length} image, sound and video slots still need a file.`, files: true });
    if (lang === 'fr') {
      const miss = parsed.chapters.filter((c) => !c.frBlocks);
      if (miss.length) out.push({ id: miss[0].id, kind: 'fr', text: `${miss.length} of ${parsed.chapters.length} chapters need French.` });
    }
    return out;
  }
  const key = (c, i) => c.heading + '|' + i;
  const allSlots = () => parsed.chapters.flatMap((c) => c.blocks.map((b, i) => ({ c, b, i })).filter((x) => x.b.type === 'asset'));
  const words = (blocks) => blocks.reduce((s, b) => s + (b.text ? b.text.split(/\s+/).length : 0), 0);

  // ---------- render ----------
  function block(c, b, i) {
    if (b.type === 'text') return `<p class="para">${esc(b.text)}</p>`;
    if (b.type === 'chat') return `<div class="bubble ${b.phone ? 'phone' : ''}"><small>${esc(b.who)}</small>${esc(b.text)}</div>`;
    if (b.type === 'puzzle') {
      return `<div class="puz"><div class="slot__icon">${icon('puzzle', 18)}</div><div class="slot__text"><b>Puzzle${b.answer ? ` · answer ${esc(b.answer)}` : ''}</b>${esc(b.desc.replace(/answer\s*[:=]?\s*[^,;]*/i, '').replace(/[—–\-,;\s]+$/, '') || '')}${b.answer ? '' : ' <span style="color:var(--bad)">No answer yet</span>'}</div>
        <select data-pline="${b.line}" aria-label="Puzzle type">${['decrypt', 'remix', 'photo', 'riddle'].map((k) => `<option ${k === b.kind ? 'selected' : ''}>${k}</option>`).join('')}</select></div>`;
    }
    if (b.type === 'asset') return slotHTML(c, i, b, i >= 0 ? files.get(key(c, i)) : null);
    return '';
  }
  function slotHTML(c, i, b, f) {
    const kind = b.atype;
    const label = { image: 'Image', sound: 'Sound', video: 'Video' }[kind];
    const accept = { image: 'image/*', sound: 'audio/*', video: 'video/*' }[kind];
    const thumb = f && kind === 'image' ? `<img src="${f.url}" alt="">` : icon(kind === 'sound' ? 'sound' : kind, 18);
    if (i < 0) return `<div class="slot"><div class="slot__icon">${thumb}</div><div class="slot__text"><b>${label}</b>${esc(b.desc)}</div></div>`;
    return `<div class="slot ${f ? 'filled' : ''}" data-slot="${esc(key(c, i))}" data-kind="${kind}">
      <div class="slot__icon">${thumb}</div>
      <div class="slot__text"><b>${label}${f ? ' · added' : ''}</b>${esc(f ? f.name : b.desc)}</div>
      ${f && kind === 'sound' ? `<audio controls src="${f.url}" preload="none"></audio>` : ''}
      <label class="btn btn--ghost sm">${f ? 'Replace' : 'Add file'}<input type="file" accept="${accept}"></label></div>`;
  }

  function chapterHTML(c, idx) {
    const m = model.byId.get(c.id);
    const col = m.stop >= 0 ? model.stops[m.stop].colour : { c: '#B0B7C6', bg: '#F6F7F9' };
    const showFr = lang === 'fr' && c.frBlocks;
    const blocks = showFr ? c.frBlocks : c.blocks;
    const mins = Math.max(1, Math.round(words(c.blocks) / WORDS_PER_MIN));
    const options = (k) => `<option value="">(goes nowhere)</option>` + parsed.chapters.map((t) =>
      `<option value="${t.id}" ${t.id === k.to ? 'selected' : ''}>${esc(t.heading)}</option>`).join('');
    return `<article class="chap ${c.id === curId ? 'cur' : ''}" data-id="${c.id}" style="--sc:${col.c};--sbg:${col.bg}">
      <div class="chap__head">
        <button class="chap__jump" data-line="${c.line}" title="Show in the script">
          <span class="chap__num">${idx + 1}${c.code ? ' · ' + esc(c.code) : ''}</span>
          <span class="chap__title">${esc(c.title)}</span></button>
        ${c.start ? `<span class="node__badge b-start">${icon('play', 10)} START</span>` : ''}
        ${c.end ? `<span class="node__badge b-end">${icon('flag', 10)} END</span>` : ''}
        ${m.loc ? `<span class="fact small">${icon('pin', 13)} ${c.place ? esc(c.place) : 'Location on'}</span>` : `<span class="fact small">${icon('pinOff', 13)} Location off</span>`}
        ${lang === 'fr' ? (c.frBlocks ? '<span class="node__badge b-fr">FR ✓</span>' : '<span class="node__badge b-frmiss">FR missing</span>') : ''}
        <span class="chap__mins" title="Reading time">~${mins} min</span>
        <button class="iconbtn sm" data-playfrom="${c.id}" aria-label="Play from here" title="Play from here">${icon('play', 14)}</button>
      </div>
      <div class="chap__body">
        ${lang === 'fr' && !c.frBlocks ? `<div class="frmissing">No French yet. <button class="plainlink" data-addfr="${c.id}">Add a [FR] section</button> under this chapter, then the French text.</div>` : ''}
        ${showFr ? '<div class="frnote">Français</div>' : ''}
        ${blocks.map((b, i) => block(c, b, showFr ? -1 - i : i)).join('')}
        ${c.choices.length ? `<div class="chs">${c.choices.map((k, i) => `
          <div class="ch ${k.to ? '' : 'broken'}" draggable="true" data-line="${k.line}" data-from="${c.id}" title="Drag onto a chapter to send this choice there">
            <span class="ch__grip" aria-hidden="true">⋮⋮</span><span class="ch__lbl">[${esc(showFr && c.frChoices[i] ? c.frChoices[i] : k.label)}]</span><span class="ch__arrow">${icon('arrow', 15)}</span>
            <select data-line="${k.line}" aria-label="Where this choice goes">${options(k)}</select>
            ${k.needs ? `<span class="needs">${icon('lock', 11)} needs ${esc(k.needs === 'MATCH_NUMBER' ? 'a number' : k.needs.toLowerCase().replace(/_/g, ' '))}</span>` : ''}
          </div>`).join('')}</div>` : (c.end ? `<div class="endnote">${icon('flag', 15)} Ending</div>` : '')}
      </div>
    </article>`;
  }

  function render() {
    const has = !!model;
    $('#make').disabled = !has; $('#splay').disabled = !has; $('#bulkLbl').classList.toggle('off', !has);
    if (!has) {
      $('#stats').innerHTML = '<span class="muted small">Nothing yet. Paste a script on the left, drop a file on it, or start from an example.</span>';
      $('#checks').innerHTML = '';
      chapsEl.innerHTML = `<div class="empty">${icon('script', 44)}<p><b>Drop in your script</b><br>Chapters, choices, chat lines, puzzles and image or sound notes are found for you.</p>
        <div class="empty__btns"><button class="btn btn--fill" data-example="summons">Try The Summons</button><button class="btn" data-example="outline">Start from a 3-stop outline</button></div></div>`;
      rail.innerHTML = '';
      return;
    }
    const all = parsed.chapters;
    const nChoices = all.reduce((s, c) => s + c.choices.length, 0);
    const blocks = all.flatMap((c) => c.blocks);
    const slots = allSlots();
    const filled = slots.filter((x) => files.has(key(x.c, x.i))).length;
    const fr = all.filter((c) => c.frBlocks).length;
    const mins = Math.max(1, Math.round(words(blocks) / WORDS_PER_MIN));
    $('#stats').innerHTML = [
      `<span class="stat"><b>${all.length}</b> chapters</span>`,
      `<span class="stat"><b>${nChoices}</b> choices</span>`,
      `<span class="stat">${icon('flag', 13)} <b>${all.filter((c) => c.end).length}</b> endings</span>`,
      `<span class="stat">${icon('pin', 13)} <b>${model.stops.length}</b> stops</span>`,
      `<span class="stat">${icon('chat', 13)} <b>${blocks.filter((b) => b.type === 'chat').length}</b> chat</span>`,
      `<span class="stat">${icon('puzzle', 13)} <b>${blocks.filter((b) => b.type === 'puzzle').length}</b> puzzles</span>`,
      `<span class="stat ${slots.length && filled === slots.length ? 'ok' : ''}">${icon('image', 13)} <b>${filled}/${slots.length}</b> files</span>`,
      `<span class="stat" style="color:var(--fr)">${icon('lang', 13)} French <b>${fr}/${all.length}</b></span>`,
      `<span class="stat" title="All text, at ${WORDS_PER_MIN} words a minute">~<b>${mins}</b> min of reading</span>`,
    ].join('');
    const list = checks();
    $('#checks').innerHTML = list.length ? `<div class="checks"><h3>${icon('alert', 15)} ${list.length} to fix</h3><ul>${list.map((i) =>
      `<li class="issue ${i.kind}">${icon('alert', 14)}<button data-jump="${i.id}" ${i.line != null ? `data-jline="${i.line}"` : ''} ${i.files ? 'data-files="1"' : ''}>${esc(i.text)}</button></li>`).join('')}</ul></div>`
      : `<div class="checks"><h3 style="color:var(--ok-d)">${icon('check', 15)} Nothing to fix</h3></div>`;
    chapsEl.innerHTML = all.map(chapterHTML).join('');
    requestAnimationFrame(drawRail);
  }

  // Branch rail: a line from each choice to the chapter it leads to
  function drawRail() {
    if (!model || window.innerWidth < 760) { rail.innerHTML = ''; return; }
    const base = preview.getBoundingClientRect(); const top = base.top - preview.scrollTop;
    rail.setAttribute('height', preview.scrollHeight); rail.style.height = preview.scrollHeight + 'px';
    const heads = new Map([...chapsEl.querySelectorAll('.chap')].map((a) => {
      const r = a.querySelector('.chap__head').getBoundingClientRect(); return [a.dataset.id, r.top - top + r.height / 2];
    }));
    const order = new Map(parsed.chapters.map((c, i) => [c.id, i]));
    const paths = [];
    chapsEl.querySelectorAll('.ch').forEach((row) => {
      const from = row.dataset.from; const c = parsed.chapters[order.get(from)];
      const k = c.choices.find((x) => String(x.line) === row.dataset.line);
      if (!k || !k.to || !heads.has(k.to)) return;
      const r = row.getBoundingClientRect(); const y1 = r.top - top + r.height / 2; const y2 = heads.get(k.to);
      const span = Math.abs(order.get(k.to) - order.get(from));
      const x = Math.max(6, 52 - Math.min(6, span - 1) * 7);
      const m = model.byId.get(from); const col = m.stop >= 0 ? model.stops[m.stop].colour.c : '#B0B7C6';
      paths.push(`<path class="${y2 < y1 ? 'up' : ''}" stroke="${col}" d="M70,${y1} C${x},${y1} ${x},${y2} 70,${y2}"/><path stroke="${col}" d="M64,${y2 - 4} L70,${y2} L64,${y2 + 4}"/>`);
    });
    rail.innerHTML = paths.join('');
  }

  // ---------- script <-> preview ----------
  const lineOfCaret = () => src.value.slice(0, src.selectionStart).split('\n').length - 1;
  function chapterAtLine(n) { let hit = null; for (const c of parsed.chapters) if (c.line <= n) hit = c; return hit; }
  function syncFromCaret() {
    const c = chapterAtLine(lineOfCaret()); const id = c ? c.id : null;
    if (id === curId) return;
    curId = id;
    chapsEl.querySelectorAll('.chap').forEach((a) => a.classList.toggle('cur', a.dataset.id === id));
    const el = id && chapsEl.querySelector(`.chap[data-id="${id}"]`);
    if (el) {
      const pr = preview.getBoundingClientRect(); const r = el.getBoundingClientRect();
      if (r.top > pr.bottom - 60 || r.bottom < pr.top + 40) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  const mirror = document.createElement('div'); mirror.className = 'mirror'; document.body.appendChild(mirror);
  function lineTop(n) {
    mirror.style.width = src.clientWidth + 'px';
    mirror.textContent = src.value.split('\n').slice(0, n).join('\n') + (n ? '\n' : '');
    return mirror.scrollHeight - parseFloat(getComputedStyle(src).paddingBottom);
  }
  function goToLine(n, focus = true) {
    const lines = src.value.split('\n');
    const at = lines.slice(0, n).reduce((s, l) => s + l.length + 1, 0);
    if (focus && window.innerWidth >= 760) src.focus({ preventScroll: true });
    src.setSelectionRange(at, at + (lines[n] || '').length);
    src.scrollTop = Math.max(0, lineTop(n) - 40);
    hlEl.scrollTop = src.scrollTop;
    const ln = $('#code'); ln.classList.remove('pulse'); void ln.offsetWidth; ln.classList.add('pulse');
    syncFromCaret();
  }

  // ---------- "goes to" suggestions ----------
  let sugItems = []; let sugIdx = 0;
  function choiceContext() {
    const v = src.value; const p = src.selectionStart;
    const ls = v.lastIndexOf('\n', p - 1) + 1; let le = v.indexOf('\n', p); if (le < 0) le = v.length;
    const line = v.slice(ls, le);
    const m = line.match(/^(\s*[-*•]\s*\*{0,2}\[.+?\]\*{0,2}\s*(?:→|->|=>)\s*)/);
    if (!m || p - ls < m[1].length) return null;
    const rest = line.slice(m[1].length);
    const needs = rest.match(/\s*\*?\(needs:[^)]*\)\*?\s*$/);
    const tEnd = needs ? rest.length - needs[0].length : rest.length;
    return { from: ls + m[1].length, to: ls + m[1].length + tEnd, typed: v.slice(ls + m[1].length, p).trim().toLowerCase(), line: v.slice(0, ls).split('\n').length - 1 };
  }
  function updateSuggest() {
    const cx = choiceContext();
    if (!cx || !parsed.chapters.length) { sug.hidden = true; return; }
    const here = chapterAtLine(cx.line);
    sugItems = parsed.chapters.filter((c) => c !== here && (!cx.typed || c.heading.toLowerCase().includes(cx.typed) || (c.code && c.code.toLowerCase().startsWith(cx.typed)))).slice(0, SUGGEST_MAX);
    if (!sugItems.length) { sug.innerHTML = `<div class="sg__none">No chapter called “${esc(cx.typed)}”. Add it with <b>## ${esc(cx.typed)}</b>, or pick one:</div>`; sugItems = parsed.chapters.filter((c) => c !== here).slice(0, 4); }
    else sug.innerHTML = '';
    sugIdx = Math.min(sugIdx, sugItems.length - 1);
    sug.innerHTML += `<div class="sg__head">Goes to <kbd>↑↓</kbd> <kbd>Enter</kbd></div>` + sugItems.map((c, i) => `<button class="sg ${i === sugIdx ? 'on' : ''}" data-sg="${i}" role="option" aria-selected="${i === sugIdx}">${esc(c.heading)}</button>`).join('');
    sug.hidden = false;
  }
  function applySuggest(i) {
    const cx = choiceContext(); const c = sugItems[i]; if (!cx || !c) return;
    src.focus(); src.setSelectionRange(cx.from, cx.to);
    if (!document.execCommand('insertText', false, c.heading)) src.setRangeText(c.heading, cx.from, cx.to, 'end');
    sug.hidden = true; save(src.value); reparse();
  }
  sug.addEventListener('mousedown', (e) => { const b = e.target.closest('[data-sg]'); if (b) { e.preventDefault(); applySuggest(+b.dataset.sg); } });
  src.addEventListener('keydown', (e) => {
    if (sug.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sugIdx = (sugIdx + (e.key === 'ArrowDown' ? 1 : -1) + sugItems.length) % sugItems.length; updateSuggest(); }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); applySuggest(sugIdx); }
    else if (e.key === 'Escape') { e.stopPropagation(); sug.hidden = true; }
  });
  src.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== src) sug.hidden = true; }, 120));
  ['keyup', 'click'].forEach((ev) => src.addEventListener(ev, (e) => {
    if (e.type === 'keyup' && ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key) && !sug.hidden) return;
    syncFromCaret(); if (e.type === 'click' || !['Escape'].includes(e.key)) { sugIdx = 0; updateSuggest(); }
  }));

  // ---------- insert buttons ----------
  function insert(kind) {
    const v = src.value; const p = src.selectionEnd;
    const le = v.indexOf('\n', p); const at = le < 0 ? v.length : le;
    const onEmpty = !v.slice(v.lastIndexOf('\n', p - 1) + 1, at).trim();
    const nextNum = parsed.chapters.length + 1;
    const snip = {
      chapter: [`## ${nextNum}: New chapter\nLocation off\n`, 'New chapter'],
      choice: ['- [What the player taps] → ', 'What the player taps'],
      loc: ['Generic location: Place name', 'Place name'],
      chat: ['NAME: What they say', 'NAME'],
      sms: ['***The text message***', 'The text message'],
      image: ['[Image of what it shows]', 'what it shows'],
      sound: ['[SFX - what we hear]', 'what we hear'],
      video: ['[Video of what happens]', 'what happens'],
      puzzle: ['[Puzzle: riddle — answer ANSWER]', 'ANSWER'],
      fr: ['[FR]\n', ''],
    }[kind];
    const pre = !v ? '' : onEmpty ? '' : '\n' + (kind === 'chapter' ? '\n' : '');
    const text = pre + snip[0];
    const start = onEmpty ? v.lastIndexOf('\n', p - 1) + 1 : at;
    src.focus(); src.setSelectionRange(start, onEmpty ? at : at);
    if (!document.execCommand('insertText', false, text)) src.setRangeText(text, start, at, 'end');
    const sIdx = snip[1] ? start + text.lastIndexOf(snip[1]) : start + text.length;
    src.setSelectionRange(sIdx, sIdx + snip[1].length);
    save(src.value); reparse(); syncFromCaret(); updateSuggest();
  }
  $('#inserts').addEventListener('mousedown', (e) => { if (e.target.closest('[data-ins]')) e.preventDefault(); });
  $('#inserts').addEventListener('click', (e) => { const b = e.target.closest('[data-ins]'); if (b) insert(b.dataset.ins); });

  // ---------- edits that write back into the script ----------
  function setLine(n, fn) {
    const lines = src.value.split('\n'); lines[n] = fn(lines[n]); src.value = lines.join('\n'); save(src.value); reparse();
  }
  function retarget(line, toId) {
    const t = parsed.chapters.find((c) => c.id === toId);
    setLine(+line, (l) => l.replace(/((?:→|->|=>)\s*).+?(\s*\*?\(needs:[^)]*\)\*?)?\s*$/, (all, arrow, needs) => `${arrow}${t ? t.heading : '?'}${needs || ''}`));
    if (t) { toast(`Choice now goes to ${t.heading}.`); flash(t.id); }
  }
  function flash(id) {
    const el = chapsEl.querySelector(`.chap[data-id="${id}"]`); if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }
  function addFrench(id) {
    const c = parsed.chapters.find((x) => x.id === id); if (!c) return;
    const lines = src.value.split('\n');
    const next = parsed.chapters[parsed.chapters.indexOf(c) + 1];
    let at = next ? next.line : lines.length;
    while (at > c.line + 1 && (!lines[at - 1].trim() || /^-{3,}$/.test(lines[at - 1].trim()))) at--;
    lines.splice(at, 0, '', '[FR]', 'Le texte en français ici.');
    src.value = lines.join('\n'); save(src.value); reparse(); goToLine(at + 2);
    toast('Added a [FR] section. Type the French over the placeholder.');
  }
  function loadExample(which) {
    if (src.value.trim() && src.value !== ctx.SAMPLE_SCRIPT && src.value !== OUTLINE && !window.confirm('Replace your script with the example?')) { $('#examples').value = ''; return; }
    src.value = which === 'outline' ? OUTLINE : ctx.SAMPLE_SCRIPT; files.clear(); save(src.value); reparse();
    $('#examples').value = '';
    toast(which === 'outline' ? 'Loaded a 3-stop outline. Rename the chapters and fill them in.' : 'Loaded The Summons. Try changing a line on the left.');
  }

  src.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { save(src.value); reparse(); syncFromCaret(); }, 200); paintCode(); });
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.example) loadExample(b.dataset.example);
    if (b.id === 'clear') { if (src.value.trim() && !window.confirm('Clear the script?')) return; src.value = ''; files.clear(); save(''); reparse(); src.focus(); }
    if (b.id === 'fmt') { const h = $('#helpBox'); h.hidden = !h.hidden; b.setAttribute('aria-expanded', String(!h.hidden)); }
    if (b.id === 'make') {
      const blocks = checks().filter((i) => i.kind === 'block').length;
      ctx.makeStory(toStory(parsed, storyTitle()));
      toast(blocks ? `Chapters made. ${blocks} thing${blocks > 1 ? 's' : ''} to fix are flagged on the map.` : 'Chapters made. Here they are on the map.');
    }
    if (b.id === 'splay') ctx.play(model, null, lang);
    if (b.dataset.playfrom) ctx.play(model, b.dataset.playfrom, lang);
    if (b.dataset.addfr) addFrench(b.dataset.addfr);
    if (b.classList.contains('chap__jump')) goToLine(+b.dataset.line);
    if (b.dataset.jump) { flash(b.dataset.jump); if (b.dataset.jline) goToLine(+b.dataset.jline, false); if (b.dataset.files) $('#bulk').click(); }
  });
  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.id === 'examples' && t.value) loadExample(t.value);
    if (t.matches('select[data-line]')) retarget(t.dataset.line, t.value);
    if (t.matches('select[data-pline]')) setLine(+t.dataset.pline, (l) => l.replace(/(puzzle\s*:\s*)(decrypt|remix|photo|riddle)/i, `$1${t.value}`));
    if (t.matches('.slot input[type=file]') && t.files[0]) attach(t.closest('.slot').dataset.slot, t.files[0]);
    if (t.id === 'file' && t.files[0]) readFile(t.files[0]);
    if (t.id === 'bulk' && t.files.length) { bulkAttach([...t.files]); t.value = ''; }
  });
  function attach(k, f) {
    files.set(k, { name: f.name, url: URL.createObjectURL(f) }); render();
    toast(`${f.name} added. In Creator Tools it uploads to this chapter.`);
  }
  const kindOf = (f) => (/^image\//.test(f.type) ? 'image' : /^audio\//.test(f.type) ? 'sound' : /^video\//.test(f.type) ? 'video'
    : /\.(png|jpe?g|gif|webp|heic)$/i.test(f.name) ? 'image' : /\.(mp3|wav|m4a|aac|ogg)$/i.test(f.name) ? 'sound' : /\.(mp4|mov|webm)$/i.test(f.name) ? 'video' : null);
  const tokens = (s) => s.toLowerCase().replace(/\.[a-z0-9]+$/, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2);
  function bulkAttach(list) {
    const free = allSlots().filter((x) => !files.has(key(x.c, x.i)));
    const placed = []; const missed = [];
    for (const f of list) {
      const k = kindOf(f); const cands = free.filter((x) => x.b.atype === k);
      if (!cands.length) { missed.push(f.name); continue; }
      const ft = tokens(f.name);
      let best = cands[0]; let score = -1;
      for (const x of cands) {
        const dt = tokens(x.b.desc + ' ' + x.c.heading);
        const s = ft.filter((w) => dt.some((d) => d.startsWith(w) || w.startsWith(d))).length;
        if (s > score) { score = s; best = x; }
      }
      files.set(key(best.c, best.i), { name: f.name, url: URL.createObjectURL(f) });
      free.splice(free.indexOf(best), 1);
      placed.push(f.name);
    }
    render();
    toast(`Placed ${placed.length} file${placed.length === 1 ? '' : 's'}${missed.length ? `. ${missed.length} had no free slot of that kind.` : '. Check each one landed in the right slot.'}`);
  }
  function readFile(f) {
    if (!/\.(txt|md|markdown)$/i.test(f.name) && !/^text\//.test(f.type)) { toast('Use a .txt or .md file for now. For Word or Google Docs, copy and paste the text.'); return; }
    f.text().then((t) => { src.value = t; files.clear(); save(t); reparse(); toast(`Read ${f.name}.`); });
  }

  // Drop a script file on the editor
  const editor = $('#editor');
  editor.addEventListener('dragover', (e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); editor.classList.add('drag'); } });
  editor.addEventListener('dragleave', (e) => { if (!editor.contains(e.relatedTarget)) editor.classList.remove('drag'); });
  editor.addEventListener('drop', (e) => { editor.classList.remove('drag'); if (e.dataTransfer.files[0]) { e.preventDefault(); readFile(e.dataTransfer.files[0]); } });

  // Drag a choice onto a chapter, a file onto a slot, or several files anywhere in the preview
  let dragLine = null;
  chapsEl.addEventListener('dragstart', (e) => {
    const row = e.target.closest('.ch'); if (!row) return;
    dragLine = row.dataset.line; row.classList.add('dragging');
    e.dataTransfer.setData('text/plain', 'choice'); e.dataTransfer.effectAllowed = 'move';
  });
  chapsEl.addEventListener('dragend', () => { dragLine = null; preview.querySelectorAll('.dragging, .droptarget, .over').forEach((x) => x.classList.remove('dragging', 'droptarget', 'over')); });
  preview.addEventListener('dragover', (e) => {
    const isFile = e.dataTransfer.types.includes('Files');
    const slot = e.target.closest('.slot[data-slot]'); const chap = e.target.closest('.chap');
    preview.querySelectorAll('.droptarget, .over').forEach((x) => x.classList.remove('droptarget', 'over'));
    if (isFile && model) { e.preventDefault(); (slot || preview).classList.add('over'); return; }
    if (!isFile && dragLine != null && chap) { e.preventDefault(); chap.classList.add('droptarget'); }
  });
  preview.addEventListener('dragleave', (e) => { if (!preview.contains(e.relatedTarget)) preview.classList.remove('over'); });
  preview.addEventListener('drop', (e) => {
    const slot = e.target.closest('.slot[data-slot]'); const chap = e.target.closest('.chap');
    preview.querySelectorAll('.over').forEach((x) => x.classList.remove('over')); preview.classList.remove('over');
    const fl = [...(e.dataTransfer.files || [])];
    if (fl.length && slot && fl.length === 1) { e.preventDefault(); attach(slot.dataset.slot, fl[0]); return; }
    if (fl.length) { e.preventDefault(); bulkAttach(fl); return; }
    if (dragLine != null && chap) { e.preventDefault(); const l = dragLine; dragLine = null; retarget(l, chap.dataset.id); }
  });
  window.addEventListener('resize', () => requestAnimationFrame(drawRail));

  reparse();
  return {
    setLang(l) { lang = l; render(); },
    focus(id) {
      const c = parsed.chapters.find((x) => x.id === id) || parsed.chapters.find((x) => model && model.byId.get(id) && x.heading === model.byId.get(id).name);
      if (c) { flash(c.id); goToLine(c.line, false); }
    },
    redraw() { requestAnimationFrame(drawRail); paintCode(); },
    hasScript() { return !!model; },
    model() { return model; },
  };
}
