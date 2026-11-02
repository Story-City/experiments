// Play Together (The Summons) played as a group, two ways (?v=one-phone | ?v=many-phones).
// one-phone: pass the phone; each beat goes to the role it needs; choices are a tap-to-vote.
// many-phones: join code + simulated friends; each phone sees different clues; arrival strip.
// Extra test params: ?coin=a|b forces the tie-break coin (a = corner, b = stay inside).

const { VARIANTS, ROLES, COPY } = await import(`./copy.js${window.CACHE_V || ''}`);
const C = COPY, B = COPY.beats;

const $ = s => document.querySelector(s);
const screen = $('#screen'), demo = $('#demo'), sheet = $('#sheet'), scrim = $('#scrim'), toastEl = $('#toast');
const params = new URLSearchParams(location.search);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SPARK = 'M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z';
const CODE = '786666';
const BASE_ROLES = ['navigator', 'decoder', 'lookout', 'voice'];
// Everyone's phone: who has which piece of the seal's number (by player index).
const PIECES = [[0, 1], [2, 3], [4, 5]];

let S;
let timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

function fresh(v) {
  const many = v === 'many-phones';
  S = {
    v, step: 'intro', where: 'out',
    names: [C.friends.hostDefault, ...C.friends.defaults.slice(0, 3)],
    players: [], holder: 0, handed: false,
    votes: {}, tie: false, coin: null, winner: null, flipping: false,
    walk: 0, walking: false, arrived: [], found: false, photo: false, snapping: false,
    code: '', codeState: '', hint: false, said: [],
    viewer: 0, joined: 0, team: C.finale.teamDefault, rejected: false,
  };
  if (many) {
    S.players = [
      { name: C.friends.you, roles: ['navigator'] },
      { name: 'Sam', roles: ['lookout'] },
      { name: 'Priya', roles: ['decoder'] },
      { name: 'Leo', roles: ['voice'] },
    ];
  }
}

const many = () => S.v === 'many-phones';
const colorOf = p => ROLES[p.roles[0]].color;
const initial = n => (n.trim()[0] || '?').toUpperCase();
const av = (p, cls = '', badge = '') => `<span class="av ${cls}" style="--c:${colorOf(p)}" aria-hidden="true">${esc(initial(p.name))}${badge ? `<span class="badge">${badge}</span>` : ''}</span>`;
const ownerIdx = role => {
  const i = S.players.findIndex(p => p.roles.includes(role));
  return i >= 0 ? i : S.players.findIndex(p => p.roles.includes('navigator'));
};
const owner = role => S.players[ownerIdx(role)];
const has = (i, role) => S.players[i].roles.includes(role);
const homeMode = () => S.where === 'home';

// Story beats, in order. `role` = who the beat belongs to.
const BEATS = { text1: 'voice', window: 'lookout', vote: null, reject: 'voice', walk1: 'navigator', letter: 'lookout', walk2: 'keeper', code: 'decoder', end: 'voice' };
function order() {
  const setup = many() ? ['intro', 'lobby', 'mroles'] : ['intro', 'friends', 'roles'];
  const story = ['text1', 'window', 'vote'];
  if (S.rejected) story.push('reject');
  return [...setup, ...story, 'walk1', 'letter', 'walk2', 'code', 'end', 'finale'];
}
function go(step) {
  clearTimers();
  S.step = step; S.handed = false;
  S.walk = 0; S.walking = false; S.arrived = [];
  render();
  screen.scrollTop = 0;
  enter();
}
function next() { const o = order(); go(o[o.indexOf(S.step) + 1]); }

function assignRoles() {
  const names = S.names.map(n => n.trim() || '?');
  S.players = names.map(name => ({ name, roles: [] }));
  const roles = names.length >= 5 ? [...BASE_ROLES, 'keeper'] : BASE_ROLES;
  roles.forEach((r, k) => S.players[k % names.length].roles.push(r));
}

/* ---------- Demo bar ---------- */
function renderDemo() {
  const showPeek = many() && !['intro', 'lobby'].includes(S.step);
  demo.innerHTML = `
    <span class="tag">${C.mockup}</span>
    <select id="variant" aria-label="${C.way}">
      ${Object.entries(VARIANTS).map(([k, x]) => `<option value="${k}" ${k === S.v ? 'selected' : ''}>${x.label}</option>`).join('')}
    </select>
    ${showPeek ? `<select id="peek" aria-label="${C.viewing}">
      ${S.players.map((p, i) => `<option value="${i}" ${i === S.viewer ? 'selected' : ''}>${i === 0 ? C.yourPhone : C.phoneOf(esc(p.name))}</option>`).join('')}
    </select>` : ''}
    <button class="reset" data-act="reset">${C.reset}</button>`;
}

