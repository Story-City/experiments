// Test play: a phone that plays the story from any chapter, with a pretend walk for location chapters.
export function createPlayer(host, ctx) {
  const { icon, esc } = ctx;
  host.insertAdjacentHTML('beforeend', `
    <aside class="play" id="player" hidden aria-label="Test play">
      <div class="play__head">
        <span class="play__title">${icon('play', 15)} Test play</span>
        <button class="iconbtn sm" id="plBack" aria-label="Back one step" title="Back one step">${icon('undo', 16)}</button>
        <button class="iconbtn sm" id="plRestart" aria-label="Play from the start" title="Play from the start">${icon('restart', 16)}</button>
        <button class="iconbtn sm" id="plClose" aria-label="Close test play" title="Close (Esc)">${icon('close', 16)}</button>
      </div>
      <div class="phone"><div class="phone__screen" id="plScreen"></div></div>
      <div class="play__trail" id="plTrail"></div>
      <label class="play__opt"><input type="checkbox" id="plUnlock" checked> Treat locked choices as unlocked</label>
    </aside>`);
  const el = host.querySelector('#player');
  const screen = el.querySelector('#plScreen');
  const trailEl = el.querySelector('#plTrail');
  let model = null; let trail = []; let lang = 'en';
  const arrived = new Set(); const solved = new Set();

  const cur = () => model.byId.get(trail[trail.length - 1]);
  const endings = () => model.chapters.filter((c) => c.end);

  function fileFor(c, i) { return ctx.files && ctx.files.get(c.name + '|' + i); }

  function blockHTML(c, b, i) {
    if (b.type === 'text') return `<p>${esc(b.text)}</p>`;
    if (b.type === 'chat') return `<div class="pbub ${b.phone ? 'sms' : ''}"><small>${esc(b.who)}</small>${esc(b.text)}</div>`;
    if (b.type === 'asset') {
      const f = i >= 0 ? fileFor(c, i) : null;
      if (f && b.atype === 'image') return `<img class="pimg" src="${f.url}" alt="${esc(b.desc)}">`;
      return `<div class="passet ${f ? 'has' : ''}">${icon(b.atype === 'sound' ? 'sound' : b.atype, 18)}<span>${f ? esc(f.name) : esc(b.desc)}</span>${f ? '' : '<em>file needed</em>'}</div>`;
    }
    if (b.type === 'puzzle') {
      const k = c.id + ':' + i;
      if (solved.has(k)) return `<div class="ppuz done">${icon('check', 16)} Puzzle solved</div>`;
      return `<div class="ppuz" data-pk="${k}" data-ans="${esc(b.answer || '')}"><b>${icon('puzzle', 16)} ${esc(b.kind.charAt(0).toUpperCase() + b.kind.slice(1))} puzzle</b>
        <span>${esc(b.desc.replace(/answer\s*[:=]?\s*[^,;]+/i, '').replace(/[—–\-,;\s]+$/, '') || 'Solve to carry on')}</span>
        <div class="ppuz__row"><input aria-label="Answer" placeholder="${b.answer ? 'Answer' : 'No answer set'}"><button class="pbtn sm" data-solve>Check</button></div>
        <button class="plink" data-skip>${b.answer ? `Skip (answer: ${esc(b.answer)})` : 'Skip for now'}</button></div>`;
    }
    return '';
  }

  function render() {
    const c = cur(); if (!c) return;
    const fr = lang === 'fr';
    const stop = c.stop >= 0 ? model.stops[c.stop] : null;
    const needWalk = c.loc && !arrived.has(c.id);
    const head = `<div class="pbar"><span>${stop ? `Stop ${c.stop + 1} of ${model.stops.length}` : 'Not reached from the start'}</span><b>${esc(c.title)}</b></div>`;
    if (needWalk) {
      screen.innerHTML = `${head}<div class="pwalk">
        <div class="pwalk__map"><svg viewBox="0 0 200 150" aria-hidden="true"><defs><linearGradient id="wg" x1="0" x2="1"><stop offset="0" stop-color="#F5D547"/><stop offset="1" stop-color="#4ADE80"/></linearGradient></defs>
          <path d="M30 125 C 70 120, 60 70, 110 70 S 160 40, 170 28" stroke="url(#wg)" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round" fill="none"/>
          <circle cx="30" cy="125" r="7" fill="#009EFF"/><circle cx="30" cy="125" r="14" fill="none" stroke="#009EFF" stroke-opacity=".4"/>
          <circle cx="170" cy="28" r="18" fill="none" stroke="#4ADE80" stroke-width="2"/><circle cx="170" cy="28" r="5" fill="#4ADE80"/></svg></div>
        <p class="pwalk__to">Walk to</p><h3>${esc(c.place || stop?.name || c.title)}</h3>
        <p class="pwalk__note">Location is on for this chapter. In the app it unlocks when the player gets there.</p>
        <button class="pbtn" data-arrive>${icon('pin', 16)} Pretend I'm there</button></div>`;
      paint(); return;
    }
    const blocks = fr && c.frBlocks ? c.frBlocks : c.blocks;
    let body;
    if (blocks) body = blocks.map((b, i) => blockHTML(c, b, fr && c.frBlocks ? -1 : i)).join('');
    else {
      const t = fr ? c.fr : c.text;
      const media = [['video', c.video], ['sound', c.audio], ['image', c.image]].filter(([, n]) => n)
        .map(([k, n]) => `<div class="passet has">${icon(k, 18)}<span>${n > 1 ? n + ' ' : ''}${{ video: 'video', sound: 'sound', image: 'image' }[k]}${n > 1 ? 's' : ''} in this chapter</span></div>`).join('');
      body = `${media}<p>${t ? esc(t) : `<em class="pmiss">${fr ? 'No French yet for this chapter.' : 'No text yet.'}</em>`}</p><p class="pnote">Only the opening lines are in this mockup.</p>`;
    }
    if (fr && blocks === c.blocks && c.blocks) body = `<p class="pmiss">No French yet. Showing English.</p>` + body;
    const puzzleOpen = (blocks || []).some((b, i) => b.type === 'puzzle' && !solved.has(c.id + ':' + i));
    const unlock = el.querySelector('#plUnlock').checked;
    let foot;
    if (c.end) {
      const all = endings(); const n = all.findIndex((e) => e.id === c.id) + 1;
      foot = `<div class="pend"><b>The End</b><span>Ending ${n} of ${all.length}</span><button class="pbtn" data-restart>Play again</button>${trail.length > 1 ? '<button class="plink" data-back>Go back and try another way</button>' : ''}</div>`;
    } else if (!c.choices.length) {
      foot = `<div class="pend bad"><b>Dead end</b><span>This chapter has no choices and isn't marked as an ending.</span>${trail.length > 1 ? '<button class="plink" data-back>Go back</button>' : ''}</div>`;
    } else {
      foot = `<div class="pchoices">${c.choices.map((k, i) => {
        const label = fr && k.fr ? k.fr : k.label;
        const locked = k.needs && !unlock && puzzleOpen;
        if (!k.to) return `<button class="pbtn broken" disabled>${icon('alert', 15)} ${esc(label || '(no label)')}<small>Goes nowhere yet</small></button>`;
        return `<button class="pbtn" data-ci="${i}" ${locked ? 'disabled' : ''}>${k.needs ? icon('lock', 14) + ' ' : ''}${esc(label || '(no label)')}</button>`;
      }).join('')}</div>`;
    }
    screen.innerHTML = head + `<div class="pbody">${body}</div>` + foot;
    paint();
  }

  function paint() {
    screen.scrollTop = 0;
    trailEl.innerHTML = `<span class="small muted">Path:</span>` + trail.map((id, i) => {
      const c = model.byId.get(id);
      return `${i ? icon('arrow', 12) : ''}<button class="tchip ${i === trail.length - 1 ? 'on' : ''}" data-ti="${i}" title="Go back to here">${esc(c.code || c.title)}</button>`;
    }).join('');
    el.querySelector('#plBack').disabled = trail.length < 2;
    ctx.onPlayStep && ctx.onPlayStep(trail.slice());
  }

  el.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'plClose') return api.close();
    if (b.id === 'plRestart' || b.dataset.restart != null) { arrived.clear(); solved.clear(); trail = [model.start.id]; return render(); }
    if (b.id === 'plBack' || b.dataset.back != null) { if (trail.length > 1) trail.pop(); return render(); }
    if (b.dataset.ti != null) { trail = trail.slice(0, +b.dataset.ti + 1); return render(); }
    if (b.dataset.arrive != null) { arrived.add(cur().id); return render(); }
    if (b.dataset.ci != null) { const k = cur().choices[+b.dataset.ci]; if (k && k.to) { trail.push(k.to); render(); } return; }
    const pz = b.closest('.ppuz');
    if (pz && b.dataset.skip != null) { solved.add(pz.dataset.pk); return render(); }
    if (pz && b.dataset.solve != null) {
      const v = pz.querySelector('input').value.trim().toLowerCase(); const a = pz.dataset.ans.trim().toLowerCase();
      if (!a || v === a) { solved.add(pz.dataset.pk); render(); } else { pz.classList.remove('shake'); void pz.offsetWidth; pz.classList.add('shake'); }
    }
  });
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.closest('.ppuz input')) e.target.closest('.ppuz').querySelector('[data-solve]').click(); });
  el.querySelector('#plUnlock').addEventListener('change', render);

  const api = {
    open(m, fromId, l) {
      model = m; lang = l || lang; arrived.clear(); solved.clear();
      const from = fromId && m.byId.get(fromId) ? fromId : m.start.id;
      trail = [from];
      el.hidden = false; document.body.classList.add('playing');
      render();
      el.querySelector('#plClose').focus({ preventScroll: true });
    },
    close() { if (el.hidden) return; el.hidden = true; document.body.classList.remove('playing'); ctx.onPlayStep && ctx.onPlayStep(null); },
    isOpen() { return !el.hidden; },
    setLang(l) { lang = l; if (!el.hidden) render(); },
    refresh(m) { if (el.hidden || !m) return; model = m; trail = trail.filter((id) => m.byId.has(id)); if (!trail.length) trail = [m.start.id]; render(); },
  };
  return api;
}
