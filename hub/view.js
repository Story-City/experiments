import * as store from './store.js';
import { stageOf, normalizeSpec, specMarkdown, notionUrl, applyStatusChanges, STATUS_SLUG } from './handoff.js';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const slug = params.get('e');
const root = new URL('../', import.meta.url);
const PHONE_MQ = '(max-width: 820px)';
const COPIED_MS = 1800;
const STAGE_KEYS_WITH_TABS = { review: true, ready: true, built: true };

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

const [manifest, notion, version] = await Promise.all([
  store.loadJson(new URL('experiments.json', root)),
  store.loadJson(new URL('hub/notion.json', root)),
  store.loadJson(new URL('hub/version.json', root)),
]);
const entry = (manifest || []).find(e => e.slug === slug);
if (!entry) {
  document.body.replaceChildren(el('p', null, 'Experiment not found.'));
  throw new Error('unknown experiment');
}

const frame = $('frame');
const overlay = $('overlay');
const task = notion?.tasks?.[slug];
const currentSha = version?.experiments?.[slug]?.sha || version?.sha || null;
let comments = [];
let showResolved = false;
let armed = false;
let focusId = null;

document.title = `${entry.title} · Story City`;
$('title').textContent = entry.title;
// "frame": "wide" in experiments.json: a wider frame for pages that aren't phone-sized (e.g. a library with a side panel)
if (entry.frame === 'wide') document.body.classList.add('wide-frame');
const startPath = params.get('u') || entry.path;
frame.src = new URL(startPath, root).href;
$('direct').href = new URL(startPath, root).href;

// "tabs": [{ label, path }] in experiments.json: an experiment's pages as tabs at the top of
// the main column (in the top bar on phones). The tab follows the page, even when
// the page links to another one.
const tabs = Array.isArray(entry.tabs) ? entry.tabs.filter(t => t?.label && t?.path) : [];
const bare = p => norm(p).replace(/[?#].*$/, '');
function tabFor(url) {
  const here = bare(url);
  return tabs.find(t => bare(t.path) === here)
    || [...tabs].sort((a, b) => bare(b.path).length - bare(a.path).length).find(t => here.startsWith(bare(t.path)))
    || null;
}
function markTab() {
  const on = tabFor(frameUrl());
  document.querySelectorAll('[data-tabs] button').forEach(b => {
    const isOn = !!on && b.dataset.path === on.path;
    b.setAttribute('aria-selected', String(isOn));
    b.tabIndex = isOn ? 0 : -1;
  });
}
if (tabs.length > 1) {
  document.body.classList.add('has-tabs');
  for (const nav of document.querySelectorAll('[data-tabs]')) {
    nav.setAttribute('role', 'tablist');
    for (const t of tabs) {
      const b = el('button', null, t.label);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.path = t.path;
      b.addEventListener('click', () => {
        frame.src = new URL(t.path, root).href;
        $('direct').href = frame.src;
        const q = new URLSearchParams(location.search);
        if (t.path === entry.path) q.delete('u'); else q.set('u', t.path);
        history.replaceState(null, '', `${location.pathname}?${q}`);
        document.body.classList.remove('open');
      });
      nav.append(b);
    }
    nav.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const bs = [...nav.querySelectorAll('button')];
      const i = bs.findIndex(b => b.getAttribute('aria-selected') === 'true');
      const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length];
      n.click(); n.focus();
    });
    nav.hidden = false;
  }
  markTab();
}

if (task?.status) {
  $('status').textContent = task.status;
  $('status').hidden = false;
}

const stage = stageOf(entry);
function showStageBadge(st) {
  const b = $('stage');
  b.hidden = !st;
  if (!st) return;
  b.textContent = st.label;
  b.dataset.stage = st.key;
  if (st.blocked) b.dataset.blocked = 'true'; else delete b.dataset.blocked;
}
showStageBadge(stage);

