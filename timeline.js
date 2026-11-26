// Company timeline tab (Melissa, 20 Nov 2026): key dates like posts and campaigns, feature launches and
// app releases, so the team can see what moved the numbers.
// - timeline.json: dates gathered from PostHog (app releases) and Notion.
// - Dates people add are saved in the hub database under slug "timeline" (key dates only: KPI numbers
//   never go here, because this site and its database are public).
import * as store from './hub/store.js';

const TYPES = [
  ['release', 'App release', '#5B8CFF'],
  ['feature', 'Feature launch', '#00CD9D'],
  ['marketing', 'Post or campaign', '#DA82ED'],
  ['milestone', 'Milestone', '#F5B82E'],
  ['other', 'Other', '#A493D6'],
];
const typeOf = (id) => TYPES.find((t) => t[0] === id) || TYPES[4];
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const fmt = (d, o) => new Date(d + 'T12:00').toLocaleDateString('en', o);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const validDate = (d) => typeof d === 'string' && DATE.test(d) && !Number.isNaN(new Date(d + 'T12:00').getTime());
// Anyone can write to the database directly, so a saved link could be javascript: or similar.
const safeUrl = (u) => { try { const p = new URL(u); return p.protocol === 'https:' || p.protocol === 'http:' ? p.href : ''; } catch (e) { return ''; } };
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

// Only the live site talks to the database, so local copies and tests never write to it.
const LIVE = location.pathname.includes('/experiments/');
// Two test entries saved by accident on 20 Nov before that guard existed; Brett has been asked to delete them.
const HIDE = new Set(['mGr29WJndJPJnQwYLHOj', 'qNcCpSfdrROhsV1PL51J']);

let seeded = [];
let added = []; // { id, uid, ...entry }
let ctx = null;
let me = null;
let show = new Set(TYPES.map((t) => t[0]));

export async function initTimeline() {
  const root = $('panel-timeline');
  if (!root) return;
  // Ids come from the date and title, not the list position, so a #tl- link survives new dates being added.
  const seen = new Set();
  seeded = ((await store.loadJson('timeline.json')) || []).map((e) => {
    let id = `s-${e.date}-${slug(e.title)}`;
    while (seen.has(id)) id += '-';
    seen.add(id);
    return { ...e, id, seeded: true };
  });
  buildShell(root);
  render();
  try {
    ctx = LIVE ? await store.init() : null;
    if (ctx?.enabled) {
      me = store.user()?.uid || null;
      store.onUser((u) => { me = u?.uid || null; render(); });
      store.watchComments('timeline', (docs) => {
        added = docs.filter((d) => !HIDE.has(d.id)).map((d) => { try { const v = JSON.parse(d.text); return v.deleted ? null : { ...v, id: d.id, uid: d.author?.uid, by: v.by || d.author?.name }; } catch (e) { return null; } }).filter(Boolean);
        render();
      });
    }
  } catch (e) { /* the timeline still shows the saved dates */ }
}

function buildShell(root) {
  root.replaceChildren();
  root.append(el('p', 'sub', 'Key dates: posts and campaigns, feature launches, app releases and milestones. Add one, so we can see what moved the numbers.'));
  const bar = el('div', 'tl-bar');
  const add = el('button', 'tl-add', '+ Add a key date');
  add.type = 'button';
  add.id = 'tlAddBtn';
  add.addEventListener('click', () => { $('tlForm').hidden = !$('tlForm').hidden; if (!$('tlForm').hidden) $('tlTitle').focus(); });
  const chips = el('div', 'tl-types');
  chips.id = 'tlTypes';
  bar.append(add, chips);
  root.append(bar, form(), el('div', 'tl-strip'), kpiCard(), el('div', 'tl-list'));
  root.querySelector('.tl-strip').id = 'tlStrip';
  root.querySelector('.tl-list').id = 'tlList';
}

