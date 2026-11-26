/** Approved UI library — APPROVED-UI-v20
 * Gem Disc colour filter from gem-pins-v2; EndStory badges; map chapter card; likes.
 * GEM-DISC-FILTER-v20 · END-STORY-BADGES-POPUP-v19 · MAP-MODE-CARD-v19
 */

/** Same faceted gem as location-gems — StoryCity design, not AI */
const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M9 7.5H15L12 20.5Z';
const GEM_FACETS = 'M9 7.5L12 20.5L15 7.5M1.5 7.5H22.5';
const GEM_STROKE = 1.5;
const GEM_FACET_STROKE = 1;
const GEM_STROKE_SOFT = 0.7;
const GEM_FACET_STROKE_SOFT = 0.45;
const GEM_OUTLINE_OPACITY_SOFT = 0.42;
const GEM_FACET_OPACITY_SOFT = 0.32;
const PUBLIC_GEM_FILL = '#00c2ff';
const HIDDEN_GEM_FILL = '#9370c4';
const SILVER_GEM_FILL = '#c8d2e6';
const GOLD_GEM_FILL = '#ffc448';
const PLATINUM_GEM_FILL = '#d2dcff';
const DIAMOND_GEM_FILL = '#b4f0ff';
const RARITY = {
  cyan: { id: 'cyan', fill: PUBLIC_GEM_FILL, label: 'aquamarine', minLikes: 0 },
  silver: { id: 'silver', fill: SILVER_GEM_FILL, label: 'moonstone', minLikes: 20 },
  gold: { id: 'gold', fill: GOLD_GEM_FILL, label: 'topaz', minLikes: 50 },
  platinum: { id: 'platinum', fill: PLATINUM_GEM_FILL, label: 'opal', minLikes: 100 },
  diamond: { id: 'diamond', fill: DIAMOND_GEM_FILL, label: 'diamond', minLikes: 200 },
};
const CYAN = PUBLIC_GEM_FILL;
const PURPLE = '#b36bff';
const GRAY = '#8a8a96';
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
const LIKES_STACK_SECOND = 8;
const LIKES_STACK_SHUFFLE_MS = 560;

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
    source: 'location-gems v53 (corner ribbon + ×2 stack)',
    ux: 'When: someone liked your public gem. Corner ribbon + gem, likes under caption; ×2 uses weekly-challenge stack shuffle. Try: Play likes · Likes ×2 · Rarity up.',
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
    id: 'spotlight-tip',
    title: 'Spotlight tip',
    source: 'location-gems hub onboard · tip.png + hole',
    ux: 'When: gems hub first tour. Hole moves across real pieces (photo → hide → publish → camera) with tip.png. Tap tip/scrim · swipe right. Try: Play tour.',
    stage: 'spot',
    mount: mountSpotlightTip,
  },
  {
    id: 'gem-rarity',
    title: 'Gem rarity icons',
    source: 'location-gems RARITY + gemSvg',
    ux: 'When: public gem tier by likes, or hidden (private). Same faceted SVG, fill per tier. Try: glance the library.',
    stage: 'rarity',
    mount: mountGemRarityLibrary,
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
    stage: 'portal',
    mount: mountWelcomePortal,
  },
  {
    id: 'reveal-haze',
    title: 'Decrypt reveal haze',
    source: 'DecryptReveal · wash 1200ms + shine 1400ms + decrypt-reveal.json',
    ux: 'When: all decrypt spots found. Pulse spots → expanding wash haze → glow Lottie → shine sweep. Try: Play reveal.',
    stage: 'reveal',
    mount: mountRevealHaze,
  },
  {
    id: 'tip-sprites',
    title: 'Tip sprites',
    source: 'FtueMapElfTip · Elf / Summons / Knight / Remix',
    ux: 'When: coach tip on map / remix. Same tip box + 168×151 overhang. Switch character. Tap tip to dismiss.',
    stage: 'tip',
    mount: mountTipSprites,
  },
  {
    id: 'tip-reply',
    title: 'Tip + reply bubble',
    source: 'FtueMapElfTip tipActions · ActionPanel ReplyButton',
    ux: 'When: map tip asks for a response (share location / steps). Tip stays until the glass reply bubble is tapped. Try: Summons / Knight accent · tap reply.',
    stage: 'tip-reply',
    mount: mountTipWithReply,
  },
  {
    id: 'gem-disc-filter',
    title: 'Disc colour filter',
    source: 'gem-pins-v2 Disc · Figma U arc',
    ux: 'When: map gems filter. Selected gem at bottom centre; soft tinted arc (mid shine, soft mask); ≤5 gems on the rim; solid liked heart + wishlist bookmark. Try: drag · tap a gem · Spin next.',
    stage: 'disc',
    mount: mountGemDiscFilter,
  },
  {
    id: 'map-mode-switch',
    title: 'Map mode switch',
    source: 'map-modes chapter card · FtueMap ModeSegment',
    ux: 'When: chapter map — whole bottom card (story, Walk/Path/Hunt, steps bar or Hunt shutter). No map tiles. Try: tap a mode · Lock others · Select Hunt.',
    stage: 'mode-switch',
    mount: mountMapModeSwitch,
  },
  {
    id: 'end-story-badges',
    title: 'End-story badges popup',
    source: 'EndStoryInlineBadges · BadgeCollection · Tales',
    ux: 'When: chapter end celebration. Full popup contained (no scroll): hero, title, stats, badges fade then bounce. Open 820ms / close 520ms. Try: Play open · Close.',
    stage: 'badges',
    mount: mountEndStoryBadgesPopup,
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

function gemSvg(fill, opts = {}) {
  const soft = !!opts.softOutline;
  const outlineW = soft ? GEM_STROKE_SOFT : GEM_STROKE;
  const facetW = soft ? GEM_FACET_STROKE_SOFT : GEM_FACET_STROKE;
  const outlineOp = soft ? GEM_OUTLINE_OPACITY_SOFT : 1;
  const facetOp = soft ? GEM_FACET_OPACITY_SOFT : 0.6;
  return `<svg viewBox="0 0 24 22" aria-hidden="true">
    <path d="${GEM_OUTLINE}" fill="${fill}"/>
    <path d="${GEM_TABLE}" fill="#fff" fill-opacity="0.3"/>
    <path d="${GEM_SHADE}" fill="#000" fill-opacity="0.22"/>
    <path d="${GEM_FACETS}" fill="none" stroke="#fff" stroke-opacity="${facetOp}" stroke-width="${facetW}" stroke-linejoin="round"/>
    <path d="${GEM_OUTLINE}" fill="none" stroke="#fff" stroke-opacity="${outlineOp}" stroke-width="${outlineW}" stroke-linejoin="round"/>
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
  /* location-gems v53: corner ribbon + weekly-challenge ×2 stack shuffle. */
  const fill = accentHex();
  const ribbonTpl = typeof window.LOCATION_GEMS_CORNER_RIBBON === 'string'
    ? window.LOCATION_GEMS_CORNER_RIBBON
    : '';
  const ribbonHtml = (uid) => {
    if (!ribbonTpl) return '';
    return ribbonTpl
      .replaceAll('{{GEM}}', fill)
      .replaceAll('paint0_linear_0_4', `paint0_${uid}`)
      .replaceAll('paint1_linear_0_4', `paint1_${uid}`);
  };
  const jamCard = (slot, img, likes, hidden) => `
    <article class="likes-jam-card" data-likes-slot="${slot}" id="likesJamCard${slot === 0 ? 'El' : 'B'}" ${hidden ? 'hidden aria-hidden="true"' : 'aria-hidden="false"'}>
      <div class="likes-jam-media">
        <img class="likes-jam-photo" src="${img}" alt="" decoding="async">
        <div class="likes-jam-corner" aria-hidden="true">
          <div class="likes-jam-corner-art">${ribbonHtml('slot' + slot)}</div>
          <div class="likes-jam-corner-stack">
            <span class="likes-jam-gem" data-gem-role="likes">${gemSvg(fill)}</span>
          </div>
        </div>
        <p class="likes-jam-rarity" hidden></p>
      </div>
      <div class="likes-jam-body">
        <p class="likes-jam-text">[find caption]</p>
        <p class="likes-jam-likes"><span class="like-heart" aria-hidden="true">♥</span><span>${likes}</span></p>
        <p class="likes-jam-user">@you</p>
        <p class="likes-jam-place">[place]</p>
      </div>
    </article>
  `;

  const host = document.createElement('div');
  host.className = 'likes-host';
  host.style.setProperty('--gem-line', fill);
  host.innerHTML = `
    <div class="likes-banner is-on" id="likesBannerEl" aria-hidden="false">
      <div class="likes-haze" aria-hidden="true"></div>
      <div class="likes-shine" id="likesShineEl" aria-hidden="true"></div>
      <div class="likes-jam-stack" id="likesJamStack">
        ${jamCard(0, '../location-gems/assets/find-a.jpg', LIKES_DEMO, false)}
        ${jamCard(1, '../location-gems/assets/find-b.jpg', LIKES_STACK_SECOND, true)}
      </div>
      <div class="likes-copy is-on" id="likesCopyEl">
        <p class="likes-headline"><span class="likes-rich">${LIKES_DEMO} likes</span></p>
        <p class="likes-subtitle">[on this gem]</p>
      </div>
    </div>
  `;
  stage.appendChild(host);

  const banner = host.querySelector('.likes-banner');
  const shine = host.querySelector('#likesShineEl');
  const stack = host.querySelector('#likesJamStack');
  const card = host.querySelector('#likesJamCardEl');
  const cardB = host.querySelector('#likesJamCardB');
  const copy = host.querySelector('#likesCopyEl');
  const subtitle = host.querySelector('.likes-subtitle');
  const headline = host.querySelector('.likes-headline');
  const cards = [card, cardB];
  let busy = false;

  const clearMotion = () => {
    cards.forEach((c) => {
      c.classList.remove(
        'is-in', 'is-out', 'is-impact', 'is-rarity-up',
        'is-enter', 'is-shuffle', 'is-peek-out', 'is-front', 'is-back',
      );
    });
  };

  const setStack = (on) => {
    stack.classList.toggle('is-multi', on);
    cardB.hidden = !on;
    cardB.setAttribute('aria-hidden', on ? 'false' : 'true');
  };

  const settleVisible = () => {
    banner.hidden = false;
    banner.classList.remove('is-out');
    banner.classList.add('is-on');
    shine.classList.remove('is-on');
    setStack(false);
    clearMotion();
    card.classList.add('is-in');
    copy.classList.remove('is-swipe');
    copy.classList.add('is-on');
    subtitle.textContent = '[on this gem]';
    headline.innerHTML = `<span class="likes-rich">${LIKES_DEMO} likes</span>`;
    host.querySelectorAll('.likes-jam-rarity').forEach((el) => {
      el.hidden = true;
      el.classList.remove('is-pop');
    });
  };

  const play = async ({ promote, stackOn } = {}) => {
    if (busy) return;
    busy = true;
    const multi = !!stackOn && !promote;
    banner.hidden = false;
    banner.classList.remove('is-out');
    banner.classList.add('is-on');
    copy.classList.remove('is-on', 'is-swipe');
    shine.classList.remove('is-on');
    clearMotion();
    setStack(multi);
    const total = multi ? LIKES_DEMO + LIKES_STACK_SECOND : LIKES_DEMO;
    headline.innerHTML = `<span class="likes-rich">${total} likes</span>`;
    subtitle.textContent = multi ? '[on your gems]' : '[on this gem]';
    host.querySelectorAll('.likes-jam-rarity').forEach((el) => {
      el.hidden = true;
      el.classList.remove('is-pop');
    });
    await wait(LIKES_HAZE_IN_MS);
    shine.classList.add('is-on');
    copy.classList.add('is-on');
    if (multi) {
      cardB.classList.add('is-back');
      card.classList.add('is-front');
      void card.offsetWidth;
      card.classList.add('is-enter');
      await wait(LIKES_CARD_IN_MS);
      card.classList.add('is-impact');
      await wait(LIKES_HOLD_AFTER_SHINE_MS);
      card.classList.remove('is-enter', 'is-front', 'is-impact');
      cardB.classList.remove('is-back');
      void card.offsetWidth;
      card.classList.add('is-peek-out');
      cardB.classList.add('is-front', 'is-shuffle');
      await wait(LIKES_STACK_SHUFFLE_MS);
      cardB.classList.add('is-impact');
      await wait(LIKES_SHINE_MS);
    } else {
      card.classList.add('is-in');
      await wait(LIKES_CARD_IN_MS);
      card.classList.add('is-impact');
      if (promote) {
        await wait(LIKES_HOLD_AFTER_SHINE_MS);
        headline.innerHTML = '<span class="likes-rich">48 likes</span>';
        const rarity = card.querySelector('.likes-jam-rarity');
        rarity.hidden = false;
        rarity.textContent = 'topaz';
        rarity.classList.add('is-pop');
        card.classList.add('is-rarity-up');
        await wait(LIKES_RARITY_PROMOTE_MS);
      } else {
        await wait(LIKES_SHINE_MS + LIKES_HOLD_AFTER_SHINE_MS);
      }
    }
    await wait(LIKES_COPY_CELEBRATE_MS);
    copy.classList.add('is-swipe');
    await wait(LIKES_TEXT_SWIPE_MS);
    clearMotion();
    cards.forEach((c) => {
      if (!c.hidden) c.classList.add('is-out');
    });
    copy.classList.remove('is-on', 'is-swipe');
    await wait(LIKES_CARD_OUT_MS);
    banner.classList.add('is-out');
    await wait(LIKES_HAZE_OUT_MS);
    settleVisible();
    busy = false;
  };

  settleVisible();
  addPlay(actions, 'Play likes', () => play({ promote: false }));
  addGhost(actions, 'Likes ×2', () => play({ stackOn: true }));
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

function mountSpotlightTip(stage, actions) {
  /* Real hub pieces under the hole — same targets as location-gems ONBOARD_TIPS_HOLD. */
  const TIP_OUT_MS = 360;
  const TIP_SWIPE_DISMISS_PX = 72;
  const TIP_TAP_SLOP_PX = 8;
  const STEPS = [
    { text: '[hold the photo to activate sides]', target: 'card', sides: true },
    { text: '[swipe left to hide]', target: 'railPrivate', sides: 'private' },
    { text: '[swipe right to publish]', target: 'railPublic', sides: 'public' },
    { text: '[take a snapshot anytime on the camera]', target: 'camera' },
  ];
  const CAMERA_ICON =
    'M9 3h6l1.2 2H20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.8L9 3zm3 4.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5z';

  const host = document.createElement('div');
  host.className = 'gems-spot-host';
  host.innerHTML = `
    <div class="spot-mini" aria-hidden="true">
      <div class="spot-camera" id="spotCamera">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${CAMERA_ICON}"/></svg>
      </div>
      <div class="spot-stage">
        <div class="spot-rail spot-rail-left" id="spotRailPrivate">
          <span class="spot-rail-gem" id="spotRailPrivateIcon"></span>
          <span class="spot-rail-chip">[keep hidden]</span>
        </div>
        <div class="spot-rail spot-rail-right" id="spotRailPublic">
          <span class="spot-rail-gem" id="spotRailPublicIcon"></span>
          <span class="spot-rail-chip">[publish]</span>
        </div>
        <article class="spot-card" id="spotCard">
          <img class="spot-card-photo" src="../location-gems/assets/find-a.jpg" alt="" decoding="async">
          <div class="spot-card-body">
            <p class="spot-card-user">@mara</p>
            <p class="spot-card-text">[challenge find note]</p>
          </div>
        </article>
      </div>
    </div>
    <div class="gems-spot" id="gemsSpot">
      <div class="gems-spot-tip" id="gemsSpotTip">
        <img class="gems-spot-tip-layer" src="assets/tip.png" alt="" decoding="async">
        <p class="gems-spot-tip-copy" id="gemsSpotCopy"></p>
      </div>
    </div>
  `;
  stage.appendChild(host);

  host.querySelector('#spotRailPrivateIcon').innerHTML = gemSvg(HIDDEN_GEM_FILL, { softOutline: true });
  host.querySelector('#spotRailPublicIcon').innerHTML = gemSvg(PUBLIC_GEM_FILL, { softOutline: true });

  const spot = host.querySelector('#gemsSpot');
  const tip = host.querySelector('#gemsSpotTip');
  const copy = host.querySelector('#gemsSpotCopy');
  const railPrivate = host.querySelector('#spotRailPrivate');
  const railPublic = host.querySelector('#spotRailPublic');
  const targets = {
    card: host.querySelector('#spotCard'),
    railPrivate,
    railPublic,
    camera: host.querySelector('#spotCamera'),
  };
  let step = 0;
  let advanceTimer = 0;

  const syncSides = (sides) => {
    railPrivate.classList.remove('is-on', 'is-hot');
    railPublic.classList.remove('is-on', 'is-hot');
    if (!sides) return;
    if (sides === true) {
      railPrivate.classList.add('is-on');
      railPublic.classList.add('is-on');
      return;
    }
    if (sides === 'private') {
      railPrivate.classList.add('is-on', 'is-hot');
      return;
    }
    if (sides === 'public') {
      railPublic.classList.add('is-on', 'is-hot');
    }
  };

  const placeHole = (el) => {
    const hr = host.getBoundingClientRect();
    const tr = el.getBoundingClientRect();
    const cx = tr.left - hr.left + tr.width / 2;
    const cy = tr.top - hr.top + tr.height / 2;
    const rad = Math.max(26, Math.min(120, Math.max(tr.width, tr.height) / 2 + 8));
    spot.style.setProperty('--x', `${cx}px`);
    spot.style.setProperty('--y', `${cy}px`);
    spot.style.setProperty('--r', `${rad}px`);
    spot.classList.toggle('above', cy > hr.height * 0.55);
  };

  const hide = () => {
    window.clearTimeout(advanceTimer);
    tip.classList.remove('is-on');
    tip.classList.add('is-out');
    syncSides(null);
    window.setTimeout(() => {
      tip.classList.remove('is-out');
      tip.style.transform = '';
      spot.hidden = true;
    }, TIP_OUT_MS);
  };

  const showStep = (i) => {
    step = i;
    const current = STEPS[step];
    const target = targets[current.target];
    syncSides(current.sides || null);
    spot.hidden = false;
    placeHole(target);
    copy.textContent = current.text;
    copy.classList.remove('is-swap');
    void copy.offsetWidth;
    copy.classList.add('is-swap');
    tip.classList.remove('is-out');
    tip.style.transform = '';
    void tip.offsetWidth;
    tip.classList.add('is-on');
  };

  const advance = () => {
    tip.classList.remove('is-on');
    tip.classList.add('is-out');
    window.clearTimeout(advanceTimer);
    advanceTimer = window.setTimeout(() => {
      if (step >= STEPS.length - 1) {
        hide();
        return;
      }
      showStep(step + 1);
    }, TIP_OUT_MS);
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
    if (dx >= TIP_SWIPE_DISMISS_PX) advance();
    else {
      tip.style.transform = '';
      if (Math.abs(dx) <= TIP_TAP_SLOP_PX) advance();
    }
  });
  tip.addEventListener('pointercancel', () => {
    dragging = false;
    tip.style.transition = '';
    tip.style.transform = '';
  });
  spot.addEventListener('click', (e) => {
    if (e.target === spot) advance();
  });

  showStep(0);
  window.addEventListener('resize', () => {
    if (!spot.hidden) placeHole(targets[STEPS[step].target]);
  });
  addPlay(actions, 'Play tour', () => showStep(0));
  addGhost(actions, 'Dismiss', hide);
}

function mountGemRarityLibrary(stage, actions) {
  const host = document.createElement('div');
  host.className = 'rarity-host';
  const grid = document.createElement('div');
  grid.className = 'rarity-grid';
  const rows = [
    { ...RARITY.cyan, meta: 'public · base' },
    { ...RARITY.silver, meta: '20+ likes' },
    { ...RARITY.gold, meta: '50+ likes' },
    { ...RARITY.platinum, meta: '100+ likes' },
    { ...RARITY.diamond, meta: '200+ likes' },
    { id: 'hidden', fill: HIDDEN_GEM_FILL, label: 'hidden', meta: 'private gem' },
  ];
  rows.forEach((row) => {
    const cell = document.createElement('div');
    cell.className = `rarity-cell is-${row.id}`;
    cell.innerHTML = `
      <span class="rarity-gem">${gemSvg(row.fill)}</span>
      <span class="rarity-label">${row.label}</span>
      <span class="rarity-meta">${row.meta}</span>
    `;
    grid.appendChild(cell);
  });
  host.appendChild(grid);
  stage.appendChild(host);
  addPlay(actions, 'Show library', () => {
    grid.style.animation = 'none';
    void grid.offsetWidth;
    grid.style.animation = '';
  });
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
  /* Character images go in FtueMapElfTip’s 168×151 tipElf slot (contain). */
  const SPRITES = [
    {
      id: 'elf',
      label: 'Elf',
      src: 'ports/sprites/elf.png',
      copy: '[map tip — FTUE elf]',
    },
    {
      id: 'summons',
      label: 'Summons',
      src: 'ports/sprites/summons-character.png',
      copy: '[map tip — Summons]',
    },
    {
      id: 'knight',
      label: 'Knight',
      src: 'ports/sprites/knight-character.png',
      copy: '[map tip — Knight]',
    },
    {
      id: 'remix',
      label: 'Remix',
      src: 'ports/sprites/puzzle-sprite.webp',
      copy: '[remix tip — puzzle-sprite character]',
    },
  ];

  const host = document.createElement('div');
  host.className = 'sprite-host';
  host.innerHTML = `
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

function mountTipWithReply(stage, actions) {
  /* FtueMapElfTip + ReplyButton (MapShareLocationButton replyScript path). */
  const STORIES = [
    {
      id: 'summons',
      label: 'Summons',
      src: 'ports/sprites/summons-character.png',
      copy: '[ask to share location]',
      reply: '[share my location]',
    },
    {
      id: 'knight',
      label: 'Knight',
      src: 'ports/sprites/knight-character.png',
      copy: '[ask to share steps]',
      reply: '[share my steps]',
    },
  ];

  const host = document.createElement('div');
  host.className = 'tip-reply-host';
  host.innerHTML = `
    <div class="tip-reply-chips" role="radiogroup" aria-label="Story accent"></div>
    <div class="tip-reply-wrap is-on" id="tipReplyWrap">
      <div class="tip-reply-box">
        <p class="tip-reply-copy" id="tipReplyCopy"></p>
        <div class="tip-reply-actions">
          <div class="tip-reply-btn-wrap is-pulse" id="tipReplyBtnWrap">
            <span class="tip-reply-pulse" aria-hidden="true"></span>
            <button type="button" class="tip-reply-btn" id="tipReplyBtn"><span></span></button>
          </div>
        </div>
      </div>
      <img class="tip-reply-char" id="tipReplyChar" alt="" decoding="async">
    </div>
  `;
  stage.appendChild(host);

  const chips = host.querySelector('.tip-reply-chips');
  const wrap = host.querySelector('#tipReplyWrap');
  const copy = host.querySelector('#tipReplyCopy');
  const char = host.querySelector('#tipReplyChar');
  const btn = host.querySelector('#tipReplyBtn');
  const btnLabel = btn.querySelector('span');
  let active = STORIES[0];

  const apply = (story) => {
    active = story;
    host.classList.toggle('is-knight', story.id === 'knight');
    char.src = story.src;
    copy.textContent = story.copy;
    btnLabel.textContent = story.reply;
    chips.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.id === story.id ? 'true' : 'false');
    });
    wrap.classList.remove('is-out');
    wrap.classList.add('is-on');
  };

  STORIES.forEach((story, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.textContent = story.label;
    chip.dataset.id = story.id;
    chip.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    chip.addEventListener('click', () => apply(story));
    chips.appendChild(chip);
  });

  const dismiss = () => {
    wrap.classList.remove('is-on');
    wrap.classList.add('is-out');
  };
  const show = () => {
    wrap.classList.remove('is-out');
    void wrap.offsetWidth;
    wrap.classList.add('is-on');
  };
  btn.addEventListener('click', dismiss);
  apply(active);
  addPlay(actions, 'Show tip', show);
  addGhost(actions, 'Dismiss', dismiss);
}