// "spec": "<folder>/spec.json" in experiments.json: the UX spec devs build from, in a Spec tab beside the questions.
const spec = entry.spec ? normalizeSpec(await store.loadJson(new URL(entry.spec, root))) : null;
const inHandoff = !!spec || !!STAGE_KEYS_WITH_TABS[stage?.key];
const panelTabs = [...document.querySelectorAll('#panel-tabs [role="tab"]')];
function showPane(name, focus) {
  for (const b of panelTabs) {
    const on = b.dataset.pane === name;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
    $(b.getAttribute('aria-controls')).hidden = !on;
    if (on && focus) b.focus();
  }
  document.body.dataset.pane = name;
}
const ADD_LABEL = inHandoff ? 'Ask a question' : 'Add a comment';
$('pin-mode').textContent = ADD_LABEL;
if (inHandoff) {
  $('compose-title').textContent = 'Question for design';
  $('text').previousSibling.textContent = 'Question ';
}
if (inHandoff) {
  $('panel-title').hidden = true;
  $('panel-tabs').hidden = false;
  $('panel').setAttribute('aria-label', 'Spec and questions for design');
  $('fab').setAttribute('aria-label', 'Open spec and questions');
  for (const b of panelTabs) b.addEventListener('click', () => showPane(b.dataset.pane));
  $('panel-tabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = panelTabs.findIndex(b => b.getAttribute('aria-selected') === 'true');
    showPane(panelTabs[(i + 1) % panelTabs.length].dataset.pane, true);
  });
  renderSpec();
  showPane(params.get('c') || params.get('panel') === 'questions' || !spec ? 'questions' : 'spec');
}

function renderSpec() {
  const box = $('pane-spec');
  box.replaceChildren();
  if (!spec) {
    box.append(el('p', 'spec-empty', 'No spec yet. Design adds one before this is Ready for Dev.'));
    return;
  }
  const top = el('div', 'spec-top');
  const copy = el('button', 'spec-copy', 'Copy spec');
  copy.type = 'button';
  copy.addEventListener('click', async () => {
    const md = specMarkdown(entry, spec, root);
    try {
      await navigator.clipboard.writeText(md);
      copy.textContent = 'Copied';
    } catch {
      copy.textContent = 'Could not copy';
    }
    setTimeout(() => { copy.textContent = 'Copy spec'; }, COPIED_MS);
  });
  top.append(copy);
  if (stage?.blocked) top.append(el('p', 'spec-warn', 'Ready for Dev needs its Notion task linked first.'));
  box.append(top);
  if (spec.final) {
    const p = el('p', 'spec-final');
    p.append(el('strong', null, 'Final version: '), spec.final);
    box.append(p);
  }
  if (spec.summary) box.append(el('p', 'spec-summary', spec.summary));

  for (const f of spec.flows) {
    const sec = section(f.title);
    if (f.show) {
      const go = el('button', 'spec-show', 'Show me');
      go.type = 'button';
      go.addEventListener('click', () => {
        frame.src = new URL(f.show, root).href;
        $('direct').href = frame.src;
        if (matchMedia(PHONE_MQ).matches) document.body.classList.remove('open');
      });
      sec.querySelector('h3').append(go);
    }
    const ol = el('ol', 'spec-rows');
    for (const r of f.rows) {
      const li = el('li');
      li.append(el('div', 'spec-when', r.when), el('div', 'spec-then', r.then));
      if (r.event) li.append(el('code', 'spec-event', r.event));
      ol.append(li);
    }
    sec.append(ol);
    box.append(sec);
  }

  if (spec.back.length) {
    const sec = section('Back');
    const ol = el('ol', 'spec-rows');
    for (const b of spec.back) {
      const li = el('li');
      li.append(el('div', 'spec-when', b.from), el('div', 'spec-then', b.then));
      ol.append(li);
    }
    sec.append(ol);
    box.append(sec);
  }

  if (spec.events.length) {
    const sec = section('Analytics events');
    const ol = el('ol', 'spec-rows');
    for (const ev of spec.events) {
      const li = el('li');
      const h = el('div', 'spec-when');
      h.append(el('code', 'spec-event', ev.name), ' ', el('span', 'spec-tag', ev.status === 'existing' ? 'exists in app' : 'new'));
      li.append(h);
      if (ev.when) li.append(el('div', 'spec-then', ev.when));
      if (ev.props) li.append(el('div', 'spec-props', ev.props));
      ol.append(li);
    }
    sec.append(ol);
    box.append(sec);
  }

  if (spec.edgeCases.length) box.append(bullets('Edge cases', spec.edgeCases));
  if (spec.notes.length) box.append(bullets('Notes', spec.notes));

  if (spec.assets.length) {
    const sec = section('Download assets');
    const ul = el('ul', 'spec-assets');
    for (const a of spec.assets) {
      const li = el('li');
      const link = el('a', null, a.label);
      link.href = new URL(a.file, root).href;
      link.download = a.file.split('/').pop();
      li.append(link);
      if (a.note) li.append(el('span', 'spec-note', a.note));
      ul.append(li);
    }
    sec.append(ul);
    box.append(sec);
  }
}

