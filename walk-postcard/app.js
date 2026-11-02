// Walk postcard: what happens in the minute after a chapter ends.
// Chapter unlocked → a postcard builds itself (map draws, photo drops, stamp lands) → Share / Save
// → Pick tomorrow's walk (one time dropdown, one reminder) → preview of the evening notification
// → tester "Jump to Sunday" → weekly recap.
// ?v=postcard (default) | plan-first     ?style=stamp (default) | polaroid | minimal

const { STORY, NEXT, TIMES, COPY } = await import(`./copy.js${window.CACHE_V || ''}`);

const params = new URLSearchParams(location.search);
const VARIANTS = ['postcard', 'plan-first'];
const STYLES = ['stamp', 'polaroid', 'minimal'];
const state = {
  screen: 'unlock',
  variant: VARIANTS.includes(params.get('v')) ? params.get('v') : 'postcard',
  style: STYLES.includes(params.get('style')) ? params.get('style') : 'stamp',
  next: 0,
  time: 'evening',
  custom: '18:30',
  remind: true,
};

const $ = s => document.querySelector(s);
const screenEl = $('#screen'), sheetEl = $('#sheet'), scrimEl = $('#scrim'), toastEl = $('#toast');
const testerBtn = $('#testerBtn'), testerEl = $('#tester');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? '');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let uid = 0;
let timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, reduced ? 0 : ms));
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

/* ---------- little drawings (SVG only, brand colours only) ---------- */
const SPARK = 'M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z';

function gemSVG(colour = 'amethyst') {
  return `<svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M10 6h20l8 10-18 20L2 16z" style="fill:var(--${colour})"/>
    <path d="M10 6l4 10h12l4-10zM2 16h12l6 20zM26 16h12L20 36z" fill="#FBF7FF" fill-opacity=".22"/>
    <path d="M14 16l6-10 6 10z" fill="#FBF7FF" fill-opacity=".45"/>
    <path d="M10 6h20l8 10-18 20L2 16z" fill="none" stroke="#0B0620" stroke-opacity=".25" stroke-width="1"/>
  </svg>`;
}
const sparkSVG = cls => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${SPARK}"/></svg>`;

// The route: the first leg (from the player's door) is never drawn on a shareable map.
const ROUTE = [[28, 186], [28, 150], [72, 150], [72, 104], [124, 104], [124, 64], [168, 64]];
const TRIM = 2; // drawing starts at ROUTE[TRIM]; earlier points stay hidden under the blur
const path = pts => 'M' + pts.map(p => p.join(' ')).join(' L');

function streets(theme) {
  const c = theme === 'paper' ? '#9AAEC4' : '#46337E';
  const o = theme === 'paper' ? .55 : .9;
  const v = [28, 72, 124, 168, 196], h = [24, 64, 104, 150, 186];
  return `<g stroke="${c}" stroke-opacity="${o}" stroke-width="5" stroke-linecap="round" fill="none">
    ${v.map(x => `<line x1="${x}" y1="-5" x2="${x}" y2="205"/>`).join('')}
    ${h.map(y => `<line x1="-5" y1="${y}" x2="205" y2="${y}"/>`).join('')}
    <path d="M-5 205 L205 -5" stroke-width="7"/>
  </g>`;
}

