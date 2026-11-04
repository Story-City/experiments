(() => {
  'use strict';

  const LINGER_MS = 4500;
  const PLACES = ['feed', 'overview-top', 'linger-bottom'];

  const body = document.body;
  const slot = document.getElementById('inviteSlot');
  const tip = document.getElementById('inviteTip');
  const sprite = tip && tip.querySelector('.sprite');
  const btns = [...document.querySelectorAll('.dbg-btn[data-place]')];

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

  function clearLinger() {
    if (lingerTimer) {
      window.clearTimeout(lingerTimer);
      lingerTimer = 0;
    }
  }

  function showInvite(immediate) {
    if (!slot) return;
    slot.hidden = false;
    slot.classList.toggle('is-in', !!immediate || body.dataset.place === 'feed');
    if (body.dataset.place !== 'feed') {
      requestAnimationFrame(() => slot.classList.add('is-in'));
    }
  }

  function hideInviteForLinger() {
    if (!slot) return;
    slot.hidden = true;
    slot.classList.remove('is-in');
  }

  function applyPlace(place) {
    const next = PLACES.includes(place) ? place : 'feed';
    body.dataset.place = next;
    writeQuery(next);
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.place === next)));
    clearLinger();

    if (next === 'feed') {
      showInvite(true);
      return;
    }

    hideInviteForLinger();
    lingerTimer = window.setTimeout(() => showInvite(true), LINGER_MS);
  }

  btns.forEach((b) => {
    b.addEventListener('click', () => applyPlace(b.dataset.place));
  });

  if (sprite) {
    sprite.addEventListener('error', () => {
      const fb = sprite.getAttribute('data-fallback');
      if (fb && sprite.src !== fb) sprite.src = fb;
    });
  }

  applyPlace(placeFromQuery());
})();