function section(title) {
  const sec = el('section', 'spec-sec');
  sec.append(el('h3', null, title));
  return sec;
}

function bullets(title, items) {
  const sec = section(title);
  const ul = el('ul', 'spec-list');
  for (const x of items) ul.append(el('li', null, x));
  sec.append(ul);
  return sec;
}

const links = $('links');
if (entry.notionPageId) {
  const a = el('a', null, 'Notion task');
  a.href = task?.url || notionUrl(entry);
  a.target = '_blank';
  a.rel = 'noopener';
  links.append(a);
}
if (entry.jira) {
  const a = el('a', null, entry.jira);
  a.href = `https://storycity.atlassian.net/browse/${entry.jira}`;
  a.target = '_blank';
  a.rel = 'noopener';
  links.append(a);
}

const when = d => (d?.toDate ? d.toDate() : d ? new Date(d) : null)?.toLocaleDateString('en', { month: 'short', day: 'numeric' }) || '';

if (task?.comments?.length) {
  const box = $('notion');
  box.append(el('div', null, 'From the Notion task'));
  for (const c of task.comments.filter(c => !c.fromHub)) {
    const q = el('blockquote');
    q.append(el('strong', null, c.author || 'Notion'), ` ${c.text}`);
    box.append(q);
  }
}

function norm(url) {
  try {
    const u = new URL(url, root);
    let p = u.pathname.slice(root.pathname.length).replace(/index\.html$/, '');
    return p + u.search;
  } catch {
    return url;
  }
}

function frameUrl() {
  try {
    const l = frame.contentWindow.location;
    return norm(l.href);
  } catch {
    return norm(startPath);
  }
}

function sameOriginDoc() {
  try {
    return frame.contentDocument || null;
  } catch {
    return null;
  }
}

function render() {
  const here = frameUrl();
  const roots = comments.filter(c => !c.parentId);
  const visible = roots.filter(c => showResolved || c.status !== 'resolved');
  const open = roots.filter(c => c.status !== 'resolved').length;
  $('open-count').textContent = open ? `(${open})` : '';
  $('fab-count').textContent = open || '';
  $('q-count').textContent = open ? `(${open})` : '';

  overlay.replaceChildren();
  visible.forEach((c, i) => {
    if (c.x == null || norm(c.url) !== here) return;
    const b = el('button', 'pin', String(roots.indexOf(c) + 1));
    b.type = 'button';
    b.dataset.resolved = String(c.status === 'resolved');
    b.style.left = `${c.x * 100}%`;
    b.style.top = `${c.y * 100}%`;
    b.setAttribute('aria-label', `Comment ${roots.indexOf(c) + 1} by ${c.author?.name}`);
    b.addEventListener('click', () => {
      document.body.classList.add('open');
      if (inHandoff) showPane('questions');
      focusId = c.id;
      renderList();
      $('list').querySelector(`[data-id="${c.id}"]`)?.scrollIntoView({ block: 'center' });
    });
    overlay.append(b);
  });
  overlay.hidden = !armed && !overlay.children.length;
  renderList();
}

function renderList() {
  const here = frameUrl();
  const roots = comments.filter(c => !c.parentId);
  const list = $('list');
  list.replaceChildren();
  const visible = roots.filter(c => showResolved || c.status !== 'resolved');
  if (!visible.length) {
    const li = el('li', null, store.user() ? (inHandoff ? 'No questions yet.' : 'No comments yet.') : '');
    list.append(li);
  }
  for (const c of visible) list.append(commentNode(c, roots.indexOf(c) + 1, here));
}