/* ---------- Pieces ---------- */
const eyebrow = t => `<p class="eyebrow">${t}</p>`;
const safetyCard = (mini = false) => `<div class="card safety ${mini ? 'mini' : ''}"><span class="ico" aria-hidden="true">🤝</span><p>${mini ? `<b style="display:inline">${C.safety.title}.</b> ${C.safety.body.split('. ')[0]}.` : `<b>${C.safety.title}</b>${C.safety.body}`}</p></div>`;
const textIn = msg => `<div class="text-in"><small>${B.text1.from}</small><b>${esc(msg)}</b></div>`;
const task = (txt, role, ico) => `<div class="task" style="--c:${role ? ROLES[role].color : 'var(--glow)'}"><span class="ico" aria-hidden="true">${ico || (role ? ROLES[role].emoji : '✨')}</span><span>${txt}</span></div>`;
function rolebar(i, role) {
  const p = S.players[i];
  const r = ROLES[role] || ROLES[p.roles[0]];
  return `<div class="rolebar" style="--c:${r.color}">${av(p, 'sm')}<span>${esc(p.name)} · ${r.name}</span></div>`;
}
const actions = (...btns) => `<div class="actions">${btns.join('')}</div>`;
const btn = (label, act, cls = '', dis = false) => `<button class="btn ${cls}" data-act="${act}" ${dis ? 'disabled' : ''}>${label}</button>`;
const sparkSvg = (x, y, s, d) => `<svg viewBox="0 0 24 24" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;animation-delay:${d}s"><path d="${SPARK}"/></svg>`;

function coverSvg() {
  const fig = (x, c) => `<g transform="translate(${x} 0)"><circle cx="0" cy="118" r="11" fill="${c}"/><path d="M-16 168c0-20 7-36 16-36s16 16 16 36z" fill="${c}"/></g>`;
  return `<svg viewBox="0 0 358 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect x="0" y="150" width="358" height="30" fill="var(--ink)"/>
    <rect x="236" y="40" width="74" height="110" rx="4" fill="var(--midnight)" stroke="var(--line)"/>
    <rect x="248" y="54" width="22" height="30" fill="var(--citrine)" opacity=".8"/><rect x="276" y="54" width="22" height="30" fill="var(--citrine)" opacity=".35"/>
    <line x1="60" y1="150" x2="60" y2="60" stroke="var(--line)" stroke-width="4"/><circle cx="60" cy="58" r="8" fill="var(--pearl)"/>
    <circle cx="60" cy="58" r="30" fill="var(--pearl)" opacity=".08"/>
    <path transform="translate(300 12) scale(.7)" d="${SPARK}" fill="var(--citrine)"/>
    <path transform="translate(150 26) scale(.4)" d="${SPARK}" fill="var(--glow)"/>
    ${fig(110, 'var(--celestite)')}${fig(142, 'var(--citrine)')}${fig(174, 'var(--amazonite)')}${fig(206, 'var(--kunzite)')}
  </svg>`;
}
function windowSvg() {
  return `<svg viewBox="0 0 358 230" aria-hidden="true">
    <rect width="358" height="230" fill="var(--midnight)"/>
    <rect x="0" y="170" width="358" height="60" fill="var(--ink)"/>
    <line x1="260" y1="170" x2="260" y2="60" stroke="var(--line)" stroke-width="4"/><circle cx="260" cy="58" r="7" fill="var(--pearl)"/>
    <ellipse cx="250" cy="172" rx="60" ry="8" fill="var(--pearl)" opacity=".08"/>
    <g transform="translate(222 92)">
      <path d="M-24 80c0-46 8-66 24-66s24 20 24 66z" fill="var(--ink)" stroke="var(--line)"/>
      <path d="M-14 22c0-18 6-28 14-28s14 10 14 28c-4-6-9-9-14-9s-10 3-14 9z" fill="var(--ink)" stroke="var(--line)"/>
      <circle cx="-5" cy="12" r="1.6" fill="var(--pearl)"/><circle cx="5" cy="12" r="1.6" fill="var(--pearl)"/>
      <rect x="16" y="44" width="6" height="10" rx="1.5" fill="var(--sapphire)"/>
      <g class="seal-hit" data-act="seal" role="button" aria-label="The symbol on the hoodie">
        <circle cx="0" cy="44" r="18" fill="transparent"/>
        <circle cx="0" cy="44" r="7" fill="var(--ruby)"/>
        <path transform="translate(-4 40) scale(.33)" d="${SPARK}" fill="var(--pearl)"/>
        <circle class="ring" cx="0" cy="44" r="12"/>
      </g>
    </g>
    <rect x="6" y="6" width="346" height="218" rx="6" fill="none" stroke="var(--line)" stroke-width="12"/>
    <line x1="179" y1="6" x2="179" y2="224" stroke="var(--line)" stroke-width="8"/>
    <line x1="6" y1="100" x2="352" y2="100" stroke="var(--line)" stroke-width="6"/>
  </svg>`;
}
function mapSvg(which) {
  const d = which === 'walk1' ? 'M60 160 L60 100 L180 100 L180 50 L300 50' : 'M300 50 L300 120 L200 120 L200 160 L110 160';
  return `<svg viewBox="0 0 358 200" aria-label="Map">
    <g class="roads"><line class="road" x1="60" y1="0" x2="60" y2="200"/><line class="road" x1="180" y1="0" x2="180" y2="130"/><line class="road" x1="300" y1="0" x2="300" y2="200"/>
    <line class="road" x1="0" y1="50" x2="358" y2="50"/><line class="road" x1="0" y1="100" x2="358" y2="100"/><line class="road" x1="0" y1="120" x2="358" y2="120"/><line class="road" x1="0" y1="160" x2="358" y2="160"/><line class="road" x1="200" y1="120" x2="200" y2="200"/></g>
    <path id="route" class="route" d="${d}"/>
    <path id="done" class="done" d="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${S.walk >= 1 ? 0 : 1}"/>
    <g id="goal">${(() => { const end = d.match(/-?\d+/g).slice(-2); return `<circle class="goal" cx="${end[0]}" cy="${end[1]}" r="12"/><text x="${end[0]}" y="${+end[1] + 5}" text-anchor="middle" font-size="13">${which === 'walk1' ? '🏙️' : '📮'}</text>`; })()}</g>
    <circle id="me" class="me" cx="${d.match(/\d+/g).at(S.walk >= 1 ? -2 : 0)}" cy="${d.match(/\d+/g).at(S.walk >= 1 ? -1 : 1)}" r="7"/>
  </svg>`;
}
function letterArt({ digits = '', cam = false } = {}) {
  return `<div class="letter">
    <div class="envelope"><div class="seal"><svg viewBox="0 0 24 24"><path d="${SPARK}" fill="var(--pearl)"/></svg>${digits ? `<span class="digits">${digits}</span>` : ''}</div></div>
    ${cam ? '<div class="viewfinder"><i></i><i></i><i></i><i></i></div>' : ''}
    ${S.snapping ? '<div class="flash"></div>' : ''}
  </div>`;
}
const photo = digits => `<div class="photo">${letterArt({ digits })}</div>`;
function qrSvg() {
  let seed = 7, cells = '';
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="var(--midnight)"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="var(--starlight)"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="var(--midnight)"/>`;
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue;
    if (rnd() > .5) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="var(--midnight)"/>`;
  }
  return `<svg viewBox="0 0 21 21" shape-rendering="crispEdges" aria-label="${C.lobby.qr}">${cells}${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`;
}
function trapSvg() {
  return `<svg viewBox="0 0 358 180" aria-hidden="true">
    <rect width="358" height="180" fill="var(--midnight)"/>
    <rect x="0" y="120" width="358" height="60" fill="var(--ink)"/>
    <rect x="40" y="40" width="34" height="80" rx="6" fill="var(--velvet)" stroke="var(--line)"/><rect x="47" y="52" width="20" height="4" fill="var(--ink)"/>
    <rect x="49" y="64" width="16" height="22" rx="2" fill="var(--citrine)" opacity=".8"/>
    <path d="M140 132 L250 132 L270 168 L120 168 Z" fill="var(--ink)" stroke="var(--citrine)" stroke-width="1.5"/>
    <path d="M150 140 L240 140 M144 150 L246 150 M138 160 L252 160" stroke="var(--citrine)" stroke-width="1.5" opacity=".7"/>
    <ellipse cx="195" cy="130" rx="80" ry="22" fill="var(--citrine)" opacity=".12"/>
    <path d="M250 132 L300 110 L310 128 L270 140 Z" fill="var(--velvet)" stroke="var(--line)"/>
  </svg>`;
}

