// Gem map pins: the one bottom bar every version uses (V1, V2, V3). Change it here and every
// version changes. The home tab, the other home candidate, the create button (Hunt mode camera to
// add a gem), Gems, Stories. Home is Feed or Map (GemTabBar.setHome): a map page opens on it, and
// Feed shows a placeholder over the map until there is a real feed.
// You (GemTabBar.setYou): a sixth tab ('tab'), or a profile photo at the map's top right ('right') or
// top left ('left'). Either opens Settings, where Home can be changed too.
// The create button has four looks: capture (the outline camera inside viewfinder corners),
// subtle (a thin circled plus like the other tabs), camera (an outline camera like the other tabs) and hunt
// (the app's Hunt mode shutter: purple ring, white disc, faint camera). Every look is titled Create.
// The choice is shared by every page via
// localStorage; GemTabBar.setCreateLook(look) switches them. Tab titles can be hidden the same way
// (GemTabBar.setLabels('on' | 'off')), and the bar widened part way or nearly edge to edge (setWidth('medium' | 'spread')).
// After a photo: Create gem now opens the publish sheet on Victoria's Gems page (location-gems),
// Create gem later puts the photo on top of its unsorted pile. The photo travels in sessionStorage.
// mount({ host, active, gemsHref | onGems, onTab(id) }): onTab returning false keeps the bar as it is.
(function () {
  const HANDOFF_KEY = 'gem-pins-camera-photo';
  const SHOT_W = 600;
  const SHOT_H = 800;
  const SHOT_PLACE = '[where you took it]';
  const FLASH_MS = 220;
  const LOOK_KEY = 'gem-pins-create-look';
  const LOOKS = ['subtle', 'capture', 'camera', 'hunt'];
  const LABELS_KEY = 'gem-pins-tab-labels';
  const LABELS = ['on', 'off'];
  const WIDTH_KEY = 'gem-pins-tab-width';
  const WIDTHS = ['compact', 'medium', 'spread'];
  const HOME_KEY = 'gem-pins-tab-home';
  const HOMES = ['map', 'feed'];
  const FEED_PLACEHOLDER = '[feed: home page]';
  const CHANGE_EVENT = 'gem-tabbar-change';
  const YOU_KEY = 'gem-pins-you';
  const YOUS = ['right', 'left', 'tab'];
  const AVATAR_INITIAL = 'M';
  const PRIVACY_ROW = 'privacy';
  const SETTINGS_ROWS = ['[notifications]', PRIVACY_ROW, '[account]', '[help]'];
  // The Gems page publish flow reads gem-pins-gem-audience as its default audience: keep the key and values
  const PRIVACY_CHOICES = [
    { key: 'gem-pins-gem-audience', title: 'Who sees my new gems', note: 'Where each new gem starts when you&nbsp;publish',
      values: ['me', 'friends', 'everyone'], labels: ['Only me', 'Friends', 'Everyone'] },
    { key: 'gem-pins-share-address', title: 'Share the address when I&nbsp;publish', note: 'Off shows the area, not the&nbsp;street',
      values: ['off', 'on'], toggle: true },
    { key: 'gem-pins-profile-audience', title: 'Who can see my profile', note: 'Your name, photo and public&nbsp;gems',
      values: ['friends', 'everyone'], labels: ['Friends', 'Everyone'] },
  ];
  const LOCATION_VALUE = 'While using the app';
  const LOCATION_NOTE = 'Finds gems and story steps near&nbsp;you';
  const settingsSheets = [];
  const bars = [];
  const homeHandlers = [];
  const TABS = [
    { id: 'map', label: 'Map' },
    { id: 'feed', label: 'Feed' },
    { id: 'add' },
    { id: 'gems', label: 'Gems' },
    { id: 'stories', label: 'Stories' },
    { id: 'you', label: 'You' },
  ];
  const ICONS = {
    "you": "<b class=\"gtb-av gtb-av-tab\" aria-hidden=\"true\">" + AVATAR_INITIAL + "</b>",
    "feed": "<svg class=\"gtb-ico\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M3.85714 2C2.83417 2 1.85309 2.39509 1.12973 3.09835C0.406376 3.80161 0 4.75544 0 5.75V18.25C0 19.2446 0.406376 20.1984 1.12973 20.9016C1.85309 21.6049 2.83417 22 3.85714 22H20.1429C21.1658 22 22.1469 21.6049 22.8703 20.9016C23.5936 20.1984 24 19.2446 24 18.25V5.75C24 4.75544 23.5936 3.80161 22.8703 3.09835C22.1469 2.39509 21.1658 2 20.1429 2H3.85714ZM1.71429 5.75C1.71429 5.19747 1.94005 4.66756 2.34191 4.27686C2.74378 3.88616 3.28882 3.66667 3.85714 3.66667H20.1429C20.7112 3.66667 21.2562 3.88616 21.6581 4.27686C22.0599 4.66756 22.2857 5.19747 22.2857 5.75V18.25C22.2857 18.8025 22.0599 19.3324 21.6581 19.7231C21.2562 20.1138 20.7112 20.3333 20.1429 20.3333H3.85714C3.28882 20.3333 2.74378 20.1138 2.34191 19.7231C1.94005 19.3324 1.71429 18.8025 1.71429 18.25V5.75ZM8.57143 8.6675V15.3333C8.57153 15.4771 8.6099 15.6185 8.68283 15.7436C8.75575 15.8687 8.86074 15.9734 8.98758 16.0474C9.11442 16.1213 9.25879 16.1622 9.40666 16.1658C9.55453 16.1695 9.70086 16.1359 9.83143 16.0683L16.2583 12.7358C16.3952 12.6647 16.5097 12.5588 16.5895 12.4293C16.6693 12.2999 16.7115 12.1518 16.7115 12.0008C16.7115 11.8499 16.6693 11.7018 16.5895 11.5724C16.5097 11.4429 16.3952 11.337 16.2583 11.2658L9.83229 7.9325C9.70163 7.86468 9.55513 7.83093 9.40706 7.83454C9.259 7.83815 9.11442 7.87901 8.98743 7.95312C8.86044 8.02723 8.75537 8.13207 8.68246 8.25742C8.60955 8.38276 8.5713 8.5235 8.57143 8.6675Z\" fill=\"currentColor\"/></svg>",
    "stories": "<svg class=\"gtb-ico\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 6.6C10 5.1 6.9 4.6 3 5.1v13.4c3.9-.5 7 0 9 1.5 2-1.5 5.1-2 9-1.5V5.1c-3.9-.5-7 0-9 1.5zM12 6.6V20\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"/><path d=\"M15.2 4.9V11.6l1.8-1.5 1.8 1.5V4.8z\" fill=\"currentColor\"/></svg>",
    "map": "<svg class=\"gtb-ico\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3 1.01v11.7l-3-1.16V6.46zm14 11.08l-3 1.16V7.18l3-1.16v11.52z\" fill=\"currentColor\"/></svg>",
    "gems": "<svg class=\"gtb-ico gtb-gem\" viewBox=\"0 0 24 22\" fill=\"none\" aria-hidden=\"true\"><path d=\"M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/><path d=\"M1.5 7.5H22.5M7 1.5L9 7.5L12 20.5L15 7.5L17 1.5\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linejoin=\"round\" opacity=\"0.55\"/></svg>"
  };
  const FLIP = '<svg viewBox="0 0 18 21" aria-hidden="true"><path d="M8.75.83C6.54.83 4.54 1.66 3 3L0 0v7.5h7.5L4.48 4.48a6.2 6.2 0 0 1 4.27-1.56c2.95 0 5.46 1.92 6.33 4.58l1.98-.65C15.9 3.36 12.63.83 8.75.83Z"/><path d="M8.31 20.17c2.2 0 4.2-.83 5.75-2.17l3 3v-7.5h-7.5l3.02 3.02a6.2 6.2 0 0 1-4.27 1.56c-2.95 0-5.46-1.92-6.33-4.58L0 14.15c1.16 3.49 4.43 6.02 8.31 6.02Z"/></svg>';
  const CAPTURE = '<svg viewBox="0 0 24 24" fill="none"><path d="M2 6.5V4a2 2 0 0 1 2-2h2.5M17.5 2H20a2 2 0 0 1 2 2v2.5M22 17.5V20a2 2 0 0 1-2 2h-2.5M6.5 22H4a2 2 0 0 1-2-2v-2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.1 8.4 10.8 7.4h2.4l.7 1h1.9a1.4 1.4 0 0 1 1.4 1.4v5.4a1.4 1.4 0 0 1-1.4 1.4H8.2a1.4 1.4 0 0 1-1.4-1.4V9.8a1.4 1.4 0 0 1 1.4-1.4Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="12.6" r="2.1" stroke="currentColor" stroke-width="1.4"/></svg>';
  const CAMERA = '<svg viewBox="0 0 24 24" fill="none"><path d="M8.6 5.6 9.7 4h4.6l1.1 1.6H19a2.4 2.4 0 0 1 2.4 2.4v9.6a2.4 2.4 0 0 1-2.4 2.4H5a2.4 2.4 0 0 1-2.4-2.4V8A2.4 2.4 0 0 1 5 5.6Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12.6" r="3.7" stroke="currentColor" stroke-width="1.7"/></svg>';
  const PLUS = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
  const BACK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>';

  function tabHtml(t, active) {
    if (t.id === 'add') {
      return '<button type="button" class="gtb-tab gtb-add" data-gtb="add" aria-label="Create"><span class="gtb-add-plus" aria-hidden="true">' + PLUS + '</span><span class="gtb-add-label" aria-hidden="true">Create</span></button>';
    }
    const on = t.id === active;
    return '<button type="button" class="gtb-tab' + (on ? ' is-active' : '') + '" data-gtb="' + t.id + '" aria-pressed="' + on + '"' + (on ? ' aria-current="page"' : '') + '>' + ICONS[t.id] + '<span>' + t.label + '</span></button>';
  }

  const SETTINGS_HTML =
    '<header class="gtb-set-top"><button type="button" class="gtb-set-back" aria-label="Back">' + BACK + '</button><h2>Settings</h2></header>' +
    '<div class="gtb-set-me"><b class="gtb-av gtb-av-lg" aria-hidden="true">' + AVATAR_INITIAL + '</b>' +
    '<div><p class="gtb-set-name">[your name]</p><p class="gtb-set-edit">[edit profile]</p></div></div>' +
    '<div class="gtb-set-group"><div class="gtb-set-home"><p class="gtb-set-label">Home page</p>' +
    '<p class="gtb-set-note">When you open Story City, start&nbsp;on</p>' +
    '<div class="gtb-seg" role="group" aria-label="Home page">' +
    '<button type="button" data-gtb-home="feed">Feed</button><button type="button" data-gtb-home="map">Map</button></div></div></div>' +
    '<div class="gtb-set-group">' + SETTINGS_ROWS.map((r) => (r === PRIVACY_ROW
      ? '<button type="button" class="gtb-set-row gtb-set-link" data-gtb-open="privacy">Privacy</button>'
      : '<p class="gtb-set-row">' + r + '</p>')).join('') + '</div>';

  function privacyChoiceHtml(c) {
    const head = '<p class="gtb-set-label">' + c.title + '</p><p class="gtb-set-note">' + c.note + '</p>';
    if (c.toggle) {
      return '<div class="gtb-set-home"><p class="gtb-set-label">' + c.title + '</p><div class="gtb-set-switchrow"><p class="gtb-set-note">' + c.note + '</p>' +
        '<button type="button" class="gtb-switch" role="switch" data-gtb-key="' + c.key + '" aria-label="' + c.title.replace('&nbsp;', ' ') + '"></button></div></div>';
    }
    return '<div class="gtb-set-home">' + head + '<div class="gtb-seg' + (c.values.length === 3 ? ' is-3' : '') + '" role="group" aria-label="' + c.title + '">' +
      c.values.map((v, i) => '<button type="button" data-gtb-key="' + c.key + '" data-gtb-val="' + v + '">' + c.labels[i] + '</button>').join('') + '</div></div>';
  }
  const PRIVACY_HTML =
    '<header class="gtb-set-top"><button type="button" class="gtb-set-back" aria-label="Back">' + BACK + '</button><h2>Privacy</h2></header>' +
    '<div class="gtb-set-group">' + privacyChoiceHtml(PRIVACY_CHOICES[0]) + privacyChoiceHtml(PRIVACY_CHOICES[1]) + '</div>' +
    '<div class="gtb-set-group"><div class="gtb-set-home"><div class="gtb-set-switchrow"><p class="gtb-set-label">Location</p>' +
    '<p class="gtb-set-value">' + LOCATION_VALUE + '</p></div><p class="gtb-set-note">' + LOCATION_NOTE + '</p></div></div>' +
    '<div class="gtb-set-group">' + privacyChoiceHtml(PRIVACY_CHOICES[2]) + '</div>';

  const CAM_HTML =
    '<video class="gtb-cam-video" playsinline muted autoplay></video>' +
    '<p class="gtb-cam-hint" hidden>Camera preview (no camera allowed here)</p>' +
    '<button type="button" class="gtb-cam-back" aria-label="Close">' + BACK + '</button>' +
    '<div class="gtb-cam-bar"><span class="gtb-cam-spacer" aria-hidden="true"></span>' +
    '<button type="button" class="gtb-cam-shutter" aria-label="Take photo"></button>' +
    '<span class="gtb-cam-spacer"><button type="button" class="gtb-cam-flip" aria-label="Flip camera">' + FLIP + '</button></span></div>' +
    '<div class="gtb-cam-confirm" hidden><div class="gtb-cam-shot"><img alt="The photo you just took"></div>' +
    '<div class="gtb-cam-actions"><button type="button" class="gtb-btn gtb-btn-primary" data-gtb-cam="now">Create gem now</button>' +
    '<div class="gtb-cam-row"><button type="button" class="gtb-btn gtb-btn-outline" data-gtb-cam="retake">Retake</button>' +
    '<button type="button" class="gtb-btn gtb-btn-outline" data-gtb-cam="later">Create gem later</button></div></div></div>';

  function mount(opts) {
    const host = opts.host;
    const isMapPage = (opts.active || 'map') === 'map';
    const startOn = isMapPage ? readHome() : opts.active;
    const nav = document.createElement('nav');
    nav.className = 'gtb';
    nav.setAttribute('aria-label', 'Main');
    nav.innerHTML = TABS.map((t) => tabHtml(t, startOn)).join('');
    const feed = document.createElement('section');
    feed.className = 'gtb-feed';
    feed.setAttribute('aria-label', 'Feed');
    feed.innerHTML = '<p>' + FEED_PLACEHOLDER + '</p>';
    const youBtn = document.createElement('button');
    youBtn.type = 'button';
    youBtn.className = 'gtb-you';
    youBtn.setAttribute('aria-label', 'You: profile and settings');
    youBtn.innerHTML = ICONS.you;
    const settings = document.createElement('section');
    settings.className = 'gtb-set';
    settings.hidden = true;
    settings.setAttribute('aria-label', 'Settings');
    settings.innerHTML = SETTINGS_HTML;
    settingsSheets.push(settings);
    const privacy = document.createElement('section');
    privacy.className = 'gtb-set gtb-priv';
    privacy.hidden = true;
    privacy.setAttribute('aria-label', 'Privacy');
    privacy.innerHTML = PRIVACY_HTML;
    privacySheets.push(privacy);
    paintPrivacy(privacy);
    const cam = document.createElement('section');
    cam.className = 'gtb-cam';
    cam.hidden = true;
    cam.setAttribute('aria-label', 'Add a gem');
    cam.innerHTML = CAM_HTML;
    host.append(nav, feed, youBtn, settings, privacy, cam);
    bars.push(nav);
    paintHome(nav, readHome());
    paintSettingsHome(settings, readHome());
    youPainters.push((you) => {
      nav.classList.toggle('has-you-tab', you === 'tab');
      youBtn.hidden = !isMapPage || you === 'tab';
      youBtn.classList.toggle('is-left', you === 'left');
      host.classList.toggle('gtb-you-right', isMapPage && you === 'right');
      host.classList.toggle('gtb-you-left', isMapPage && you === 'left');
    });
    youPainters[youPainters.length - 1](readYou());
    const openSettings = () => { settings.hidden = false; };
    youBtn.addEventListener('click', openSettings);
    settings.querySelector('.gtb-set-back').addEventListener('click', () => { settings.hidden = true; });
    settings.addEventListener('click', (e) => {
      const b = e.target.closest('[data-gtb-home]');
      if (b) setHome(b.dataset.gtbHome);
      if (e.target.closest('[data-gtb-open="privacy"]')) privacy.hidden = false;
    });
    privacy.querySelector('.gtb-set-back').addEventListener('click', () => { privacy.hidden = true; });
    privacy.addEventListener('click', (e) => {
      const b = e.target.closest('[data-gtb-key]');
      if (!b) return;
      const choice = PRIVACY_CHOICES.find((c) => c.key === b.dataset.gtbKey);
      const next = choice.toggle ? (readSetting(choice.key, choice.values) === 'on' ? 'off' : 'on') : b.dataset.gtbVal;
      writeSetting(choice.key, next);
      privacySheets.forEach(paintPrivacy);
    });
    paintLook(nav, readLook());
    paintLabels(nav, readLabels());
    paintWidth(nav, readWidth());

    const q = (sel) => cam.querySelector(sel);
    const video = q('.gtb-cam-video');
    const confirm = q('.gtb-cam-confirm');
    const shot = q('.gtb-cam-shot img');
    let stream = null;
    let facing = 'environment';

    function stopStream() {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      stream = null;
      video.srcObject = null;
    }
    async function startCamera() {
      stopStream();
      q('.gtb-cam-hint').hidden = true;
      video.classList.toggle('is-front', facing === 'user');
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
        video.srcObject = stream;
      } catch (e) {
        q('.gtb-cam-hint').hidden = false;
      }
    }
    function openCamera() {
      cam.hidden = false;
      confirm.hidden = true;
      startCamera();
    }
    function closeCamera() {
      stopStream();
      cam.hidden = true;
    }
    function capture() {
      const c = document.createElement('canvas');
      c.width = SHOT_W;
      c.height = SHOT_H;
      const ctx = c.getContext('2d');
      if (stream && video.videoWidth) {
        const scale = Math.max(SHOT_W / video.videoWidth, SHOT_H / video.videoHeight);
        const w = video.videoWidth * scale;
        const h = video.videoHeight * scale;
        if (facing === 'user') { ctx.translate(SHOT_W, 0); ctx.scale(-1, 1); }
        ctx.drawImage(video, (SHOT_W - w) / 2, (SHOT_H - h) / 2, w, h);
      } else {
        const g = ctx.createLinearGradient(0, 0, 0, SHOT_H);
        g.addColorStop(0, '#2a1a5e');
        g.addColorStop(1, '#0a0620');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, SHOT_W, SHOT_H);
      }
      return c.toDataURL('image/jpeg', 0.8);
    }
    function openGems() {
      if (opts.onGems) opts.onGems();
      else if (opts.gemsHref) location.href = opts.gemsHref;
    }
    function handOff(action) {
      try {
        sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ action, photo: shot.src, place: SHOT_PLACE }));
      } catch (e) {
        return;
      }
      closeCamera();
      openGems();
    }
    function setActive(id) {
      nav.querySelectorAll('[data-gtb]').forEach((b) => {
        if (b.dataset.gtb === 'add') return;
        const on = b.dataset.gtb === id;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
        if (on) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
      });
    }
    function showFeed(on) {
      feed.hidden = !on;
      host.classList.toggle('gtb-on-feed', on);
    }
    showFeed(isMapPage && startOn === 'feed');
    if (isMapPage) {
      homeHandlers.push((home) => {
        setActive(home);
        showFeed(home === 'feed');
      });
    }

    nav.addEventListener('click', (e) => {
      const b = e.target.closest('[data-gtb]');
      if (!b) return;
      const id = b.dataset.gtb;
      if (id === 'add') openCamera();
      else if (id === 'you') openSettings();
      else if (id === 'gems') openGems();
      else if (!opts.onTab || opts.onTab(id) !== false) {
        setActive(id);
        if (isMapPage && (id === 'feed' || id === 'map')) showFeed(id === 'feed');
      }
    });
    q('.gtb-cam-back').addEventListener('click', () => { if (!confirm.hidden) confirm.hidden = true; else closeCamera(); });
    q('.gtb-cam-flip').addEventListener('click', () => { facing = facing === 'environment' ? 'user' : 'environment'; startCamera(); });
    q('.gtb-cam-shutter').addEventListener('click', () => {
      shot.src = capture();
      cam.classList.add('is-flash');
      setTimeout(() => { cam.classList.remove('is-flash'); confirm.hidden = false; }, FLASH_MS);
    });
    cam.addEventListener('click', (e) => {
      const b = e.target.closest('[data-gtb-cam]');
      if (!b) return;
      if (b.dataset.gtbCam === 'retake') confirm.hidden = true;
      else handOff(b.dataset.gtbCam);
    });
    return { nav, cam, openCamera, closeCamera };
  }

  function readSetting(key, allowed) {
    try {
      const v = localStorage.getItem(key);
      return allowed.includes(v) ? v : allowed[0];
    } catch (e) {
      return allowed[0];
    }
  }
  function writeSetting(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private window: this page only */ }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  const readLabels = () => readSetting(LABELS_KEY, LABELS);
  function paintLabels(nav, labels) {
    nav.classList.toggle('is-no-labels', labels === 'off');
  }
  function setLabels(labels) {
    if (!LABELS.includes(labels)) return;
    writeSetting(LABELS_KEY, labels);
    bars.forEach((nav) => paintLabels(nav, labels));
  }
  const readHome = () => readSetting(HOME_KEY, HOMES);
  const youPainters = [];
  const privacySheets = [];
  function paintPrivacy(sheet) {
    PRIVACY_CHOICES.forEach((c) => {
      const v = readSetting(c.key, c.values);
      sheet.querySelectorAll('[data-gtb-key="' + c.key + '"]').forEach((b) => {
        if (c.toggle) b.setAttribute('aria-checked', String(v === 'on'));
        else b.setAttribute('aria-pressed', String(b.dataset.gtbVal === v));
      });
    });
  }
  const readYou = () => readSetting(YOU_KEY, YOUS);
  function setYou(you) {
    if (!YOUS.includes(you)) return;
    writeSetting(YOU_KEY, you);
    youPainters.forEach((fn) => fn(you));
  }
  function paintSettingsHome(sheet, home) {
    sheet.querySelectorAll('[data-gtb-home]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.gtbHome === home)));
  }
  function paintHome(nav, home) {
    const order = home === 'feed' ? ['feed', 'map'] : ['map', 'feed'];
    TABS.map((t) => (t.id === 'map' || t.id === 'feed' ? order.shift() : t.id))
      .forEach((id) => nav.append(nav.querySelector('[data-gtb="' + id + '"]')));
  }
  function applyHome(home) {
    bars.forEach((nav) => paintHome(nav, home));
    settingsSheets.forEach((sheet) => paintSettingsHome(sheet, home));
    homeHandlers.forEach((fn) => fn(home));
  }
  function setHome(home) {
    if (!HOMES.includes(home)) return;
    writeSetting(HOME_KEY, home);
    applyHome(home);
  }
  const readWidth = () => readSetting(WIDTH_KEY, WIDTHS);
  function paintWidth(nav, width) {
    nav.classList.toggle('is-medium', width === 'medium');
    nav.classList.toggle('is-spread', width === 'spread');
  }
  function setWidth(width) {
    if (!WIDTHS.includes(width)) return;
    writeSetting(WIDTH_KEY, width);
    bars.forEach((nav) => paintWidth(nav, width));
  }
  function readLook() {
    try {
      const v = localStorage.getItem(LOOK_KEY);
      return LOOKS.includes(v) ? v : LOOKS[0];
    } catch (e) {
      return LOOKS[0];
    }
  }
  function paintLook(nav, look) {
    const icon = nav.querySelector('.gtb-add-plus');
    icon.innerHTML = { capture: CAPTURE, camera: CAMERA, hunt: CAMERA }[look] || PLUS;
    LOOKS.forEach((l) => nav.classList.toggle('is-' + l, l === look));
  }
  function setCreateLook(look) {
    if (!LOOKS.includes(look)) return;
    try { localStorage.setItem(LOOK_KEY, look); } catch (e) { /* private window: this page only */ }
    bars.forEach((nav) => paintLook(nav, look));
  }
  // Another page (the wrapper, or a version in its frame) switched the look
  window.addEventListener('storage', (e) => {
    if (e.key === LOOK_KEY) bars.forEach((nav) => paintLook(nav, readLook()));
    if (e.key === LABELS_KEY) bars.forEach((nav) => paintLabels(nav, readLabels()));
    if (e.key === WIDTH_KEY) bars.forEach((nav) => paintWidth(nav, readWidth()));
    if (e.key === HOME_KEY) applyHome(readHome());
    if (e.key === YOU_KEY) youPainters.forEach((fn) => fn(readYou()));
    if (PRIVACY_CHOICES.some((c) => c.key === e.key)) privacySheets.forEach(paintPrivacy);
  });

  window.GemTabBar = { mount, setCreateLook, getCreateLook: readLook, setLabels, getLabels: readLabels, setWidth, getWidth: readWidth, setHome, getHome: readHome, setYou, getYou: readYou };
})();
