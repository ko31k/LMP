(function() {
    'use strict';

    // ---------------------------------------------------
    // -- КОНФІГУРАЦІЯ ПЛАГІНА --
    // ---------------------------------------------------

    /**
     * API ключ для MDBList API (отримати на https://api.mdblist.com)
     * !!! ВСТАВ СВІЙ КЛЮЧ НИЖЧЕ !!!
     * @type {string}
     */
    const MDBLIST_API_KEY = 'm8po461k1zq14sroj2ez5d7um';

    /**
     * API ключ для OMDB (використовується для нагород, вікового рейтингу і фолбеків)
     * !!! ВСТАВ СВІЙ КЛЮЧ НИЖЧЕ !!!
     * @type {string}
     */
    const OMDB_API_KEY = '12c9249c';

    /**
     * Якщо true — іконки відображаються чорно-білими (як в Enchanser)
     * Якщо false — кольоровими
     * @type {boolean}
     */
    const USE_GRAYSCALE_ICONS = true;

    /**
     * Базовий URL для PNG-іконок з GitHub
     * @type {string}
     */
    const ICON_BASE_URL = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';

    // ---------------------------------------------------
    // -- СТИЛІ --
    // ---------------------------------------------------

    // оригінальні стилі з omdb, але збільшуємо іконку ~на 5px (було дрібне)
    // і більше нічого не чіпаємо
    var style = ''
    + '<style id="maxsm_omdb_rating_fixed">'
    + '.full-start-new__rate-line {'
    + '    visibility: hidden;'
    + '    flex-wrap: wrap;'
    + '    gap: 0.4em 0;'
    + '    position: relative;'
    + '}'
    + '.full-start-new__rate-line > * {'
    + '    margin-left: 0 !important;'
    + '    margin-right: 0.6em !important;'
    + '}'
    + '.full-start__rate {'
    + '    display: inline-flex;'
    + '    align-items: center;'
    + '    gap: 6px;'
    + '    padding: 0.6em 0.8em;'
    + '    background: rgba(0,0,0,0.3);'
    + '    border-radius: 0.5em;'
    + '    line-height: 1;'
    + '}'
    + '.rate--avg.rating--green  { color: #4caf50; }'
    + '.rate--avg.rating--lime   { color: #3399ff; }'
    + '.rate--avg.rating--orange { color: #ff9933; }'
    + '.rate--avg.rating--red    { color: #f44336; }'
    + '.rate--oscars             { color: gold;    }'
    + '.rate--emmy               { color: gold;    }'
    + '.rate--awards             { color: gold;    }'
    // >>> тут наша правка розміру іконок
    + '.rate--icon-img {'
    + '    height: 22px;'
    + '    width: auto;'
    + '    display: inline-block;'
    + '    vertical-align: middle;'
    + '    object-fit: contain;'
    + '    line-height: 1;'
    + '}'
    // loader styles з оригіналу
    + '.loading-dots-container {'
    + '    position: absolute;'
    + '    top: 50%;'
    + '    left: 0;'
    + '    right: 0;'
    + '    text-align: left;'
    + '    transform: translateY(-50%);'
    + '    z-index: 10;'
    + '}'
    + '.loading-dots {'
    + '    display: inline-flex;'
    + '    align-items: center;'
    + '    gap: 0.4em;'
    + '    color: #ffffff;'
    + '    font-size: 1em;'
    + '    background: rgba(0, 0, 0, 0.3);'
    + '    padding: 0.6em 1em;'
    + '    border-radius: 0.5em;'
    + '}'
    + '.loading-dots__text {'
    + '    margin-right: 1em;'
    + '}'
    + '.loading-dots__dot {'
    + '    width: 0.5em;'
    + '    height: 0.5em;'
    + '    border-radius: 50%;'
    + '    background-color: currentColor;'
    + '    animation: loading-dots-bounce 1.4s infinite ease-in-out both;'
    + '}'
    + '.loading-dots__dot:nth-child(1) { animation-delay: -0.32s; }'
    + '.loading-dots__dot:nth-child(2) { animation-delay: -0.16s; }'
    + '@keyframes loading-dots-bounce {'
    + '    0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }'
    + '    40% { transform: translateY(-0.5em); opacity: 1; }'
    + '}'
    + '</style>';

    if (!document.getElementById('maxsm_omdb_rating_fixed')) {
        $('body').append(style);
    }

    // ---------------------------------------------------
    // -- SVG ІКОНКИ З ENCHANSER (inline) --
    // ---------------------------------------------------

    const grayscaleCssInline = USE_GRAYSCALE_ICONS ? 'filter:grayscale(100%);' : '';

    const SVG_ICONS = {
        imdb:
            '<svg class="rate--icon-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 32" style="height:22px;width:auto;'+grayscaleCssInline+'">' +
                '<rect x="0" y="0" width="64" height="32" rx="4" fill="currentColor"/>' +
                '<text x="12" y="22" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700" fill="#000">IMDb</text>' +
            '</svg>',
        tmdb:
            '<svg class="rate--icon-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" style="height:22px;width:auto;'+grayscaleCssInline+'">' +
                '<rect x="2" y="2" width="34" height="34" rx="6" ry="6" stroke="currentColor" fill="none" stroke-width="3"/>' +
                '<text x="7" y="25" font-size="11" font-weight="700" font-family="Arial,Helvetica,sans-serif" fill="currentColor">TMDB</text>' +
            '</svg>',
        mc:
            '<svg class="rate--icon-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="height:22px;width:auto;'+grayscaleCssInline+'">' +
                '<circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="3" fill="none"/>' +
                '<path d="M9 20 L23 12" stroke="currentColor" stroke-width="3"/>' +
            '</svg>',
        rtFresh:
            '<svg class="rate--icon-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="height:22px;width:auto;'+grayscaleCssInline+'">' +
                '<circle cx="16" cy="16" r="14" fill="currentColor"/>' +
                '<path d="M10 16 l3 3 l8 -8" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"/>' +
            '</svg>'
    };

    function pngIcon(name) {
        return '<img src="' + ICON_BASE_URL + name + '" class="rate--icon-img" style="' + grayscaleCssInline + '">';
    }

    // ---------------------------------------------------
    // -- ЛОКАЛІЗАЦІЯ ТА ПІДСТАНОВА ІКОНОК --
    // ---------------------------------------------------

    // Тут ми НЕ ламаємо твою локалізацію, просто міняємо значення на SVG/PNG,
    // щоб при вставці через .html(Lampa.Lang.translate(...)) підставлялись іконки.
    Lampa.Lang.add({
        ratimg_omdb_avg: {
            ru: 'ИТОГ',
            en: 'TOTAL',
            uk: pngIcon('star.png'), // середня оцінка (білий текст біля зірки)
            be: 'ВЫНІК'
        },
        loading_dots: {
            ru: 'Загрузка рейтингов',
            en: 'Loading ratings',
            uk: 'Трішки зачекаємо ...',
            be: 'Загрузка рэйтынгаў'
        },
        maxsm_omdb_oscars: {
            // Oscars/Emmy ми не міняємо на PNG, вони залишаються як були текстом/кольором
            ru: 'Оскары',
            en: 'Oscars',
            uk: 'Оскари',
            be: 'Оскары'
        },
        maxsm_omdb_emmy: {
            ru: 'Эмми',
            en: 'Emmy',
            uk: 'Еммі',
            be: 'Эммі'
        },
        maxsm_omdb_awards_other: {
            // "інші нагороди" => іконка awards.png з GitHub
            ru: pngIcon('awards.png'),
            en: pngIcon('awards.png'),
            uk: pngIcon('awards.png'),
            be: pngIcon('awards.png')
        },
        source_imdb: {
            ru: 'IMDB',
            en: SVG_ICONS.imdb,
            uk: SVG_ICONS.imdb,
            be: 'IMDB'
        },
        source_tmdb: {
            ru: 'TMDB',
            en: SVG_ICONS.tmdb,
            uk: SVG_ICONS.tmdb,
            be: 'TMDB'
        },
        source_mc: {
            ru: 'Metacritic',
            en: SVG_ICONS.mc,
            uk: SVG_ICONS.mc,
            be: 'Metacritic'
        }
    });

    // ---------------------------------------------------
    // -- КОНФІГУРАЦІЯ API ТА КЕШУ --
    // ---------------------------------------------------

    var CACHE_TIME = 3 * 24 * 60 * 60 * 1000; // 3 дні
    var AWARDS_CACHE = 'maxsm_rating_omdb'; // кеш для OMDB (нагороди, вік, фолбеки)
    var MDBLIST_CACHE = 'maxsm_rating_mdblist'; // кеш для MDBList (рейтинги + popcorn)
    var ID_MAPPING_CACHE = 'maxsm_rating_id_mapping';

    // конвертація вікових рейтингів OMDB -> зручна форма замість "TV-MA"
    var AGE_RATINGS = {
        'G': '3+',
        'PG': '6+',
        'PG-13': '13+',
        'R': '17+',
        'NC-17': '18+',
        'TV-Y': '0+',
        'TV-Y7': '7+',
        'TV-G': '3+',
        'TV-PG': '6+',
        'TV-14': '14+',
        'TV-MA': '17+'
    };

    // ваги для середнього рейтингу
    var WEIGHTS = {
        imdb: 0.40,
        tmdb: 0.40,
        mc:   0.10,
        rt:   0.10
    };

    // ---------------------------------------------------
    // -- УТИЛІТИ КЕШУ --
    // ---------------------------------------------------

    function getCache(cacheName, key) {
        var cache = Lampa.Storage.get(cacheName) || {};
        var item = cache[key];
        return item && (Date.now() - item.timestamp < CACHE_TIME) ? item.data : null;
    }

    function setCache(cacheName, key, data) {
        var cache = Lampa.Storage.get(cacheName) || {};
        cache[key] = {
            data: data,
            timestamp: Date.now()
        };
        Lampa.Storage.set(cacheName, cache);
    }

    // ---------------------------------------------------
    // -- ВИЗНАЧЕННЯ ТИПУ КАРТКИ --
    // ---------------------------------------------------

    function getCardType(card) {
        var type = card.media_type || card.type;
        if (type === 'movie' || type === 'tv') return type;
        // fallback: якщо є name/original_name => серіал
        return (card.name || card.original_name) ? 'tv' : 'movie';
    }

    // ---------------------------------------------------
    // -- ПАРСИНГ НАГОРОД З OMDB --
    // ---------------------------------------------------

    function parseAwards(awardsText) {
        if (typeof awardsText !== 'string') return { oscars: 0, emmy: 0, awards: 0 };

        var result = { oscars: 0, emmy: 0, awards: 0 };

        // Won 2 Oscars / Won 1 Oscar
        var oscarMatch = awardsText.match(/Won\s+(\d+)\s+Oscars?/i);
        if (oscarMatch && oscarMatch[1]) {
            result.oscars = parseInt(oscarMatch[1], 10);
        }

        // Won 10 Primetime Emmys
        var emmyMatch = awardsText.match(/Won\s+(\d+)\s+Primetime\s+Emmys?/i);
        if (emmyMatch && emmyMatch[1]) {
            result.emmy = parseInt(emmyMatch[1], 10);
        }

        // Another 110 wins
        var otherMatch = awardsText.match(/Another\s+(\d+)\s+wins?/i);
        if (otherMatch && otherMatch[1]) {
            result.awards = parseInt(otherMatch[1], 10);
        }

        // fallback - будь-яке "<num> wins"
        if (result.awards === 0) {
            var simpleMatch = awardsText.match(/(\d+)\s+wins?/i);
            if (simpleMatch && simpleMatch[1]) {
                result.awards = parseInt(simpleMatch[1], 10);
            }
        }

        return result;
    }

    // ---------------------------------------------------
    // -- ВИТЯГ РЕЙТИНГІВ З OMDB.Ratings --
    // ---------------------------------------------------

    function extractOmdbRating(ratings, source) {
        if (!ratings || !Array.isArray(ratings)) return 0;

        for (var i = 0; i < ratings.length; i++) {
            if (ratings[i].Source === source) {
                try {
                    if (source === 'Rotten Tomatoes') {
                        // "87%"
                        return parseFloat(String(ratings[i].Value).replace('%', '')); // 0-100
                    } 
                    else if (source === 'Metacritic') {
                        // "64/100"
                        var left = String(ratings[i].Value).split('/')[0];
                        return parseFloat(left) * 1; // 0-100
                    } 
                    else {
                        // "Internet Movie Database": "8.7/10"
                        var val = String(ratings[i].Value).split('/')[0];
                        return parseFloat(val); // 0-10
                    }
                } catch(e) { 
                    return 0; 
                }
            }
        }

        return 0;
    }

    // ---------------------------------------------------
    // -- MDBLIST API (основне джерело рейтингів) --
    // ---------------------------------------------------

    function fetchMdbListData(card) {
        return new Promise(function(resolve) {
            if (!MDBLIST_API_KEY || MDBLIST_API_KEY.indexOf('<<<PUT_YOUR_') === 0) {
                console.warn('MDBList key not set');
                return resolve({});
            }

            var typeForApi = getCardType(card) === 'tv' ? 'show' : 'movie';
            var cacheKey = typeForApi + '_' + card.id;
            var cached = getCache(MDBLIST_CACHE, cacheKey);
            if (cached) return resolve(cached);

            var url = 'https://api.mdblist.com/tmdb/' + typeForApi + '/' + card.id + '?apikey=' + MDBLIST_API_KEY;

            new Lampa.Reguest().silent(url, function(data) {
                var result = {
                    imdb: 0,        // 0-10
                    tmdb: 0,        // 0-10
                    rt: 0,          // 0-100 (%)
                    mc: 0,          // 0-100 (%)
                    popcorn: 0      // 0-100 PopcornMeter
                };

                if (data) {
                    // універсальний варіант через data.ratings масив
                    if (Array.isArray(data.ratings)) {
                        data.ratings.forEach(function(r) {
                            var src = (r.source || '').toLowerCase();
                            var val = parseFloat(r.value);
                            if (!isFinite(val)) return;

                            if (src === 'imdb')        result.imdb = val;      // 0-10
                            if (src === 'tmdb')        result.tmdb = val;      // 0-10
                            if (src === 'tomatoes')    result.rt   = val;      // 0-100
                            if (src === 'metacritic')  result.mc   = val;      // 0-100
                            if (src === 'popcornmeter' || src === 'popcorn' || src === 'audience')
                                result.popcorn = val;                          // 0-100
                        });
                    }

                    // можливі альтернативні поля
                    if (!result.imdb && isFinite(data.imdb_rating))        result.imdb = parseFloat(data.imdb_rating);
                    if (!result.tmdb && isFinite(data.tmdb_rating))        result.tmdb = parseFloat(data.tmdb_rating);
                    if (!result.rt   && isFinite(data.rotten_tomatoes))    result.rt   = parseFloat(data.rotten_tomatoes);
                    if (!result.mc   && isFinite(data.metacritic))         result.mc   = parseFloat(data.metacritic);
                    if (!result.popcorn && isFinite(data.popcornmeter))    result.popcorn = parseFloat(data.popcornmeter);
                    if (!result.popcorn && isFinite(data.popcorn))         result.popcorn = parseFloat(data.popcorn);
                    if (!result.popcorn && isFinite(data.audience_score))  result.popcorn = parseFloat(data.audience_score);
                }

                setCache(MDBLIST_CACHE, cacheKey, result);
                resolve(result);
            }, function() {
                resolve({});
            });
        });
    }

    // ---------------------------------------------------
    // -- OMDB API (нагороди + віковий рейтинг + фолбеки) --
    // ---------------------------------------------------

    function fetchOmdbData(card) {
        return new Promise(function(resolve) {
            if (!OMDB_API_KEY || OMDB_API_KEY.indexOf('<<<PUT_YOUR_') === 0) {
                return resolve({});
            }

            getImdbId(card, function(imdbId) {
                if (!imdbId) return resolve({});

                var cardType = getCardType(card);
                var cacheKey = cardType + '_' + imdbId;
                var cached = getCache(AWARDS_CACHE, cacheKey);
                if (cached) return resolve(cached);

                var typeParam = (cardType === 'tv') ? '&type=series' : '';
                var url = 'https://www.omdbapi.com/?apikey=' + OMDB_API_KEY + '&i=' + imdbId + typeParam;

                new Lampa.Reguest().silent(url, function(data) {
                    if (!data || data.Response !== 'True') {
                        return resolve({});
                    }

                    var awardsParsed = parseAwards(data.Awards || '');

                    // збираємо фолбеки рейтингів
                    // imdbRating: "8.4"
                    var imdbRating = 0;
                    if (data.imdbRating && data.imdbRating !== 'N/A') {
                        imdbRating = parseFloat(data.imdbRating); // 0-10
                        if (!isFinite(imdbRating)) imdbRating = 0;
                    }

                    var rtValue = extractOmdbRating(data.Ratings, 'Rotten Tomatoes'); // 0-100
                    var mcValue = extractOmdbRating(data.Ratings, 'Metacritic');      // 0-100
                    var ageRating = data.Rated || null;

                    var payload = {
                        imdb: imdbRating || 0,
                        rt: rtValue || 0,
                        mc: mcValue || 0,
                        ageRating: ageRating,
                        oscars: awardsParsed.oscars,
                        emmy: awardsParsed.emmy,
                        awards: awardsParsed.awards
                    };

                    setCache(AWARDS_CACHE, cacheKey, payload);
                    resolve(payload);

                }, function() {
                    resolve({});
                });
            });
        });
    }

    // ---------------------------------------------------
    // -- ОТРИМАННЯ IMDB ID З TMDB --
    // ---------------------------------------------------

    function getImdbId(card, callback) {
        if (card.imdb_id) return callback(card.imdb_id);

        var cardType = getCardType(card);
        var cacheKey = cardType + '_' + card.id;
        var cachedId = getCache(ID_MAPPING_CACHE, cacheKey);
        if (cachedId) return callback(cachedId);

        // виклик TMDB external_ids
        var url = 'https://api.themoviedb.org/3/' + cardType + '/' + card.id + '/external_ids?api_key=' + Lampa.TMDB.key();

        new Lampa.Reguest().silent(url, function(data) {
            if (data && data.imdb_id) {
                setCache(ID_MAPPING_CACHE, cacheKey, data.imdb_id);
                callback(data.imdb_id);
            } else {
                callback(null);
            }
        }, function() {
            callback(null);
        });
    }

    // ---------------------------------------------------
    // -- ВІДМАЛЬОВКА / ON-SCREEN ОНОВЛЕННЯ --
    // ---------------------------------------------------

    function addLoadingAnimation() {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length || $('.loading-dots-container', rateLine).length) return;

        rateLine.append(
            '<div class="loading-dots-container">' +
                '<div class="loading-dots">' +
                    '<span class="loading-dots__text">' + Lampa.Lang.translate("loading_dots") + '</span>' +
                    '<span class="loading-dots__dot"></span>' +
                    '<span class="loading-dots__dot"></span>' +
                    '<span class="loading-dots__dot"></span>' +
                '</div>' +
            '</div>'
        );

        $('.loading-dots-container', rateLine).css({
            'opacity': '1',
            'visibility': 'visible'
        });
    }

    function removeLoadingAnimation() {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;
        $('.loading-dots-container', render).remove();
    }

    /**
     * Показує/оновлює приховані стандартні поля (IMDb/TMDB відеоролика, віковий рейтинг).
     * Тобто ми не підміняємо їх структуру, тільки вставляємо отримані значення.
     */
    function updateHiddenElements(ratings) {
        var render = Lampa.Activity.active().activity.render();
        if (!render || !render[0]) return;

        // Віковий рейтинг (PG-13 -> 13+ тощо)
        var pgElement = $('.full-start__pg.hide', render);
        if (pgElement.length && ratings.ageRating) {
            var invalidRatings = ['N/A', 'Not Rated', 'Unrated'];
            if (invalidRatings.indexOf(ratings.ageRating) === -1) {
                var localizedRating = AGE_RATINGS[ratings.ageRating] || ratings.ageRating;
                pgElement.removeClass('hide').text(localizedRating);
            }
        }

        // IMDb (у стандартному контейнері, якщо він є)
        var imdbContainer = $('.rate--imdb', render);
        if (imdbContainer.length && ratings.imdb > 0) {
            imdbContainer.removeClass('hide');
            imdbContainer.children('div').eq(0).text(parseFloat(ratings.imdb).toFixed(1));
            imdbContainer.children('div').eq(1).html(Lampa.Lang.translate('source_imdb'));
        }

        // TMDB
        var tmdbContainer = $('.rate--tmdb', render);
        if (tmdbContainer.length && ratings.tmdb > 0) {
            tmdbContainer.removeClass('hide');
            tmdbContainer.children('div').eq(0).text(parseFloat(ratings.tmdb).toFixed(1));
            tmdbContainer.children('div').eq(1).html(Lampa.Lang.translate('source_tmdb'));
        }
    }

    // колір середнього рейтингу
    function getRatingClass(rating) {
        if (rating >= 8.0) return 'rating--green';
        if (rating >= 6.0) return 'rating--lime';
        if (rating >= 5.5) return 'rating--orange';
        return 'rating--red';
    }

    /**
     * Вставляє додаткові блоки рейтингу:
     * - RT (fresh/rotten)
     * - Metacritic
     * - PopcornMeter
     * - Awards / Emmy / Oscars
     * !!! Порядок не міняємо. !!!
     */
    function insertRatings(ratings) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;

        var lastRate = $('.full-start__rate:last', rateLine);

        // Rotten Tomatoes (з MDBList або OMDB, 0-100)
        if (ratings.rt > 0 && !$('.rate--rt', rateLine).length) {
            var rtValue = Math.round(ratings.rt) + '%';
            var isFresh = ratings.rt >= 60; // твоя логіка: 60+ свіжий
            var rtIconHtml = isFresh 
                ? SVG_ICONS.rtFresh 
                : ('<img src="' + ICON_BASE_URL + 'RottenBad.png" class="rate--icon-img" style="'+grayscaleCssInline+'">');

            var rtElement = $(
                '<div class="full-start__rate rate--rt">' +
                    '<div>' + rtValue + '</div>' +
                    '<div class="source--name">' + rtIconHtml + '</div>' +
                '</div>'
            );

            // поставимо після Metacritic якщо є, інакше після останнього
            var insertAfterRT = $('.rate--mc', rateLine).length ? $('.rate--mc', rateLine) : lastRate;
            if (insertAfterRT.length) rtElement.insertAfter(insertAfterRT);
            else rateLine.prepend(rtElement);
        }

        // Metacritic (0-100)
        if (ratings.mc > 0 && !$('.rate--mc', rateLine).length) {
            var mcValue = Math.round(ratings.mc) + '%';
            var mcElement = $(
                '<div class="full-start__rate rate--mc">' +
                    '<div>' + mcValue + '</div>' +
                    '<div class="source--name">' + Lampa.Lang.translate('source_mc') + '</div>' +
                '</div>'
            );

            var insertAfterMC = $('.rate--rt', rateLine).length ? $('.rate--rt', rateLine) : lastRate;
            if (insertAfterMC.length) mcElement.insertAfter(insertAfterMC);
            else rateLine.prepend(mcElement);
        }

        // PopcornMeter (0-100), показуємо в загальному рядку
        if (ratings.popcorn > 0 && !$('.rate--popcorn', rateLine).length) {
            var pcValue = Math.round(ratings.popcorn) + '%';
            var pcIconHtml = pngIcon('popcorn.png');
            var pcElement = $(
                '<div class="full-start__rate rate--popcorn">' +
                    '<div>' + pcValue + '</div>' +
                    '<div class="source--name">' + pcIconHtml + '</div>' +
                '</div>'
            );

            var insertAfterPC = $('.rate--rt', rateLine).length ? $('.rate--rt', rateLine)
                              : ($('.rate--mc', rateLine).length ? $('.rate--mc', rateLine) : lastRate);
            if (insertAfterPC.length) pcElement.insertAfter(insertAfterPC);
            else rateLine.append(pcElement);
        }

        // Інші нагороди (Another xx wins)
        if (ratings.awards > 0 && !$('.rate--awards', rateLine).length) {
            var awardsElement = $(
                '<div class="full-start__rate rate--awards rate--gold">' +
                    '<div>' + ratings.awards + '</div>' +
                    '<div class="source--name">' + Lampa.Lang.translate('maxsm_omdb_awards_other') + '</div>' +
                '</div>'
            );
            rateLine.prepend(awardsElement);
        }

        // Emmy
        if (ratings.emmy > 0 && !$('.rate--emmy', rateLine).length) {
            var emmyElement = $(
                '<div class="full-start__rate rate--emmy rate--gold">' +
                    '<div>' + ratings.emmy + '</div>' +
                    '<div class="source--name">' + Lampa.Lang.translate('maxsm_omdb_emmy') + '</div>' +
                '</div>'
            );
            rateLine.prepend(emmyElement);
        }

        // Oscars
        if (ratings.oscars > 0 && !$('.rate--oscars', rateLine).length) {
            var oscarsElement = $(
                '<div class="full-start__rate rate--oscars">' +
                    '<div>' + ratings.oscars + '</div>' +
                    '<div class="source--name">' + Lampa.Lang.translate('maxsm_omdb_oscars') + '</div>' +
                '</div>'
            );
            rateLine.prepend(oscarsElement);
        }
    }

    /**
     * Обчислює і вставляє середній рейтинг:
     * - IMDb і TMDB вже в 0..10
     * - Metacritic і RottenTomatoes у нас 0..100 → ділимо на 10
     * Вага з WEIGHTS.
     * Білий текст біля іконки star.png (з GitHub), колір цифри залишаємо плагіну.
     */
    function calculateAverageRating(finalRatings) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;

        var ratingsForAvg = {
            imdb: finalRatings.imdb || 0,             // 0..10
            tmdb: finalRatings.tmdb || 0,             // 0..10
            mc:   (finalRatings.mc / 10) || 0,        // 0..100 -> 0..10
            rt:   (finalRatings.rt / 10) || 0         // 0..100 -> 0..10
        };

        var totalWeight = 0;
        var weightedSum = 0;
        var ratingsCount = 0;

        Object.keys(ratingsForAvg).forEach(function(key) {
            var val = ratingsForAvg[key];
            if (isFinite(val) && val > 0) {
                weightedSum += val * WEIGHTS[key];
                totalWeight += WEIGHTS[key];
                ratingsCount++;
            }
        });

        $('.rate--avg', rateLine).remove(); // при оновленні, щоб не плодити

        if (ratingsCount > 1 && totalWeight > 0) {
            var averageRating = weightedSum / totalWeight;
            var colorClass = getRatingClass(averageRating);

            var avgElement = $(
                '<div class="full-start__rate rate--avg ' + colorClass + '">' +
                    '<div>' + averageRating.toFixed(1) + '</div>' +
                    '<div class="source--name">' + Lampa.Lang.translate("ratimg_omdb_avg") + '</div>' +
                '</div>'
            );

            // середній рейтинг показуємо на початку ряду
            $('.full-start__rate:first', rateLine).before(avgElement);
        }

        removeLoadingAnimation();
        rateLine.css('visibility', 'visible');
    }

    // ---------------------------------------------------
    // -- КОНТРОЛЕР: ФЕТЧ + ОНОВЛЕННЯ UI --
    // ---------------------------------------------------

    function fetchAdditionalRatings(card) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (rateLine.length) {
            rateLine.css('visibility', 'hidden');
            addLoadingAnimation();
        }

        // попкорн іноді може бути прямо в картці
        var popcornFromCard = card.popcorn_rating || card.audience_score || card.popularity || 0;

        // одночасно тягнемо MDBList (основний) і OMDB (нагороди + фолбеки)
        Promise.all([
            fetchMdbListData(card),
            fetchOmdbData(card)
        ]).then(function(results) {
            var mdbData  = results[0] || {};
            var omdbData = results[1] || {};

            // важливо: MDBList має пріоритет
            var finalRatings = {
                imdb:    mdbData.imdb    || omdbData.imdb    || (isFinite(card.imdb_rating) ? parseFloat(card.imdb_rating) : 0),
                tmdb:    mdbData.tmdb    || (isFinite(card.vote_average) ? parseFloat(card.vote_average) : 0),
                rt:      mdbData.rt      || omdbData.rt      || 0, // 0-100
                mc:      mdbData.mc      || omdbData.mc      || 0, // 0-100
                popcorn: mdbData.popcorn || popcornFromCard  || 0, // 0-100

                ageRating: omdbData.ageRating || null,
                oscars:    omdbData.oscars || 0,
                emmy:      omdbData.emmy   || 0,
                awards:    omdbData.awards || 0
            };

            updateHiddenElements(finalRatings);
            insertRatings(finalRatings);
            calculateAverageRating(finalRatings);

        }).catch(function() {
            removeLoadingAnimation();
            rateLine.css('visibility', 'visible');
        });
    }

    // ---------------------------------------------------
    // -- ІНІЦІАЛІЗАЦІЯ ПЛАГІНА --
    // ---------------------------------------------------

    function startPlugin() {
        if (window.combined_ratings_plugin_fixed) return;
        window.combined_ratings_plugin_fixed = true;

        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                // трошки затримки щоб DOM повністю намалювався
                setTimeout(function() {
                    fetchAdditionalRatings(e.data.movie);
                }, 400);
            }
        });
    }

    if (!window.combined_ratings_plugin_fixed) startPlugin();
})();