function form() {
  const f = el('form', 'tl-form');
  f.id = 'tlForm';
  f.hidden = true;
  const field = (label, input) => { const l = el('label', 'tl-field'); l.append(el('span', null, label), input); return l; };
  const date = Object.assign(el('input'), { type: 'date', id: 'tlDate', required: true, value: localToday() });
  const type = el('select'); type.id = 'tlType';
  for (const [id, label] of TYPES) { const o = el('option', null, label); o.value = id; type.append(o); }
  const title = Object.assign(el('input'), { id: 'tlTitle', required: true, maxLength: 80, placeholder: 'e.g. Halloween ghost tour ads went live' });
  const link = Object.assign(el('input'), { id: 'tlLink', type: 'url', maxLength: 300, placeholder: 'https:// (optional)' });
  const note = Object.assign(el('input'), { id: 'tlNote', maxLength: 200, placeholder: 'One line (optional)' });
  const by = Object.assign(el('input'), { id: 'tlBy', maxLength: 40, placeholder: 'Your name' });
  try { by.value = localStorage.getItem('sc-name') || ''; } catch (e) { /* fine */ }
  const save = el('button', 'tl-save', 'Add to the timeline'); save.type = 'submit';
  const msg = el('p', 'tl-msg'); msg.id = 'tlMsg';
  f.append(field('Date', date), field('Type', type), field('What happened', title), field('Link', link), field('Note', note), field('Your name', by), save, msg);
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const entry = { kind: 'timeline', date: date.value, type: type.value, title: title.value.trim(), link: link.value.trim(), note: note.value.trim(), by: by.value.trim() || 'Someone', ts: Date.now() };
    if (!entry.title || !entry.date) return;
    try { localStorage.setItem('sc-name', entry.by); } catch (err) { /* fine */ }
    if (!ctx?.enabled) { msg.textContent = 'Saving only works on the experiments site.'; return; }
    try {
      const u = store.user();
      await store.addComment({ slug: 'timeline', text: JSON.stringify(entry), url: null, x: null, y: null, sha: null, screenshot: null, author: { uid: u.uid, name: entry.by.slice(0, 60), guest: !u.email } });
      title.value = ''; link.value = ''; note.value = '';
      msg.textContent = 'Added. Thanks!';
      f.hidden = true;
    } catch (err) { msg.textContent = 'Couldn’t save. Check your connection and try again.'; }
  });
  return f;
}

// The KPI graph waits for a private home: this site and its database are public (asked Brett, 20 Nov).
function kpiCard() {
  const c = el('section', 'tl-kpi');
  c.append(el('h3', null, 'Key numbers'), el('p', null, 'A running graph of key KPIs goes here, with these dates marked on it. It switches on once the numbers have a private home, because this site is public. Brett has been asked what’s needed.'));
  return c;
}

const all = () => [...seeded, ...added].filter((e) => validDate(e.date) && e.title).sort((a, b) => b.date.localeCompare(a.date) || (b.ts || 0) - (a.ts || 0));

