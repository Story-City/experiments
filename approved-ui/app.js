/** Approved UI library — APPROVED-UI-v2
 * Playable catalog of elements we’re keeping, plus Location Gems color sliders.
 * v2 adds day-reached embed, likes banner, step glance, glass bubble.
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

const MOTION_VARS = {
  swoosh: 'var(--ease-swoosh)',
  spring: 'var(--ease-spring)',
  out: 'var(--ease-out)',
};

/** @type {{ id: string, title: string, behavior: string, mount: (stage: HTMLElement, actions: HTMLElement) => void }[]} */
const ELEMENT_DEFS = [
  {
    id: 'day-reached',
    title: 'Day reached (Training Hub)',
    behavior: 'App streak overlay: haze → Lottie bloom on today bead → side beads domino → glory shine on copy → dissolve. Full SC-3526 timing. Tap Play (or the phone). Accent follows the library slider.',
    mount: mountDayReached,
    wide: true,
  },
  {
    id: 'likes-banner',
    title: 'Likes banner + rarity up',
    behavior: 'Location Gems celebration: haze + shine sweep + jam card slide/impact · optional rarity promote pop. Same rich-text shine family as day-reached.',
    mount: mountLikesBanner,
  },
  {
    id: 'step-glance',
    title: 'Step Glance land',
    behavior: 'App StepGlance pill: arc fill + step count land (from daily-side-quests / StepGlanceArcProgress).',
    mount: mountStepGlance,
  },
  {
    id: 'elf-tip',
    title: 'Elf tip (tip.png)',
    behavior: 'Show · tap advances copy · swipe right dismisses · same tip.png bubble + elf. Bracket copy for the team.',
    mount: mountElfTip,
  },
  {
    id: 'spotlight-tip',
    title: 'Spotlight tip',
    behavior: 'Scrim with a hole on a target · tip card + elf below · tap scrim to dismiss. From first-story / gems onboard.',
    mount: mountSpotlightTip,
  },
  {
    id: 'glass-bubble',
    title: 'FTUE glass bubble',
    behavior: 'Frosted chat/map bubble (GLASS_BUBBLE family): soft enter. From ScriptedFtue / first-story-flow.',
    mount: mountGlassBubble,
  },
  {
    id: 'jam-birth',
    title: 'Your gem birth shine',
    behavior: 'Purple jam pops onto the map with bloom + ring + shine sweep. Play to fire birth.',
    mount: mountJamBirth,
  },
  {
    id: 'gem-unlock',
    title: 'Others’ gems unlock',
    behavior: 'Gray locked gems → tap Play to grow into cyan (domino). Locked tap shows tip intent.',
    mount: mountGemUnlock,
  },
  {
    id: 'domino-route',
    title: 'Domino gems',
    behavior: 'Staggered appear of your gems (exit / route juice). Motion preset drives the ease.',
    mount: mountDomino,
  },
  {
    id: 'share-chrome',
    title: 'Like · Share · arrow',
    behavior: 'Compact like · white Share pill · bare chevron inside the panel. Tap to try each.',
    mount: mountShareChrome,
  },
  {
    id: 'end-stats',
    title: 'End-story stats',
    behavior: 'EndStoryStatsSection pattern: bold value + soft label, 2-col grid (steps · min · gems).',
    mount: mountEndStats,
  },
  {
    id: 'confirm',
    title: 'Complete-walk confirm',
    behavior: 'Glass confirm card · keep / complete. Buffer before leaving a mid-walk map.',
    mount: mountConfirm,
  },
  {
    id: 'primary-cta',
    title: 'Primary CTA + radial',
    behavior: 'Gradient pill with Location Gems radial wash. Pulse uses the active motion preset.',
    mount: mountPrimaryCta,
  },
  {
    id: 'claim-pulse',
    title: 'Claim CTA pulse',
    behavior: 'End-of-story / gift claim: soft glow idle pulse (useBannerPulse family) · tap press. From claim-pulse experiment + app event CTA.',
    mount: mountClaimPulse,
  },
];

const library = document.getElementById('library');
const accentColor = document.getElementById('accentColor');
const accentAlpha = document.getElementById('accentAlpha');
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

