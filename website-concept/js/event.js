/* event.html — The Longest Night: countdown, calendar, city picker. */
(() => {
  const $ = id => document.getElementById(id);
  const YEAR = 2026, MONTH = 11, DAY = 21, HOUR = 17;          // 21 Dec 2026, about 5 pm local ("after dark")
  const pad = n => String(n).padStart(2, '0');
  const pageUrl = () => location.href.split('#')[0];

  // Countdown
  const target = () => new Date(YEAR, MONTH, DAY, HOUR, 0, 0);
  const sr = $('evCountSr');
  let lastSr = 0;
  const tick = () => {
    const ms = target() - Date.now();
    if (ms <= 0) {
      ['evD', 'evH', 'evM', 'evS'].forEach(i => $(i).textContent = '0');
      $('evCountLabel').textContent = Date.now() - target() < 8 * 3600e3 ? 'It is the longest night. Go and walk it.' : 'The longest night has passed. See you next winter.';
      return false;
    }
    const s = Math.floor(ms / 1000);
    $('evD').textContent = Math.floor(s / 86400);
    $('evH').textContent = pad(Math.floor(s % 86400 / 3600));
    $('evM').textContent = pad(Math.floor(s % 3600 / 60));
    $('evS').textContent = pad(s % 60);
    if (Date.now() - lastSr > 60000) { lastSr = Date.now(); sr.textContent = `${Math.floor(s / 86400)} days and ${Math.floor(s % 86400 / 3600)} hours to go`; }
    return true;
  };
  if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }

  // Calendar
  const SUMMARY = 'The Longest Night: a Story City walk';
  const DESC = 'One story, every city, walk it after dark on the winter solstice. Get the app and pick your city: ' + pageUrl();
  const start = `${YEAR}${pad(MONTH + 1)}${pad(DAY)}T${pad(HOUR)}0000`;
  const end = `${YEAR}${pad(MONTH + 1)}${pad(DAY)}T${pad(HOUR + 3)}0000`;
  const esc = s => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const fold = l => { const out = []; while (l.length > 74) { out.push(l.slice(0, 74)); l = ' ' + l.slice(74); } out.push(l); return out.join('\r\n'); };
  const buildIcs = () => {
    const d = new Date(), stamp = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Story City//The Longest Night//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      'UID:longest-night-2026@storycity-concept', 'DTSTAMP:' + stamp, 'DTSTART:' + start, 'DTEND:' + end,
      'SUMMARY:' + esc(SUMMARY), 'DESCRIPTION:' + esc(DESC), 'URL:' + pageUrl(),
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:The Longest Night starts soon', 'TRIGGER:-PT1H', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
  };
  window.SC_EVENT = { buildIcs };
  const status = $('evCalStatus');
  const download = () => {
    try {
      const url = URL.createObjectURL(new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = 'the-longest-night.ics';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
      status.textContent = 'Calendar file downloaded. Open it to save the event.';
    } catch (e) { status.textContent = 'Could not make the file. Try the Google Calendar link.'; }
  };
  $('evCal').addEventListener('click', download);
  $('evCalTop').addEventListener('click', () => { download(); $('cal').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
  $('evGcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(SUMMARY) +
    '&dates=' + start + '/' + end + '&details=' + encodeURIComponent(DESC);

  // Poster
  $('evPrint').addEventListener('click', () => window.print());
  const host = location.protocol.startsWith('http') && location.host ? location.host : '';
  if (host && !/localhost|127\.0\.0\.1/.test(host)) $('evPosterUrl').textContent = host;

  // City picker
  const sel = $('evCity'), note = $('evCityNote'), walk = $('evWalk');
  const slugify = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const disp = s => String(s || '').replace(/\s*\([A-Z]{2}\)\s*$/, '');
  fetch('data/cities.json').then(r => r.json()).then(d => {
    const list = d.cities.slice().sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
    const any = d.anywhereCount || 0;
    sel.innerHTML = '<option value="">Choose your city</option>' + list.map(c =>
      `<option value="${slugify(c.city)}">${disp(c.city)}, ${c.country} (${c.count} local ${c.count === 1 ? 'story' : 'stories'})</option>`).join('');
    const upd = () => {
      const c = list.find(x => slugify(x.city) === sel.value);
      if (!c) { note.textContent = ''; walk.textContent = 'Walk It in Your City'; walk.href = 'cities.html'; return; }
      note.textContent = `${disp(c.city)} has ${c.count} local ${c.count === 1 ? 'story' : 'stories'}, plus ${any} Play Anywhere stories that fit any street.`;
      walk.textContent = 'Walk It in ' + disp(c.city);
      walk.href = 'city.html?c=' + encodeURIComponent(sel.value);
    };
    sel.addEventListener('change', upd);
  }).catch(() => { sel.innerHTML = '<option value="">Cities unavailable</option>'; note.textContent = 'The city list did not load. Browse them all on the cities page.'; });
})();
