(function() {
    'use strict';

    // ---------------------------------------------------
    // -- КОНФІГУРАЦІЯ ІКОНОК --
    // ---------------------------------------------------
    
    /** * Встановіть 'true' для чорно-білих іконок, 'false' для кольорових
     * @type {boolean} 
     */
    var USE_GRAYSCALE_ICONS = true; 
    
    /**
     * Базовий URL для нових іконок
     * @type {string}
     */
    var ICON_BASE_URL = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';
    
    /**
     * Генерує рядок стилю для фільтра (grayscale)
     * @type {string}
     */
    var grayscaleFilter = USE_GRAYSCALE_ICONS ? ' style="filter: grayscale(100%);"' : '';
    
    /**
     * Допоміжна функція для генерації HTML-коду іконки
     * @param {string} iconFile - Назва файлу іконки (напр., 'imdb.png')
     * @returns {string} - HTML-рядок <img>
     */
    function getIconHtml(iconFile) {
        return '<img src="' + ICON_BASE_URL + iconFile + '" class="rate--icon-img"' + grayscaleFilter + '>';
    }

    // ---------------------------------------------------
    // -- ЛОКАЛІЗАЦІЯ ТА ІКОНКИ --
    // ---------------------------------------------------
    // SVG іконки видалено, оскільки ми використовуємо PNG
    
    Lampa.Lang.add({
        ratimg_omdb_avg: {
            ru: 'ИТОГ',
            en: 'TOTAL',
            uk: getIconHtml('star.png'), // ЗАМІНЕНО: Іконка середнього рейтингу
            be: 'ВЫНІК',
            pt: 'TOTAL',
            zh: '总评',
            he: 'סה"כ',
            cs: 'VÝSLEDEK',
            bg: 'РЕЗУЛТАТ'
        },
        loading_dots: {
            ru: 'Загрузка рейтингов',
            en: 'Loading ratings',
            uk: 'Трішки зачекаємо ...',
            be: 'Загрузка рэйтынгаў',
            pt: 'Carregando classificações',
            zh: '加载评分',
            he: 'טוען דירוגים',
            cs: 'Načítání hodnocení',
            bg: 'Зареждане на рейтинги'
        },
        maxsm_omdb_oscars: { 
            ru: 'Оскары',
            en: 'Oscars',
            uk: getIconHtml('oscar.png'), // ЗАМІНЕНО: Іконка Оскара
            be: 'Оскары',
            pt: 'Oscars',
            zh: '奥ска奖',
            he: 'אוסקר',
            cs: 'Oscary',
            bg: 'Оскари'
        },
        // Emmy
        maxsm_omdb_emmy: {
            ru: getIconHtml('emmy.png'), // ЗАМІНЕНО: Іконка Emmy
            en: getIconHtml('emmy.png'), // ЗАМІНЕНО: Іконка Emmy
            uk: getIconHtml('emmy.png')  // ЗАМІНЕНО: Іконка Emmy
        },
        // Інші нагороди
        maxsm_omdb_awards_other: {
            ru: getIconHtml('awards.png'), // ЗАМІНЕНО: Іконка інших нагород
            en: getIconHtml('awards.png'), // ЗАМІНЕНО: Іконка інших нагород
            uk: getIconHtml('awards.png')  // ЗАМІНЕНО: Іконка інших нагород
        },
        source_imdb: {
            ru: 'IMDB',
            en: 'IMDB',
            uk: getIconHtml('imdb.png'), // ЗАМІНЕНО: Іконка IMDb
            be: 'IMDB',
            pt: 'IMDB',
            zh: 'IMDB',
            he: 'IMDB',
            cs: 'IMDB',
            bg: 'IMDB'
        },
        source_tmdb: {
            ru: 'TMDB',
            en: 'TMDB',
            uk: getIconHtml('tmdb.png'), // ЗАМІНЕНО: Іконка TMDB
            be: 'TMDB',
            pt: 'TMDB',
            zh: 'TMDB',
            he: 'TMDB',
            cs: 'TMDB',
            bg: 'TMDB'
        },
        // 'source_rt' видалено, оскільки логіка іконки тепер у 'insertRatings'
        source_mc: {
            ru: 'Metacritic',
            en: 'Metacritic',
            uk: getIconHtml('metacritic.png'), // ЗАМІНЕНО: Іконка Metacritic
            be: 'Metacritic',
            pt: 'Metacritic',
            zh: 'Metacritic',
            he: 'Metacritic',
            cs: 'Metacritic',
            bg: 'Metacritic'
        }
        // 'source_popcorn' не потрібен, оскільки іконка додається динамічно
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

    /* ЗАМІНЕНО: Блок стилів для нових іконок */
    ".rate--icon-img {" +
    "    height: 14px;" +
    "    width: auto;" +
    "    display: inline-block;" +
    "    vertical-align: middle;" +
    "    object-fit: contain;" +
    "    transform: scale(1.2);" +
    "}" +
    /* Кінець заміненого блоку */

    "</style>";
    
    Lampa.Template.add('card_css', style);
    $('body').append(Lampa.Template.get('card_css', {}, true));
    
    // Обновленные стили с гарантированной видимостью
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
        ".loading-dots__dot:nth-child(1) {" +
        "    animation-delay: -0.32s;" +
        "}" +
        ".loading-dots__dot:nth-child(2) {" +
        "    animation-delay: -0.16s;" +
        "}" +
        "@keyframes loading-dots-bounce {" +
        "    0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }" +
        "    40% { transform: translateY(-0.5em); opacity: 1; }" +
        "}" +
        "</style>";

    Lampa.Template.add('loading_animation_css', loadingStyles);
    $('body').append(Lampa.Template.get('loading_animation_css', {}, true));
    
    // Конфигурация
    var CACHE_TIME = 3 * 24 * 60 * 60 * 1000; // 3 дня
    var OMDB_CACHE = 'maxsm_rating_omdb';
    var ID_MAPPING_CACHE = 'maxsm_rating_id_mapping';
    var OMDB_API_KEY = window.RATINGS_PLUGIN_TOKENS?.OMDB_API_KEY || '12c9249c';
    
    // Словарь возрастных рейтингов
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
    
    // Весовые коэффициенты (PopcornMeter не додано до середнього)
    var WEIGHTS = {
        imdb: 0.40,
        tmdb: 0.40,
        mc: 0.10,
        rt: 0.10
    };
    
    // Функція парсингу нагород (залишено без змін, як ви просили)
    function parseAwards(awardsText) {
        if (typeof awardsText !== 'string') return null;
        
        var result = {
            oscars: 0,
            emmy: 0,
            awards: 0
        };
        
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
    
    // Вспомогательные функции
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
    // -- ОСНОВНА ЛОГІКА --
    // ---------------------------------------------------
    function fetchAdditionalRatings(card) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;
    
        var normalizedCard = {
            id: card.id,
            imdb_id: card.imdb_id || card.imdb || null,
            title: card.title || card.name || '',
            original_title: card.original_title || card.original_name || '',
            type: getCardType(card),
            release_date: card.release_date || card.first_air_date || ''
        };
    
        var rateLine = $('.full-start-new__rate-line', render);
        if (rateLine.length) {
            rateLine.css('visibility', 'hidden');
            addLoadingAnimation();
        }
        
        var cacheKey = normalizedCard.type + '_' + (normalizedCard.imdb_id || normalizedCard.id);
        var cachedData = getOmdbCache(cacheKey);
        
        var ratingsData = {};
        // ДОДАНО: Отримуємо PopcornMeter з картки (як у 'іншому' плагіні)
        ratingsData.popcorn = card.popcorn_rating || null;
        
        // Статусы рейтингов
        var imdbElement = $('.rate--imdb:not(.hide)', render);
        
        if (imdbElement.length > 0 && !!imdbElement.find('> div').eq(0).text().trim()) {
            processNextStep();
            return;
        }
                
        // 1. Обрабатываем кеш OMDB
        if (cachedData) {
            ratingsData.rt = cachedData.rt;
            ratingsData.mc = cachedData.mc;
            ratingsData.imdb = cachedData.imdb;
            ratingsData.ageRating = cachedData.ageRating;
            ratingsData.oscars = cachedData.oscars;
            ratingsData.emmy = cachedData.emmy;
            ratingsData.awards = cachedData.awards;
            ratingsData.popcorn = cachedData.popcorn; // ДОДАНО: Отримуємо Popcorn з кешу
            updateUI();
        } else if (normalizedCard.imdb_id) {
            fetchOmdbRatings(normalizedCard, cacheKey, function(omdbData) {
                if (omdbData) {
                    ratingsData.rt = omdbData.rt;
                    ratingsData.mc = omdbData.mc;
                    ratingsData.imdb = omdbData.imdb;
                    ratingsData.ageRating = omdbData.ageRating;
                    ratingsData.oscars = omdbData.oscars;
                    ratingsData.emmy = omdbData.emmy;
                    ratingsData.awards = omdbData.awards;
                    
                    omdbData.popcorn = ratingsData.popcorn; // ДОДАНО: Додаємо Popcorn до даних для кешування
                    saveOmdbCache(cacheKey, omdbData);
                }
                updateUI();
            });
        } else {
            getImdbIdFromTmdb(normalizedCard.id, normalizedCard.type, function(newImdbId) {
                if (newImdbId) {
                    normalizedCard.imdb_id = newImdbId;
                    cacheKey = normalizedCard.type + '_' + newImdbId;
                    fetchOmdbRatings(normalizedCard, cacheKey, function(omdbData) {
                        if (omdbData) {
                            ratingsData.rt = omdbData.rt;
                            ratingsData.mc = omdbData.mc;
                            ratingsData.imdb = omdbData.imdb;
                            ratingsData.ageRating = omdbData.ageRating;
                            ratingsData.oscars = omdbData.oscars;
                            ratingsData.emmy = omdbData.emmy;
                            ratingsData.awards = omdbData.awards;
                            
                            omdbData.popcorn = ratingsData.popcorn; // ДОДАНО: Додаємо Popcorn до даних для кешування
                            saveOmdbCache(cacheKey, omdbData);
                        }
                        updateUI();
                    });
                } else {
                    updateUI();
                }
            });
        }
        
        function updateUI() {
            // Вставляем рейтинги RT, MC та Popcorn
            insertRatings(ratingsData.rt, ratingsData.mc, ratingsData.oscars, ratingsData.emmy, ratingsData.awards, ratingsData.popcorn);
            
            // Обновляем скрытые элементы (IMDb, TMDB, Age)
            updateHiddenElements(ratingsData);
            
            // Считаем и отображаем средний рейтинг
            calculateAverageRating();
        }
    }

    // ---------------------------------------------------
    // -- РОБОТА З КЕШЕМ --
    // ---------------------------------------------------
    function getOmdbCache(key) {
        var cache = Lampa.Storage.get(OMDB_CACHE) || {};
        var item = cache[key];
        return item && (Date.now() - item.timestamp < CACHE_TIME) ? item : null;
    }

    function saveOmdbCache(key, data) {
        var hasValidRating = (
            (data.rt && data.rt !== "N/A") ||
            (data.mc && data.mc !== "N/A") ||
            (data.imdb && data.imdb !== "N/A")
        );
        
        var hasValidAgeRating = (
            data.ageRating && 
            data.ageRating !== "N/A" && 
            data.ageRating !== "Not Rated"
        );
        
        var hasOscars = typeof data.oscars === 'number' && data.oscars > 0;
        var hasEmmy = typeof data.emmy === 'number' && data.emmy > 0;
        var hasAwards = typeof data.awards === 'number' && data.awards > 0;
        var hasPopcorn = typeof data.popcorn === 'number' && data.popcorn > 0; // ДОДАНО: Перевірка Popcorn

        // ДОДАНО: 'hasPopcorn' в умову
        if (!hasValidRating && !hasValidAgeRating && !hasOscars && !hasEmmy && !hasAwards && !hasPopcorn) return;
        
        var cache = Lampa.Storage.get(OMDB_CACHE) || {};
        cache[key] = { 
            rt: data.rt,
            mc: data.mc,
            imdb: data.imdb,
            ageRating: data.ageRating,
            oscars: data.oscars || null,
            emmy: data.emmy || null,
            awards: data.awards || null,
            popcorn: data.popcorn || null, // ДОДАНО: Збереження Popcorn в кеш
            timestamp: Date.now() 
        };
        Lampa.Storage.set(OMDB_CACHE, cache);
    }
    
    function getImdbIdFromTmdb(tmdbId, type, callback) {
        if (!tmdbId) return callback(null);
        
        var cleanType = type === 'movie' ? 'movie' : 'tv';
        var cacheKey = cleanType + '_' + tmdbId;
        var cache = Lampa.Storage.get(ID_MAPPING_CACHE) || {};
        
        if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < CACHE_TIME)) {
            return callback(cache[cacheKey].imdb_id);
        }
    
        var url = 'https://api.themoviedb.org/3/' + cleanType + '/' + tmdbId + '/external_ids?api_key=' + Lampa.TMDB.key();
    
        var makeRequest = function(url, success, error) {
            new Lampa.Reguest().silent(url, success, function() {
                new Lampa.Reguest().native(url, function(data) {
                    try {
                        success(typeof data === 'string' ? JSON.parse(data) : data);
                    } catch(e) {
                        error();
                    }
                }, error, false, { dataType: 'json' });
            });
        };
    
        makeRequest(url, function(data) {
            if (data && data.imdb_id) {
                cache[cacheKey] = {
                    imdb_id: data.imdb_id,
                    timestamp: Date.now()
                };
                Lampa.Storage.set(ID_MAPPING_CACHE, cache);
                callback(data.imdb_id);
            } else {
                if (cleanType === 'tv') {
                    var altUrl = 'https://api.themoviedb.org/3/tv/' + tmdbId + '?api_key=' + Lampa.TMDB.key();
                    makeRequest(altUrl, function(altData) {
                        var imdbId = (altData && altData.external_ids && altData.external_ids.imdb_id) || null;
                        if (imdbId) {
                            cache[cacheKey] = {
                                imdb_id: imdbId,
                                timestamp: Date.now()
                            };
                            Lampa.Storage.set(ID_MAPPING_CACHE, cache);
                        }
                        callback(imdbId);
                    }, function() {
                        callback(null);
                    });
                } else {
                    callback(null);
                }
            }
        }, function() {
            callback(null);
        });
    }

    function fetchOmdbRatings(card, cacheKey, callback) {
        if (!card.imdb_id) {
            callback(null);
            return;
        }

        var typeParam = (card.type === 'tv') ? '&type=series' : '';
        var url = 'https://www.omdbapi.com/?apikey=' + OMDB_API_KEY + '&i=' + card.imdb_id + typeParam;

        new Lampa.Reguest().silent(url, function (data) {
            if (data && data.Response === 'True' && (data.Ratings || data.imdbRating)) {
                var parsedAwards = parseAwards(data.Awards || '');
                callback({
                    rt: extractRating(data.Ratings, 'Rotten Tomatoes'),
                    mc: extractRating(data.Ratings, 'Metacritic'),
                    imdb: data.imdbRating || null,
                    ageRating: data.Rated || null,
                    oscars: parsedAwards.oscars,
                    emmy: parsedAwards.emmy,
                    awards: parsedAwards.awards
                    // Popcorn додається на рівні 'fetchAdditionalRatings'
                });
            } else {
                callback(null);
            }
        }, function() {
            callback(null);
        });
    }
    
    // ---------------------------------------------------
    // -- ОНОВЛЕННЯ UI --
    // ---------------------------------------------------
    function updateHiddenElements(ratings) {
        var render = Lampa.Activity.active().activity.render();
        if (!render || !render[0]) return;

        // Оновлення вікового рейтингу
        var pgElement = $('.full-start__pg.hide', render);
        if (pgElement.length && ratings.ageRating) {
            var invalidRatings = ['N/A', 'Not Rated', 'Unrated'];
            var isValid = invalidRatings.indexOf(ratings.ageRating) === -1;
            
            if (isValid) {
                var localizedRating = AGE_RATINGS[ratings.ageRating] || ratings.ageRating;
                pgElement.removeClass('hide').text(localizedRating);
            }
        }

        // **Оновлення IMDB** (використовує іконку з Lampa.Lang)
        var imdbContainer = $('.rate--imdb', render);
        if (imdbContainer.length) {
            var imdbDivs = imdbContainer.children('div');

            if (ratings.imdb && !isNaN(ratings.imdb)) {
                imdbContainer.removeClass('hide');
                if (imdbDivs.length >= 2) {
                    imdbDivs.eq(0).text(parseFloat(ratings.imdb).toFixed(1));
                    imdbDivs.eq(1).html(Lampa.Lang.translate('source_imdb'));
                }
            } else {
                imdbContainer.addClass('hide');
            }
        }

        // **Оновлення TMDB** (використовує іконку з Lampa.Lang)
        var tmdbContainer = $('.rate--tmdb', render);
        if (tmdbContainer.length) {
            tmdbContainer.find('> div:nth-child(2)').html(Lampa.Lang.translate('source_tmdb'));
        }
    }
    
    function extractRating(ratings, source) {
        if (!ratings || !Array.isArray(ratings)) return null;
        
        for (var i = 0; i < ratings.length; i++) {
            if (ratings[i].Source === source) {
                try {
                    return source === 'Rotten Tomatoes' 
                        ? parseFloat(ratings[i].Value.replace('%', '')) / 10
                        : parseFloat(ratings[i].Value.split('/')[0]) / 10;
                } catch(e) {
                    console.error('Помилка при парсингу рейтингу:', e);
                    return null;
                }
            }
        }
        return null;
    }
    
    // ЗАМІНЕНО: Функція вставки рейтингів (додано Popcorn, змінено RT)
    function insertRatings(rtRating, mcRating, oscars, emmy, awards, popcornRating) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;

        var lastRate = $('.full-start__rate:last', rateLine);

        // Rotten Tomatoes (ЗАМІНЕНО: логіка іконок)
        if (rtRating && !isNaN(rtRating) && !$('.rate--rt', rateLine).length) {
            var rtValue = rtRating.toFixed(1);
            // Логіка для іконки: rtRating (0-10) * 10 = 0-100. < 50 = 'поганий'
            var rtIconFile = (rtRating * 10 < 50) ? 'RottenBad.png' : 'RottenGood.png';
            var rtIconHtml = getIconHtml(rtIconFile);

            var rtElement = $(
                '<div class="full-start__rate rate--rt">' +
                    '<div>' + rtValue + '</div>' +
                    '<div class="source--name">' + rtIconHtml + '</div>' + // Вставляємо HTML іконки
                '</div>'
            );
            if (lastRate.length) rtElement.insertAfter(lastRate);
            else rateLine.prepend(rtElement);
        }

        // Metacritic (використовує іконку з Lampa.Lang)
        if (mcRating && !isNaN(mcRating) && !$('.rate--mc', rateLine).length) {
            var mcValue = mcRating.toFixed(1);
            var insertAfter = $('.rate--rt', rateLine).length ? $('.rate--rt', rateLine) : lastRate;
            var mcElement = $(
                '<div class="full-start__rate rate--mc">' +
                    '<div>' + mcValue + '</div>' +
                    '<div class="source--name"></div>' +
                '</div>'
            );
            mcElement.find('.source--name').html(Lampa.Lang.translate('source_mc'));
            if (insertAfter.length) mcElement.insertAfter(insertAfter);
            else rateLine.prepend(mcElement);
        }
        
        // ДОДАНО: PopcornMeter
        if (popcornRating && !isNaN(popcornRating) && popcornRating > 0 && !$('.rate--popcorn', rateLine).length) {
            var pcValue = Math.round(popcornRating) + '%';
            var pcIconHtml = getIconHtml('popcorn.png');
            var pcElement = $(
                '<div class="full-start__rate rate--popcorn">' +
                    '<div>' + pcValue + '</div>' +
                    '<div class="source--name">' + pcIconHtml + '</div>' +
                '</div>'
            );
            
            // Вставляємо після Metacritic або Rotten Tomatoes
            var insertAfterPopcorn = $('.rate--mc', rateLine).length ? $('.rate--mc', rateLine) : 
                                     ($('.rate--rt', rateLine).length ? $('.rate--rt', rateLine) : lastRate);

            if (insertAfterPopcorn.length) pcElement.insertAfter(insertAfterPopcorn);
            else rateLine.prepend(pcElement);
        }


        // Нагороди (в порядку: Awards, Emmy, Oscars - як в RT+)
        // 🏆 Інші нагороди (використовує іконку з Lampa.Lang)
        if (awards && !isNaN(awards) && awards > 0 && !$('.rate--awards', rateLine).length) {
            var awardsElement = $(
                '<div class="full-start__rate rate--awards rate--gold">' +
                    '<div>' + awards + '</div>' +
                    '<div class="source--name"></div>' +
                '</div>'
            );
            awardsElement.find('.source--name')
                .html(Lampa.Lang.translate("maxsm_omdb_awards_other"))
                .addClass('rate--icon')
                .attr('title', Lampa.Lang.translate("maxsm_omdb_awards")); // 'title' залишаємо текстовим
            rateLine.prepend(awardsElement);
        }

        // ⭐ Emmy (використовує іконку з Lampa.Lang)
        if (emmy && !isNaN(emmy) && emmy > 0 && !$('.rate--emmy', rateLine).length) {
            var emmyElement = $(
                '<div class="full-start__rate rate--emmy rate--gold">' +
                    '<div>' + emmy + '</div>' +
                    '<div class="source--name"></div>' +
                '</div>'
            );
            emmyElement.find('.source--name')
                .html(Lampa.Lang.translate("maxsm_omdb_emmy"))
                .addClass('rate--icon')
                .attr('title', Lampa.Lang.translate("maxsm_omdb_emmy")); // 'title' залишаємо текстовим
            rateLine.prepend(emmyElement);
        }

        // 🎖️ Oscars (використовує іконку з Lampa.Lang)
        if (oscars && !isNaN(oscars) && oscars > 0 && !$('.rate--oscars', rateLine).length) {
            var oscarsElement = $(
                '<div class="full-start__rate rate--oscars">' +
                    '<div>' + oscars + '</div>' +
                    '<div class="source--name"></div>' +
                '</div>'
            );

            oscarsElement.find('.source--name').html(Lampa.Lang.translate("maxsm_omdb_oscars"));
            rateLine.prepend(oscarsElement);
        }
    }
    
    function calculateAverageRating() {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;
    
        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;
    
        var ratings = {
            imdb: parseFloat($('.rate--imdb div:first', rateLine).text()) || 0,
            tmdb: parseFloat($('.rate--tmdb div:first', rateLine).text()) || 0,
            mc: parseFloat($('.rate--mc div:first', rateLine).text()) || 0,
            rt: parseFloat($('.rate--rt div:first', rateLine).text()) || 0
            // Popcorn не враховується у середньому
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

    // Инициализация плагина
    function startPlugin() {
        window.combined_ratings_plugin = true;
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    // Передаємо повний об'єкт 'e.data.movie'
                    fetchAdditionalRatings(e.data.movie); 
                }, 500);
            }
        });
    }
    
    if (!window.combined_ratings_plugin) startPlugin();
})();