function applyAccent() {
  const hex = accentColor.value || '#00c2ff';
  const alpha = (Number(accentAlpha.value) || 100) / 100;
  const { r, g, b } = hexToRgb(hex);
  const deep = `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 20)})`;
  const accent = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  const solid = `rgb(${r}, ${g}, ${b})`;
  const soft = softAccentHex(hex);
  const root = document.documentElement.style;
  root.setProperty('--brand-accent', accent);
  root.setProperty('--brand-primary', solid);
  root.setProperty('--brand-primary-deep', deep);
  root.setProperty('--accent-soft', soft);
  root.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, ${0.55 * alpha})`);
  applyRadial();
}

function applyRadial() {
  const hex = (radialColor && radialColor.value) || '#b36bff';
  const amount = ((radialAmount && Number(radialAmount.value)) || 55) / 100;
  const { r, g, b } = hexToRgb(hex);
  document.documentElement.style.setProperty('--btn-radial-solid', hex);
  document.documentElement.style.setProperty('--btn-radial', `rgba(${r}, ${g}, ${b}, ${0.75 * amount})`);
  document.documentElement.style.setProperty(
    '--btn-radial-wash',
    `radial-gradient(ellipse 200% 70% at 50% 45%, rgba(${r}, ${g}, ${b}, ${0.75 * amount}), transparent 72%)`,
  );
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

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function makeCard(def) {
  const card = document.createElement('article');
  card.className = def.wide ? 'card card-wide' : 'card';
  card.dataset.element = def.id;

  const head = document.createElement('div');
  head.className = 'card-head';
  head.innerHTML = `<h2 class="card-title">${def.title}</h2><p class="card-behavior">${def.behavior}</p>`;
  card.appendChild(head);

  const stage = document.createElement('div');
  stage.className = def.wide ? 'stage stage-tall' : 'stage';
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

function mountDayReached(stage, actions) {
  const frame = document.createElement('iframe');
  frame.className = 'embed-frame';
  frame.title = 'Day reached celebration';
  frame.src = `../day-reached-overlay/embed.html?v=36&n=${Date.now()}`;
  frame.allow = 'autoplay';
  stage.appendChild(frame);

  const play = () => {
    const accent = accentColor.value || '#009EFF';
    frame.contentWindow?.postMessage({ type: 'play-day-reached', accent }, '*');
  };
  addPlay(actions, 'Play day reached', play);
  addGhost(actions, 'Open full', () => {
    window.open('../day-reached-overlay/?v=36', '_blank', 'noopener');
  });
}

function mountLikesBanner(stage, actions) {
  const banner = document.createElement('div');
  banner.className = 'demo-likes';
  banner.innerHTML = `
    <div class="demo-likes-haze"></div>
    <div class="demo-likes-shine"></div>
    <div class="demo-likes-copy">
      <p class="demo-likes-headline"><span class="demo-likes-rich">48 likes</span></p>
      <p class="demo-likes-sub">[likes landed on your gem]</p>
    </div>
    <article class="demo-likes-card">
      <img src="../location-gems/assets/find-a.jpg" alt="" decoding="async">
      <div class="demo-likes-gem" aria-hidden="true">${gemSvg(CYAN)}</div>
      <p class="demo-likes-rarity" hidden>Silver</p>
      <div class="demo-likes-body">
        <p class="demo-likes-user">@you</p>
        <p class="demo-likes-text">[find caption]</p>
      </div>
    </article>
  `;
  stage.appendChild(banner);
  const card = banner.querySelector('.demo-likes-card');
  const rarity = banner.querySelector('.demo-likes-rarity');
  const rich = banner.querySelector('.demo-likes-rich');
  const shine = banner.querySelector('.demo-likes-shine');
  const copy = banner.querySelector('.demo-likes-copy');
  let busy = false;

  const reset = () => {
    banner.classList.remove('is-on', 'is-out');
    card.classList.remove('is-in', 'is-impact', 'is-rarity-up', 'is-out');
    shine.classList.remove('is-on');
    copy.classList.remove('is-on', 'is-swipe');
    rarity.hidden = true;
    rarity.classList.remove('is-pop');
    rich.textContent = '48 likes';
  };

  const play = async ({ promote } = {}) => {
    if (busy) return;
    busy = true;
    reset();
    banner.classList.add('is-on');
    await wait(120);
    shine.classList.add('is-on');
    card.classList.add('is-in');
    copy.classList.add('is-on');
    await wait(560);
    card.classList.add('is-impact');
    if (promote) {
      await wait(720);
      rich.textContent = '120 likes';
      rarity.hidden = false;
      rarity.textContent = 'Gold';
      rarity.classList.add('is-pop');
      card.classList.add('is-rarity-up');
      await wait(720);
    } else {
      await wait(1400);
    }
    await wait(900);
    copy.classList.add('is-swipe');
    await wait(700);
    card.classList.remove('is-in', 'is-impact', 'is-rarity-up');
    card.classList.add('is-out');
    await wait(360);
    banner.classList.add('is-out');
    await wait(240);
    reset();
    busy = false;
  };

  addPlay(actions, 'Play likes', () => play({ promote: false }));
  addGhost(actions, 'Rarity up', () => play({ promote: true }));
}

function mountStepGlance(stage, actions) {
  const wrap = document.createElement('div');
  wrap.className = 'demo-glance';
  const ARC_LEN = 279.25;
  wrap.innerHTML = `
    <div class="demo-glance-pill">
      <div class="demo-glance-arc">
        <svg viewBox="-38 -54 316 182.11" aria-hidden="true">
          <path class="demo-glance-track" d="" fill="none" stroke-linecap="round" stroke-width="8"></path>
          <path class="demo-glance-fill" d="" fill="none" stroke-linecap="round" stroke-width="8"></path>
        </svg>
      </div>
      <p class="demo-glance-steps">0</p>
      <p class="demo-glance-out">out of 5,000 steps today</p>
    </div>
  `;
  stage.appendChild(wrap);
  const track = wrap.querySelector('.demo-glance-track');
  const fill = wrap.querySelector('.demo-glance-fill');
  const stepsEl = wrap.querySelector('.demo-glance-steps');

  // Same geometry as daily-side-quests / StepGlanceArcProgressStyles
  const cx = 120;
  const cy = 96;
  const r = 80;
  const start = (190 * Math.PI) / 180;
  const end = (-10 * Math.PI) / 180;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const d = `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;
  track.setAttribute('d', d);
  fill.setAttribute('d', d);
  fill.style.strokeDasharray = `${ARC_LEN}`;
  fill.style.strokeDashoffset = `${ARC_LEN}`;

  const play = async () => {
    wrap.classList.add('is-on');
    fill.style.transition = 'none';
    fill.style.strokeDashoffset = `${ARC_LEN * 0.55}`;
    stepsEl.textContent = '2,200';
    void fill.offsetWidth;
    fill.style.transition = `stroke-dashoffset 980ms var(--motion)`;
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
  const reset = () => {
    wrap.classList.remove('is-on');
    fill.style.transition = 'none';
    fill.style.strokeDashoffset = `${ARC_LEN}`;
    stepsEl.textContent = '0';
  };
  addPlay(actions, 'Land glance', play);
  addGhost(actions, 'Reset', reset);
}