function commentNode(c, n, here) {
  const li = el('li', 'c');
  li.dataset.id = c.id;
  li.dataset.resolved = String(c.status === 'resolved');
  if (c.id === focusId) li.classList.add('here');

  const head = el('div');
  head.append(el('span', 'who', `${n}. ${c.author?.name || 'Guest'}`), ' ', el('span', 'when', when(c.createdAt)));
  if (c.author?.guest) head.append(' ', el('span', 'tag', 'guest'));
  if (c.source === 'notion') head.append(' ', el('span', 'tag', 'from Notion'));
  if (c.sha && currentSha && c.sha !== currentSha) head.append(' ', el('span', 'tag', 'made on an earlier version'));
  if (c.status === 'resolved') head.append(' ', el('span', 'tag', `resolved${c.resolvedBy ? ` by ${c.resolvedBy}` : ''}`));
  li.append(head);
  if (c.screenshot) {
    const img = el('img');
    img.src = c.screenshot;
    img.alt = 'Screenshot of the comment spot';
    li.append(img);
  }
  li.append(el('p', null, c.text));

  for (const r of comments.filter(r => r.parentId === c.id)) {
    const rep = el('div', 'reply');
    const h = el('div');
    h.append(el('span', 'who', r.author?.name || 'Guest'), ' ', el('span', 'when', when(r.createdAt)));
    rep.append(h, el('p', null, r.text));
    li.append(rep);
  }

  const acts = el('div', 'acts');
  if (c.url && norm(c.url) !== here) {
    const go = el('button', null, 'Go to the spot');
    go.type = 'button';
    go.addEventListener('click', () => {
      frame.src = new URL(c.url, root).href;
      focusId = c.id;
      if (matchMedia(PHONE_MQ).matches) document.body.classList.remove('open');
    });
    acts.append(go);
  }
  const reply = el('button', null, 'Reply');
  reply.type = 'button';
  reply.addEventListener('click', () => {
    if (li.querySelector('form')) return;
    const f = el('form');
    const ta = el('textarea');
    ta.rows = 2;
    ta.maxLength = 2000;
    ta.required = true;
    ta.placeholder = 'Reply';
    const send = el('button', 'primary', 'Send reply');
    f.append(ta, send);
    f.addEventListener('submit', async e => {
      e.preventDefault();
      send.disabled = true;
      await post({ text: ta.value.trim(), parentId: c.id, slug, url: c.url }, send);
    });
    li.append(f);
    ta.focus();
  });
  acts.append(reply);

  if (isTeam()) {
    const res = el('button', null, c.status === 'resolved' ? 'Reopen' : 'Resolve');
    res.type = 'button';
    res.addEventListener('click', () => guard(() => store.setStatus(c.id, c.status === 'resolved' ? 'open' : 'resolved', currentSha)));
    const del = el('button', null, 'Delete');
    del.type = 'button';
    del.addEventListener('click', () => confirm('Delete this comment?') && guard(() => store.removeComment(c.id)));
    acts.append(res, del);
  }
  li.append(acts);
  return li;
}

function isTeam() {
  const u = store.user();
  return !!u && !u.isAnonymous;
}

function notice(msg) {
  $('notice').textContent = msg || '';
  $('notice').hidden = !msg;
}

async function guard(fn) {
  try {
    await fn();
    notice('');
  } catch (e) {
    notice(e.code === 'permission-denied' ? 'Only team members can do that.' : `Something went wrong: ${e.message}`);
  }
}

function displayName() {
  const u = store.user();
  return (u && !u.isAnonymous && u.displayName) || lsGet('hubName') || '';
}

async function post(extra, btn) {
  const u = store.user();
  const name = extra.name || displayName();
  delete extra.name;
  await guard(() => store.addComment({
    ...extra,
    author: { uid: u.uid, name, guest: u.isAnonymous },
    sha: currentSha,
  }));
  if (btn) btn.disabled = false;
}

function renderMe() {
  const me = $('me');
  me.replaceChildren();
  const u = store.user();
  if (!u) return;
  if (u.isAnonymous) {
    me.append(displayName() ? `Commenting as ${displayName()}` : 'Commenting as a guest');
    const b = el('button', null, 'Team sign-in');
    b.type = 'button';
    b.addEventListener('click', () => guard(() => store.signInGoogle()));
    me.append(b);
  } else {
    me.append(`Signed in as ${u.displayName || u.email}`);
  }
}

