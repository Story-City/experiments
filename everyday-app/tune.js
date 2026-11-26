import { FONTS, ERODE_ADJUST, CASES, CLASSIFY, RANGES, ROLES, SURFACES, PALETTE, THEMES, SPEC, WEIGHT_NAMES, UI } from './tune-data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const HEX_RE = /^#[0-9a-f]{6}$/i;
const STORE_KEY = 'sc-everyday-tune';
const WEIGHT_STEP = 50;
const WIDE_QUERY = '(min-width: 1200px)';
const MOBILE_QUERY = '(max-width: 899px)';
const COLOURS_ID = '__colours';
const PHONE = '#phone';
const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]));
const SURFACE_BY_ID = Object.fromEntries(SURFACES.map((s) => [s.id, s]));
const FONT_RE = /^\s*(italic\s+)?(\d{3})?\s*([\d.]+)px(?:\s*\/\s*([\d.]+)(px)?)?/;

const roleDefault = (role) => ({ weight: role.weight, size: role.size, lh: role.lh, ls: role.ls, colour: role.colour, case: 'built', phoneFont: !!role.phoneFont });
const defaultRoles = () => Object.fromEntries(ROLES.map((r) => [r.id, roleDefault(r)]));
const defaultSurfaces = () => Object.fromEntries(SURFACES.map((s) => [s.id, s.hex]));
const swatchName = (hex) => PALETTE.find((p) => p.hex.toLowerCase() === hex.toLowerCase())?.name ?? UI.custom;

const state = { roles: defaultRoles(), surfaces: defaultSurfaces(), view: 'mine', open: '', pick: false };

// ---------- Sort every app.css style that sets a font into a role ----------
function fontEntry(rule) {
  const st = rule.style;
  const fontVal = st.getPropertyValue('font');
  const fam = st.getPropertyValue('font-family');
  const m = FONT_RE.exec(fontVal);
  const size = m ? Number(m[3]) : parseFloat(st.fontSize);
  if (!size) return null;
  const e = { sel: rule.selectorText, parts: rule.selectorText.split(',').map((s) => s.trim()), size };
  if (m?.[2]) e.weight = Number(m[2]);
  if (Number(st.fontWeight)) e.weight = Number(st.fontWeight);
  if (m?.[4] && !m[5]) e.lh = Number(m[4]);
  const lh = st.lineHeight;
  if (lh && !lh.endsWith('px') && Number(lh)) e.lh = Number(lh);
  const ls = st.letterSpacing;
  if (ls.endsWith('em')) e.ls = parseFloat(ls);
  else if (ls === '0' || ls === 'normal') e.ls = 0;
  if (/italic/.test(fontVal) || st.fontStyle === 'italic') e.italic = true;
  const famText = `${fontVal} ${fam}`;
  e.family = /f-chat/.test(famText) ? 'chat' : /f-head|Erode/.test(famText) ? 'head' : /f-body|Karla/.test(famText) ? 'body' : '';
  if (st.textTransform === 'uppercase') e.caps = true;
  else if (st.textTransform === 'none') e.caps = false;
  e.colourVar = (/^var\((--[\w-]+)\)$/.exec(st.color.trim()) || [])[1] || '';
  return e;
}

function baseCandidates(sel) {
  const out = [];
  let s = sel;
  for (let i = 0; i < 6; i++) {
    const next = s.replace(/(\.[\w-]+|:[\w-]+(\([^)]*\))?|\[[^\]]*\])$/, '');
    if (next !== s && next.trim()) { s = next; out.push(s.trim()); continue; }
    const cut = s.lastIndexOf(' ');
    if (cut <= 0) break;
    s = s.slice(0, cut);
    out.push(s.trim());
  }
  return out;
}

function classify(e) {
  const forced = CLASSIFY.force[e.parts[0]];
  if (forced) return forced;
  if (!e.family) return '';
  if (e.family === 'chat') return 'bubble';
  if (e.family === 'head') {
    if (e.italic) return 'hook';
    if (e.size >= CLASSIFY.storyMin) return 'storyTitle';
    return e.size >= CLASSIFY.chapterMin ? 'chapterTitle' : 'cardTitle';
  }
  if (e.caps) return e.colourVar === '--glow' ? 'eyebrow' : 'label';
  if (CLASSIFY.buttonish.test(e.sel) && (e.weight ?? 400) >= 600) return 'button';
  return e.size <= CLASSIFY.captionMax ? 'caption' : 'body';
}

