import {
  FONTS, ERODE_ADJUST, SCALE, CASES, TITLE_SMALL_WORDS, PROPER_WORDS, RANGES, ROLES, WEIGHT_NAMES, UI, SCREENS, COPY,
  PALETTE, SURFACES, THEMES, STORIES,
} from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const NBSP = ' ';
const URL_KEY = 't';
const URL_DELAY_MS = 250;
const TOAST_MS = 1600;
const WEIGHT_STEP = 50;
const BASE_STEP = 0.5;
const MOBILE_QUERY = '(max-width: 899px)';

const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]));
const SMALL = new Set(TITLE_SMALL_WORDS);
const PROPER = new Set(PROPER_WORDS.map((w) => w.toLowerCase()));

const stepFor = (size, base, ratio) => Math.log(size / base) / Math.log(ratio);

function defaultRoles() {
  return Object.fromEntries(ROLES.map((r) => [r.id, {
    weight: r.weight, step: stepFor(r.size, SCALE.base, SCALE.ratio), case: r.case, lh: r.lh, ls: r.ls, phoneFont: !!r.phoneFont, colour: r.colour,
  }]));
}

const defaultSurfaces = () => Object.fromEntries(SURFACES.map((s) => [s.id, s.hex]));
const HEX_RE = /^#[0-9a-f]{6}$/i;
const swatchName = (hex) => PALETTE.find((p) => p.hex.toLowerCase() === hex.toLowerCase())?.name ?? UI.custom;

const state = {
  base: SCALE.base,
  ratio: SCALE.ratio,
  roles: defaultRoles(),
  surfaces: defaultSurfaces(),
  view: 'mine',
  open: ROLES[0].id,
  screen: SCREENS[0].id,
};

const sizeOf = (r, base = state.base, ratio = state.ratio) => Math.round(base * ratio ** r.step);

// ---------- URL ----------
function encodeState() {
  const roles = {};
  for (const role of ROLES) {
    const r = state.roles[role.id];
    roles[role.id] = [r.weight, sizeOf(r), r.case, r.lh, r.ls, r.phoneFont ? 1 : 0, r.colour];
  }
  const json = JSON.stringify({ b: state.base, q: state.ratio, r: roles, c: state.surfaces, s: state.screen, o: state.open });
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeState() {
  const params = new URLSearchParams(location.hash.slice(1));
  const raw = params.get(URL_KEY);
  if (!raw) return;
  try {
    const json = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, '+').replace(/_/g, '/')))));
    if (typeof json.b === 'number') state.base = json.b;
    if (typeof json.q === 'number') state.ratio = json.q;
    for (const [id, v] of Object.entries(json.r || {})) {
      if (!ROLE_BY_ID[id] || !Array.isArray(v)) continue;
      const [weight, size, kase, lh, ls, phone, colour] = v;
      state.roles[id] = {
        weight, step: stepFor(size, state.base, state.ratio), case: kase, lh, ls, phoneFont: !!phone,
        colour: HEX_RE.test(colour) ? colour : ROLE_BY_ID[id].colour,
      };
    }
    for (const [id, hex] of Object.entries(json.c || {})) {
      if (id in state.surfaces && HEX_RE.test(hex)) state.surfaces[id] = hex;
    }
    if (SCREENS.some((s) => s.id === json.s)) state.screen = json.s;
    if (ROLE_BY_ID[json.o] || json.o === COLOURS_ID) state.open = json.o;
  } catch {
    /* a broken link falls back to the spec */
  }
}

let urlTimer = 0;
function saveUrl() {
  clearTimeout(urlTimer);
  urlTimer = setTimeout(() => history.replaceState(null, '', `#${URL_KEY}=${encodeState()}`), URL_DELAY_MS);
}

// ---------- Text case ----------
function capFirst(w) { return w.charAt(0).toUpperCase() + w.slice(1); }

