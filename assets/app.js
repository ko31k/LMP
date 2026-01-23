(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    lang: "uk",
    plugins: [],
    q: ""
  };

  const el = {
    q: $("#q"),
    clear: $("#clear"),
    grid: $("#grid"),
    empty: $("#empty"),
    countValue: $("#countValue"),
    countLabel: $("#countLabel"),
    subtitle: $("#subtitle"),

    howtoBtn: $("#howto"),
    howtoModal: $("#howtoModal"),
    howtoClose: $("#howtoClose"),

    detailsModal: $("#detailsModal"),
    detailsClose: $("#detailsClose"),
    detailsTitle: $("#detailsTitle"),
    detailsDesc: $("#detailsDesc"),
    detailsGallery: $("#detailsGallery"),
    detailsUrl: $("#detailsUrl"),
    detailsCopy: $("#detailsCopy"),

    emptyTitle: $("#emptyTitle"),
    emptyHint: $("#emptyHint")
  };

  const i18n = {
    uk: {
      subtitle: "Каталог плагінів для Lampa • швидкий пошук • зручне копіювання",
      searchPlaceholder: "Пошук плагіна за назвою або описом…",
      pluginsCount: "Плагінів",
      howto: "Як встановити",
      emptyTitle: "Нічого не знайдено",
      emptyHint: "Спробуй інший запит.",

      details: "Детальніше",
      url: "URL",
      copy: "Copy",
      copied: "Copied",

      howtoTitle: "Як встановити",
      howtoStepsHtml: `
        <li>Скопіюй URL потрібного плагіна.</li>
        <li>В Lampa відкрий: <b>Налаштування → Розширення</b> та натисни <b>"Додати плагін"</b>.</li>
        <li>Встав скопійоване посилання у поле та підтверди.</li>
      `
    },
    en: {
      subtitle: "Lampa plugins catalog • quick search • easy copy",
      searchPlaceholder: "Search plugin by name or description…",
      pluginsCount: "Plugins",
      howto: "How to install",
      emptyTitle: "Nothing found",
      emptyHint: "Try another query.",

      details: "Details",
      url: "URL",
      copy: "Copy",
      copied: "Copied",

      howtoTitle: "How to install",
      howtoStepsHtml: `
        <li>Copy the plugin URL.</li>
        <li>In Lampa open: <b>Settings → Extensions</b> and press <b>"Add plugin"</b>.</li>
        <li>Paste the copied link into the field and confirm.</li>
      `
    }
  };

  function t(key) {
    return i18n[state.lang][key];
  }

  function getShort(p) {
    return state.lang === "en"
      ? (p.short_en || p.short_uk || "")
      : (p.short_uk || p.short_en || "");
  }

  function getDesc(p) {
    return state.lang === "en"
      ? (p.desc_en || p.desc_uk || "")
      : (p.desc_uk || p.desc_en || "");
  }

  function absUrl(file) {
    return new URL(file, window.location.href).href;
  }

  async function load() {
    const url = `data/plugins.json?v=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load plugins.json");
    const json = await res.json();
    state.plugins = Array.isArray(json.plugins) ? json.plugins : [];
  }

  function matches(p, q) {
    if (!q) return true;
    const text = [(p.title || ""), getShort(p), getDesc(p)].join(" ").toLowerCase();
    return text.includes(q);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {}

    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  // ===== Modal manager (2 modals) =====
  let activeModal = null;

  function lockScroll(lock) {
    document.body.classList.toggle("is-modal-open", !!lock);
  }

  function openModal(modalEl) {
    if (!modalEl) return;
    activeModal = modalEl;
    modalEl.classList.remove("is-hidden");
    lockScroll(true);
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("is-hidden");
    if (activeModal === modalEl) activeModal = null;

    // якщо жодна модалка не відкрита — повертаємо скрол
    const anyOpen = !el.howtoModal.classList.contains("is-hidden") || !el.detailsModal.classList.contains("is-hidden");
    if (!anyOpen) lockScroll(false);
  }

  function closeActiveModal() {
    if (!activeModal) return;
    closeModal(activeModal);
  }

  function wireModal(modalEl, closeBtn) {
    if (!modalEl) return;

    const backdrop = $(".modal__backdrop", modalEl);
    if (backdrop) backdrop.addEventListener("click", () => closeModal(modalEl));
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modalEl));
  }

  // ===== UI render =====
  function render() {
    const q = (state.q || "").trim().toLowerCase();
    const list = state.plugins.filter(p => matches(p, q));

    el.countValue.textContent = String(state.plugins.length);
    el.grid.innerHTML = "";
    el.empty.classList.toggle("is-hidden", list.length !== 0);

    for (const p of list) {
      const url = absUrl(p.file);

      const card = document.createElement("article");
      card.className = "card";

      const top = document.createElement("div");
      top.className = "card__top";

      const title = document.createElement("div");
      title.className = "card__title";
      title.textContent = p.title || p.id || "Plugin";

      const detailsBtn = document.createElement("button");
      detailsBtn.className = "details";
      detailsBtn.type = "button";
      detailsBtn.textContent = t("details");
      detailsBtn.addEventListener("click", () => openDetails(p));

      top.appendChild(title);
      top.appendChild(detailsBtn);

      const desc = document.createElement("div");
      desc.className = "card__desc";
      desc.textContent = getShort(p);

      const row = document.createElement("div");
      row.className = "card__urlrow";

      const urlBox = document.createElement("div");
      urlBox.className = "url";
      urlBox.title = url;
      urlBox.textContent = url;

      const btn = document.createElement("button");
      btn.className = "copy";
      btn.type = "button";
      btn.textContent = t("copy");

      btn.addEventListener("click", async () => {
        const ok = await copyText(url);
        if (!ok) return;
        btn.classList.add("is-done");
        btn.textContent = t("copied");
        window.setTimeout(() => {
          btn.classList.remove("is-done");
          btn.textContent = t("copy");
        }, 900);
      });

      row.appendChild(urlBox);
      row.appendChild(btn);

      card.appendChild(top);
      card.appendChild(desc);
      card.appendChild(row);

      el.grid.appendChild(card);
    }
  }

  // ===== Details modal =====
  async function setCopyBtn(btn, text) {
    const ok = await copyText(text);
    if (!ok) return;
    btn.classList.add("is-done");
    btn.textContent = t("copied");
    window.setTimeout(() => {
      btn.classList.remove("is-done");
      btn.textContent = t("copy");
    }, 900);
  }

  function openDetails(plugin) {
    const url = absUrl(plugin.file);

    el.detailsTitle.textContent = plugin.title || plugin.id || "Plugin";
    el.detailsDesc.textContent = getDesc(plugin);

    el.detailsUrl.textContent = url;
    el.detailsUrl.title = url;

    // Copy button for details modal
    el.detailsCopy.textContent = t("copy");
    el.detailsCopy.onclick = () => setCopyBtn(el.detailsCopy, url);

    // Gallery
    el.detailsGallery.innerHTML = "";
    const screens = Array.isArray(plugin.screens) ? plugin.screens : [];
    for (const src of screens) {
      const img = document.createElement("img");
      img.className = "shot";
      img.loading = "lazy";
      img.alt = plugin.title || plugin.id || "screenshot";
      img.src = src;
      el.detailsGallery.appendChild(img);
    }
    el.detailsGallery.classList.toggle("is-hidden", screens.length === 0);

    openModal(el.detailsModal);
  }

  // ===== Language =====
  function setLang(lang) {
    state.lang = (lang === "en") ? "en" : "uk";

    $$(".lang__btn").forEach(b => {
      b.classList.toggle("is-active", b.dataset.lang === state.lang);
    });

    el.subtitle.textContent = t("subtitle");
    el.q.placeholder = t("searchPlaceholder");
    el.countLabel.textContent = t("pluginsCount");
    el.howtoBtn.textContent = t("howto");

    el.emptyTitle.textContent = t("emptyTitle");
    el.emptyHint.textContent = t("emptyHint");

    // Howto modal text
    $("#howtoTitle").textContent = t("howtoTitle");
    $("#howtoSteps").innerHTML = t("howtoStepsHtml");

    render();
  }

  function wire() {
    // Search
    el.q.addEventListener("input", () => {
      state.q = el.q.value;
      el.clear.classList.toggle("is-hidden", !state.q);
      render();
    });

    el.clear.addEventListener("click", () => {
      el.q.value = "";
      state.q = "";
      el.clear.classList.add("is-hidden");
      el.q.focus();
      render();
    });

    // Howto open
    el.howtoBtn.addEventListener("click", () => openModal(el.howtoModal));

    // Modals close wiring
    wireModal(el.howtoModal, el.howtoClose);
    wireModal(el.detailsModal, el.detailsClose);

    // Esc closes active modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeActiveModal();
    });

    // Lang switch
    $$(".lang__btn").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  (async function init() {
    // гарантія: обидві модалки закриті на старті
    el.howtoModal.classList.add("is-hidden");
    el.detailsModal.classList.add("is-hidden");
    lockScroll(false);

    wire();
    await load();
    setLang("uk");
  })().catch((err) => {
    console.error(err);
    el.grid.innerHTML = "";
    el.empty.classList.remove("is-hidden");
    el.emptyTitle.textContent = "Error";
    el.emptyHint.textContent = "Failed to load data/plugins.json";
  });
})();