function readRules() {
  const entries = [];
  const bySel = {};
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules) {
      if (!rule.selectorText || !rule.style) continue;
      if (rule.selectorText.split(',').some((p) => CLASSIFY.skip.test(p.trim()))) continue;
      const e = fontEntry(rule);
      if (!e) continue;
      entries.push(e);
      for (const p of e.parts) if (!bySel[p] || e.family) bySel[p] = e;
    }
  }
  for (const e of entries) {
    if (e.family) continue;
    const base = baseCandidates(e.parts[0]).map((c) => bySel[c]).find((b) => b && b.family);
    if (!base) continue;
    e.family = base.family;
    e.italic ??= base.italic;
    e.caps ??= base.caps;
    e.weight ??= base.weight;
    e.lh ??= base.lh;
    e.ls ??= base.ls;
    e.colourVar ||= base.colourVar;
  }
  for (const e of entries) e.role = classify(e);
  return entries.filter((e) => e.role);
}

let RULES = [];
let PICK_PARTS = [];

// ---------- Overrides ----------
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const same = (a, b) => a.weight === b.weight && a.size === b.size && a.lh === b.lh && a.ls === b.ls && a.case === b.case && a.phoneFont === b.phoneFont;

function fontFor(role, r) {
  if (role.id === 'bubble') return r.phoneFont ? FONTS.phone : FONTS.body;
  return FONTS[role.font];
}

function roleCss(role, r) {
  const def = roleDefault(role);
  const mine = RULES.filter((e) => e.role === role.id);
  const out = [];
  if (!same(r, def)) {
    const f = r.size / def.size;
    const dw = r.weight - def.weight;
    const dls = r.ls - def.ls;
    const lhf = r.lh / def.lh;
    const font = fontFor(role, r);
    for (const e of mine) {
      const props = [`font-size:${round(e.size * f, 1)}px`, `font-weight:${Math.max(font.min, Math.min(font.max, (e.weight ?? def.weight) + dw))}`,
        `line-height:${round((e.lh ?? def.lh) * lhf, 3)}`, `letter-spacing:${round((e.ls ?? def.ls) + dls, 3)}em`];
      if (role.id === 'bubble' && r.phoneFont !== def.phoneFont) props.push(`font-family:${font.stack}`);
      if (r.case === 'caps') props.push('text-transform:uppercase');
      if (r.case === 'none') props.push('text-transform:none');
      out.push(`${e.sel}{${props.join(';')}}`);
    }
  }
  if (r.colour.toLowerCase() !== def.colour.toLowerCase()) {
    const sels = [...mine.filter((e) => e.colourVar === role.colourVar).map((e) => e.sel), ...(role.colourExtra || [])];
    if (sels.length) out.push(`${sels.join(',')}{color:${r.colour}}`);
  }
  return out;
}

function surfaceCss(surfaces) {
  const vars = [];
  const rules = [];
  for (const s of SURFACES) {
    const hex = surfaces[s.id];
    if (hex.toLowerCase() === s.hex.toLowerCase()) continue;
    for (const v of s.vars || []) vars.push(`${v}:${hex}`);
    for (const [sel, prop] of s.rules || []) rules.push(`${PHONE} ${sel}{${prop}:${hex}}`);
  }
  return [vars.length ? `${PHONE}{${vars.join(';')}}` : '', ...rules];
}

const styleEl = document.createElement('style');
styleEl.id = 'tt-overrides';

function paintApp() {
  const roles = state.view === 'built' ? defaultRoles() : state.roles;
  const surfaces = state.view === 'built' ? defaultSurfaces() : state.surfaces;
  const pickCss = state.pick ? `body.tt-pick ${PHONE} :is(${PICK_PARTS.join(',')}):hover{outline:1px dashed #c49bff;outline-offset:2px;cursor:crosshair}` : '';
  styleEl.textContent = [...surfaceCss(surfaces), ...ROLES.flatMap((role) => roleCss(role, roles[role.id])), pickCss].filter(Boolean).join('\n');
}

