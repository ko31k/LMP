(async function () {
  const grid = document.getElementById('grid');
  const search = document.getElementById('search');
  const clearBtn = document.getElementById('clear');
  const empty = document.getElementById('empty');
  const statusLine = document.getElementById('statusLine');

  const statTotal = document.getElementById('statTotal');
  const statShown = document.getElementById('statShown');
  const year = document.getElementById('year');

  const btnHow = document.getElementById('btnHow');
  const modal = document.getElementById('modal');

  year.textContent = String(new Date().getFullYear());

  function setStatus(text) {
    if (statusLine) statusLine.textContent = text;
  }

  function normalizeList(data) {
    // підтримка двох форматів:
    // 1) масив плагінів: [...]
    // 2) об'єкт: { plugins: [...] }
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.plugins)) return data.plugins;
    return [];
  }

  function pageUrlFor(filePath) {
    // base = origin + repo path ending with /
    const base = location.origin + location.pathname.replace(/\/[^/]*$/, '/');
    return base + String(filePath || '').replace(/^\//, '');
  }

  function safeText(v) {
    return String(v || '').trim();
  }

  function cardTemplate(p) {
    const name = safeText(p.name) || safeText(p.id) || 'Plugin';
    const desc = safeText(p.desc);
    const id = safeText(p.id);
    const version = safeText(p.version);
    const file = safeText(p.file);

    const url = pageUrlFor(file);

    const badgeVersion = version ? `<span class="badge">v${escapeHtml(version)}</span>` : '';
    const badgeId = id ? `<span class="badge badge--mono">${escapeHtml(id)}</span>` : '';

    return `
      <article class="card">
        <div class="card__inner">
          <div class="card__top">
            <div class="card__title">${escapeHtml(name)}</div>
            <div class="badges">${badgeVersion}${badgeId}</div>
          </div>

          <div class="card__desc">${escapeHtml(desc)}</div>

          <div class="urlbox" title="${escapeHtml(url)}">
            <code>${escapeHtml(url)}</code>
          </div>

          <div class="row">
            <button class="btn btn--ghost small" type="button" data-open="${escapeHtml(url)}">Open</button>
            <button class="btn btn--accent small" type="button" data-copy="${escapeHtml(url)}">Copy</button>
          </div>
        </div>
      </article>
    `;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function render(list) {
    grid.innerHTML = list.map(cardTemplate).join('');

    // Open
    grid.querySelectorAll('[data-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-open');
        window.open(url, '_blank', 'noopener');
      });
    });

    // Copy
    grid.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const url = btn.getAttribute('data-copy');

        const ok = await copyToClipboard(url);
        if (ok) {
          const old = btn.textContent;
          btn.textContent = 'Copied ✓';
          btn.classList.add('copy-ok');
          setTimeout(() => {
            btn.textContent = old;
            btn.classList.remove('copy-ok');
          }, 900);
        } else {
          prompt('Copy URL:', url);
        }
      });
    });
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {}
    return false;
  }

  function applySearch(list, q) {
    const query = String(q || '').trim().toLowerCase();
    if (!query) return list;

    return list.filter((p) => {
      const hay = `${p.name || ''} ${p.id || ''} ${p.desc || ''} ${p.file || ''}`.toLowerCase();
      return hay.includes(query);
    });
  }

  function updateStats(total, shown) {
    if (statTotal) statTotal.textContent = String(total);
    if (statShown) statShown.textContent = String(shown);
  }

  function setEmpty(isEmpty) {
    if (!empty) return;
    empty.classList.toggle('hidden', !isEmpty);
  }

  function openModal() {
    modal.classList.remove('hidden');
  }
  function closeModal() {
    modal.classList.add('hidden');
  }

  // modal close handlers
  if (modal) {
    modal.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-close') === '1') closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });
  }

  if (btnHow) btnHow.addEventListener('click', openModal);

  // Load JSON
  setStatus('Завантаження списку…');

  let plugins = [];
  try {
    const res = await fetch('./data/plugins.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    plugins = normalizeList(data);
  } catch (e) {
    setStatus('Помилка завантаження plugins.json');
    grid.innerHTML = `
      <div class="empty">
        <div class="empty__title">Не вдалося завантажити список</div>
        <div class="empty__text">Перевір, що файл <span class="mono">/data/plugins.json</span> існує і валідний JSON.</div>
      </div>
    `;
    return;
  }

  // Initial render
  updateStats(plugins.length, plugins.length);
  setStatus('Готово');
  render(plugins);
  setEmpty(plugins.length === 0);

  function refresh() {
    const filtered = applySearch(plugins, search?.value);
    updateStats(plugins.length, filtered.length);
    setEmpty(filtered.length === 0);
    render(filtered);
  }

  if (search) search.addEventListener('input', refresh);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!search) return;
      search.value = '';
      search.focus();
      refresh();
    });
  }
})();
