(() => {
  'use strict';

  /** Stolen from app WelcomeHook — Summons energy-circle portal. */
  const PORTAL_LOTTIE = 'stolen/welcome_hook_reveal_first.json';
  const OVERVIEW_LINGER_MS = 2800;
  const PLACES = ['feed', 'overview'];

  const body = document.body;
  const feed = document.getElementById('surfaceFeed');
  const overview = document.getElementById('surfaceOverview');
  const inviteFeed = document.getElementById('guideInviteFeed');
  const inviteOverview = document.getElementById('guideInviteOverview');
  const btns = [...document.querySelectorAll('.dbg-btn[data-place]')];
  const portals = {
    feed: document.getElementById('portalFeed'),
    overview: document.getElementById('portalOverview'),
  };
  const anims = { feed: null, overview: null };
  let lingerTimer = 0;

  function placeFromQuery() {
    try {
      const v = new URLSearchParams(location.search).get('v');
      if (v && PLACES.includes(v)) return v;
    } catch (_) { /* ignore */ }
    return 'feed';
  }

  function writeQuery(place) {
    try {
      const url = new URL(location.href);
      url.searchParams.set('v', place);
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    } catch (_) { /* ignore */ }
  }

  function tintPortalBrand(anim) {
    try {
      const root = anim.renderer && anim.renderer.svgElement;
      if (!root) return;
      root.querySelectorAll('[fill]').forEach((node) => {
        const f = node.getAttribute('fill');
        if (f && f !== 'none' && f !== 'transparent') node.setAttribute('fill', '#009eff');
      });
    } catch (_) { /* best-effort */ }
  }

  function mountPortal(key) {
    const host = portals[key];
    if (!host || !window.lottie || anims[key]) return;
    const anim = window.lottie.loadAnimation({
      container: host,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: PORTAL_LOTTIE,
    });
    anim.setSpeed(0.85);
    anim.addEventListener('DOMLoaded', () => tintPortalBrand(anim));
    anims[key] = anim;
  }

  function stopPortal(key) {
    if (!anims[key]) return;
    anims[key].destroy();
    anims[key] = null;
    if (portals[key]) portals[key].innerHTML = '';
  }

  function clearLinger() {
    if (lingerTimer) {
      window.clearTimeout(lingerTimer);
      lingerTimer = 0;
    }
  }

  const SLIDE_AWAY_MS = 380;

  function hideInviteNow(el) {
    if (!el) return;
    el.hidden = true;
    el.classList.remove('is-in', 'is-out');
  }

  function slideAwayInvite(el) {
    if (!el || el.hidden || el.classList.contains('is-out')) return;
    el.classList.remove('is-in');
    el.classList.add('is-out');
    window.setTimeout(() => {
      hideInviteNow(el);
      if (el === inviteFeed) stopPortal('feed');
      if (el === inviteOverview) stopPortal('overview');
    }, SLIDE_AWAY_MS);
  }

  function applyPlace(place) {
    const next = PLACES.includes(place) ? place : 'feed';
    body.dataset.place = next;
    writeQuery(next);
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.place === next)));
    clearLinger();

    if (next === 'feed') {
      overview.hidden = true;
      feed.hidden = false;
      hideInviteNow(inviteOverview);
      stopPortal('overview');
      if (inviteFeed) {
        inviteFeed.hidden = false;
        inviteFeed.classList.remove('is-out');
      }
      mountPortal('feed');
      return;
    }

    feed.hidden = true;
    overview.hidden = false;
    stopPortal('feed');
    hideInviteNow(inviteOverview);
    lingerTimer = window.setTimeout(() => {
      mountPortal('overview');
      if (inviteOverview) {
        inviteOverview.hidden = false;
        inviteOverview.classList.remove('is-out');
        requestAnimationFrame(() => inviteOverview.classList.add('is-in'));
      }
    }, OVERVIEW_LINGER_MS);
  }

  btns.forEach((b) => b.addEventListener('click', () => applyPlace(b.dataset.place)));
  document.querySelectorAll('[data-dismiss]').forEach((btn) => {
    btn.addEventListener('click', () => slideAwayInvite(btn.closest('.guide-invite')));
  });

  applyPlace(placeFromQuery());
})();
