// Story City: "team notes" mode. Adds class "notes" to <html> when ?notes=1 is in the address (?notes=0 turns it off),
// or when it was left on earlier. Loaded in <head> so the class is set before first paint. Safe on any page.
(() => {
  const root = document.documentElement, KEY = 'sc-notes';
  const read = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
  const write = on => { try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {} };
  const q = new URLSearchParams(location.search).get('notes');
  if (q === '1') write(true); else if (q === '0') write(false);
  const apply = on => { root.classList.toggle('notes', on); document.querySelectorAll('.draft-flag[aria-pressed]').forEach(b => b.setAttribute('aria-pressed', on)); document.dispatchEvent(new CustomEvent('sc:notes', { detail: on })); };
  root.classList.toggle('notes', read());
  window.SC_NOTES = { on: () => root.classList.contains('notes'), set: on => { write(on); apply(on); } };
  document.addEventListener('DOMContentLoaded', () => {
    const flag = document.querySelector('button.draft-flag');
    if (flag) { flag.setAttribute('aria-pressed', root.classList.contains('notes')); flag.addEventListener('click', () => window.SC_NOTES.set(!window.SC_NOTES.on())); }
  });
})();
