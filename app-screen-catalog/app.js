/** App screen catalog — APP-SCREEN-CATALOG-v1 */

async function loadManifest() {
  const res = await fetch(`manifest.json?v=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('manifest missing');
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

function formatStamp(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
  } catch {
    return iso;
  }
}

function downloadUrl(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function renderCard(entry) {
  const card = document.createElement('article');
  card.className = 'card';
  const fileName = entry.file.split('/').pop();
  card.innerHTML = `
    <div class="phone">
      <img src="${entry.file}?t=${encodeURIComponent(entry.capturedAt)}" alt="${entry.label}" loading="lazy" decoding="async">
    </div>
    <div class="card-body">
      <h2>${entry.label}</h2>
      <p class="stamp">Captured ${formatStamp(entry.capturedAt)}<br>Build ${entry.build || '—'}</p>
      <div class="card-actions">
        <button type="button" class="btn-ghost" data-dl="${entry.file}" data-name="${fileName}">Download PNG</button>
      </div>
    </div>
  `;
  card.querySelector('[data-dl]').addEventListener('click', (ev) => {
    const btn = ev.currentTarget;
    downloadUrl(btn.getAttribute('data-dl'), btn.getAttribute('data-name'));
  });
  return card;
}

async function downloadAll(entries) {
  for (const entry of entries) {
    const name = entry.file.split('/').pop();
    downloadUrl(entry.file, name);
    await new Promise((r) => setTimeout(r, 280));
  }
}

async function main() {
  const grid = document.getElementById('grid');
  const meta = document.getElementById('buildMeta');
  const allBtn = document.getElementById('downloadAll');
  try {
    const entries = await loadManifest();
    entries.sort((a, b) => String(a.capturedAt).localeCompare(String(b.capturedAt)));
    const builds = [...new Set(entries.map((e) => e.build).filter(Boolean))];
    meta.textContent = `${entries.length} screen types · ${builds.join(' · ') || 'build unknown'}`;
    entries.forEach((e) => grid.appendChild(renderCard(e)));
    allBtn.addEventListener('click', () => downloadAll(entries));
  } catch (err) {
    meta.textContent = 'Could not load shots.';
    console.error(err);
  }
}

main();