/* ---------- Screens ---------- */
function vIntro() {
  return `
    <div class="cover">${coverSvg()}</div>
    <div>${eyebrow(C.intro.eyebrow)}<h1>${C.intro.title}</h1></div>
    <p class="lede">${C.intro.body}</p>
    <div class="meta">${C.intro.meta.map(m => `<span class="pill">${m}</span>`).join('')}</div>
    <div class="card how"><span class="big" aria-hidden="true">${many() ? '📱📱📱' : '📱'}</span><div><h3>${VARIANTS[S.v].label}</h3><p class="hint" style="margin-top:4px">${C.intro.how[S.v]}</p></div></div>
    <p class="quote">${C.intro.reviews}</p>
    ${actions(btn(C.intro.start, 'next'))}`;
}

function whereToggle() {
  return `<div><h3 style="margin-bottom:10px">${C.friends.whereTitle}</h3>
    <div class="seg" role="group" aria-label="${C.friends.whereTitle}">
      <button data-act="where" data-where="out" aria-pressed="${!homeMode()}"><span aria-hidden="true">🏙️</span>${C.friends.out}</button>
      <button data-act="where" data-where="home" aria-pressed="${homeMode()}"><span aria-hidden="true">🏠</span>${C.friends.home}</button>
    </div>
    <p class="hint" style="margin-top:8px">${homeMode() ? C.friends.homeHint : C.friends.outHint}</p></div>`;
}

function vFriends() {
  const colors = ['var(--celestite)', 'var(--citrine)', 'var(--amazonite)', 'var(--kunzite)', 'var(--sunstone)'];
  return `
    <div>${eyebrow(C.friends.eyebrow)}<h1>${C.friends.title}</h1></div>
    <p class="lede">${C.friends.body}</p>
    <div class="players">
      ${S.names.map((n, i) => `<div class="player">
        <span class="av" style="--c:${colors[i]}" data-av="${i}" aria-hidden="true">${esc(initial(n))}</span>
        <input value="${esc(n)}" data-name="${i}" aria-label="${C.friends.placeholder} ${i + 1}" placeholder="${C.friends.placeholder}" maxlength="14" autocomplete="off">
        ${i === 0 ? `<span class="you">${C.friends.you}</span>` : (S.names.length > 3 ? `<button class="x" data-act="remove" data-i="${i}" aria-label="${C.friends.remove(esc(n))}">×</button>` : '')}
      </div>`).join('')}
      ${S.names.length < 5 ? `<button class="add" data-act="add">＋ ${C.friends.add}</button>` : ''}
    </div>
    ${whereToggle()}
    ${safetyCard()}
    ${actions(btn(C.friends.next, 'deal'))}`;
}

