import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DB = 'e1c023b1-8463-4af5-9c41-ac0f74be1ab1';
const TOKEN = process.env.NOTION_TOKEN;
const SITE = process.env.SITE_URL || 'https://story-city.github.io/experiments';
const OUT = process.env.OUT_DIR || '.';
const AUTHORS = JSON.parse(process.env.NOTION_AUTHORS || '{}');

const notion = async (path, method = 'GET', body) => {
  const r = await fetch(`https://api.notion.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${await r.text()}`);
  return r.json();
};

const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const manifest = JSON.parse(fs.readFileSync('experiments.json', 'utf8'));
const me = await notion('users/me');

let changed = false;
for (const e of manifest) {
  if (e.notionPageId || e.archived) continue;
  const props = {
    Task: { title: [{ text: { content: e.title } }] },
    Status: { status: { name: 'In progress' } },
  };
  if (AUTHORS[e.author]) props['On Point'] = { people: [{ id: AUTHORS[e.author] }] };
  const page = await notion('pages', 'POST', {
    parent: { database_id: DB },
    properties: props,
    children: [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: `${SITE}/view.html?e=${e.slug}`, link: { url: `${SITE}/view.html?e=${e.slug}` } } }] } }],
  });
  e.notionPageId = page.id;
  changed = true;
}
if (changed) {
  fs.writeFileSync('experiments.json', JSON.stringify(manifest, null, 2) + '\n');
  git('add', 'experiments.json');
  git('-c', 'user.name=hub-sync', '-c', 'user.email=hub-sync@users.noreply.github.com', 'commit', '-m', 'Hub: link new experiments to their Notion tasks');
  git('push');
}

initializeApp();
const db = getFirestore();
const snap = await db.collection('comments').get();
const comments = snap.docs.map(d => ({ id: d.id, ref: d.ref, ...d.data() }));
const bySlug = Object.fromEntries(manifest.map(e => [e.slug, e]));

for (const c of comments) {
  const e = bySlug[c.slug];
  if (!e?.notionPageId || c.notionCommentId || c.source === 'notion') continue;
  const link = `${SITE}/view.html?e=${c.slug}&u=${encodeURIComponent(c.url || '')}&c=${c.id}`;
  const res = await notion('comments', 'POST', {
    parent: { page_id: e.notionPageId },
    rich_text: [{ text: { content: `${c.author?.name || 'Guest'}: ${c.text}\n` } }, { text: { content: 'View the pin', link: { url: link } } }],
  });
  await c.ref.update({ notionCommentId: res.id });
}

const tasks = {};
for (const e of manifest) {
  if (!e.notionPageId) continue;
  const page = await notion(`pages/${e.notionPageId}`);
  const list = await notion(`comments?block_id=${e.notionPageId}&page_size=100`);
  const known = new Set(comments.map(c => c.notionCommentId).filter(Boolean));
  const incoming = [];
  for (const n of list.results) {
    if (n.created_by?.id === me.id || known.has(n.id)) continue;
    const text = n.rich_text.map(t => t.plain_text).join('');
    incoming.push({ id: n.id, text, at: n.created_time });
  }
  const names = {};
  for (const n of incoming) {
    const full = list.results.find(x => x.id === n.id);
    names[n.id] = full.created_by?.id;
  }
  for (const n of incoming) {
    let author = 'Notion';
    try { author = (await notion(`users/${names[n.id]}`)).name || author; } catch {}
    await db.collection('comments').add({
      slug: e.slug, url: null, x: null, y: null, text: n.text.slice(0, 2000), parentId: null,
      author: { uid: 'notion', name: author, guest: false }, sha: null, status: 'open',
      notionCommentId: n.id, source: 'notion', createdAt: new Date(n.at),
    });
  }
  tasks[e.slug] = { status: page.properties.Status?.status?.name || null, url: page.url };
}

const versions = {};
for (const e of manifest) {
  const dir = e.path.split(/[?#]/)[0].split('/')[0];
  const line = git('log', '-1', '--format=%H %cI', '--', dir);
  const [sha, date] = line.split(' ');
  versions[e.slug] = { sha, date };
}

fs.mkdirSync(`${OUT}/hub`, { recursive: true });
fs.writeFileSync(`${OUT}/hub/notion.json`, JSON.stringify({ updated: new Date().toISOString(), tasks }));
fs.writeFileSync(`${OUT}/hub/version.json`, JSON.stringify({ sha: git('rev-parse', 'HEAD'), experiments: versions }));