// ---------- Storage ----------
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(snapshot())); } catch { /* storage blocked: the panel still works */ }
}

function snapshot() {
  return { v: 1, roles: state.roles, surfaces: state.surfaces };
}

function load(obj) {
  if (!obj || obj.v !== 1 || typeof obj.roles !== 'object') return false;
  for (const role of ROLES) {
    const r = obj.roles[role.id];
    if (!r) continue;
    const d = roleDefault(role);
    state.roles[role.id] = {
      weight: Number(r.weight) || d.weight, size: Number(r.size) || d.size, lh: Number(r.lh) || d.lh,
      ls: Number.isFinite(Number(r.ls)) ? Number(r.ls) : d.ls, colour: HEX_RE.test(r.colour) ? r.colour : d.colour,
      case: CASES.some((c) => c.id === r.case) ? r.case : d.case, phoneFont: typeof r.phoneFont === 'boolean' ? r.phoneFont : d.phoneFont,
    };
  }
  for (const s of SURFACES) if (HEX_RE.test(obj.surfaces?.[s.id])) state.surfaces[s.id] = obj.surfaces[s.id];
  return true;
}

function restore() {
  try { load(JSON.parse(localStorage.getItem(STORE_KEY) || 'null')); } catch { /* nothing saved */ }
}

