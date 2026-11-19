// Turns a pasted script into chapters, choices, chat lines, puzzles and asset slots.
// Format (matches the scripts Matt writes):
//   ## 1b: A mysterious figure · START|END     chapter heading
//   Location off  /  Generic location: Mailbox  location
//   [Image of …]  [SFX - …]  [Video …]  [OVERLAY …]  asset slots
//   WREN: Hello there                          chat bubble (speaker in capitals)
//   ***Look out your window***                 text message bubble
//   [Puzzle: decrypt — answer 786666]          puzzle slot (decrypt, remix, photo, riddle)
//   - [I'm here] → 3a: The Mailbox (needs: MATCH_NUMBER)   choice
//   [FR]                                       French version of this chapter follows

const STOPWORDS = /^(note|notes|location|generic location|needs|answer|todo|sfx|image)$/i;
const clean = (s) => s.replace(/\*\*\*|\*\*|\*/g, '').replace(/\s+/g, ' ').trim();

function assetFrom(line) {
  const t = clean(line);
  let m = t.match(/^[[(]\s*(image|picture|photo)\s*(?:of)?\s*[:\-–]?\s*(.*?)[\])]?$/i);
  if (m) return { atype: 'image', desc: m[2] || 'Image' };
  m = t.match(/^[[(]\s*overlay\s*[:\-–]?\s*(.*?)[\])]?$/i);
  if (m) return { atype: 'image', desc: 'Overlay: ' + m[1].replace(/^with\s+/i, '') };
  m = t.match(/^[[(]\s*(sfx|sound|audio|music|voice ?over|vo)\s*[:\-–]?\s*(.*?)[\])]?$/i);
  if (m) return { atype: 'sound', desc: m[2] || m[1] };
  m = t.match(/^[[(]\s*video\s*[:\-–]?\s*(.*?)[\])]?$/i);
  if (m) return { atype: 'video', desc: m[1] || 'Video' };
  return null;
}

function puzzleFrom(line) {
  const m = clean(line).match(/^\[\s*puzzle\s*:\s*(decrypt|remix|photo|riddle)\b\s*[—–\-:]?\s*(.*?)\]?$/i);
  if (!m) return null;
  const answer = (m[2].match(/answer\s*[:=]?\s*([^,;]+)/i) || [])[1];
  return { kind: m[1].toLowerCase(), desc: m[2], answer: answer ? answer.trim() : '' };
}

