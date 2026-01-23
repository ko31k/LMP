(async function () {
  const grid = document.getElementById('grid');
  const q = document.getElementById('q');
  const tagsWrap = document.getElementById('tags');
  const langBtns = document.querySelectorAll('.lang');

  const repoBase = location.origin + location.pathname.replace(/\/$/, '');
  let lang = 'uk';
  let activeTag = 'ALL';
  let all = [];

  function pluginUrl(file) {
    return repoBase + '/' + file;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  function renderTags(items) {
    const set = new Set(['ALL']);
    items.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    const arr = Array.from(set);

    tagsWrap.innerHTML = arr.map(t => `
      <div class="tag ${t===activeTag?'active':''}" data-tag="${escapeHtml(t)}">
        ${escapeHtml(t === 'ALL' ? (lang === 'uk' ? 'ВСЕ' : 'ALL') : t)}
      </div>
    `).join('');

    tagsWrap.querySelectorAll('.tag').forEach(el => {
      el.addEventListener('click', () => {
        activeTag = el.dataset.tag;
        render();
      });
    });
  }

  function matches(p) {
    const text = (q.value || '').trim().toLowerCase();
    const title = (p.title || '').toLowerCase();
    const desc = (lang === 'uk' ? p.desc_uk : p.desc_en || p.desc_uk || '').toLowerCase();
    const tagOk = activeTag === 'ALL' || (p.tags || []).includes(activeTag);
    const textOk = !text || title.includes(text) || desc.includes(text);
    return tagOk && textOk;
  }

  function card(p) {
    const desc = lang === 'uk' ? p.desc_uk : (p.desc_en || p.desc_uk);
    const url = pluginUrl(p.file);

    return `
      <article class="card">
        <h3 class="card__title">${escapeHtml(p.title)}</h3>
        <p class="card__desc">${escapeHtml(desc || '')}</p>

        <div class="card__row">
          <button class="btn primary" data-dl="${escapeHtml(url)}">Завантажити</button>
          <button class="btn ghost" data-copy="${escapeHtml(url)}">URL-link</button>
        </div>

        <div class="code">${escapeHtml(url)}</div>
      </article>
    `;
  }

  function render() {
    const filtered = all.filter(matches);
    grid.innerHTML = filtered.map(card).join('');

    grid.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const url = btn.getAttribute('data-copy');
        try {
          await navigator.clipboard.writeText(url);
          btn.textContent = 'Скопійовано';
          setTimeout(() => (btn.textContent = 'URL-link'), 900);
        } catch {
          prompt('Скопіюй URL:', url);
        }
      });
    });

    grid.querySelectorAll('[data-dl]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-dl');
        window.open(url, '_blank');
      });
    });
  }

  langBtns.forEach(b => {
    b.addEventListener('click', () => {
      langBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      lang = b.dataset.lang;
      renderTags(all);
      render();
    });
  });

  q.addEventListener('input', () => render());

  const res = await fetch('data/plugins.json', { cache: 'no-store' });
  const json = await res.json();
  all = (json.plugins || []);
  renderTags(all);
  render();
})();
