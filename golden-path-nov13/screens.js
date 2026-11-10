// The phone screens for each question and option, plus the flow strip (Q1) and the timeline (Q2).
// Each returns an HTML string. Words that belong to the options live in questions.js.
const M = await import('./maps.js' + (window.CACHE_V || ''));

// ---------------------------------------------------------------- small parts
const ic = {
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  walk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 4.5c1.6 0 2.5 1.6 2.3 4-.2 2.2-1 3.5-2.3 3.5S6 10.8 6 8.6c0-2.3 1-4.1 2.5-4.1zM6.5 14.5h4l-.4 2.4a2 2 0 01-3.9 0zM15.5 8c1.5 0 2.5 1.7 2.5 4s-1 3.5-2.4 3.5-2.3-1.3-2.4-3.5c-.2-2.3.8-4 2.3-4zM13.6 18h4l-.4 1.5a2 2 0 01-3.6 0z"/></svg>',
  route: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2"/><path d="M8 18h6.5a3.5 3.5 0 000-7h-5a3.5 3.5 0 010-7H16"/><path d="M18 2.5l2.5 1.5L18 5.5"/></svg>',
  tread: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18.5h15l3-3"/><path d="M15 18.5L18 6h2.5"/><circle cx="9" cy="6" r="1.8"/><path d="M9 8.5l-1.5 4.5 3 2M9 9.5l3 1.5"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  hand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 013 0V11m0-1.5a1.5 1.5 0 013 0V12m0-1a1.5 1.5 0 013 0v4a6 6 0 01-6 6h-1a6 6 0 01-5-2.7L4.5 15a1.5 1.5 0 012.4-1.8L9 15"/></svg>',
  library: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4v16H5zM10 4h4v16h-4zM15.5 4.5l3.8-1 3.2 15.5-3.8.9z"/></svg>',
};
const statusBar = () => `<div class="sb" aria-hidden="true"><span>9:41</span><i class="isl"></i><span class="sbi"><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity=".4"/></svg><svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2.5" y="2.5" width="15" height="7" rx="1.5"/><rect x="23.5" y="4" width="2" height="4" rx="1" opacity=".5"/></svg></span></div>`;
export const phone = (inner, cls = '', label = 'Phone mockup') => `<div class="phone ${cls}" role="group" aria-label="${label}"><div class="scr">${statusBar()}${inner}</div></div>`;

const gem = (s = 64) => `<svg class="gem" width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="gm${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4CCFF"/><stop offset=".5" stop-color="#B36BFF"/><stop offset="1" stop-color="#5A2BB0"/></linearGradient></defs><path d="M18 10h28l12 14-26 32L6 24z" fill="url(#gm${s})"/><path d="M6 24h52M18 10l8 14 6 32 6-32 8-14M26 24h12" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/></svg>`;
const cover = (img, cls = '') => `<span class="cov ${cls}" style="background-image:url(img/${img === 'summons' ? 'summons.png' : img + '.jpg'})" aria-hidden="true"></span>`;
const modePill = (m = 'walk', note = '') => `<span class="mode m-${m}"><i></i>${{ walk: 'Walk', path: 'Path', hunt: 'Hunt' }[m]}</span>${note ? `<span class="mnote">${note}</span>` : ''}`;
const sso = (light) => `<button class="sso light" type="button">Continue with Apple</button><button class="sso" type="button">Continue with Google</button><button class="sso" type="button">Use my email</button>`;

const STORIES = {
  squeaky: { t: 'Have You Seen Squeaky?', m: 'Plays anywhere · 20 min', acc: '#F5B82E' },
  summons: { t: 'The Summons', m: 'Plays anywhere · 10 min', acc: '#FA7423' },
  incident: { t: 'Tales from the Incident', m: 'Plays anywhere · 30–45 min', acc: '#9883F8' },
  adelaide: { t: 'The Adelaide Time Travel Caper', m: 'Passport · 25 min', acc: '#5B8CFF' },
  coronet: { t: 'The Coronet Caper', m: 'Legislature grounds · 2.1 km', acc: '#FF4F79' },
  dragons: { t: 'Dragons in the Park', m: 'Louise McKinney Park · 1.7 km', acc: '#00CD9D' },
  kindness: { t: 'Kindness Walk Edmonton', m: 'Queen Elizabeth Park · 0.95 km', acc: '#BED13F' },
};
const row = (id, extra = '') => { const s = STORIES[id]; return `<div class="srow">${cover(id, 'sm')}<div><b>${s.t}</b><span>${extra || s.m}</span></div></div>`; };

