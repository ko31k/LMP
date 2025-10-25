(function() {
    'use strict';

    // ---------------------------------------------------
    // -- КОНФІГУРАЦІЯ ПЛАГІНА --
    // ---------------------------------------------------

    /**
     * ВАШ API КЛЮЧ для MDBList API (отримати на api.mdblist.com)
     * @type {string}
     */
    var MDBLIST_API_KEY = 'm8po461k1zq14sroj2ez5d7um'; // 👈 ЗАМІНІТЬ ЦЕ

    /**
     * API Ключ для OMDB (використовується ТІЛЬКИ для нагород та вікового рейтингу)
     * @type {string}
     */
    var OMDB_API_KEY = window.RATINGS_PLUGIN_TOKENS?.OMDB_API_KEY || '12c9249c';

    /**
     * Встановіть 'true' для чорно-білих іконок, 'false' для кольорових
     * @type {boolean}
     */
    var USE_GRAYSCALE_ICONS = true;

    /**
     * Базовий URL для нових іконок
     * @type {string}
     */
    var ICON_BASE_URL = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';

    // ---------------------------------------------------
    // -- ГЕНЕРАТОР ІКОНОК --
    // ---------------------------------------------------

    var grayscaleFilter = USE_GRAYSCALE_ICONS ? ' style="filter: grayscale(100%);"' : '';

    function getIconHtml(iconFile) {
        return '<img src="' + ICON_BASE_URL + iconFile + '" class="rate--icon-img"' + grayscaleFilter + '>';
    }

    // ---------------------------------------------------
    // -- ЛОКАЛІЗАЦІЯ ТА ІКОНКИ --
    // ---------------------------------------------------

    Lampa.Lang.add({
        ratimg_omdb_avg: {
            ru: 'ИТОГ',
            en: 'TOTAL',
            uk: getIconHtml('star.png'),
            be: 'ВЫНІК'
        },
        loading_dots: {
            ru: 'Загрузка рейтингов',
            en: 'Loading ratings',
            uk: 'Трішки зачекаємо ...',
            be: 'Загрузка рэйтынгаў'
        },
        maxsm_omdb_oscars: {
            ru: 'Оскары',
            en: 'Oscars',
            uk: getIconHtml('oscar.png'),
            be: 'Оскары'
        },
        maxsm_omdb_emmy: {
            ru: getIconHtml('emmy.png'),
            en: getIconHtml('emmy.png'),
            uk: getIconHtml('emmy.png')
        },
        maxsm_omdb_awards_other: {
            ru: getIconHtml('awards.png'),
            en: getIconHtml('awards.png'),
            uk: getIconHtml('awards.png')
        },
        source_imdb: {
            ru: 'IMDB',
            en: 'IMDB',
            uk: getIconHtml('imdb.png'),
            be: 'IMDB'
        },
        source_tmdb: {
            ru: 'TMDB',
            en: 'TMDB',
            uk: getIconHtml('tmdb.png'),
            be: 'TMDB'
        },
        source_mc: {
            ru: 'Metacritic',
            en: 'Metacritic',
            uk: getIconHtml('metacritic.png'),
            be: 'Metacritic'
        }
    });

    // ---------------------------------------------------
    // -- СТИЛІ --
    // ---------------------------------------------------

    var style = "<style id=\"maxsm_omdb_rating\">" +
        ".full-start-new__rate-line {" +
        "visibility: hidden;" +
        "flex-wrap: wrap;" +
        " gap: 0.4em 0;" +
        "}" +
        ".full-start-new__rate-line > * {" +
        "    margin-left: 0 !important;" +
        "    margin-right: 0.6em !important;" +
        "}" +
        ".rate--avg.rating--green  { color: #4caf50; }" +
        ".rate--avg.rating--lime   { color: #3399ff; }" +
        ".rate--avg.rating--orange { color: #ff9933; }" +
        ".rate--avg.rating--red    { color: #f44336; }" +
        ".rate--oscars             { color: gold;    }" +
        ".rate--emmy               { color: gold;    }" +
        ".rate--awards             { color: gold;    }" +
        /* Стилі для нових іконок (14px) */
        ".rate--icon-img {" +
        "    height: 14px;" +
        "    width: auto;" +
        "    display: inline-block;" +
        "    vertical-align: middle;" +
        "    object-fit: contain;" +
        "    transform: scale(1.2);" +
        "}" +
        "</style>";

    Lampa.Template.add('card_css', style);
    $('body').append(Lampa.Template.get('card_css', {}, true));

    var loadingStyles = "<style id=\"maxsm_loading_animation\">" +
        ".loading-dots-container {" +
        "    position: absolute;" +
        "    top: 50%;" +
        "    left: 0;" +
        "    right: 0;" +
        "    text-align: left;" +
        "    transform: translateY(-50%);" +
        "    z-index: 10;" +
        "}" +
        ".full-start-new__rate-line {" +
        "    position: relative;" +
        "}" +
        ".loading-dots {" +
        "    display: inline-flex;" +
        "    align-items: center;" +
        "    gap: 0.4em;" +
        "    color: #ffffff;" +
        "    font-size: 1em;" +
        "    background: rgba(0, 0, 0, 0.3);" +
        "    padding: 0.6em 1em;" +
        "    border-radius: 0.5em;" +
        "}" +
        ".loading-dots__text {" +
        "    margin-right: 1em;" +
        "}" +
        ".loading-dots__dot {" +
        "    width: 0.5em;" +
        "    height: 0.5em;" +
        "    border-radius: 50%;" +
        "    background-color: currentColor;" +
        "    animation: loading-dots-bounce 1.4s infinite ease-in-out both;" +
        "}" +
        ".loading-dots__dot:nth-child(1) { animation-delay: -0.32s; }" +
        ".loading-dots__dot:nth-child(2) { animation-delay: -0.16s; }" +
        "@keyframes loading-dots-bounce {" +
        "    0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }" +
        "    40% { transform: translateY(-0.5em); opacity: 1; }" +
        "}" +
        "</style>";

    Lampa.Template.add('loading_animation_css', loadingStyles);
    $('body').append(Lampa.Template.get('loading_animation_css', {}, true));

    // ---------------------------------------------------
    // -- КОНФІГУРАЦІЯ API ТА КЕШУ --
    // ---------------------------------------------------

    var CACHE_TIME = 3 * 24 * 60 * 60 * 1000; // 3 дня
    var AWARDS_CACHE = 'maxsm_rating_omdb'; // Кеш для OMDB (нагороди, вік)
    var MDBLIST_CACHE = 'maxsm_rating_mdblist'; // Новий кеш для MDBList (рейтинги)
    var ID_MAPPING_CACHE = 'maxsm_rating_id_mapping';

    var AGE_RATINGS = {
        'G': '3+', 'PG': '6+', 'PG-13': '13+', 'R': '17+', 'NC-17': '18+',
        'TV-Y': '0+', 'TV-Y7': '7+', 'TV-G': '3+', 'TV-PG': '6+', 'TV-14': '14+', 'TV-MA': '17+'
    };

    var WEIGHTS = {
        imdb: 0.40,
        tmdb: 0.40,
        mc: 0.10,
        rt: 0.10
    };

    // ---------------------------------------------------
    // -- ЛОГІКА ПАРСИНГУ ТА ЗАВАНТАЖЕННЯ --
    // ---------------------------------------------------

    // Функція парсингу нагород (збережено з вашого `omdb.js`)
    function parseAwards(awardsText) {
        if (typeof awardsText !== 'string') return null;
        var result = { oscars: 0, emmy: 0, awards: 0 };
        var oscarMatch = awardsText.match(/Won (\d+) Oscars?/i);
        if (oscarMatch && oscarMatch[1]) {
            result.oscars = parseInt(oscarMatch[1], 10);
        }
        var emmyMatch = awardsText.match(/Won (\d+) Primetime Emmys?/i);
        if (emmyMatch && emmyMatch[1]) {
            result.emmy = parseInt(emmyMatch[1], 10);
        }
        var otherMatch = awardsText.match(/Another (\d+) wins?/i);
        if (otherMatch && otherMatch[1]) {
            result.awards = parseInt(otherMatch[1], 10);
        }
        if (result.awards === 0) {
            var simpleMatch = awardsText.match(/(\d+) wins?/i);
            if (simpleMatch && simpleMatch[1]) {
                result.awards = parseInt(simpleMatch[1], 10);
            }
        }
        return result;
    }

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

    function getCardType(card) {
        var type = card.media_type || card.type;
        if (type === 'movie' || type === 'tv') return type;
        return card.name || card.original_name ? 'tv' : 'movie';
    }

    function getRatingClass(rating) {
        if (rating >= 8.0) return 'rating--green';
        if (rating >= 6.0) return 'rating--lime';
        if (rating >= 5.5) return 'rating--orange';
        return 'rating--red';
    }

    // ---------------------------------------------------
    // -- ОСНОВНА ФУНКЦІЯ (КОНТРОЛЕР) --
    // ---------------------------------------------------
    function fetchAdditionalRatings(card) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (rateLine.length) {
            rateLine.css('visibility', 'hidden');
            addLoadingAnimation();
        }

        // Перевіряємо, чи є ключ MDBList
        if (!MDBLIST_API_KEY || MDBLIST_API_KEY === 'ВАШ_API_КЛЮЧ_СЮДИ') {
            console.error('OMDB Ratings: MDBList API ключ не встановлено!');
            removeLoadingAnimation();
            rateLine.css('visibility', 'visible');
            return;
        }

        // Одразу беремо Popcorn з картки
        var popcornFromCard = card.popcorn_rating || null;

        // Запускаємо обидва запити паралельно
        Promise.all([
            fetchOmdbData(card),     // Для нагород та віку
            fetchMdbListData(card)   // Для рейтингів
        ]).then(function(results) {
            var omdbData = results[0] || {};
            var mdbData = results[1] || {};

            // Збираємо фінальний об'єкт з пріоритетами
            var finalRatings = {
                // З MDBList (пріоритет) або OMDB або картки
                imdb: mdbData.imdb || omdbData.imdb || card.imdb_rating || 0,
                tmdb: mdbData.tmdb || card.vote_average || 0,
                rt: mdbData.rt || omdbData.rt || 0, // MDBList дає 0-100
                mc: mdbData.mc || omdbData.mc || 0, // MDBList дає 0-100
                
                // З картки
                popcorn: popcornFromCard,

                // З OMDB
                ageRating: omdbData.ageRating,
                oscars: omdbData.oscars,
                emmy: omdbData.emmy,
                awards: omdbData.awards
            };

            // Оновлюємо UI
            insertRatings(finalRatings);
            updateHiddenElements(finalRatings);
            calculateAverageRating(finalRatings);

        }).catch(function(error) {
            console.error("OMDB Ratings: Помилка завантаження", error);
            removeLoadingAnimation();
            rateLine.css('visibility', 'visible');
        });
    }

    // ---------------------------------------------------
    // -- ЗАПИТ 1: MDBList (для рейтингів) --
    // ---------------------------------------------------
    function fetchMdbListData(card) {
        return new Promise(function(resolve) {
            var cardType = getCardType(card) === 'tv' ? 'show' : 'movie';
            var cacheKey = cardType + '_' + card.id;
            var cachedData = getCache(MDBLIST_CACHE, cacheKey);

            if (cachedData) return resolve(cachedData);
            
            var url = "https://api.mdblist.com/tmdb/" + cardType + "/" + card.id + "?apikey=" + MDBLIST_API_KEY;

            new Lampa.Reguest().silent(url, function (data) {
                var ratings = {
                    imdb: 0,
                    tmdb: 0,
                    rt: 0,
                    mc: 0
                };
                
                if (data && data.ratings && data.ratings.length) {
                    data.ratings.forEach(function(r) {
                        if (r.source === 'imdb') ratings.imdb = parseFloat(r.value);
                        if (r.source === 'tmdb') ratings.tmdb = parseFloat(r.value);
                        if (r.source === 'tomatoes') ratings.rt = parseFloat(r.value); // 0-100
                        if (r.source === 'metacritic') ratings.mc = parseFloat(r.value); // 0-100
                    });
                }
                
                setCache(MDBLIST_CACHE, cacheKey, ratings);
                resolve(ratings);

            }, function() {
                resolve({}); // Повернути порожній об'єкт у разі помилки
            });
        });
    }

    // ---------------------------------------------------
    // -- ЗАПИТ 2: OMDB (для нагород) --
    // ---------------------------------------------------
    function fetchOmdbData(card) {
        return new Promise(function(resolve) {
            getImdbId(card, function(imdbId) {
                if (!imdbId) return resolve({});

                var cardType = getCardType(card);
                var cacheKey = cardType + '_' + imdbId;
                var cachedData = getCache(AWARDS_CACHE, cacheKey);

                if (cachedData) return resolve(cachedData);

                var typeParam = (cardType === 'tv') ? '&type=series' : '';
                var url = 'https://www.omdbapi.com/?apikey=' + OMDB_API_KEY + '&i=' + imdbId + typeParam;

                new Lampa.Reguest().silent(url, function (data) {
                    if (data && data.Response === 'True') {
                        var parsedAwards = parseAwards(data.Awards || '');
                        var result = {
                            rt: extractOmdbRating(data.Ratings, 'Rotten Tomatoes'), // 0-10
                            mc: extractOmdbRating(data.Ratings, 'Metacritic'), // 0-10
                            imdb: data.imdbRating && data.imdbRating !== "N/A" ? parseFloat(data.imdbRating) : 0, // 0-10
                            ageRating: data.Rated || null,
                            oscars: parsedAwards.oscars,
                            emmy: parsedAwards.emmy,
                            awards: parsedAwards.awards
                        };
                        setCache(AWARDS_CACHE, cacheKey, result);
                        resolve(result);
                    } else {
                        resolve({});
                    }
                }, function() {
                    resolve({});
                });
            });
        });
    }

    // ---------------------------------------------------
    // -- ДОПОМІЖНІ ФУНКЦІЇ (КЕШ, ID, ПАРСИНГ) --
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
    
    function getImdbId(card, callback) {
        if (card.imdb_id) return callback(card.imdb_id);
        
        var cardType = getCardType(card);
        var cacheKey = cardType + '_' + card.id;
        var cachedId = getCache(ID_MAPPING_CACHE, cacheKey);
        
        if (cachedId) return callback(cachedId);

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

    function extractOmdbRating(ratings, source) {
        if (!ratings || !Array.isArray(ratings)) return 0;
        for (var i = 0; i < ratings.length; i++) {
            if (ratings[i].Source === source) {
                try {
                    return source === 'Rotten Tomatoes' 
                        ? parseFloat(ratings[i].Value.replace('%', '')) // 0-100
                        : parseFloat(ratings[i].Value.split('/')[0]); // 0-100
                } catch(e) { return 0; }
            }
        }
        return 0;
    }

    // ---------------------------------------------------
    // -- ОНОВЛЕННЯ UI --
    // ---------------------------------------------------

    /**
     * Оновлює приховані елементи (IMDB, TMDB, Вік)
     */
    function updateHiddenElements(ratings) {
        var render = Lampa.Activity.active().activity.render();
        if (!render || !render[0]) return;

        // Віковий рейтинг
        var pgElement = $('.full-start__pg.hide', render);
        if (pgElement.length && ratings.ageRating) {
            var invalidRatings = ['N/A', 'Not Rated', 'Unrated'];
            if (invalidRatings.indexOf(ratings.ageRating) === -1) {
                var localizedRating = AGE_RATINGS[ratings.ageRating] || ratings.ageRating;
                pgElement.removeClass('hide').text(localizedRating);
            }
        }

        // IMDB
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

    /**
     * Вставляє нові елементи рейтингу (RT, MC, Popcorn, Нагороди)
     */
    function insertRatings(ratings) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;

        var lastRate = $('.full-start__rate:last', rateLine);

        // Rotten Tomatoes (з MDBList, 0-100)
        if (ratings.rt > 0 && !$('.rate--rt', rateLine).length) {
            var rtValue = Math.round(ratings.rt) + '%';
            var rtIconFile = (ratings.rt < 50) ? 'RottenBad.png' : 'RottenGood.png';
            var rtIconHtml = getIconHtml(rtIconFile);

            var rtElement = $(
                '<div class="full-start__rate rate--rt">' +
                    '<div>' + rtValue + '</div>' +
                    '<div class="source--name">' + rtIconHtml + '</div>' +
                '</div>'
            );
            if (lastRate.length) rtElement.insertAfter(lastRate);
            else rateLine.prepend(rtElement);
        }

        // Metacritic (з MDBList, 0-100)
        if (ratings.mc > 0 && !$('.rate--mc', rateLine).length) {
            var mcValue = Math.round(ratings.mc) + '%';
            var mcElement = $(
                '<div class="full-start__rate rate--mc">' +
                    '<div>' + mcValue + '</div>' +
                    '<div class="source--name"></div>' +
                '</div>'
            );
            mcElement.find('.source--name').html(Lampa.Lang.translate('source_mc'));
            var insertAfterMC = $('.rate--rt', rateLine).length ? $('.rate--rt', rateLine) : lastRate;
            if (insertAfterMC.length) mcElement.insertAfter(insertAfterMC);
            else rateLine.prepend(mcElement);
        }
        
        // PopcornMeter (з картки)
        if (ratings.popcorn > 0 && !$('.rate--popcorn', rateLine).length) {
            var pcValue = Math.round(ratings.popcorn) + '%';
            var pcIconHtml = getIconHtml('popcorn.png');
            var pcElement = $(
                '<div class="full-start__rate rate--popcorn">' +
                    '<div>' + pcValue + '</div>' +
                    '<div class="source--name">' + pcIconHtml + '</div>' +
                '</div>'
            );
            var insertAfterPopcorn = $('.rate--mc', rateLine).length ? $('.rate--mc', rateLine) : 
                                     ($('.rate--rt', rateLine).length ? $('.rate--rt', rateLine) : lastRate);
            if (insertAfterPopcorn.length) pcElement.insertAfter(insertAfterPopcorn);
            else rateLine.prepend(pcElement);
        }

        // Нагороди (з OMDB)
        if (ratings.awards > 0 && !$('.rate--awards', rateLine).length) {
            var awardsElement = $(
                '<div class="full-start__rate rate--awards rate--gold">' +
                    '<div>' + ratings.awards + '</div>' +
                    '<div class="source--name"></div>' +
                '</div>'
            );
            awardsElement.find('.source--name')
                .html(Lampa.Lang.translate("maxsm_omdb_awards_other"))
                .addClass('rate--icon');
            rateLine.prepend(awardsElement);
        }

        if (ratings.emmy > 0 && !$('.rate--emmy', rateLine).length) {
            var emmyElement = $(
                '<div class="full-start__rate rate--emmy rate--gold">' +
                    '<div>' + ratings.emmy + '</div>' +
                    '<div class="source--name"></div>' +
                '</div>'
            );
            emmyElement.find('.source--name')
                .html(Lampa.Lang.translate("maxsm_omdb_emmy"))
                .addClass('rate--icon');
            rateLine.prepend(emmyElement);
        }

        if (ratings.oscars > 0 && !$('.rate--oscars', rateLine).length) {
            var oscarsElement = $(
                '<div class="full-start__rate rate--oscars">' +
                    '<div>' + ratings.oscars + '</div>' +
                    '<div class="source--name"></div>' +
                '</div>'
            );
            oscarsElement.find('.source--name').html(Lampa.Lang.translate("maxsm_omdb_oscars"));
            rateLine.prepend(oscarsElement);
        }
    }
    
    /**
     * Розраховує середній рейтинг
     */
    function calculateAverageRating(finalRatings) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;
    
        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;
    
        // Конвертуємо рейтинги 0-100 в 0-10 для розрахунку
        var ratings = {
            imdb: finalRatings.imdb || 0, // 0-10
            tmdb: finalRatings.tmdb || 0, // 0-10
            mc: (finalRatings.mc / 10) || 0,  // 0-100 -> 0-10
            rt: (finalRatings.rt / 10) || 0   // 0-100 -> 0-10
        };
    
        var totalWeight = 0;
        var weightedSum = 0;
        var ratingsCount = 0;
        
        for (var key in ratings) {
            if (ratings.hasOwnProperty(key) && !isNaN(ratings[key]) && ratings[key] > 0) {
                weightedSum += ratings[key] * WEIGHTS[key];
                totalWeight += WEIGHTS[key];
                ratingsCount++;
            }
        }
    
        $('.rate--avg', rateLine).remove();
    
        if (ratingsCount > 1 && totalWeight > 0) {
            var averageRating = weightedSum / totalWeight;
            var colorClass = getRatingClass(averageRating);
            
            var avgElement = $(
                '<div class="full-start__rate rate--avg ' + colorClass + '">' +
                    '<div>' + averageRating.toFixed(1) + '</div>' +
                    '<div class="source--name">' + Lampa.Lang.translate("ratimg_omdb_avg") + '</div>' +
                '</div>'
            );
            
            $('.full-start__rate:first', rateLine).before(avgElement);
        }
        
        removeLoadingAnimation();
        rateLine.css('visibility', 'visible');
    }

    // ---------------------------------------------------
    // -- ІНІЦІАЛІЗАЦІЯ --
    // ---------------------------------------------------
    function startPlugin() {
        window.combined_ratings_plugin = true;
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    fetchAdditionalRatings(e.data.movie);
                }, 500);
            }
        });
    }
    
    if (!window.combined_ratings_plugin) startPlugin();
})();