/** Disc colour filter — geometry + marks from gem-pins-v2 v33 (no reinvent). */
function mountGemDiscFilter(stage, actions) {
  const DISC_PATH = { x0: 68, y0: 36, cx: 200, cy: 112, x1: 332, y1: 36 };
  const DISC_VB_W = 400;
  const DISC_VB_H = 100;
  const DISC_STAGE_H = 104;
  const DISC_STEP = 18;
  const DISC_PX_PER_DEG = 2.6;
  const DISC_SCALE_MIN = 0.82;
  const DISC_SCALE_MAX = 1.12;
  const DISC_FADE_DEG = 36;
  const DISC_ANIM_MS = 520;
  const LIKE_PINK_HOT = '#ff7aab';
  const WISHLIST_FILL = '#e8e4ff';
  const HEART_PATH =
    'M15.0007 10.0002C16.2423 8.7835 17.5007 7.32516 17.5007 5.41683C17.5007 4.20125 17.0178 3.03547 16.1582 2.17592C15.2987 1.31638 14.1329 0.833496 12.9173 0.833496C11.4507 0.833496 10.4173 1.25016 9.16732 2.50016C7.91732 1.25016 6.88398 0.833496 5.41732 0.833496C4.20174 0.833496 3.03595 1.31638 2.17641 2.17592C1.31687 3.03547 0.833984 4.20125 0.833984 5.41683C0.833984 7.3335 2.08398 8.79183 3.33398 10.0002L9.16732 15.8335L15.0007 10.0002Z';
  const BOOKMARK_PATH = 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z';
  const GEM_SRC = {
    nature: '../gem-pins-v2/assets/gems/nature.svg',
    eat: '../gem-pins-v2/assets/gems/eat-drink.svg',
    culture: '../gem-pins-v2/assets/gems/art.svg',
    play: '../gem-pins-v2/assets/gems/play.svg',
    landmark: '../gem-pins-v2/assets/gems/landmarks.svg',
    curio: '../gem-pins-v2/assets/gems/curiosities.svg',
  };
  const GEM_COLOUR = {
    nature: '#00CD9D',
    eat: '#FF4F79',
    culture: '#41C7D8',
    play: '#F7C85C',
    landmark: '#F1A638',
    curio: '#B36BFF',
  };
  const STOPS = [
    { id: 'all', label: 'All gems', note: '[every gem nearby]', kind: 'all' },
    { id: 'nature', label: 'Nature', note: '[explain nature finds]', kind: 'cat', art: 'nature' },
    { id: 'eatshop', label: 'Eat & Drink', note: '[explain eat, drink and shop finds]', kind: 'cat', art: 'eat' },
    { id: 'culture', label: 'Culture', note: '[explain culture finds]', kind: 'cat', art: 'culture' },
    { id: 'play', label: 'Play', note: '[explain play finds]', kind: 'cat', art: 'play' },
    { id: 'landmark', label: 'Landmarks', note: '[explain landmark finds]', kind: 'cat', art: 'landmark' },
    { id: 'curio', label: 'Curiosities', note: '[explain curiosity finds]', kind: 'cat', art: 'curio' },
    { id: 'liked', label: 'Liked', note: '[explain liked gems]', kind: 'liked' },
    { id: 'wishlist', label: 'Wishlist', note: '[explain saved for later]', kind: 'wishlist' },
  ];

  const markHtml = (stop) => {
    if (stop.kind === 'all') return gemSvg(PUBLIC_GEM_FILL);
    if (stop.kind === 'liked') {
      return `<svg class="pin-gem is-heart" viewBox="0 0 19 17" aria-hidden="true"><path d="${HEART_PATH}" fill="${LIKE_PINK_HOT}"/><path d="${HEART_PATH}" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    if (stop.kind === 'wishlist') {
      return `<svg class="pin-gem is-bookmark" viewBox="0 0 24 24" aria-hidden="true"><path d="${BOOKMARK_PATH}" fill="${WISHLIST_FILL}" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    const src = GEM_SRC[stop.art] || GEM_SRC.nature;
    return `<img class="pin-gem" src="${src}" width="26" height="26" alt="" decoding="async">`;
  };

  const stopTint = (id) => {
    if (id === 'all') return PUBLIC_GEM_FILL;
    if (id === 'liked') return LIKE_PINK_HOT;
    if (id === 'wishlist') return WISHLIST_FILL;
    const stop = STOPS.find((s) => s.id === id);
    if (stop?.art) return GEM_COLOUR[stop.art] || PUBLIC_GEM_FILL;
    return PUBLIC_GEM_FILL;
  };

  const host = document.createElement('div');
  host.className = 'gem-disc-host';
  host.innerHTML = `
    <div class="gem-disc-stage" id="gemDiscStage">
      <svg class="gem-disc-arc" id="gemDiscArc" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="gem-disc-arc-glow" d="M 68 36 Q 200 112 332 36" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity="0.22"/>
        <path class="gem-disc-arc-tint" d="M 68 36 Q 200 112 332 36" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" opacity="0.92"/>
      </svg>
      <div class="gem-disc-wheel" id="gemDiscWheel" role="listbox" aria-label="Filter gems on disc"></div>
      <div class="gem-disc-caption">
        <p class="gem-disc-title" id="gemDiscTitle"></p>
        <p class="gem-disc-note" id="gemDiscNote"></p>
      </div>
    </div>
  `;
  stage.appendChild(host);

  const discStage = host.querySelector('#gemDiscStage');
  const discArc = host.querySelector('#gemDiscArc');
  const wheel = host.querySelector('#gemDiscWheel');
  const titleEl = host.querySelector('#gemDiscTitle');
  const noteEl = host.querySelector('#gemDiscNote');
  let discAngle = 0;
  let discAnim = 0;
  let stopId = 'all';

  const n = () => STOPS.length;
  const period = () => n() * DISC_STEP;
  const wrapDeg = (deg) => {
    const p = period();
    return ((deg % p) + p * 1.5) % p - p / 2;
  };
  const angleForIndex = (index) => -index * DISC_STEP;
  const nearestIndex = (angle) => {
    let idx = Math.round(-angle / DISC_STEP) % n();
    if (idx < 0) idx += n();
    return idx;
  };
  const shortestDelta = (from, to) => {
    const p = period();
    let d = to - from;
    return ((d % p) + p * 1.5) % p - p / 2;
  };
  const pointOnArc = (t) => {
    const u = (t + 1) / 2;
    const omu = 1 - u;
    const a = omu * omu;
    const b = 2 * omu * u;
    const c = u * u;
    const xSvg = a * DISC_PATH.x0 + b * DISC_PATH.cx + c * DISC_PATH.x1;
    const ySvg = a * DISC_PATH.y0 + b * DISC_PATH.cy + c * DISC_PATH.y1;
    return { leftPct: (xSvg / DISC_VB_W) * 100, topPx: (ySvg / DISC_VB_H) * DISC_STAGE_H };
  };

  const paint = (angle) => {
    const nearest = nearestIndex(angle);
    const buttons = [...wheel.querySelectorAll('button[data-stop]')];
    buttons.forEach((b, i) => {
      const deg = wrapDeg(angle + i * DISC_STEP);
      const t = Math.max(-1, Math.min(1, deg / DISC_FADE_DEG));
      const { leftPct, topPx } = pointOnArc(t);
      const abs = Math.abs(deg);
      const stepsOut = Math.round(abs / DISC_STEP);
      const proximity = Math.max(0, 1 - abs / DISC_FADE_DEG);
      const scale = DISC_SCALE_MIN + (DISC_SCALE_MAX - DISC_SCALE_MIN) * proximity;
      const on = i === nearest;
      const visible = stepsOut <= 2;
      b.style.left = `${leftPct}%`;
      b.style.top = `${topPx}px`;
      b.style.transform = `translate(-50%, -50%) scale(${scale})`;
      b.style.opacity = visible ? String(0.45 + 0.55 * proximity) : '0';
      b.style.pointerEvents = visible ? 'auto' : 'none';
      b.style.zIndex = String(on ? 5 : 1 + Math.round(proximity * 3));
      b.setAttribute('aria-selected', String(on));
      b.classList.toggle('is-front', on);
    });
    const front = STOPS[nearest];
    if (!front) return;
    const tint = stopTint(front.id);
    discStage.style.setProperty('--disc-tint', tint);
    discStage.style.color = tint;
    discArc.style.color = tint;
    discArc.style.setProperty('--disc-tint', tint);
    titleEl.textContent = front.label;
    noteEl.textContent = front.note;
    stopId = front.id;
  };

  const snapTo = (id, animate) => {
    const idx = Math.max(0, STOPS.findIndex((s) => s.id === id));
    const target = angleForIndex(idx);
    cancelAnimationFrame(discAnim);
    discAnim = 0;
    if (!animate) {
      discAngle = target;
      paint(discAngle);
      return;
    }
    const from = discAngle;
    const delta = shortestDelta(from, target);
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / DISC_ANIM_MS);
      const eased = 1 - ((1 - t) ** 3);
      discAngle = from + delta * eased;
      paint(discAngle);
      if (t < 1) {
        discAnim = requestAnimationFrame(tick);
        return;
      }
      discAnim = 0;
      discAngle = wrapDeg(target);
      paint(discAngle);
    };
    discAnim = requestAnimationFrame(tick);
  };

  const commitNearest = (animate) => {
    const next = STOPS[nearestIndex(discAngle)];
    if (!next) return;
    snapTo(next.id, animate);
  };

  wheel.replaceChildren();
  STOPS.forEach((stop) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.stop = stop.id;
    b.setAttribute('role', 'option');
    b.setAttribute('aria-label', stop.label);
    b.innerHTML = markHtml(stop);
    wheel.append(b);
  });

  let drag = null;
  discStage.addEventListener('pointerdown', (e) => {
    cancelAnimationFrame(discAnim);
    discAnim = 0;
    drag = {
      id: e.pointerId,
      x: e.clientX,
      startAngle: discAngle,
      moved: false,
      btn: e.target.closest('button[data-stop]'),
    };
    try { discStage.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  });
  discStage.addEventListener('pointermove', (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) drag.moved = true;
    if (!drag.moved) return;
    discAngle = drag.startAngle - dx / DISC_PX_PER_DEG;
    paint(discAngle);
  });
  const endDrag = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const { moved, btn } = drag;
    drag = null;
    if (!moved && btn?.dataset.stop) {
      snapTo(btn.dataset.stop, true);
      return;
    }
    commitNearest(true);
  };
  discStage.addEventListener('pointerup', endDrag);
  discStage.addEventListener('pointercancel', endDrag);

  discAngle = angleForIndex(0);
  paint(discAngle);

  addPlay(actions, 'Spin next', () => {
    const idx = (nearestIndex(discAngle) + 1) % n();
    snapTo(STOPS[idx].id, true);
  });
  addGhost(actions, 'Liked', () => snapTo('liked', true));
  addGhost(actions, 'Wishlist', () => snapTo('wishlist', true));
}

