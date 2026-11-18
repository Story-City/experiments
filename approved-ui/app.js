/** Approved UI library — APPROVED-UI-v7
 * Portal + decrypt reveal haze + tip sprite variations from the app.
 * Remix puzzle-sprite = tip character (FtueMapElfTip), not tiles.
 */

const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M15 7.5H22.5L12 20.5Z';
const GEM_FACETS = 'M1.5 7.5H22.5M7 1.5L9 7.5L12 20.5L15 7.5L17 1.5';
const CYAN = '#00c2ff';
const PURPLE = '#b36bff';
const GRAY = '#8a8a96';
const TIP_SWIPE_PX = 64;
const TIP_TAP_SLOP = 6;
const DOMINO_MS = 220;

/* Exact timing from location-gems/app.js — do not invent */
const LIKES_HAZE_IN_MS = 120;
const LIKES_SHINE_MS = 900;
const LIKES_HOLD_AFTER_SHINE_MS = 720;
const LIKES_CARD_IN_MS = 560;
const LIKES_CARD_OUT_MS = 360;
const LIKES_COPY_CELEBRATE_MS = 2000;
const LIKES_RARITY_PROMOTE_MS = 720;
const LIKES_TEXT_SWIPE_MS = 900;
const LIKES_HAZE_OUT_MS = 240;
const LIKES_DEMO = 12;

/* WelcomeHook / DecryptReveal — exact app constants */
const PORTAL_TAP_HINT_DELAY_MS = 2000;
const PORTAL_TAP_HINT_FADE_MS = 400;
const PORTAL_REVEAL_MS = 280;
const PORTAL_OPEN_SPEED = 0.85;
const PORTAL_FIRST_OPEN_END_FRAME = 61;
const REVEAL_PAUSE_MS = 500;
const REVEAL_PULSE_STEP_MS = 200;
const REVEAL_WASH_MS = 1200;
const REVEAL_TINT_FADE_MS = 380;
const REVEAL_GLOW_IN_MS = 300;
const REVEAL_SHINE_MS = 1400;
const REVEAL_SPOT_COUNT = 3;

const MOTION_VARS = {
  swoosh: 'var(--ease-swoosh)',
  spring: 'var(--ease-spring)',
  out: 'var(--ease-out)',
};

const DAY_REACHED_SRC = '../day-reached-overlay/embed.html?v=36';

/**
 * @typedef {{ id: string, title: string, source: string, ux: string, stage?: string, mount: Function }} ElementDef
 * @type {ElementDef[]}
 */
const ELEMENT_DEFS = [
  {
    id: 'day-reached',
    title: 'Day reached',
    source: 'day-reached-overlay · SC-3526',
    ux: 'When: streak day completes in Training Hub. What you see: haze → Lottie on today’s bead → side beads → glory shine on “N-day streak” → soft dissolve. Try: Play (Accent tints beads/Lottie).',
    stage: 'phone',
    mount: mountDayReached,
  },
  {
    id: 'likes-banner',
    title: 'Likes banner',
    source: 'location-gems (faithful CSS + timing)',
    ux: 'When: someone liked your public gem (debug in Location Gems). What you see: top haze + shine, jam card drops, “N likes” rich sweep; Rarity up promotes tier. Try: Play / Rarity up. Visible settled until you Play.',
    stage: 'banner',
    mount: mountLikesBanner,
  },
  {
    id: 'step-glance',
    title: 'Step Glance',
    source: 'daily-side-quests / StepGlanceArcProgress',
    ux: 'When: glance at today’s steps on map/challenge. What you see: arc fill + count land. Try: Land glance.',
    stage: 'banner',
    mount: mountStepGlance,
  },
  {
    id: 'elf-tip',
    title: 'Elf tip',
    source: 'tip.png · daily-side-quests / gems',
    ux: 'When: teaching a challenge or map action. Try: tap copy to advance · swipe right to dismiss.',
    mount: mountElfTip,
  },
  {
    id: 'spotlight-tip',
    title: 'Spotlight tip',
    source: 'first-story-flow / location-gems onboard',
    ux: 'When: first-time highlight of one control. Hole in scrim + tip card. Try: tap scrim to dismiss.',
    mount: mountSpotlightTip,
  },
  {
    id: 'glass-bubble',
    title: 'Glass bubble',
    source: 'ScriptedFtue / first-story-flow',
    ux: 'When: map/chat coach line. Frosted bubble. Try: Enter bubble.',
    mount: mountGlassBubble,
  },
  {
    id: 'jam-birth',
    title: 'Your gem birth',
    source: 'daily-side-quests jam birth',
    ux: 'When: your gem appears on the map. Bloom + ring + shine. Color follows Radial (my gem). Try: Birth shine or tap gem.',
    mount: mountJamBirth,
  },
  {
    id: 'gem-unlock',
    title: 'Others’ gems unlock',
    source: 'daily-side-quests locked → cyan',
    ux: 'When: others’ finds unlock after your walk. Gray → Accent grow, staggered. Try: Unlock grow.',
    mount: mountGemUnlock,
  },
  {
    id: 'domino-route',
    title: 'Domino gems',
    source: 'daily-side-quests route / exit',
    ux: 'When: your gems land on route/exit. Staggered pop. Color follows Radial. Try: Domino in.',
    mount: mountDomino,
  },
  {
    id: 'share-chrome',
    title: 'Like · Share · arrow',
    source: 'daily-side-quests read meta',
    ux: 'When: viewing a find. Compact like, Share pill, next chevron. Try: tap each control.',
    mount: mountShareChrome,
  },
  {
    id: 'end-stats',
    title: 'End-story stats',
    source: 'EndStoryStatsSection',
    ux: 'When: walk/story end summary. Bold value + soft label. Try: Reveal stats.',
    mount: mountEndStats,
  },
  {
    id: 'confirm',
    title: 'Complete-walk confirm',
    source: 'daily-side-quests exit buffer',
    ux: 'When: leaving mid-walk. Keep vs complete. Try: Show confirm · tap either pill.',
    mount: mountConfirm,
  },
  {
    id: 'primary-cta',
    title: 'Primary CTA',
    source: 'Location Gems gradient + radial wash',
    ux: 'When: main action. Accent gradient + Radial wash. Try: Pulse CTA.',
    mount: mountPrimaryCta,
  },
  {
    id: 'claim-pulse',
    title: 'Claim CTA',
    source: 'claim-pulse (faithful app event glow)',
    ux: 'When: end-of-story gift / trial claim. Idle opacity pulse (useBannerPulse). Try: tap the button (press scale).',
    stage: 'claim',
    mount: mountClaimPulse,
  },
  {
    id: 'welcome-portal',
    title: 'Welcome portal',
    source: 'WelcomeHook · reveal_first / reveal_fire Lottie',
    ux: 'When: welcome pick-a-story doors. Idle portal loops (frames 0→61 @ 0.85). Tap ring to reveal character. Summons (purple) vs Knight (fire). Try: switch door · tap portal · Play hint.',
    stage: 'banner',
    mount: mountWelcomePortal,
  },
  {
    id: 'reveal-haze',
    title: 'Decrypt reveal haze',
    source: 'DecryptReveal · wash 1200ms + shine 1400ms + decrypt-reveal.json',
    ux: 'When: all decrypt spots found. Pulse spots → expanding wash haze → glow Lottie → shine sweep. Try: Play reveal.',
    stage: 'banner',
    mount: mountRevealHaze,
  },
  {
    id: 'tip-sprites',
    title: 'Tip sprites',
    source: 'FtueMapElfTip · FTUE door chars · remix puzzle-sprite.webp',
    ux: 'When: coach tip on map / remix editor. Character sits beside the tip bubble — remix puzzle-sprite is this tip character, not puzzle tiles. Tap tip to dismiss (outside-touch dismiss in app). Try: switch sprite · Show tip.',
    stage: 'banner',
    mount: mountTipSprites,
  },
  {
    id: 'choice-pulse',
    title: 'Choice pulse outline',
    source: 'ftue-choice-hints / ActionPanel pulseEdge',
    ux: 'When: primary reply is available in FTUE chat. Soft breathing border on the choice. Try: the outline pulses on its own; tap to press.',
    mount: mountChoicePulse,
  },
  {
    id: 'tap-hint',
    title: 'Tap-hint hand',
    source: 'ftue-choice-hints · tap-hint.json',
    ux: 'When: coaching which choice to tap. Hand Lottie fades onto the primary reply. Try: Play hint · tap choice.',
    mount: mountTapHint,
  },
];