function vRoles() {
  return `
    <div>${eyebrow(C.roles.eyebrow)}<h1>${C.roles.title}</h1></div>
    <p class="lede">${C.roles.body}</p>
    <div class="rolecards">
      ${S.players.map((p, i) => `<div class="rolecard" style="--c:${colorOf(p)};animation-delay:${i * .12}s">
        ${av(p, '', ROLES[p.roles[0]].emoji)}
        <div><div class="rrole">${p.roles.map(r => ROLES[r].name).join(` + `)}</div><div class="rname">${esc(p.name)}</div>
        <p>${p.roles.map(r => ROLES[r].does).join(' ')}</p></div>
      </div>`).join('')}
    </div>
    ${actions(btn(C.roles.start, 'next'))}`;
}

function vLobby() {
  const friends = S.players.slice(1, 1 + S.joined);
  return `
    <div>${eyebrow(C.lobby.eyebrow)}<h1>${C.lobby.title}</h1></div>
    <p class="lede">${C.lobby.body}</p>
    <div class="joincode" aria-label="Join code ${C.lobby.code}">${[...C.lobby.code].map(c => `<span>${c}</span>`).join('')}</div>
    <div class="qr">${qrSvg()}</div>
    <p class="qr-note">${C.lobby.qr}</p>
    <div class="joined" id="joined">
      <div class="jrow">${av(S.players[0])}<b>${C.friends.you}</b><small>${ROLES.navigator.emoji} ${C.lobby.host}</small></div>
      ${friends.map(p => `<div class="jrow">${av(p, 'pop')}<b>${esc(p.name)}</b><small>${C.lobby.joined()}</small></div>`).join('')}
      ${S.joined < 3 ? `<p class="hint"><span class="dots">${C.lobby.waiting.replace('…', '')}</span></p>` : ''}
    </div>
    ${whereToggle()}
    ${safetyCard()}
    ${actions(btn(C.lobby.invite, 'invite', 'sec'), btn(S.joined >= 2 ? C.lobby.start : C.lobby.need, 'next', '', S.joined < 2))}`;
}

function vMRoles() {
  const me = S.players[S.viewer];
  const r = ROLES[me.roles[0]];
  return `
    <div>${eyebrow(C.lobby.rolesEyebrow)}<h1>${S.viewer === 0 ? C.lobby.rolesTitle : C.lobby.rolesOther(esc(me.name), r.name)}</h1></div>
    <p class="lede">${C.lobby.rolesBody}</p>
    <div class="rolecards">
      ${S.players.map((p, i) => `<div class="rolecard" style="--c:${colorOf(p)};animation-delay:${i * .12}s;${i === S.viewer ? 'box-shadow:0 0 0 1px var(--glow)' : ''}">
        ${av(p, '', ROLES[p.roles[0]].emoji)}
        <div><div class="rrole">${ROLES[p.roles[0]].name}</div><div class="rname">${esc(p.name)}</div><p>${ROLES[p.roles[0]].does}</p></div>
      </div>`).join('')}
    </div>
    ${actions(btn(C.lobby.go, 'next'))}`;
}

function vHandoff(role) {
  if (!role) {
    return `<div class="handoff" style="--c:var(--glow)">
      ${eyebrow(C.handoff.groupEyebrow)}
      <div class="trio">${S.players.map(p => av(p)).join('')}</div>
      <h1>${C.handoff.groupTitle}</h1>
      <p class="lede">${C.handoff.groupBody}</p>
      ${btn(C.handoff.groupGot, 'handed')}
    </div>`;
  }
  const i = ownerIdx(role), p = S.players[i], r = ROLES[role] || ROLES.navigator;
  const rName = (ROLES[role] && has(i, role)) ? r.name : ROLES[p.roles[0]].name;
  return `<div class="handoff" style="--c:${colorOf(p)}">
    ${eyebrow(C.handoff.eyebrow)}
    <span class="arrow" aria-hidden="true">📱➜</span>
    ${av(p, 'lg', ROLES[has(i, role) ? role : p.roles[0]].emoji)}
    <h1>${C.handoff.to(esc(p.name), rName)}</h1>
    <p class="lede">${(has(i, role) ? r : ROLES[p.roles[0]]).tip}</p>
    ${btn(C.handoff.got(esc(p.name)), 'handed')}
  </div>`;
}

// On the many-phones version, who is looking right now (for role-specific clues).
const isMe = role => many() ? has(S.viewer, role) : true;
const meBar = role => many() ? rolebar(S.viewer) : rolebar(ownerIdx(role), role);

function vText1() {
  const v = owner('voice');
  return `
    ${meBar('voice')}
    <div>${eyebrow(B.text1.eyebrow)}<p class="scene">${B.text1.scene}</p></div>
    ${textIn(B.text1.msg)}
    ${isMe('voice') ? task(B.text1.task, 'voice') : task(B.text1.listening(esc(v.name)), 'voice', '👂')}
    <p class="scene">${B.text1.after}</p>
    ${actions(btn(B.text1.cta, 'next'))}`;
}