function mountMapModeSwitch(stage, actions) {
  /* Whole chapter card from map-modes + FtueMap ModeSegment (Walk/Path/Hunt). No map tiles. */
  const MAP_MODE_COLORS = {
    walkEnd: '#3ddc84',
    pin: '#2f8bff',
    hunt: '#b36bff',
    muted: '#b2b5b4',
  };
  const MODE_ORDER = [
    { id: 'step', label: 'Walk', accent: MAP_MODE_COLORS.walkEnd },
    { id: 'pin', label: 'Path', accent: MAP_MODE_COLORS.pin },
    { id: 'hunt', label: 'Hunt', accent: MAP_MODE_COLORS.hunt },
  ];
  const MODE_ICON_PATHS = {
    pin: 'M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15',
    hunt: 'M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3',
  };
  const MODE_ICON_DOTS = {
    pin: [{ cx: 6, cy: 19, r: 3 }, { cx: 18, cy: 5, r: 3 }],
    hunt: [{ cx: 12, cy: 12, r: 3 }],
  };
  const WALK_ICON = `
    <svg class="map-mode-icon" viewBox="0 0 512 512" aria-hidden="true">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M312.55 479.9l-56.42-114-44.62-57a72.37 72.37 0 01-10.06-36.9V143.64H217a40 40 0 0140 40v182.21"/>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M127.38 291.78v-74.07s37-74.07 74.07-74.07"/>
      <path fill="currentColor" d="M368.09 291.78a18.49 18.49 0 01-10.26-3.11L297.7 250a21.18 21.18 0 01-9.7-17.79v-23.7a5.65 5.65 0 018.69-4.77l81.65 54.11a18.52 18.52 0 01-10.29 33.93zM171.91 493.47a18.5 18.5 0 01-14.83-7.41c-6.14-8.18-4-17.18 3.7-25.92l59.95-74.66a7.41 7.41 0 0110.76 2.06c1.56 2.54 3.38 5.65 5.19 9.09 5.24 9.95 6 16.11-1.68 25.7-8 10-52 67.44-52 67.44-2.62 2.98-7.23 3.7-11.09 3.7z"/>
      <circle fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" cx="257" cy="69.56" r="37.04"/>
    </svg>`;

  const drawnIcon = (modeId, color) => {
    const pathD = MODE_ICON_PATHS[modeId];
    const dots = MODE_ICON_DOTS[modeId]
      .map((d) => `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="${color}" stroke="none"/>`)
      .join('');
    return `<svg class="map-mode-icon" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${pathD}"/>${dots}</svg>`;
  };

  const host = document.createElement('div');
  host.className = 'map-mode-host';
  host.innerHTML = `
    <div class="map-mode-chips">
      <button type="button" id="mapModeLock" aria-pressed="false">Lock others</button>
    </div>
    <section class="map-mode-card" id="mapModeCard">
      <div class="map-mode-story">
        <div class="map-mode-cover" aria-hidden="true"></div>
        <div>
          <div class="map-mode-story-name">[story] · [chapter]</div>
          <div class="map-mode-next">Next: <b>[objective]</b></div>
        </div>
      </div>
      <div class="map-mode-switch" role="tablist" aria-label="How you walk"></div>
      <div class="map-mode-status" id="mapModeStatus">
        <p class="map-mode-steps-count"><span id="mapModeSteps">102</span></p>
        <p class="map-mode-steps-label" id="mapModeStepsLabel">out of 240 steps</p>
        <div class="map-mode-bar" id="mapModeBar"><i style="width:42%"></i></div>
      </div>
      <div class="map-mode-actions" id="mapModeActions" hidden>
        <button type="button" class="map-mode-shutter" aria-label="Take photo"></button>
      </div>
      <p class="map-mode-hint">[switch any time — steps always count]</p>
    </section>
  `;
  stage.appendChild(host);
  const row = host.querySelector('.map-mode-switch');
  const lockBtn = host.querySelector('#mapModeLock');
  const statusEl = host.querySelector('#mapModeStatus');
  const actionsEl = host.querySelector('#mapModeActions');
  const barFill = host.querySelector('#mapModeBar > i');
  let selected = 'step';
  let lockOthers = false;

  const iconHtml = (mode, selectedNow) => {
    const darkText = selectedNow && mode.id === 'step';
    const color = selectedNow
      ? (darkText ? '#170c35' : '#fff')
      : MAP_MODE_COLORS.muted;
    if (mode.id === 'step') {
      return WALK_ICON.split('currentColor').join(color);
    }
    return drawnIcon(mode.id, color);
  };

  const syncStatus = () => {
    const isHunt = selected === 'hunt';
    statusEl.hidden = isHunt;
    actionsEl.hidden = !isHunt;
    const accent = MODE_ORDER.find((m) => m.id === selected)?.accent || MAP_MODE_COLORS.walkEnd;
    barFill.style.background = accent;
    barFill.parentElement.style.setProperty('--bar-fill', accent);
  };

  const render = () => {
    row.replaceChildren();
    MODE_ORDER.forEach((mode) => {
      const selectedNow = mode.id === selected;
      const locked = lockOthers && !selectedNow;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `map-mode-segment${locked ? ' is-locked' : ''}`;
      btn.dataset.mode = mode.id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', selectedNow ? 'true' : 'false');
      btn.innerHTML = `${iconHtml(mode, selectedNow)}<span>${mode.label}</span><span class="map-mode-lock" aria-hidden="true"></span>`;
      btn.addEventListener('click', () => {
        if (locked) return;
        selected = mode.id;
        render();
      });
      row.appendChild(btn);
    });
    syncStatus();
  };

  lockBtn.addEventListener('click', () => {
    lockOthers = !lockOthers;
    lockBtn.setAttribute('aria-pressed', lockOthers ? 'true' : 'false');
    render();
  });
  render();
  addPlay(actions, 'Select Walk', () => {
    selected = 'step';
    render();
  });
  addGhost(actions, 'Select Hunt', () => {
    selected = 'hunt';
    render();
  });
}

