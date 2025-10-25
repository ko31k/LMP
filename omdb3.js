(function () {
  'use strict';

  /** -----------------------------------------
   * CONFIG (ключі — нулі, вставиш свої)
   * ----------------------------------------- */
  const CONFIG = {
    MDBLIST_KEY: 'm8po461k1zq14sroj2ez5d7um', // ← свій MDBList API key
    OMDB_KEY:    '12c9249c',                 // ← свій OMDB API key
    CACHE_TTL:   3 * 24 * 60 * 60 * 1000,    // 3 дні
    STORAGE_KEYS: {
      OMDB: 'omdbx_cache_omdb',
      MAP:  'omdbx_cache_map'
    },
    ICONS_REMOTE: 'https://www.streamingdiscovery.com/logo/',
    ICONS_LOCAL_BASE: (function(){
      const base = window.location.origin;
      return base + '/wwwroot/';
    })()
  };

  /** -----------------------------------------
   * SETTINGS (тільки тригер для grayscale)
   *  - omdbx_bw : trigger true/false
   * ----------------------------------------- */
  function initSettings(){
    Lampa.SettingsApi.addComponent({
      component: 'omdbx_full',
      name: 'OMDB+MDBList Ratings',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M7 5h10v2H7zM4 9h16v2H4zM7 13h10v2H7zM4 17h16v2H4z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
      component: 'omdbx_full',
      param: { name: 'omdbx_bw', type: 'trigger', default: false },
      field: { name: 'Ч/Б іконки (grayscale)', description: 'Перемикає іконки у чорно-білий варіант' },
      onChange: () => Lampa.Settings.update()
    });
  }

  /** -----------------------------------------
   * ICONS
   * ----------------------------------------- */
  const ICON = {
    imdb:       CONFIG.ICONS_REMOTE + 'imdb.png',
    tmdb:       CONFIG.ICONS_REMOTE + 'tmdb.png',
    metacritic: CONFIG.ICONS_REMOTE + 'metacritic.png',
    rt_good:    CONFIG.ICONS_REMOTE + 'rotten-tomatoes.png',

    // локальні з /wwwroot/
    star:       CONFIG.ICONS_LOCAL_BASE + 'star.png',
    oscar:      CONFIG.ICONS_LOCAL_BASE + 'oscar.png',
    emmy:       CONFIG.ICONS_LOCAL_BASE + 'emmy.png',
    awards:     CONFIG.ICONS_LOCAL_BASE + 'awards.png',
    rt_bad:     CONFIG.ICONS_LOCAL_BASE + 'RottenBad.png',
    popcorn:    CONFIG.ICONS_LOCAL_BASE + 'popcorn.png'
  };

  /** -----------------------------------------
   * CONSTANTS
   * ----------------------------------------- */
  const WEIGHTS = { imdb: 0.40, tmdb: 0.40, mc: 0.10, rt: 0.10 };
  const AGE_RATINGS = {
    'G': '3+','PG': '6+','PG-13': '13+','R': '17+','NC-17': '18+',
    'TV-Y': '0+','TV-Y7': '7+','TV-G': '3+','TV-PG': '6+','TV-14': '14+','TV-MA': '17+'
  };
  const ORDER = [
    'avg',        // штучна позиція
    'oscars_or_emmy',
    'awards_other',
    'tmdb',
    'imdb',
    'mc',
    'rt',
    'popcorn'
  ];

  /** -----------------------------------------
   * STYLES (з твоєї верстки + додав класи для кольору avg)
   * ----------------------------------------- */
  (function injectStyles(){
    const css = `
      .full-start__rate{
        display:inline-flex;align-items:center;gap:10px;padding:10px 16px;border-radius:12px;
        font-size:18px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,0.3);z-index:10;position:relative;
        background:rgba(0,0,0,0.85)!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
        box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid rgba(255,255,255,0.3);
      }
      .full-start__rate .source--name.rate--icon img,
      .full-start__rate .source--name.rate--icon svg {
        height:14px;width:auto;display:inline-block;vertical-align:middle;object-fit:contain;transform:scale(1.2);
      }
      .full-start__rate span{ text-shadow:0 1px 3px rgba(0,0,0,0.8); font-size:18px; }
      .full-start-new__rate-line{ display:flex;flex-wrap:wrap;gap:8px;align-items:center; }

      .rate--avg.rating--green  { color: #4caf50; }
      .rate--avg.rating--lime   { color: #3399ff; }
      .rate--avg.rating--orange { color: #ff9933; }
      .rate--avg.rating--red    { color: #f44336; }

      /* простенький "loader" */
      .loading-dots-container { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:10; }
      .loading-dots { display:inline-flex; gap:8px; color:#fff; background:rgba(0,0,0,0.3); padding:6px 12px; border-radius:8px; }
    `;
    if (!document.getElementById('omdbx_full_css')) {
      $('<style id="omdbx_full_css">').text(css).appendTo('head');
    }
  })();

  /** -----------------------------------------
   * HELPERS
   * ----------------------------------------- */
  function bw() { return Lampa.Storage.get('omdbx_bw') ? 'grayscale(100%)' : 'none'; }

  function getType(card){
    const t = card.method || card.type || card.media_type;
    if (t === 'movie' || t === 'tv') return t;
    return card.number_of_seasons ? 'tv' : 'movie';
  }

  function getImdbIdFromCard(e){
    return (e.object.movie && (e.object.movie.imdb_id || e.object.movie.imdb)) || e.object.imdb_id || null;
  }

  function ratingClass(v){
    if (v >= 8.0) return 'rating--green';
    if (v >= 6.0) return 'rating--lime';
    if (v >= 5.5) return 'rating--orange';
    return 'rating--red';
  }

  function parseAwards(awardsText){
    if (typeof awardsText !== 'string') return {oscars:0, emmy:0, awards:0};
    const r = {oscars:0, emmy:0, awards:0};
    const o = awardsText.match(/Won\s+(\d+)\s+Oscars?/i);
    const e = awardsText.match(/Won\s+(\d+)\s+Primetime\s+Emmys?/i);
    const a = awardsText.match(/Another\s+(\d+)\s+wins?/i);
    if (o && o[1]) r.oscars = parseInt(o[1], 10);
    if (e && e[1]) r.emmy   = parseInt(e[1], 10);
    if (a && a[1]) r.awards = parseInt(a[1], 10);
    if (r.awards === 0) {
      const simple = awardsText.match(/(\d+)\s+wins?/i);
      if (simple && simple[1]) r.awards = parseInt(simple[1], 10);
    }
    return r;
  }

  function nodeRate(className, valueText, iconURL, title){
    const el = $(`
      <div class="full-start__rate ${className}">
        <div>${valueText}</div>
        <div class="source--name rate--icon"${title?` title="${title}"`:''}></div>
      </div>
    `);
    el.find('.source--name').html(`<img src="${iconURL}" style="filter:${bw()}" alt="${className}">`);
    return el;
  }

  /** -----------------------------------------
   * CACHE (Storage)
   * ----------------------------------------- */
  function getCache(bucket){
    return Lampa.Storage.get(bucket) || {};
  }
  function setCache(bucket, obj){
    Lampa.Storage.set(bucket, obj);
  }
  function readWithTTL(bucket, key){
    const cache = getCache(bucket);
    const item = cache[key];
    if (!item) return null;
    if (Date.now() - (item.ts || 0) > CONFIG.CACHE_TTL) return null;
    return item.data;
  }
  function writeWithTTL(bucket, key, data){
    const cache = getCache(bucket);
    cache[key] = { ts: Date.now(), data };
    setCache(bucket, cache);
  }

  /** -----------------------------------------
   * FETCHERS
   * ----------------------------------------- */
  function fetchMDBList(e){
    const type = getType(e.object) === 'tv' ? 'show' : 'movie';
    const id   = e.object.id;
    if (!CONFIG.MDBLIST_KEY) return Promise.resolve(null);

    return $.ajax({
      url: `https://api.mdblist.com/tmdb/${type}/${id}?apikey=${CONFIG.MDBLIST_KEY}`,
      method: 'GET', timeout: 7000
    }).then(res => res).catch(()=>null);
  }

  function fetchOMDBByImdb(imdb_id, type){
    if (!CONFIG.OMDB_KEY || !imdb_id) return Promise.resolve(null);
    const t = (type === 'tv') ? '&type=series' : '';
    const key = `${type}_${imdb_id}`;
    const cached = readWithTTL(CONFIG.STORAGE_KEYS.OMDB, key);
    if (cached) return Promise.resolve(cached);

    return $.ajax({
      url: `https://www.omdbapi.com/?apikey=${CONFIG.OMDB_KEY}&i=${imdb_id}${t}`,
      method: 'GET', timeout: 7000
    }).then(res => {
      if (res && res.Response === 'True') {
        writeWithTTL(CONFIG.STORAGE_KEYS.OMDB, key, res);
        return res;
      }
      return null;
    }).catch(()=>null);
  }

  // Якщо imdb_id немає — дістаємо через TMDB external_ids, кешуємо
  function fetchImdbIdViaTmdb(e){
    const type = getType(e.object) === 'tv' ? 'tv' : 'movie';
    const tmdbId = e.object.id;
    const mapKey = `${type}_${tmdbId}`;
    const cached = readWithTTL(CONFIG.STORAGE_KEYS.MAP, mapKey);
    if (cached) return Promise.resolve(cached);

    const url = `https://api.themoviedb.org/3/${type}/${tmdbId}/external_ids?api_key=${Lampa.TMDB.key()}`;
    const req = (u, ok, fail) => {
      new Lampa.Reguest().silent(u, ok, function(){
        new Lampa.Reguest().native(u, function(data){
          try { ok(typeof data === 'string' ? JSON.parse(data) : data); }
          catch(e){ fail(); }
        }, fail, false, { dataType: 'json' });
      });
    };

    return new Promise((resolve) => {
      req(url, data => {
        const imdb = data && data.imdb_id || null;
        if (imdb) writeWithTTL(CONFIG.STORAGE_KEYS.MAP, mapKey, imdb);
        resolve(imdb);
      }, () => resolve(null));
    });
  }

  /** -----------------------------------------
   * BUILD RATINGS (MDBList → OMDB fallback)
   *  - imdb, tmdb: 0..10
   *  - mc, rt, popcorn: 0..100 (% для відображення)
   * ----------------------------------------- */
  function buildRatings(mdb, omdb){
    const R = { imdb:null, tmdb:null, mc:null, rt:null, popcorn:null };

    // MDBList — основне джерело (логіка як у Enchanser)
    if (mdb && Array.isArray(mdb.ratings)) {
      mdb.ratings.forEach(r=>{
        if (!r || !r.source) return;
        const src = r.source.toLowerCase();
        const val = r.value;
        if (!(val>0)) return;

        if (src === 'imdb')       R.imdb = val > 10 ? val/10 : val;
        if (src === 'tmdb')       R.tmdb = val > 10 ? val/10 : val;
        if (src === 'metacritic') R.mc   = val > 100 ? 100 : val;
        if (src === 'tomatoes')   R.rt   = val > 100 ? 100 : val;
        if (src === 'popcorn')    R.popcorn = val > 100 ? 100 : val;
      });
    }
    // додаткові поля MDBList
    if (mdb && typeof mdb.score === 'number' && R.tmdb == null) {
      R.tmdb = mdb.score; // 0..10
    }
    if (mdb && typeof mdb.popcorn === 'number' && R.popcorn == null) {
      R.popcorn = mdb.popcorn > 1 ? mdb.popcorn : Math.round(mdb.popcorn*100);
    }

    // OMDB — fallback
    if (omdb) {
      if ((R.imdb == null || R.imdb <= 0) && omdb.imdbRating) {
        const v = parseFloat(omdb.imdbRating);
        if (!isNaN(v)) R.imdb = v;
      }
      if (Array.isArray(omdb.Ratings)) {
        omdb.Ratings.forEach(item=>{
          if (!item || !item.Source || !item.Value) return;
          const s = item.Source.toLowerCase();
          if ((R.rt == null || R.rt <= 0) && s.includes('rotten')) {
            const p = parseInt(String(item.Value).replace('%','').trim(), 10);
            if (!isNaN(p)) R.rt = p;
          }
          if ((R.mc == null || R.mc <= 0) && s.includes('metacritic')) {
            const p = parseInt(String(item.Value).split('/')[0], 10);
            if (!isNaN(p)) R.mc = p;
          }
          if ((R.imdb == null || R.imdb <= 0) && s.includes('internet movie database')) {
            const p = parseFloat(String(item.Value).split('/')[0]);
            if (!isNaN(p)) R.imdb = p;
          }
        });
      }
    }

    return R;
  }

  function average10(R){
    const parts = [];
    if (R.imdb) parts.push({v:R.imdb,   w:WEIGHTS.imdb});
    if (R.tmdb) parts.push({v:R.tmdb,   w:WEIGHTS.tmdb});
    if (R.mc)   parts.push({v:R.mc/10,  w:WEIGHTS.mc});
    if (R.rt)   parts.push({v:R.rt/10,  w:WEIGHTS.rt});
    if (!parts.length) return null;
    const W = parts.reduce((a,b)=>a+b.w,0);
    return parts.reduce((a,b)=>a + b.v*b.w, 0) / W;
  }

  /** -----------------------------------------
   * RENDER (порядок як ти просив)
   * avg → (oscars|emmy) → awards → tmdb → imdb → mc → rt → popcorn
   * ----------------------------------------- */
  function renderAll(e, R, omdb, render){
    const line = $('.full-start-new__rate-line', render);
    if (!line.length) return;

    const pg = $('.full-start__pg', render);
    const status = $('.full-start__status', render);

    line.empty();

    // 1) Average (з кольоровим класом)
    const avg = average10(R);
    if (avg && avg > 0) {
      const cls = ratingClass(avg);
      const node = nodeRate(`rate--avg ${cls}`, avg.toFixed(1), ICON.star, 'TOTAL');
      line.append(node);
    }

    // awards parse
    const awards = parseAwards(omdb && omdb.Awards ? omdb.Awards : '');

    // 2) Oscars or Emmy (пріоритет — Oscars)
    if (awards.oscars > 0) {
      line.append(nodeRate('rate--oscars', String(awards.oscars), ICON.oscar, 'Oscars'));
    } else if (awards.emmy > 0) {
      line.append(nodeRate('rate--emmy', String(awards.emmy), ICON.emmy, 'Emmy'));
    }

    // 3) Інші нагороди
    if (awards.awards > 0) {
      line.append(nodeRate('rate--awards', String(awards.awards), ICON.awards, 'Awards'));
    }

    // 4) TMDB
    if (typeof R.tmdb === 'number' && R.tmdb > 0) {
      line.append(nodeRate('rate--tmdb', R.tmdb.toFixed(1), ICON.tmdb, 'TMDB'));
    }

    // 5) IMDb
    if (typeof R.imdb === 'number' && R.imdb > 0) {
      line.append(nodeRate('rate--imdb', R.imdb.toFixed(1), ICON.imdb, 'IMDb'));
    }

    // 6) Metacritic (%)
    if (typeof R.mc === 'number' && R.mc > 0) {
      line.append(nodeRate('rate--mc', `${Math.round(R.mc)}%`, ICON.metacritic, 'Metacritic'));
    }

    // 7) Rotten Tomatoes good/bad (як у Rating#3 + джерела іконок)
    if (typeof R.rt === 'number' && R.rt >= 0) {
      const good = R.rt >= 60;
      const icon = good ? ICON.rt_good : ICON.rt_bad;
      line.append(nodeRate('rate--rt', `${Math.round(R.rt)}%`, icon, 'Rotten Tomatoes'));
    }

    // 8) PopcornMeter (%)
    if (typeof R.popcorn === 'number' && R.popcorn >= 0) {
      line.append(nodeRate('rate--popcorn', `${Math.round(R.popcorn)}%`, ICON.popcorn, 'PopcornMeter'));
    }

    // повертаємо віковий рейтинг і статус на кінець (як було)
    if (pg.length) line.append(pg);
    if (status.length) line.append(status);
  }

  function applyAgeRated(omdb, render){
    if (!omdb || !omdb.Rated) return;
    const inv = ['N/A','Not Rated','Unrated'];
    if (inv.includes(omdb.Rated)) return;
    const t = AGE_RATINGS[omdb.Rated] || omdb.Rated;
    const pg = $('.full-start__pg', render);
    if (pg.length) pg.removeClass('hide').text(t);
  }

  /** -----------------------------------------
   * LOADING UI
   * ----------------------------------------- */
  function showLoader(line){
    if (!line.length) return null;
    line.css('position','relative');
    const el = $(`<div class="loading-dots-container">
      <div class="loading-dots"><span>Loading ratings</span><span>•</span><span>•</span><span>•</span></div>
    </div>`);
    line.append(el);
    return el;
  }
  function hideLoader(loader){ if (loader) loader.remove(); }

  /** -----------------------------------------
   * MAIN FLOW
   * ----------------------------------------- */
  function run(e){
    const render = e.object.activity.render();
    if (!render || !render.length) return;

    const line = $('.full-start-new__rate-line', render);
    const loader = showLoader(line);

    const type = getType(e.object);
    let imdbId = getImdbIdFromCard(e);

    // 1) MDBList (як в Enchanser — основний канал)
    fetchMDBList(e).then(mdb => {
      // 2) IMDb ID, якщо нема
      const afterImdb = imdbId ? Promise.resolve(imdbId) : fetchImdbIdViaTmdb(e);
      return afterImdb.then(id => ({ mdb, imdb: id || imdbId }));
    }).then(({ mdb, imdb }) => {
      // 3) OMDB (для нагород, вікового рейтингу, та fallback рейтинги)
      return fetchOMDBByImdb(imdb, type).then(omdb => ({ mdb, omdb }));
    }).then(({ mdb, omdb }) => {
      const R = buildRatings(mdb, omdb);
      renderAll(e, R, omdb, render);
      applyAgeRated(omdb, render);
    }).finally(() => {
      hideLoader(loader);
    });
  }

  /** -----------------------------------------
   * BOOTSTRAP
   * ----------------------------------------- */
  function main(){
    initSettings();
    Lampa.Listener.follow('full', function(e){
      if (e.type === 'complite') {
        run(e);
      }
    });
  }

  if (!window.omdbx_full_plugin) {
    window.omdbx_full_plugin = true;
    if (window.appready) main();
    else Lampa.Listener.follow('app', e => { if (e.type === 'ready') main(); });
  }
})();
