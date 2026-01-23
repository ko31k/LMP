(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    lang: "uk",
    plugins: [],
    q: "",
    details: null
  };

  const el = {
    q: $("#q"),
    clear: $("#clear"),
    grid: $("#grid"),
    empty: $("#empty"),
    countValue: $("#countValue"),
    countLabel: $("#countLabel"),
    subtitle: $("#subtitle"),
    howto: $("#howto"),

    modal: $("#modal"),
    modalClose: $("#modalClose"),
    backdrop: $("#modal .modal__backdrop"),
    emptyTitle: $("#emptyTitle"),
    emptyHint: $("#emptyHint"),
    steps: $("#steps"),
    modalTitle: $("#modalTitle"),

    detailsModal: $("#detailsModal"),
    detailsClose: $("#detailsClose"),
    detailsBackdrop: $("#detailsModal .modal__backdrop"),
    detailsTitle: $("#detailsTitle"),
    detailsDesc: $("#detailsDesc"),
    detailsShotsTitle: $("#detailsShotsTitle"),
    detailsShots: $("#detailsShots"),
    detailsUrl: $("#detailsUrl"),
    detailsCopy: $("#detailsCopy")
  };

  const i18n = {
    uk: {
      subtitle: "Каталог плагінів для Lampa • швидкий пошук • зручне копіювання",
      searchPlaceholder: "Пошук плагіна за назвою або описом…",
      pluginsCount: "Плагінів",
      howto: "Як встановити",
      emptyTitle: "Нічого не знайдено",
      emptyHint: "Спробуй інший запит.",
      modalTitle: "Як встановити",
      stepsHtml: `
        <li>Скопіюй URL потрібного плагіна.</li>
        <li>В Lampa відкрий: <b>Налаштування → Розширення</b> та натисни <b>"Додати плагін"</b>.</li>
        <li>Встав скопійоване посилання у поле та підтверди.</li>
      `,
      copy: "Copy",
      copied: "Copied",
      more: "Детальніше",
      screenshots: "Скріншоти"
    },
    en: {
      subtitle: "Lampa plugins catalog • quick search • easy copy",
      searchPlaceholder: "Search plugin by name or description…",
      pluginsCount: "Plugins",
      howto: "How to install",
      emptyTitle: "Nothing found",
      emptyHint: "Try another query.",
      modalTitle: "How to install",
      stepsHtml: `
        <li>Copy the plugin URL.</li>
        <li>In Lampa open: <b>Settings → Extensions</b> and press <b>"Add plugin"</b>.</li>
        <li>Paste the copied link into the field and confirm.</li>
      `,
      copy: "Copy",
      copied: "Copied",
      more: "Details",
      screenshots: "Screenshots"
    }
  };

  function t(key) {
    return i18n[state.lang][key];
  }

  function getDescFull(p) {
    return state.lang === "en"
      ? (p.desc_en || p.desc_uk || "")
      : (p.desc_uk || p.desc_en || "");
  }

  function getDescShort(p) {
    const key = state.lang === "en" ? "desc_short_en" : "desc_short_uk";
    const fallback = getDescFull(p);
    return (p[key] || fallback || "");
  }

  function absUrl(file) {
    return new URL(file, window.location.href).href;
  }

  function absAsset(path) {
    return new URL(path, window.location.href).href;
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
    const text = [(p.title || ""), getDescFull(p), getDescShort(p)].join(" ").toLowerCase();
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

  function setCopyButtonState(btn, done) {
    if (!btn) return;
    if (done) {
      btn.classList.add("is-done");
      btn.textContent = t("copied");
      window.setTimeout(() => {
        btn.classList.remove("is-done");
        btn.textContent = t("copy");
      }, 900);
    } else {
      btn.classList.remove("is-done");
      btn.textContent = t("copy");
    }
  }

  function openModal() {
    el.modal.classList.remove("is-hidden");
  }

  function closeModal() {
    el.modal.classList.add("is-hidden");
  }

  function openDetails(p) {
    state.details = p;

    const url = absUrl(p.file);
    el.detailsTitle.textContent = p.title || p.id || "Plugin";
    el.detailsDesc.textContent = getDescFull(p);

    el.detailsUrl.textContent = url;
    el.detailsUrl.title = url;
    setCopyButtonState(el.detailsCopy, false);

    // Screenshots
    const screens = Array.isArray(p.screens) ? p.screens : [];
    el.detailsShots.innerHTML = "";

    if (screens.length) {
      el.detailsShotsTitle.textContent = t("screenshots");
      el.detailsShots.parentElement.classList.remove("is-hidden");

      for (const s of screens) {
        const wrap = document.createElement("div");
        wrap.className = "shot";

        const img = document.createElement("img");
        img.loading = "lazy";
        img.src = absAsset(s.src);
        img.alt = state.lang === "en" ? (s.alt_en || s.alt_uk || "") : (s.alt_uk || s.alt_en || "");
        wrap.appendChild(img);

        el.detailsShots.appendChild(wrap);
      }
    } else {
      el.detailsShotsTitle.textContent = "";
      el.detailsShots.parentElement.classList.add("is-hidden");
    }

    el.detailsModal.classList.remove("is-hidden");
  }

  function closeDetails() {
    el.detailsModal.classList.add("is-hidden");
    state.details = null;
  }

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
      top.appendChild(title);

      const desc = document.createElement("div");
      desc.className = "card__desc";
      desc.textContent = getDescShort(p);

      const actions = document.createElement("div");
      actions.className = "card__actions";

      const row = document.createElement("div");
      row.className = "card__urlrow";

      const urlBox = document.createElement("div");
      urlBox.className = "url";
      urlBox.title = url;
      urlBox.textContent = url;

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy";
      copyBtn.type = "button";
      copyBtn.textContent = t("copy");
      copyBtn.addEventListener("click", async () => {
        const ok = await copyText(url);
        if (!ok) return;
        setCopyButtonState(copyBtn, true);
      });

      row.appendChild(urlBox);
      row.appendChild(copyBtn);

      const moreBtn = document.createElement("button");
      moreBtn.className = "more";
      moreBtn.type = "button";
      moreBtn.textContent = t("more");
      moreBtn.addEventListener("click", () => openDetails(p));

      actions.appendChild(row);
      actions.appendChild(moreBtn);

      card.appendChild(top);
      card.appendChild(desc);
      card.appendChild(actions);

      el.grid.appendChild(card);
    }
  }

  function setLang(lang) {
    state.lang = (lang === "en") ? "en" : "uk";

    $$(".lang__btn").forEach(b => {
      b.classList.toggle("is-active", b.dataset.lang === state.lang);
    });

    el.subtitle.textContent = t("subtitle");
    el.q.placeholder = t("searchPlaceholder");
    el.countLabel.textContent = t("pluginsCount");
    el.howto.textContent = t("howto");

    el.emptyTitle.textContent = t("emptyTitle");
    el.emptyHint.textContent = t("emptyHint");

    el.modalTitle.textContent = t("modalTitle");
    el.steps.innerHTML = t("stepsHtml");

    // If details modal open — refresh text content in it
    if (state.details) openDetails(state.details);

    render();
  }

  function wire() {
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

    // How-to modal open/close
    el.howto.addEventListener("click", openModal);
    el.backdrop.addEventListener("click", closeModal);
    el.modalClose.addEventListener("click", closeModal);

    // Details modal open/close
    el.detailsBackdrop.addEventListener("click", closeDetails);
    el.detailsClose.addEventListener("click", closeDetails);

    el.detailsCopy.addEventListener("click", async () => {
      if (!state.details) return;
      const url = absUrl(state.details.file);
      const ok = await copyText(url);
      if (!ok) return;
      setCopyButtonState(el.detailsCopy, true);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!el.detailsModal.classList.contains("is-hidden")) closeDetails();
        else if (!el.modal.classList.contains("is-hidden")) closeModal();
      }
    });

    $$(".lang__btn").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  (async function init() {
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