function mountGlassBubble(stage, actions) {
  const bubble = document.createElement('div');
  bubble.className = 'demo-glass';
  bubble.innerHTML = `<p>[glass bubble message from the map or chat]</p>`;
  stage.appendChild(bubble);
  const show = () => {
    bubble.classList.remove('is-on');
    void bubble.offsetWidth;
    bubble.classList.add('is-on');
  };
  addPlay(actions, 'Enter bubble', show);
}

function mountElfTip(stage, actions) {
  const tip = document.createElement('div');
  tip.className = 'demo-tip';
  tip.innerHTML = `
    <img class="demo-tip-art" src="assets/tip.png" alt="" decoding="async">
    <p class="demo-tip-copy" id="elfTipCopy">[explain challenge: find 3 patterns]</p>
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
  wrap.className = 'demo-spot';
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
  row.innerHTML = `<div class="demo-gem-row"><button type="button" class="gem-pin" id="jamDemo" aria-label="Your gem">${gemSvg(PURPLE)}</button></div>`;
  const pin = row.querySelector('.gem-pin');
  pin.innerHTML = `<span class="jam-pulse" aria-hidden="true"></span><span class="jam-shine" aria-hidden="true"></span>${gemSvg(PURPLE)}`;
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
    pin.innerHTML = gemSvg(GRAY);
    pin.addEventListener('click', () => {
      if (pin.classList.contains('is-locked')) {
        // Intent only — locked tip copy lives in daily-side-quests
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
      pin.innerHTML = gemSvg(CYAN);
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
    pin.className = 'gem-pin is-domino';
    pin.innerHTML = gemSvg(PURPLE);
    inner.appendChild(pin);
    return pin;
  });
  row.appendChild(inner);
  stage.appendChild(row);

  const play = async () => {
    pins.forEach((p) => p.classList.remove('is-in'));
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
  let idx = 0;
  chrome.querySelector('.next-arrow').addEventListener('click', () => {
    idx = (idx + 1) % 3;
    count.textContent = String(7 + idx * 5);
  });
  addPlay(actions, 'Pulse panel', () => {
    chrome.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 360 });
  });
}

function mountEndStats(stage, actions) {
  const stats = document.createElement('div');
  stats.className = 'demo-stats';
  stats.innerHTML = `
    <p class="route-stat"><span class="route-stat-value" data-k="steps">0</span> steps</p>
    <p class="route-stat"><span class="route-stat-value" data-k="min">0</span> min</p>
    <p class="route-stat"><span class="route-stat-value" data-k="gems">0</span> gems</p>
  `;
  stage.appendChild(stats);
  const play = () => {
    stats.classList.add('is-on');
    stats.querySelector('[data-k="steps"]').textContent = '2,541';
    stats.querySelector('[data-k="min"]').textContent = '12';
    stats.querySelector('[data-k="gems"]').textContent = '3';
  };
  const reset = () => {
    stats.classList.remove('is-on');
    stats.querySelectorAll('.route-stat-value').forEach((el) => { el.textContent = '0'; });
  };
  addPlay(actions, 'Reveal stats', play);
  addGhost(actions, 'Reset', reset);
}

function mountConfirm(stage, actions) {
  const sheet = document.createElement('div');
  sheet.className = 'demo-confirm';
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
  const wrap = document.createElement('div');
  wrap.className = 'demo-claim';
  wrap.innerHTML = `
    <div class="demo-claim-glow" aria-hidden="true"></div>
    <button type="button" class="demo-claim-cta">[claim free trial]</button>
  `;
  stage.appendChild(wrap);
  const cta = wrap.querySelector('.demo-claim-cta');
  const press = () => {
    cta.classList.remove('is-press');
    void cta.offsetWidth;
    cta.classList.add('is-press');
  };
  cta.addEventListener('click', press);
  addPlay(actions, 'Tap claim', press);
  addGhost(actions, 'Open full', () => {
    window.open('../claim-pulse/?v=1', '_blank', 'noopener');
  });
}

function buildLibrary() {
  library.replaceChildren();
  ELEMENT_DEFS.forEach((def) => library.appendChild(makeCard(def)));
}

function syncDayReachedAccent() {
  const accent = accentColor.value || '#009EFF';
  document.querySelectorAll('.embed-frame').forEach((frame) => {
    frame.contentWindow?.postMessage({ type: 'set-day-reached-accent', accent }, '*');
  });
}

accentColor.addEventListener('input', () => {
  applyAccent();
  syncDayReachedAccent();
});
accentAlpha.addEventListener('input', applyAccent);
radialColor.addEventListener('input', applyRadial);
radialAmount.addEventListener('input', applyRadial);
bgColor.addEventListener('input', applyBg);
bgDepth.addEventListener('input', applyBg);
document.querySelectorAll('input[name="motion"]').forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) applyMotion(input.value);
  });
});

applyAccent();
applyRadial();
applyBg();
applyMotion('swoosh');
buildLibrary();