function library(top = '') {
  return `<div class="lib">
    <div class="libtop"><h3>Library</h3>${top}<button class="ib" type="button" aria-label="Search">${ic.search}</button></div>
    <p class="seclab">Keep going</p>
    <div class="feat">${cover('squeaky', 'lg')}<div><b>Have You Seen Squeaky?</b><span>Chapter 2 is next</span></div></div>
    <p class="seclab">Plays anywhere</p>
    ${row('incident')}${row('adelaide')}${row('summons')}
  </div><nav class="tabbar" aria-hidden="true"><span class="on">${ic.library}Library</span></nav>`;
}

// the first real story's page, used behind sheets
function storyPage(id = 'squeaky') {
  const s = STORIES[id];
  return `<div class="hero" style="background-image:url(img/${id}.jpg)"><button class="ib back" type="button" aria-label="Back">${ic.back}</button></div>
    <div class="spage"><p class="kick">Your first real story</p><h3 class="hl">${s.t}</h3><p class="meta">${s.m} · 4 chapters · Family comedy</p>
    <p class="blurb">Squeaky the rubber chicken has gone missing, and every mailbox on your street saw something.</p></div>`;
}

// ---------------------------------------------------------------- 1 · forced sign-up
const Q1 = {
  A: () => phone(`<div class="pad acct">
      <div class="gemwrap">${gem(70)}</div>
      <h3 class="hl">Save your gems and progress</h3>
      <p class="lede">A free account keeps your stories on any phone.</p>
      ${sso()}
      <button class="textbtn hi" type="button">Not now</button>
    </div>`, '', 'Option A: account screen after Welcome, with Not now'),
  B: () => phone(`<div class="pad acct">
      <div class="okbadge">${ic.check}</div>
      <h3 class="hl">Your 7-day trial has started</h3>
      <p class="lede">Create an account to keep your trial and your progress.</p>
      ${sso()}
      <p class="req">${ic.lock}Needed to keep your trial</p>
    </div>`, '', 'Option B: account required after the trial starts'),
  C: () => phone(`${storyPage()}<div class="scrim"></div>
    <section class="sheet"><div class="grab"></div>
      <h3 class="hl sm">Create an account to start this story</h3>
      <p class="lede">You need an account for every story after the tiny one.</p>
      ${sso()}
      <p class="req">${ic.lock}Required. No way to skip.</p>
    </section>`, '', 'Option C: hard gate before the first real story'),
};
const FLOW = {
  A: [['Welcome'], ['Create an account', 'skip'], ['Tiny story'], ['Save your gem: account?', 'skip'], ['Paywall'], ['7-day trial'], ['“Save your progress”', 'skip'], ['First real story', 'goal']],
  B: [['Welcome'], ['Create an account', 'skip'], ['Tiny story'], ['Save your gem: account?', 'skip'], ['Paywall'], ['7-day trial'], ['Create an account', 'must'], ['First real story', 'goal']],
  C: [['Welcome'], ['Create an account', 'skip'], ['Tiny story'], ['Paywall'], ['7-day trial'], ['Create an account', 'must'], ['First real story', 'goal']],
};
const flowStrip = (k) => `<ol class="flow" aria-label="Where the account ask sits">${FLOW[k].map(([t, kind = '']) => `<li class="${kind}"><i aria-hidden="true">${kind === 'must' ? ic.lock : ''}</i><span>${t}</span>${kind === 'skip' ? '<em>can skip</em>' : kind === 'must' ? '<em>required</em>' : ''}</li>`).join('')}</ol>`;