function vWindow() {
  const lk = owner('lookout');
  const mine = isMe('lookout');
  return `
    ${meBar('lookout')}
    <div>${eyebrow(B.window.eyebrow)}<p class="scene">${B.window.scene}</p></div>
    <div class="window ${S.found ? 'found' : ''} ${!mine && !S.found ? 'blur' : ''}" id="win">${windowSvg()}${mine && !S.found ? `<div class="tapme">${B.window.tapme}</div>` : ''}</div>
    ${mine ? (S.found ? task(B.window.found, 'lookout') : task(B.window.task, 'lookout'))
           : (S.found ? task(B.window.shout(esc(lk.name)), 'lookout') : `<div class="waiting">${av(lk, 'sm')}<span class="dots">${B.window.blurred}</span></div>`)}
    ${S.found ? textIn(B.window.msg) : ''}
    ${actions(btn(B.window.cta, 'next', '', !S.found))}`;
}

function voteLabel(o) { return homeMode() && o.key === 'corner' ? o.homeLabel : o.label; }

function vVote() {
  const A = B.vote.a, Bo = B.vote.b;
  const n = S.players.length;
  const counts = { corner: 0, inside: 0 };
  Object.values(S.votes).forEach(k => counts[k]++);
  const all = Object.keys(S.votes).length === n;
  let body;
  if (S.winner || S.tie) {
    body = `
      <div class="tally">
        ${[A, Bo].map(o => `<div class="${S.winner === o.key ? 'win' : ''}"><div class="t">${o.emoji} ${voteLabel(o)} · ${counts[o.key]}</div>
          <div class="avs">${S.players.filter((p, i) => S.votes[i] === o.key).map(p => av(p, 'sm')).join('')}</div></div>`).join('')}
      </div>
      ${S.tie ? `<div class="result"><h2>${B.vote.tie}</h2><p class="hint">${B.vote.tieBody}</p></div>
        <div class="coin-wrap"><div class="coin" id="coin">
          <div class="face"><span>${A.emoji}</span>${voteLabel(A)}</div>
          <div class="face back"><span>${Bo.emoji}</span>${voteLabel(Bo)}</div>
        </div></div>` : ''}
      ${S.winner ? `<div class="result" id="winner">${S.tie ? `<p class="eyebrow">${B.vote.coinSays}</p>` : ''}<h2>${B.vote.won(voteLabel(S.winner === 'corner' ? A : Bo))}</h2></div>` : ''}
      ${actions(S.tie && !S.winner ? btn(B.vote.flip, 'flip', '', S.flipping) : btn(B.vote.next, 'voted', '', !S.winner))}`;
  } else if (many()) {
    const mine = S.votes[S.viewer];
    body = `
      <p class="lede">${B.vote.bodyMany}</p>
      <div class="vbig">${[A, Bo].map(o => `<button data-act="mvote" data-k="${o.key}" aria-pressed="${mine === o.key}" ${mine ? 'disabled' : ''}><span aria-hidden="true">${o.emoji}</span>${voteLabel(o)}</button>`).join('')}</div>
      ${mine ? `<div class="waiting"><div style="display:flex;gap:6px">${S.players.map((p, i) => S.votes[i] ? av(p, 'sm pop') : '').join('')}</div><span class="dots">${B.vote.youVoted}</span></div>` : ''}
      ${actions(btn(all ? B.vote.count : B.vote.waitAll, 'count', '', !all))}`;
  } else {
    body = `
      <p class="lede">${B.vote.body}</p>
      <div class="votes">${S.players.map((p, i) => `<div class="vrow">
        ${av(p, 'sm')}<span class="nm">${esc(p.name)}</span>
        <div class="opts">${[A, Bo].map(o => `<button class="vopt" data-act="vote" data-i="${i}" data-k="${o.key}" aria-pressed="${S.votes[i] === o.key}">${o.emoji} ${voteLabel(o)}</button>`).join('')}</div>
      </div>`).join('')}</div>
      ${actions(btn(all ? B.vote.count : B.vote.waitAll, 'count', '', !all))}`;
  }
  return `<div>${eyebrow(B.vote.eyebrow)}<h1>${homeMode() ? B.vote.homeTitle : B.vote.title}</h1></div>${body}`;
}

function vReject() {
  return `
    ${meBar('voice')}
    <div>${eyebrow(B.reject.eyebrow)}<p class="scene">${B.reject.scene}</p></div>
    ${textIn(B.reject.msg)}
    <p class="scene">${B.reject.after}</p>
    ${actions(btn(B.reject.cta, 'next'))}`;
}

function arrivalStrip(which) {
  const lbl = which === 'walk1' ? (homeMode() ? C.arrive.door : C.arrive.corner) : (homeMode() ? C.arrive.kitchen : C.arrive.mailbox);
  return `<div class="arrivals" id="arrivals"><span class="lbl">${lbl}</span><div class="who">${S.players.map((p, i) => av(p, S.arrived.includes(i) ? 'in' : '')).join('')}</div></div>`;
}

