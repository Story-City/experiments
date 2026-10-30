// Story City — shared data helpers for cities.html + city.html.
// Reads only the real catalogue in data/. Never invents counts or ratings.

export const slugify = s => String(s || '').toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// "Victoria (AU)" → "Victoria" for display; the slug keeps the tag so it stays unique.
export const displayCity = s => String(s || '').replace(/\s*\([A-Z]{2}\)\s*$/, '');

const SMALL = new Set(['a','an','and','as','at','but','by','for','in','nor','of','on','or','the','to','vs','via','with']);
// Title Case for English titles only. Leaves existing capitals alone (ATL, ZeNGY); French keeps its own rules.
export function titleCase(name, lang){
  if (lang === 'fr') return name;
  const words = String(name).split(' ');
  return words.map((w, i) => {
    if (!w) return w;
    const bare = w.toLowerCase();
    if (i > 0 && i < words.length - 1 && SMALL.has(bare)) return w;
    return w.replace(/^([^\p{L}]*)(\p{Ll})/u, (m, pre, ch) => pre + ch.toUpperCase());
  }).join(' ');
}

export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

export const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));

export const fmtMinutes = m => {
  if (!m) return '';
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
};

export async function loadCatalogue(){
  const [s, c] = await Promise.all([
    fetch('data/stories.json').then(r => { if (!r.ok) throw new Error('stories ' + r.status); return r.json(); }),
    fetch('data/cities.json').then(r => { if (!r.ok) throw new Error('cities ' + r.status); return r.json(); }),
  ]);
  const stories = Array.isArray(s) ? s : (s.stories || []);
  const anywhere = stories.filter(x => x.type === 'anywhere');
  const byCity = new Map();
  stories.filter(x => x.type !== 'anywhere' && x.city).forEach(x => {
    if (!byCity.has(x.city)) byCity.set(x.city, []);
    byCity.get(x.city).push(x);
  });
  const cities = (c.cities || []).map(ct => {
    const list = byCity.get(ct.city) || [];
    return { ...ct, slug: slugify(ct.city), name: displayCity(ct.city), stories: list, n: list.length };
  }).filter(ct => ct.n > 0).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  return { stories, anywhere, cities };
}

// Small card used by both pages. Rating only when the catalogue has one.
export function storyCard(st, opts = {}){
  const title = titleCase(st.name, st.language);
  const meta = [];
  if (st.minutes) meta.push(`<span>${esc(fmtMinutes(st.minutes))}</span>`);
  if (st.rating != null && st.reviews > 0) meta.push(`<span class="ct-rate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>${st.rating.toFixed(1)}<span class="sr-only"> out of 5 from</span> <span class="ct-rev">(${esc(plural(st.reviews, 'review'))})</span></span>`);
  if (st.ageRating) meta.push(`<span class="ct-age" title="Age rating">${esc(st.ageRating)}</span>`);
  const fr = st.language === 'fr' ? `<span class="ct-lang" lang="fr">En français</span>` : '';
  const cover = st.cover
    ? `<img src="${esc(st.cover)}" alt="" loading="lazy" decoding="async" width="320" height="400">`
    : `<div class="ct-nocover" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z"/></svg></div>`;
  return `<article class="ct-card card" id="${opts.idPrefix || 's'}-${esc(st.id)}" tabindex="-1" data-genre="${esc(st.genre || '')}" ${st.language === 'fr' ? 'lang="fr"' : ''}>
    <div class="ct-cover">${cover}${fr}</div>
    <div class="ct-body">
      <p class="eyebrow" lang="en">${esc(st.genre || 'Story')}</p>
      <h3 class="ct-title">${esc(title)}</h3>
      ${st.summary ? `<p class="ct-sum">${esc(st.summary)}</p>` : ''}
      <p class="ct-meta" lang="en">${meta.join('')}</p>
    </div>
  </article>`;
}
