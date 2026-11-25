// node hub/check-handoff.mjs: checks every experiment's "stage" and "spec" in experiments.json.
// Exits 1 on a problem, so run it before pushing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STAGES, normalizeSpec } from './handoff.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'experiments.json'), 'utf8'));
const problems = [];
const exists = rel => fs.existsSync(path.join(ROOT, rel.replace(/[?#].*$/, '')));

for (const e of entries) {
  const at = `${e.slug}:`;
  if (e.stage != null && !STAGES[e.stage]) problems.push(`${at} unknown stage "${e.stage}" (use ${Object.keys(STAGES).join(', ')})`);
  if (e.stage === 'ready' && !e.notionPageId) problems.push(`${at} Ready for Dev needs notionPageId (its Notion task)`);
  if (e.stage === 'ready' && !e.spec) problems.push(`${at} Ready for Dev needs a spec`);
  if (!e.spec) continue;
  if (!exists(e.spec)) { problems.push(`${at} spec file ${e.spec} is missing`); continue; }
  let raw;
  try { raw = JSON.parse(fs.readFileSync(path.join(ROOT, e.spec), 'utf8')); } catch (err) { problems.push(`${at} ${e.spec} is not valid JSON: ${err.message}`); continue; }
  const spec = normalizeSpec(raw);
  if (!spec.flows.some(f => f.rows.length)) problems.push(`${at} spec has no behaviours`);
  for (const key of ['flows', 'back', 'events', 'edgeCases', 'notes', 'assets']) {
    const kept = Array.isArray(raw[key]) ? (key === 'flows' ? spec.flows.length : spec[key].length) : 0;
    if (Array.isArray(raw[key]) && kept !== raw[key].length) problems.push(`${at} ${key}: ${raw[key].length - kept} item(s) missing required fields`);
  }
  for (const f of raw.flows || []) {
    const bad = (f.rows || []).filter(r => !r?.when || !r?.then).length;
    if (bad) problems.push(`${at} flow "${f.title}": ${bad} row(s) need both when and then`);
    if (f.show && !exists(f.show)) problems.push(`${at} flow "${f.title}" shows ${f.show}, which is missing`);
  }
  for (const a of spec.assets) if (!exists(a.file)) problems.push(`${at} asset ${a.file} is missing`);
  for (const ev of spec.events) if (!/^[a-z][a-z0-9_]*$/.test(ev.name)) problems.push(`${at} event "${ev.name}" should be snake_case`);
}

if (problems.length) {
  console.error(problems.map(p => `✗ ${p}`).join('\n'));
  process.exit(1);
}
const n = entries.filter(e => e.spec || e.stage).length;
console.log(`✓ handoff ok (${n} experiment${n === 1 ? '' : 's'} with a stage or spec)`);