const library = document.getElementById('library');
const catalogNav = document.getElementById('catalogNav');
const accentColor = document.getElementById('accentColor');
const accentAlpha = document.getElementById('accentAlpha');
const radialEnabled = document.getElementById('radialEnabled');
const radialEnabledLabel = document.getElementById('radialEnabledLabel');
const radialColor = document.getElementById('radialColor');
const radialAmount = document.getElementById('radialAmount');
const bgColor = document.getElementById('bgColor');
const bgDepth = document.getElementById('bgDepth');

function gemSvg(fill) {
  return `<svg viewBox="0 0 24 22" aria-hidden="true">
    <path d="${GEM_OUTLINE}" fill="${fill}"/>
    <path d="${GEM_TABLE}" fill="#fff" fill-opacity="0.3"/>
    <path d="${GEM_SHADE}" fill="#000" fill-opacity="0.22"/>
    <path d="${GEM_FACETS}" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1" stroke-linejoin="round"/>
    <path d="${GEM_OUTLINE}" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`;
}

function hexToRgb(hex) {
  const n = hex.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function softAccentHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c) => Math.min(255, Math.round(c + (255 - c) * 0.55));
  const to = (n) => n.toString(16).padStart(2, '0');
  return `#${to(mix(r))}${to(mix(g))}${to(mix(b))}`;
}

function accentHex() {
  return (accentColor && accentColor.value) || '#00c2ff';
}

function myGemHex() {
  return (radialColor && radialColor.value) || PURPLE;
}