function parseBody(lines, ch, blocks, isFr) {
  let para = [];
  const flush = () => {
    if (para.length) blocks.push({ type: 'text', text: clean(para.join(' ')) });
    para = [];
  };
  for (const { raw, n } of lines) {
    const line = raw.trim();
    if (!line || /^-{3,}$/.test(line)) { flush(); continue; }
    const t = clean(line);
    if (!isFr && /^location off$/i.test(t)) { flush(); ch.loc = false; ch.locLine = n; continue; }
    const loc = !isFr && t.match(/^(?:generic )?location\s*:\s*(.+)$/i);
    if (loc) { flush(); ch.loc = true; ch.place = loc[1].trim(); ch.locLine = n; continue; }
    const choice = line.match(/^[-*•]\s*\*{0,2}\[(.+?)\]\*{0,2}\s*(?:→|->|=>)\s*(.+?)\s*(?:\*?\(needs:\s*([A-Z_]+)\)\*?)?\s*$/);
    if (choice) {
      flush();
      if (isFr) ch.frChoices.push(clean(choice[1]));
      else ch.choices.push({ label: clean(choice[1]), target: clean(choice[2]), needs: choice[3] || null, line: n });
      continue;
    }
    const pz = puzzleFrom(line);
    if (pz) { flush(); blocks.push({ type: 'puzzle', ...pz, line: n }); continue; }
    const as = assetFrom(line);
    if (as) { flush(); blocks.push({ type: 'asset', ...as, line: n }); continue; }
    if (/^\*{3}[^*].*\*{3}$/.test(line)) { flush(); blocks.push({ type: 'chat', who: 'Text message', text: clean(line), phone: true }); continue; }
    const sp = line.match(/^\**([A-Z][A-Z .'’-]{1,24}|[A-Z][a-z]+(?: [A-Z][a-z]+)?)\**\s*:\s+(.+)$/);
    if (sp && !STOPWORDS.test(sp[1].trim())) {
      flush();
      const who = sp[1].trim();
      blocks.push({ type: 'chat', who: who === who.toUpperCase() ? who.charAt(0) + who.slice(1).toLowerCase() : who, text: clean(sp[2]) });
      continue;
    }
    para.push(line);
  }
  flush();
}

export function parseScript(src) {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const chapters = [];
  let cur = null;
  let preamble = 0;
  lines.forEach((raw, n) => {
    const h = raw.match(/^\s*#{1,4}\s+(.+?)\s*$/);
    if (h) {
      let head = clean(h[1]).replace(/^\d+\.\s+/, '');
      let start = false; let end = false;
      const badge = head.match(/\s*[·|•]\s*(START|END)\s*$/i);
      if (badge) { head = head.slice(0, badge.index).trim(); start = /start/i.test(badge[1]); end = /end/i.test(badge[1]); }
      if (chapters.length === 0 && !h[0].trim().startsWith('##') && lines.slice(n + 1).some((l) => /^\s*##\s/.test(l))) {
        preamble++; return; // a "# Story title" line above "## chapters"
      }
      cur = { heading: head, start, end, loc: null, place: '', choices: [], frChoices: [], body: [], frBody: [], line: n, en: [], fr: null };
      chapters.push(cur);
      return;
    }
    if (!cur) return;
    if (/^\s*\[(FR|FRENCH|FRANÇAIS)\]\s*$/i.test(raw)) { cur.fr = []; return; }
    (cur.fr ? cur.fr : cur.body).push({ raw, n });
  });

  for (const ch of chapters) {
    const blocks = [];
    parseBody(ch.body, ch, blocks, false);
    ch.blocks = blocks;
    if (ch.fr) { const fb = []; parseBody(ch.fr, ch, fb, true); ch.frBlocks = fb; } else ch.frBlocks = null;
    delete ch.body; delete ch.fr;
    const cm = ch.heading.match(/^([^:]{1,8}):\s*(.+)$/);
    ch.code = cm ? cm[1].trim() : '';
    ch.title = cm ? cm[2].trim() : ch.heading;
  }
  if (chapters.length && !chapters.some((c) => c.start)) chapters[0].start = true;

  // Resolve choice targets by full heading, code ("3a") or title
  const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
  chapters.forEach((c, i) => { c.id = 's' + i; });
  const find = (t) => {
    const x = norm(t);
    return chapters.find((c) => norm(c.heading) === x)
      || chapters.find((c) => c.code && norm(c.code) === norm(x.split(':')[0]))
      || chapters.find((c) => norm(c.title) === x);
  };
  for (const c of chapters) for (const k of c.choices) { const t = find(k.target); k.to = t ? t.id : null; }
  return { chapters, preamble };
}

// Turn a parse into the shared story model the map draws.
export function toStory(parsed, title) {
  const chapters = parsed.chapters.map((c) => {
    const count = (type) => c.blocks.filter((b) => b.type === type).length;
    const assets = c.blocks.filter((b) => b.type === 'asset');
    const firstText = (c.blocks.find((b) => b.type === 'text' || b.type === 'chat') || {}).text || '';
    const frText = c.frBlocks ? ((c.frBlocks.find((b) => b.type === 'text' || b.type === 'chat') || {}).text || '…') : null;
    return {
      id: c.id,
      name: c.heading,
      start: c.start,
      end: c.end,
      loc: c.loc === null ? !!c.start : c.loc,
      place: c.place,
      audio: assets.filter((a) => a.atype === 'sound').length,
      video: assets.filter((a) => a.atype === 'video').length,
      image: assets.filter((a) => a.atype === 'image').length,
      puzzle: c.blocks.some((b) => b.type === 'puzzle'),
      chat: count('chat'),
      text: firstText.length > 170 ? firstText.slice(0, 170).replace(/\s+\S*$/, '') + '…' : firstText,
      fr: frText,
      choices: c.choices.map((k) => ({ label: k.label, to: k.to, needs: k.needs })),
    };
  });
  return { id: 'script', title, note: 'Made from the script you pasted.', lang: ['en', 'fr'], chapters };
}
