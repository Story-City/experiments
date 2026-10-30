// Story City — shared behaviour for secondary pages: mobile nav + scroll reveal.
(() => {
  const nav = document.querySelector('.pg-nav');
  const btn = nav && nav.querySelector('.pg-menu');
  if (nav && btn) {
    const set = open => { nav.dataset.open = open; btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
    set(false);
    btn.addEventListener('click', e => { e.stopPropagation(); set(nav.dataset.open !== 'true'); });
    document.addEventListener('click', e => { if (nav.dataset.open === 'true' && !nav.contains(e.target)) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.dataset.open === 'true') { set(false); btn.focus(); } });
    nav.querySelectorAll('.pg-links a').forEach(a => a.addEventListener('click', () => set(false)));
  }

  const els = document.querySelectorAll('[data-reveal]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); en.target.dispatchEvent(new CustomEvent('pg:reveal')); io.unobserve(en.target); }
  }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => io.observe(el));
})();