// ---------------------------------------------------------------- 2 · asking again
const Q2 = {
  A: () => phone(`<div class="hero tall" style="background-image:url(img/squeaky.jpg)"></div>
    <div class="pay">
      <p class="kick">Have You Seen Squeaky?</p>
      <h3 class="hl">Chapter 2 is waiting</h3>
      <p class="lede">Start your 7-day free trial to find out who took Squeaky. Cancel any time.</p>
      <button class="cta" type="button">Start free trial</button>
      <button class="textbtn" type="button">Not now</button>
      <p class="fine">After this, the trial is only a tap on Subscribe away.</p>
    </div>`, '', 'Option A: second ask at the next chapter-2 paywall'),
  B: () => phone(`${library()}<div class="scrim"></div>
    <section class="modal">
      <h3 class="hl sm">Welcome back! Try 7 days free?</h3>
      <p class="lede">Every story, every chapter. Cancel any time.</p>
      <button class="cta" type="button">Start free trial</button>
      <button class="textbtn" type="button">Not now</button>
    </section>`, '', 'Option B: pop-up every session'),
  C: () => phone(library(`<button class="subbtn glow" type="button">Subscribe</button>`) + `<div class="callout" style="top:88px;right:12px">Only when they tap it</div>`, '', 'Option C: no pop-ups, Subscribe button only'),
};
const TL = {
  A: { Trial: ['End of tiny story', 'Next paywall', 'btn:Subscribe button'], 'Sign-up': ['After Welcome', 'Gem save', 'btn:Settings'], Location: ['First map', 'Next map open', 'btn:Settings'] },
  B: { Trial: ['End of tiny story', 'Next session', 'nag:Every day'], 'Sign-up': ['After Welcome', 'Next session', 'nag:Every day'], Location: ['First map', 'Next session', 'nag:Every day'] },
  C: { Trial: ['End of tiny story', '', 'btn:Subscribe button'], 'Sign-up': ['After Welcome', '', 'btn:Settings'], Location: ['First map', '', 'btn:Settings'] },
};
const timeline = (k) => {
  const cell = (v) => {
    if (!v) return '<td class="none">no ask</td>';
    const [kind, t] = v.includes(':') ? v.split(':') : ['ask', v];
    return `<td class="${kind}">${t}</td>`;
  };
  return `<table class="tl"><caption>When each ask comes back</caption><thead><tr><th></th><th>1st ask</th><th>After “Not now”</th><th>After that</th></tr></thead><tbody>${Object.entries(TL[k]).map(([r, c]) => `<tr><th scope="row">${r}</th>${c.map(cell).join('')}</tr>`).join('')}</tbody></table>`;
};

// ---------------------------------------------------------------- 4 · Start in the first real story
const seg = (lab, items, on, cls = '') => `<div class="seg minis ${cls}"><span class="seglab">${lab}</span><div class="segtrack" role="radiogroup" aria-label="${lab}">${items.map((t, i) => `<button type="button" role="radio" aria-checked="${i === on}" data-seg>${t}</button>`).join('')}</div></div>`;
const Q4 = {
  A: () => {
    const vb = [70, 330, 160, 190];
    const map = `${M.svgOpen('q4a', vb, 'Your route: a loop from your door')}${M.realGround()}${M.route(M.LOOP, '#00CD9D', 4, '1 7')}${M.doorMark(...M.DOOR)}${M.meDot(M.DOOR[0] + 14, M.DOOR[1] - 12)}</svg>`;
    return phone(`<div class="hero short" style="background-image:url(img/squeaky.jpg)"><button class="ib back" type="button" aria-label="Back">${ic.back}</button></div>
    <div class="spage">
      <p class="kick">Your first real story</p>
      <h3 class="hl">Have You Seen Squeaky?</h3>
      <div class="rcard">
        <div class="rmap">${map}</div>
        <div class="rtext"><b>From your door</b><span>1.1 km · about 15 min</span><span class="rwhy">${ic.check}Closest, simplest</span></div>
      </div>
      <div class="moderow">${modePill('walk', 'Switch any time')}</div>
      <button class="cta" type="button">Start chapter 1</button>
      <button class="ghost" type="button" data-open="cz">Customize</button>
    </div>
    <div class="scrim" data-close hidden></div>
    <section class="sheet cz" id="cz" hidden><div class="grab"></div>
      <h3 class="hl sm">Make it yours</h3>
      ${seg('Play', ['Route', 'Walking', 'Treadmill', 'At home'], 1)}
      ${seg('Time', ['10 min', '20 min', '30+ min'], 1)}
      ${seg('Start', ['My door', 'Pick on map'], 0)}
      <label class="check"><input type="checkbox" checked> Remember my choice</label>
      <button class="cta" type="button" data-close>Done</button>
    </section>`, 'live', 'Option A: smart default with Customize');
  },
  B: () => phone(`${storyPage()}<div class="scrim"></div>
    <section class="sheet"><div class="grab"></div>
      <h3 class="hl sm">How will you play today?</h3>
      <div class="opts4" role="radiogroup" aria-label="How will you play">
        ${[['route', 'Route', 'Follow the map'], ['walk', 'Walking', 'Any street'], ['tread', 'Treadmill', 'Or a walking pad'], ['home', 'At home', 'Read, no steps']].map(([i, t, s], n) => `<button type="button" role="radio" aria-checked="${n === 1}" data-seg class="o4">${ic[i]}<b>${t}</b><span>${s}</span></button>`).join('')}
      </div>
      <label class="check"><input type="checkbox"> Remember my choice</label>
      <button class="cta" type="button">Start chapter 1</button>
    </section>`, 'live', 'Option B: four-option pop-up'),
  C: () => phone(`<div class="pad tf">
      <button class="ib back flat" type="button" aria-label="Back">${ic.back}</button>
      <div class="dots" aria-label="Step 1 of 2"><i class="on"></i><i></i></div>
      <p class="kick">Have You Seen Squeaky?</p>
      <h3 class="hl">How long have you got?</h3>
      <div class="tchips" role="radiogroup" aria-label="Time">${['5 min', '10 min', '20 min', '30+ min'].map((t, i) => `<button type="button" role="radio" aria-checked="${i === 2}" data-seg>${t}</button>`).join('')}</div>
      <p class="fits">${ic.clock}Chapter 1 fits in 20 minutes</p>
      <h3 class="hl sm next">Then: where do you want to start?</h3>
      <div class="ghostlist" aria-hidden="true"><span>${ic.home}From my door</span><span>${ic.pin}A park nearby</span><span>${ic.tread}Indoors</span></div>
      <button class="cta" type="button">Next</button>
    </div>`, 'live', 'Option C: time first'),
};

