// Script tab: drop in a script; we find chapters, choices, chat lines, puzzles and asset slots.
export function createScriptView(root, ctx) {
  const { icon, esc, parseScript, toStory, prepare, toast } = ctx;
  const KEY = 'ct-script-draft';
  const load = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* private window */ } };

  root.innerHTML = `
    <div class="sbar"><div class="stats" id="stats"></div><button class="btn btn--fill" id="make" disabled>${icon('map')} Make chapters</button></div>
    <div class="split">
      <div class="editor" id="editor">
        <div class="editor__head">
          <h2>Your script</h2>
          <button class="btn btn--ghost" id="sample">Try The Summons</button>
          <label class="btn btn--ghost">${icon('upload')} Open file<input type="file" id="file" accept=".txt,.md,.markdown,text/plain" hidden></label>
          <button class="iconbtn" id="fmt" aria-label="How to format a script" aria-expanded="false">${icon('help', 18)}</button>
          <button class="iconbtn" id="clear" aria-label="Clear">${icon('close', 18)}</button>
        </div>
        <div class="help" id="helpBox" hidden>
          <b>Write it the way you already do.</b> We spot these:
          <table>
            <tr><td><code>## 3a: The Mailbox</code></td><td>a chapter (add <code>· START</code> or <code>· END</code>)</td></tr>
            <tr><td><code>Location off</code><br><code>Generic location: Mailbox</code></td><td>no walk / a stop on the map</td></tr>
            <tr><td><code>WREN: Hello there</code></td><td>a chat bubble</td></tr>
            <tr><td><code>***Look out your window***</code></td><td>a text message bubble</td></tr>
            <tr><td><code>[Image of …]</code> <code>[SFX - …]</code> <code>[Video …]</code></td><td>a slot for a file</td></tr>
            <tr><td><code>[Puzzle: decrypt — answer 786666]</code></td><td>a puzzle (decrypt, remix, photo, riddle)</td></tr>
            <tr><td><code>- [I'm here] → 3a: The Mailbox</code></td><td>a choice and where it goes</td></tr>
            <tr><td><code>[FR]</code></td><td>the French version of that chapter follows</td></tr>
          </table>
        </div>
        <textarea id="src" spellcheck="false" placeholder="Paste your script here, or drop a .txt or .md file on this box.&#10;&#10;## 1: The Summons · START&#10;It's an ordinary day…&#10;- [I'm here] → 1b: A mysterious figure"></textarea>
      </div>
      <div class="preview" id="preview">
        <svg class="rail" id="rail"></svg>
        <div id="checks"></div>
        <div id="chaps"></div>
      </div>
    </div>`;
  const $ = (s) => root.querySelector(s);
  const src = $('#src'); const preview = $('#preview'); const chapsEl = $('#chaps'); const rail = $('#rail');
  let parsed = { chapters: [] }; let model = null; let lang = 'en';
  const files = new Map(); // "heading|block" -> { name, url, type }
  let timer = null;

  src.value = load();

  function storyTitle() {
    const m = src.value.match(/^\s*#\s+(?!#)(.+)$/m);
    return m && parsed.preamble ? m[1].trim() : (parsed.chapters[0] ? parsed.chapters[0].title : 'Your script');
  }

  function reparse() {
    parsed = parseScript(src.value);
    model = parsed.chapters.length ? prepare(toStory(parsed, storyTitle())) : null;
    render();
  }

  // ---------- checks ----------
  function checks() {
    const out = [];
    if (!model) return out;
    parsed.chapters.forEach((c) => {
      c.choices.forEach((k) => { if (!k.to) out.push({ id: c.id, kind: 'block', text: `“${k.label}” in ${c.code || c.title} goes to “${k.target}”, which isn't a chapter.` }); });
      const m = model.byId.get(c.id);
      if (!m.reached) out.push({ id: c.id, kind: 'block', text: `${c.code || c.title} can't be reached from the start.` });
      if (!c.end && !c.choices.length) out.push({ id: c.id, kind: 'block', text: `${c.code || c.title} has no choices. Add one, or mark it · END.` });
      c.blocks.forEach((b) => { if (b.type === 'puzzle' && !b.answer) out.push({ id: c.id, kind: 'check', text: `The puzzle in ${c.code || c.title} has no answer yet.` }); });
    });
    const slots = parsed.chapters.flatMap((c) => c.blocks.map((b, i) => ({ c, b, i })).filter((x) => x.b.type === 'asset'));
    const empty = slots.filter((x) => !files.has(key(x.c, x.i)));
    if (empty.length) out.push({ id: empty[0].c.id, kind: 'check', text: `${empty.length} of ${slots.length} image and sound slots still need a file.` });
    if (lang === 'fr') {
      const miss = parsed.chapters.filter((c) => !c.frBlocks);
      if (miss.length) out.push({ id: miss[0].id, kind: 'fr', text: `${miss.length} of ${parsed.chapters.length} chapters need French.` });
    }
    return out;
  }
  const key = (c, i) => c.heading + '|' + i;

  // ---------- render ----------
  function block(c, b, i) {
    if (b.type === 'text') return `<p class="para">${esc(b.text)}</p>`;
    if (b.type === 'chat') return `<div class="bubble ${b.phone ? 'phone' : ''}"><small>${esc(b.who)}</small>${esc(b.text)}</div>`;
    if (b.type === 'puzzle') {
      return `<div class="puz"><div class="slot__icon">${icon('puzzle', 18)}</div><div class="slot__text"><b>Puzzle</b>${esc(b.desc || '')}${b.answer ? '' : ' <span style="color:var(--bad)">· no answer yet</span>'}</div>
        <select data-pline="${b.line}" aria-label="Puzzle type">${['decrypt', 'remix', 'photo', 'riddle'].map((k) => `<option ${k === b.kind ? 'selected' : ''}>${k}</option>`).join('')}</select></div>`;
    }
    if (b.type === 'asset') return slotHTML(c, i, b, files.get(key(c, i)));
    return '';
  }
  function slotHTML(c, i, b, f) {
    const kind = b.atype;
    const label = { image: 'Image', sound: 'Sound', video: 'Video' }[kind];
    const accept = { image: 'image/*', sound: 'audio/*', video: 'video/*' }[kind];
    const thumb = f && kind === 'image' ? `<img src="${f.url}" alt="">` : icon(kind === 'sound' ? 'sound' : kind, 18);
    return `<div class="slot ${f ? 'filled' : ''}" data-slot="${esc(key(c, i))}" data-kind="${kind}">
      <div class="slot__icon">${thumb}</div>
      <div class="slot__text"><b>${label}${f ? ' · added' : ''}</b>${esc(f ? f.name : b.desc)}</div>
      <label class="btn btn--ghost">${f ? 'Replace' : 'Add file'}<input type="file" accept="${accept}"></label></div>`;
  }

  function chapterHTML(c, idx) {
    const m = model.byId.get(c.id);
    const col = m.stop >= 0 ? model.stops[m.stop].colour : { c: '#B0B7C6', bg: '#F6F7F9' };
    const showFr = lang === 'fr' && c.frBlocks;
    const blocks = showFr ? c.frBlocks : c.blocks;
    const options = (k) => `<option value="">(goes nowhere)</option>` + parsed.chapters.map((t) =>
      `<option value="${t.id}" ${t.id === k.to ? 'selected' : ''}>${esc(t.heading)}</option>`).join('');
    return `<article class="chap" data-id="${c.id}" style="--sc:${col.c};--sbg:${col.bg}">
      <div class="chap__head">
        <span class="chap__num">${idx + 1}${c.code ? ' · ' + esc(c.code) : ''}</span>
        <span class="chap__title">${esc(c.title)}</span>
        ${c.start ? `<span class="node__badge b-start">${icon('play', 10)} START</span>` : ''}
        ${c.end ? `<span class="node__badge b-end">${icon('flag', 10)} END</span>` : ''}
        ${m.loc ? `<span class="fact small">${icon('pin', 13)} ${c.place ? esc(c.place) : 'Location on'}</span>` : `<span class="fact small">${icon('pinOff', 13)} Location off</span>`}
        ${lang === 'fr' ? (c.frBlocks ? '<span class="node__badge b-fr">FR ✓</span>' : '<span class="node__badge b-frmiss">FR missing</span>') : ''}
      </div>
      <div class="chap__body">
        ${lang === 'fr' && !c.frBlocks ? '<div class="frmissing">No French yet. Add a line <b>[FR]</b> under this chapter, then the French text.</div>' : ''}
        ${showFr ? '<div class="frnote">Français</div>' : ''}
        ${blocks.map((b, i) => block(c, showFr ? { ...b } : b, showFr ? -1 - i : i)).join('')}
        ${c.choices.length ? `<div class="chs">${c.choices.map((k, i) => `
          <div class="ch ${k.to ? '' : 'broken'}" draggable="true" data-line="${k.line}" data-from="${c.id}" title="Drag onto a chapter to send this choice there">
            <span class="ch__lbl">[${esc(showFr && c.frChoices[i] ? c.frChoices[i] : k.label)}]</span><span class="ch__arrow">${icon('arrow', 15)}</span>
            <select data-line="${k.line}" aria-label="Where this choice goes">${options(k)}</select>
            ${k.needs ? `<span class="needs">${icon('lock', 11)} needs ${esc(k.needs === 'MATCH_NUMBER' ? 'a number' : k.needs.toLowerCase().replace(/_/g, ' '))}</span>` : ''}
          </div>`).join('')}</div>` : (c.end ? `<div class="endnote">${icon('flag', 15)} Ending</div>` : '')}
      </div>
    </article>`;
  }

  function render() {
    const has = !!model;
    $('#make').disabled = !has;
    if (!has) {
      $('#stats').innerHTML = '<span class="muted small">Nothing yet. Paste a script on the left, drop a file on it, or try the sample.</span>';
      $('#checks').innerHTML = '';
      chapsEl.innerHTML = `<div class="empty">${icon('script', 44)}<p><b>Drop in your script</b><br>Chapters, choices, chat lines, puzzles and image or sound notes are found for you.</p><button class="btn btn--fill" id="sample2">Try it with The Summons</button></div>`;
      rail.innerHTML = '';
      return;
    }
    const all = parsed.chapters;
    const nChoices = all.reduce((s, c) => s + c.choices.length, 0);
    const blocks = all.flatMap((c) => c.blocks);
    const slots = all.flatMap((c) => c.blocks.map((b, i) => ({ c, b, i })).filter((x) => x.b.type === 'asset'));
    const filled = slots.filter((x) => files.has(key(x.c, x.i))).length;
    const fr = all.filter((c) => c.frBlocks).length;
    $('#stats').innerHTML = [
      `<span class="stat"><b>${all.length}</b> chapters</span>`,
      `<span class="stat"><b>${nChoices}</b> choices</span>`,
      `<span class="stat">${icon('flag', 13)} <b>${all.filter((c) => c.end).length}</b> endings</span>`,
      `<span class="stat">${icon('pin', 13)} <b>${model.stops.length}</b> stops</span>`,
      `<span class="stat">${icon('chat', 13)} <b>${blocks.filter((b) => b.type === 'chat').length}</b> chat lines</span>`,
      `<span class="stat">${icon('puzzle', 13)} <b>${blocks.filter((b) => b.type === 'puzzle').length}</b> puzzles</span>`,
      `<span class="stat">${icon('image', 13)} <b>${filled}/${slots.length}</b> files</span>`,
      `<span class="stat" style="color:var(--fr)">${icon('lang', 13)} French <b>${fr}/${all.length}</b></span>`,
    ].join('');
    const list = checks();
    $('#checks').innerHTML = list.length ? `<div class="checks"><h3>${icon('alert', 15)} ${list.length} to check</h3><ul>${list.map((i) =>
      `<li class="issue ${i.kind}">${icon('alert', 14)}<button data-jump="${i.id}">${esc(i.text)}</button></li>`).join('')}</ul></div>`
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

  src.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { save(src.value); reparse(); }, 250); });
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'sample' || b.id === 'sample2') { src.value = ctx.SAMPLE_SCRIPT; files.clear(); save(src.value); reparse(); toast('Loaded The Summons. Try changing a line on the left.'); }
    if (b.id === 'clear') { src.value = ''; files.clear(); save(''); reparse(); src.focus(); }
    if (b.id === 'fmt') { const h = $('#helpBox'); h.hidden = !h.hidden; b.setAttribute('aria-expanded', String(!h.hidden)); }
    if (b.id === 'make') {
      const blocks = checks().filter((i) => i.kind === 'block').length;
      ctx.makeStory(toStory(parsed, storyTitle()));
      toast(blocks ? `Chapters made. ${blocks} thing${blocks > 1 ? 's' : ''} to fix are flagged on the map.` : 'Chapters made. Here they are on the map.');
    }
    if (b.dataset.jump) flash(b.dataset.jump);
  });
  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('select[data-line]')) retarget(t.dataset.line, t.value);
    if (t.matches('select[data-pline]')) setLine(+t.dataset.pline, (l) => l.replace(/(puzzle\s*:\s*)(decrypt|remix|photo|riddle)/i, `$1${t.value}`));
    if (t.matches('.slot input[type=file]') && t.files[0]) attach(t.closest('.slot').dataset.slot, t.files[0]);
    if (t.id === 'file' && t.files[0]) readFile(t.files[0]);
  });
  function attach(k, f) {
    files.set(k, { name: f.name, url: URL.createObjectURL(f) }); render();
    toast(`${f.name} added. In Creator Tools it uploads to this chapter.`);
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

  // Drag a choice onto a chapter, or a file onto a slot
  let dragLine = null;
  chapsEl.addEventListener('dragstart', (e) => {
    const row = e.target.closest('.ch'); if (!row) return;
    dragLine = row.dataset.line; row.classList.add('dragging');
    e.dataTransfer.setData('text/plain', 'choice'); e.dataTransfer.effectAllowed = 'move';
  });
  chapsEl.addEventListener('dragend', () => { dragLine = null; chapsEl.querySelectorAll('.dragging, .droptarget, .over').forEach((x) => x.classList.remove('dragging', 'droptarget', 'over')); });
  chapsEl.addEventListener('dragover', (e) => {
    const isFile = e.dataTransfer.types.includes('Files');
    const slot = e.target.closest('.slot'); const chap = e.target.closest('.chap');
    chapsEl.querySelectorAll('.droptarget, .over').forEach((x) => x.classList.remove('droptarget', 'over'));
    if (isFile && slot) { e.preventDefault(); slot.classList.add('over'); return; }
    if (!isFile && dragLine != null && chap) { e.preventDefault(); chap.classList.add('droptarget'); }
  });
  chapsEl.addEventListener('drop', (e) => {
    const slot = e.target.closest('.slot'); const chap = e.target.closest('.chap');
    if (e.dataTransfer.files[0] && slot) { e.preventDefault(); attach(slot.dataset.slot, e.dataTransfer.files[0]); return; }
    if (dragLine != null && chap) { e.preventDefault(); const l = dragLine; dragLine = null; retarget(l, chap.dataset.id); }
  });
  window.addEventListener('resize', () => requestAnimationFrame(drawRail));

  reparse();
  return {
    setLang(l) { lang = l; render(); },
    focus(id) { flash(id); },
    redraw() { requestAnimationFrame(drawRail); },
    hasScript() { return !!model; },
  };
}
