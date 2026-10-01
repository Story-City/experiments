#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const [cmd, a, b] = process.argv.slice(2);
initializeApp();
const db = getFirestore();
const col = db.collection('comments');

if (cmd === 'list' && a) {
  const out = process.env.SHOTS_DIR || path.join(process.env.TMPDIR || '.', 'hub-shots');
  fs.mkdirSync(out, { recursive: true });
  const snap = await col.where('slug', '==', a).get();
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const open = all.filter(c => !c.parentId && c.status === 'open');
  for (const c of open) {
    let shot = '';
    if (c.screenshot) {
      shot = path.join(out, `${c.id}.jpg`);
      fs.writeFileSync(shot, Buffer.from(c.screenshot.split(',')[1], 'base64'));
    }
    console.log(`[${c.id}] ${c.author?.name}: ${c.text}`);
    console.log(`  url=${c.url} at=(${c.x?.toFixed?.(2)},${c.y?.toFixed?.(2)}) viewport=${c.vw}x${c.vh} sha=${c.sha}${shot ? ` shot=${shot}` : ''}`);
    for (const r of all.filter(r => r.parentId === c.id)) console.log(`    reply ${r.author?.name}: ${r.text}`);
  }
  if (!open.length) console.log('No open comments.');
} else if (cmd === 'resolve' && a && b) {
  await col.doc(a).update({ status: 'resolved', resolvedBy: 'claude', resolvedSha: b });
  console.log(`Resolved ${a} with ${b}.`);
} else {
  console.error('usage: cli.mjs list <slug> | resolve <id> <sha>');
  process.exit(1);
}
