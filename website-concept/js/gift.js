// gift.html — gift-a-story flow: occasion, note, story → citrine ticket. Download as PNG, copy a share link.
// No payment, nothing sent anywhere. The share link keeps its data after the # so it never reaches a server.
(() => {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const OCC = {
    just: 'Just because', bday: 'Happy birthday', thanks: 'With thanks', anniv: 'Happy anniversary',
    halloween: 'Happy Halloween', holiday: 'Happy holidays', newtown: 'Welcome to the neighbourhood', getwell: 'For when you feel like a walk'
  };
  const FALLBACK = [
    { id: 'alice', name: 'Alice Through The Tear', cover: 'img/alice.jpg', type: 'anywhere' },
    { id: 'coronet', name: 'The Coronet Caper', cover: 'img/coronet.jpg', type: 'local', city: 'Edmonton' },
    { id: 'woglins', name: 'Woglins and Wozzips', cover: 'img/woglins.jpg', type: 'anywhere' },
    { id: 'barista', name: 'Tips From Your Barista', cover: 'img/barista.jpg', type: 'anywhere' }
  ];
  const occ = $('gtOcc'), to = $('gtTo'), from = $('gtFrom'), note = $('gtNote');
  const grid = $('gtStories'), more = $('gtMore');
  let stories = FALLBACK, story = FALLBACK[0];

  /* ---------- Share link ---------- */
  const enc = o => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = s => { try { const b = atob(s.replace(/-/g, '+').replace(/_/g, '/')); return JSON.parse(new TextDecoder().decode(Uint8Array.from(b, c => c.charCodeAt(0)))); } catch { return null; } };
  const shared = location.hash.startsWith('#t=') ? dec(location.hash.slice(3)) : null;
  if (shared) {
    if (OCC[shared.o]) occ.value = shared.o;
    to.value = (shared.to || '').slice(0, 28); from.value = (shared.fr || '').slice(0, 28); note.value = (shared.n || '').slice(0, 140);
    $('gtBanner').classList.add('on');
  }

  /* ---------- Ticket text ---------- */
  const today = new Date().toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric' });
  $('tkDate').textContent = today;
  const sync = () => {
    const t = to.value.trim();
    $('tkOcc').textContent = OCC[occ.value] + (t ? `, ${t}` : '');
    $('tkTitle').textContent = story.name;
    $('tkNote').textContent = note.value.trim() ? `“${note.value.trim()}”` : '';
    $('tkFrom').textContent = from.value.trim() ? `From ${from.value.trim()}` : '';
    $('gtCount').textContent = `${note.value.length} / 140`;
    const cov = $('gtCover');
    if (story.cover) { cov.hidden = false; if (cov.getAttribute('src') !== story.cover) cov.src = story.cover; } else cov.hidden = true;
    $('gtTicket').setAttribute('aria-label', `Gift ticket: ${$('tkOcc').textContent}. ${story.name}. ${$('tkNote').textContent} ${$('tkFrom').textContent}. Admit 1.`);
  };
  [occ].forEach(el => el.addEventListener('change', sync));
  [to, from, note].forEach(el => el.addEventListener('input', sync));

  /* ---------- Story picker ---------- */
  const pickStory = (s, focus) => {
    story = s;
    grid.querySelectorAll('.gt-st').forEach(b => { const on = b.dataset.id === s.id; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    if (!grid.querySelector('[aria-checked="true"]')) grid.querySelector('.gt-st').tabIndex = 0;
    if (more.options.length) more.value = s.id;
    sync();
  };
  const buildPicker = (featured, all) => {
    grid.innerHTML = '';
    featured.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'gt-st'; b.dataset.id = s.id; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.innerHTML = `${s.cover ? `<img src="${s.cover}" alt="" loading="lazy">` : '<span class="gt-noimg"></span>'}<span></span>`;
      b.lastChild.textContent = s.name;
      b.addEventListener('click', () => pickStory(s));
      b.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (d) { e.preventDefault(); pickStory(featured[(i + d + featured.length) % featured.length], true); }
      });
      grid.append(b);
    });
    if (all.length > featured.length) {
      more.innerHTML = '';
      all.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name + (s.type === 'local' && s.city ? ` · ${s.city}` : ''); more.append(o); });
      $('gtMoreWrap').hidden = false;
      more.onchange = () => pickStory(all.find(s => s.id === more.value));
    }
  };
  const start = () => {
    const want = shared && stories.find(s => s.id === shared.s);
    const featured = stories.slice(0, 8);
    if (want && !featured.includes(want)) featured[7] = want;
    buildPicker(featured, stories);
    pickStory(want || featured[0]);
  };
  start();
  fetch('data/stories.json').then(r => r.ok ? r.json() : Promise.reject()).then(d => {
    const list = (Array.isArray(d) ? d : d.stories || []).filter(s => s && s.name && (!s.language || s.language === 'en'));
    if (!list.length) return;
    // Covers first, Play Anywhere first (they work wherever the person lives), keep catalogue order otherwise.
    list.sort((a, b) => (!!b.cover - !!a.cover) || ((b.type === 'anywhere') - (a.type === 'anywhere')));
    stories = list; start();
  }).catch(() => {});

  /* ---------- Print + tear motion ---------- */
  const printer = $('gtPrinter');
  let timers = [];
  const print = () => {
    if (reduce) { printer.classList.add('done'); return; }
    timers.forEach(clearTimeout); timers = [];
    printer.classList.remove('done', 'tearing', 'printing'); void printer.offsetWidth;
    printer.classList.add('printing');
    timers.push(setTimeout(() => { printer.classList.remove('printing'); printer.classList.add('tearing'); }, 1650));
    timers.push(setTimeout(() => { printer.classList.remove('tearing'); printer.classList.add('done'); }, 2550));
  };
  const prev = $('gtPreview');
  if (reduce || !('IntersectionObserver' in window)) printer.classList.add('done');
  else { printer.classList.add('printing'); printer.style.visibility = 'hidden'; prev.addEventListener('pg:reveal', () => { printer.style.visibility = ''; print(); }, { once: true }); }
  $('gtReprint').addEventListener('click', print);

  /* ---------- Copy link ---------- */
  const status = $('gtStatus');
  const say = t => { status.textContent = t; clearTimeout(say.t); say.t = setTimeout(() => (status.textContent = ''), 4000); };
  $('gtCopy').addEventListener('click', async () => {
    const data = { o: occ.value, to: to.value.trim(), fr: from.value.trim(), n: note.value.trim(), s: story.id };
    const url = location.href.split('#')[0] + '#t=' + enc(data);
    try { await navigator.clipboard.writeText(url); say('Link copied. Anyone with it can see your note.'); }
    catch {
      const ta = document.createElement('textarea'); ta.value = url; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.append(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch {}
      ta.remove(); say(ok ? 'Link copied. Anyone with it can see your note.' : 'Copy did not work here. Try Download Ticket instead.');
    }
  });

  /* ---------- Download as PNG (canvas, all in the browser) ---------- */
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const loadImg = src => new Promise(res => { if (!src) return res(null); const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  const wrapText = (ctx, text, max, lines) => {
    const words = text.split(/\s+/), out = []; let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > max && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    if (out.length > lines) { out.length = lines; let l = out[lines - 1]; while (ctx.measureText(l + '…').width > max && l.length) l = l.slice(0, -1); out[lines - 1] = l.trimEnd() + '…'; }
    return out;
  };
  const sparkle = (ctx, x, y, r) => {
    const k = r / 12; ctx.save(); ctx.translate(x - r, y - r); ctx.scale(k, k);
    ctx.fill(new Path2D('M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z')); ctx.restore();
  };
  const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); };

  $('gtDownload').addEventListener('click', async () => {
    say('Making your ticket…');
    await Promise.all([document.fonts.load('600 60px Erode'), document.fonts.load('italic 500 30px Erode'), document.fonts.load('700 20px Karla')]).catch(() => {});
    const C = { ink: css('--ink'), mid: css('--midnight'), velvet: css('--velvet'), cit: css('--citrine'), glow: css('--glow'), star: css('--starlight') };
    const W = 1600, H = 820, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    // Night background with a soft glow
    ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W * .75, H * .2, 20, W * .75, H * .2, W * .7); g.addColorStop(0, C.velvet); g.addColorStop(1, C.ink);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.cit; [[120, 90, 14], [1490, 120, 20], [1440, 730, 12], [180, 740, 10]].forEach(([x, y, r]) => sparkle(ctx, x, y, r));

    // Ticket on its own layer so the notches are real holes
    const tx = 100, ty = 120, tw = 1400, th = 580, stubW = 300, hole = 34;
    const t = document.createElement('canvas'); t.width = W; t.height = H; const c = t.getContext('2d');
    c.fillStyle = C.cit; rr(c, tx, ty, tw, th, 28); c.fill();
    c.globalCompositeOperation = 'destination-out';
    [[tx, ty + th / 2], [tx + tw, ty + th / 2]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, hole, 0, Math.PI * 2); c.fill(); });
    c.globalCompositeOperation = 'source-over';
    // perforation
    const px = tx + tw - stubW; c.strokeStyle = C.mid; c.globalAlpha = .38; c.lineWidth = 5; c.setLineDash([16, 12]);
    c.beginPath(); c.moveTo(px, ty + 30); c.lineTo(px, ty + th - 30); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
    // cover
    const img = await loadImg(story.cover);
    let x0 = tx + 64;
    if (img) {
      const ch = th - 120, cw = Math.round(ch * 5 / 8), cy = ty + 60;
      c.save(); rr(c, x0, cy, cw, ch, 16); c.clip();
      const s = Math.max(cw / img.width, ch / img.height), iw = img.width * s, ih = img.height * s;
      c.drawImage(img, x0 + (cw - iw) / 2, cy + (ch - ih) / 2, iw, ih); c.restore();
      x0 += cw + 56;
    }
    const maxW = px - x0 - 50;
    c.fillStyle = C.mid; c.textBaseline = 'alphabetic';
    let y = ty + 98;
    c.font = '600 34px Erode, Georgia, serif'; sparkle(c, x0 + 12, y - 12, 13); c.fillText('Story City', x0 + 36, y);
    y += 62; c.font = '700 22px Karla, sans-serif'; c.letterSpacing = '4px';
    c.fillText($('tkOcc').textContent.toUpperCase(), x0, y); c.letterSpacing = '0px';
    y += 76; c.font = '600 64px Erode, Georgia, serif';
    wrapText(c, story.name, maxW, 2).forEach(l => { c.fillText(l, x0, y); y += 70; });
    const n = $('tkNote').textContent;
    if (n) { y += 8; c.font = 'italic 500 32px Erode, Georgia, serif'; wrapText(c, n, maxW, 3).forEach(l => { c.fillText(l, x0, y); y += 44; }); }
    const f = $('tkFrom').textContent;
    if (f) { y += 14; c.font = '700 26px Karla, sans-serif'; c.fillText(f, x0, Math.min(y, ty + th - 50)); }
    // stub
    c.save(); c.translate(px + stubW / 2 + 6, ty + th / 2); c.rotate(-Math.PI / 2);
    c.font = '700 54px Karla, sans-serif'; c.letterSpacing = '10px'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('ADMIT 1', 0, 0); c.restore();
    c.font = '700 18px Karla, sans-serif'; c.letterSpacing = '2px'; c.textAlign = 'center';
    c.fillText(today.toUpperCase(), px + stubW / 2, ty + th - 40);
    sparkle(c, px + stubW / 2, ty + 70, 18);

    ctx.save(); ctx.shadowColor = C.ink; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24; ctx.translate(W / 2, H / 2); ctx.rotate(-0.025); ctx.translate(-W / 2, -H / 2);
    ctx.drawImage(t, 0, 0); ctx.restore();

    cv.toBlob(b => {
      if (!b) return say('Sorry, the download did not work in this browser.');
      const a = document.createElement('a'); a.href = URL.createObjectURL(b);
      a.download = 'story-city-ticket-' + story.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      say('Ticket downloaded.');
    }, 'image/png');
  });
})();
