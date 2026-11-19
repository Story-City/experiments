// Creator Tools mockup: cleaned-up story map + drop-in script view.
const V = window.CACHE_V || '';
const [{ icon }, model, parser, { STORIES }, { SAMPLE_SCRIPT }, { createMapView }, { createScriptView }] = await Promise.all([
  import(`./icons.js${V}`), import(`./model.js${V}`), import(`./parser.js${V}`),
  import(`./data/stories.js${V}`), import(`./data/sample-script.js${V}`),
  import(`./mapview.js${V}`), import(`./scriptview.js${V}`),
]);

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (s) => document.querySelector(s);

let toastTimer = null;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}

const stories = STORIES.map((s) => ({ ...s }));
let current = null; let lang = 'en'; let tab = 'map';
const params = new URLSearchParams(location.search);
let compare = params.get('v') === 'today' ? 'today' : 'clean';

const ctx = {
  icon, esc, toast, ...model, ...parser, SAMPLE_SCRIPT,
  openAbout,
  showInScript(id) {
    if (current && current.id === 'script') { setTab('script'); setTimeout(() => scriptView.focus(id), 60); }
    else toast('This story wasn\'t made from a script. Try the Script tab with The Summons.');
  },
  makeStory(story) {
    const i = stories.findIndex((s) => s.id === 'script');
    if (i >= 0) stories[i] = story; else stories.push(story);
    fillPicker(); pick('script'); setTab('map');
  },
};

const mapView = createMapView($('#mapView'), ctx);
const scriptView = createScriptView($('#scriptView'), ctx);

function fillPicker() {
  $('#storyPick').innerHTML = stories.map((s) => `<option value="${s.id}">${esc(s.title)}${s.id === 'script' ? ' (from your script)' : ''}</option>`).join('');
  if (current) $('#storyPick').value = current.id;
}
function pick(id) {
  const raw = stories.find((s) => s.id === id) || stories[0];
  current = raw; $('#storyPick').value = raw.id;
  mapView.show(model.prepare(raw));
}
$('#storyPick').addEventListener('change', (e) => pick(e.target.value));

function setTab(t) {
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
  lang = b.dataset.lang; renderLang(); mapView.setLang(lang); scriptView.setLang(lang);
  if (lang === 'fr') toast('French view: chapters without French are marked.');
});

function renderDevbar() {
  $('#devbar').innerHTML = `<span class="draft">DRAFT</span><b>Creator Tools mockup</b>
    ${tab === 'map' ? `<span>Map look:</span><span class="seg"><button data-cmp="today" aria-pressed="${compare === 'today'}">Today</button><button data-cmp="clean" aria-pressed="${compare === 'clean'}">Cleaned up</button></span>` : '<span>Paste a script, or try The Summons</span>'}
    <span class="spacer"></span><button class="link" id="aboutBtn">What's in this mockup?</button>`;
}
$('#devbar').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.cmp) {
    compare = b.dataset.cmp; mapView.setCompare(compare); renderDevbar();
    const u = new URL(location.href); if (compare === 'today') u.searchParams.set('v', 'today'); else u.searchParams.delete('v');
    history.replaceState(null, '', u);
  }
  if (b.id === 'aboutBtn') openAbout();
});

function openAbout() {
  const a = $('#about');
  a.innerHTML = `<div class="about__card">
    <h2>Creator Tools: map + script</h2>
    <p class="muted small">Draft mockup for Story City. Real stories from the public API (Alice Through The Tear, Frightnight Ghost Tours and its French twin). Nothing here changes the real Creator Tools.</p>
    <table>
      <tr><td>Map, cleaned up</td><td>Zoomed out, each chapter is a big readable title. Zoom in for choices. Choice names show once (not on the lines too). Colours group chapters by stop, and endings line up in one column. The overview folds away. Icons show location, video, sound, image, puzzle and chat.</td></tr>
      <tr><td>Map, Today</td><td>Roughly how the real map looks now, to compare.</td></tr>
      <tr><td>Script</td><td>Paste or drop a script. We find chapters, choices, chat bubbles, puzzles (decrypt, remix, photo, riddle) and image or sound notes, which become file slots. Change where a choice goes from the dropdown or by dragging it onto a chapter, and the script updates. <b>Make chapters</b> puts it on the map.</td></tr>
      <tr><td>Language</td><td>EN / FR marks the chapters that still need French, on the map and in the script.</td></tr>
      <tr><td>To check</td><td>The amber "no readable name" check is new. It comes from the Oct 31 Creator Tools proposal.</td></tr>
    </table>
    <p class="small muted">Ask: Q4 "Support needed" slide (chat bubble tools, photo puzzle remix/decrypt tools, localisation filtering).</p>
    <button class="btn btn--fill" id="aboutClose">Got it</button></div>`;
  a.hidden = false;
  a.querySelector('#aboutClose').focus();
}
$('#about').addEventListener('click', (e) => { if (e.target.id === 'about' || e.target.id === 'aboutClose') $('#about').hidden = true; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('#about').hidden = true; });

fillPicker(); renderLang(); renderDevbar();
mapView.setCompare(compare);
pick(params.get('story') || 'alice');
setTab(location.hash === '#script' ? 'script' : 'map');
window.addEventListener('hashchange', () => setTab(location.hash === '#script' ? 'script' : 'map'));
