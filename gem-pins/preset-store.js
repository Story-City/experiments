// Team presets for Gem map pins, saved in the experiments hub's database (the same one the fog vote
// uses), under their own slug so they never show up as comments or reach Notion.
// Only on the live experiments site; anywhere else (local previews, tests) returns null and the page
// keeps presets on this device instead.
export async function connect(slug, onDocs, onError) {
  if (!location.pathname.includes('/experiments/')) return null;
  let config;
  try { ({ default: config } = await import('../hub/firebase-config.js')); } catch (e) { return null; }
  if (!config) return null;
  const base = 'https://www.gstatic.com/firebasejs/10.14.1';
  const [{ initializeApp }, auth, fs] = await Promise.all([import(`${base}/firebase-app.js`), import(`${base}/firebase-auth.js`), import(`${base}/firebase-firestore.js`)]);
  const app = initializeApp(config, 'gem-presets');
  const a = auth.getAuth(app);
  await new Promise((res) => { const off = auth.onAuthStateChanged(a, async (u) => { off(); if (!u) await auth.signInAnonymously(a); res(); }); });
  const db = fs.getFirestore(app);
  const uid = a.currentUser.uid;
  fs.onSnapshot(fs.query(fs.collection(db, 'comments'), fs.where('slug', '==', slug)), (snap) => onDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError);
  return {
    uid,
    async add(text, name) {
      const ref = await fs.addDoc(fs.collection(db, 'comments'), { slug, text, status: 'open', parentId: null, notionCommentId: null, source: 'preset', url: null, x: null, y: null, sha: null, screenshot: null, author: { uid, name: name.slice(0, 60), guest: true }, createdAt: fs.serverTimestamp() });
      return ref.id;
    },
    async update(id, text) { await fs.updateDoc(fs.doc(db, 'comments', id), { text }); },
  };
}