function render() {
  if (!$('tlList')) return;
  const list = all();
  // type chips (filters)
  const chips = $('tlTypes');
  chips.replaceChildren();
  for (const [id, label, colour] of TYPES) {
    const n = list.filter((e) => e.type === id).length;
    if (!n) continue;
    const b = el('button', 'tl-chip');
    b.type = 'button';
    b.dataset.type = id;
    b.setAttribute('aria-pressed', String(show.has(id)));
    const dot = el('i'); dot.style.background = colour;
    b.append(dot, `${label} `, el('span', 'n', String(n)));
    b.addEventListener('click', () => { if (show.has(id) && show.size > 1) show.delete(id); else show.add(id); render(); });
    chips.append(b);
  }
  const shown = list.filter((e) => show.has(typeOf(e.type)[0]));
  drawStrip(shown);
  // the list, newest first, by month
  const box = $('tlList');
  box.replaceChildren();
  const today = localToday();
  let month = '';
  let ul = null;
  for (const e of shown) {
    const m = e.date.slice(0, 7);
    if (m !== month) { month = m; box.append(el('h3', 'tl-month', fmt(e.date, { month: 'long', year: 'numeric' }))); ul = el('ul', 'tl-items'); box.append(ul); }
    const li = el('li', 'tl-item');
    li.id = 'tl-' + e.id;
    const [, label, colour] = typeOf(e.type);
    li.style.setProperty('--c', colour);
    const when = el('span', 'tl-date', fmt(e.date, { month: 'short', day: 'numeric' }) + (e.approx ? ' ≈' : ''));
    const body = el('div', 'tl-body');
    const link = e.link ? safeUrl(e.link) : '';
    const t = link ? Object.assign(el('a', 'tl-title', e.title), { href: link, target: '_blank', rel: 'noopener' }) : el('span', 'tl-title', e.title);
    body.append(t);
    if (e.note) body.append(el('p', 'tl-note', e.note));
    const meta = el('p', 'tl-meta');
    meta.append(el('span', 'tl-type', label));
    if (e.date > today) meta.append(' · coming up');
    if (e.by) meta.append(` · added by ${e.by}`);
    if (e.source) { meta.append(' · '); meta.append(Object.assign(el('a', null, 'source'), { href: e.source, target: '_blank', rel: 'noopener' })); }
    if (!e.seeded && me && e.uid === me) {
      const x = el('button', 'tl-remove', 'Remove'); x.type = 'button';
      x.addEventListener('click', async () => {
        const { fs, db } = ctx;
        const { id, uid, seeded: s, ...rest } = e;
        try { await fs.updateDoc(fs.doc(db, 'comments', id), { text: JSON.stringify({ ...rest, deleted: true }) }); } catch (err) { /* stays */ }
      });
      meta.append(' · ', x);
    }
    body.append(meta);
    li.append(when, body);
    ul.append(li);
  }
  if (!shown.length) box.append(el('p', 'empty', 'No dates yet.'));
}

// A strip of months with a dot per date; tap a dot to jump to it in the list.
function drawStrip(list) {
  const strip = $('tlStrip');
  strip.replaceChildren();
  if (!list.length) return;
  const t = (d) => new Date(d + 'T12:00').getTime();
  const now = Date.now();
  const end = Math.max(now, ...list.map((e) => t(e.date)));
  const start = Math.min(...list.map((e) => t(e.date)));
  const first = new Date(start); first.setDate(1);
  const span = end - first.getTime() || 1;
  const x = (ms) => ((ms - first.getTime()) / span) * 100;
  const axis = el('div', 'tl-axis');
  for (let d = new Date(first); d.getTime() <= end; d.setMonth(d.getMonth() + 1)) {
    const m = el('span', 'tl-tick', d.toLocaleDateString('en', { month: 'short' }));
    m.style.left = x(d.getTime()) + '%';
    axis.append(m);
  }
  const lane = el('div', 'tl-lane');
  const rows = { release: 0, feature: 1, marketing: 2, milestone: 3, other: 3 };
  for (const e of list) {
    const d = el('a', 'tl-dot');
    d.href = '#tl-' + e.id;
    d.style.left = x(t(e.date)) + '%';
    d.style.top = 8 + rows[typeOf(e.type)[0]] * 14 + 'px';
    d.style.background = typeOf(e.type)[2];
    d.title = `${fmt(e.date, { month: 'short', day: 'numeric' })}: ${e.title}`;
    d.setAttribute('aria-label', d.title);
    d.addEventListener('click', (ev) => { ev.preventDefault(); const li = $('tl-' + e.id); li?.scrollIntoView({ block: 'center', behavior: 'smooth' }); li?.classList.add('flash'); setTimeout(() => li?.classList.remove('flash'), 1600); });
    lane.append(d);
  }
  const today = el('span', 'tl-today', 'Today');
  today.style.left = x(now) + '%';
  lane.append(today);
  strip.append(lane, axis);
}