function vWalk(which) {
  const W = B[which], home = homeMode();
  const navRole = which === 'walk2' && S.players.some(p => p.roles.includes('keeper')) ? 'keeper' : 'navigator';
  const nav = owner('navigator');
  const done = S.walk >= 1;
  const allIn = !many() || S.arrived.length === S.players.length;
  const ready = done && allIn;
  const lead = many() && !has(S.viewer, 'navigator') ? task(B.walk1.follow(esc(nav.name)), 'navigator', '🧭') : '';
  return `
    ${meBar(navRole)}
    <div>${eyebrow(W.eyebrow)}<h1>${home ? W.homeTitle : W.outTitle}</h1></div>
    <p class="lede">${home ? W.homeBody : W.outBody}</p>
    ${home ? `<div class="home-walk" aria-hidden="true">${which === 'walk1' ? '🚪' : '🧊'}<div class="feet">👣 👣 👣</div></div>` : `<div class="map">${mapSvg(which)}</div>`}
    <div class="bar" aria-hidden="true"><i id="walkbar" style="width:${S.walk * 100}%"></i></div>
    ${lead}
    ${which === 'walk2' && navRole === 'keeper' ? task(W.keeperNote(esc(owner('keeper').name)), 'keeper') : ''}
    ${many() ? arrivalStrip(which) : ''}
    ${safetyCard(true)}
    <button class="btn txt" data-act="toggleHome">${home ? B.walk1.switchOut : B.walk1.switchHome}</button>
    ${actions(ready ? btn(home ? W.homeCta : W.outCta, 'next')
                    : btn(S.walking ? B.walk1.walking : (done ? B.walk1.walking : B.walk1.walk), 'walk', '', S.walking || done))}`;
}

function myDigits(i) {
  const piece = PIECES[i];
  return [...CODE].map((d, k) => piece && piece.includes(k) ? d : '·').join('');
}

function vLetter() {
  const lk = owner('lookout');
  const mine = isMe('lookout');
  let art, line;
  if (S.photo) {
    art = photo(many() ? myDigits(S.viewer) : CODE);
    line = mine ? task(B.letter.saved, 'lookout') : task(B.letter.arrived(esc(lk.name)), 'lookout', '📸');
  } else if (mine) {
    art = letterArt({ cam: true });
    line = task(B.letter.task, 'lookout', '📸');
  } else {
    art = letterArt({});
    line = `<div class="waiting">${av(lk, 'sm')}<span class="dots">${B.letter.waiting(esc(lk.name))}</span></div>`;
  }
  return `
    ${meBar('lookout')}
    <div>${eyebrow(B.letter.eyebrow)}<p class="scene">${B.letter.scene}</p></div>
    <p class="letter-quote">“${B.letter.quote}”</p>
    ${art}
    ${homeMode() ? `<p class="hint">${B.letter.homeNote}</p>` : ''}
    ${line}
    ${actions(!S.photo && mine ? btn(B.letter.snap, 'snap') : btn(B.letter.cta, 'next', '', !S.photo))}`;
}