// ---------------------------------------------------------------- 6 · browse map
const browseTop = (t = 'Explore') => `<div class="mtop"><div class="sbar">${ic.search}<span>${t}</span></div></div>`;
const Q6 = {
  A: () => {
    const park = [[58, 300], [22, 262], [40, 205], [110, 190], [150, 232], [140, 300], [58, 300]];
    const svg = `${M.svgOpen('q6a', [0, 120, 300, 600], 'Browse map with fixed-route start points')}${M.realGround()}`
      + `${M.route(park, '#2F8BFF', 4)}`
      + `<circle cx="58" cy="300" r="30" fill="none" stroke="#C49BFF" stroke-width="2" stroke-dasharray="3 4"/>`
      + M.coverPin(58, 300, 'dragons', .9, '#00CD9D') + M.coverPin(238, 236, 'coronet', .78) + M.coverPin(250, 430, 'kindness', .78)
      + M.label(130, 335, 'Dragons in the Park · 1.7 km loop', { col: '#2F8BFF' })
      + M.meDot(170, 470) + '</svg>';
    return phone(`<div class="mapfill">${svg}</div>${browseTop()}
      <div class="lp">${ic.hand}Long-press shows the route</div>
      <section class="sheet peek"><div class="grab"></div>
        <h3 class="hl sm">Plays near you</h3>
        <p class="lede sm">Placed on your streets when you tap Start.</p>
        ${row('squeaky')}${row('summons')}${row('incident')}
      </section>`, '', 'Option A: fixed routes on the map, auto-placed stories in a list');
  },
  B: () => {
    const pins = [
      ['squeaky', 62, 214, [[62, 214], [108, 214], [108, 268], [62, 268]]],
      ['summons', 188, 200, [[188, 200], [188, 150], [232, 150]]],
      ['incident', 236, 300, [[236, 300], [270, 300], [270, 360], [236, 360], [236, 300]]],
      ['adelaide', 120, 374, [[120, 374], [188, 374], [188, 430]]],
      ['dragons', 40, 340, [[40, 340], [20, 300], [70, 290]]],
      ['coronet', 150, 470, [[150, 470], [108, 470], [108, 520]]],
      ['kindness', 250, 440, [[250, 440], [280, 470], [240, 500]]],
      ['squeaky', 210, 250, [[210, 250], [240, 230], [260, 260]]],
    ];
    let svg = `${M.svgOpen('q6b', [0, 120, 300, 600], 'Browse map with every story pinned')}${M.realGround()}`;
    pins.forEach(([id, x, y, r]) => { svg += M.route(r, STORIES[id].acc, 3, '2 5'); });
    pins.forEach(([id, x, y]) => { svg += M.dotPin(x, y, STORIES[id].acc); });
    svg += M.meDot(170, 420) + '</svg>';
    return phone(`<div class="mapfill">${svg}</div>${browseTop()}
      <div class="pcard">${cover('squeaky', 'sm')}<div><b>Have You Seen Squeaky?</b><span>A route made up for you · 1.0 km</span></div></div>`, '', 'Option B: every story pinned with a route');
  },
  C: () => phone(`<div class="pad listscr">
      <div class="libtop"><h3>Explore</h3><button class="ib" type="button" aria-label="Search">${ic.search}</button></div>
      ${seg('View', ['Near you', 'Anywhere', 'Passport'], 0, 'inl')}
      ${row('dragons')}${row('coronet')}${row('kindness')}${row('squeaky')}${row('summons')}
      <p class="fine">Tap a story to see its route.</p>
    </div>`, '', 'Option C: a list only'),
};

