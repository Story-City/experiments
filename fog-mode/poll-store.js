// Where the fog-look votes are kept: the experiments hub's Firestore (the same database as the
// comments), one record per voter under its own slug. That slug isn't an experiment card, so votes
// never show as comments or sync to Notion. Everyone signs in anonymously, like the comments do.
// Only works on the experiments site (where ../hub/ exists); elsewhere connect() returns null.

export async function connect(slug, onVotes, onError) {
  let config;
  try { ({ default: config } = await import('../hub/firebase-config.js')); } catch (e) { return null; }
  if (!config) return null;
  const base = 'https://www.gstatic.com/firebasejs/10.14.1';
  const [{ initializeApp }, auth, fs] = await Promise.all([
    import(`${base}/firebase-app.js`), import(`${base}/firebase-auth.js`), import(`${base}/firebase-firestore.js`),
  ]);
  const app = initializeApp(config);
  const a = auth.getAuth(app);
  await new Promise((res) => { const off = auth.onAuthStateChanged(a, async (u) => { off(); if (!u) await auth.signInAnonymously(a); res(); }); });
  const db = fs.getFirestore(app);
  const uid = a.currentUser.uid;
  let myId = null;

  fs.onSnapshot(fs.query(fs.collection(db, 'comments'), fs.where('slug', '==', slug)), (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const own = docs.filter((d) => d.author?.uid === uid).sort((x, y) => (y.createdAt?.seconds || 0) - (x.createdAt?.seconds || 0))[0];
    if (own) myId = own.id;
    onVotes(docs);
  }, onError);

  // Save my vote: the first time it's a new record, after that the same record is updated
  // (the database rules let you change only the text of your own record).
  async function save(text, name) {
    if (myId) { await fs.updateDoc(fs.doc(db, 'comments', myId), { text }); return; }
    const ref = await fs.addDoc(fs.collection(db, 'comments'), {
      slug, text, status: 'open', parentId: null, notionCommentId: null, source: 'poll',
      url: null, x: null, y: null, sha: null, screenshot: null,
      author: { uid, name: name.slice(0, 60), guest: true },
      createdAt: fs.serverTimestamp(),
    });
    myId = ref.id;
  }
  return { uid, save };
}
