import * as store from './store.js';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const slug = params.get('e');
const root = new URL('../', import.meta.url);

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
const startPath = params.get('u') || entry.path;
frame.src = new URL(startPath, root).href;
$('direct').href = new URL(entry.path, root).href;

if (task?.status) {
  $('status').textContent = task.status;
  $('status').hidden = false;
}

const links = $('links');
if (entry.notionPageId) {
  const a = el('a', null, 'Notion task');
  a.href = task?.url || `https://app.notion.com/p/storycity/${entry.notionPageId.replace(/-/g, '')}`;
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
    const li = el('li', null, store.user() ? 'No comments yet.' : '');
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
      if (matchMedia('(max-width: 820px)').matches) document.body.classList.remove('open');
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
  $('pin-mode').textContent = on ? 'Tap the spot…' : 'Add a comment';
  overlay.hidden = !on && !overlay.children.length;
}

overlay.addEventListener('click', e => {
  if (!armed || e.target !== overlay) return;
  const r = overlay.getBoundingClientRect();
  setArmed(false);
  startDraft((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
});

$('pin-mode').addEventListener('click', () => {
  if (matchMedia('(max-width: 820px)').matches) document.body.classList.remove('open');
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
  if (u !== lastUrl) { lastUrl = u; render(); }
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
  if (matchMedia('(max-width: 820px)').matches) document.body.classList.add('open');
}
render();
