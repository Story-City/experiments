// Variant 22 · Door of the Day. A Wordle-style daily ritual: one door, one story, the same for everyone today.
// The story and the door photo are picked from the local date, so every visitor gets the same pair.
// Up to three clues (time, place, mood; never the name), a live countdown to the next door, a knock that swings
// the door open, and a spoiler-free share block. Imports nothing; talks to the shell only through ctx.
// Demo helper: ?v=door-of-day&date=2026-12-24 previews another day.

const DOOR_KEYS = ['doors.red', 'doors.blue', 'doors.arched', 'doors.black', 'doors.shop', 'doors.garden'];
const STORE = 'storycity.doorOfDay';

const PLACE_CLUES = [
  ['cafe', 'Start near a good café'],
  ['park', 'You’ll want a park'],
  ['downtown', 'Head for the busy streets downtown'],
  ['neighbourhood', 'Your own street will do'],
  ['anywhere', 'Any street will do, even yours'],
];
const MOOD_CLUES = [
  ['spooky', 'Not everyone on this street is alive'],
  ['eerie', 'Someone has been here before you'],
  ['heist', 'Somebody wants something that isn’t theirs'],
  ['romance', 'Someone is hoping you’ll say yes'],
  ['scifi', 'The future is trying to reach you'],
  ['fantasy', 'Not everyone you meet is human'],
  ['mystery', 'Somebody here is keeping a secret'],
  ['comedy', 'You will laugh out loud at least once'],
  ['adventure', 'Pack your courage, not your map'],
];

// FNV-1a, 32-bit. Same string in, same number out, on every phone.
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
const pad = (n) => String(n).padStart(2, '0');
const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const clock = (d) => { const h = d.getHours() % 12 || 12; return `${h}:${pad(d.getMinutes())} ${d.getHours() < 12 ? 'am' : 'pm'}`; };

function load(day) {
  try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); return s && s.date === day ? s : null; } catch (e) { return null; }
}
function save(state) { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* private mode: knock still works, just not remembered */ } }
function forget() { try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ } }

function cluesFor(s) {
  const tag = (list) => (list.find(([t]) => s.tags.includes(t)) || [null, 'Something is waiting behind it'])[1];
  return [`It takes about ${s.minutes} minutes`, tag(PLACE_CLUES), tag(MOOD_CLUES)];
}

