// Design-to-dev handoff: an experiment's "stage" in experiments.json, and its spec file.

export const STAGES = {
  review: 'In review',
  ready: 'Ready for Dev',
  built: 'Built',
};
export const NEEDS_TASK = 'Needs Notion task';

export function notionUrl(entry) {
  return entry.notionPageId ? `https://app.notion.com/p/storycity/${entry.notionPageId.replace(/-/g, '')}` : null;
}

// Ready for Dev counts only when the experiment links to its Notion task.
export function stageOf(entry) {
  if (STAGES[entry.stage]) {
    const blocked = entry.stage === 'ready' && !entry.notionPageId;
    return { key: entry.stage, label: blocked ? NEEDS_TASK : STAGES[entry.stage], blocked };
  }
  if (entry.draft) return { key: 'draft', label: 'Draft', blocked: false };
  return null;
}

const list = v => (Array.isArray(v) ? v : []);

export function normalizeSpec(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    summary: typeof raw.summary === 'string' ? raw.summary : '',
    final: typeof raw.final === 'string' ? raw.final : '',
    flows: list(raw.flows).filter(f => f?.title).map(f => ({
      title: f.title,
      show: f.show || null,
      rows: list(f.rows).filter(r => r?.when && r?.then),
    })),
    back: list(raw.back).filter(b => b?.from && b?.then),
    events: list(raw.events).filter(e => e?.name),
    edgeCases: list(raw.edgeCases).filter(x => typeof x === 'string'),
    notes: list(raw.notes).filter(x => typeof x === 'string'),
    assets: list(raw.assets).filter(a => a?.label && a?.file),
  };
}

export function specMarkdown(entry, spec, root) {
  const pageUrl = new URL(`view.html?e=${encodeURIComponent(entry.slug)}`, root).href;
  const out = [`# ${entry.title}`, ''];
  const stage = stageOf(entry);
  if (stage) out.push(`Status: ${stage.label}`);
  if (notionUrl(entry)) out.push(`Notion task: ${notionUrl(entry)}`);
  out.push(`Experiment: ${pageUrl}`, '');
  if (spec.final) out.push(`**Final version:** ${spec.final}`, '');
  if (spec.summary) out.push(spec.summary, '');
  for (const f of spec.flows) {
    out.push(`## ${f.title}`, '', '| When | Then | Event |', '|---|---|---|');
    for (const r of f.rows) out.push(`| ${cell(r.when)} | ${cell(r.then)} | ${r.event ? `\`${r.event}\`` : ''} |`);
    out.push('');
  }
  if (spec.back.length) {
    out.push('## Back', '', '| From | Back does |', '|---|---|');
    for (const b of spec.back) out.push(`| ${cell(b.from)} | ${cell(b.then)} |`);
    out.push('');
  }
  if (spec.events.length) {
    out.push('## Analytics events', '', '| Event | When | Properties | |', '|---|---|---|---|');
    for (const e of spec.events) out.push(`| \`${e.name}\` | ${cell(e.when || '')} | ${cell(e.props || '')} | ${e.status === 'existing' ? 'exists in app' : 'new'} |`);
    out.push('');
  }
  if (spec.edgeCases.length) out.push('## Edge cases', '', ...spec.edgeCases.map(x => `- ${x}`), '');
  if (spec.notes.length) out.push('## Notes', '', ...spec.notes.map(x => `- ${x}`), '');
  if (spec.assets.length) {
    out.push('## Assets', '');
    for (const a of spec.assets) out.push(`- [${a.label}](${new URL(a.file, root).href})${a.note ? ` – ${a.note}` : ''}`);
    out.push('');
  }
  return out.join('\n');
}

const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
