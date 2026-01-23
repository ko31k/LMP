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
    howto: $("#howto"),
    modal: $("#modal"),
    modalClose: $("#modalClose"),
    backdrop: $("#modal .modal__backdrop"),
    emptyTitle: $("#emptyTitle"),
    emptyHint: $("#emptyHint"),
    steps: $("#steps"),
    modalTitle: $("#modalTitle")
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
        <li>
          В Lampa відкрий: <b>Налаштування → Розширення</b>
          та натисни <b>"Додати плагін"</b>.
        </li>
        <li>Встав скопійоване посилання у поле та підтверди.</li>
      `,
      copy: "Copy",
      copied: "Copied"
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
        <li>
          In Lampa open: <b>Settings → Extensions</b>
          and press <b>"Add plugin"</b>.
        </li>
        <li>Paste the copied link into the field and confirm.</li>
      `,
      copy: "Copy",
      copied: "Copied"
    }
  };

  function t(key) {
    return i18n[state.lang][key];
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
    const text = [(p.title || ""), getDesc(p)].join(" ").toLowerCase();
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

  function render() {
    const q = (state.q || "").trim().toLowerCase();
    const list = state.plugins.filter(p => matches(p, q));

    if (el.countValue) el.countValue.textContent = String(state.plugins.length);
    if (el.grid) el.grid.innerHTML = "";
    if (el.empty) el.empty.classList.toggle("is-hidden", list.length !== 0);

    if (!el.grid) return;

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
      desc.textContent = getDesc(p);

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

  function openModal() {
    if (!el.modal) return;
    el.modal.classList.remove("is-hidden");
  }

  function closeModal() {
    if (!el.modal) return;
    el.modal.classList.add("is-hidden");
  }

  function setLang(lang) {
    state.lang = (lang === "en") ? "en" : "uk";

    $$(".lang__btn").forEach(b => {
      b.classList.toggle("is-active", b.dataset.lang === state.lang);
    });

    if (el.subtitle) el.subtitle.textContent = t("subtitle");
    if (el.q) el.q.placeholder = t("searchPlaceholder");
    if (el.countLabel) el.countLabel.textContent = t("pluginsCount");
    if (el.howto) el.howto.textContent = t("howto");

    if (el.emptyTitle) el.emptyTitle.textContent = t("emptyTitle");
    if (el.emptyHint) el.emptyHint.textContent = t("emptyHint");

    if (el.modalTitle) el.modalTitle.textContent = t("modalTitle");
    if (el.steps) el.steps.innerHTML = t("stepsHtml");

    render();
  }

  function wire() {
    if (el.q) {
      el.q.addEventListener("input", () => {
        state.q = el.q.value;
        if (el.clear) el.clear.classList.toggle("is-hidden", !state.q);
        render();
      });
    }

    if (el.clear) {
      el.clear.addEventListener("click", () => {
        if (el.q) el.q.value = "";
        state.q = "";
        el.clear.classList.add("is-hidden");
        if (el.q) el.q.focus();
        render();
      });
    }

    // Modal open/close
    if (el.howto) el.howto.addEventListener("click", openModal);
    if (el.backdrop) el.backdrop.addEventListener("click", closeModal);
    if (el.modalClose) el.modalClose.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (!el.modal) return;
      if (e.key === "Escape" && !el.modal.classList.contains("is-hidden")) closeModal();
    });

    $$(".lang__btn").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  (async function init() {
    wire();

    // Страховка: модалка завжди закрита при старті
    if (el.modal) el.modal.classList.add("is-hidden");

    await load();
    setLang("uk");
  })().catch((err) => {
    console.error(err);
    if (el.grid) el.grid.innerHTML = "";
    if (el.empty) el.empty.classList.remove("is-hidden");
    if (el.emptyTitle) el.emptyTitle.textContent = "Error";
    if (el.emptyHint) el.emptyHint.textContent = "Failed to load data/plugins.json";
  });
})();