async function loadHtml2canvas() {
  if (window.html2canvas) return window.html2canvas;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = res;
    s.onerror = rej;
    document.head.append(s);
  });
  return window.html2canvas;
}

async function capture() {
  const doc = sameOriginDoc();
  if (!doc) return null;
  try {
    const h2c = await loadHtml2canvas();
    const w = frame.clientWidth;
    const h = frame.clientHeight;
    const canvas = await h2c(doc.documentElement, {
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,
      x: frame.contentWindow.scrollX,
      y: frame.contentWindow.scrollY,
      scale: 0.5,
      logging: false,
      useCORS: true,
    });
    for (const q of [0.6, 0.45, 0.3]) {
      const data = canvas.toDataURL('image/jpeg', q);
      if (data.length <= 200 * 1024) return data;
    }
  } catch {}
  return null;
}

const dialog = $('compose');
let draft = null;

async function startDraft(x, y) {
  const rect = frame.getBoundingClientRect();
  draft = { x, y, vw: Math.round(rect.width), vh: Math.round(rect.height), url: frameUrl(), screenshot: null };
  $('name').value = displayName();
  $('name').readOnly = isTeam();
  $('text').value = '';
  $('shot').hidden = true;
  $('send').disabled = false;
  dialog.showModal();
  const snap = await capture();
  if (draft && snap) {
    draft.screenshot = snap;
    $('shot').src = snap;
    $('shot').hidden = false;
  }
}

function setArmed(on) {
  armed = on;
  overlay.classList.toggle('armed', on);
  $('pin-mode').setAttribute('aria-pressed', String(on));
  $('pin-mode').textContent = on ? 'Tap the spot…' : ADD_LABEL;
  overlay.hidden = !on && !overlay.children.length;
}

overlay.addEventListener('click', e => {
  if (!armed || e.target !== overlay) return;
  const r = overlay.getBoundingClientRect();
  setArmed(false);
  startDraft((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
});

$('pin-mode').addEventListener('click', () => {
  if (matchMedia(PHONE_MQ).matches) document.body.classList.remove('open');
  setArmed(!armed);
});
$('cancel').addEventListener('click', () => { draft = null; dialog.close(); });
dialog.addEventListener('close', () => { draft = null; });

$('compose-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!draft) return;
  const name = $('name').value.trim();
  const text = $('text').value.trim();
  if (!name || !text) return;
  if (!isTeam()) lsSet('hubName', name);
  $('send').disabled = true;
  const d = draft;
  draft = null;
  dialog.close();
  await post({ name, text, slug, url: d.url, x: d.x, y: d.y, vw: d.vw, vh: d.vh, screenshot: d.screenshot });
  renderMe();
});

$('show-resolved').addEventListener('change', e => { showResolved = e.target.checked; render(); });
$('fab').addEventListener('click', () => document.body.classList.add('open'));
$('close').addEventListener('click', () => document.body.classList.remove('open'));

let lastUrl = '';
const poll = () => {
  const u = frameUrl();
  if (u !== lastUrl) { lastUrl = u; render(); if (tabs.length > 1) markTab(); }
};
frame.addEventListener('load', poll);
setInterval(poll, 500);

try {
  const ctx = await store.init();
  if (!ctx.enabled) {
    $('pin-mode').disabled = true;
    notice('Comments are not connected yet.');
  } else {
    store.onUser(renderMe);
    renderMe();
    store.watchComments(STATUS_SLUG, docs => showStageBadge(stageOf(applyStatusChanges([entry], docs)[0])));
    store.watchComments(slug, (list, err) => {
      if (err) notice(`Could not load comments: ${err.message}`);
      comments = list;
      render();
    });
  }
} catch (e) {
  $('pin-mode').disabled = true;
  notice(`Comments could not start: ${e.message}`);
}

const focus = params.get('c');
if (focus) {
  focusId = focus;
  if (matchMedia(PHONE_MQ).matches) document.body.classList.add('open');
}
render();
