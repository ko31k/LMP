(function () {
  'use strict';

  /* =========================================================
   * Lampa: Ratings (MDBList + OMDB) for full card
   * — пріоритет джерел: MDBList → OMDB (фолбек)
   * — одночасні запити до обох джерел
   * — порядок показу:
   *   TOTAL, Oscars | Emmy, Awards, TMDB, IMDb, Metacritic, RottenTomatoes, PopcornMeter
   * — іконки:
   *   IMDb/TMDB/Metacritic: streamingdiscovery
   *   RT Good: streamingdiscovery; RT Bad: GitHub /wwwroot/RottenBad.png
   *   Popcorn: GitHub /wwwroot/popcorn.png
   *   Awards/Star/Emmy/Oscar: GitHub /wwwroot/
   * — Metacritic: показуємо ЦІЛЕ число (наприклад 78)
   * — RT: %; IMDb/TMDB: 0–10; Popcorn: %
   * — TOTAL з вагами (IMDb .40, TMDB .40, MC .10, RT .10)
   * — перемикач ч/б іконок: ICONS_GRAYSCALE (true=ч/б, false=кольорові)
   * — вікові рейтинги/статуси: як у твоєму оригіналі (оновлюю .full-start__pg і не чіпаю статуси)
   * ========================================================= */

  /* -----------------------------
   * SETTINGS (keys & flags)
   * ----------------------------- */

  // ← сюди підставиш свої ключі
  var MDBLIST_API_KEY = '000000000000000000000000';
  var OMDB_API_KEY    = '00000000';

  // чорно-білий режим іконок: true – ч/б, false – кольорові (ти просив за замовчуванням кольорові)
  var ICONS_GRAYSCALE = false;

  /* -----------------------------
   * Static & icons
   * ----------------------------- */

  // База GitHub-папки з додатковими іконками
  var ICON_BASE_GH = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';

  // База CDN з Enchanser
  var ICON_BASE_CDN = 'https://www.streamingdiscovery.com/logo/';

  var ICONS = {
    // з CDN
    imdb:        ICON_BASE_CDN + 'imdb.png',
    tmdb:        ICON_BASE_CDN + 'tmdb.png',
    metacritic:  ICON_BASE_CDN + 'metacritic.png',
    rt_good:     ICON_BASE_CDN + 'rotten-tomatoes.png',
    // з GitHub
    rt_bad:      ICON_BASE_GH + 'RottenBad.png',
    popcorn:     ICON_BASE_GH + 'popcorn.png',
    star:        ICON_BASE_GH + 'star.png',
    oscar:       ICON_BASE_GH + 'oscar.png',
    emmy:        ICON_BASE_GH + 'emmy.png',
    awards:      ICON_BASE_GH + 'awards.png'
  };

  var GRAYSCALE_FILTER = ICONS_GRAYSCALE ? 'filter: grayscale(100%);' : '';

  /* -----------------------------
   * UI strings (Lang)
   * ----------------------------- */

  function iconTag(src) {
    return '<img src="' + src + '" style="height:14px;width:auto;display:inline-block;vertical-align:middle;object-fit:contain;transform:scale(1.2);' + GRAYSCALE_FILTER + '">';
  }

  Lampa.Lang.add({
    ratimg_omdb_avg: {
      ru: 'ИТОГ',
      en: 'TOTAL',
      uk: iconTag(ICONS.star),
      be: 'ВЫНІК'
    },
    loading_dots: {
      ru: 'Загрузка рейтингов',
      en: 'Loading ratings',
      uk: 'Трішки зачекаємо ...',
      be: 'Загрузка рэйтынгаў'
    },
    maxsm_omdb_oscars: {
      uk: iconTag(ICONS.oscar)
    },
    maxsm_omdb_emmy: {
      uk: iconTag(ICONS.emmy)
    },
    maxsm_omdb_awards_other: {
      uk: iconTag(ICONS.awards)
    },
    source_imdb: {
      uk: iconTag(ICONS.imdb)
    },
    source_tmdb: {
      uk: iconTag(ICONS.tmdb)
    },
    source_mc: {
      uk: iconTag(ICONS.metacritic)
    },
    source_rt_good: {
      uk: iconTag(ICONS.rt_good)
    },
    source_rt_bad: {
      uk: iconTag(ICONS.rt_bad)
    },
    source_popcorn: {
      uk: iconTag(ICONS.popcorn)
    }
  });

  /* -----------------------------
   * CSS (розміри як у твоєму коді)
   * ----------------------------- */

  var css = ''
    + '<style id="omdb_mdb_css">'
    + '.full-start-new__rate-line{visibility:hidden;flex-wrap:wrap;gap:.4em 0;position:relative;}'
    + '.full-start-new__rate-line>*{margin-left:0!important;margin-right:.6em!important;}'
    + '.rate--avg.rating--green{color:#4caf50;}'
    + '.rate--avg.rating--lime{color:#3399ff;}'
    + '.rate--avg.rating--orange{color:#ff9933;}'
    + '.rate--avg.rating--red{color:#f44336;}'
    + '.rate--oscars,.rate--emmy,.rate--awards{color:gold;}'
    + '.source--name.rate--icon img,.source--name.rate--icon svg{height:14px;width:auto;display:inline-block;vertical-align:middle;object-fit:contain;transform:scale(1.2);}'
    + '.loading-dots-container{position:absolute;top:50%;left:0;right:0;text-align:left;transform:translateY(-50%);z-index:10;}'
    + '.loading-dots{display:inline-flex;align-items:center;gap:.4em;color:#fff;font-size:1em;background:rgba(0,0,0,.3);padding:.6em 1em;border-radius:.5em;}'
    + '.loading-dots__text{margin-right:1em;}'
    + '.loading-dots__dot{width:.5em;height:.5em;border-radius:50%;background-color:currentColor;animation:loading-dots-bounce 1.4s infinite ease-in-out both;}'
    + '.loading-dots__dot:nth-child(1){animation-delay:-.32s;}'
    + '.loading-dots__dot:nth-child(2){animation-delay:-.16s;}'
    + '@keyframes loading-dots-bounce{0%,80%,100%{transform:translateY(0);opacity:.6;}40%{transform:translateY(-.5em);opacity:1;}}'
    + '</style>';

  Lampa.Template.add('omdb_mdb_css', css);
  $('body').append(Lampa.Template.get('omdb_mdb_css', {}, true));

  /* -----------------------------
   * Cache & constants
   * ----------------------------- */

  var CACHE_TIME = 3 * 24 * 60 * 60 * 1000; // 3 дні
  var CACHE_MDB = 'maxsm_rating_mdblist';
  var CACHE_OMDB = 'maxsm_rating_omdb';
  var CACHE_MAP = 'maxsm_rating_id_mapping';

  var AGE_RATINGS = {
    'G': '3+', 'PG': '6+', 'PG-13': '13+', 'R': '17+', 'NC-17': '18+',
    'TV-Y': '0+', 'TV-Y7': '7+', 'TV-G': '3+', 'TV-PG': '6+', 'TV-14': '14+', 'TV-MA': '17+'
  };

  var WEIGHTS = { imdb: 0.40, tmdb: 0.40, mc: 0.10, rt: 0.10 };

  function getCache(bucket, key) {
    var cache = Lampa.Storage.get(bucket) || {};
    var item = cache[key];
    if (!item) return null;
    if (Date.now() - item.ts > CACHE_TIME) return null;
    return item.data;
  }
  function setCache(bucket, key, data) {
    var cache = Lampa.Storage.get(bucket) || {};
    cache[key] = { ts: Date.now(), data: data };
    Lampa.Storage.set(bucket, cache);
  }

  /* -----------------------------
   * Helpers
   * ----------------------------- */

  function addLoading() {
    var render = Lampa.Activity.active().activity.render();
    if (!render) return;
    var rateLine = $('.full-start-new__rate-line', render);
    if (!rateLine.length || $('.loading-dots-container', rateLine).length) return;
    rateLine.append(
      '<div class="loading-dots-container">'
      + '<div class="loading-dots">'
      + '<span class="loading-dots__text">' + Lampa.Lang.translate('loading_dots') + '</span>'
      + '<span class="loading-dots__dot"></span>'
      + '<span class="loading-dots__dot"></span>'
      + '<span class="loading-dots__dot"></span>'
      + '</div>'
      + '</div>'
    );
    $('.loading-dots-container', rateLine).css({ opacity: '1', visibility: 'visible' });
  }
  function removeLoading() {
    var render = Lampa.Activity.active().activity.render();
    if (!render) return;
    $('.loading-dots-container', render).remove();
  }

  function getType(card) {
    var t = card.media_type || card.type;
    if (t === 'movie' || t === 'tv') return t;
    return card.name || card.original_name ? 'tv' : 'movie';
  }
  function getRatingClass(r) {
    if (r >= 8.0) return 'rating--green';
    if (r >= 6.0) return 'rating--lime';
    if (r >= 5.5) return 'rating--orange';
    return 'rating--red';
  }
  function parseAwards(awardsText) {
    if (typeof awardsText !== 'string') return { oscars: 0, emmy: 0, awards: 0 };
    var result = { oscars: 0, emmy: 0, awards: 0 };
    var oscarMatch = awardsText.match(/Won\s+(\d+)\s+Oscars?/i);
    if (oscarMatch && oscarMatch[1]) result.oscars = parseInt(oscarMatch[1], 10);
    var emmyMatch = awardsText.match(/Won\s+(\d+)\s+Primetime\s+Emmys?/i);
    if (emmyMatch && emmyMatch[1]) result.emmy = parseInt(emmyMatch[1], 10);
    var otherMatch = awardsText.match(/Another\s+(\d+)\s+wins?/i);
    if (otherMatch && otherMatch[1]) result.awards = parseInt(otherMatch[1], 10);
    if (result.awards === 0) {
      var simpleMatch = awardsText.match(/(\d+)\s+wins?/i);
      if (simpleMatch && simpleMatch[1]) result.awards = parseInt(simpleMatch[1], 10);
    }
    return result;
  }

  function normalizeTo10(val) {
    // використовується для IMDb/TMDB (якщо хтось раптом прийде в %)
    if (!val) return 0;
    if (val > 10 && val <= 100) return val / 10;
    return val;
  }

  /* -----------------------------
   * ID mapping (TMDB -> IMDb)
   * ----------------------------- */

  function getImdbId(card, callback) {
    if (card.imdb_id) return callback(card.imdb_id);

    var type = getType(card);
    var cacheKey = type + '_' + card.id;
    var cached = getCache(CACHE_MAP, cacheKey);
    if (cached) return callback(cached);

    var url = 'https://api.themoviedb.org/3/' + type + '/' + card.id + '/external_ids?api_key=' + Lampa.TMDB.key();

    var success = function (data) {
      if (data && data.imdb_id) {
        setCache(CACHE_MAP, cacheKey, data.imdb_id);
        callback(data.imdb_id);
      } else {
        callback(null);
      }
    };
    new Lampa.Reguest().silent(url, success, function () {
      new Lampa.Reguest().native(url, function (data) {
        try { success(typeof data === 'string' ? JSON.parse(data) : data); }
        catch (e) { callback(null); }
      }, function () { callback(null); }, false, { dataType: 'json' });
    });
  }

  /* -----------------------------
   * Fetch: MDBList (основний)
   * ----------------------------- */

  function fetchMDBList(card) {
    return new Promise(function (resolve) {
      var type = getType(card) === 'tv' ? 'show' : 'movie';
      var cacheKey = type + '_' + card.id;
      var cached = getCache(CACHE_MDB, cacheKey);
      if (cached) return resolve(cached);

      var url = 'https://api.mdblist.com/tmdb/' + type + '/' + card.id + '?apikey=' + MDBLIST_API_KEY;

      new Lampa.Reguest().silent(url, function (data) {
        var r = { imdb: 0, tmdb: 0, rt: 0, mc: 0, popcorn: 0 };
        if (data && data.ratings && data.ratings.length) {
          data.ratings.forEach(function (it) {
            var s = (it.source || '').toLowerCase();
            var v = parseFloat(it.value);
            if (isNaN(v)) return;
            if (s === 'imdb') r.imdb = normalizeTo10(v);
            if (s === 'tmdb') r.tmdb = normalizeTo10(v);
            if (s === 'tomatoes') r.rt = Math.max(0, Math.min(100, Math.round(v))); // 0..100
            if (s === 'metacritic') r.mc = Math.max(0, Math.min(100, Math.round(v))); // 0..100
            if (s === 'popcorn' || s === 'popcornmeter') r.popcorn = Math.max(0, Math.min(100, Math.round(v)));
          });
        }
        // інколи mdblist дає score/popcorn окремо
        if (data && typeof data.score === 'number' && !r.tmdb) r.tmdb = normalizeTo10(data.score);
        if (data && typeof data.popcorn === 'number' && !r.popcorn) {
          var pv = data.popcorn;
          r.popcorn = pv <= 1 ? Math.round(pv * 100) : Math.round(pv);
        }

        setCache(CACHE_MDB, cacheKey, r);
        resolve(r);
      }, function () { resolve({}); });
    });
  }

  /* -----------------------------
   * Fetch: OMDB (фолбек + нагороди/віковий)
   * ----------------------------- */

  function fetchOMDB(card) {
    return new Promise(function (resolve) {
      getImdbId(card, function (imdbId) {
        if (!imdbId) return resolve({});
        var type = getType(card);
        var cacheKey = type + '_' + imdbId;
        var cached = getCache(CACHE_OMDB, cacheKey);
        if (cached) return resolve(cached);

        var typeParam = (type === 'tv') ? '&type=series' : '';
        var url = 'https://www.omdbapi.com/?apikey=' + OMDB_API_KEY + '&i=' + imdbId + typeParam;

        new Lampa.Reguest().silent(url, function (data) {
          if (data && data.Response === 'True') {
            var parsedAwards = parseAwards(data.Awards || '');
            var om = {
              imdb: data.imdbRating && data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : 0, // 0..10
              rt: 0, mc: 0, ageRating: data.Rated || null,
              oscars: parsedAwards.oscars, emmy: parsedAwards.emmy, awards: parsedAwards.awards
            };
            if (Array.isArray(data.Ratings)) {
              data.Ratings.forEach(function (r) {
                var src = (r.Source || '').toLowerCase();
                if (src.indexOf('rotten') !== -1) {
                  var n = parseInt(String(r.Value).replace('%', ''), 10);
                  if (!isNaN(n)) om.rt = Math.max(0, Math.min(100, n)); // %
                }
                if (src.indexOf('metacritic') !== -1) {
                  var p = String(r.Value).split('/');
                  var n2 = parseInt(p[0], 10);
                  if (!isNaN(n2)) om.mc = Math.max(0, Math.min(100, n2)); // ціле
                }
                if (src.indexOf('imdb') !== -1 && !om.imdb) {
                  // інколи приходить щось типу "8.6/10"
                  var iv = parseFloat(String(r.Value));
                  if (!isNaN(iv)) om.imdb = iv;
                }
              });
            }
            setCache(CACHE_OMDB, cacheKey, om);
            resolve(om);
          } else resolve({});
        }, function () { resolve({}); });
      });
    });
  }

  /* -----------------------------
   * Merge пріоритетів MDBList → OMDB
   * ----------------------------- */

  function mergeRatings(md, om) {
    // md (MDBList) має пріоритет, OMDB – фолбек
    return {
      imdb: md.imdb || om.imdb || 0,
      tmdb: md.tmdb || 0,
      rt:   (md.rt || om.rt || 0),     // % (0..100)
      mc:   (md.mc || om.mc || 0),     // ціле (0..100)
      popcorn: md.popcorn || 0,
      ageRating: om.ageRating || null,
      oscars: om.oscars || 0,
      emmy: om.emmy || 0,
      awards: om.awards || 0
    };
  }

  /* -----------------------------
   * UI helpers
   * ----------------------------- */

  function rateNode(className, value, htmlIcon) {
    var el = $(
      '<div class="full-start__rate ' + className + '">'
      + '<div>' + value + '</div>'
      + '<div class="source--name rate--icon">' + htmlIcon + '</div>'
      + '</div>'
    );
    return el;
  }

  function insertRatings(final) {
    var render = Lampa.Activity.active().activity.render();
    if (!render) return;
    var line = $('.full-start-new__rate-line', render);
    if (!line.length) return;

    // очищати НЕ будемо — у тебе вже є елементи IMDb/TMDB у картці. Ми тільки додаємо свої та оновлюємо ховаючи/показуючи.
    // Спочатку — TOTAL (як окремий блок перед усім)
    $('.rate--avg', line).remove();

    var avg10 = getAverage10(final);
    if (avg10) {
      var cl = getRatingClass(avg10);
      var avgNode = rateNode('rate--avg ' + cl, avg10.toFixed(1), Lampa.Lang.translate('ratimg_omdb_avg'));
      $('.full-start__rate:first', line).before(avgNode);
    }

    // Далі — блок нагород: спочатку Oscars або Emmy (якщо немає Оскарів), потім Awards
    if (final.oscars > 0 && !$('.rate--oscars', line).length) {
      var osc = rateNode('rate--oscars', final.oscars, Lampa.Lang.translate('maxsm_omdb_oscars'));
      line.prepend(osc);
    } else if (final.emmy > 0 && !$('.rate--emmy', line).length) {
      var emmy = rateNode('rate--emmy', final.emmy, Lampa.Lang.translate('maxsm_omdb_emmy'));
      line.prepend(emmy);
    }

    if (final.awards > 0 && !$('.rate--awards', line).length) {
      var aw = rateNode('rate--awards', final.awards, Lampa.Lang.translate('maxsm_omdb_awards_other'));
      line.prepend(aw);
    }

    // TMDB (0..10)
    if (final.tmdb > 0 && !$('.rate--tmdb', line).length) {
      var tmdbNode = rateNode('rate--tmdb', final.tmdb.toFixed(1), Lampa.Lang.translate('source_tmdb'));
      line.append(tmdbNode);
    }

    // IMDb (0..10) – оновлення існуючого компонента + іконка як у Enchanser
    var imdbContainer = $('.rate--imdb', render);
    if (imdbContainer.length && final.imdb > 0) {
      imdbContainer.removeClass('hide');
      imdbContainer.children('div').eq(0).text(parseFloat(final.imdb).toFixed(1));
      imdbContainer.children('div').eq(1).html(Lampa.Lang.translate('source_imdb'));
    } else if (!imdbContainer.length && final.imdb > 0) {
      var imdbNode = rateNode('rate--imdb', parseFloat(final.imdb).toFixed(1), Lampa.Lang.translate('source_imdb'));
      line.append(imdbNode);
    }

    // Metacritic (ЦІЛЕ число, НЕ відсоток)
    if (final.mc > 0 && !$('.rate--mc', line).length) {
      var mcNode = rateNode('rate--mc', Math.round(final.mc), Lampa.Lang.translate('source_mc'));
      line.append(mcNode);
    }

    // Rotten Tomatoes: Good (≥60) / Bad (≤59)
    if (final.rt >= 0 && !$('.rate--rt', line).length) {
      var good = final.rt >= 60;
      var rtIcon = good ? Lampa.Lang.translate('source_rt_good')
                        : Lampa.Lang.translate('source_rt_bad');
      var rtNode = rateNode('rate--rt', Math.round(final.rt) + '%', rtIcon);
      line.append(rtNode);
    }

    // PopcornMeter (%)
    if (final.popcorn > 0 && !$('.rate--popcorn', line).length) {
      var popNode = rateNode('rate--popcorn', Math.round(final.popcorn) + '%', Lampa.Lang.translate('source_popcorn'));
      line.append(popNode);
    }
  }

  function getAverage10(final) {
    // IMDb/TMDB — 0..10
    // MC/RT — 0..100 → ділимо на 10 для підрахунку Total
    var imdb = final.imdb || 0;
    var tmdb = final.tmdb || 0;
    var mc10 = final.mc ? (final.mc / 10) : 0;
    var rt10 = final.rt ? (final.rt / 10) : 0;

    var sum = 0, w = 0, cnt = 0;
    if (imdb > 0) { sum += imdb * WEIGHTS.imdb; w += WEIGHTS.imdb; cnt++; }
    if (tmdb > 0) { sum += tmdb * WEIGHTS.tmdb; w += WEIGHTS.tmdb; cnt++; }
    if (mc10 > 0) { sum += mc10 * WEIGHTS.mc;   w += WEIGHTS.mc;   cnt++; }
    if (rt10 > 0) { sum += rt10 * WEIGHTS.rt;   w += WEIGHTS.rt;   cnt++; }

    if (!cnt || !w) return 0;
    return sum / w;
  }

  function updateHiddenElements(final) {
    // Віковий рейтинг — як у твоєму оригіналі
    var render = Lampa.Activity.active().activity.render();
    if (!render || !render[0]) return;

    var pgElement = $('.full-start__pg.hide', render);
    if (pgElement.length && final.ageRating) {
      var invalid = ['N/A', 'Not Rated', 'Unrated'];
      if (invalid.indexOf(final.ageRating) === -1) {
        var loc = AGE_RATINGS[final.ageRating] || final.ageRating;
        pgElement.removeClass('hide').text(loc);
      }
    }

    // TMDB — лише вліпити правильну іконку (значення ставимо вище)
    var tmdbContainer = $('.rate--tmdb', render);
    if (tmdbContainer.length) {
      tmdbContainer.find('> div:nth-child(2)').html(Lampa.Lang.translate('source_tmdb'));
    }
  }

  /* -----------------------------
   * Controller
   * ----------------------------- */

  function processCard(card) {
    var render = Lampa.Activity.active().activity.render();
    if (!render) return;

    var line = $('.full-start-new__rate-line', render);
    if (line.length) {
      line.css('visibility', 'hidden');
      addLoading();
    }

    // Одночасно беремо з двох джерел
    Promise.all([ fetchMDBList(card), fetchOMDB(card) ]).then(function (resp) {
      var md = resp[0] || {};
      var om = resp[1] || {};

      var final = mergeRatings(md, om);

      // Порядок: TOTAL, Oscars|Emmy, Awards, TMDB, IMDb, MC, RT, Popcorn
      insertRatings(final);

      // Віковий рейтинг/оновлення підписів як в оригіналі
      updateHiddenElements(final);

      removeLoading();
      line.css('visibility', 'visible');
    }).catch(function () {
      removeLoading();
      if (line.length) line.css('visibility', 'visible');
    });
  }

  /* -----------------------------
   * Init hook
   * ----------------------------- */

  function start() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        setTimeout(function () { processCard(e.data.movie); }, 400);
      }
    });
  }

  if (!window.__omdb_mdb_combined__) {
    window.__omdb_mdb_combined__ = true;
    start();
  }
})();