const CSS = `
.v-door-of-day { padding-top: 14px; }
.v-door-of-day .eyebrow { font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--story); font-weight: 800; }
.v-door-of-day h2 { font-size: 34px; line-height: 0.98; font-weight: 900; margin: 6px 0 6px; text-wrap: balance; }
.v-door-of-day .lead { margin: 0 0 14px; color: var(--muted); font-size: 18px; line-height: 1.2; text-wrap: pretty; }

.v-door-of-day .frame { position: relative; margin: 0 auto 14px; width: min(100%, 330px); padding: 14px 14px 0; border-radius: 170px 170px 10px 10px;
  background: linear-gradient(180deg, #3a2e66, #241b46); box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.06), 0 18px 40px rgba(0, 0, 0, 0.45); }
.v-door-of-day .portal { position: relative; aspect-ratio: 3 / 4.2; border-radius: 156px 156px 4px 4px; overflow: hidden; perspective: 1100px; background: #0b0620; }
.v-door-of-day .behind { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; text-align: center;
  background: radial-gradient(80% 60% at 50% 35%, rgba(255, 179, 71, 0.55), rgba(255, 179, 71, 0) 70%), #120a2c; }
.v-door-of-day .behind img, .v-door-of-day .behind .ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.v-door-of-day .behind .ph { background: radial-gradient(80% 60% at 50% 30%, rgba(255, 179, 71, 0.5), transparent 70%), linear-gradient(180deg, #352a66, #120a2c); font-size: 0; }
.v-door-of-day .behind .txt { position: relative; padding: 70px 18px 18px; background: linear-gradient(transparent, rgba(10, 5, 30, 0.92) 45%); }
.v-door-of-day .behind b { display: block; font-size: 30px; line-height: 1; font-weight: 900; text-wrap: balance; }
.v-door-of-day .behind span { display: block; margin-top: 6px; font-size: 17px; line-height: 1.15; color: #ddd6f3; text-wrap: balance; }
.v-door-of-day .door { position: absolute; inset: 0; transform-origin: 0 50%; transition: transform 1.2s cubic-bezier(.3, .1, .2, 1), filter 1.2s; backface-visibility: hidden; z-index: 2; background: #2a1f4f; }
.v-door-of-day .door img, .v-door-of-day .door .ph { width: 100%; height: 100%; object-fit: cover; }
.v-door-of-day .door .ph { font-size: 15px; color: rgba(255, 255, 255, 0.45); letter-spacing: 0.06em; text-transform: uppercase; }
.v-door-of-day .plaque { position: absolute; left: 50%; bottom: 16px; translate: -50% 0; z-index: 3; padding: 4px 14px 6px; border-radius: 8px; white-space: nowrap;
  background: linear-gradient(180deg, #f3d58a, #b98a33); color: #3a2608; font-weight: 900; font-size: 20px; letter-spacing: 0.04em;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.6); transition: opacity 0.4s; }
.v-door-of-day .portal.open .door { transform: rotateY(-104deg); filter: brightness(0.45); }
.v-door-of-day .portal.open .plaque { opacity: 0; }
.v-door-of-day .portal.knocking .door { animation: dod-knock 0.5s ease-in-out; }
@keyframes dod-knock { 0%, 100% { transform: none; } 20%, 60% { transform: translateX(3px) rotateY(-1.5deg); } 40%, 80% { transform: translateX(-2px); } }

.v-door-of-day .clues { display: grid; gap: 8px; margin: 0 0 12px; }
.v-door-of-day .clue { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 50px; text-align: left; padding: 10px 14px; border-radius: 14px;
  background: var(--raised); border: 1px dashed rgba(255, 255, 255, 0.18); color: var(--muted); font-size: 18px; font-weight: 700; line-height: 1.15; }
.v-door-of-day .clue .sq { flex: none; width: 22px; height: 22px; border-radius: 5px; background: #3a3a4a; }
.v-door-of-day .clue.on { border-style: solid; border-color: rgba(242, 194, 48, 0.45); color: var(--text); background: var(--raised-2); }
.v-door-of-day .clue.on .sq { background: var(--walk); }
.v-door-of-day .clue:disabled { cursor: default; opacity: 1; }
.v-door-of-day .clue.next { color: var(--text); }
.v-door-of-day .clue.later { opacity: 0.55; }
.v-door-of-day .clue.reveal { animation: dod-flip 0.45s ease-out; }
@keyframes dod-flip { from { transform: rotateX(80deg); opacity: 0.2; } to { transform: none; opacity: 1; } }

.v-door-of-day .count { text-align: center; color: var(--muted); font-size: 17px; margin: 0 0 14px; font-weight: 700; }
.v-door-of-day .count b { color: var(--text); font-variant-numeric: tabular-nums; font-weight: 900; letter-spacing: 0.02em; }
.v-door-of-day .knocked { text-align: center; font-size: 19px; font-weight: 800; margin: 0 0 12px; color: var(--story); }
.v-door-of-day .acts { display: grid; gap: 10px; margin-bottom: 8px; }
.v-door-of-day .btn.knock { font-size: 22px; min-height: 56px; letter-spacing: 0.02em; background: linear-gradient(180deg, #ffc66b, #e08a1e); color: #2b1600; }
.v-door-of-day .forget { display: block; margin: 4px auto 0; background: none; border: 0; color: var(--muted); font-size: 15px; text-decoration: underline; padding: 8px; }

.v-door-of-day .group-title { margin-top: 26px; }
.v-door-of-day .ig-story { width: 230px; margin: 6px auto 10px; }
.v-door-of-day .ig-story > img, .v-door-of-day .ig-story > .ph { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.55); font-size: 0; }
.v-door-of-day .st { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 50px 14px 20px; text-align: center; font-family: "Darker Grotesque", sans-serif; }
.v-door-of-day .st .k { font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #ffd89a; }
.v-door-of-day .st .big { font-size: 34px; line-height: 0.92; font-weight: 900; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6); }
.v-door-of-day .st .sq3 { font-size: 22px; letter-spacing: 4px; line-height: 1; }
.v-door-of-day .st .stick { background: #fff; color: #111; border-radius: 10px; padding: 6px 10px 7px; font-size: 15px; font-weight: 800; line-height: 1.1; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35); }
.v-door-of-day .st .stick b { font-variant-numeric: tabular-nums; font-weight: 900; }
.v-door-of-day .st .link { margin-top: auto; background: rgba(255, 255, 255, 0.92); color: #3797f0; border-radius: 999px; padding: 4px 12px; font: 600 12px -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
.v-door-of-day .note { font-size: 15px; margin: 0 0 6px; text-wrap: pretty; }

@media (prefers-reduced-motion: reduce) {
  .v-door-of-day .door { transition: opacity 0.4s; }
  .v-door-of-day .portal.open .door { transform: none; opacity: 0; }
  .v-door-of-day .portal.knocking .door, .v-door-of-day .clue.reveal { animation: none; }
}
`;