function applyCase(text, mode) {
  if (mode === 'title') {
    return text.split(' ').map((w, i) => {
      const bare = w.toLowerCase().replace(/[^a-z’']/g, '');
      return i > 0 && SMALL.has(bare) ? w.toLowerCase() : capFirst(w);
    }).join(' ');
  }
  if (mode === 'sentence') {
    return text.split(' ').map((w, i) => {
      if (i === 0) return capFirst(w);
      const bare = w.toLowerCase().replace(/[^a-z’']/g, '');
      return PROPER.has(bare) ? capFirst(w) : w.toLowerCase();
    }).join(' ');
  }
  return text;
}

function noWidow(text) {
  const i = text.lastIndexOf(' ');
  return i > 0 && text.indexOf(' ') !== i ? text.slice(0, i) + NBSP + text.slice(i + 1) : text;
}

// ---------- Styles ----------
function fontFor(role, r) {
  if (role.id === 'bubble' && r.phoneFont) return FONTS.phone;
  return FONTS[role.font];
}

function styleRules(roles, base, ratio, surfaces) {
  const vars = `.screens{${SURFACES.map((s) => `--s-${s.id}:${surfaces[s.id]}`).join(';')}}`;
  return [vars, ...ROLES.map((role) => {
    const r = roles[role.id];
    const f = fontFor(role, r);
    return `.screens .t-${role.id}{font-family:${f.stack};font-weight:${r.weight};font-size:${sizeOf(r, base, ratio)}px;`
      + `line-height:${r.lh};letter-spacing:${r.ls}em;text-transform:${r.case === 'caps' ? 'uppercase' : 'none'};color:${r.colour}}`;
  })].join('\n');
}

const styleEl = document.createElement('style');
document.head.append(styleEl);

function paintText() {
  const roles = state.view === 'spec' ? defaultRoles() : state.roles;
  const base = state.view === 'spec' ? SCALE.base : state.base;
  const ratio = state.view === 'spec' ? SCALE.ratio : state.ratio;
  const surfaces = state.view === 'spec' ? defaultSurfaces() : state.surfaces;
  styleEl.textContent = styleRules(roles, base, ratio, surfaces);
  for (const el of $$('[data-role]')) {
    const r = roles[el.dataset.role];
    el.textContent = noWidow(applyCase(el.dataset.src, r.case === 'caps' ? 'none' : r.case));
  }
  const badge = $('#specBadge');
  badge.hidden = state.view !== 'spec';
  badge.textContent = UI.specBadge;
}

// ---------- Screens ----------
const t = (role, text, tag = 'p', cls = '') => `<${tag} class="t-${role} ${cls}" data-role="${role}" data-src="${esc(text)}"></${tag}>`;
const status = () => '<div class="status"><span>9:41</span><span>●●● ▮</span></div>';

const coverImg = (s, cls = '') => `<img class="cover-img ${cls}" src="${esc(s.cover)}" alt="${esc(s.title)} cover" loading="lazy" decoding="async">`;

function storyCard(id) {
  const s = STORIES[id];
  const overlay = s.coverHasTitle ? '' : `<div class="card-scrim">${t('cardTitle', s.title, 'h3')}</div>`;
  return `<div class="story-card">${coverImg(s)}
    ${t('caption', s.genre, 'span', 'chip-on chip-top')}${overlay}
    ${t('caption', s.time, 'span', 'chip-on chip-bottom')}</div>`;
}

function libraryScreen() {
  const c = COPY.library;
  const cur = c.current;
  const s = STORIES[cur.story];
  return `${status()}<div class="scroll"><div class="pad">
    <div class="lib-head">${t('storyTitle', c.title, 'h2')}</div>
    ${t('eyebrow', c.continueKicker)}
    <div class="hero-card">
      <div class="cont">${coverImg(s, 'thumb')}
        <div class="cont-text">
          ${t('eyebrow', `${s.genre} · ${s.time}`)}
          ${t('cardTitle', s.title, 'h3')}
          ${t('caption', cur.meta)}
          <div class="progress"><i style="width:30%"></i></div>
        </div>
      </div>
      ${t('button', cur.button, 'div', 'cta')}
    </div>
    ${t('eyebrow', c.newKicker)}
    <div class="mini-grid">${c.cards.map(storyCard).join('')}</div>
  </div></div>
  <nav class="tabbar">${c.tabs.map((x, i) => `<span class="${i === 1 ? 'cur' : ''}"><i></i>${t('caption', x, 'span')}</span>`).join('')}</nav>`;
}

function detailScreen() {
  const c = COPY.detail;
  const s = STORIES[c.story];
  return `${status()}<div class="back" aria-hidden="true"></div><div class="scroll">
    <div class="detail-cover">${coverImg(s)}</div>
    <div class="pad">
      ${t('eyebrow', c.eyebrow)}
      ${t('storyTitle', c.title, 'h2')}
      ${t('caption', c.meta)}
      ${c.paras.map((p) => t('body', p)).join('')}
    </div></div>
  <div class="foot">${t('button', c.button, 'div', 'cta')}${t('caption', c.under)}</div>`;
}

function readerScreen() {
  const c = COPY.reader;
  let lastFrom = '';
  const bubbles = c.bubbles.map((b) => {
    const head = b.from === 'them' && lastFrom !== 'them'
      ? `<div class="sender"><span class="avatar"></span>${t('caption', c.sender, 'span')}</div>` : '';
    lastFrom = b.from;
    return head + t('bubble', b.text, 'div', `bubble ${b.from}`);
  }).join('');
  return `${status()}<div class="reader-top">${t('caption', c.progress)}<div class="progress"><i></i></div></div>
  <div class="scroll"><div class="pad">
    ${t('eyebrow', c.eyebrow)}
    ${t('chapterTitle', c.title, 'h2')}
    ${t('body', c.narration)}
    <div class="thread">${t('caption', c.time, 'p', 'stamp')}${bubbles}</div>
    <div class="choices">${c.choices.map((x) => t('button', x, 'div', 'cta ghost')).join('')}</div>
  </div></div>`;
}

function mapScreen() {
  const c = COPY.map;
  return `${status()}<div class="map">
    <svg viewBox="0 0 360 690" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="360" height="690" fill="#140a30"/>
      <path d="M40 40h120v150H40zM210 70h120v110H210z" fill="#1c3a3a" opacity=".55"/>
      <g stroke="#2a1d58" stroke-width="14" fill="none" stroke-linecap="round">
        <path d="M-10 230H380M-10 420H380M120 -10V700M260 -10V700M-10 600L380 520"/>
      </g>
      <g stroke="#221748" stroke-width="6" fill="none"><path d="M-10 320H380M190 -10V700M60 -10V700"/></g>
      <path d="M180 470 L190 420 L260 420 L260 300 L215 230" stroke="#5b8cff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="180" cy="470" r="9" fill="#5b8cff" stroke="#fbf7ff" stroke-width="3"/>
      <path d="M215 232c-12-16-18-24-18-32a18 18 0 0 1 36 0c0 8-6 16-18 32z" fill="#5b8cff" stroke="#fbf7ff" stroke-width="2"/>
    </svg>
    ${t('caption', c.mode, 'div', 'mode-chip')}
    <div class="map-card">
      ${t('eyebrow', c.eyebrow)}
      ${t('chapterTitle', c.title, 'h3')}
      ${t('body', c.body)}
      ${t('caption', c.meta)}
      ${t('button', c.button, 'div', 'cta')}
    </div>
  </div>`;
}

function paywallScreen() {
  const c = COPY.paywall;
  const fan = ['frightnight', 'alice', 'pirate'].map((id) => coverImg(STORIES[id], 'fan')).join('');
  return `${status()}<div class="scroll paywall"><div class="pad center">
    <div class="fan" aria-hidden="true">${fan}</div>
    ${t('eyebrow', c.eyebrow)}
    ${t('storyTitle', c.title, 'h2')}
    ${t('body', c.body)}
  </div><div class="pad">
    <ul class="perks">${c.perks.map((p) => `<li>${t('body', p, 'span')}</li>`).join('')}</ul>
    <div class="plans">${c.plans.map((p) => `<div class="plan ${p.on ? 'on' : ''}">
      ${t('button', p.label, 'span')}${t('button', p.price, 'span')}${t('caption', p.note, 'span')}</div>`).join('')}</div>
    ${t('button', c.button, 'div', 'cta')}
    ${t('caption', c.small, 'p', 'center')}
    ${t('button', c.later, 'div', 'cta ghost')}
  </div></div>`;
}

const BUILDERS = { library: libraryScreen, detail: detailScreen, reader: readerScreen, map: mapScreen, paywall: paywallScreen };

function buildScreens() {
  $('#screens').innerHTML = SCREENS.map((s) => `<section class="shot" data-screen="${s.id}" aria-label="${esc(s.label)}">
    <div class="shot-label">${esc(s.label)}</div><div class="phone">${BUILDERS[s.id]()}</div></section>`).join('');
  $('#screens').setAttribute('aria-label', UI.screensAria);
  $('#screenTabs').innerHTML = SCREENS.map((s) => `<button type="button" class="chip" data-screen="${s.id}">${esc(s.label)}</button>`).join('');
}

function paintScreenTabs() {
  for (const b of $$('#screenTabs .chip')) b.setAttribute('aria-pressed', String(b.dataset.screen === state.screen));
  for (const s of $$('.shot')) s.classList.toggle('cur', s.dataset.screen === state.screen);
}

function paintHighlight() {
  $('#screens').classList.add('hl');
  for (const el of $$('#screens [data-role]')) el.classList.toggle('on', el.dataset.role === state.open);
}

// ---------- Panel ----------
const fmtLs = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}em`;
const weightLabel = (w) => (WEIGHT_NAMES[w] ? `${w} ${WEIGHT_NAMES[w]}` : String(w));

function slider(key, label, min, max, step) {
  return `<div class="slider"><label for="${key}">${esc(label)}</label>
    <input type="range" id="${key}" data-k="${key}" min="${min}" max="${max}" step="${step}"><output data-o="${key}"></output></div>`;
}

const COLOURS_ID = '__colours';
const swatchBtn = (target) => `<button type="button" class="swatch-btn" data-pick="${target}" aria-haspopup="dialog"><i></i><span></span></button>`;

function coloursBlock() {
  return `<div class="role" data-role-panel="${COLOURS_ID}">
    <button type="button" class="role-head" data-toggle="${COLOURS_ID}" aria-expanded="false">
      <span class="role-name">${esc(UI.colours)}</span><span class="role-sum" data-sum="${COLOURS_ID}"></span><span class="chev"></span>
    </button>
    <div class="role-body">
      <div class="row"><span class="note">${esc(UI.theme)}</span>${THEMES.map((th) => `<button type="button" class="chip" data-theme="${th.id}">${esc(th.label)}</button>`).join('')}</div>
      ${SURFACES.map((s) => `<div class="slider crow"><span class="lbl">${esc(s.label)}</span>${swatchBtn(`surface:${s.id}`)}</div>`).join('')}
      <p class="note">${esc(UI.surfacesNote)}</p>
    </div>
  </div>`;
}

function getColour(target) {
  const [kind, id] = target.split(':');
  return kind === 'role' ? state.roles[id].colour : state.surfaces[id];
}

function setColour(target, hex) {
  const [kind, id] = target.split(':');
  if (kind === 'role') state.roles[id].colour = hex;
  else state.surfaces[id] = hex;
  update();
}

function applyTheme(id) {
  const th = THEMES.find((x) => x.id === id);
  const surfaces = defaultSurfaces();
  state.surfaces = { ...surfaces, ...(th.surfaces || {}) };
  for (const role of ROLES) state.roles[role.id].colour = th.roles?.[role.id] ?? role.colour;
  update();
}

function themeMatch() {
  return THEMES.find((th) => {
    const surfaces = { ...defaultSurfaces(), ...(th.surfaces || {}) };
    return SURFACES.every((s) => surfaces[s.id].toLowerCase() === state.surfaces[s.id].toLowerCase())
      && ROLES.every((r) => (th.roles?.[r.id] ?? r.colour).toLowerCase() === state.roles[r.id].colour.toLowerCase());
  })?.id;
}

let pickerTarget = '';
function openPicker(btn) {
  const pop = $('#picker');
  pickerTarget = btn.dataset.pick;
  const cur = getColour(pickerTarget).toLowerCase();
  pop.innerHTML = `<div class="sw-grid">${PALETTE.map((p) => `<button type="button" class="sw" data-hex="${p.hex}" title="${esc(p.name)} ${p.hex}" aria-label="${esc(p.name)}" aria-pressed="${p.hex.toLowerCase() === cur}" style="--c:${p.hex}"></button>`).join('')}</div>
    <div class="row"><label class="custom">${esc(UI.custom)} <input type="color" value="${cur}" data-custom></label><input class="hex" data-hexin value="${cur.toUpperCase()}" maxlength="7" spellcheck="false" aria-label="Hex"></div>`;
  pop.hidden = false;
  const r = btn.getBoundingClientRect();
  const w = pop.offsetWidth;
  const h = pop.offsetHeight;
  const left = Math.max(8, Math.min(innerWidth - w - 8, r.left));
  const top = r.bottom + 6 + h > innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6;
  pop.style.left = `${left}px`;
  pop.style.top = `${top}px`;
}

function closePicker() {
  $('#picker').hidden = true;
  pickerTarget = '';
}

function roleBlock(role) {
  const f = FONTS[role.font];
  const id = role.id;
  return `<div class="role" data-role-panel="${id}">
    <button type="button" class="role-head" data-toggle="${id}" aria-expanded="false">
      <span class="role-name">${esc(role.label)}</span><span class="role-sum" data-sum="${id}"></span><span class="chev"></span>
    </button>
    <div class="role-body">
      <p class="role-use">${esc(role.use)}</p>
      <div class="slider crow"><span class="lbl">${esc(UI.colour)}</span>${swatchBtn(`role:${id}`)}</div>
      ${id === 'bubble' ? `<div class="row"><span class="note">${esc(UI.bubbleFont)}</span><span class="seg">
        <button type="button" class="chip" data-phone="${id}" data-v="0">${esc(UI.karla)}</button>
        <button type="button" class="chip" data-phone="${id}" data-v="1">${esc(UI.phoneFont)}</button></span></div>` : ''}
      ${slider(`${id}.weight`, UI.weight, f.min, f.max, WEIGHT_STEP)}
      ${slider(`${id}.size`, UI.size, RANGES.size[0], RANGES.size[1], 1)}
      ${role.font === 'head' ? `<p class="note" data-app="${id}"></p>` : ''}
      ${slider(`${id}.lh`, UI.lh, ...RANGES.lh)}
      ${slider(`${id}.ls`, UI.ls, ...RANGES.ls)}
      <div class="row cases">${CASES.map((c) => `<button type="button" class="chip" data-case="${id}" data-v="${c.id}">${esc(c.label)}</button>`).join('')}</div>
      <div class="row"><button type="button" class="btn" data-reset="${id}">${esc(UI.resetRole)}</button></div>
    </div>
  </div>`;
}

function buildPanel() {
  $('#sheetHandle').innerHTML = `${esc(UI.tune)} <span class="chev"></span>`;
  $('#panelBody').innerHTML = `
    <div class="brand"><h1>${esc(UI.title)}</h1><p>${esc(UI.sub)}</p></div>
    <p class="hint">${esc(UI.hint)}</p>
    <div class="group">
      <div class="row" style="justify-content:space-between">
        <span class="seg"><button type="button" class="chip" data-view="spec">${esc(UI.compare.spec)}</button><button type="button" class="chip" data-view="mine">${esc(UI.compare.mine)}</button></span>
        <span class="row"><button type="button" class="btn" id="copyLink">${esc(UI.copyLink)}</button><button type="button" class="btn" id="resetAll">${esc(UI.reset)}</button></span>
      </div>
      <div class="row"><span class="note">${esc(UI.export)}</span>${Object.entries(UI.exports).map(([k, v]) => `<button type="button" class="btn" data-export="${k}">${esc(v)}</button>`).join('')}</div>
    </div>
    <div class="group">
      <div class="group-title">${esc(UI.scale)}</div>
      ${slider('base', UI.base, SCALE.baseRange[0], SCALE.baseRange[1], BASE_STEP)}
      <div class="slider"><label for="ratio">${esc(UI.ratio)}</label>
        <select id="ratio" style="grid-column: span 2">${SCALE.ratios.map((r) => `<option value="${r.v}">${esc(r.label)}</option>`).join('')}</select></div>
    </div>
    <div class="roles">${coloursBlock()}${ROLES.map(roleBlock).join('')}</div>`;
  const pop = document.createElement('div');
  pop.id = 'picker';
  pop.className = 'picker';
  pop.hidden = true;
  pop.setAttribute('role', 'dialog');
  document.body.append(pop);
}

function syncPanel() {
  $('[data-k="base"]').value = state.base;
  $('[data-o="base"]').textContent = `${state.base} px`;
  $('#ratio').value = String(state.ratio);
  for (const b of $$('[data-view]')) b.setAttribute('aria-pressed', String(b.dataset.view === state.view));
  for (const role of ROLES) {
    const r = state.roles[role.id];
    const size = sizeOf(r);
    const set = (k, v, out) => { $(`[data-k="${role.id}.${k}"]`).value = v; $(`[data-o="${role.id}.${k}"]`).textContent = out; };
    set('weight', r.weight, weightLabel(r.weight));
    set('size', size, `${size} px`);
    set('lh', r.lh, r.lh.toFixed(2));
    set('ls', r.ls, fmtLs(r.ls));
    const app = $(`[data-app="${role.id}"]`);
    if (app) app.innerHTML = `${esc(UI.appSize)} <b>${Math.round(size * ERODE_ADJUST)}&nbsp;px</b> · ${esc(UI.erodeNote)}`;
    for (const c of $$(`[data-case="${role.id}"]`)) c.setAttribute('aria-pressed', String(c.dataset.v === r.case));
    for (const c of $$(`[data-phone="${role.id}"]`)) c.setAttribute('aria-pressed', String((c.dataset.v === '1') === r.phoneFont));
    const caseLabel = CASES.find((c) => c.id === r.case)?.label ?? '';
    $(`[data-sum="${role.id}"]`).textContent = `${r.weight} · ${size} · ${caseLabel}`;
    const panel = $(`[data-role-panel="${role.id}"]`);
    const open = state.open === role.id;
    panel.classList.toggle('open', open);
    $('.role-head', panel).setAttribute('aria-expanded', String(open));
  }
  for (const b of $$('[data-pick]')) {
    const hex = getColour(b.dataset.pick);
    $('i', b).style.background = hex;
    $('span', b).textContent = `${swatchName(hex)} ${hex.toUpperCase()}`;
  }
  const theme = themeMatch();
  for (const b of $$('[data-theme]')) b.setAttribute('aria-pressed', String(b.dataset.theme === theme));
  $(`[data-sum="${COLOURS_ID}"]`).textContent = theme ? THEMES.find((x) => x.id === theme).label : UI.custom;
  const cp = $(`[data-role-panel="${COLOURS_ID}"]`);
  cp.classList.toggle('open', state.open === COLOURS_ID);
  $('.role-head', cp).setAttribute('aria-expanded', String(state.open === COLOURS_ID));
}

function update() {
  if (state.view === 'spec') state.view = 'mine';
  refresh();
}

function refresh() {
  syncPanel();
  paintText();
  paintScreenTabs();
  paintHighlight();
  saveUrl();
}

// ---------- Export ----------
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function rows() {
  return ROLES.map((role) => {
    const r = state.roles[role.id];
    const f = fontFor(role, r);
    const size = sizeOf(r);
    return {
      id: role.id, label: role.label, font: f.name, weight: r.weight, weightName: WEIGHT_NAMES[r.weight] ?? String(r.weight),
      size, appSize: role.font === 'head' ? Math.round(size * ERODE_ADJUST) : size, lineHeight: r.lh, linePx: Math.round(size * r.lh),
      letterSpacingEm: r.ls, letterSpacingPx: Math.round(r.ls * size * 100) / 100,
      case: CASES.find((c) => c.id === r.case)?.label ?? r.case, stack: f.stack, transform: r.case === 'caps' ? 'uppercase' : 'none', use: role.use,
      colour: r.colour.toUpperCase(), colourName: swatchName(r.colour),
    };
  });
}

const surfaceRows = () => SURFACES.map((s) => ({ id: s.id, label: s.label, hex: state.surfaces[s.id].toUpperCase(), name: swatchName(state.surfaces[s.id]) }));

function exportText(kind) {
  const list = rows();
  if (kind === 'json') {
    return JSON.stringify({
      fonts: { heading: FONTS.head.name, body: FONTS.body.name },
      erodeAppMultiplier: ERODE_ADJUST,
      scale: { base: state.base, ratio: state.ratio },
      roles: Object.fromEntries(list.map((x) => [x.id, {
        label: x.label, font: x.font, weight: x.weight, size: x.size, appSize: x.appSize, lineHeight: x.lineHeight,
        letterSpacingEm: x.letterSpacingEm, letterSpacingPx: x.letterSpacingPx, case: x.case, colour: x.colour, colourName: x.colourName,
      }])),
      colours: Object.fromEntries(surfaceRows().map((s) => [s.id, { label: s.label, hex: s.hex, name: s.name }])),
      link: location.href,
    }, null, 2);
  }
  if (kind === 'table') {
    const head = '| Style | Font | Size / line | Spacing | Case | Colour | App size | Used for |\n|---|---|---|---|---|---|---|---|';
    const body = list.map((x) => `| ${x.label} | ${x.font} ${x.weightName} | ${x.size} / ${x.linePx} | ${x.letterSpacingPx.toFixed(2)} | ${x.case} | ${x.colourName} ${x.colour} | ${x.appSize} | ${x.use} |`).join('\n');
    const sHead = '| Surface | Colour |\n|---|---|';
    const sBody = surfaceRows().map((s) => `| ${s.label} | ${s.name} ${s.hex} |`).join('\n');
    return `${head}\n${body}\n\n${sHead}\n${sBody}\n\nSizes in px as drawn on the brand page. Erode app size = size × ${ERODE_ADJUST}.`;
  }
  const vars = list.map((x) => {
    const k = kebab(x.id);
    return `  /* ${x.label}: ${x.case} */\n  --${k}-family: ${x.stack};\n  --${k}-weight: ${x.weight};\n  --${k}-size: ${x.size}px;\n`
      + `  --${k}-app-size: ${x.appSize}px;\n  --${k}-line-height: ${x.lineHeight};\n  --${k}-letter-spacing: ${x.letterSpacingEm}em;\n  --${k}-transform: ${x.transform};\n  --${k}-colour: ${x.colour};`;
  }).join('\n\n');
  const surf = surfaceRows().map((s) => `  --colour-${kebab(s.id)}: ${s.hex}; /* ${s.label}: ${s.name} */`).join('\n');
  return `/* Story City type. Erode app size = size × ${ERODE_ADJUST} (no size-adjust in React Native). */\n:root {\n  --type-base: ${state.base}px;\n  --type-ratio: ${state.ratio};\n\n${surf}\n\n${vars}\n}`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

let toastTimer = 0;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, TOAST_MS);
}

function openExport(kind) {
  const dlg = $('#exportDialog');
  const text = exportText(kind);
  dlg.innerHTML = `<div class="export-inner"><h2>${esc(UI.exportTitles[kind])}</h2>
    <textarea readonly spellcheck="false">${esc(text)}</textarea>
    <div class="row"><button type="button" class="btn primary" data-copy>${esc(UI.copy)}</button><button type="button" class="btn" data-close>${esc(UI.close)}</button></div></div>`;
  $('[data-copy]', dlg).onclick = async (e) => { if (await copyText(text)) e.target.textContent = UI.copied; };
  $('[data-close]', dlg).onclick = () => dlg.close();
  dlg.showModal();
}

// ---------- Events ----------
function openRole(id, fromScreen) {
  state.open = id;
  refresh();
  if (!fromScreen) return;
  const mobile = matchMedia(MOBILE_QUERY).matches;
  if (mobile) setSheet(true);
  $(`[data-role-panel="${id}"]`).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function setSheet(open) {
  $('#panel').classList.toggle('open', open);
  $('#sheetHandle').setAttribute('aria-expanded', String(open));
}

function bind() {
  const panel = $('#panel');
  panel.addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    const v = Number(e.target.value);
    if (k === 'base') { state.base = v; update(); return; }
    const [id, prop] = k.split('.');
    const r = state.roles[id];
    if (prop === 'size') r.step = stepFor(v, state.base, state.ratio);
    else r[prop] = v;
    update();
  });
  $('#ratio').addEventListener('change', (e) => { state.ratio = Number(e.target.value); update(); });
  panel.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const d = b.dataset;
    if (d.pick) { if (pickerTarget === d.pick) closePicker(); else openPicker(b); return; }
    if (d.theme) { applyTheme(d.theme); return; }
    if (d.toggle) { state.open = state.open === d.toggle ? '' : d.toggle; refresh(); }
    else if (d.case) { state.roles[d.case].case = d.v; update(); }
    else if (d.phone) { state.roles[d.phone].phoneFont = d.v === '1'; const f = fontFor(ROLE_BY_ID[d.phone], state.roles[d.phone]); const r = state.roles[d.phone]; r.weight = Math.min(f.max, Math.max(f.min, r.weight)); update(); }
    else if (d.reset) { state.roles[d.reset] = defaultRoles()[d.reset]; state.roles[d.reset].step = stepFor(ROLE_BY_ID[d.reset].size, state.base, state.ratio); update(); }
    else if (d.view) { state.view = d.view; refresh(); }
    else if (d.export) openExport(d.export);
    else if (b.id === 'resetAll') { state.base = SCALE.base; state.ratio = SCALE.ratio; state.roles = defaultRoles(); state.surfaces = defaultSurfaces(); update(); }
    else if (b.id === 'copyLink') { history.replaceState(null, '', `#${URL_KEY}=${encodeState()}`); copyText(location.href).then((ok) => ok && toast(UI.linkCopied)); }
    else if (b.id === 'sheetHandle') setSheet(!panel.classList.contains('open'));
  });
  const pop = $('#picker');
  pop.addEventListener('click', (e) => {
    const sw = e.target.closest('[data-hex]');
    if (!sw || !pickerTarget) return;
    setColour(pickerTarget, sw.dataset.hex);
    closePicker();
  });
  pop.addEventListener('input', (e) => {
    if (!pickerTarget) return;
    if (e.target.matches('[data-custom]')) {
      setColour(pickerTarget, e.target.value);
      $('[data-hexin]', pop).value = e.target.value.toUpperCase();
    } else if (e.target.matches('[data-hexin]')) {
      const v = e.target.value.trim();
      const hex = v.startsWith('#') ? v : `#${v}`;
      if (HEX_RE.test(hex)) { setColour(pickerTarget, hex); $('[data-custom]', pop).value = hex.toLowerCase(); }
    }
  });
  document.addEventListener('pointerdown', (e) => {
    if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('[data-pick]')) closePicker();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) closePicker(); });
  $('#panelBody').addEventListener('scroll', () => { if (!pop.hidden) closePicker(); }, { passive: true });
  $('#screens').addEventListener('click', (e) => {
    const el = e.target.closest('[data-role]');
    if (el) openRole(el.dataset.role, true);
  });
  $('#screenTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-screen]');
    if (!b) return;
    state.screen = b.dataset.screen;
    refresh();
  });
}

decodeState();
buildScreens();
buildPanel();
bind();
refresh();
document.fonts?.ready.then(() => document.body.classList.add('fonts-ready'));
