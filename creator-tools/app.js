// Creator Tools mockup: cleaned-up story map + drop-in script view + test play.
const V = window.CACHE_V || '';
const [{ icon }, model, parser, { STORIES }, { SAMPLE_SCRIPT }, { createMapView }, { createScriptView }, { createPlayer }] = await Promise.all([
  import(`./icons.js${V}`), import(`./model.js${V}`), import(`./parser.js${V}`),
  import(`./data/stories.js${V}`), import(`./data/sample-script.js${V}`),
  import(`./mapview.js${V}`), import(`./scriptview.js${V}`), import(`./play.js${V}`),
]);

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (s) => document.querySelector(s);
const TIPS_KEY = 'ct-tips-seen-v2';
const TOAST_MS = 3600;
const TOAST_ACTION_MS = 6000;

let toastTimer = null;
function toast(msg, opts = {}) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(msg)}</span>${opts.action ? `<button class="toast__act">${esc(opts.action)}</button>` : ''}`;
  t.hidden = false;
  if (opts.action) t.querySelector('.toast__act').onclick = () => { t.hidden = true; opts.fn(); };
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, opts.action ? TOAST_ACTION_MS : TOAST_MS);
}

const stories = STORIES.map((s) => ({ ...s }));
let current = null; let lang = 'en'; let tab = 'map';
const params = new URLSearchParams(location.search);
let compare = params.get('v') === 'today' ? 'today' : 'clean';
let playingFrom = null;

const ctx = {
  icon, esc, toast, ...model, ...parser, SAMPLE_SCRIPT,
  files: new Map(),
  openAbout,
  showInScript(id) {
    if (current && current.id === 'script') { setTab('script'); setTimeout(() => scriptView.focus(id), 60); }
    else toast('This story wasn\'t made from a script. Try the Script tab with The Summons.');
  },
  makeStory(story) {
    const i = stories.findIndex((s) => s.id === 'script');
    if (i >= 0) stories[i] = story; else stories.push(story);
    fillPicker(); pick('script', true); setTab('map');
  },
  play(m, fromId, l) {
    if (!m) return;
    playingFrom = tab;
    mapView.closePanel();
    player.open(m, fromId, l || lang);
  },
  onPlayStep(trail) {
    if (playingFrom === 'map' && tab === 'map') mapView.showTrail(trail);
    if (!trail) { playingFrom = null; if (tab === 'map') { mapView.showTrail(null); mapView.refit(); } }
  },
};

const mapView = createMapView($('#mapView'), ctx);
const scriptView = createScriptView($('#scriptView'), ctx);
const player = createPlayer($('#views'), ctx);

function fillPicker() {
  $('#storyPick').innerHTML = stories.map((s) => `<option value="${s.id}">${esc(s.title)}${s.id === 'script' ? ' (from your script)' : ''}</option>`).join('');
  if (current) $('#storyPick').value = current.id;
}
function pick(id, fresh) {
  const raw = stories.find((s) => s.id === id) || stories[0];
  current = raw; $('#storyPick').value = raw.id;
  player.close();
  mapView.show(model.prepare(raw), { fresh });
  const u = new URL(location.href);
  if (raw.id !== 'alice' && raw.id !== 'script') u.searchParams.set('story', raw.id); else u.searchParams.delete('story');
  history.replaceState(null, '', u);
}
$('#storyPick').addEventListener('change', (e) => pick(e.target.value));

function setTab(t) {
  if (t !== tab) player.close();
  tab = t;
  document.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
  $('#mapView').hidden = t !== 'map'; $('#scriptView').hidden = t !== 'script';
  $('#storyPick').hidden = t === 'script';
  if (t === 'map') mapView.refit(); else scriptView.redraw();
  history.replaceState(null, '', location.pathname + location.search + (t === 'script' ? '#script' : ''));
  renderDevbar();
}
$('#tabMap').innerHTML = `${icon('map')} Map`;
$('#tabScript').innerHTML = `${icon('script')} Script`;
document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));

function renderLang() {
  $('#langSwitch').innerHTML = `<span class="lang__label">${icon('lang', 15)} Language</span>
    <button class="chipbtn chipbtn--plain" data-lang="en" aria-pressed="${lang === 'en'}">EN</button>
    <button class="chipbtn" data-lang="fr" aria-pressed="${lang === 'fr'}">FR</button>`;
}
$('#langSwitch').addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  lang = b.dataset.lang; renderLang(); mapView.setLang(lang); scriptView.setLang(lang); player.setLang(lang);
  if (lang === 'fr') toast('French view: chapters without French are marked.');
});

function renderDevbar() {
  $('#devbar').innerHTML = `<span class="draft">DRAFT</span><b>Creator Tools mockup</b>
    ${tab === 'map' ? `<span class="devbar__lbl">Map look:</span><span class="seg"><button data-cmp="today" aria-pressed="${compare === 'today'}">Today</button><button data-cmp="clean" aria-pressed="${compare === 'clean'}">New</button></span>` : '<span class="devbar__lbl">Paste a script, or start from an example</span>'}
    <span class="spacer"></span><button class="link" id="keysBtn">${icon('keys', 14)} Shortcuts</button><button class="link" id="aboutBtn">What's in this mockup?</button>`;
}
$('#devbar').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.cmp) {
    compare = b.dataset.cmp; player.close(); mapView.setCompare(compare); renderDevbar();
    const u = new URL(location.href); if (compare === 'today') u.searchParams.set('v', 'today'); else u.searchParams.delete('v');
    history.replaceState(null, '', u);
  }
  if (b.id === 'aboutBtn') openAbout();
  if (b.id === 'keysBtn') openAbout('keys');
});

