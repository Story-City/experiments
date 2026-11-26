// Gem map pins: the one bottom bar every version uses (V1, V2, V3). Change it here and every
// version changes. Feed, Library, + (Hunt mode camera to add a gem), Map, Gems.
// After a photo: Create gem now opens the publish sheet on Victoria's Gems page (location-gems),
// Create gem later puts the photo on top of its unsorted pile. The photo travels in sessionStorage.
// mount({ host, active, gemsHref | onGems, onTab(id) }): onTab returning false keeps the bar as it is.
(function () {
  const HANDOFF_KEY = 'gem-pins-camera-photo';
  const SHOT_W = 600;
  const SHOT_H = 800;
  const SHOT_PLACE = '[where you took it]';
  const FLASH_MS = 220;
  const TABS = [
    { id: 'feed', label: 'Feed' },
    { id: 'library', label: 'Library' },
    { id: 'add' },
    { id: 'map', label: 'Map' },
    { id: 'gems', label: 'Gems' },
  ];
  const ICONS = {
    "feed": "<svg class=\"gtb-ico\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M3.85714 2C2.83417 2 1.85309 2.39509 1.12973 3.09835C0.406376 3.80161 0 4.75544 0 5.75V18.25C0 19.2446 0.406376 20.1984 1.12973 20.9016C1.85309 21.6049 2.83417 22 3.85714 22H20.1429C21.1658 22 22.1469 21.6049 22.8703 20.9016C23.5936 20.1984 24 19.2446 24 18.25V5.75C24 4.75544 23.5936 3.80161 22.8703 3.09835C22.1469 2.39509 21.1658 2 20.1429 2H3.85714ZM1.71429 5.75C1.71429 5.19747 1.94005 4.66756 2.34191 4.27686C2.74378 3.88616 3.28882 3.66667 3.85714 3.66667H20.1429C20.7112 3.66667 21.2562 3.88616 21.6581 4.27686C22.0599 4.66756 22.2857 5.19747 22.2857 5.75V18.25C22.2857 18.8025 22.0599 19.3324 21.6581 19.7231C21.2562 20.1138 20.7112 20.3333 20.1429 20.3333H3.85714C3.28882 20.3333 2.74378 20.1138 2.34191 19.7231C1.94005 19.3324 1.71429 18.8025 1.71429 18.25V5.75ZM8.57143 8.6675V15.3333C8.57153 15.4771 8.6099 15.6185 8.68283 15.7436C8.75575 15.8687 8.86074 15.9734 8.98758 16.0474C9.11442 16.1213 9.25879 16.1622 9.40666 16.1658C9.55453 16.1695 9.70086 16.1359 9.83143 16.0683L16.2583 12.7358C16.3952 12.6647 16.5097 12.5588 16.5895 12.4293C16.6693 12.2999 16.7115 12.1518 16.7115 12.0008C16.7115 11.8499 16.6693 11.7018 16.5895 11.5724C16.5097 11.4429 16.3952 11.337 16.2583 11.2658L9.83229 7.9325C9.70163 7.86468 9.55513 7.83093 9.40706 7.83454C9.259 7.83815 9.11442 7.87901 8.98743 7.95312C8.86044 8.02723 8.75537 8.13207 8.68246 8.25742C8.60955 8.38276 8.5713 8.5235 8.57143 8.6675Z\" fill=\"currentColor\"/></svg>",
    "library": "<svg class=\"gtb-ico\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><rect x=\"6\" y=\"4\" width=\"13\" height=\"17\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M15 10V8\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M4 9H8\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M4 13H8\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M4 17H8\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>",
    "map": "<svg class=\"gtb-ico\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3 1.01v11.7l-3-1.16V6.46zm14 11.08l-3 1.16V7.18l3-1.16v11.52z\" fill=\"currentColor\"/></svg>",
    "gems": "<svg class=\"gtb-ico gtb-gem\" viewBox=\"0 0 24 22\" fill=\"none\" aria-hidden=\"true\"><path d=\"M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/><path d=\"M1.5 7.5H22.5M7 1.5L9 7.5L12 20.5L15 7.5L17 1.5\" stroke=\"currentColor\" stroke-width=\"1\" stroke-linejoin=\"round\" opacity=\"0.55\"/></svg>"
  };
  const FLIP = '<svg viewBox="0 0 18 21" aria-hidden="true"><path d="M8.75.83C6.54.83 4.54 1.66 3 3L0 0v7.5h7.5L4.48 4.48a6.2 6.2 0 0 1 4.27-1.56c2.95 0 5.46 1.92 6.33 4.58l1.98-.65C15.9 3.36 12.63.83 8.75.83Z"/><path d="M8.31 20.17c2.2 0 4.2-.83 5.75-2.17l3 3v-7.5h-7.5l3.02 3.02a6.2 6.2 0 0 1-4.27 1.56c-2.95 0-5.46-1.92-6.33-4.58L0 14.15c1.16 3.49 4.43 6.02 8.31 6.02Z"/></svg>';
  const PLUS = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
  const BACK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>';

  function tabHtml(t, active) {
    if (t.id === 'add') {
      return '<button type="button" class="gtb-tab gtb-add" data-gtb="add" aria-label="Add a gem"><span class="gtb-add-plus" aria-hidden="true">' + PLUS + '</span></button>';
    }
    const on = t.id === active;
    return '<button type="button" class="gtb-tab' + (on ? ' is-active' : '') + '" data-gtb="' + t.id + '" aria-pressed="' + on + '"' + (on ? ' aria-current="page"' : '') + '>' + ICONS[t.id] + '<span>' + t.label + '</span></button>';
  }

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
    const nav = document.createElement('nav');
    nav.className = 'gtb';
    nav.setAttribute('aria-label', 'Main');
    nav.innerHTML = TABS.map((t) => tabHtml(t, opts.active || 'map')).join('');
    const cam = document.createElement('section');
    cam.className = 'gtb-cam';
    cam.hidden = true;
    cam.setAttribute('aria-label', 'Add a gem');
    cam.innerHTML = CAM_HTML;
    host.append(nav, cam);

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
        if (on && id === (opts.active || 'map')) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
      });
    }

    nav.addEventListener('click', (e) => {
      const b = e.target.closest('[data-gtb]');
      if (!b) return;
      const id = b.dataset.gtb;
      if (id === 'add') openCamera();
      else if (id === 'gems') openGems();
      else if (!opts.onTab || opts.onTab(id) !== false) setActive(id);
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

  window.GemTabBar = { mount };
})();