function mountEndStoryBadgesPopup(stage, actions) {
  /* EndStoryInlineBadges open/close + BadgeCollection bounce clocks (from mount/open). */
  const MODAL_OPEN_MS = 820;
  const MODAL_CLOSE_MS = 520;
  const MODAL_SLIDE_OFFSET = 48;
  const MODAL_BADGES_FADE_MS = 340;
  const MODAL_BADGES_FADE_DELAY_MS = 380;
  const VIEW_ANIMATION_DELAY_MS = 500;
  const TITLE_FADE_DURATION_MS = 400;
  const STAGGER_DELAY_MS = 300;
  const MAX_STAGGER_DELAY_MS = 1200;
  /* Grid badges wait for featured title fade: VIEW + TITLE_FADE (BadgeCollection). */
  const GRID_ANIMATION_DELAY_MS = VIEW_ANIMATION_DELAY_MS + TITLE_FADE_DURATION_MS;
  const EASE_OUT = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
  const EASE_IN = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
  const COVER =
    'https://creator.storycity.app/media/6a9079bce0f3c_TALES_COVERARTv4.png';
  const TALES = [
    { file: 'assets/badges/tales/10-cye-took-farron-s-case.png', name: 'Cye took Farron\u2019s case' },
    { file: 'assets/badges/tales/01-cye-discovered-a-secret-vault.png', name: 'Cye discovered a secret vault' },
    { file: 'assets/badges/tales/12-cye-found-a-shard-of-broken-porcelain.png', name: 'Cye found a shard of broken porcelain' },
    { file: 'assets/badges/tales/27-episode-one-complete.png', name: 'Episode one complete' },
  ];
  const featured = TALES.slice(0, 3);
  const grid = TALES;
  const earnedCount = 3;

  const host = document.createElement('div');
  host.className = 'badge-host';
  host.style.setProperty('--badge-mask', `url("${TALES[3].file}")`);
  host.innerHTML = `
    <div class="badge-scrim" id="badgeScrim" aria-hidden="true"></div>
    <div class="badge-modal" id="badgeModal" role="dialog" aria-label="End story badges">
      <div class="badge-modal-body">
        <div class="badge-hero">
          <img src="${COVER}" alt="" decoding="async">
          <div class="badge-hero-grad" aria-hidden="true"></div>
        </div>
        <div class="badge-hero-spacer" aria-hidden="true"></div>
        <button type="button" class="badge-close" id="badgeClose" aria-label="Close">×</button>
        <div class="badge-header">
          <div class="badge-title-bar">
            <h2 class="badge-story-title">Tales from the Incident</h2>
            <button type="button" class="badge-share" aria-label="Share story">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v10M8.5 6.5 12 3l3.5 3.5M6 12v6.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V12"
                  fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="badge-body">
          <div class="badge-stats">
            <div class="badge-stats-row">
              <div class="badge-stats-cell"><b>1/4</b> endings reached</div>
              <div class="badge-stats-cell"><b>2,541</b> steps</div>
            </div>
            <div class="badge-stats-row">
              <div class="badge-stats-cell"><b>3/4</b> badges</div>
              <div class="badge-stats-cell"><b>42</b> min</div>
            </div>
          </div>
          <div class="badge-section" id="badgeSection">
            <p class="badge-earned-title">You earned new badges!</p>
            <div class="badge-carousel" id="badgeCarousel"></div>
            <div class="badge-dots" id="badgeDots"></div>
            <p class="badge-collected-label">You have collected ${earnedCount} badges!</p>
            <div class="badge-grid" id="badgeGrid"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  stage.appendChild(host);

  const scrim = host.querySelector('#badgeScrim');
  const modal = host.querySelector('#badgeModal');
  const section = host.querySelector('#badgeSection');
  const carousel = host.querySelector('#badgeCarousel');
  const dots = host.querySelector('#badgeDots');
  const gridEl = host.querySelector('#badgeGrid');
  const closeBtn = host.querySelector('#badgeClose');

  featured.forEach((badge, i) => {
    const page = document.createElement('div');
    page.className = 'badge-carousel-page';
    page.innerHTML = `<img src="${badge.file}" alt="${badge.name}" decoding="async" data-bounce="featured-${i}">`;
    carousel.appendChild(page);
    const dot = document.createElement('span');
    dot.className = 'badge-dot' + (i === 0 ? ' is-on' : '');
    dots.appendChild(dot);
  });

  grid.forEach((badge, i) => {
    const cell = document.createElement('div');
    cell.className = 'badge-cell';
    cell.dataset.bounce = `grid-${i}`;
    if (i < earnedCount) {
      cell.innerHTML = `<img src="${badge.file}" alt="${badge.name}" decoding="async">`;
    } else {
      cell.innerHTML = `<span class="badge-unearned" aria-label="unearned"></span>`;
    }
    gridEl.appendChild(cell);
  });

  carousel.addEventListener('scroll', () => {
    const pageW = carousel.clientWidth || 1;
    const idx = Math.round(carousel.scrollLeft / pageW);
    dots.querySelectorAll('.badge-dot').forEach((d, i) => {
      d.classList.toggle('is-on', i === idx);
    });
  });

  let openAnims = [];
  const bounceAnims = [];
  let badgesTimer = null;
  let isOpen = false;
  let isClosing = false;

  const cancelOpenWork = () => {
    openAnims.forEach((a) => a.cancel());
    openAnims = [];
    bounceAnims.forEach((a) => a.cancel());
    bounceAnims.length = 0;
    if (badgesTimer != null) {
      clearTimeout(badgesTimer);
      badgesTimer = null;
    }
  };

  /* Reanimated withSequence of withTiming — each step its own duration (not one curve).
     Default withTiming easing ≈ inOut quad. */
  const BOUNCE_DURATION_MS = 600;
  const BOUNCE_EASE = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';
  const BOUNCE_STEPS = [
    { scale: 1.2, duration: BOUNCE_DURATION_MS * 0.55 },
    { scale: 0.9, duration: BOUNCE_DURATION_MS * 0.15 },
    { scale: 1.1, duration: BOUNCE_DURATION_MS * 0.15 },
    { scale: 1, duration: BOUNCE_DURATION_MS * 0.15 },
  ];
  const armBounce = (el, delayMs) => {
    el.getAnimations().forEach((a) => a.cancel());
    el.style.transform = 'scale(0)';
    let from = 0;
    BOUNCE_STEPS.forEach((step, i) => {
      const to = step.scale;
      const anim = el.animate(
        [
          { transform: `scale(${from})` },
          { transform: `scale(${to})` },
        ],
        {
          duration: step.duration,
          delay: delayMs + BOUNCE_STEPS.slice(0, i).reduce((s, x) => s + x.duration, 0),
          easing: BOUNCE_EASE,
          fill: 'forwards',
        },
      );
      bounceAnims.push(anim);
      from = to;
    });
  };

  const resetBadgeBounces = () => {
    section.style.opacity = '0';
    section.style.transition = 'none';
    bounceAnims.forEach((a) => a.cancel());
    bounceAnims.length = 0;
    carousel.querySelectorAll('img').forEach((el) => {
      el.style.transform = 'scale(0)';
    });
    gridEl.querySelectorAll('.badge-cell').forEach((el) => {
      el.style.transform = 'scale(0)';
    });
  };

  /* Featured AnimatedBadge: delay = index * 300 (animationDelayMs defaults 0).
     Grid: delay = GRID_ANIMATION_DELAY_MS + index * 300.
     Clocks start at open — not after the badges fade delay. */
  const runBadgeBounces = () => {
    carousel.querySelectorAll('img').forEach((img, i) => {
      armBounce(img, Math.min(i * STAGGER_DELAY_MS, MAX_STAGGER_DELAY_MS));
    });
    gridEl.querySelectorAll('.badge-cell').forEach((cell, i) => {
      armBounce(
        cell,
        GRID_ANIMATION_DELAY_MS + Math.min(i * STAGGER_DELAY_MS, MAX_STAGGER_DELAY_MS),
      );
    });
  };

  const setClosedVisual = () => {
    modal.style.transform = `translate(-50%, calc(-50% + ${MODAL_SLIDE_OFFSET}px))`;
    modal.style.opacity = '0';
    scrim.style.opacity = '0';
    resetBadgeBounces();
  };

  const open = () => {
    if (isClosing) return;
    cancelOpenWork();
    setClosedVisual();
    void host.offsetWidth;
    isOpen = true;

    const slide = modal.animate(
      [
        { transform: `translate(-50%, calc(-50% + ${MODAL_SLIDE_OFFSET}px))` },
        { transform: 'translate(-50%, -50%)' },
      ],
      { duration: MODAL_OPEN_MS, easing: EASE_OUT, fill: 'forwards' },
    );
    const cardOp = modal.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: Math.round(MODAL_OPEN_MS * 0.55), easing: EASE_OUT, fill: 'forwards' },
    );
    const backOp = scrim.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: Math.round(MODAL_OPEN_MS * 0.7), easing: EASE_OUT, fill: 'forwards' },
    );
    openAnims = [slide, cardOp, backOp];

    /* Bounce clocks start with entrance (BadgeCollection mounts before fade). */
    runBadgeBounces();
    badgesTimer = window.setTimeout(() => {
      section.style.transition = `opacity ${MODAL_BADGES_FADE_MS}ms ${EASE_OUT}`;
      section.style.opacity = '1';
    }, MODAL_BADGES_FADE_DELAY_MS);
  };

  const close = () => {
    if (!isOpen || isClosing) return;
    isClosing = true;
    cancelOpenWork();
    const slide = modal.animate(
      [
        { transform: 'translate(-50%, -50%)' },
        { transform: `translate(-50%, calc(-50% + ${MODAL_SLIDE_OFFSET}px))` },
      ],
      { duration: MODAL_CLOSE_MS, easing: EASE_IN, fill: 'forwards' },
    );
    const cardOp = modal.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: MODAL_CLOSE_MS, easing: EASE_IN, fill: 'forwards' },
    );
    const backOp = scrim.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: MODAL_CLOSE_MS, easing: EASE_IN, fill: 'forwards' },
    );
    openAnims = [slide, cardOp, backOp];
    Promise.all(openAnims.map((a) => a.finished.catch(() => {}))).then(() => {
      isOpen = false;
      isClosing = false;
      setClosedVisual();
    });
  };

  scrim.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  open();
  addPlay(actions, 'Play open', open);
  addGhost(actions, 'Close', close);
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
