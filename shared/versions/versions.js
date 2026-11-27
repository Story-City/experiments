// One version switcher for every experiment: a note under each version (anyone can edit it), and
// "+ New version", which copies the version you're on. A new version starts as an exact copy that
// renders its source version's code; it gets its own code the first time Claude is asked to change it.
// On the live site notes and new versions save for the team in the hub database (slug notes:<slug>,
// newest edit wins); anywhere else they stay in this browser, so local tests never write to the hub.
//
// mountVersions({ el, slug, versions: [{ id, label, note }], onPick(baseId, id), defaultId })
//   el         container to fill
//   versions   the versions that exist in code, oldest first
//   onPick     shows a version: baseId is the code version to render, id the version picked
//   defaultId  version that loads when the URL has no ?edition= (falls back to versions[0])

const NOTE_MAX = 240;
const PARAM = 'edition';
const FIREBASE = 'https://www.gstatic.com/firebasejs/10.14.1';
const isLive = () => location.pathname.includes('/experiments/');

async function connect(slug, onDocs) {
  if (!isLive()) return null;
  let config;
  try { ({ default: config } = await import(new URL('../../hub/firebase-config.js', import.meta.url).href)); } catch (e) { return null; }
  if (!config) return null;
  const [{ initializeApp }, auth, fs] = await Promise.all([
    import(`${FIREBASE}/firebase-app.js`), import(`${FIREBASE}/firebase-auth.js`), import(`${FIREBASE}/firebase-firestore.js`),
  ]);
  const app = initializeApp(config, 'sc-versions');
  const a = auth.getAuth(app);
  await new Promise((res) => { const off = auth.onAuthStateChanged(a, async (u) => { off(); if (!u) await auth.signInAnonymously(a); res(); }); });
  const db = fs.getFirestore(app);
  const uid = a.currentUser.uid;
  fs.onSnapshot(fs.query(fs.collection(db, 'comments'), fs.where('slug', '==', slug)),
    (snap) => onDocs(snap.docs.map((d) => d.data())), () => {});
  return {
    add(entry, name) {
      return fs.addDoc(fs.collection(db, 'comments'), {
        slug, text: JSON.stringify(entry), status: 'open', parentId: null, notionCommentId: null, source: 'preset',
        url: null, x: null, y: null, sha: null, screenshot: null,
        author: { uid, name: (name || 'Team').slice(0, 60), guest: true }, createdAt: fs.serverTimestamp(),
      });
    },
  };
}

const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private window */ } };
const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const num = (id) => Number(String(id).replace(/\D/g, '')) || 0;

