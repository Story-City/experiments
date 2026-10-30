// teams.html — hero walkers converging, "how events work" draw-in, enquiry form that never sends data.
(() => {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero: five walkers converge on one story ---------- */
  const art = $('tmArt');
  if (art) {
    const roads = [1, 2, 3, 4, 5].map(i => $('tmR' + i)), walkers = art.querySelectorAll('.walker');
    const lens = roads.map(r => r.getTotalLength());
    const put = (i, k) => { const p = roads[i].getPointAtLength(lens[i] * k); walkers[i].setAttribute('cx', p.x); walkers[i].setAttribute('cy', p.y); };
    if (reduce) roads.forEach((_, i) => put(i, .82));
    else {
      art.classList.add('tm-anim');
      const offs = [0, .22, .45, .63, .8], dur = 9000;
      let vis = true;
      new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(art);
      const tick = now => {
        if (vis) roads.forEach((_, i) => { const k = ((now / dur) + offs[i]) % 1; put(i, Math.min(k * 1.06, .94)); walkers[i].style.opacity = k > .9 ? (1 - k) * 10 : Math.min(1, k * 12); });
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------- How events work: path draws, code types in ---------- */
  const steps = $('tmSteps'), line = $('tmLine'), lsvg = $('tmLineSvg'), code = $('tmCode');
  const CODE = 'OWL-317';
  const drawCode = n => { code.innerHTML = [...CODE].map((ch, i) => `<span class="${ch === '-' ? 'dash' : ''}" aria-hidden="true">${i < n ? ch : ''}</span>`).join(''); };
  const shape = () => {
    const b = lsvg.getBoundingClientRect(), v = b.height > b.width;
    lsvg.setAttribute('viewBox', `0 0 ${Math.max(1, b.width)} ${Math.max(1, b.height)}`);
    line.setAttribute('d', v ? `M2 0 V${b.height}` : `M0 2 H${b.width}`);
  };
  shape(); new ResizeObserver(shape).observe(lsvg);
  const items = steps.querySelectorAll('.tm-step');
  if (reduce || !('IntersectionObserver' in window)) { drawCode(CODE.length); items.forEach(s => s.classList.add('on')); }
  else {
    drawCode(0);
    line.style.opacity = 0;
    steps.addEventListener('pg:reveal', () => {
      const len = line.getTotalLength();
      line.style.strokeDasharray = `.1 10`;
      line.style.opacity = 1;
      // reveal via clip so the dotted look stays
      const t0 = performance.now(), dur = 1800, svgv = lsvg.getBoundingClientRect().height > lsvg.getBoundingClientRect().width;
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        line.style.clipPath = svgv ? `inset(0 0 ${100 - e * 100}% 0)` : `inset(0 ${100 - e * 100}% 0 0)`;
        items.forEach((s, i) => s.classList.toggle('on', e >= i / 2 - .01));
        const typed = Math.round(Math.max(0, (e - .45) / .45) * CODE.length);
        drawCode(Math.min(CODE.length, typed));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step); void len;
    }, { once: true });
  }

  /* ---------- Enquiry form: builds a message, sends nothing ---------- */
  const TEAM_EMAIL = ''; // [team email] — fill in when confirmed; until then the mail link stays a placeholder.
  const form = $('tmForm'), out = $('tmOut'), result = $('tmResult');
  const need = [['tmName', 'tmNameErr'], ['tmKind', 'tmKindErr']];
  need.forEach(([f, e]) => { const el = $(f); el.setAttribute('aria-describedby', e); el.addEventListener('input', () => el.closest('.pg-field').classList.remove('bad')); el.addEventListener('change', () => el.closest('.pg-field').classList.remove('bad')); });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    let first = null;
    need.forEach(([f]) => { const el = $(f), bad = !el.value.trim(); el.closest('.pg-field').classList.toggle('bad', bad); el.setAttribute('aria-invalid', bad); if (bad && !first) first = el; });
    if (first) { first.focus(); return; }
    const v = id => $(id).value.trim();
    const lines = [
      `Hello Story City,`, ``,
      `I'd like to plan a ${v('tmKind').toLowerCase()}.`,
      (v('tmOrg') ? `Organisation: ${v('tmOrg')}` : null),
      (v('tmSize') ? `Group size: ${v('tmSize')}` : null),
      (v('tmDate') ? `Rough date: ${v('tmDate')}` : null),
      (v('tmCity') ? `City: ${v('tmCity')}` : null),
      (v('tmMsg') ? `\n${v('tmMsg')}` : null), ``,
      `Thanks,`, v('tmName')
    ].filter(l => l !== null);
    const body = lines.join('\n').replace(/\n{3,}/g, '\n\n');
    out.textContent = body;
    const mail = $('tmMail');
    if (TEAM_EMAIL) mail.href = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent('Story City enquiry: ' + v('tmKind'))}&body=${encodeURIComponent(body)}`;
    else { mail.href = 'mailto:[team email]'; mail.setAttribute('aria-label', 'Open email (team email address still to be confirmed)'); }
    result.hidden = false; result.focus();
  });
  $('tmCopy').addEventListener('click', async () => {
    const s = $('tmStatus');
    try { await navigator.clipboard.writeText(out.textContent); s.textContent = 'Message copied.'; }
    catch { s.textContent = 'Copy did not work here. Select the text above instead.'; }
  });
})();