function applyAccent() {
  const hex = accentHex();
  const alpha = (Number(accentAlpha.value) || 100) / 100;
  const { r, g, b } = hexToRgb(hex);
  const deep = `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 20)})`;
  const root = document.documentElement.style;
  root.setProperty('--brand-accent', `rgba(${r}, ${g}, ${b}, ${alpha})`);
  root.setProperty('--brand-accent-solid', hex);
  root.setProperty('--brand-primary', `rgb(${r}, ${g}, ${b})`);
  root.setProperty('--brand-primary-deep', deep);
  root.setProperty('--accent-soft', softAccentHex(hex));
  root.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, ${0.55 * alpha})`);
  root.setProperty('--likes-hue', hex);
  root.setProperty('--likes-hue-soft', softAccentHex(hex));
  applyRadial();
  repaintTintedElements();
  syncDayReachedAccent();
}

function isRadialOn() {
  return !radialEnabled || radialEnabled.checked;
}

function applyRadial() {
  const hex = myGemHex();
  const on = isRadialOn();
  const amount = on ? ((radialAmount && Number(radialAmount.value)) || 55) / 100 : 0;
  const { r, g, b } = hexToRgb(hex);
  const root = document.documentElement.style;
  root.setProperty('--my-gem', hex);
  root.setProperty('--btn-radial-solid', hex);
  root.setProperty('--btn-radial', `rgba(${r}, ${g}, ${b}, ${0.75 * amount})`);
  root.setProperty(
    '--btn-radial-wash',
    amount > 0
      ? `radial-gradient(ellipse 200% 70% at 50% 45%, rgba(${r}, ${g}, ${b}, ${0.75 * amount}), transparent 72%)`
      : 'none',
  );
  document.body.classList.toggle('radial-off', !on);
  if (radialEnabledLabel) radialEnabledLabel.textContent = on ? 'On' : 'Off';
  if (radialColor) radialColor.disabled = !on;
  if (radialAmount) radialAmount.disabled = !on;
}

function applyBg() {
  const hex = (bgColor && bgColor.value) || '#170c35';
  const depth = ((bgDepth && Number(bgDepth.value)) || 100) / 100;
  const { r, g, b } = hexToRgb(hex);
  document.documentElement.style.setProperty(
    '--bg',
    `rgb(${Math.round(r * depth)}, ${Math.round(g * depth)}, ${Math.round(b * depth)})`,
  );
}

function applyMotion(name) {
  document.documentElement.style.setProperty('--motion', MOTION_VARS[name] || MOTION_VARS.swoosh);
}

function repaintTintedElements() {
  const others = accentHex();
  const mine = myGemHex();
  document.querySelectorAll('[data-gem-role="others"]').forEach((el) => {
    if (el.classList.contains('is-locked')) return;
    const pulse = el.querySelector('.jam-pulse');
    const shine = el.querySelector('.jam-shine');
    const extras = [pulse, shine].filter(Boolean).map((n) => n.outerHTML).join('');
    el.innerHTML = `${extras}${gemSvg(others)}`;
  });
  document.querySelectorAll('[data-gem-role="mine"]').forEach((el) => {
    const pulse = el.querySelector('.jam-pulse');
    const shine = el.querySelector('.jam-shine');
    const extras = [pulse, shine].filter(Boolean).map((n) => n.outerHTML).join('');
    el.innerHTML = `${extras}${gemSvg(mine)}`;
  });
  document.querySelectorAll('[data-gem-role="likes"]').forEach((el) => {
    el.innerHTML = gemSvg(others);
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function makeCard(def) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.element = def.id;
  card.id = `el-${def.id}`;

  const head = document.createElement('div');
  head.className = 'card-head';
  head.innerHTML = `
    <h2 class="card-title">${def.title}</h2>
    <p class="card-source">${def.source}</p>
    <p class="card-ux"><span class="card-ux-label">How it works</span> ${def.ux}</p>
  `;
  card.appendChild(head);

  const stage = document.createElement('div');
  const stageKind = def.stage || 'element';
  stage.className = `stage stage-${stageKind}`;
  stage.id = `stage-${def.id}`;
  card.appendChild(stage);

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  card.appendChild(actions);

  def.mount(stage, actions);
  return card;
}

function addPlay(actions, label, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-play';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  actions.appendChild(btn);
  return btn;
}

function addGhost(actions, label, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-ghost';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  actions.appendChild(btn);
  return btn;
}

/** Day-reached only — Lottie lives in source; framed at native 376px (no stretch). */
function mountDayReached(stage, actions) {
  const frame = document.createElement('iframe');
  frame.className = 'embed-frame';
  frame.title = 'Day reached element';
  frame.src = `${DAY_REACHED_SRC}&n=${Date.now()}`;
  frame.allow = 'autoplay';
  frame.addEventListener('load', () => {
    frame.contentWindow?.postMessage({ type: 'set-day-reached-accent', accent: accentHex() }, '*');
    frame.contentWindow?.postMessage({ type: 'play-day-reached', accent: accentHex() }, '*');
  });
  stage.appendChild(frame);
  addPlay(actions, 'Play', () => {
    frame.contentWindow?.postMessage({ type: 'play-day-reached', accent: accentHex() }, '*');
  });
}

function mountLikesBanner(stage, actions) {
  const host = document.createElement('div');
  host.className = 'likes-host';
  host.innerHTML = `
    <div class="likes-banner is-on" id="likesBannerEl" aria-hidden="false">
      <div class="likes-haze" aria-hidden="true"></div>
      <div class="likes-shine" id="likesShineEl" aria-hidden="true"></div>
      <article class="likes-jam-card is-in" id="likesJamCardEl">
        <img class="likes-jam-photo" src="../location-gems/assets/find-a.jpg" alt="" decoding="async">
        <div class="likes-jam-gem" data-gem-role="likes" aria-hidden="true">${gemSvg(accentHex())}</div>
        <p class="likes-jam-rarity" id="likesJamRarityEl" hidden></p>
        <div class="likes-jam-body">
          <p class="likes-jam-user">@you</p>
          <p class="likes-jam-text">[find caption]</p>
          <p class="likes-jam-place">[place]</p>
        </div>
      </article>
      <div class="likes-copy is-on" id="likesCopyEl">
        <p class="likes-headline"><span class="likes-rich">${LIKES_DEMO} likes</span></p>
        <p class="likes-subtitle">[on this gem]</p>
      </div>
    </div>
  `;
  stage.appendChild(host);

  const banner = host.querySelector('.likes-banner');
  const shine = host.querySelector('#likesShineEl');
  const card = host.querySelector('#likesJamCardEl');
  const copy = host.querySelector('#likesCopyEl');
  const rarity = host.querySelector('#likesJamRarityEl');
  const headline = host.querySelector('.likes-headline');
  let busy = false;

  const settleVisible = () => {
    banner.hidden = false;
    banner.classList.remove('is-out');
    banner.classList.add('is-on');
    shine.classList.remove('is-on');
    card.classList.remove('is-out', 'is-impact', 'is-rarity-up');
    card.classList.add('is-in');
    copy.classList.remove('is-swipe');
    copy.classList.add('is-on');
    rarity.hidden = true;
    rarity.classList.remove('is-pop');
    headline.innerHTML = `<span class="likes-rich">${LIKES_DEMO} likes</span>`;
  };

  const play = async ({ promote } = {}) => {
    if (busy) return;
    busy = true;
    banner.hidden = false;
    banner.classList.remove('is-out');
    banner.classList.add('is-on');
    copy.classList.remove('is-on', 'is-swipe');
    shine.classList.remove('is-on');
    card.classList.remove('is-in', 'is-out', 'is-impact', 'is-rarity-up');
    rarity.hidden = true;
    rarity.classList.remove('is-pop');
    headline.innerHTML = `<span class="likes-rich">${LIKES_DEMO} likes</span>`;
    await wait(LIKES_HAZE_IN_MS);
    shine.classList.add('is-on');
    card.classList.add('is-in');
    copy.classList.add('is-on');
    await wait(LIKES_CARD_IN_MS);
    card.classList.add('is-impact');
    if (promote) {
      await wait(LIKES_HOLD_AFTER_SHINE_MS);
      headline.innerHTML = '<span class="likes-rich">48 likes</span>';
      rarity.hidden = false;
      rarity.textContent = 'Gold';
      rarity.classList.add('is-pop');
      card.classList.add('is-rarity-up');
      await wait(LIKES_RARITY_PROMOTE_MS);
    } else {
      await wait(LIKES_SHINE_MS + LIKES_HOLD_AFTER_SHINE_MS);
    }
    await wait(LIKES_COPY_CELEBRATE_MS);
    copy.classList.add('is-swipe');
    await wait(LIKES_TEXT_SWIPE_MS);
    card.classList.remove('is-in', 'is-impact', 'is-rarity-up');
    card.classList.add('is-out');
    copy.classList.remove('is-on', 'is-swipe');
    await wait(LIKES_CARD_OUT_MS);
    banner.classList.add('is-out');
    await wait(LIKES_HAZE_OUT_MS);
    settleVisible();
    busy = false;
  };

  settleVisible();
  addPlay(actions, 'Play likes', () => play({ promote: false }));
  addGhost(actions, 'Rarity up', () => play({ promote: true }));
}

function mountStepGlance(stage, actions) {
  const wrap = document.createElement('div');
  wrap.className = 'demo-glance is-on';
  const ARC_LEN = 279.25;
  wrap.innerHTML = `
    <div class="demo-glance-pill">
      <div class="demo-glance-arc">
        <svg viewBox="-38 -54 316 182.11" aria-hidden="true">
          <path class="demo-glance-track" d="" fill="none" stroke-linecap="round" stroke-width="8"></path>
          <path class="demo-glance-fill" d="" fill="none" stroke-linecap="round" stroke-width="8"></path>
        </svg>
      </div>
      <p class="demo-glance-steps">2,200</p>
      <p class="demo-glance-out">out of 5,000 steps today</p>
    </div>
  `;
  stage.appendChild(wrap);
  const track = wrap.querySelector('.demo-glance-track');
  const fill = wrap.querySelector('.demo-glance-fill');
  const stepsEl = wrap.querySelector('.demo-glance-steps');
  const cx = 120;
  const cy = 96;
  const r = 80;
  const start = (190 * Math.PI) / 180;
  const end = (-10 * Math.PI) / 180;
  const d = `M ${cx + r * Math.cos(start)} ${cy + r * Math.sin(start)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(end)} ${cy + r * Math.sin(end)}`;
  track.setAttribute('d', d);
  fill.setAttribute('d', d);
  fill.style.strokeDasharray = `${ARC_LEN}`;
  fill.style.strokeDashoffset = `${ARC_LEN * 0.55}`;

  const play = async () => {
    fill.style.transition = 'none';
    fill.style.strokeDashoffset = `${ARC_LEN * 0.55}`;
    stepsEl.textContent = '2,200';
    void fill.offsetWidth;
    fill.style.transition = 'stroke-dashoffset 980ms var(--motion)';
    fill.style.strokeDashoffset = `${ARC_LEN * 0.12}`;
    const from = 2200;
    const to = 4400;
    const t0 = performance.now();
    await new Promise((resolve) => {
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / 980);
        stepsEl.textContent = String(Math.round(from + (to - from) * t)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  };
  addPlay(actions, 'Land glance', play);
}

function mountGlassBubble(stage, actions) {
  const bubble = document.createElement('div');
  bubble.className = 'demo-glass is-on';
  bubble.innerHTML = `<p>[glass bubble message from the map or chat]</p>`;
  stage.appendChild(bubble);
  addPlay(actions, 'Enter bubble', () => {
    bubble.classList.remove('is-on');
    void bubble.offsetWidth;
    bubble.classList.add('is-on');
  });
}

function mountElfTip(stage, actions) {
  const tip = document.createElement('div');
  tip.className = 'demo-tip is-on';
  tip.innerHTML = `
    <img class="demo-tip-art" src="assets/tip.png" alt="" decoding="async">
    <p class="demo-tip-copy">[explain challenge: find 3 patterns]</p>
  `;
  stage.appendChild(tip);
  const copy = tip.querySelector('.demo-tip-copy');
  const lines = [
    '[explain challenge: find 3 patterns]',
    '[explain slots: snap each find]',
    '[persuade user to share]',
  ];
  let step = 0;
  const show = () => {
    tip.classList.remove('is-out');
    tip.classList.add('is-on');
    step = 0;
    copy.textContent = lines[0];
  };
  const hide = () => {
    tip.classList.remove('is-on');
    tip.classList.add('is-out');
    setTimeout(() => tip.classList.remove('is-out'), 340);
  };
  const advance = () => {
    if (step >= lines.length - 1) {
      hide();
      return;
    }
    step += 1;
    copy.textContent = lines[step];
  };
  let startX = 0;
  let dragging = false;
  tip.addEventListener('pointerdown', (e) => {
    if (!tip.classList.contains('is-on')) return;
    startX = e.clientX;
    dragging = true;
    tip.setPointerCapture(e.pointerId);
    tip.style.transition = 'none';
  });
  tip.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    tip.style.transform = `translateX(${Math.max(0, e.clientX - startX)}px)`;
  });
  tip.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    tip.style.transition = '';
    const dx = e.clientX - startX;
    if (dx >= TIP_SWIPE_PX) hide();
    else {
      tip.style.transform = '';
      if (Math.abs(dx) <= TIP_TAP_SLOP) advance();
    }
  });
  addPlay(actions, 'Show tip', show);
  addGhost(actions, 'Dismiss', hide);
}

function mountSpotlightTip(stage, actions) {
  const wrap = document.createElement('div');
  wrap.className = 'demo-spot is-on';
  wrap.innerHTML = `
    <button type="button" class="demo-spot-scrim" aria-label="Dismiss"></button>
    <span class="demo-spot-target" aria-hidden="true"></span>
    <div class="demo-spot-card">
      <p>[spotlight: explain this control]</p>
      <small>[short supporting line]</small>
      <img class="demo-spot-elf" src="assets/tip-elf.png" alt="" decoding="async">
    </div>
  `;
  stage.appendChild(wrap);
  const show = () => wrap.classList.add('is-on');
  const hide = () => wrap.classList.remove('is-on');
  wrap.querySelector('.demo-spot-scrim').addEventListener('click', hide);
  addPlay(actions, 'Show spotlight', show);
  addGhost(actions, 'Dismiss', hide);
}

function mountJamBirth(stage, actions) {
  const row = document.createElement('div');
  row.className = 'demo-gems';
  row.innerHTML = `<div class="demo-gem-row"><button type="button" class="gem-pin" data-gem-role="mine" aria-label="Your gem"></button></div>`;
  const pin = row.querySelector('.gem-pin');
  pin.innerHTML = `<span class="jam-pulse" aria-hidden="true"></span><span class="jam-shine" aria-hidden="true"></span>${gemSvg(myGemHex())}`;
  stage.appendChild(row);
  const play = () => {
    pin.classList.remove('is-born');
    void pin.offsetWidth;
    pin.classList.add('is-born');
    setTimeout(() => pin.classList.remove('is-born'), 1100);
  };
  pin.addEventListener('click', play);
  addPlay(actions, 'Birth shine', play);
}

function mountGemUnlock(stage, actions) {
  const row = document.createElement('div');
  row.className = 'demo-gems';
  const inner = document.createElement('div');
  inner.className = 'demo-gem-row';
  const pins = [0, 1, 2].map(() => {
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'gem-pin is-locked';
    pin.dataset.gemRole = 'others';
    pin.innerHTML = gemSvg(GRAY);
    pin.addEventListener('click', () => {
      if (pin.classList.contains('is-locked')) {
        pin.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.92)' }, { transform: 'scale(1)' }], { duration: 220 });
      }
    });
    inner.appendChild(pin);
    return pin;
  });
  row.appendChild(inner);
  stage.appendChild(row);
  const unlock = async () => {
    for (let i = 0; i < pins.length; i += 1) {
      const pin = pins[i];
      pin.classList.remove('is-locked', 'is-unlock');
      pin.innerHTML = gemSvg(accentHex());
      void pin.offsetWidth;
      pin.classList.add('is-unlock');
      await wait(DOMINO_MS);
    }
  };
  const relock = () => {
    pins.forEach((pin) => {
      pin.classList.remove('is-unlock');
      pin.classList.add('is-locked');
      pin.innerHTML = gemSvg(GRAY);
    });
  };
  addPlay(actions, 'Unlock grow', unlock);
  addGhost(actions, 'Relock', relock);
}

function mountDomino(stage, actions) {
  const row = document.createElement('div');
  row.className = 'demo-gems';
  const inner = document.createElement('div');
  inner.className = 'demo-gem-row';
  const pins = [0, 1, 2].map(() => {
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'gem-pin is-domino is-in';
    pin.dataset.gemRole = 'mine';
    pin.innerHTML = gemSvg(myGemHex());
    inner.appendChild(pin);
    return pin;
  });
  row.appendChild(inner);
  stage.appendChild(row);
  const play = async () => {
    pins.forEach((p) => {
      p.classList.remove('is-in');
      p.innerHTML = gemSvg(myGemHex());
    });
    await wait(40);
    for (const pin of pins) {
      pin.classList.add('is-in');
      await wait(DOMINO_MS);
    }
  };
  addPlay(actions, 'Domino in', play);
}

function mountShareChrome(stage, actions) {
  const chrome = document.createElement('div');
  chrome.className = 'demo-chrome';
  chrome.innerHTML = `
    <button type="button" class="like-btn" aria-label="Like"><span class="like-heart">♡</span><span class="like-count">12</span></button>
    <span></span>
    <button type="button" class="share-btn" aria-label="Share">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v10M8.5 6.5 12 3l3.5 3.5M6 12v6.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>[share]</span>
    </button>
    <button type="button" class="next-arrow" aria-label="Next">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  `;
  stage.appendChild(chrome);
  const like = chrome.querySelector('.like-btn');
  const heart = chrome.querySelector('.like-heart');
  const count = chrome.querySelector('.like-count');
  let liked = false;
  like.addEventListener('click', () => {
    liked = !liked;
    like.classList.toggle('is-liked', liked);
    heart.textContent = liked ? '♥' : '♡';
    count.textContent = String(12 + (liked ? 1 : 0));
  });
  chrome.querySelector('.share-btn').addEventListener('click', () => {
    chrome.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 320 });
  });
  addPlay(actions, 'Pulse panel', () => {
    chrome.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 360 });
  });
}

function mountEndStats(stage, actions) {
  const stats = document.createElement('div');
  stats.className = 'demo-stats is-on';
  stats.innerHTML = `
    <p class="route-stat"><span class="route-stat-value" data-k="steps">2,541</span> steps</p>
    <p class="route-stat"><span class="route-stat-value" data-k="min">12</span> min</p>
    <p class="route-stat"><span class="route-stat-value" data-k="gems">3</span> gems</p>
  `;
  stage.appendChild(stats);
  addPlay(actions, 'Reveal stats', () => {
    stats.classList.remove('is-on');
    void stats.offsetWidth;
    stats.classList.add('is-on');
  });
}

function mountConfirm(stage, actions) {
  const sheet = document.createElement('div');
  sheet.className = 'demo-confirm is-on';
  sheet.innerHTML = `
    <div class="complete-card" role="dialog">
      <p class="complete-title">[confirm complete walk]</p>
      <p class="complete-copy">[explain complete vs keep hunting]</p>
      <div class="complete-actions">
        <button type="button" class="skippill" data-act="keep">[keep walking]</button>
        <button type="button" class="confirm-pill" data-act="ok">[complete walk]</button>
      </div>
    </div>
  `;
  stage.appendChild(sheet);
  const show = () => sheet.classList.add('is-on');
  const hide = () => sheet.classList.remove('is-on');
  sheet.querySelector('[data-act="keep"]').addEventListener('click', hide);
  sheet.querySelector('[data-act="ok"]').addEventListener('click', hide);
  addPlay(actions, 'Show confirm', show);
  addGhost(actions, 'Dismiss', hide);
}

function mountPrimaryCta(stage, actions) {
  const wrap = document.createElement('div');
  wrap.className = 'demo-cta-wrap';
  wrap.innerHTML = `<button type="button" class="primary-cta">[primary action]</button>`;
  stage.appendChild(wrap);
  const btn = wrap.querySelector('.primary-cta');
  const pulse = () => {
    btn.classList.remove('is-pulse');
    void btn.offsetWidth;
    btn.classList.add('is-pulse');
  };
  btn.addEventListener('click', pulse);
  addPlay(actions, 'Pulse CTA', pulse);
}

function mountClaimPulse(stage, actions) {
  const host = document.createElement('div');
  host.className = 'claim-host';
  host.innerHTML = `
    <div class="cta-wrap">
      <div class="cta-glow is-app" aria-hidden="true"></div>
      <button type="button" class="cta" aria-label="Claim free trial">
        <span>[claim free trial]</span>
      </button>
    </div>
  `;
  stage.appendChild(host);
  const cta = host.querySelector('.cta');
  cta.addEventListener('pointerdown', () => cta.classList.add('is-pressed'));
  cta.addEventListener('pointerup', () => cta.classList.remove('is-pressed'));
  cta.addEventListener('pointercancel', () => cta.classList.remove('is-pressed'));
  cta.addEventListener('pointerleave', () => cta.classList.remove('is-pressed'));
  addPlay(actions, 'Tap claim', () => {
    cta.classList.add('is-pressed');
    window.setTimeout(() => cta.classList.remove('is-pressed'), 180);
  });
}

function mountWelcomePortal(stage, actions) {
  const host = document.createElement('div');
  host.className = 'portal-host';
  host.innerHTML = `
    <div class="portal-stage">
      <div class="portal-lottie" id="portalLottie" aria-hidden="true"></div>
      <img class="portal-prop" id="portalProp" alt="" decoding="async">
      <img class="portal-character" id="portalChar" alt="" decoding="async">
      <button type="button" class="portal-hit" id="portalHit" aria-label="Reveal portal"></button>
      <div class="portal-tap-hint" id="portalHint" aria-hidden="true"></div>
    </div>
    <div class="portal-chip-row" role="radiogroup" aria-label="Portal variation">
      <button type="button" data-door="summons" aria-pressed="true">Summons</button>
      <button type="button" data-door="knight" aria-pressed="false">Knight</button>
    </div>
  `;
  stage.appendChild(host);

  const lottieHost = host.querySelector('#portalLottie');
  const prop = host.querySelector('#portalProp');
  const character = host.querySelector('#portalChar');
  const hit = host.querySelector('#portalHit');
  const hint = host.querySelector('#portalHint');
  const chips = [...host.querySelectorAll('[data-door]')];

  const DOORS = {
    summons: {
      lottie: 'ports/portal/welcome_hook_reveal_first.json',
      prop: 'ports/sprites/summons-prop.png',
      character: 'ports/sprites/summons-character.png',
      fire: false,
      tint: '#5A38AE',
    },
    knight: {
      lottie: 'ports/portal/welcome_hook_reveal_fire.json',
      prop: 'ports/sprites/ftue-door-knight-sword.png',
      character: 'ports/sprites/knight-character.png',
      fire: true,
      tint: null,
    },
  };

  let door = 'summons';
  let anim = null;
  let hintAnim = null;
  let hintTimer = 0;

  const clearHint = () => {
    window.clearTimeout(hintTimer);
    hintTimer = 0;
    hint.classList.remove('is-on');
    if (hintAnim) {
      hintAnim.destroy();
      hintAnim = null;
    }
    hint.replaceChildren();
  };

  const scheduleHint = () => {
    clearHint();
    if (host.classList.contains('is-revealed')) return;
    hintTimer = window.setTimeout(() => {
      if (!window.lottie) return;
      hintAnim = window.lottie.loadAnimation({
        container: hint,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../ftue-choice-hints/tap-hint.json',
      });
      hint.classList.add('is-on');
    }, PORTAL_TAP_HINT_DELAY_MS);
  };

  const tintPurple = (animation) => {
    try {
      const root = animation.renderer && animation.renderer.svgElement;
      if (!root) return;
      root.querySelectorAll('[fill]').forEach((node) => {
        const f = node.getAttribute('fill');
        if (f && f !== 'none' && f !== 'transparent') node.setAttribute('fill', DOORS.summons.tint);
      });
    } catch (_) { /* best-effort */ }
  };

  const mountDoor = () => {
    const cfg = DOORS[door];
    host.classList.remove('is-revealed');
    clearHint();
    if (anim) {
      anim.destroy();
      anim = null;
    }
    lottieHost.replaceChildren();
    lottieHost.classList.toggle('is-fire', cfg.fire);
    prop.src = cfg.prop;
    character.src = cfg.character;
    if (!window.lottie) return;
    anim = window.lottie.loadAnimation({
      container: lottieHost,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: cfg.lottie,
    });
    anim.setSpeed(PORTAL_OPEN_SPEED);
    anim.addEventListener('DOMLoaded', () => {
      if (!cfg.fire) tintPurple(anim);
      try {
        anim.playSegments([0, PORTAL_FIRST_OPEN_END_FRAME], true);
      } catch (_) { /* loop full if segments unavailable */ }
    });
    scheduleHint();
  };

  const reveal = () => {
    clearHint();
    host.classList.add('is-revealed');
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      door = chip.dataset.door;
      chips.forEach((c) => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      mountDoor();
    });
  });
  hit.addEventListener('click', reveal);
  mountDoor();
  addPlay(actions, 'Reveal', reveal);
  addGhost(actions, 'Reset idle', () => {
    host.classList.remove('is-revealed');
    scheduleHint();
  });
}

function mountRevealHaze(stage, actions) {
  const host = document.createElement('div');
  host.className = 'reveal-host';
  host.innerHTML = `
    <div class="reveal-board">
      <img class="reveal-board-art" src="../location-gems/assets/find-a.jpg" alt="" decoding="async">
      <div class="reveal-spots" aria-hidden="true">
        <span class="reveal-spot" style="left:28%;top:36%;background:#7c5cff"></span>
        <span class="reveal-spot" style="left:68%;top:58%;background:#1a1a22"></span>
        <span class="reveal-spot" style="left:48%;top:72%;background:#2f9e44"></span>
      </div>
      <div class="reveal-haze" aria-hidden="true"></div>
      <div class="reveal-wash" aria-hidden="true"></div>
      <div class="reveal-shine" aria-hidden="true"></div>
      <div class="reveal-lottie" id="revealLottie" aria-hidden="true"></div>
    </div>
  `;
  stage.appendChild(host);
  const lottieHost = host.querySelector('#revealLottie');
  let busy = false;
  let glowAnim = null;

  const clearGlow = () => {
    if (glowAnim) {
      glowAnim.destroy();
      glowAnim = null;
    }
    lottieHost.replaceChildren();
  };

  const reset = () => {
    host.className = 'reveal-host';
    clearGlow();
  };

  const play = async () => {
    if (busy) return;
    busy = true;
    reset();
    await wait(REVEAL_PAUSE_MS);
    host.classList.add('is-pulse');
    await wait(REVEAL_SPOT_COUNT * REVEAL_PULSE_STEP_MS);
    host.classList.remove('is-pulse');
    host.classList.add('is-washing');
    await wait(REVEAL_WASH_MS);
    host.classList.add('is-glowing');
    if (window.lottie) {
      glowAnim = window.lottie.loadAnimation({
        container: lottieHost,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'ports/reveal/decrypt-reveal.json',
      });
    }
    await wait(REVEAL_TINT_FADE_MS + REVEAL_GLOW_IN_MS);
    host.classList.add('is-shine', 'is-done');
    await wait(REVEAL_SHINE_MS);
    busy = false;
  };

  addPlay(actions, 'Play reveal', play);
  addGhost(actions, 'Reset', reset);
}

function mountTipSprites(stage, actions) {
  const SPRITES = [
    {
      id: 'elf',
      label: 'Elf tip',
      src: 'assets/tip-elf.png',
      copy: '[map tip — FTUE elf]',
    },
    {
      id: 'summons',
      label: 'Summons',
      src: 'ports/sprites/summons-character.png',
      copy: '[map tip — Summons character]',
    },
    {
      id: 'knight',
      label: 'Knight',
      src: 'ports/sprites/knight-character.png',
      copy: '[map tip — Knight character]',
    },
    {
      id: 'remix',
      label: 'Remix tip',
      src: 'ports/sprites/puzzle-sprite.webp',
      copy: '[remix editor tip — puzzle-sprite is the tip character, not a tile]',
    },
  ];

  const host = document.createElement('div');
  host.className = 'sprite-host';
  host.innerHTML = `
    <p class="sprite-note">Remix reality: tools are tap-to-apply (drag only marble/lens). This sprite only coaches via FtueMapElfTip.</p>
    <div class="sprite-chip-row" role="radiogroup" aria-label="Sprite variation"></div>
    <div class="sprite-tip-wrap is-on" id="spriteTip">
      <button type="button" class="sprite-tip-box" id="spriteCopy">[map tip]</button>
      <img class="sprite-tip-char" id="spriteChar" alt="" decoding="async">
    </div>
  `;
  stage.appendChild(host);
  const row = host.querySelector('.sprite-chip-row');
  const tip = host.querySelector('#spriteTip');
  const copy = host.querySelector('#spriteCopy');
  const char = host.querySelector('#spriteChar');
  let active = SPRITES[0];

  SPRITES.forEach((sprite, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = sprite.label;
    btn.dataset.id = sprite.id;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', () => {
      active = sprite;
      row.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
      char.src = sprite.src;
      copy.textContent = sprite.copy;
      tip.classList.remove('is-out');
      tip.classList.add('is-on');
    });
    row.appendChild(btn);
  });

  char.src = active.src;
  copy.textContent = active.copy;

  const dismiss = () => {
    tip.classList.remove('is-on');
    tip.classList.add('is-out');
  };
  const show = () => {
    tip.classList.remove('is-out');
    void tip.offsetWidth;
    tip.classList.add('is-on');
  };
  copy.addEventListener('click', dismiss);
  addPlay(actions, 'Show tip', show);
  addGhost(actions, 'Dismiss', dismiss);
}

function mountChoicePulse(stage, actions) {
  const wrap = document.createElement('div');
  wrap.className = 'demo-choice-wrap';
  wrap.innerHTML = `
    <button type="button" class="demo-choice" aria-label="Primary choice">
      <span class="pulse" aria-hidden="true"></span>
      <span class="label">[primary reply]</span>
    </button>
  `;
  stage.appendChild(wrap);
  const btn = wrap.querySelector('.demo-choice');
  btn.addEventListener('click', () => {
    btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.97)' }, { transform: 'scale(1)' }], { duration: 180 });
  });
  addPlay(actions, 'Pulse visible', () => {
    const pulse = btn.querySelector('.pulse');
    pulse.style.animation = 'none';
    void pulse.offsetWidth;
    pulse.style.animation = '';
  });
}

function mountTapHint(stage, actions) {
  const wrap = document.createElement('div');
  wrap.className = 'demo-choice-wrap';
  wrap.innerHTML = `
    <button type="button" class="demo-choice" id="tapHintChoice" aria-label="Primary choice">
      <span class="pulse" aria-hidden="true"></span>
      <span class="label">[primary reply]</span>
    </button>
  `;
  stage.appendChild(wrap);
  const btn = wrap.querySelector('.demo-choice');
  let hintAnim = null;
  let hintEl = null;

  const clearHint = () => {
    if (hintAnim) {
      hintAnim.destroy();
      hintAnim = null;
    }
    if (hintEl) {
      hintEl.remove();
      hintEl = null;
    }
  };

  const showHint = () => {
    clearHint();
    hintEl = document.createElement('div');
    hintEl.className = 'tap-hint is-in';
    hintEl.setAttribute('aria-hidden', 'true');
    btn.append(hintEl);
    if (window.lottie) {
      hintAnim = window.lottie.loadAnimation({
        container: hintEl,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../ftue-choice-hints/tap-hint.json',
      });
    }
  };

  showHint();
  btn.addEventListener('click', clearHint);
  addPlay(actions, 'Play hint', showHint);
  addGhost(actions, 'Clear', clearHint);
}

function buildCatalogNav() {
  if (!catalogNav) return;
  catalogNav.replaceChildren();
  ELEMENT_DEFS.forEach((def) => {
    const a = document.createElement('a');
    a.href = `#el-${def.id}`;
    a.textContent = def.title;
    catalogNav.appendChild(a);
  });
}

function buildLibrary() {
  library.replaceChildren();
  ELEMENT_DEFS.forEach((def) => library.appendChild(makeCard(def)));
  buildCatalogNav();
}

let sourceAccentTimer = 0;
function syncDayReachedAccent() {
  window.clearTimeout(sourceAccentTimer);
  sourceAccentTimer = window.setTimeout(() => {
    const accent = accentHex();
    document.querySelectorAll('.embed-frame').forEach((frame) => {
      frame.contentWindow?.postMessage({ type: 'set-day-reached-accent', accent }, '*');
    });
  }, 120);
}

accentColor.addEventListener('input', applyAccent);
accentAlpha.addEventListener('input', applyAccent);
if (radialEnabled) {
  radialEnabled.addEventListener('change', () => {
    applyRadial();
  });
}
radialColor.addEventListener('input', () => {
  applyRadial();
  repaintTintedElements();
});
radialAmount.addEventListener('input', applyRadial);
bgColor.addEventListener('input', applyBg);
bgDepth.addEventListener('input', applyBg);
document.querySelectorAll('input[name="motion"]').forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) applyMotion(input.value);
  });
});

applyBg();
applyMotion('swoosh');
buildLibrary();
applyAccent();