function mapSVG({ theme = 'paper', animate = false } = {}) {
  const id = 'm' + (++uid);
  const bg = theme === 'paper' ? '#F4EBDD' : '#2A1658';
  const vis = ROUTE.slice(TRIM);
  const [sx, sy] = vis[0], [ex, ey] = vis[vis.length - 1];
  const fogFill = theme === 'paper' ? '#C9C6D3' : '#A493D6';
  return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of the route walked; the starting point is blurred">
    <defs>
      <linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}">
        <stop offset="0" stop-color="#F5B82E"/><stop offset="1" stop-color="#00CD9D"/>
      </linearGradient>
      <mask id="${id}k" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
        <path d="${path(vis)}" pathLength="1" class="route-draw${animate ? '' : ' done'}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" ${animate ? '' : 'style="stroke-dashoffset:0"'}/>
      </mask>
      <filter id="${id}b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
    </defs>
    <rect width="200" height="200" fill="${bg}"/>
    <path d="M150 140 q30 -6 60 10 v60 h-70 z" fill="#00CD9D" fill-opacity="${theme === 'paper' ? .18 : .16}"/>
    <path d="M-10 18 C 40 30, 90 2, 210 20" stroke="#58B0F6" stroke-opacity="${theme === 'paper' ? .35 : .3}" stroke-width="10" fill="none"/>
    ${streets(theme)}
    <path d="${path(vis)}" fill="none" stroke="url(#${id}g)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 8" mask="url(#${id}k)"/>
    <circle cx="${sx - 14}" cy="${sy + 14}" r="30" fill="${fogFill}" fill-opacity=".9" filter="url(#${id}b)"/>
    <g class="pin${animate ? '' : ' go'}" data-at="1">
      <circle cx="124" cy="104" r="7" fill="#F5B82E" stroke="${bg}" stroke-width="2.5"/>
      <circle cx="124" cy="104" r="2.4" fill="${bg}"/>
    </g>
    <g class="pin${animate ? '' : ' go'}" data-at="2">
      <path d="M${ex} ${ey + 2} c-9 -11 -12 -15 -12 -21 a12 12 0 0 1 24 0 c0 6 -3 10 -12 21z" fill="#00CD9D" stroke="${bg}" stroke-width="2"/>
      <rect x="${ex - 6}" y="${ey - 24}" width="12" height="8.5" rx="1.5" fill="${bg}"/>
      <path d="M${ex - 6} ${ey - 23.5} l6 4.5 6 -4.5" fill="none" stroke="#00CD9D" stroke-width="1.5"/>
    </g>
  </svg>`;
}

// The player's photo from the story ("Take a picture with me"): illustrated stand-in, not a real photo.
function photoSVG() {
  const id = 'p' + (++uid);
  return `<svg viewBox="0 0 160 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Your photo: the wax-sealed letter on the sidewalk under a streetlight">
    <defs>
      <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B0620"/><stop offset=".65" stop-color="#2A1658"/></linearGradient>
      <radialGradient id="${id}l" cx=".72" cy=".2" r=".6"><stop offset="0" stop-color="#F5B82E" stop-opacity=".75"/><stop offset=".55" stop-color="#F5B82E" stop-opacity=".12"/><stop offset="1" stop-color="#F5B82E" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46337E"/><stop offset="1" stop-color="#9AAEC4" stop-opacity=".55"/></linearGradient>
    </defs>
    <rect width="160" height="200" fill="url(#${id}s)"/>
    <g fill="#FBF7FF"><circle cx="20" cy="18" r=".9"/><circle cx="52" cy="30" r=".7"/><circle cx="34" cy="52" r=".8"/><circle cx="88" cy="14" r=".7"/></g>
    <g fill="#46337E" fill-opacity=".8">
      <rect x="0" y="62" width="44" height="74"/><rect x="40" y="80" width="30" height="56"/>
      <rect x="8" y="74" width="7" height="9" fill="#F5B82E" fill-opacity=".55"/><rect x="24" y="92" width="7" height="9" fill="#F5B82E" fill-opacity=".35"/>
    </g>
    <path d="M0 136 H160 V200 H0z" fill="url(#${id}w)"/>
    <path d="M0 150 L160 142 M0 172 L160 160" stroke="#1A0B3D" stroke-opacity=".35" stroke-width="1.2"/>
    <rect width="160" height="200" fill="url(#${id}l)"/>
    <rect x="116" y="34" width="4" height="110" fill="#1A0B3D"/>
    <path d="M104 34 h28 l-4 -8 h-20z" fill="#1A0B3D"/>
    <ellipse cx="118" cy="35" rx="9" ry="2.6" fill="#F5B82E"/>
    <path d="M50 140 q4 -18 0 -42 q-4 -8 -10 -6 q-5 -12 -12 -2 q-6 4 -4 20 q-6 14 -2 30z" fill="#0B0620" fill-opacity=".85"/>
    <g transform="translate(70 152) rotate(-9)">
      <rect x="0" y="0" width="58" height="36" rx="2" fill="#F4EBDD"/>
      <path d="M0 1 L29 21 L58 1" fill="none" stroke="#C9C6D3" stroke-width="1.6"/>
      <circle cx="29" cy="21" r="8.5" fill="#FF6050"/>
      <circle cx="29" cy="21" r="8.5" fill="none" stroke="#FA7423" stroke-width="1.4" stroke-dasharray="2 1.6"/>
      <path d="M29 15.5 L34 24 H24z" fill="none" stroke="#1A0B3D" stroke-width="1.4" stroke-linejoin="round"/>
      <circle cx="29" cy="21.2" r="1.4" fill="#1A0B3D"/>
    </g>
  </svg>`;
}

function weekMapSVG() {
  const id = 'w' + (++uid);
  const walks = [
    { d: 'M96 120 L96 84 L150 84 L150 50 L196 50', blur: [90, 128] },
    { d: 'M230 150 L230 110 L268 110 L268 70 L300 70', blur: [224, 158] },
    { d: 'M130 172 L176 172 L176 140 L214 140', blur: [124, 178] },
  ];
  const gems = [['amethyst', 196, 50], ['amber', 300, 70], ['turquoise', 214, 140], ['emerald', 150, 84]];
  return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of this week's walks; starting points blurred">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#F5B82E"/><stop offset="1" stop-color="#00CD9D"/></linearGradient>
      <filter id="${id}b" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="9"/></filter>
    </defs>
    <rect width="320" height="200" fill="#1A0B3D"/>
    <path d="M-10 30 C 80 50, 160 10, 330 36" stroke="#58B0F6" stroke-opacity=".28" stroke-width="14" fill="none"/>
    <path d="M20 120 q40 -20 60 20 v70 h-80z" fill="#00CD9D" fill-opacity=".14"/>
    <g stroke="#46337E" stroke-width="5" stroke-linecap="round">
      ${[50, 96, 150, 176, 230, 268, 300].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="200"/>`).join('')}
      ${[50, 70, 84, 110, 140, 172].map(y => `<line x1="0" y1="${y}" x2="320" y2="${y}"/>`).join('')}
    </g>
    ${walks.map(w => `<path d="${w.d}" fill="none" stroke="url(#${id}g)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 8"/>
      <circle cx="${w.blur[0]}" cy="${w.blur[1]}" r="20" fill="#A493D6" fill-opacity=".75" filter="url(#${id}b)"/>`).join('')}
    ${gems.map(([c, x, y]) => `<g transform="translate(${x - 9} ${y - 9}) scale(.45)">${gemSVG(c).replace(/<\/?svg[^>]*>/g, '')}</g>`).join('')}
  </svg>`;
}

/* ---------- postcard (three styles) ---------- */
function postcardHTML(style, animate) {
  const late = animate ? ' late' : '';
  const gem = STORY.gem;
  const P = COPY.postcard;
  if (style === 'polaroid') return `
    <div class="pc pc--polaroid${animate ? ' in' : ''}">
      <div class="pola">
        <div class="photo${late}">${photoSVG()}</div>
        <div class="cap">
          <p class="line fade${late}">“${esc(STORY.line)}”</p>
          <p class="by fade${late}">${esc(STORY.title)} · ${esc(STORY.date)}</p>
        </div>
      </div>
      <div class="tuck">
        <div class="map">${mapSVG({ theme: 'night', animate })}</div>
        <div class="stamp${late}">
          <div class="sticker">${gemSVG(gem.colour)}</div>
          <p class="nums"><b>${STORY.steps}</b> ${P.stepsLabel}<br><b>${STORY.minutes}</b> ${P.minLabel} · <b>${STORY.km}</b> ${P.kmLabel}</p>
        </div>
      </div>
    </div>`;
  if (style === 'minimal') return `
    <div class="pc pc--minimal${animate ? ' in' : ''}">
      <div class="map">${mapSVG({ theme: 'night', animate })}
        <div class="stamp${late}">${gemSVG(gem.colour)} ${esc(gem.name)}</div>
        <div class="photo${late}">${photoSVG()}</div>
      </div>
      <div class="body">
        <p class="by fade${late}">${esc(STORY.title)} · ${esc(STORY.chapter)}</p>
        <p class="line fade${late}">${esc(STORY.line)}</p>
        <div class="nums fade${late}">
          <span><b>${STORY.steps}</b>${P.stepsLabel}</span><span><b>${STORY.minutes}</b>${P.minLabel}</span><span><b>${STORY.km}</b>${P.kmLabel}</span>
        </div>
      </div>
    </div>`;
  // vintage stamp (default)
  return `
    <div class="pc pc--stamp${animate ? ' in' : ''}">
      <div class="top">
        <div>
          <p class="greet">${P.greeting}</p>
          <p class="place">${esc(STORY.title)}</p>
        </div>
        <div class="stamp${late}"><div class="in">${gemSVG(gem.colour)}<span>${esc(gem.jewel)}<br>${esc(gem.type)}</span></div></div>
      </div>
      <svg class="postmark${animate ? '' : ' land'}" viewBox="0 0 84 84" aria-hidden="true" ${animate ? '' : 'style="opacity:.55"'}>
        <circle cx="42" cy="42" r="30" fill="none" stroke="#1B3FA8" stroke-width="2"/>
        <circle cx="42" cy="42" r="24" fill="none" stroke="#1B3FA8" stroke-width="1"/>
        <text x="42" y="40" text-anchor="middle" font-family="Karla, sans-serif" font-weight="700" font-size="8" fill="#1B3FA8" letter-spacing="1">OCT 30</text>
        <text x="42" y="51" text-anchor="middle" font-family="Karla, sans-serif" font-weight="700" font-size="7" fill="#1B3FA8" letter-spacing="1">2026</text>
        <path d="M-6 30 q12 -6 24 0 t24 0 M-6 54 q12 -6 24 0 t24 0" transform="translate(70 0)" fill="none" stroke="#1B3FA8" stroke-width="1.5"/>
      </svg>
      <div class="mid">
        <div class="photo${late}"><div>${photoSVG()}</div></div>
        <div class="map">${mapSVG({ theme: 'paper', animate })}</div>
      </div>
      <p class="line fade${late}">“${esc(STORY.line)}”</p>
      <div class="foot fade${late}">
        <span><span class="k">${P.stepsLabel}</span>${STORY.steps}</span>
        <span><span class="k">${P.minLabel}</span>${STORY.minutes}</span>
        <span class="gem-badge">${gemSVG(gem.colour)}<span><span class="k">${esc(gem.type)}</span>${esc(gem.name)}</span></span>
      </div>
    </div>`;
}

// The "builds itself" sequence: card → route draws → pins → photo drops → words → stamp lands → buttons.
function playPostcard() {
  clearTimers();
  const root = screenEl;
  const q = s => root.querySelectorAll(s);
  const show = (el, cls) => { if (!el) return; el.classList.remove('late'); if (cls) el.classList.add(cls); };
  later(() => q('.route-draw').forEach(el => el.classList.add('go')), 150);
  later(() => q('.pin[data-at="1"]').forEach(el => el.classList.add('go')), 1100);
  later(() => q('.pin[data-at="2"]').forEach(el => el.classList.add('go')), 2000);
  later(() => show(root.querySelector('.pc .photo'), 'drop'), 1500);
  later(() => q('.pc .fade.late').forEach((el, i) => setTimeout(() => show(el), reduced ? 0 : i * 140)), 2100);
  later(() => { show(root.querySelector('.pc .stamp'), 'land'); const pm = root.querySelector('.postmark'); if (pm) pm.classList.add('land'); }, 2700);
  later(() => { const a = root.querySelector('.pc-actions'); if (a) { a.classList.remove('late'); a.classList.add('show'); } }, 3200);
}

/* ---------- screens ---------- */
const nextItem = () => NEXT[state.next % NEXT.length];
const timeItem = () => TIMES.find(t => t.id === state.time);
function to12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const hh = ((h + 11) % 12) + 1;
  return { at: `${hh}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`, lock: `${hh}:${String(m).padStart(2, '0')}` };
}
function chosenTime() {
  const t = timeItem();
  if (t.id !== 'custom') return t;
  const c = to12(state.custom || '18:30');
  return { ...t, at: c.at, lock: c.lock, day: `tomorrow at ${c.at}` };
}

const SCREENS = {
  unlock() {
    const U = COPY.unlock;
    const cta = state.variant === 'plan-first' ? U.ctaPlan : U.ctaPostcard;
    return { cls: 'unlock', html: `
      <div class="burst">${sparkSVG('sp')}<span class="ring"></span><div class="gem">${gemSVG(STORY.gem.colour)}</div></div>
      <div>
        <p class="eyebrow">${U.eyebrow}</p>
        <h1 class="h1">${esc(U.title)}</h1>
      </div>
      <p class="lede">${esc(U.body)}</p>
      <span class="gem-pill"><i></i>${esc(STORY.gem.name)} · ${esc(U.gemLine)}</span>
      <p class="stats-line"><b>${STORY.steps}</b> steps · <b>${STORY.minutes}</b> min walked</p>
      <div class="actions"><button class="btn" data-act="from-unlock" type="button">${cta}</button></div>` };
  },

  postcard() {
    const P = COPY.postcard;
    const nextLabel = state.variant === 'plan-first' ? P.nextPlanFirst : P.next;
    return { cls: 'postcard', after: playPostcard, html: `
      <div class="head-row"><div><p class="eyebrow">${P.eyebrow}</p><h1 class="h2">${P.title}</h1></div></div>
      <div class="pc-wrap">${postcardHTML(state.style, !reduced)}</div>
      <p class="privacy"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/></svg>${P.privacy}</p>
      <div class="pc-actions${reduced ? '' : ' late'}">
        <div class="row">
          <button class="btn" data-act="share" type="button"><svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>${P.share}</button>
          <button class="btn sec" data-act="save" type="button"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>${P.save}</button>
        </div>
        <button class="btn txt" data-act="from-postcard" type="button">${nextLabel} →</button>
      </div>` };
  },

  plan() {
    const L = COPY.plan, n = nextItem();
    return { cls: 'plan', html: `
      <div><p class="eyebrow">${L.eyebrow}</p><h1 class="h1">${L.title}</h1></div>
      <p class="lede">${L.intro}</p>
      <article class="next-card" id="nextCard">
        <div class="art" style="background: radial-gradient(80% 120% at 50% 0%, var(--${n.accent}), transparent 70%)"><span>${n.emoji}</span></div>
        <div class="txt">
          <p class="eyebrow">${esc(n.eyebrow)}</p>
          <h2 class="h2">${esc(n.title)}</h2>
          <p>${esc(n.blurb)}</p>
          <div class="meta">${n.meta.map(m => `<span>${esc(m)}</span>`).join('')}</div>
        </div>
      </article>
      <button class="btn txt swap" data-act="another" type="button">${L.another}</button>
      <label class="field"><span>${L.when}</span>
        <select class="select" id="timeSel">${TIMES.map(t => `<option value="${t.id}"${t.id === state.time ? ' selected' : ''}>${t.label}${t.at ? ' · ' + t.at : ''}</option>`).join('')}</select>
      </label>
      <label class="field" id="customWrap"${state.time === 'custom' ? '' : ' hidden'}><span>${L.pickTime}</span>
        <input class="time-input" type="time" id="customTime" value="${state.custom}">
      </label>
      <label class="toggle-row">
        <span class="t"><b>${L.remind}</b><small>${L.remindSub}</small></span>
        <input type="checkbox" id="remind" ${state.remind ? 'checked' : ''}><span class="switch" aria-hidden="true"></span>
      </label>
      <div class="spacer"></div>
      <button class="btn" data-act="save-plan" type="button">${L.save}</button>
      <button class="btn txt" data-act="later" type="button">${L.later}</button>` };
  },

  confirm() {
    const C = COPY.confirm, n = nextItem(), t = chosenTime();
    const lockDate = t.id === 'evening' ? C.lockToday : C.lockTomorrow;
    const primary = state.variant === 'plan-first'
      ? `<button class="btn" data-act="to-postcard" type="button">${C.seePostcard}</button>`
      : `<button class="btn" data-act="done" type="button">${C.done}</button>`;
    return { cls: 'confirm', html: `
      <div><p class="eyebrow">${C.eyebrow}</p><h1 class="h1">${esc(fill(C.title, { day: t.day }))}</h1></div>
      <p class="lede">${state.remind ? esc(fill(C.withReminder, { at: t.at })) : esc(C.noReminder)}</p>
      <div class="lock" aria-label="Preview of your phone's lock screen">
        <div class="clock"><small>${lockDate}</small><b>${t.lock}</b></div>
        ${state.remind ? `
        <div class="notif slide" role="img" aria-label="Notification preview">
          <span class="icon"><svg viewBox="0 0 24 24"><path d="${SPARK}"/></svg></span>
          <div><div class="hd"><span>${C.appName}</span><span>${C.now}</span></div>
            <b>${esc(n.notifTitle)}</b><p>${esc(n.notifBody)}</p></div>
        </div>` : `<p class="quiet"><span>🌙</span>${esc(C.noReminder)}</p>`}
      </div>
      <div class="plan-sum"><span class="e">${n.emoji}</span><span><b>${esc(n.title)}</b><small>${esc(t.id === 'custom' ? 'Tomorrow' : t.label)} · ${esc(t.at)}</small></span></div>
      <div class="spacer"></div>
      ${primary}
      <button class="btn txt" data-act="change" type="button">${C.change}</button>
      <button class="btn test-btn" data-act="sunday" type="button">${C.sunday}</button>` };
  },

  recap() {
    const R = COPY.recap;
    return { cls: 'recap', html: `
      <div><p class="eyebrow">${R.eyebrow}</p><h1 class="h1">${R.title}</h1></div>
      <p class="lede">${R.intro}</p>
      <div class="tiles">${R.tiles.map(t => `<div class="tile"><b>${t.n}</b><span>${t.label}</span></div>`).join('')}</div>
      <section class="card"><h3>${R.mapTitle}</h3><div class="week-map">${weekMapSVG()}</div>
        <p class="privacy" style="margin-top:10px"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/></svg>${R.mapNote}</p></section>
      <section class="card"><h3>${R.gemsTitle}</h3>
        <ul class="gem-list">${R.gems.map(g => `<li>${gemSVG(g.colour)}<span><b>${esc(g.name)}</b>${esc(g.type)}</span></li>`).join('')}</ul></section>
      <section class="card"><h3>${R.favTitle}</h3>
        <div class="fav"><div class="thumb"><div>${photoSVG()}</div></div><div><q>${esc(R.favLine)}</q><small>${esc(R.favFrom)}</small></div></div></section>
      <p class="outro">${R.outro}</p>
      <button class="btn" data-act="share-week" type="button">${R.share}</button>
      <button class="btn sec" data-act="plan-from-recap" type="button">${R.plan}</button>
      <button class="btn txt" data-act="restart" type="button">${R.back}</button>` };
  },
};

function go(screen) {
  clearTimers();
  closeSheet(); closeTester();
  state.screen = screen;
  const s = SCREENS[screen]();
  screenEl.className = 'screen enter ' + s.cls;
  screenEl.innerHTML = s.html;
  screenEl.scrollTop = 0;
  screenEl.dataset.screen = screen;
  bindScreen();
  if (s.after) s.after();
}

function bindScreen() {
  const sel = $('#timeSel');
  if (sel) sel.addEventListener('change', () => { state.time = sel.value; $('#customWrap').hidden = state.time !== 'custom'; });
  const ct = $('#customTime');
  if (ct) ct.addEventListener('change', () => { state.custom = ct.value || '18:30'; });
  const rm = $('#remind');
  if (rm) rm.addEventListener('change', () => { state.remind = rm.checked; });
}

/* ---------- actions ---------- */
const ACTIONS = {
  'from-unlock': () => go(state.variant === 'plan-first' ? 'plan' : 'postcard'),
  'from-postcard': () => {
    if (state.variant === 'plan-first') { go('unlock'); toast(COPY.confirm.doneToast); }
    else go('plan');
  },
  share: () => openSheet('postcard'),
  'share-week': () => openSheet('week'),
  save: () => toast(COPY.postcard.savedToast),
  another: () => { state.next++; go('plan'); },
  'save-plan': () => go('confirm'),
  later: () => {
    toast(COPY.plan.laterToast);
    if (state.variant === 'plan-first') go('postcard'); else go('unlock');
  },
  'to-postcard': () => go('postcard'),
  done: () => { go('unlock'); toast(COPY.confirm.doneToast); },
  change: () => go('plan'),
  sunday: () => go('recap'),
  'plan-from-recap': () => go('plan'),
  restart: () => go('unlock'),
  replay: () => { if (state.screen === 'postcard') go('postcard'); else go('postcard'); },
  'sheet-close': () => closeSheet(),
  'sheet-pick': () => { closeSheet(); toast(COPY.share.toast); },
};

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (b && ACTIONS[b.dataset.act]) { ACTIONS[b.dataset.act](b); return; }
});

/* ---------- share sheet (pretend) ---------- */
let lastFocus = null;
function openSheet(kind) {
  const S = COPY.share;
  lastFocus = document.activeElement;
  sheetEl.innerHTML = `
    <div class="grab" aria-hidden="true"></div>
    <div class="hd"><div class="thumb">${kind === 'week' ? weekMapSVG() : photoSVG()}</div>
      <div><b>${S.title.replace('postcard', kind === 'week' ? 'week' : 'postcard')}</b><small>${kind === 'week' ? S.weekSub : S.sub}</small></div></div>
    <div class="apps">${S.apps.map(a => `<button class="app" type="button" data-act="sheet-pick"><span>${a.emoji}</span>${a.label}</button>`).join('')}</div>
    <div class="acts">${S.actions.map(a => `<button class="act" type="button" data-act="sheet-pick">${a.label}<span>${a.emoji}</span></button>`).join('')}</div>
    <button class="btn sec" type="button" data-act="sheet-close">${S.close}</button>`;
  sheetEl.setAttribute('aria-label', S.title);
  sheetEl.hidden = false; scrimEl.hidden = false;
  sheetEl.querySelector('.app').focus({ preventScroll: true });
}
function closeSheet() {
  if (sheetEl.hidden) return;
  sheetEl.hidden = true; scrimEl.hidden = true;
  if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
}
scrimEl.addEventListener('click', closeSheet);

/* ---------- tester menu ---------- */
function renderTester() {
  const T = COPY.tester;
  testerBtn.textContent = T.open;
  testerEl.setAttribute('aria-label', T.title);
  testerEl.innerHTML = `
    <h3>${T.title}</h3>
    <label class="field"><span>${T.variant}</span>
      <select class="select" id="tVariant">${VARIANTS.map(v => `<option value="${v}"${v === state.variant ? ' selected' : ''}>${T.variants[v]}</option>`).join('')}</select></label>
    <label class="field"><span>${T.style}</span>
      <select class="select" id="tStyle">${STYLES.map(s => `<option value="${s}"${s === state.style ? ' selected' : ''}>${T.styles[s]}</option>`).join('')}</select></label>
    <button class="btn sec" type="button" data-act="replay">${T.replay}</button>
    <button class="btn sec" type="button" data-act="sunday">${T.sunday}</button>
    <button class="btn txt" type="button" data-act="restart">${T.restart}</button>
    <p class="note">${T.note}</p>`;
  $('#tVariant').addEventListener('change', e => { state.variant = e.target.value; syncURL(); go('unlock'); });
  $('#tStyle').addEventListener('change', e => { state.style = e.target.value; syncURL(); go('postcard'); });
}
function openTester() { renderTester(); testerEl.hidden = false; testerBtn.setAttribute('aria-expanded', 'true'); $('#tVariant').focus({ preventScroll: true }); }
function closeTester() { if (testerEl.hidden) return; testerEl.hidden = true; testerBtn.setAttribute('aria-expanded', 'false'); }
testerBtn.addEventListener('click', e => { e.stopPropagation(); testerEl.hidden ? openTester() : closeTester(); });
document.addEventListener('pointerdown', e => {
  if (!testerEl.hidden && !testerEl.contains(e.target) && e.target !== testerBtn) closeTester();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!sheetEl.hidden) { closeSheet(); return; }
  if (!testerEl.hidden) { closeTester(); testerBtn.focus(); }
});

function syncURL() {
  const p = new URLSearchParams(location.search);
  p.set('v', state.variant); p.set('style', state.style);
  history.replaceState(null, '', '?' + p.toString());
}

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('on'), 2800);
}

testerBtn.textContent = COPY.tester.open;

// For the QA script and testers: ?screen=recap etc. jumps straight to a screen.
const start = params.get('screen');
go(SCREENS[start] ? start : 'unlock');
window.__postcard = { state, go };