export default {
  slug: 'door-of-day',
  title: 'Door of the Day',
  short: 'Door of the Day',
  channel: 'instagram',
  blurb: 'One door, one story, everyone gets the same one today.',

  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    ctx.root.innerHTML = '';

    // ---- today's pick, from the local date ----
    const forced = /^\d{4}-\d{2}-\d{2}$/.test(ctx.params && ctx.params.get('date') || '') ? ctx.params.get('date') : null;
    const now = new Date();
    const today = forced ? new Date(forced + 'T12:00:00') : now;
    const day = isoDay(today);
    const doorNo = Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(2026, 0, 1)) / 864e5) + 1;
    const pool = ctx.stories.filter(s => !/^M\b|15\+|18\+/.test(s.age || ''));
    const story = pool[hash('story:' + day) % pool.length];
    const doorKey = DOOR_KEYS[hash('door:' + day) % DOOR_KEYS.length];
    const clues = cluesFor(story);
    const dateLabel = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    const saved = load(day);
    let used = saved ? saved.clues : 0;
    let knockedAt = saved ? saved.time : null;
    const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    const squares = () => [0, 1, 2].map(i => (i < used ? '🟨' : '⬛')).join('');
    const finish = () => ctx.finish({ story, headline: 'Today’s door', why: 'Everyone who knocks today gets the same story. Tomorrow it’s a different door.' });
    const shareText = () => `Story City · Door No. ${doorNo} 🚪\nclues used: ${squares()}\nknocked at ${knockedAt || '…'}\nstorycity.app`;
    const share = () => {
      const text = shareText();
      const done = () => ctx.toast('Copied. No spoilers, promise.');
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => ctx.toast(text.replace(/\n/g, ' / '), 4000));
        else ctx.toast(text.replace(/\n/g, ' / '), 4000);
      } catch (e) { ctx.toast(text.replace(/\n/g, ' / '), 4000); }
    };

    // ---- door ----
    const behind = el('div', { class: 'behind' },
      story.cover ? el('img', { src: story.cover, alt: '', draggable: 'false' }) : el('div', { class: 'ph', 'aria-hidden': 'true' }),
      el('div', { class: 'txt' }, el('b', { text: story.name }), el('span', { text: story.blurb })));
    const door = el('div', { class: 'door' }, ctx.photoEl(doorKey, 'Today’s door'));
    const portal = el('div', { class: 'portal' + (knockedAt ? ' open' : ''), 'aria-live': 'polite' },
      behind, door, el('div', { class: 'plaque', text: `Door No. ${doorNo}` }));
    behind.setAttribute('aria-hidden', knockedAt ? 'false' : 'true');

    // ---- clues ----
    const clueBox = el('div', { class: 'clues', 'aria-label': 'Clues' });
    const drawClues = (animate = -1) => {
      clueBox.innerHTML = '';
      clues.forEach((c, i) => {
        const on = i < used, next = i === used && !knockedAt;
        const b = el('button', { type: 'button', class: 'clue' + (on ? ' on' : next ? ' next' : ' later') + (i === animate && !reduced ? ' reveal' : ''),
          disabled: !next, onClick: () => { used++; drawClues(i); refreshStory(); } },
          el('span', { class: 'sq', 'aria-hidden': 'true' }),
          el('span', { text: on ? c : next ? `Clue ${i + 1} · tap to reveal` : knockedAt ? `Clue ${i + 1} · not needed` : `Clue ${i + 1}` }));
        clueBox.append(b);
      });
    };

    // ---- countdown ----
    const countB = el('b', { text: '--:--:--' });
    const count = el('p', { class: 'count' }, 'Next door in ', countB);

    // ---- actions ----
    const acts = el('div', { class: 'acts' });
    const knockedLine = el('p', { class: 'knocked' });
    const drawActs = () => {
      acts.innerHTML = '';
      knockedLine.hidden = !knockedAt;
      knockedLine.textContent = knockedAt ? `You knocked at ${knockedAt}` : '';
      if (!knockedAt) {
        acts.append(el('button', { class: 'btn knock block', text: 'Knock', onClick: knock }));
      } else {
        acts.append(
          el('button', { class: 'btn primary block', text: 'Step inside', onClick: finish }),
          el('button', { class: 'btn ghost block', text: 'Share today’s door', onClick: share }),
          el('button', { class: 'forget', text: 'Forget I knocked (demo only)', onClick: () => { forget(); ctx.restart(); } }));
      }
    };
    function knock(e) {
      const btn = e && e.currentTarget; if (btn) btn.disabled = true;
      const t = new Date();
      knockedAt = clock(t);
      save({ date: day, time: knockedAt, clues: used, at: t.toISOString() });
      const open = () => {
        portal.classList.remove('knocking'); portal.classList.add('open');
        behind.setAttribute('aria-hidden', 'false');
        drawClues(); drawActs(); refreshStory();
      };
      if (reduced) open();
      else { portal.classList.add('knocking'); setTimeout(open, 520); }
    }

    // ---- Instagram Story preview ----
    const stSq = el('div', { class: 'sq3', 'aria-label': 'Clues used' });
    const stTime = el('div', { class: 'stick' });
    const stCount = el('b', { text: '--:--:--' });
    const story9x16 = el('div', { class: 'ig-story', 'aria-label': 'Instagram Story preview' },
      ctx.photoEl(doorKey, 'Today’s door'),
      el('div', { class: 'bars' }, el('i', { class: 'on' })),
      el('div', { class: 'who' }, el('div', { class: 'ig-avatar' }, el('i', { text: '🔮' })), el('span', { text: 'storycityapp · 2h' })),
      el('div', { class: 'st' },
        el('div', { class: 'k', text: 'Door of the Day' }),
        el('div', { class: 'big', text: `Door No. ${doorNo}` }),
        stSq, stTime,
        el('div', { class: 'stick' }, 'Next door in ', stCount),
        el('div', { class: 'link', text: '🔗 storycity.app' })));
    function refreshStory() {
      stSq.textContent = squares();
      stTime.textContent = knockedAt ? `knocked at ${knockedAt}` : 'still on the step…';
    }

    // ---- live tick (stops when this screen goes away) ----
    const tick = () => {
      if (!count.isConnected) { clearInterval(timer); return; }
      const n = new Date();
      const mid = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
      let s = Math.max(0, Math.floor((mid - n) / 1000));
      if (s === 0 && !forced) { clearInterval(timer); ctx.toast('A new door is ready'); setTimeout(() => ctx.restart(), 1200); }
      const txt = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
      countB.textContent = txt; stCount.textContent = txt;
    };
    const timer = setInterval(tick, 1000);

    drawClues(); drawActs(); refreshStory();
    ctx.root.append(el('div', { class: 'v-door-of-day' },
      el('div', { class: 'eyebrow', text: `Door of the Day · ${dateLabel}` }),
      el('h2', { text: 'One door. Everyone gets the same story today.' }),
      el('p', { class: 'lead', text: 'Use a clue or two if you like. Then knock.' }),
      el('div', { class: 'frame' }, portal),
      knockedLine,
      clueBox,
      count,
      acts,
      el('div', { class: 'group-title', text: 'How it looks on Instagram' }),
      el('p', { class: 'muted note', text: 'One Story post a day. The share block is spoiler-free, like Wordle: only the door number, the clues you used and when you knocked.' }),
      story9x16,
    ));
    tick();
  },
};
