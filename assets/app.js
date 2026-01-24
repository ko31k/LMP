(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    lang: "uk",
    plugins: [],
    q: "",
    img: {
      pluginId: null,
      list: [],
      index: 0,
      title: ""
    }
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
    donate: $("#donate"),
    emptyTitle: $("#emptyTitle"),
    emptyHint: $("#emptyHint"),

    howtoModal: $("#howtoModal"),
    howtoSteps: $("#howtoSteps"),

    detailsModal: $("#detailsModal"),
    detailsTitle: $("#detailsTitle"),
    detailsDesc: $("#detailsDesc"),
    detailsUrl: $("#detailsUrl"),
    detailsCopy: $("#detailsCopy"),
    detailsGallery: $("#detailsGallery"),

    imgModal: $("#imgModal"),
    imgTitle: $("#imgTitle"),
    imgCount: $("#imgCount"),
    imgOpen: $("#imgOpen"),
    imgView: $("#imgView"),
    imgPrev: $("#imgPrev"),
    imgNext: $("#imgNext")
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
      howtoTitle: "Як встановити",
      howtoStepsHtml: `
        <li>Скопіюй URL потрібного плагіна.</li>
        <li>В Lampa відкрий: <b>Налаштування → Розширення</b> та натисни <b>"Додати плагін"</b>.</li>
        <li>Встав скопійоване посилання у поле та підтверди.</li>
      `,
      copy: "Copy",
      copied: "Copied",
      open: "Відкрити",
      donate: "Добровільний донат на підтримку",
      donateAria: "Добровільний донат на підтримку (відкриється у новій вкладці)"
    },
    en: {
      subtitle: "Lampa plugins catalog • quick search • easy copy",
      searchPlaceholder: "Search plugin by name or description…",
      pluginsCount: "Plugins",
      howto: "How to install",
      details: "Details",
      emptyTitle: "Nothing found",
      emptyHint: "Try another query.",
      howtoTitle: "How to install",
      howtoStepsHtml: `
        <li>Copy the plugin URL.</li>
        <li>In Lampa open: <b>Settings → Extensions</b> and press <b>"Add plugin"</b>.</li>
        <li>Paste the copied link into the field and confirm.</li>
      `,
      copy: "Copy",
      copied: "Copied",
      open: "Open",
      donate: "Voluntary donation to support",
      donateAria: "Voluntary donation to support (opens in a new tab)"
    }
  };

  function t(key) {
    return i18n[state.lang][key];
  }

  function absUrl(file) {
    return new URL(file, window.location.href).href;
  }

  function getShort(p) {
    return state.lang === "en"
      ? (p.short_en || p.short_uk || p.desc_en || p.desc_uk || "")
      : (p.short_uk || p.short_en || p.desc_uk || p.desc_en || "");
  }

  function getFull(p) {
    return state.lang === "en"
      ? (p.desc_en || p.desc_uk || "")
      : (p.desc_uk || p.desc_en || "");
  }

  function matches(p, q) {
    if (!q) return true;
    const text = [(p.title || ""), getShort(p), getFull(p)].join(" ").toLowerCase();
    return text.includes(q);
  }

  async function load() {
    const url = `data/plugins.json?v=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load plugins.json");
    const json = await res.json();
    state.plugins = Array.isArray(json.plugins) ? json.plugins : [];
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

  function setModalOpen(isOpen) {
    document.body.classList.toggle("is-modal-open", !!isOpen);
  }

  function openModal(modalEl) {
    modalEl.classList.remove("is-hidden");
    setModalOpen(true);
  }

  function closeModal(modalEl) {
    modalEl.classList.add("is-hidden");
    const anyOpen = !el.howtoModal.classList.contains("is-hidden")
      || !el.detailsModal.classList.contains("is-hidden")
      || !el.imgModal.classList.contains("is-hidden");
    setModalOpen(anyOpen);
  }

  function closeAllModals() {
    closeModal(el.howtoModal);
    closeModal(el.detailsModal);
    closeModal(el.imgModal);
  }

  function imgUpdate() {
    const list = state.img.list || [];
    const idx = state.img.index || 0;
    if (!list.length) return;

    const src = absUrl(list[idx]);
    el.imgView.src = src;
    el.imgView.alt = state.img.title || "Screenshot";
    el.imgTitle.textContent = state.img.title || "—";
    el.imgCount.textContent = `${idx + 1}/${list.length}`;
    el.imgOpen.textContent = t("open");
    el.imgOpen.href = src;

    el.imgPrev.disabled = list.length <= 1;
    el.imgNext.disabled = list.length <= 1;
    el.imgPrev.classList.toggle("is-disabled", list.length <= 1);
    el.imgNext.classList.toggle("is-disabled", list.length <= 1);
  }

  function imgOpen(pluginTitle, list, index) {
    state.img.title = pluginTitle || "—";
    state.img.list = Array.isArray(list) ? list : [];
    state.img.index = Math.max(0, Math.min(Number(index) || 0, state.img.list.length - 1));
    imgUpdate();
    openModal(el.imgModal);
  }

  function imgStep(delta) {
    const list = state.img.list || [];
    if (list.length <= 1) return;
    const n = list.length;
    state.img.index = (state.img.index + delta + n) % n;
    imgUpdate();
  }

  function detailsOpen(plugin) {
    const url = absUrl(plugin.file);
    const title = plugin.title || plugin.id || "Plugin";

    el.detailsTitle.textContent = title;
    el.detailsDesc.textContent = getFull(plugin);

    el.detailsUrl.textContent = url;
    el.detailsUrl.title = url;

    el.detailsCopy.textContent = t("copy");
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

    const shots = Array.isArray(plugin.screens) ? plugin.screens : [];
    el.detailsGallery.innerHTML = "";
    el.detailsGallery.classList.toggle("is-hidden", shots.length === 0);

    shots.forEach((src, i) => {
      const img = document.createElement("img");
      img.className = "shot";
      img.loading = "lazy";
      img.alt = `${title} (${i + 1})`;
      img.src = absUrl(src);
      img.addEventListener("click", () => imgOpen(title, shots, i));
      el.detailsGallery.appendChild(img);
    });

    openModal(el.detailsModal);
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
      detailsBtn.addEventListener("click", () => detailsOpen(p));

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

  function setLang(lang) {
    state.lang = (lang === "en") ? "en" : "uk";

    $$(".lang__btn").forEach(b => b.classList.toggle("is-active", b.dataset.lang === state.lang));

    el.subtitle.textContent = t("subtitle");
    el.q.placeholder = t("searchPlaceholder");
    el.countLabel.textContent = t("pluginsCount");
    el.howtoBtn.textContent = t("howto");
    el.emptyTitle.textContent = t("emptyTitle");
    el.emptyHint.textContent = t("emptyHint");

    // donate text
    if (el.donate) {
      el.donate.textContent = t("donate");
      el.donate.setAttribute("aria-label", t("donateAria"));
    }

    $("#howtoTitle").textContent = t("howtoTitle");
    el.howtoSteps.innerHTML = t("howtoStepsHtml");

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

    el.howtoBtn.addEventListener("click", () => openModal(el.howtoModal));

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const closeKind = target.getAttribute("data-close");
      if (!closeKind) return;

      if (closeKind === "howto") closeModal(el.howtoModal);
      if (closeKind === "details") closeModal(el.detailsModal);
      if (closeKind === "img") closeModal(el.imgModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!el.imgModal.classList.contains("is-hidden")) return closeModal(el.imgModal);
      if (!el.detailsModal.classList.contains("is-hidden")) return closeModal(el.detailsModal);
      if (!el.howtoModal.classList.contains("is-hidden")) return closeModal(el.howtoModal);
    });

    el.imgPrev.addEventListener("click", () => imgStep(-1));
    el.imgNext.addEventListener("click", () => imgStep(1));

    document.addEventListener("keydown", (e) => {
      if (el.imgModal.classList.contains("is-hidden")) return;
      if (e.key === "ArrowLeft") imgStep(-1);
      if (e.key === "ArrowRight") imgStep(1);
    });

    $$(".lang__btn").forEach(btn => btn.addEventListener("click", () => setLang(btn.dataset.lang)));
  }

  (async function init() {
    wire();
    await load();
    setLang("uk");
    closeAllModals();
  })().catch((err) => {
    console.error(err);
    el.grid.innerHTML = "";
    el.empty.classList.remove("is-hidden");
    el.emptyTitle.textContent = "Error";
    el.emptyHint.textContent = "Failed to load data/plugins.json";
  });
})();