const KEYS = [
  ['P', 'Play from the start, or from the chapter you picked'], ['/', 'Find a chapter'], ['N', 'New chapter'], ['F', 'Fit the whole story'],
  ['Enter', 'Rename the chapter you picked'], ['⌘Z / ⇧⌘Z', 'Undo / redo'], ['Esc', 'Close the panel or clear Find'], ['?', 'This list'],
];
function openAbout(section) {
  const a = $('#about');
  if (section === 'keys') {
    a.innerHTML = `<div class="about__card"><h2>Shortcuts</h2><p class="small muted">On the map.</p><table>${KEYS.map(([k, t]) => `<tr><td><kbd>${k}</kbd></td><td>${t}</td></tr>`).join('')}</table>
      <p class="small muted">In the script: type <b>→</b> or <b>-&gt;</b> after a choice and pick a chapter with ↑ ↓ and Enter.</p><button class="btn btn--fill" id="aboutClose">Got it</button></div>`;
  } else if (section === 'map') {
    a.innerHTML = `<div class="about__card"><h2>How the map works</h2><table>
      <tr><td>Rows</td><td>One row per stop, in walking order. A chapter with location on starts a new stop. Endings line up on the right.</td></tr>
      <tr><td>Click a chapter</td><td>Opens its details. Rename it, change its choices, mark it Start or Ending, turn location on or off.</td></tr>
      <tr><td>The dot on a choice</td><td>Drag it onto another chapter to send the choice there. Drag it onto empty space to make a new chapter. The dot on “Add choice” makes a new choice.</td></tr>
      <tr><td>Play</td><td>Try the story on a phone right here. Location chapters ask you to pretend you've arrived.</td></tr>
      <tr><td>Find and Highlight</td><td>Light up chapters by name or text, or by what's in them (puzzles, video, needs French…).</td></tr>
      <tr><td>Lines</td><td>Solid goes forward, dashed loops back. A line that drops a row goes to the next stop.</td></tr>
      <tr><td>Red / amber</td><td>Red blocks publishing. Amber is worth checking.</td></tr></table>
      <button class="btn btn--fill" id="aboutClose">Got it</button></div>`;
  } else {
    a.innerHTML = `<div class="about__card">
    <h2>Creator Tools: map + script</h2>
    <p class="muted small">Draft mockup for Story City. Real stories from the public API (Alice Through The Tear, Frightnight Ghost Tours and its French twin). Nothing here changes the real Creator Tools.</p>
    <table>
      <tr><td>Map</td><td>One row per stop, readable names, big titles when zoomed out. Edit right on the map: drag a choice's dot to a chapter, drop it on empty space for a new chapter, rename, delete, undo.</td></tr>
      <tr><td>Play</td><td>Test the story on a phone from the start or any chapter, with a pretend walk for location chapters, puzzles and locked choices. The path you take lights up on the map.</td></tr>
      <tr><td>Find + Highlight</td><td>Find chapters by name or text. Light up puzzles, video, sound, locked choices, chapters that need French.</td></tr>
      <tr><td>Things to fix</td><td>Split into “Blocks publishing” and “Worth checking”, with the story at a glance (endings, shortest and longest way through).</td></tr>
      <tr><td>Script</td><td>Paste or drop a script. It's coloured as you type. Insert buttons for each kind of line. Type → and pick a chapter. Click a chapter on the right to jump to it in the script, and the other way round. Drop many files at once and they find their slots by name.</td></tr>
      <tr><td>Language</td><td>EN / FR marks chapters that need French, on the map, in the script and in Play.</td></tr>
      <tr><td>Today</td><td>The “Today” switch in the dark bar shows roughly how the real map looks now.</td></tr>
    </table>
    <p class="small muted">Ideas borrowed from Twine (find that lights up the map), Inky and Yarn Spinner (script and story side by side), articy:draft (checks), Charisma (play from any point) and VoiceMap (stops in walking order).</p>
    <button class="btn btn--fill" id="aboutClose">Got it</button></div>`;
  }
  a.hidden = false;
  a.querySelector('#aboutClose').focus();
}
$('#about').addEventListener('click', (e) => { if (e.target.id === 'about' || e.target.id === 'aboutClose') $('#about').hidden = true; });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!$('#about').hidden) { $('#about').hidden = true; return; }
  if (player.isOpen() && !e.target.closest('input, textarea, select')) player.close();
});

function showTips() {
  let seen = false; try { seen = !!localStorage.getItem(TIPS_KEY); } catch (e) { /* storage unavailable */ }
  if (seen || compare === 'today' || params.has('notips')) return;
  const t = $('#tips');
  t.innerHTML = `<b>New here? Three things to try</b><ol>
    <li>Click a chapter to see and edit it.</li>
    <li>Drag the dot on a choice onto another chapter.</li>
    <li>Press ${icon('play', 12)} <b>Play</b> to try the story on a phone.</li></ol>
    <button class="btn btn--fill sm" id="tipsOk">Got it</button>`;
  t.hidden = false;
  t.querySelector('#tipsOk').addEventListener('click', () => { t.hidden = true; try { localStorage.setItem(TIPS_KEY, '1'); } catch (e) { /* storage unavailable */ } });
}

fillPicker(); renderLang(); renderDevbar();
mapView.setCompare(compare);
pick(params.get('story') || 'alice');
setTab(location.hash === '#script' ? 'script' : 'map');
window.addEventListener('hashchange', () => setTab(location.hash === '#script' ? 'script' : 'map'));
if (tab === 'map') showTips();