function vCode() {
  const dec = owner('decoder'), lk = owner('lookout');
  const shown = S.codeState === 'good' ? CODE : S.code.padEnd(6, ' ');
  let top;
  if (many()) {
    const mine = PIECES[S.viewer];
    top = `
      ${task(B.code.taskMany, 'decoder', '🗝️')}
      ${mine ? `<p class="hint">${B.code.piece}: <b style="color:var(--starlight);letter-spacing:.2em">${myDigits(S.viewer)}</b></p>` : ''}
      <div class="say" id="say">${S.said.map(i => `<span class="b">${av(S.players[i], 'sm')}${myDigits(i).replace(/·/g, '').split('').join(' ')}</span>`).join('')}</div>`;
  } else {
    top = `
      ${task(B.code.task, 'decoder')}
      <button class="btn sec" data-act="photo">📸 ${B.code.seePhoto}</button>`;
  }
  return `
    ${meBar('decoder')}
    <div>${eyebrow(B.code.eyebrow)}<p class="scene">${B.code.scene}</p></div>
    ${textIn(B.code.msg)}
    ${top}
    <div class="codebox ${S.codeState}" id="codebox" aria-live="polite">${[...shown].map(d => `<span>${d.trim()}</span>`).join('')}</div>
    ${S.codeState === 'bad' ? `<p class="hint" style="text-align:center;color:var(--ruby)">${B.code.wrong}</p>` : ''}
    ${S.hint ? `<p class="hint" style="text-align:center">${B.code.hintText}</p>` : ''}
    ${S.codeState === 'good' ? actions(btn(B.code.open, 'next'))
      : `<div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<button data-act="key" data-k="${k}">${k}</button>`).join('')}
        <button class="k-wide" data-act="clear">${B.code.clear}</button><button data-act="key" data-k="0">0</button><button class="k-go" data-act="enter">${B.code.enter}</button></div>
        <button class="btn txt" data-act="hint">${B.code.hint}</button>`}`;
}

function vEnd() {
  const v = owner('voice');
  return `
    ${meBar('voice')}
    <div>${eyebrow(B.end.eyebrow)}</div>
    <div class="trapdoor">${trapSvg()}</div>
    <p class="scene">${B.end.scene}</p>
    <p class="scene" style="color:var(--starlight)">${B.end.after}</p>
    ${isMe('voice') ? task(B.end.task, 'voice') : task(B.end.listening(esc(v.name)), 'voice', '👂')}
    ${actions(btn(B.end.cta, 'next'))}`;
}

function vFinale() {
  const F = C.finale;
  const [, rest] = F.solved(S.team, 34);
  const moment = p => {
    const r = p.roles[0];
    return r === 'navigator' && homeMode() ? F.moments.navigatorHome : F.moments[r];
  };
  return `
    <div class="finale-hero">
      <div class="sparks">${sparkSvg(6, 10, 14, 0)}${sparkSvg(88, 4, 18, .6)}${sparkSvg(80, 70, 12, 1.1)}${sparkSvg(12, 78, 16, 1.6)}</div>
      ${eyebrow(F.eyebrow)}
      <h1><span class="team" contenteditable="true" spellcheck="false" id="team" role="textbox" aria-label="Team name">${esc(S.team)}</span>${rest}</h1>
      <p class="hint" style="margin-top:8px">${F.rename}</p>
    </div>
    <div class="postcard" id="postcard">
      <div>${eyebrow(F.postcardEyebrow)}<h3>${F.postcardTitle}</h3></div>
      <div class="moments">${S.players.map(p => `<div class="moment" style="--c:${colorOf(p)}">${av(p, '', ROLES[p.roles[0]].emoji)}
        <div><div class="who">${esc(p.name)}<em>${p.roles.map(r => ROLES[r].name).join(' + ')}</em></div><p>${moment(p)}</p></div></div>`).join('')}</div>
      <div class="stamp"><span>${S.tie ? (S.winner === 'corner' ? F.coin : F.coinIn) : '🕯️ The Summons'}</span><span>${homeMode() ? '🏠 At home' : '🏙️ Edmonton'} · 34 min</span></div>
    </div>
    ${btn(F.share, 'share')}
    <div class="card offer">
      ${eyebrow(F.linkEyebrow)}<h3>${F.linkTitle}</h3><p class="hint">${F.linkBody}</p>
      <div class="linkbox">🔗 ${F.link}</div>
      ${btn(F.copyLink, 'copylink', 'sec')}
    </div>
    ${eyebrow(F.nextEyebrow)}
    ${['haunted', 'work'].map(k => `<div class="card offer"><div class="top"><span class="emo" aria-hidden="true">${F[k].emoji}</span><div><h3>${F[k].title}</h3><p class="hint" style="margin-top:4px">${F[k].body}</p></div></div>
      <span class="price">${F[k].price}</span>${btn(F[k].cta, 'offer-' + k, 'sec')}</div>`).join('')}
    ${actions(btn(F.again, 'again', 'txt'))}`;
}

const VIEWS = { intro: vIntro, friends: vFriends, roles: vRoles, lobby: vLobby, mroles: vMRoles, text1: vText1, window: vWindow, vote: vVote, reject: vReject,
  walk1: () => vWalk('walk1'), letter: vLetter, walk2: () => vWalk('walk2'), code: vCode, end: vEnd, finale: vFinale };

function needsHandoff() {
  if (many() || S.handed || !(S.step in BEATS)) return false;
  if (S.step === 'vote') return true;
  const role = BEATS[S.step];
  return ownerIdx(role) !== S.holder;
}

function render() {
  renderDemo();
  if (needsHandoff()) screen.innerHTML = vHandoff(BEATS[S.step]);
  else screen.innerHTML = VIEWS[S.step]();
  document.title = `Story City · Play Together`;
}

/* ---------- On entering a step (simulations) ---------- */
function enter() {
  if (S.step === 'lobby') {
    [1400, 2600, 3800].forEach((ms, k) => later(() => { S.joined = k + 1; render(); }, ms));
  }
  if (!many()) return;
  if (S.step === 'window' && !isMe('lookout')) later(() => { S.found = true; render(); }, 2600);
  if (S.step === 'letter' && !isMe('lookout')) later(() => { S.photo = true; render(); }, 2600);
  if (S.step === 'code') PIECES.forEach((_, i) => { if (i !== S.viewer) later(() => { S.said.push(i); render(); }, 900 + S.said.length * 900 + i * 400); });
}

/* ---------- Actions ---------- */
function toast(t) {
  toastEl.textContent = t; toastEl.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.hidden = true, 1800);
}
function openSheet(html) {
  sheet.innerHTML = html; sheet.hidden = false; scrim.hidden = false;
  const f = sheet.querySelector('button'); if (f) f.focus();
}
function closeSheet() { sheet.hidden = true; scrim.hidden = true; sheet.innerHTML = ''; }

function startWalk() {
  const which = S.step;
  S.walking = true; render();
  const t0 = performance.now(), DUR = 2400;
  const route = document.getElementById('route');
  const len = route ? route.getTotalLength() : 0;
  const stragglers = S.players.map((_, i) => i).filter(i => i !== 0);
  const tick = now => {
    if (S.step !== which) return;
    S.walk = Math.min(1, (now - t0) / DUR);
    const bar = document.getElementById('walkbar'); if (bar) bar.style.width = S.walk * 100 + '%';
    const me = document.getElementById('me'), done = document.getElementById('done');
    if (route && me) { const pt = route.getPointAtLength(len * S.walk); me.setAttribute('cx', pt.x); me.setAttribute('cy', pt.y); }
    if (done) done.setAttribute('stroke-dashoffset', 1 - S.walk);
    if (S.walk < 1) return requestAnimationFrame(tick);
    S.walking = false;
    if (many()) {
      // Host + first two arrive with the map; the last friend catches up a moment later.
      S.arrived = [0, stragglers[0], stragglers[1]].filter(x => x !== undefined);
      render();
      later(() => { S.arrived = S.players.map((_, i) => i); render(); }, 1200);
    } else render();
  };
  requestAnimationFrame(tick);
}

function countVotes() {
  const c = { corner: 0, inside: 0 };
  Object.values(S.votes).forEach(k => c[k]++);
  if (c.corner === c.inside) S.tie = true;
  else S.winner = c.corner > c.inside ? 'corner' : 'inside';
  render();
}

function flip() {
  const forced = params.get('coin');
  const side = forced === 'a' ? 'corner' : forced === 'b' ? 'inside' : (Math.random() < .5 ? 'corner' : 'inside');
  S.flipping = true; render();
  const coin = document.getElementById('coin');
  requestAnimationFrame(() => requestAnimationFrame(() => { coin.style.transform = `rotateY(${1800 + (side === 'inside' ? 180 : 0)}deg)`; }));
  later(() => { S.winner = side; S.coin = side; S.flipping = false; render();
    const c2 = document.getElementById('coin'); if (c2) { c2.style.transition = 'none'; c2.style.transform = `rotateY(${side === 'inside' ? 180 : 0}deg)`; } }, 1900);
}

function afterVote() {
  S.rejected = S.winner === 'inside';
  next();
}

function simVotes(myKey) {
  // The simulated friends split so the vote always ties: one agrees with you, the rest don't.
  const others = S.players.map((_, i) => i).filter(i => i !== S.viewer);
  const other = myKey === 'corner' ? 'inside' : 'corner';
  others.forEach((i, k) => later(() => { S.votes[i] = k === 0 ? myKey : other; render(); }, 700 + k * 700));
}

function keyPress(k) {
  if (S.codeState === 'good') return;
  if (S.codeState === 'bad') { S.codeState = ''; S.code = ''; }
  if (S.code.length < 6) S.code += k;
  render();
}
function enterCode() {
  if (S.code === CODE) { S.codeState = 'good'; render(); }
  else { S.codeState = 'bad'; render(); }
}

function reset(v = S.v) {
  clearTimers(); closeSheet();
  fresh(v);
  const u = new URL(location.href); u.searchParams.set('v', v); history.replaceState(null, '', u);
  go('intro');
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const a = el.dataset.act;
  if (a === 'next') next();
  else if (a === 'reset') reset();
  else if (a === 'add') { if (S.names.length < 5) { S.names.push(C.friends.defaults[S.names.length - 1] || ''); render(); const ins = screen.querySelectorAll('[data-name]'); ins[ins.length - 1].focus(); } }
  else if (a === 'remove') { S.names.splice(+el.dataset.i, 1); render(); }
  else if (a === 'where') { S.where = el.dataset.where; render(); }
  else if (a === 'toggleHome') { S.where = homeMode() ? 'out' : 'home'; S.walk = 0; S.walking = false; S.arrived = []; render(); }
  else if (a === 'deal') { assignRoles(); next(); }
  else if (a === 'handed') { S.handed = true; if (BEATS[S.step]) S.holder = ownerIdx(BEATS[S.step]); render(); screen.scrollTop = 0; }
  else if (a === 'seal') { if (isMe('lookout')) { S.found = true; render(); } }
  else if (a === 'vote') { S.votes[el.dataset.i] = el.dataset.k; render(); }
  else if (a === 'mvote') { S.votes[S.viewer] = el.dataset.k; render(); simVotes(el.dataset.k); }
  else if (a === 'count') countVotes();
  else if (a === 'flip') flip();
  else if (a === 'voted') afterVote();
  else if (a === 'walk') startWalk();
  else if (a === 'snap') { S.snapping = true; render(); later(() => { S.snapping = false; S.photo = true; render(); }, 450); }
  else if (a === 'photo') openSheet(`${eyebrow(B.code.photoTitle(esc(owner('lookout').name)))}${photo(CODE)}${btn(C.finale.close, 'close', 'sec')}`);
  else if (a === 'key') keyPress(el.dataset.k);
  else if (a === 'clear') { S.code = ''; S.codeState = ''; render(); }
  else if (a === 'enter') enterCode();
  else if (a === 'hint') { S.hint = true; render(); }
  else if (a === 'invite') toast(C.lobby.copied);
  else if (a === 'share') toast(C.finale.shared);
  else if (a === 'copylink') toast(C.finale.linkCopied);
  else if (a.startsWith('offer-')) { const o = C.finale[a.slice(6)];
    openSheet(`<div style="font-size:34px" aria-hidden="true">${o.emoji}</div><h2>${o.title}</h2><p>${o.body}</p><p class="price" style="color:var(--citrine);font-weight:700">${o.price}</p><p class="hint">${C.finale.sheetNote}</p>${btn(C.finale.close, 'close', 'sec')}`); }
  else if (a === 'close') closeSheet();
  else if (a === 'again') reset(many() ? 'one-phone' : 'many-phones');
});
scrim.addEventListener('click', closeSheet);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !sheet.hidden) closeSheet();
  if (e.key === 'Enter' && e.target.id === 'team') { e.preventDefault(); e.target.blur(); }
});
document.addEventListener('input', e => {
  const i = e.target.dataset && e.target.dataset.name;
  if (i !== undefined) {
    S.names[+i] = e.target.value;
    const a = screen.querySelector(`[data-av="${i}"]`); if (a) a.textContent = initial(e.target.value);
  }
  if (e.target.id === 'team') S.team = e.target.textContent.trim() || C.finale.teamDefault;
});
document.addEventListener('change', e => {
  if (e.target.id === 'variant') reset(e.target.value);
  if (e.target.id === 'peek') {
    S.viewer = +e.target.value;
    // Re-run per-phone simulations for the new viewer where needed.
    clearTimers();
    if (S.step === 'code') S.said = [];
    render(); enter();
  }
});

const v0 = VARIANTS[params.get('v')] ? params.get('v') : 'one-phone';
fresh(v0);
go('intro');
window.__pt = { get S() { return S; }, go, next };
