/* Victoria tickets — dock frost fills the solid ticket path only. No invented outline. */
(function (global) {
  const TICKET_ART_HEIGHT = 85;
  const TICKET_TOTAL_ART_WIDTH = 337;
  const TICKET_SEAM_X = 273.5;
  const TICKET_BODY_ART_WIDTH = TICKET_SEAM_X;
  const TICKET_STUB_ART_WIDTH = TICKET_TOTAL_ART_WIDTH - TICKET_SEAM_X;
  const TICKET_PIN_CIRCLE_SIZE = 28;
  const TICKET_PIN_OUTSIDE_GAP = -12;
  const TICKET_LEAD_GUTTER_ART = TICKET_PIN_CIRCLE_SIZE + TICKET_PIN_OUTSIDE_GAP;
  const TICKET_LEAD_GLYPH_ART = 13;
  const TICKET_LEAD_BASE_FILL = '#13123B';
  const TICKET_LEAD_BASE_CENTER = TICKET_PIN_CIRCLE_SIZE / 2;
  const TICKET_LEAD_BASE_RADIUS = TICKET_LEAD_BASE_CENTER - 0.5;
  const TICKET_PIN_CENTER_Y = TICKET_ART_HEIGHT / 2;
  const TICKET_STUB_ICON_INSET_LEFT = 283 - TICKET_SEAM_X;
  const TICKET_STUB_ICON_INSET_TOP = 5;
  const TICKET_STUB_ICON_SLOT_WIDTH = 331 - 283;
  const TICKET_STUB_ICON_SLOT_HEIGHT = 81 - 5;
  const STUB_ICON_FIT = 0.92;
  const STUB_ICON_NATIVE_WIDTH = 43;
  const STUB_ICON_NATIVE_HEIGHT = 72;
  const TITLE_LEADING_CLEARANCE_ART_PX = 38;
  const TITLE_TRAILING_CLEARANCE_ART_PX = 26;
  const TITLE_FONT_SIZE = 19;
  const TITLE_LINE_HEIGHT = 22;
  const RIP_DURATION_MS = 400;
  const RIP_RESET_DELAY_MS = 600;
  const DISPLAY_WIDTH_RATIO = 0.84;
  const DOCK_FILL = 'assets/dock-fill-figma.png';
  /* Match .dock frost: blur + scrim + dock-fill — no blush wash. */
  const FROST_BLUR_PX = 14;
  const FROST_SCRIM = [
    { offset: 0, color: 'rgba(26, 25, 45, 0)' },
    { offset: 0.22, color: 'rgba(26, 25, 45, 0.42)' },
    { offset: 1, color: 'rgba(26, 25, 45, 0.62)' },
  ];
  const FROST_DOCK_FILL_OPACITY = 0.38;
  const FROST_MAX_DPR = 2;
  const FROST_BLUR_PAD_MULT = 2;
  /* Soft double rim from ticket-glass (outer solid + InnerFrame) — whitish, not accent. */
  const TICKET_OUTLINE_OUTER = 'rgba(243, 240, 254, 0.34)';
  const TICKET_OUTLINE_INNER = 'rgba(243, 240, 254, 0.22)';
  const TICKET_OUTLINE_WIDTH = 1;
  const TICKET_INNER_FRAME_TX = 4;
  const TICKET_INNER_FRAME_TY = 5;
  const TICKET_INNER_PATH =
    'M256 0C258.761 3.31792e-06 261 2.23858 261 5V71C261 73.7614 258.761 76 256 76H5C2.23858 76 9.66418e-08 73.7614 0 71V63.1234C0 60.6348 1.86238 58.5859 4.2005 57.7336C12.2559 54.7975 18.0078 47.0712 18.0078 38C18.0078 28.9287 12.256 21.2018 4.20052 18.2654C1.8624 17.4131 0 15.3642 0 12.8756V5C0 2.23858 2.23858 0 5 0H256ZM322 0C324.761 5.15422e-07 327 2.23858 327 5V71C327 73.7614 324.761 76 322 76H284C281.239 76 279 73.7614 279 71V5C279 2.23858 281.239 0 284 0H322Z';

  /* Solid silhouette from ticket-full.svg (Subtract fill). */
  const TICKET_SOLID_PATH =
    'M269.534 0C269.799 0 270 0.235212 270 0.5C270 2.433 271.567 4 273.5 4C275.433 4 277 2.433 277 0.5C277 0.235212 277.201 0 277.466 0H332C334.761 0 337 2.23858 337 5V80C337 82.7614 334.761 85 332 85H277.466C277.201 85 277 84.7648 277 84.5C277 82.567 275.433 81 273.5 81C271.567 81 270 82.567 270 84.5C270 84.7648 269.799 85 269.534 85H5C2.23858 85 1.00668e-08 82.7614 0 80V65.7054C0 63.0502 2.11766 60.9291 4.63941 60.098C11.8183 57.7318 17 50.9714 17 43C17 35.0286 11.8183 28.2675 4.63941 25.9011C2.11767 25.0699 0 22.9488 0 20.2936V5C0 2.23858 2.23858 6.84544e-08 5 0H269.534ZM273.5 67C271.567 67 270 68.567 270 70.5C270 72.433 271.567 74 273.5 74C275.433 74 277 72.433 277 70.5C277 68.567 275.433 67 273.5 67ZM273.5 53C271.567 53 270 54.567 270 56.5C270 58.433 271.567 60 273.5 60C275.433 60 277 58.433 277 56.5C277 54.567 275.433 53 273.5 53ZM273.5 39C271.567 39 270 40.567 270 42.5C270 44.433 271.567 46 273.5 46C275.433 46 277 44.433 277 42.5C277 40.567 275.433 39 273.5 39ZM273.5 25C271.567 25 270 26.567 270 28.5C270 30.433 271.567 32 273.5 32C275.433 32 277 30.433 277 28.5C277 26.567 275.433 25 273.5 25ZM273.5 11C271.567 11 270 12.567 270 14.5C270 16.433 271.567 18 273.5 18C275.433 18 277 16.433 277 14.5C277 12.567 275.433 11 273.5 11Z';

  let dockFillImage = null;
  function getDockFillImage() {
    if (dockFillImage) return dockFillImage;
    dockFillImage = new Image();
    dockFillImage.decoding = 'async';
    dockFillImage.src = DOCK_FILL;
    return dockFillImage;
  }

  function visibleSceneImages(phone) {
    return [...phone.querySelectorAll('.place-bg img, .sprite-layer.is-on')].filter((img) => {
      if (!(img.currentSrc || img.src)) return false;
      const cs = getComputedStyle(img);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      if (Number(cs.opacity) === 0) return false;
      return true;
    });
  }

  /*
   * Chrome kills backdrop-filter when the plate is masked/clipped to the ticket
   * path. Paint dock frost into a canvas, then destination-in the solid path —
   * fill only, no stroke outline.
   */
  function paintTicketFrost(canvas, ticketEl) {
    const phone = document.getElementById('phone');
    if (!phone || !canvas) return;
    const tr = ticketEl.getBoundingClientRect();
    const cssW = Math.max(1, Math.round(tr.width));
    const cssH = Math.max(1, Math.round(tr.height));
    const dpr = Math.min(window.devicePixelRatio || 1, FROST_MAX_DPR);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const pad = FROST_BLUR_PX * FROST_BLUR_PAD_MULT;
    const offW = cssW + pad * 2;
    const offH = cssH + pad * 2;
    const off = document.createElement('canvas');
    off.width = Math.round(offW * dpr);
    off.height = Math.round(offH * dpr);
    const octx = off.getContext('2d');
    if (!octx) return;
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const originX = tr.left - pad;
    const originY = tr.top - pad;
    visibleSceneImages(phone).forEach((img) => {
      const r = img.getBoundingClientRect();
      try {
        octx.drawImage(img, r.left - originX, r.top - originY, r.width, r.height);
      } catch (_) {
        /* ignore decode/taint failures */
      }
    });

    /* Source rect must be bitmap pixels (off.width/height), not CSS size — dpr mismatch left the plate empty. */
    ctx.filter = `blur(${FROST_BLUR_PX}px)`;
    ctx.drawImage(off, 0, 0, off.width, off.height, -pad, -pad, offW, offH);
    ctx.filter = 'none';

    const scrim = ctx.createLinearGradient(0, 0, 0, cssH);
    FROST_SCRIM.forEach((stop) => scrim.addColorStop(stop.offset, stop.color));
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, cssW, cssH);

    const fillImg = getDockFillImage();
    if (fillImg.complete && fillImg.naturalWidth > 0) {
      ctx.globalAlpha = FROST_DOCK_FILL_OPACITY;
      ctx.drawImage(fillImg, 0, 0, cssW, cssH);
      ctx.globalAlpha = 1;
    }

    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = '#ffffff';
    ctx.save();
    ctx.scale(cssW / TICKET_TOTAL_ART_WIDTH, cssH / TICKET_ART_HEIGHT);
    ctx.fill(new Path2D(TICKET_SOLID_PATH));
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';

    /* Hard edge so the separate whitish path stroke reads clean. */
    const fringe = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = fringe.data;
    const alphaKeep = 200;
    for (let i = 3; i < px.length; i += 4) {
      px[i] = px[i] < alphaKeep ? 0 : 255;
    }
    ctx.putImageData(fringe, 0, 0);
  }

  function ticketOutlineMarkup() {
    return `<svg class="ticket-outline" viewBox="0 0 ${TICKET_TOTAL_ART_WIDTH} ${TICKET_ART_HEIGHT}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="${TICKET_SOLID_PATH}" fill="none" stroke="${TICKET_OUTLINE_OUTER}" stroke-width="${TICKET_OUTLINE_WIDTH}"></path>
      <g transform="translate(${TICKET_INNER_FRAME_TX} ${TICKET_INNER_FRAME_TY})">
        <path d="${TICKET_INNER_PATH}" fill="none" stroke="${TICKET_OUTLINE_INNER}" stroke-width="${TICKET_OUTLINE_WIDTH}"></path>
      </g>
    </svg>`;
  }

  function repaintAllTicketFrost() {
    document.querySelectorAll('.ticket-choice .ticket-frost-canvas').forEach((canvas) => {
      const ticket = canvas.closest('.ticket-choice');
      if (ticket) paintTicketFrost(canvas, ticket);
    });
  }

  const SHAPES = ['spade', 'heart', 'diamond', 'club'];
  const GRADIENTS = {
    yellow: ['#C9A227', '#F5D76E'],
    blue: ['#0259A1', '#009EFF'],
    green: ['#3DBE5A', '#1F7A3A'],
    red: ['#E62828', '#8B1A1A'],
  };

  const STAR_FILL =
    'M6.57741 0.329413C6.61245 0.232887 6.67635 0.149489 6.76044 0.090553C6.84453 0.0316166 6.94473 0 7.04741 0C7.1501 0 7.2503 0.0316166 7.33438 0.090553C7.41847 0.149489 7.48238 0.232887 7.51741 0.329413L7.99541 1.63541C8.37029 2.65924 8.96389 3.58902 9.73485 4.35998C10.5058 5.13094 11.4356 5.72453 12.4594 6.09941L13.7644 6.57741C13.8609 6.61245 13.9443 6.67635 14.0033 6.76044C14.0622 6.84453 14.0938 6.94473 14.0938 7.04741C14.0938 7.1501 14.0622 7.2503 14.0033 7.33438C13.9443 7.41847 13.8609 7.48238 13.7644 7.51741L12.4594 7.99541C11.4356 8.37029 10.5058 8.96389 9.73485 9.73485C8.96389 10.5058 8.37029 11.4356 7.99541 12.4594L7.51741 13.7644C7.48238 13.8609 7.41847 13.9443 7.33438 14.0033C7.2503 14.0622 7.1501 14.0938 7.04741 14.0938C6.94473 14.0938 6.84453 14.0622 6.76044 14.0033C6.67635 13.9443 6.61245 13.8609 6.57741 13.7644L6.09941 12.4594C5.72453 11.4356 5.13094 10.5058 4.35998 9.73485C3.58902 8.96389 2.65924 8.37029 1.63541 7.99541L0.329413 7.51741C0.232887 7.48238 0.149489 7.41847 0.090553 7.33438C0.0316166 7.2503 0 7.1501 0 7.04741C0 6.94473 0.0316166 6.84453 0.090553 6.76044C0.149489 6.67635 0.232887 6.61245 0.329413 6.57741L1.63541 6.09941C2.65924 5.72453 3.58902 5.13094 4.35998 4.35998C5.13094 3.58902 5.72453 2.65924 6.09941 1.63541L6.57741 0.329413Z';
  const STAR_OUTLINE =
    'M7.04785 0.500977L7.52539 1.80762H7.52637C7.92624 2.89952 8.55863 3.89162 9.38086 4.71387C10.2032 5.53617 11.1951 6.16946 12.2871 6.56934L13.5928 7.04688L13.5938 7.04785H13.5928L12.2871 7.52637C11.1952 7.92625 10.2031 8.55863 9.38086 9.38086C8.55863 10.2031 7.92625 11.1952 7.52637 12.2871L7.04785 13.5928V13.5938L7.04688 13.5928L6.56934 12.2871C6.16946 11.1951 5.53617 10.2032 4.71387 9.38086C3.89162 8.55863 2.89952 7.92624 1.80762 7.52637V7.52539L0.500977 7.04785H0.5L0.500977 7.04688L1.80762 6.56934C2.89965 6.16946 3.89154 5.53619 4.71387 4.71387C5.53619 3.89154 6.16946 2.89965 6.56934 1.80762L7.04688 0.500977L7.04785 0.5V0.500977Z';
  const SPADE_FILL =
    'M5.86751 0.278678C5.79395 0.240441 5.70414 0.240441 5.63058 0.278678C5.41085 0.394278 0.25 3.13489 0.25 6.46416C0.25 7.9394 1.53878 9.13897 3.12276 9.13897C3.82686 9.13897 4.4746 8.89976 4.97711 8.50406C4.71152 9.98463 4.16984 10.9041 4.16315 10.9157C4.12111 10.9859 4.12207 11.0704 4.16506 11.1397C4.20805 11.2082 4.28735 11.25 4.37333 11.25H7.12667C7.2117 11.25 7.29099 11.2082 7.33494 11.1397C7.37793 11.0704 7.37889 10.9859 7.33781 10.9157C7.33016 10.9041 6.78943 9.98374 6.52288 8.50317C7.0254 8.89888 7.67314 9.13808 8.37724 9.13808C9.96122 9.13808 11.25 7.93851 11.25 6.46327C11.25 3.13489 6.0882 0.394278 5.86751 0.278678Z';
  const CLUB_FILL =
    'M4.91753 5.67428C2.88656 4.76285 -0.100913 5.85004 0.60592 8.30257C1.29473 10.6926 4.26944 10.1681 5.29809 8.71327C4.86896 11.4717 4.11528 11.9012 3.66356 12.5H8.4595C7.97358 11.8596 7.09122 11.4717 6.57377 8.67539C7.6103 10.1279 10.7263 10.6313 11.4052 8.27584C12.073 5.95877 9.06278 4.63914 7.06105 5.68815C8.98052 4.47716 9.66985 0.5 6.03437 0.5C2.363 0.5 2.97556 4.55493 4.91753 5.67428Z';
  const CLUB_OUTLINE =
    'M6.03418 0.25C6.98836 0.25 7.69511 0.511508 8.16992 0.958008C8.64453 1.40432 8.85792 2.00754 8.88086 2.63086C8.91219 3.48293 8.58794 4.40783 8.04102 5.11426C8.84637 4.99456 9.68111 5.14282 10.3516 5.49902C10.8472 5.76236 11.2654 6.14598 11.5127 6.63379C11.7619 7.1255 11.8291 7.7075 11.6455 8.34473C11.46 8.98852 11.1025 9.45033 10.6455 9.74609C10.1921 10.0396 9.6553 10.1603 9.12012 10.1533C8.37116 10.1435 7.59314 9.8811 6.99902 9.44531C7.2234 10.3241 7.48475 10.8744 7.7373 11.2588C7.8992 11.5052 8.06047 11.6895 8.21484 11.8545C8.36437 12.0143 8.52644 12.1751 8.6582 12.3486L8.96289 12.75H3.16211L3.46387 12.3496C3.58103 12.1943 3.73029 12.034 3.85742 11.8828C3.99187 11.7229 4.13201 11.5392 4.27148 11.293C4.49083 10.9057 4.71429 10.3498 4.90332 9.46973C4.32274 9.91541 3.5632 10.1883 2.82812 10.1992C2.30834 10.2069 1.7875 10.0849 1.3457 9.78711C0.901062 9.4873 0.552232 9.02082 0.365234 8.37207C0.17331 7.70614 0.22894 7.11354 0.47168 6.61914C0.712762 6.12818 1.12845 5.75518 1.62207 5.50391C2.2941 5.16195 3.13194 5.03326 3.94141 5.14258C3.38864 4.44795 3.07406 3.51416 3.12109 2.65332C3.15546 2.02586 3.38291 1.41806 3.86816 0.967773C4.35394 0.517098 5.07039 0.250035 6.03418 0.25Z';
  const HEART_FILL =
    'M5.5 11L4.7025 10.2087C1.87 7.40926 0 5.55695 0 3.297C0 1.44469 1.331 0 3.025 0C3.982 0 4.9005 0.485559 5.5 1.24687C6.0995 0.485559 7.018 0 7.975 0C9.669 0 11 1.44469 11 3.297C11 5.55695 9.13 7.40926 6.2975 10.2087L5.5 11Z';
  const HEART_OUTLINE =
    'M7.97461 0.25C9.51096 0.25 10.7499 1.5623 10.75 3.29688C10.75 4.35143 10.3155 5.32725 9.51074 6.40039C8.70272 7.47784 7.54289 8.62701 6.12207 10.0312H6.12109L5.5 10.6475L4.87891 10.0312H4.87793C3.45711 8.62701 2.29728 7.47784 1.48926 6.40039C0.684472 5.32725 0.25 4.35143 0.25 3.29688C0.250061 1.5623 1.48904 0.25 3.02539 0.25C3.89831 0.250133 4.74698 0.6944 5.30371 1.40137L5.5 1.65137L5.69629 1.40137C6.25302 0.6944 7.10169 0.250133 7.97461 0.25Z';

  const LEAD_ICONS = {
    diamond: {
      viewBox: '0 0 15 15',
      anchorX: 7.0469,
      anchorY: 7.0469,
      fill: STAR_FILL,
      outline: STAR_OUTLINE,
      outlineWidth: 1,
      gradient: 'yellow',
    },
    spade: {
      viewBox: '0 0 12 12',
      fill: SPADE_FILL,
      outline: SPADE_FILL,
      outlineWidth: 0.5,
      gradient: 'blue',
    },
    club: {
      viewBox: '0 0 12 13',
      fill: CLUB_FILL,
      outline: CLUB_OUTLINE,
      outlineWidth: 0.5,
      gradient: 'green',
    },
    heart: {
      viewBox: '0 0 11 11',
      fill: HEART_FILL,
      outline: HEART_OUTLINE,
      outlineWidth: 0.5,
      gradient: 'red',
    },
  };

  const ASSET = {
    narrative: 'assets/ticket/stub-narrative.svg',
    navigation: 'assets/ticket/stub-navigation.svg',
    puzzle: 'assets/ticket/stub-puzzle.svg',
  };
  /* Baked neon in stub SVGs — keep this luminosity, swap hue to story accent. */
  const STUB_NEON_BLUE = '#009EFF';
  const stubSvgCache = new Map();

  function choiceStyleForIndex(index) {
    const n = Number.isFinite(index) ? Math.max(0, Math.trunc(index)) : 0;
    return { shape: SHAPES[n % SHAPES.length], slot: n % 3 };
  }

  function resolveStubCue(mode) {
    if (mode === 'navigate') return 'navigation';
    return 'narrative';
  }

  function stubCueSrc(cue) {
    if (cue === 'navigation') return ASSET.navigation;
    if (cue === 'puzzle') return ASSET.puzzle;
    return ASSET.narrative;
  }

  function parseHexColor(hex) {
    const raw = String(hex || '').trim().replace(/^#/, '');
    if (raw.length === 3) {
      const r = parseInt(raw[0] + raw[0], 16);
      const g = parseInt(raw[1] + raw[1], 16);
      const b = parseInt(raw[2] + raw[2], 16);
      return Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b) ? [r, g, b] : null;
    }
    if (raw.length !== 6) return null;
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    return Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b) ? [r, g, b] : null;
  }

  function rgbToHsl(r, g, b) {
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
    else if (max === gg) h = ((bb - rr) / d + 2) / 6;
    else h = ((rr - gg) / d + 4) / 6;
    return { h, s, l };
  }

  function hslToHex(h, s, l) {
    const hue2rgb = (p, q, t) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    const to = (n) => n.toString(16).padStart(2, '0');
    return `#${to(r)}${to(g)}${to(b)}`;
  }

  /** Story accent hue at the stub neon's luminosity (keeps highlights / shading). */
  function neonAccentFromStory(accentHex) {
    const blueRgb = parseHexColor(STUB_NEON_BLUE);
    const accentRgb = parseHexColor(accentHex);
    if (!blueRgb || !accentRgb) return STUB_NEON_BLUE;
    const blue = rgbToHsl(blueRgb[0], blueRgb[1], blueRgb[2]);
    const accent = rgbToHsl(accentRgb[0], accentRgb[1], accentRgb[2]);
    const sat = Math.max(accent.s, blue.s * 0.85);
    return hslToHex(accent.h, sat, blue.l);
  }

  function readStoryAccentHex() {
    const phone = document.getElementById('phone');
    if (!phone) return STUB_NEON_BLUE;
    const cs = getComputedStyle(phone);
    const frame = cs.getPropertyValue('--frame-accent').trim();
    const story = cs.getPropertyValue('--story-accent').trim();
    const candidate = frame || story;
    return parseHexColor(candidate) ? candidate : STUB_NEON_BLUE;
  }

  function tintStubSvgMarkup(svgText, accentHex) {
    const neon = neonAccentFromStory(accentHex);
    return String(svgText).replace(/#009[Ee][Ff]{2}/g, neon);
  }

  function loadStubSvg(cue) {
    const src = stubCueSrc(cue);
    if (stubSvgCache.has(src)) return stubSvgCache.get(src);
    const pending = fetch(src)
      .then((res) => (res.ok ? res.text() : ''))
      .then((text) => {
        stubSvgCache.set(src, Promise.resolve(text));
        return text;
      })
      .catch(() => {
        stubSvgCache.delete(src);
        return '';
      });
    stubSvgCache.set(src, pending);
    return pending;
  }

  function paintStubGlyph(glyphEl, cue) {
    if (!glyphEl) return;
    const accent = readStoryAccentHex();
    loadStubSvg(cue).then((svgText) => {
      if (!svgText || !glyphEl.isConnected) return;
      glyphEl.innerHTML = tintStubSvgMarkup(svgText, accent);
      const svg = glyphEl.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.display = 'block';
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      }
    });
  }

  function retintAllStubGlyphs() {
    document.querySelectorAll('.ticket-choice').forEach((btn) => {
      const cue = btn.dataset.cue || 'narrative';
      const glyph = btn.querySelector('.ticket-stub-glyph');
      paintStubGlyph(glyph, cue);
      const pin = btn.querySelector('.ticket-lead-wrap');
      if (!pin) return;
      const size = Math.round(pin.getBoundingClientRect().width) || TICKET_PIN_CIRCLE_SIZE;
      const style = choiceStyleForIndex(Number(btn.dataset.instanceId));
      pin.innerHTML = leadIconHtml(style.shape, size, btn.dataset.instanceId || '0');
    });
  }

  /** Blue lead (spade) follows story accent at neon luminosity; other suits keep baked gradients. */
  function leadGradientColors(gradientKey) {
    const baked = GRADIENTS[gradientKey] || GRADIENTS.blue;
    if (gradientKey !== 'blue') return baked;
    const neon = neonAccentFromStory(readStoryAccentHex());
    const rgb = parseHexColor(neon);
    if (!rgb) return baked;
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    const dark = hslToHex(hsl.h, Math.min(1, hsl.s * 1.05), Math.max(0.16, hsl.l * 0.38));
    return [dark, neon];
  }

  function getLayout(containerWidth) {
    if (containerWidth <= 0) return null;
    const scale = containerWidth / TICKET_TOTAL_ART_WIDTH;
    const iconContain = Math.min(
      TICKET_STUB_ICON_SLOT_WIDTH / STUB_ICON_NATIVE_WIDTH,
      TICKET_STUB_ICON_SLOT_HEIGHT / STUB_ICON_NATIVE_HEIGHT,
    );
    const iconScale = scale * iconContain * STUB_ICON_FIT;
    return {
      scale,
      ticketHeight: TICKET_ART_HEIGHT * scale,
      fullArtWidth: TICKET_TOTAL_ART_WIDTH * scale,
      bodyWidth: TICKET_BODY_ART_WIDTH * scale,
      stubWidth: TICKET_STUB_ART_WIDTH * scale,
      leadGutter: TICKET_LEAD_GUTTER_ART * scale,
      bodyPinCenterY: TICKET_PIN_CENTER_Y * scale,
      bodyPinSize: TICKET_PIN_CIRCLE_SIZE * scale,
      titleFontSize: TITLE_FONT_SIZE * scale,
      titleLineHeight: TITLE_LINE_HEIGHT * scale,
      stubIconWidth: STUB_ICON_NATIVE_WIDTH * iconScale,
      stubIconHeight: STUB_ICON_NATIVE_HEIGHT * iconScale,
      stubIconInsetLeft: TICKET_STUB_ICON_INSET_LEFT * scale,
      stubIconInsetTop: TICKET_STUB_ICON_INSET_TOP * scale,
      stubIconSlotWidth: TICKET_STUB_ICON_SLOT_WIDTH * scale,
      stubIconSlotHeight: TICKET_STUB_ICON_SLOT_HEIGHT * scale,
      stubRipTranslateX: TICKET_STUB_ART_WIDTH * scale,
      titlePadLeft: TITLE_LEADING_CLEARANCE_ART_PX * scale,
      titlePadRight: TITLE_TRAILING_CLEARANCE_ART_PX * scale,
    };
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function leadIconHtml(shape, size, instanceId) {
    const art = LEAD_ICONS[shape] || LEAD_ICONS.spade;
    const colors = leadGradientColors(art.gradient);
    const parts = art.viewBox.split(' ').map(Number);
    const viewWidth = parts[2];
    const viewHeight = parts[3];
    const anchorX = art.anchorX ?? viewWidth / 2;
    const anchorY = art.anchorY ?? viewHeight / 2;
    const glyphScale = TICKET_LEAD_GLYPH_ART / Math.max(viewWidth, viewHeight);
    const gid = `lead-${instanceId}-${shape}`;
    const transform = `translate(${TICKET_LEAD_BASE_CENTER} ${TICKET_LEAD_BASE_CENTER}) scale(${glyphScale}) translate(${-anchorX} ${-anchorY})`;
    return `<svg class="ticket-lead" width="${size}" height="${size}" viewBox="0 0 ${TICKET_PIN_CIRCLE_SIZE} ${TICKET_PIN_CIRCLE_SIZE}" aria-hidden="true" focusable="false">
      <circle cx="${TICKET_LEAD_BASE_CENTER}" cy="${TICKET_LEAD_BASE_CENTER}" r="${TICKET_LEAD_BASE_RADIUS}"
        fill="${TICKET_LEAD_BASE_FILL}"></circle>
      <defs>
        <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${colors[0]}"></stop>
          <stop offset="1" stop-color="${colors[1]}"></stop>
        </linearGradient>
      </defs>
      <g transform="${transform}">
        <path d="${art.fill}" fill="url(#${gid})"></path>
      </g>
    </svg>`;
  }

  function frostFillMarkup() {
    return `<canvas class="ticket-frost-canvas" aria-hidden="true"></canvas>`;
  }

  function applyLayout(btn, layout, style) {
    if (!layout) return;
    btn.style.height = `${layout.ticketHeight}px`;

    const pin = btn.querySelector('.ticket-lead-wrap');
    const title = btn.querySelector('.ticket-title');
    const stub = btn.querySelector('.ticket-stub');
    const stubIcon = btn.querySelector('.ticket-stub-icon');
    const stubGlyph = stubIcon && stubIcon.querySelector('.ticket-stub-glyph');
    const frost = btn.querySelector('.ticket-frost-canvas');

    if (pin) {
      pin.style.width = `${layout.bodyPinSize}px`;
      pin.style.height = `${layout.bodyPinSize}px`;
      pin.style.left = `${-layout.leadGutter}px`;
      pin.style.top = `${layout.bodyPinCenterY - layout.bodyPinSize / 2}px`;
      pin.innerHTML = leadIconHtml(style.shape, layout.bodyPinSize, btn.dataset.instanceId || '0');
    }
    if (title) {
      title.style.fontSize = `${layout.titleFontSize}px`;
      title.style.lineHeight = `${layout.titleLineHeight}px`;
      title.style.paddingLeft = `${layout.titlePadLeft}px`;
      title.style.paddingRight = `${layout.titlePadRight + layout.stubWidth}px`;
    }
    if (stub) {
      stub.style.width = `${layout.stubWidth}px`;
      stub.style.height = `${layout.ticketHeight}px`;
      stub.style.setProperty('--rip-x', `${layout.stubRipTranslateX}px`);
    }
    if (stubIcon) {
      stubIcon.style.left = `${layout.stubIconInsetLeft}px`;
      stubIcon.style.top = `${layout.stubIconInsetTop}px`;
      stubIcon.style.width = `${layout.stubIconSlotWidth}px`;
      stubIcon.style.height = `${layout.stubIconSlotHeight}px`;
    }
    if (stubGlyph) {
      stubGlyph.style.width = `${layout.stubIconWidth}px`;
      stubGlyph.style.height = `${layout.stubIconHeight}px`;
      paintStubGlyph(stubGlyph, btn.dataset.cue || 'narrative');
    }
    if (frost) paintTicketFrost(frost, btn);
  }

  function createTicketChoiceButton(props) {
    const style = choiceStyleForIndex(props.choiceIndex);
    const cue = props.stubCue || resolveStubCue(props.mode);
    const verb = props.verb || (props.mode === 'navigate' ? 'Navigate' : 'Continue');
    const instanceId = String(props.choiceIndex ?? 0);

    /* <button> kills backdrop sampling; canvas frost also needs a non-button host. */
    const btn = document.createElement('div');
    btn.className = 'ticket-choice';
    btn.setAttribute('role', 'button');
    btn.tabIndex = 0;
    btn.dataset.instanceId = instanceId;
    btn.dataset.cue = cue;
    btn.setAttribute('aria-label', `${props.title}. ${verb}`);

    btn.innerHTML = `
      <span class="ticket-solid-wrap" aria-hidden="true">${frostFillMarkup()}${ticketOutlineMarkup()}</span>
      <span class="ticket-lead-wrap" aria-hidden="true"></span>
      <span class="ticket-title">${escapeHtml(props.title)}</span>
      <span class="ticket-stub">
        <span class="ticket-stub-icon" aria-hidden="true">
          <span class="ticket-stub-glyph"></span>
        </span>
      </span>
    `;

    let ripping = false;
    const layoutOnce = () => {
      const parent = btn.parentElement;
      const railW = parent ? parent.getBoundingClientRect().width : 0;
      const target =
        railW > 0 ? Math.round(railW * DISPLAY_WIDTH_RATIO) : Math.round(btn.getBoundingClientRect().width);
      if (target > 0) btn.style.width = `${target}px`;
      applyLayout(btn, getLayout(Math.round(btn.getBoundingClientRect().width)), style);
    };
    requestAnimationFrame(layoutOnce);
    getDockFillImage().addEventListener('load', layoutOnce, { once: true });
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(layoutOnce).observe(btn);
    }

    const activate = () => {
      if (ripping) return;
      ripping = true;
      const stub = btn.querySelector('.ticket-stub');
      if (stub) stub.classList.add('is-ripping');
      window.setTimeout(() => {
        props.onPress();
        window.setTimeout(() => {
          if (stub) stub.classList.remove('is-ripping');
          ripping = false;
        }, RIP_RESET_DELAY_MS);
      }, RIP_DURATION_MS);
    };
    btn.addEventListener('click', activate);
    btn.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });

    return btn;
  }

  global.TicketChoice = {
    create: createTicketChoiceButton,
    choiceStyleForIndex,
    resolveStubCue,
    repaintFrost: repaintAllTicketFrost,
    retintStubs: retintAllStubGlyphs,
  };
})(window);