// ---------------------------------------------------------------- 7 · treadmill map
const tread = (map, s, line, note) => phone(`<div class="mapfill">${map}</div>
    <div class="thud"><span class="tpill">${ic.tread}Treadmill</span>${modePill('walk')}<span class="steps"><b>1,240</b> steps</span></div>
    ${note ? `<div class="mapnote">${note}</div>` : ''}
    <section class="tcard">${cover(s, 'sm')}<div><b>${STORIES[s].t}</b><span>${line}</span><div class="bar"><i style="width:62%"></i></div></div></section>`, '', 'Treadmill mode map');
const Q7 = {
  A: () => tread(`${M.svgOpen('q7a', [41, 150, 214, 445], 'Your neighbourhood')}${M.realGround()}${M.trail('q7a', M.LOOP, .62)}${M.doorMark(...M.DOOR)}${M.meDot(...M.along(M.LOOP, .62))}</svg>`,
    'adelaide', 'Chapter 2 · 180 steps to go', 'Your street, Edmonton'),
  B: () => tread(`${M.svgOpen('q7b', [20, 70, 260, 541], 'Adelaide in satellite view')}${M.adelaideSat()}${M.trail('q7b', M.ADL_PATH, .25)}`
    + `${M.dotPin(...M.TOWN_HALL, "#F5B82E")}${M.label(M.TOWN_HALL[0] + 64, M.TOWN_HALL[1] + 1, 'Adelaide Town Hall', { col: '#F5B82E' })}`
    + `${M.meDot(...M.along(M.ADL_PATH, .25))}</svg>`,
    'adelaide', 'Chapter 2 · 180 steps to go', 'Adelaide, South Australia'),
  C: () => tread(`<svg class="map" viewBox="10 40 280 583" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Storybook map">${M.defs('q7c')}<defs>${M.fantasyDefs}</defs>${M.fantasy()}${M.trail('q7c', M.FANTASY_PATH, .45)}${M.meDot(...M.along(M.FANTASY_PATH, .45))}</svg>`,
    'incident', 'Chapter 1 · 220 steps to go', 'The story’s own map'),
};

// ---------------------------------------------------------------- 8 · the sample story's name
const welcome = (o) => phone(`<div class="pad wel">
    <div class="stars" aria-hidden="true"></div>
    <p class="brand">STORY CITY</p>
    <h3 class="hl big">Don’t just walk. Step into the story.</h3>
    <p class="lede">${o.k === 'A' ? 'Pick your first story' : o.k === 'B' ? 'Pick a tiny story' : 'Pick a sample'}. About five minutes.</p>
    <div class="pickrow" role="radiogroup" aria-label="Pick a story">
      <button type="button" role="radio" aria-checked="true" data-seg class="who"><span class="face" style="background-image:url(img/summons.png)"></span><b>The Summons</b></button>
      <button type="button" role="radio" aria-checked="false" data-seg class="who"><span class="face" style="background-image:url(img/knight.png)"></span><b>The Knight’s Quest</b></button>
    </div>
    <button class="cta" type="button">${o.btn}</button><button class="textbtn" type="button">${o.skip}</button>
  </div>`, '', `Option ${o.k}: Welcome screen button “${o.btn}”`);
const alsoSays = (o) => `<div class="also"><p class="alsol">The same word elsewhere</p><p><span>Ending</span>“${o.done}”</p></div>`;

// ---------------------------------------------------------------- what each question shows
export const MOMENT = {
  1: { A: 'Right after Welcome', B: 'Right after the trial starts', C: 'Before the first real story' },
  2: { A: 'The second ask: next chapter-2 paywall', B: 'Day 3, as the app opens', C: 'Any day: no pop-ups' },
  4: { A: 'Tap Customize to see the choices', B: 'Pops up when you tap Start', C: 'Step 1 of 2' },
  6: { A: 'The Explore map', B: 'The Explore map', C: 'Explore, as a list' },
  7: { A: 'Treadmill, chapter 2', B: 'Treadmill, chapter 2', C: 'Treadmill, chapter 1' },
  8: { A: 'Welcome', B: 'Welcome', C: 'Welcome' },
};
export function screen(n, k, opt) {
  if (n === 1) return Q1[k]();
  if (n === 2) return Q2[k]();
  if (n === 4) return Q4[k]();
  if (n === 6) return Q6[k]();
  if (n === 7) return Q7[k]();
  if (n === 8) return welcome({ ...opt, k });
  return '';
}
export function extra(n, k, opt) {
  if (n === 1) return flowStrip(k);
  if (n === 2) return timeline(k);
  if (n === 8) return alsoSays(opt);
  return '';
}
