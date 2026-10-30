// creators.html — hero quill path, live story-card builder, branching story diagram.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);

  /* ---------- Hero: a sparkle "writes" the walking path ---------- */
  const quill = $('crQuill'), tip = $('crTip');
  if (quill && tip) {
    const len = quill.getTotalLength();
    const place = t => { const p = quill.getPointAtLength(len * t); tip.setAttribute('transform', `translate(${p.x} ${p.y})`); };
    if (reduce) { place(1); }
    else {
      // Reveal the dotted path by animating a solid copy used as a mask.
      const svg = quill.ownerSVGElement, id = 'crMask';
      svg.insertAdjacentHTML('afterbegin', `<defs><mask id="${id}" maskUnits="userSpaceOnUse"><path d="${quill.getAttribute('d')}" fill="none" stroke="white" stroke-width="10" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len}"/></mask></defs>`);
      quill.setAttribute('mask', `url(#${id})`);
      const mp = svg.querySelector(`#${id} path`);
      const t0 = performance.now(), dur = 2600;
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        mp.setAttribute('stroke-dashoffset', len * (1 - e)); place(e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  /* ---------- Builder ---------- */
  // 16 story accents + 4 neutrals (names from the brand guidelines; values from tokens.css).
  // Emerald, Sapphire and Amethyst are map mode colours and are never offered.
  const ACCENTS = [
    ['Sunstone', 'sunstone'], ['Carnelian', 'carnelian'], ['Amber', 'amber'], ['Citrine', 'citrine'],
    ['Heliodor', 'heliodor'], ['Peridot', 'peridot'], ['Serpentine', 'serpentine'], ['Aventurine', 'jade'],
    ['Amazonite', 'amazonite'], ['Turquoise', 'turquoise'], ['Aquamarine', 'aquamarine'], ['Celestite', 'celestite'],
    ['Charoite', 'charoite'], ['Kunzite', 'kunzite'], ['Spinel', 'spinel'], ['Rhodolite', 'rhodolite']
  ];
  const NEUTRALS = [['Moonstone', 'moonstone'], ['Diamond', 'diamond'], ['Labradorite', 'labradorite'], ['Pearl', 'pearl']];
  const acc = $('cbAcc'), stage = $('cbStage');
  if (acc && stage) {
    const sub = document.createElement('span'); sub.className = 'cb-sub'; sub.textContent = 'Jewels';
    acc.append(sub);
    const all = [];
    const add = ([name, v], neutral) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'cb-sw' + (neutral ? ' neutral' : '');
      b.style.setProperty('--c', `var(--${v})`);
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.setAttribute('aria-label', name + (v === 'citrine' ? ' (also the Walk start colour)' : '') + (neutral ? ' (neutral)' : ''));
      b.dataset.v = v; b.dataset.n = name; b.dataset.k = neutral ? 'Neutral' : (v === 'citrine' ? 'Story accent · also Walk start' : 'Story accent');
      b.title = name;
      acc.append(b); all.push(b);
    };
    ACCENTS.forEach(a => add(a, false));
    const sub2 = sub.cloneNode(); sub2.textContent = 'Neutrals'; acc.append(sub2);
    NEUTRALS.forEach(a => add(a, true));

    const wash = $('cbWash');
    const pick = (b, fromUser) => {
      all.forEach(x => { const on = x === b; x.setAttribute('aria-checked', on); x.tabIndex = on ? 0 : -1; });
      stage.style.setProperty('--acc', `var(--${b.dataset.v})`);
      $('cbAccName').textContent = b.dataset.n; $('cbAccKind').textContent = b.dataset.k;
      if (fromUser && !reduce) {
        const r = stage.getBoundingClientRect(), s = b.getBoundingClientRect();
        const wide = r.left > s.right - 4; // stage beside the form
        wash.style.left = (wide ? 0 : (s.left + s.width / 2 - r.left)) + 'px';
        wash.style.top = (wide ? (s.top + s.height / 2 - r.top) : 0) + 'px';
        wash.classList.remove('go'); stage.classList.remove('shine'); void wash.offsetWidth;
        wash.classList.add('go'); stage.classList.add('shine');
      }
    };
    all.forEach((b, i) => {
      b.addEventListener('click', () => pick(b, true));
      b.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (d) { e.preventDefault(); const n = all[(i + d + all.length) % all.length]; n.focus(); pick(n, true); }
        else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); const n = all[e.key === 'Home' ? 0 : all.length - 1]; n.focus(); pick(n, true); }
      });
    });
    stage.addEventListener('animationend', e => { if (e.target.classList.contains('cb-phone')) stage.classList.remove('shine'); });
    pick(all.find(b => b.dataset.v === 'amazonite'), false);

    // Text fields
    const title = $('cbTitle'), hook = $('cbHook'), genre = $('cbGenre'), type = $('cbType');
    const sync = () => {
      $('pvTitle').textContent = title.value.trim() || 'Untitled Story';
      const h = hook.value.trim() || 'Your hook goes here.';
      $('pvHook').textContent = h; $('pvBub1').textContent = h;
      $('pvLbl').textContent = `${genre.value} · ${type.value}`;
      $('cbHookCount').textContent = `${hook.value.length} / 90`;
    };
    [title, hook].forEach(el => el.addEventListener('input', sync));
    [genre, type].forEach(el => el.addEventListener('change', sync));
    sync();

    // Preview choices are tappable
    const choices = stage.querySelectorAll('.cb-choice');
    choices.forEach(c => c.addEventListener('click', () => {
      choices.forEach(x => x.setAttribute('aria-pressed', x === c));
      $('pvMe').textContent = c.textContent.trim() + '.';
    }));
    let prog = 18;
    $('pvStart').addEventListener('click', () => { prog = prog >= 100 ? 18 : Math.min(100, prog + 16.4); $('pvProg').style.width = prog + '%'; });
  }

  /* ---------- Branching diagram ---------- */
  const tree = $('btTree'), svg = $('btSvg'), detail = $('btDetail');
  if (!tree) return;
  const MODES = {
    walk: ['Walk', 'Steps unlock this chapter. A dotted path fades from gold to green as the player walks.'],
    path: ['Path', 'Walk to a real place nearby. A blue route leads to a blue pin, about 150 m away.'],
    hunt: ['Hunt', 'Find something and photograph it. A purple sweep shows where to look.']
  };
  const CH = {
    c1:  { n: 'Chapter 1', t: 'An unopened letter', mode: 'walk', tag: 'Any quiet street', h: [10, 50], v: [50, 6] },
    c2a: { n: 'Chapter 2', t: 'Under the clock tower', mode: 'path', tag: 'Landmark', h: [47, 27], v: [27, 33] },
    c2b: { n: 'Chapter 2', t: 'Inside the workshop', mode: 'hunt', tag: 'Shop or café', find: 'a clock face', h: [47, 73], v: [73, 33] },
    e1:  { n: 'Ending', t: 'The midnight bells', mode: 'walk', tag: 'Park', end: true, h: [89, 12], v: [17, 88] },
    e2:  { n: 'Ending', t: 'The debt is paid', mode: 'path', tag: 'Library', end: true, h: [89, 50], v: [50, 88] },
    e3:  { n: 'Ending', t: 'Time runs backwards', mode: 'hunt', tag: 'Bridge or water', find: 'running water', end: true, h: [89, 88], v: [83, 88] }
  };
  const K = {
    k1: { from: 'c1', to: 'c2a', t: 'Follow the ticking', h: [27, 27], v: [27, 19] },
    k2: { from: 'c1', to: 'c2b', t: 'Knock on the shop door', h: [27, 73], v: [73, 19] },
    k3: { from: 'c2a', to: 'e1', t: 'Climb the stairs', h: [68, 12], v: [13, 60], k2: 1 },
    k4: { from: 'c2a', to: 'e2', t: 'Wait below', h: [68, 36], v: [38, 60], k2: 1 },
    k5: { from: 'c2b', to: 'e2', t: 'Open the drawer', h: [68, 64], v: [62, 60], k2: 1 },
    k6: { from: 'c2b', to: 'e3', t: 'Wind the clock', h: [68, 88], v: [87, 60], k2: 1 }
  };
  const nodes = {};
  const mk = (id, html, cls, label) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'bt-n ' + cls; b.innerHTML = html; b.dataset.id = id;
    if (label) b.setAttribute('aria-label', label);
    tree.append(b); nodes[id] = b; return b;
  };
  Object.entries(CH).forEach(([id, c]) => {
    const b = mk(id, `<small>${c.n}</small><b>${c.t}</b><span><i class="bt-dot ${c.mode}" aria-hidden="true"></i>${MODES[c.mode][0]}</span>`, 'bt-ch' + (c.end ? ' end' : ''),
      `${c.n}: ${c.t}. ${MODES[c.mode][0]} mode.`);
    b.addEventListener('click', () => selectChapter(id));
  });
  Object.entries(K).forEach(([id, k]) => {
    const b = mk(id, k.t, 'bt-k' + (k.k2 ? ' k2' : ''), `Choice: ${k.t}`);
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => selectChoice(id));
  });
  // Tab order follows story order: chapter, its choices, next chapter…
  ['c1', 'k1', 'k2', 'c2a', 'k3', 'k4', 'c2b', 'k5', 'k6', 'e1', 'e2', 'e3'].forEach(id => tree.append(nodes[id]));

  const edges = [];
  Object.entries(K).forEach(([id, k]) => { edges.push({ a: k.from, b: id }); edges.push({ a: id, b: k.to }); });
  const NS = 'http://www.w3.org/2000/svg';
  edges.forEach(e => {
    e.base = document.createElementNS(NS, 'path'); e.base.setAttribute('class', 'e');
    e.lit = document.createElementNS(NS, 'path'); e.lit.setAttribute('class', 'l');
    svg.append(e.base);
  });
  edges.forEach(e => svg.append(e.lit));

  let lay = 'h';
  const layout = () => {
    const w = tree.clientWidth;
    lay = w < 740 ? 'v' : 'h'; tree.dataset.lay = lay;
    Object.entries({ ...CH, ...K }).forEach(([id, d]) => { const [x, y] = d[lay]; nodes[id].style.left = x + '%'; nodes[id].style.top = y + '%'; });
    const W = tree.clientWidth, H = tree.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const box = id => { const n = nodes[id]; return { x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight }; };
    edges.forEach(e => {
      const A = box(e.a), B = box(e.b); let d;
      if (lay === 'h') {
        const x1 = A.x + A.w / 2, y1 = A.y, x2 = B.x - B.w / 2, y2 = B.y, m = (x2 - x1) / 2;
        d = `M${x1} ${y1} C${x1 + m} ${y1} ${x2 - m} ${y2} ${x2} ${y2}`;
      } else {
        const x1 = A.x, y1 = A.y + A.h / 2, x2 = B.x, y2 = B.y - B.h / 2, m = (y2 - y1) / 2;
        d = `M${x1} ${y1} C${x1} ${y1 + m} ${x2} ${y2 - m} ${x2} ${y2}`;
      }
      e.base.setAttribute('d', d); e.lit.setAttribute('d', d);
      e.len = e.lit.getTotalLength();
      e.lit.style.transition = 'none';
      e.lit.style.strokeDasharray = e.len;
      e.lit.style.strokeDashoffset = e.lit.classList.contains('on') ? 0 : e.len;
    });
  };

  let path = []; // list of choice ids from the start
  const parentPath = ch => {
    if (ch === 'c1') return [];
    // keep the current route if it already reaches this chapter
    const i = path.findIndex(k => K[k].to === ch);
    if (i > -1) return path.slice(0, i + 1);
    const k = Object.keys(K).find(id => K[id].to === ch);
    return [...parentPath(K[k].from), k];
  };
  const selectChoice = id => { path = [...parentPath(K[id].from), id]; render(K[id].to); };
  const selectChapter = id => { path = parentPath(id); render(id); };

  const render = (cur, quiet) => {
    const lit = new Set(['c1', ...path, ...path.map(k => K[k].to)]);
    Object.entries(nodes).forEach(([id, n]) => {
      n.classList.toggle('lit', lit.has(id));
      if (K[id]) n.setAttribute('aria-pressed', path.includes(id));
      else n.setAttribute('aria-current', id === cur);
    });
    tree.classList.toggle('has-path', path.length > 0);
    let order = 0;
    const seq = []; path.forEach(k => { seq.push([K[k].from, k], [k, K[k].to]); });
    edges.forEach(e => {
      const idx = seq.findIndex(([a, b]) => a === e.a && b === e.b);
      const on = idx > -1, was = e.lit.classList.contains('on');
      e.lit.classList.toggle('on', on);
      if (on && !was) {
        e.lit.style.transition = 'none'; e.lit.style.strokeDashoffset = e.len;
        void e.lit.getBoundingClientRect();
        e.lit.style.transition = reduce ? 'none' : `stroke-dashoffset .5s var(--ease) ${(idx * 0.18).toFixed(2)}s, opacity .2s`;
        e.lit.style.strokeDashoffset = 0; order++;
      } else if (!on) { e.lit.style.transition = 'none'; e.lit.style.strokeDashoffset = e.len; }
    });
    const c = CH[cur], m = MODES[c.mode];
    const trail = path.length ? path.map(k => `<b>${K[k].t}</b>`).join(' → ') : 'No choices yet';
    detail.innerHTML = `<p class="eyebrow">${c.n}</p><h3>${c.t}</h3>
      <dl>
        <div><dt>Map mode</dt><dd><span class="bt-dot ${c.mode}" aria-hidden="true"></span><strong style="color:var(--starlight)">${m[0]}</strong> ${m[1]}</dd></div>
        <div><dt>Place tag</dt><dd>${c.tag}</dd></div>
        <div><dt>Play Anywhere</dt><dd>${c.tag === 'Any quiet street' ? 'Starts wherever the player is standing.' : `Auto-placed at the nearest ${c.tag.toLowerCase()} to the player, on whatever street they start.`}${c.find ? ` Players find ${c.find} and take a photo.` : ''}</dd></div>
      </dl>
      <p class="bt-trail">Route: ${trail}</p>
      ${c.end ? '<p class="bt-trail">One of three endings. Different choices, different walk.</p>' : ''}`;
    void quiet; void order;
  };

  $('btReset').addEventListener('click', () => { path = []; render('c1'); nodes.c1.focus(); });
  layout(); render('c1', true);
  new ResizeObserver(() => layout()).observe(tree);

  // Big moment: when the diagram scrolls into view, play one route.
  const box = tree.closest('[data-reveal]');
  if (box && !reduce) box.addEventListener('pg:reveal', () => {
    if (path.length) return;
    setTimeout(() => { if (!path.length) selectChoice('k1'); }, 500);
    setTimeout(() => { if (path.length === 1 && path[0] === 'k1') selectChoice('k4'); }, 1300);
  }, { once: true });
})();
