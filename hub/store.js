import config from './firebase-config.js';

const V = '10.14.1';
const base = `https://www.gstatic.com/firebasejs/${V}`;

export const TEAM = [];

let ctx = null;

export async function init() {
  if (ctx) return ctx;
  if (!config) return (ctx = { enabled: false });
  const [{ initializeApp }, auth, fs] = await Promise.all([
    import(`${base}/firebase-app.js`),
    import(`${base}/firebase-auth.js`),
    import(`${base}/firebase-firestore.js`),
  ]);
  const app = initializeApp(config);
  const a = auth.getAuth(app);
  const db = fs.getFirestore(app);
  ctx = { enabled: true, auth, fs, a, db };
  await new Promise(res => {
    const off = auth.onAuthStateChanged(a, async u => {
      off();
      if (!u) await auth.signInAnonymously(a);
      res();
    });
  });
  return ctx;
}

export function user() {
  return ctx?.a?.currentUser || null;
}

export async function signInGoogle() {
  const { auth, a } = ctx;
  await auth.signInWithPopup(a, new auth.GoogleAuthProvider());
}

export function onUser(cb) {
  if (!ctx?.enabled) return () => {};
  return ctx.auth.onAuthStateChanged(ctx.a, cb);
}

export function watchComments(slug, cb) {
  const { fs, db } = ctx;
  const q = slug
    ? fs.query(fs.collection(db, 'comments'), fs.where('slug', '==', slug))
    : fs.query(fs.collection(db, 'comments'), fs.where('status', '==', 'open'));
  return fs.onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((x, y) => (x.createdAt?.seconds || 0) - (y.createdAt?.seconds || 0)));
  }, err => cb([], err));
}

export function addComment(data) {
  const { fs, db } = ctx;
  return fs.addDoc(fs.collection(db, 'comments'), {
    status: 'open',
    parentId: null,
    notionCommentId: null,
    source: 'hub',
    ...data,
    createdAt: fs.serverTimestamp(),
  });
}

export function setStatus(id, status, sha) {
  const { fs, db, a } = ctx;
  return fs.updateDoc(fs.doc(db, 'comments', id), {
    status,
    resolvedBy: status === 'resolved' ? a.currentUser.displayName || a.currentUser.email : null,
    resolvedSha: status === 'resolved' ? sha || null : null,
  });
}

export function removeComment(id) {
  const { fs, db } = ctx;
  return fs.deleteDoc(fs.doc(db, 'comments', id));
}

export async function loadJson(url) {
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}
