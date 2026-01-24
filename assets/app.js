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
    steps: $("#steps"),
    modalTitle: $("#modalTitle"),

    detailsModal: $("#detailsModal"),
    detailsTitle: $("#detailsTitle"),
    detailsDesc: $("#detailsDesc"),
    detailsUrl: $("#detailsUrl"),
    detailsCopy: $("#detailsCopy"),
    gallery: $("#gallery"),

    imgModal: $("#imgModal"),
    imgModalImg: $("#imgModalImg"),

    emptyTitle: $("#emptyTitle"),
    emptyHint: $("#emptyHint")
  };

  // Скріни: файл -> масив зображень (відносно кореня сайту)
  const screenshots = {
    "parsers": ["wwwroot/screens/Parsers.png"],
    "quality": ["wwwroot/screens/quality1.png", "wwwroot/screens/quality2.png"],
    "seasons": ["wwwroot/screens/seasons.png"],
    "ua-finder": ["wwwroot/screens/ukr1.png", "wwwroot/screens/ukr2.png"],
    "rtg": ["wwwroot/screens/rtg-film.png", "wwwroot/screens/rtg-serial.png", "wwwroot/screens/rtg1.png", "wwwroot/screens/rtg2.png"],
    "interface": ["wwwroot/screens/interface.png", "wwwroot/screens/interface1.png", "wwwroot/screens/interface2.png", "wwwroot/screens/interface3.png"]
  };

  const i18n = {
    uk: {
      subtitle: "Каталог плагінів для Lampa • швидкий пошук • зручне копіювання",
      searchPlaceholder: "Пошук плагіна за назвою або описом…",
      pluginsCount: "Плагінів",
      howto: "Як встановити",
      details: "Детальніше",
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
      details: "Details",
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

  function getDescShort(p) {
    return state.lang === "en"
      ? (p.desc_short_en || p.desc_short_uk || p.desc_en || p.desc_uk || "")
      : (p.desc_short_uk || p.desc_short_en || p.desc_uk || p.desc_en || "");
  }

  function getDescFull(p) {
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
    const text = [(p.title || ""), getDescShort(p), getDescFull(p)].join(" ").toLowerCase();
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

  function setBodyModal(open) {
    document.body.classList.toggle("is-modal-open", !!open);
  }

  function openModal(which) {
    if (which === "modal") el.modal.classList.remove("is-hidden");
    if (which === "details") el.detailsModal.classList.remove("is-hidden");
    if (which === "img") el.imgModal.classList.remove("is-hidden");
    setBodyModal(true);
  }

  function closeModal(which) {
    if (which === "modal") el.modal.classList.add("is-hidden");
    if (which === "details") el.detailsModal.classList.add("is-hidden");
    if (which === "img") el.imgModal.classList.add("is-hidden");

    // Якщо всі модалки закриті — повернути скрол
    const anyOpen = !el.modal.classList.contains("is-hidden")
      || !el.detailsModal.classList.contains("is-hidden")
      || !el.imgModal.classList.contains("is-hidden");

    setBodyModal(anyOpen);
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

      const detailsBtn = document.createElement("button");
      detailsBtn.className = "details";
      detailsBtn.type = "button";
      detailsBtn.textContent = t("details");

      detailsBtn.addEventListener("click", () => openDetails(p));

      top.appendChild(title);
      top.appendChild(detailsBtn);

      const desc = document.createElement("div");
      desc.className = "card__desc";
      desc.textContent = getDescShort(p);

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

  function openDetails(p) {
    const url = absUrl(p.file);

    el.detailsTitle.textContent = p.title || p.id || "Plugin";
    el.detailsDesc.textContent = getDescFull(p);

    el.detailsUrl.textContent = url;
    el.detailsUrl.title = url;

    el.detailsCopy.textContent = t("copy");
    el.detailsCopy.classList.remove("is-done");
    el.detailsCopy.onclick = async () => {
      const ok = await copyText(url);
      if (!ok) return;
      el.detailsCopy.classList.add("is-done");
      el.detailsCopy.textContent = t("copied");
      window.setTimeout(() => {
        el.detailsCopy.classList.remove("is-done");
        el.detailsCopy.textContent = t("copy");
      }, 900);
    };

    // Gallery
    const shots = screenshots[p.id] || [];
    el.gallery.innerHTML = "";
    el.gallery.classList.toggle("is-hidden", shots.length === 0);

    for (const src of shots) {
      const img = document.createElement("img");
      img.className = "shot";
      img.loading = "lazy";
      img.alt = (p.title || p.id || "Plugin") + " screenshot";
      img.src = src;
      img.addEventListener("click", () => openImage(src, img.alt));
      el.gallery.appendChild(img);
    }

    openModal("details");
  }

  function openImage(src, alt) {
    el.imgModalImg.src = src;
    el.imgModalImg.alt = alt || "";
    openModal("img");
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

    el.modalTitle.textContent = t("modalTitle");
    el.steps.innerHTML = t("stepsHtml");

    el.emptyTitle.textContent = t("emptyTitle");
    el.emptyHint.textContent = t("emptyHint");

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

    el.howto.addEventListener("click", () => openModal("modal"));

    // Делегований клік закриття (працює навіть по SVG/path)
    document.addEventListener("click", (e) => {
      const closer = e.target.closest("[data-close]");
      if (!closer) return;
      const which = closer.getAttribute("data-close");
      if (which === "modal") closeModal("modal");
      if (which === "details") closeModal("details");
      if (which === "img") closeModal("img");
    });

    // ESC
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      if (!el.imgModal.classList.contains("is-hidden")) return closeModal("img");
      if (!el.detailsModal.classList.contains("is-hidden")) return closeModal("details");
      if (!el.modal.classList.contains("is-hidden")) return closeModal("modal");
    });

    $$(".lang__btn").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  (async function init() {
    wire();
    await load();
    setLang("uk"); // нічого не відкриваємо автоматично
  })().catch((err) => {
    console.error(err);
    el.grid.innerHTML = "";
    el.empty.classList.remove("is-hidden");
    el.emptyTitle.textContent = "Error";
    el.emptyHint.textContent = "Failed to load data/plugins.json";
  });
})();