export function mountVersions({ el, slug, versions, onPick, defaultId }) {
  const noteSlug = 'notes:' + slug;
  const localKey = 'sc-versions:' + slug;
  const coded = new Map(versions.map((v) => [v.id, v]));
  const fallbackId = (defaultId && coded.has(defaultId)) ? defaultId : versions[0].id;
  let entries = [];
  try { entries = JSON.parse(lsGet(localKey) || '[]'); } catch (e) { entries = []; }
  let db = null;
  let current = new URLSearchParams(location.search).get(PARAM) || fallbackId;

  el.classList.add('scv');
  el.innerHTML = '<div class="scv-list" role="group" aria-label="Versions"></div>'
    + '<button type="button" class="scv-new"></button><p class="scv-status" aria-live="polite"></p>';
  const list = el.querySelector('.scv-list');
  const newBtn = el.querySelector('.scv-new');
  const status = el.querySelector('.scv-status');

  function all() {
    const out = versions.map((v) => ({ ...v }));
    entries.filter((e) => e.kind === 'version-new' && !coded.has(e.edition))
      .sort((a, b) => num(a.edition) - num(b.edition))
      .forEach((e) => { if (!out.some((v) => v.id === e.edition)) out.push({ id: e.edition, label: e.edition.toUpperCase(), note: e.note, from: e.from }); });
    const latest = {};
    entries.filter((e) => e.kind === 'version-note').forEach((e) => { if (!latest[e.edition] || e.ts > latest[e.edition].ts) latest[e.edition] = e; });
    out.forEach((v) => { if (latest[v.id]) v.note = latest[v.id].note; });
    return out;
  }
  const byId = (id) => all().find((v) => v.id === id);
  function baseOf(id) {
    let v = byId(id);
    for (let i = 0; v && v.from && !coded.has(v.id) && i < 20; i++) v = byId(v.from);
    return v && coded.has(v.id) ? v.id : versions[0].id;
  }

  function flash(text) {
    status.textContent = text;
    clearTimeout(flash.t);
    flash.t = setTimeout(() => { status.textContent = ''; }, 2600);
  }
  async function save(entry, what) {
    entries.push(entry);
    if (db) {
      try { await db.add(entry, lsGet('hubName')); flash(what + ' saved for the team'); } catch (e) { flash('Couldn’t save. Try again.'); }
    } else {
      lsSet(localKey, JSON.stringify(entries));
      flash(what + ' saved in this browser');
    }
  }

  function render() {
    const vs = all();
    if (!vs.some((v) => v.id === current)) current = fallbackId;
    list.innerHTML = '';
    vs.forEach((v) => {
      const row = document.createElement('div');
      row.className = 'scv-row' + (v.id === current ? ' is-on' : '');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scv-pick';
      btn.textContent = v.label;
      btn.setAttribute('aria-pressed', String(v.id === current));
      btn.addEventListener('click', () => pick(v.id));
      const note = document.createElement('p');
      note.className = 'scv-note';
      note.contentEditable = 'plaintext-only';
      note.spellcheck = true;
      note.setAttribute('role', 'textbox');
      note.setAttribute('aria-label', 'Note for ' + v.label);
      note.title = 'Click to edit. Enter saves, Esc cancels.';
      note.textContent = v.note || '';
      note.dataset.placeholder = 'Add a note';
      note.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') { e.preventDefault(); note.blur(); }
        else if (e.key === 'Escape') { note.textContent = v.note || ''; note.blur(); }
      });
      note.addEventListener('blur', () => {
        const text = note.textContent.replace(/\s+/g, ' ').trim().slice(0, NOTE_MAX);
        note.textContent = text;
        if (text === (v.note || '')) return;
        v.note = text;
        save({ kind: 'version-note', edition: v.id, note: text, ts: Date.now() }, 'Note');
      });
      row.append(btn, note);
      list.append(row);
    });
    const label = byId(current)?.label || current.toUpperCase();
    newBtn.textContent = '＋ New version from ' + label;
    newBtn.title = 'Makes a new version that starts as a copy of ' + label;
  }

  function pick(id) {
    current = id;
    const url = new URL(location.href);
    if (id === fallbackId) url.searchParams.delete(PARAM); else url.searchParams.set(PARAM, id);
    history.replaceState(null, '', url);
    render();
    onPick(baseOf(id), id);
  }

  newBtn.addEventListener('click', async () => {
    const vs = all();
    const id = 'v' + (Math.max(...vs.map((v) => num(v.id))) + 1);
    const from = byId(current);
    await save({ kind: 'version-new', edition: id, from: current, note: 'Copy of ' + from.label + ' (' + today() + '). Ask Claude to change it.', ts: Date.now() }, id.toUpperCase());
    pick(id);
  });

  render();
  onPick(baseOf(current), current);
  connect(noteSlug, (docs) => {
    entries = docs.map((d) => { try { return JSON.parse(d.text); } catch (e) { return null; } }).filter(Boolean);
    const before = baseOf(current);
    if (!el.contains(document.activeElement)) render();
    if (baseOf(current) !== before) onPick(baseOf(current), current);
  }).then((d) => { db = d; }).catch(() => {});

  return { pick, current: () => current, base: () => baseOf(current) };
}
