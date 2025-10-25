(function() {
    'use strict';

    // Конфігурація
    var USE_GRAYSCALE_ICONS = false; // true - чорно-білі іконки, false - кольорові
    
    // URL для іконок з GitHub
    var ICON_BASE_URL = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';
    
    Lampa.Lang.add({
        ratimg_omdb_avg: {
            ru: 'ИТОГ',
            en: 'TOTAL', 
            uk: 'СЕРЕДНІЙ',
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
            uk: 'Завантаження рейтингів',
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
            uk: 'Оскари',
            be: 'Оскары',
            pt: 'Oscars',
            zh: '奥斯卡奖',
            he: 'אוסקר',
            cs: 'Oscary',
            bg: 'Оскари'
        },
        maxsm_omdb_emmy: { 
            ru: 'Эмми',
            en: 'Emmy',
            uk: 'Еммі',
            be: 'Эммі',
            pt: 'Emmy',
            zh: '艾美奖',
            he: 'אמי',
            cs: 'Emmy',
            bg: 'Еми'
        },
        maxsm_omdb_awards: {
            ru: 'Награды',
            en: 'Awards',
            uk: 'Нагороди',
            be: 'Узнагароды',
            pt: 'Prêmios',
            zh: '奖项',
            he: 'פרסים',
            cs: 'Ocenění',
            bg: 'Награди'
        },
        source_imdb: {
            ru: 'IMDB',
            en: 'IMDB',
            uk: 'IMDB',
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
            uk: 'TMDB',
            be: 'TMDB',
            pt: 'TMDB',
            zh: 'TMDB',
            he: 'TMDB',
            cs: 'TMDB',
            bg: 'TMDB'
        },
        source_rt: {
            ru: 'Rotten Tomatoes',
            en: 'Rotten Tomatoes',
            uk: 'Rotten Tomatoes',
            be: 'Rotten Tomatoes',
            pt: 'Rotten Tomatoes',
            zh: '烂番茄',
            he: 'Rotten Tomatoes',
            cs: 'Rotten Tomatoes',
            bg: 'Rotten Tomatoes'
        },
        source_mc: {
            ru: 'Metacritic',
            en: 'Metacritic',
            uk: 'Metacritic',
            be: 'Metacritic',
            pt: 'Metacritic',
            zh: 'Metacritic',
            he: 'Metacritic',
            cs: 'Metacritic',
            bg: 'Metacritic'
        },
        source_popcorn: {
            ru: 'PopcornMeter',
            en: 'PopcornMeter',
            uk: 'PopcornMeter',
            be: 'PopcornMeter',
            pt: 'PopcornMeter',
            zh: '爆米花指数',
            he: 'PopcornMeter',
            cs: 'PopcornMeter',
            bg: 'PopcornMeter'
        }
    });

    // Стилі
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

        // Стилі для капсул з напівпрозорим фоном
        ".full-start__rate {" +
        "    background: rgba(0, 0, 0, 0.6) !important;" +
        "    border-radius: 0.5em !important;" +
        "    padding: 0.3em 0.6em !important;" +
        "    backdrop-filter: blur(5px);" +
        "}" +

        // Стилі для іконок як в Enchancer
        ".source--name.rate--icon img," +
        ".source--name.rate--icon svg {" +
        "    height: 14px;" +
        "    width: auto;" +
        "    display: inline-block;" +
        "    vertical-align: middle;" +
        "    object-fit: contain;" +
        "}" +
        (USE_GRAYSCALE_ICONS ? 
        ".source--name.rate--icon img {" +
        "    filter: grayscale(100%);" +
        "}" : "") +
        "</style>";
    
    Lampa.Template.add('card_css', style);
    $('body').append(Lampa.Template.get('card_css', {}, true));
    
    // Стилі для анімації завантаження
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
    
    // Конфігурація
    var CACHE_TIME = 3 * 24 * 60 * 60 * 1000; // 3 дні
    var OMDB_CACHE = 'maxsm_rating_omdb';
    var ID_MAPPING_CACHE = 'maxsm_rating_id_mapping';
    var OMDB_API_KEY = window.RATINGS_PLUGIN_TOKENS?.OMDB_API_KEY || '12c9249c';
    var MDBLIST_API_KEY = window.RATINGS_PLUGIN_TOKENS?.MDBLIST_API_KEY || '';
    
    // Словник вікових рейтингів
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
    
    // Вагові коефіцієнти
    var WEIGHTS = {
        imdb: 0.40,
        tmdb: 0.40,
        mc: 0.10,
        rt: 0.10
    };
    
    // Функція парсингу нагород
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
    
    // Допоміжні функції
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
    
    // Отримати іконку для Rotten Tomatoes залежно від рейтингу
    function getRottenTomatoesIcon(rating) {
        if (rating >= 60) {
            // Свіжий томат - беремо з Enchancer
            return '<svg width="14" height="14" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path fill="#FFAC33" d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379z"/></svg>';
        } else {
            // Гнилий томат - беремо з GitHub
            return '<img src="' + ICON_BASE_URL + 'RottenBad.png" alt="Rotten Tomatoes">';
        }
    }

    // Основна функція
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
        
        // Статуси рейтингів
        var imdbElement = $('.rate--imdb:not(.hide)', render);
        
        if (imdbElement.length > 0 && !!imdbElement.find('> div').eq(0).text().trim()) {
            processNextStep();
            return;
        }
                
        // 1. Отримуємо дані з MDBList (пріоритет)
        fetchMdbListRatings(normalizedCard, function(mdbData) {
            if (mdbData) {
                ratingsData = Object.assign(ratingsData, mdbData);
            }
            
            // 2. Отримуємо дані з OMDB (резерв)
            if (cachedData) {
                ratingsData.rt = ratingsData.rt || cachedData.rt;
                ratingsData.mc = ratingsData.mc || cachedData.mc;
                ratingsData.imdb = ratingsData.imdb || cachedData.imdb;
                ratingsData.ageRating = cachedData.ageRating;
                ratingsData.oscars = cachedData.oscars;
                ratingsData.emmy = cachedData.emmy;
                ratingsData.awards = cachedData.awards;
                updateUI();
            } else if (normalizedCard.imdb_id) {
                fetchOmdbRatings(normalizedCard, cacheKey, function(omdbData) {
                    if (omdbData) {
                        ratingsData.rt = ratingsData.rt || omdbData.rt;
                        ratingsData.mc = ratingsData.mc || omdbData.mc;
                        ratingsData.imdb = ratingsData.imdb || omdbData.imdb;
                        ratingsData.ageRating = omdbData.ageRating;
                        ratingsData.oscars = omdbData.oscars;
                        ratingsData.emmy = omdbData.emmy;
                        ratingsData.awards = omdbData.awards;
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
                                ratingsData.rt = ratingsData.rt || omdbData.rt;
                                ratingsData.mc = ratingsData.mc || omdbData.mc;
                                ratingsData.imdb = ratingsData.imdb || omdbData.imdb;
                                ratingsData.ageRating = omdbData.ageRating;
                                ratingsData.oscars = omdbData.oscars;
                                ratingsData.emmy = omdbData.emmy;
                                ratingsData.awards = omdbData.awards;
                                saveOmdbCache(cacheKey, omdbData);
                            }
                            updateUI();
                        });
                    } else {
                        updateUI();
                    }
                });
            }
        });
        
        function updateUI() {
            // Вставляємо рейтинги
            insertRatings(ratingsData);
            
            // Оновлюємо приховані елементи
            updateHiddenElements(ratingsData);
            
            // Вважаємо і відображаємо середній рейтинг
            calculateAverageRating();
        }
    }

    // Функції роботи з кешем
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

        if (!hasValidRating && !hasValidAgeRating && !hasOscars && !hasEmmy && !hasAwards) return;
        
        var cache = Lampa.Storage.get(OMDB_CACHE) || {};
        cache[key] = { 
            rt: data.rt,
            mc: data.mc,
            imdb: data.imdb,
            ageRating: data.ageRating,
            oscars: data.oscars || null,
            emmy: data.emmy || null,
            awards: data.awards || null,
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

    // Отримати рейтинги з MDBList
    function fetchMdbListRatings(card, callback) {
        if (!MDBLIST_API_KEY) {
            callback(null);
            return;
        }

        var mediaType = card.type === 'tv' ? 'show' : 'movie';
        var url = 'https://api.mdblist.com/tmdb/' + mediaType + '/' + card.id + '?apikey=' + MDBLIST_API_KEY;

        new Lampa.Reguest().silent(url, function(data) {
            if (data && data.ratings) {
                var ratings = {};
                
                // Обробляємо рейтинги з MDBList
                data.ratings.forEach(function(rating) {
                    if (rating.value !== null) {
                        switch(rating.source) {
                            case 'imdb':
                                ratings.imdb = parseFloat(rating.value);
                                break;
                            case 'tmdb':
                                ratings.tmdb = parseFloat(rating.value);
                                break;
                            case 'metacritic':
                                ratings.mc = parseInt(rating.value);
                                break;
                            case 'rotten_tomatoes':
                            case 'rottenTomatoes':
                                ratings.rt = parseInt(rating.value);
                                break;
                            case 'popcornmeter':
                            case 'popcorn':
                                ratings.popcorn = parseInt(rating.value);
                                break;
                        }
                    }
                });

                callback(ratings);
            } else {
                callback(null);
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
                });
            } else {
                callback(null);
            }
        }, function() {
            callback(null);
        });
    }
    
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

        // Оновлення IMDB
        var imdbContainer = $('.rate--imdb', render);
        if (imdbContainer.length) {
            var imdbDivs = imdbContainer.children('div');

            if (ratings.imdb && !isNaN(ratings.imdb)) {
                imdbContainer.removeClass('hide');
                if (imdbDivs.length >= 2) {
                    imdbDivs.eq(0).text(parseFloat(ratings.imdb).toFixed(1));
                    imdbDivs.eq(1).html('<img src="' + ICON_BASE_URL + 'star.png" alt="IMDb">');
                }
            } else {
                imdbContainer.addClass('hide');
            }
        }

        // Оновлення TMDB
        var tmdbContainer = $('.rate--tmdb', render);
        if (tmdbContainer.length) {
            if (ratings.tmdb && !isNaN(ratings.tmdb)) {
                tmdbContainer.removeClass('hide');
                var tmdbDivs = tmdbContainer.children('div');
                if (tmdbDivs.length >= 2) {
                    tmdbDivs.eq(0).text(parseFloat(ratings.tmdb).toFixed(1));
                    tmdbDivs.eq(1).html('<img src="' + ICON_BASE_URL + 'star.png" alt="TMDB">');
                }
            } else {
                tmdbContainer.addClass('hide');
            }
        }
    }
    
    function extractRating(ratings, source) {
        if (!ratings || !Array.isArray(ratings)) return null;
        
        for (var i = 0; i < ratings.length; i++) {
            if (ratings[i].Source === source) {
                try {
                    return source === 'Rotten Tomatoes' 
                        ? parseInt(ratings[i].Value.replace('%', ''))
                        : parseInt(ratings[i].Value.split('/')[0]);
                } catch(e) {
                    console.error('Помилка при парсингу рейтингу:', e);
                    return null;
                }
            }
        }
        return null;
    }
    
    // Функція вставки рейтингів
    function insertRatings(ratingsData) {
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;

        // Очищаємо існуючі рейтинги (крім TMDB та IMDb)
        $('.rate--rt, .rate--mc, .rate--oscars, .rate--emmy, .rate--awards, .rate--popcorn, .rate--avg', rateLine).remove();

        var lastRate = $('.full-start__rate:last', rateLine);

        // Середній рейтинг (буде додано пізніше)
        
        // Нагороди
        if (ratingsData.oscars && !isNaN(ratingsData.oscars) && ratingsData.oscars > 0) {
            var oscarsElement = $(
                '<div class="full-start__rate rate--oscars">' +
                    '<div>' + ratingsData.oscars + '</div>' +
                    '<div class="source--name rate--icon">' + Lampa.Lang.translate("maxsm_omdb_oscars") + '</div>' +
                '</div>'
            );
            rateLine.prepend(oscarsElement);
        }

        if (ratingsData.emmy && !isNaN(ratingsData.emmy) && ratingsData.emmy > 0) {
            var emmyElement = $(
                '<div class="full-start__rate rate--emmy">' +
                    '<div>' + ratingsData.emmy + '</div>' +
                    '<div class="source--name rate--icon">' + Lampa.Lang.translate("maxsm_omdb_emmy") + '</div>' +
                '</div>'
            );
            rateLine.prepend(emmyElement);
        }

        if (ratingsData.awards && !isNaN(ratingsData.awards) && ratingsData.awards > 0) {
            var awardsElement = $(
                '<div class="full-start__rate rate--awards">' +
                    '<div>' + ratingsData.awards + '</div>' +
                    '<div class="source--name rate--icon"><img src="' + ICON_BASE_URL + 'awards.png" alt="' + Lampa.Lang.translate("maxsm_omdb_awards") + '"></div>' +
                '</div>'
            );
            rateLine.prepend(awardsElement);
        }

        // Rotten Tomatoes
        if (ratingsData.rt && !isNaN(ratingsData.rt)) {
            var rtValue = ratingsData.rt;
            var rtElement = $(
                '<div class="full-start__rate rate--rt">' +
                    '<div>' + rtValue + '</div>' +
                    '<div class="source--name rate--icon">' + getRottenTomatoesIcon(rtValue) + '</div>' +
                '</div>'
            );
            if (lastRate.length) rtElement.insertAfter(lastRate);
            else rateLine.append(rtElement);
        }

        // Metacritic
        if (ratingsData.mc && !isNaN(ratingsData.mc)) {
            var mcValue = ratingsData.mc;
            var insertAfter = $('.rate--rt', rateLine).length ? $('.rate--rt', rateLine) : lastRate;
            var mcElement = $(
                '<div class="full-start__rate rate--mc">' +
                    '<div>' + mcValue + '</div>' +
                    '<div class="source--name rate--icon">' + Lampa.Lang.translate('source_mc') + '</div>' +
                '</div>'
            );
            if (insertAfter.length) mcElement.insertAfter(insertAfter);
            else rateLine.append(mcElement);
        }

        // PopcornMeter
        if (ratingsData.popcorn && !isNaN(ratingsData.popcorn)) {
            var popcornValue = ratingsData.popcorn;
            var insertAfter = $('.rate--mc', rateLine).length ? $('.rate--mc', rateLine) : ($('.rate--rt', rateLine).length ? $('.rate--rt', rateLine) : lastRate);
            var popcornElement = $(
                '<div class="full-start__rate rate--popcorn">' +
                    '<div>' + popcornValue + '</div>' +
                    '<div class="source--name rate--icon"><img src="' + ICON_BASE_URL + 'popcorn.png" alt="' + Lampa.Lang.translate('source_popcorn') + '"></div>' +
                '</div>'
            );
            if (insertAfter.length) popcornElement.insertAfter(insertAfter);
            else rateLine.append(popcornElement);
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
            mc: (parseInt($('.rate--mc div:first', rateLine).text()) || 0) / 10, // Конвертуємо в 10-бальну систему
            rt: (parseInt($('.rate--rt div:first', rateLine).text()) || 0) / 10  // Конвертуємо в 10-бальну систему
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
                    '<div class="source--name rate--icon"><img src="' + ICON_BASE_URL + 'star.png" alt="' + Lampa.Lang.translate("ratimg_omdb_avg") + '"></div>' +
                '</div>'
            );
            
            // Вставляємо середній рейтинг на початок
            $('.full-start__rate:first', rateLine).before(avgElement);
        }
        
        removeLoadingAnimation();
        rateLine.css('visibility', 'visible');
    }

    // Ініціалізація плагіна
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