// ---------- Panel ----------
const fmtLs = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}em`;
const weightLabel = (w) => (WEIGHT_NAMES[w] ? `${w} ${WEIGHT_NAMES[w]}` : String(w));
const swatchBtn = (target) => `<button type="button" class="tt-swatch" data-pick="${target}" aria-haspopup="dialog"><i></i><span></span></button>`;

function slider(key, label, min, max, step) {
  return `<div class="tt-slider"><label for="tt-${key}">${esc(label)}</label>
    <input type="range" id="tt-${key}" data-k="${key}" min="${min}" max="${max}" step="${step}"><output data-o="${key}"></output></div>`;
}

function roleBlock(role) {
  const id = role.id;
  const f = role.id === 'bubble' ? FONTS.phone : FONTS[role.font];
  return `<div class="tt-role" data-panel="${id}">
    <button type="button" class="tt-head" data-toggle="${id}" aria-expanded="false"><span class="tt-name">${esc(role.label)}</span><span class="tt-sum" data-sum="${id}"></span><span class="tt-chev"></span></button>
    <div class="tt-body">
      <p class="tt-note">${esc(role.use)} · ${esc(UI.groupNote(RULES.filter((e) => e.role === id).length))}</p>
      <div class="tt-slider tt-crow"><span class="tt-lbl">${esc(UI.colour)}</span>${swatchBtn(`role:${id}`)}</div>
      ${id === 'bubble' ? `<div class="tt-row"><span class="tt-note">${esc(UI.bubbleFont)}</span><span class="tt-seg">
        <button type="button" class="tt-chip" data-phone="0">${esc(UI.karla)}</button><button type="button" class="tt-chip" data-phone="1">${esc(UI.phoneFont)}</button></span></div>` : ''}
      ${slider(`${id}.weight`, UI.weight, Math.min(f.min, FONTS.body.min), Math.max(f.max, FONTS.body.max), WEIGHT_STEP)}
      ${slider(`${id}.size`, UI.size, RANGES.size[0], RANGES.size[1], 1)}
      ${role.font === 'head' ? `<p class="tt-note" data-app="${id}"></p>` : ''}
      ${slider(`${id}.lh`, UI.lh, ...RANGES.lh)}
      ${slider(`${id}.ls`, UI.ls, ...RANGES.ls)}
      <div class="tt-row">${CASES.map((c) => `<button type="button" class="tt-chip" data-case="${id}" data-v="${c.id}">${esc(c.label)}</button>`).join('')}
        <button type="button" class="tt-btn" data-reset="${id}">${esc(UI.resetRole)}</button></div>
    </div>
  </div>`;
}

function coloursBlock() {
  return `<div class="tt-role" data-panel="${COLOURS_ID}">
    <button type="button" class="tt-head" data-toggle="${COLOURS_ID}" aria-expanded="false"><span class="tt-name">${esc(UI.colours)}</span><span class="tt-sum" data-sum="${COLOURS_ID}"></span><span class="tt-chev"></span></button>
    <div class="tt-body">
      <div class="tt-row"><span class="tt-note">${esc(UI.theme)}</span>${THEMES.map((t) => `<button type="button" class="tt-chip" data-theme="${t.id}">${esc(t.label)}</button>`).join('')}</div>
      ${SURFACES.map((s) => `<div class="tt-slider tt-crow"><span class="tt-lbl">${esc(s.label)}</span>${swatchBtn(`surface:${s.id}`)}</div>`).join('')}
    </div>
  </div>`;
}

function buildPanel() {
  const panel = document.createElement('aside');
  panel.id = 'ttPanel';
  panel.className = 'tt-panel';
  panel.setAttribute('aria-label', UI.title);
  panel.innerHTML = `<div class="tt-top"><div><h2>${esc(UI.title)}</h2><p>${esc(UI.sub)}</p></div>
      <button type="button" class="tt-x" data-close-panel aria-label="${esc(UI.closePanel)}"></button></div>
    <div class="tt-scroll">
      <div class="tt-group">
        <div class="tt-row"><span class="tt-seg"><button type="button" class="tt-chip" data-view="built">${esc(UI.compare.built)}</button><button type="button" class="tt-chip" data-view="mine">${esc(UI.compare.mine)}</button></span>
          <button type="button" class="tt-btn" data-spec>${esc(UI.spec)}</button><button type="button" class="tt-btn" data-reset-all>${esc(UI.reset)}</button></div>
        <div class="tt-row"><button type="button" class="tt-chip" data-pickmode>${esc(UI.pick)}</button></div>
        <div class="tt-row"><span class="tt-note">${esc(UI.export)}</span>${Object.entries(UI.exports).map(([k, v]) => `<button type="button" class="tt-btn" data-export="${k}">${esc(v)}</button>`).join('')}
          <button type="button" class="tt-btn" data-load>${esc(UI.load)}</button></div>
      </div>
      <div class="tt-roles">${coloursBlock()}${ROLES.map(roleBlock).join('')}</div>
    </div>`;
  document.body.append(panel);
  const pop = document.createElement('div');
  pop.id = 'ttPicker';
  pop.className = 'tt-picker';
  pop.hidden = true;
  pop.setAttribute('role', 'dialog');
  document.body.append(pop);
  const dlg = document.createElement('dialog');
  dlg.id = 'ttDialog';
  dlg.className = 'tt-dialog';
  document.body.append(dlg);
  const rig = $('#rig');
  if (rig) {
    const b = document.createElement('button');
    b.id = 'ttRig';
    b.type = 'button';
    b.textContent = UI.rigButton;
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-controls', 'ttPanel');
    rig.insertBefore(b, rig.querySelector('button'));
  }
}

function getColour(target) {
  const [kind, id] = target.split(':');
  return kind === 'role' ? state.roles[id].colour : state.surfaces[id];
}

function themeMatch() {
  return THEMES.find((th) => {
    const surfaces = { ...defaultSurfaces(), ...(th.surfaces || {}) };
    return SURFACES.every((s) => surfaces[s.id].toLowerCase() === state.surfaces[s.id].toLowerCase())
      && ROLES.every((r) => (th.roles?.[r.id] ?? r.colour).toLowerCase() === state.roles[r.id].colour.toLowerCase());
  })?.id;
}

function sync() {
  for (const b of $$('[data-view]')) b.setAttribute('aria-pressed', String(b.dataset.view === state.view));
  $('[data-pickmode]').setAttribute('aria-pressed', String(state.pick));
  $('[data-pickmode]').textContent = state.pick ? UI.pickOn : UI.pick;
  for (const role of ROLES) {
    const r = state.roles[role.id];
    const set = (k, v, out) => { $(`[data-k="${role.id}.${k}"]`).value = v; $(`[data-o="${role.id}.${k}"]`).textContent = out; };
    set('weight', r.weight, weightLabel(r.weight));
    set('size', r.size, `${r.size} px`);
    set('lh', r.lh, r.lh.toFixed(2));
    set('ls', r.ls, fmtLs(r.ls));
    const app = $(`[data-app="${role.id}"]`);
    if (app) app.innerHTML = `${esc(UI.appSize)} <b>${Math.round(r.size * ERODE_ADJUST)}&nbsp;px</b> · ${esc(UI.erodeNote)}`;
    for (const c of $$(`[data-case="${role.id}"]`)) c.setAttribute('aria-pressed', String(c.dataset.v === r.case));
    if (role.id === 'bubble') for (const c of $$('[data-phone]')) c.setAttribute('aria-pressed', String((c.dataset.phone === '1') === r.phoneFont));
    const changed = !same(r, roleDefault(role)) || r.colour.toLowerCase() !== role.colour.toLowerCase();
    $(`[data-sum="${role.id}"]`).textContent = `${r.weight} · ${r.size}${changed ? ' · edited' : ''}`;
  }
  for (const b of $$('[data-pick]')) {
    const hex = getColour(b.dataset.pick);
    $('i', b).style.background = hex;
    $('span', b).textContent = `${swatchName(hex)} ${hex.toUpperCase()}`;
  }
  const theme = themeMatch();
  for (const b of $$('[data-theme]')) b.setAttribute('aria-pressed', String(b.dataset.theme === theme));
  $(`[data-sum="${COLOURS_ID}"]`).textContent = theme ? THEMES.find((x) => x.id === theme).label : UI.custom;
  for (const p of $$('.tt-role')) {
    const open = p.dataset.panel === state.open;
    p.classList.toggle('open', open);
    $('.tt-head', p).setAttribute('aria-expanded', String(open));
  }
}

function refresh() {
  sync();
  paintApp();
  save();
}

function update() {
  state.view = 'mine';
  refresh();
}

// ---------- Colour picker ----------
let pickerTarget = '';
function openPicker(btn) {
  const pop = $('#ttPicker');
  pickerTarget = btn.dataset.pick;
  const cur = getColour(pickerTarget).toLowerCase();
  pop.innerHTML = `<div class="tt-swgrid">${PALETTE.map((p) => `<button type="button" class="tt-sw" data-hex="${p.hex}" title="${esc(p.name)} ${p.hex}" aria-label="${esc(p.name)}" aria-pressed="${p.hex.toLowerCase() === cur}" style="--c:${p.hex}"></button>`).join('')}</div>
    <div class="tt-row"><label class="tt-custom">${esc(UI.custom)} <input type="color" value="${cur}" data-custom></label><input class="tt-hex" data-hexin value="${cur.toUpperCase()}" maxlength="7" spellcheck="false" aria-label="Hex"></div>`;
  pop.hidden = false;
  const r = btn.getBoundingClientRect();
  const left = Math.max(8, Math.min(innerWidth - pop.offsetWidth - 8, r.left));
  const top = r.bottom + 6 + pop.offsetHeight > innerHeight ? Math.max(8, r.top - pop.offsetHeight - 6) : r.bottom + 6;
  pop.style.left = `${left}px`;
  pop.style.top = `${top}px`;
}

function closePicker() {
  $('#ttPicker').hidden = true;
  pickerTarget = '';
}

function setColour(target, hex) {
  const [kind, id] = target.split(':');
  if (kind === 'role') state.roles[id].colour = hex;
  else state.surfaces[id] = hex;
  update();
}

// ---------- Export / load ----------
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function exportText(kind) {
  const list = ROLES.map((role) => {
    const r = state.roles[role.id];
    const f = fontFor(role, r);
    return { role, r, font: f, appSize: role.font === 'head' ? Math.round(r.size * ERODE_ADJUST) : r.size, linePx: Math.round(r.size * r.lh), lsPx: round(r.ls * r.size), colourName: swatchName(r.colour) };
  });
  const surf = SURFACES.map((s) => ({ s, hex: state.surfaces[s.id].toUpperCase(), name: swatchName(state.surfaces[s.id]) }));
  if (kind === 'json') return JSON.stringify({ ...snapshot(), note: `Erode app size = size × ${ERODE_ADJUST}` }, null, 2);
  if (kind === 'table') {
    const rows = list.map((x) => `| ${x.role.label} | ${x.font.name}${x.role.italic ? ' Italic' : ''} ${WEIGHT_NAMES[x.r.weight] ?? x.r.weight} | ${x.r.size} / ${x.linePx} | ${x.lsPx.toFixed(2)} | ${CASES.find((c) => c.id === x.r.case).label} | ${x.colourName} ${x.r.colour.toUpperCase()} | ${x.appSize} | ${x.role.use} |`);
    const srows = surf.map((x) => `| ${x.s.label} | ${x.name} ${x.hex} |`);
    return `| Style | Font | Size / line | Spacing | Case | Colour | App size | Used for |\n|---|---|---|---|---|---|---|---|\n${rows.join('\n')}\n\n| Surface | Colour |\n|---|---|\n${srows.join('\n')}\n\nSizes in px as drawn on the brand page (the main style of each role). Erode app size = size × ${ERODE_ADJUST}.`;
  }
  const vars = list.map((x) => {
    const k = kebab(x.role.id);
    return `  /* ${x.role.label} */\n  --${k}-family: ${x.font.stack};\n  --${k}-weight: ${x.r.weight};\n  --${k}-size: ${x.r.size}px;\n  --${k}-app-size: ${x.appSize}px;\n  --${k}-line-height: ${x.r.lh};\n  --${k}-letter-spacing: ${x.r.ls}em;\n  --${k}-colour: ${x.r.colour.toUpperCase()};`;
  }).join('\n\n');
  const sv = surf.map((x) => `  --colour-${kebab(x.s.id)}: ${x.hex}; /* ${x.s.label}: ${x.name} */`).join('\n');
  return `/* Story City type and colour. Erode app size = size × ${ERODE_ADJUST}. */\n:root {\n${sv}\n\n${vars}\n}`;
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

function openExport(kind) {
  const dlg = $('#ttDialog');
  const text = exportText(kind);
  dlg.innerHTML = `<div class="tt-dlg"><h2>${esc(UI.exportTitles[kind])}</h2><textarea readonly spellcheck="false">${esc(text)}</textarea>
    <div class="tt-row"><button type="button" class="tt-btn tt-primary" data-copy>${esc(UI.copy)}</button><button type="button" class="tt-btn" data-dclose>${esc(UI.close)}</button></div></div>`;
  $('[data-copy]', dlg).onclick = async (e) => { if (await copyText(text)) e.target.textContent = UI.copied; };
  $('[data-dclose]', dlg).onclick = () => dlg.close();
  dlg.showModal();
}

function openLoad() {
  const dlg = $('#ttDialog');
  dlg.innerHTML = `<div class="tt-dlg"><h2>${esc(UI.loadTitle)}</h2><textarea spellcheck="false" data-loadtext></textarea><p class="tt-note" data-loaderr hidden>${esc(UI.loadBad)}</p>
    <div class="tt-row"><button type="button" class="tt-btn tt-primary" data-loadgo>${esc(UI.loadGo)}</button><button type="button" class="tt-btn" data-dclose>${esc(UI.close)}</button></div></div>`;
  $('[data-loadgo]', dlg).onclick = () => {
    let ok = false;
    try { ok = load(JSON.parse($('[data-loadtext]', dlg).value)); } catch { ok = false; }
    if (!ok) { $('[data-loaderr]', dlg).hidden = false; return; }
    dlg.close();
    update();
  };
  $('[data-dclose]', dlg).onclick = () => dlg.close();
  dlg.showModal();
}

// ---------- Open / close ----------
function setOpen(open) {
  document.body.classList.toggle('tt-open', open);
  $('#ttRig')?.setAttribute('aria-pressed', String(open));
  if (!open) closePicker();
}

function roleForElement(el) {
  for (let node = el; node && node.id !== 'phone'; node = node.parentElement) {
    for (let i = RULES.length - 1; i >= 0; i--) {
      if (RULES[i].role !== 'body' && RULES[i].parts.some((p) => { try { return node.matches(p); } catch { return false; } })) return RULES[i].role;
    }
  }
  return 'body';
}

function bind() {
  const panel = $('#ttPanel');
  panel.addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    const [id, prop] = k.split('.');
    state.roles[id][prop] = Number(e.target.value);
    update();
  });
  panel.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const d = b.dataset;
    if (d.pick) { if (pickerTarget === d.pick) closePicker(); else openPicker(b); return; }
    if (d.toggle) { state.open = state.open === d.toggle ? '' : d.toggle; sync(); return; }
    if (d.theme) {
      const th = THEMES.find((x) => x.id === d.theme);
      state.surfaces = { ...defaultSurfaces(), ...(th.surfaces || {}) };
      for (const role of ROLES) state.roles[role.id].colour = th.roles?.[role.id] ?? role.colour;
      update();
    } else if (d.case) { state.roles[d.case].case = d.v; update(); }
    else if (d.phone) { state.roles.bubble.phoneFont = d.phone === '1'; update(); }
    else if (d.reset) { state.roles[d.reset] = roleDefault(ROLE_BY_ID[d.reset]); update(); }
    else if (d.view) { state.view = d.view; refresh(); }
    else if ('spec' in d) { for (const [id, v] of Object.entries(SPEC)) Object.assign(state.roles[id], v); update(); }
    else if ('resetAll' in d) { state.roles = defaultRoles(); state.surfaces = defaultSurfaces(); update(); }
    else if ('pickmode' in d) { state.pick = !state.pick; document.body.classList.toggle('tt-pick', state.pick); refresh(); }
    else if (d.export) openExport(d.export);
    else if ('load' in d) openLoad();
    else if ('closePanel' in d) setOpen(false);
  });
  $('#ttRig')?.addEventListener('click', () => setOpen(!document.body.classList.contains('tt-open')));
  const pop = $('#ttPicker');
  pop.addEventListener('click', (e) => {
    const sw = e.target.closest('[data-hex]');
    if (!sw || !pickerTarget) return;
    setColour(pickerTarget, sw.dataset.hex);
    closePicker();
  });
  pop.addEventListener('input', (e) => {
    if (!pickerTarget) return;
    if (e.target.matches('[data-custom]')) { setColour(pickerTarget, e.target.value); $('[data-hexin]', pop).value = e.target.value.toUpperCase(); }
    else if (e.target.matches('[data-hexin]')) {
      const v = e.target.value.trim();
      const hex = v.startsWith('#') ? v : `#${v}`;
      if (HEX_RE.test(hex)) { setColour(pickerTarget, hex); $('[data-custom]', pop).value = hex.toLowerCase(); }
    }
  });
  document.addEventListener('pointerdown', (e) => {
    if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('[data-pick]')) closePicker();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) closePicker(); });
  $('.tt-scroll', panel).addEventListener('scroll', () => { if (!pop.hidden) closePicker(); }, { passive: true });
  // Pick mode: the next tap in the phone opens that text's role instead of using the app.
  $(PHONE).addEventListener('click', (e) => {
    if (!state.pick) return;
    e.preventDefault();
    e.stopPropagation();
    state.open = roleForElement(e.target);
    state.pick = false;
    document.body.classList.remove('tt-pick');
    setOpen(true);
    refresh();
    $(`[data-panel="${state.open}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, true);
}

function init() {
  RULES = readRules();
  PICK_PARTS = RULES.filter((e) => e.role !== 'body').flatMap((e) => e.parts);
  document.head.append(styleEl);
  restore();
  buildPanel();
  bind();
  refresh();
  setOpen(matchMedia(WIDE_QUERY).matches && !matchMedia(MOBILE_QUERY).matches);
}

if (document.readyState === 'complete') init();
else addEventListener('load', init, { once: true });
