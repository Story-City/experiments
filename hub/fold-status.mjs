// node hub/fold-status.mjs [--write]: reads the status changes made on the site (edit mode) from the
// hub database, read-only, and applies the ones that still match experiments.json. Without --write it
// only prints what would change.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './firebase-config.js';
import { STATUS_SLUG, stateKey, withState, parseStatusDocs } from './handoff.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'experiments.json');
const write = process.argv.includes('--write');

const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents:runQuery?key=${config.apiKey}`;
const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ structuredQuery: {
    from: [{ collectionId: 'comments' }],
    where: { fieldFilter: { field: { fieldPath: 'slug' }, op: 'EQUAL', value: { stringValue: STATUS_SLUG } } },
  } }),
});
if (!res.ok) {
  console.error(`✗ could not read the hub database: ${res.status}`);
  process.exit(1);
}
const docs = (await res.json())
  .filter(r => r.document)
  .map(r => ({ text: r.document.fields?.text?.stringValue, at: r.document.fields?.createdAt?.timestampValue || '' }))
  .sort((a, b) => a.at.localeCompare(b.at));

const latest = parseStatusDocs(docs);
const entries = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const changes = [];
const next = entries.map(e => {
  const c = latest[e.slug];
  if (!c || c.from !== stateKey(e) || c.to === stateKey(e)) return e;
  changes.push(`${e.slug}: ${c.from} → ${c.to}${c.notionPageId ? ` (Notion ${c.notionPageId})` : ''}${c.by ? `, by ${c.by}` : ''}`);
  return withState(e, c.to, c.notionPageId);
});

if (!changes.length) {
  console.log('✓ nothing to fold in');
  process.exit(0);
}
console.log(changes.join('\n'));
if (write) {
  fs.writeFileSync(FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`✓ wrote ${changes.length} change${changes.length === 1 ? '' : 's'} to experiments.json; run node hub/check-handoff.mjs, then commit`);
} else {
  console.log('(dry run; add --write to save)');
}
