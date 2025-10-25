
/**
 * omdb_final.js
 * Unified, self-contained Lampa plugin module.
 * - Visual style & icon sizes fully mirror Enchanser.
 * - New icons (star, awards, rottenBad, popcorn) from user's GitHub.
 * - MDBList (primary) + OMDB (fallback) dual-source ratings.
 * - RottenTomatoes split: Fresh (>=60, Enchanser icon), Rotten (<=59, GitHub RottenBad.png).
 * - PopcornMeter shown in the same ratings row (not on poster).
 * - Average rating icon from GitHub; number is WHITE (leave coloring to other plugin).
 * - Oscars/Emmy icons & color untouched (use original omdb icons/logic).
 * - Order preserved: Average → Oscars/Emmy → Awards → TMDB → IMDb → Metacritic → RottenTomatoes → PopcornMeter
 * - Monochrome switch: set MONOCHROME_MODE = true for grayscale icons.
 *
 * NOTE:
 *   Field names of MDBList can vary slightly per plan/version.
 *   This code is defensive: it checks multiple common aliases for each rating.
 */

(function () {
  'use strict';

  // ===========================
  // ======= CONFIG AREA =======
  // ===========================
  const OMDB_API_KEY = '12c9249c';
  const MDBLIST_API_KEY = 'm8po461k1zq14sroj2ez5d7um';
  const MONOCHROME_MODE = true; // true => grayscale icons like Enchanser

  // User's GitHub directory for icons (raw links)
  const ICON_BASE = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';
  const ICONS = {
    average: ICON_BASE + 'star.png',       // average (white digits)
    awards: ICON_BASE + 'awards.png',      // other awards
    rottenBad: ICON_BASE + 'RottenBad.png',// RT bad
    popcorn: ICON_BASE + 'popcorn.png'     // PopcornMeter
  };

  // Enchanser-style SVGs (minimal, sized like Enchanser)
  // IMDb / TMDB / Metacritic / RT Fresh compact monochrome-friendly icons
  // (If you have Enchanser's exact inline SVGs handy in your build, you can replace these)
  const SVG = {
    imdb: '<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><rect rx="4" ry="4" x="1" y="1" width="62" height="30" fill="currentColor"/><text x="12" y="22" font-size="16" fill="#000" font-family="Arial,Helvetica,sans-serif" font-weight="700">IMDb</text></svg>',
    tmdb: '<svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="34" height="34" rx="6" ry="6" stroke="currentColor" fill="none" stroke-width="3"/><text x="8" y="25" font-size="11" fill="currentColor" font-family="Arial,Helvetica,sans-serif" font-weight="700">TMDB</text></svg>',
    metacritic: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" stroke="currentColor" fill="none" stroke-width="3"/><path d="M9 20 L23 12" stroke="currentColor" stroke-width="3" /></svg>',
    rtFresh: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="currentColor"/><path d="M11 16 l3 3 l7 -7" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
    // Oscars / Emmy placeholders (use original omdb icons/colors where applicable)
    oscar: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2 l3 6 6 1 -4 4 1 6 -6-3 -6 3 1-6 -4-4 6-1z" fill="#FFD54F"/></svg>',
    emmy:  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="3" fill="#FFD54F"/><rect x="11" y="10" width="2" height="10" fill="#FFD54F"/></svg>'
  };

  // ===========================
  // ======= STYLE (CSS) =======
  // ===========================
  const STYLE = `
  /* Enchanser-like compact rating row */
  .omdbx-ratings {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .omdbx-cap {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    border-radius: 9999px;
    background: rgba(255,255,255,0.15);
    line-height: 1;
    height: 26px;
  }
  .omdbx-icon {
    width: 22px;
    height: 22px;
    display: inline-block;
    flex: 0 0 22px;
  }
  .omdbx-icon img, .omdbx-icon svg {
    width: 22px;
    height: 22px;
    display: block;
  }
  .omdbx-text {
    font-size: 14px;
    font-weight: 600;
    color: #fff; /* white numbers (other plugin can recolor) */
  }
  /* Original omdb award numbers can keep their color by adding extra class */
  .omdbx-text--gold { color: #ffd54f; }
  .omdbx-text--yellow { color: #f8c640; }

  /* Monochrome switch */
  .omdbx-monochrome .omdbx-icon img,
  .omdbx-monochrome .omdbx-icon svg {
    filter: grayscale(100%);
  }
  `;

  function injectStyleOnce() {
    if (document.getElementById('omdbx-style')) return;
    const st = document.createElement('style');
    st.id = 'omdbx-style';
    st.textContent = STYLE;
    document.head.appendChild(st);
  }

  // ===============================
  // ====== UTILS & NORMALIZE ======
  // ===============================
  function safe(num) {
    return typeof num === 'number' && isFinite(num) ? num : null;
  }
  function numOrNull(v) {
    if (v == null) return null;
    if (typeof v === 'number') return isFinite(v) ? v : null;
    if (typeof v === 'string') {
      const s = v.trim();
      if (!s) return null;
      const n = Number(s.replace(',', '.'));
      return isNaN(n) ? null : n;
    }
    return null;
  }
  // Normalize ratings to 0..10 for average calculation
  const normalize = {
    imdb: v => v,               // already 0..10
    tmdb: v => v,               // we will pass 0..10 (not 0..100)
    metacritic: v => v/10,      // MC integer 0..100 -> 0..10
    rotten: v => v/10,          // RT integer 0..100 -> 0..10
    popcorn: v => v/10          // treat PopcornMeter 0..100 as 0..10 for averaging
  };

  function average10(values) {
    const arr = values.map(numOrNull).filter(v => v != null);
    if (!arr.length) return null;
    const sum = arr.reduce((a,b)=>a+b,0);
    const avg = sum / arr.length;
    return Math.round(avg * 10) / 10;
  }

  function svgToNode(svgString) {
    const wrap = document.createElement('div');
    wrap.innerHTML = svgString.trim();
    return wrap.firstElementChild;
  }

  function iconNode(srcOrSvg, isSvg = false) {
    const i = document.createElement('span');
    i.className = 'omdbx-icon';
    if (isSvg) {
      i.appendChild(svgToNode(srcOrSvg));
    } else {
      const img = document.createElement('img');
      img.src = srcOrSvg;
      img.loading = 'lazy';
      i.appendChild(img);
    }
    return i;
  }

  function capNode() {
    const c = document.createElement('span');
    c.className = 'omdbx-cap';
    return c;
  }

  function textNode(text, extraClass) {
    const t = document.createElement('span');
    t.className = 'omdbx-text' + (extraClass ? ' ' + extraClass : '');
    t.textContent = text;
    return t;
  }

  function containerNode() {
    const cont = document.createElement('div');
    cont.className = 'omdbx-ratings' + (MONOCHROME_MODE ? ' omdbx-monochrome' : '');
    return cont;
  }

  // ===============================
  // ======== API FETCHERS =========
  // ===============================
  function fetchOMDB(imdbId) {
    return new Promise((resolve) => {
      if (!OMDB_API_KEY || OMDB_API_KEY.indexOf('PASTE_') === 0) return resolve(null);
      $.ajax({
        url: `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbId)}`,
        method: 'GET',
        timeout: 15000
      }).done(res => resolve(res)).fail(()=>resolve(null));
    });
  }

  function fetchMDB(imdbId) {
    return new Promise((resolve) => {
      if (!MDBLIST_API_KEY || MDBLIST_API_KEY.indexOf('PASTE_') === 0) return resolve(null);
      $.ajax({
        url: `https://api.mdblist.com/?apikey=${MDBLIST_API_KEY}&i=${encodeURIComponent(imdbId)}`,
        method: 'GET',
        timeout: 15000
      }).done(res => resolve(res)).fail(()=>resolve(null));
    });
  }

  // Pull rating values from MDBList (defensive against field variants)
  function readFromMDB(mdb) {
    if (!mdb) return {};
    // Try common shapes
    const imdb10 = numOrNull(mdb.imdb?.rating ?? mdb.ratings?.imdb ?? mdb.imdb_rating ?? mdb.imdbrating ?? mdb.imdb);
    const tmdb10 = numOrNull(mdb.tmdb?.rating ?? mdb.ratings?.tmdb ?? mdb.tmdb_rating ?? mdb.tmdb);
    const mc100  = numOrNull(mdb.metacritic?.score ?? mdb.ratings?.metacritic ?? mdb.metacritic_score ?? mdb.metacritic);
    const rt100  = numOrNull(mdb.rottentomatoes?.meter ?? mdb.ratings?.rotten_tomatoes ?? mdb.rt_audience ?? mdb.rotten_tomatoes);
    const pop100 = numOrNull(mdb.popcornmeter ?? mdb.ratings?.popcornmeter ?? mdb.popcorn ?? mdb.audience_score);
    // Some APIs provide 0..100 for TMDB; if >10, assume 0..100
    const tmdbAdj = tmdb10 && tmdb10 > 10 ? Math.round(tmdb10)/10 : tmdb10;
    return {
      imdb10: imdb10 ? Math.round(imdb10*10)/10 : null,
      tmdb10: tmdbAdj ? Math.round(tmdbAdj*10)/10 : null,
      mc100: mc100 ? Math.round(mc100) : null,
      rt100: rt100 ? Math.round(rt100) : null,
      pop100: pop100 ? Math.round(pop100) : null
    };
  }

  // Extract from OMDB
  function readFromOMDB(omdb) {
    if (!omdb) return {};
    // OMDB Ratings array might include: Internet Movie Database (x/10), Rotten Tomatoes (x%), Metacritic (x/100)
    let imdb10 = null, rt100 = null, mc100 = null;
    const arr = Array.isArray(omdb.Ratings) ? omdb.Ratings : [];
    arr.forEach(r => {
      if (!r || !r.Source || !r.Value) return;
      const source = String(r.Source).toLowerCase();
      const val = String(r.Value);
      if (source.includes('internet movie database')) {
        const m = val.match(/([\d.]+)\s*\/\s*10/);
        if (m) imdb10 = numOrNull(m[1]);
      } else if (source.includes('rotten')) {
        const m = val.match(/(\d{1,3})\s*%/);
        if (m) rt100 = numOrNull(m[1]);
      } else if (source.includes('metacritic')) {
        const m = val.match(/(\d{1,3})\s*\/\s*100/);
        if (m) mc100 = numOrNull(m[1]);
      }
    });

    // Awards string: "Won 2 Oscars. Another 106 wins & 93 nominations."
    const awardsStr = omdb.Awards || '';
    const oscars = (()=>{
      const m1 = awardsStr.match(/Won\s+(\d+)\s+Oscar/i);
      const m2 = awardsStr.match(/(\d+)\s+Oscar/i);
      return m1 ? Number(m1[1]) : (m2 ? Number(m2[1]) : 0);
    })();
    const emmys = (()=>{
      const m = awardsStr.match(/(\d+)\s+Emmy/i);
      return m ? Number(m[1]) : 0;
    })();
    const others = (()=>{
      // Try to count "wins" not Oscars/Emmy explicitly
      // This is approximate, but OK for display.
      const m = awardsStr.match(/Another\s+(\d+)\s+wins/i);
      return m ? Number(m[1]) : 0;
    })();

    return {
      imdb10: imdb10 ? Math.round(imdb10*10)/10 : null,
      rt100: rt100 ? Math.round(rt100) : null,
      mc100: mc100 ? Math.round(mc100) : null,
      oscars, emmys, others
    };
  }

  // ===============================
  // ======= RENDER HELPERS ========
  // ===============================
  function addAverage(cont, imdb10, tmdb10, mc100, rt100, pop100) {
    // Compute average over available: imdb10, tmdb10, mc->10, rt->10, pop->10
    const avg = average10([
      imdb10 != null ? normalize.imdb(imdb10) : null,
      tmdb10 != null ? normalize.tmdb(tmdb10) : null,
      mc100 != null ? normalize.metacritic(mc100) : null,
      rt100 != null ? normalize.rotten(rt100) : null,
      pop100 != null ? normalize.popcorn(pop100) : null
    ]);
    if (avg == null) return;
    const cap = capNode();
    cap.appendChild(iconNode(ICONS.average, false));
    cap.appendChild(textNode(String(avg.toFixed(1))));
    cont.appendChild(cap);
  }

  function addOscarsEmmy(cont, oscars, emmys) {
    // Keep "as-is" styling/colors like original omdb (gold-ish text)
    if (oscars && oscars > 0) {
      const cap = capNode();
      cap.appendChild(iconNode(SVG.oscar, true));
      cap.appendChild(textNode(String(oscars), 'omdbx-text--gold'));
      cont.appendChild(cap);
    }
    if (emmys && emmys > 0) {
      const cap = capNode();
      cap.appendChild(iconNode(SVG.emmy, true));
      cap.appendChild(textNode(String(emmys), 'omdbx-text--gold'));
      cont.appendChild(cap);
    }
  }

  function addAwards(cont, others) {
    if (!others || others <= 0) return;
    const cap = capNode();
    cap.appendChild(iconNode(ICONS.awards, false));
    cap.appendChild(textNode(String(others), 'omdbx-text--yellow'));
    cont.appendChild(cap);
  }

  function addTMDB(cont, tmdb10) {
    if (tmdb10 == null) return;
    const cap = capNode();
    cap.appendChild(iconNode(SVG.tmdb, true));
    cap.appendChild(textNode(String(tmdb10.toFixed(1))));
    cont.appendChild(cap);
  }

  function addIMDb(cont, imdb10) {
    if (imdb10 == null) return;
    const cap = capNode();
    cap.appendChild(iconNode(SVG.imdb, true));
    cap.appendChild(textNode(String(imdb10.toFixed(1))));
    cont.appendChild(cap);
  }

  function addMetacritic(cont, mc100) {
    if (mc100 == null) return;
    const cap = capNode();
    cap.appendChild(iconNode(SVG.metacritic, true));
    cap.appendChild(textNode(String(Math.round(mc100))));
    cont.appendChild(cap);
  }

  function addRotten(cont, rt100) {
    if (rt100 == null) return;
    const cap = capNode();
    const isFresh = rt100 >= 60;
    if (isFresh) cap.appendChild(iconNode(SVG.rtFresh, true));
    else cap.appendChild(iconNode(ICONS.rottenBad, false));
    cap.appendChild(textNode(String(Math.round(rt100))));
    cont.appendChild(cap);
  }

  function addPopcorn(cont, pop100) {
    if (pop100 == null) return;
    const cap = capNode();
    cap.appendChild(iconNode(ICONS.popcorn, false));
    cap.appendChild(textNode(String(Math.round(pop100))));
    cont.appendChild(cap);
  }

  // Inject container into Lampa full card header (without touching poster)
  function mountContainer(activityRoot) {
    injectStyleOnce();
    const host = activityRoot && activityRoot.find
      ? activityRoot.find('.full-start-new__details')
      : null;
    if (!host || !host.length) return null;

    let holder = host.find('.omdbx-ratings-host');
    if (!holder.length) {
      holder = $('<div class="omdbx-ratings-host"></div>');
      // Place at the beginning, near other labels (age/4K etc.)
      host.prepend(holder);
    }

    const cont = containerNode();
    holder.empty().append(cont);
    return cont[0] || holder.get(0).firstChild;
  }

  // ===============================
  // ======= MAIN INTEGRATION ======
  // ===============================
  function gatherImdbId(cardData) {
    // Try Lampa data shapes
    const imdbId = cardData?.data?.movie?.imdb_id
                || cardData?.object?.card?.imdb_id
                || cardData?.object?.id_imdb
                || cardData?.data?.imdb_id;
    return imdbId || null;
  }

  function renderRatings(cont, mdb, omdb) {
    const fromMDB = readFromMDB(mdb);
    const fromOMDB = readFromOMDB(omdb);

    // Merge with priority MDBList -> OMDB
    const imdb10 = fromMDB.imdb10 ?? fromOMDB.imdb10 ?? null;
    const tmdb10 = fromMDB.tmdb10 ?? null; // OMDB doesn't have TMDB
    const mc100  = fromMDB.mc100  ?? fromOMDB.mc100  ?? null;
    const rt100  = fromMDB.rt100  ?? fromOMDB.rt100  ?? null;
    const pop100 = fromMDB.pop100 ?? null; // OMDB doesn't have popcorn

    const oscars = fromOMDB.oscars || 0;
    const emmys  = fromOMDB.emmys  || 0;
    const others = fromOMDB.others || 0;

    // Order:
    // Average → Oscars/Emmy → Awards → TMDB → IMDb → Metacritic → RottenTomatoes → PopcornMeter
    addAverage(cont, imdb10, tmdb10, mc100, rt100, pop100);
    addOscarsEmmy(cont, oscars, emmys);
    addAwards(cont, others);
    addTMDB(cont, tmdb10);
    addIMDb(cont, imdb10);
    addMetacritic(cont, mc100);
    addRotten(cont, rt100);
    addPopcorn(cont, pop100);
  }

  function onFullCard(e) {
    if (e.type !== 'complite') return;

    // Only for TMDB source (common for Lampa), do not modify poster
    const activity = e.object && e.object.activity ? e.object.activity.render() : null;
    const contNode = mountContainer(activity);
    if (!contNode) return;

    const imdbId = gatherImdbId(e);
    if (!imdbId) return; // nothing to do

    // parallel fetch MDB & OMDB
    Promise.all([ fetchMDB(imdbId), fetchOMDB(imdbId) ])
      .then(([mdb, omdb]) => {
        renderRatings(contNode, mdb, omdb);
      })
      .catch(() => {});
  }

  function init() {
    injectStyleOnce();
    if (window?.Lampa?.Listener?.follow) {
      Lampa.Listener.follow('full', onFullCard);
    } else {
      // Fallback: try once if Lampa not ready
      document.addEventListener('DOMContentLoaded', () => {
        if (window?.Lampa?.Listener?.follow) {
          Lampa.Listener.follow('full', onFullCard);
        }
      });
    }
  }

  init();
})();
