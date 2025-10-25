(function() {
    'use strict';

    // ---------------------------------------------------
    // -- КОНФІГУРАЦІЯ ПЛАГІНА --
    // ---------------------------------------------------

    /**
     * API ключ для MDBList API (отримати на https://api.mdblist.com)
     * !!! ВСТАВ СВІЙ КЛЮЧ НИЖЧЕ (НЕ МОЇ) !!!
     * @type {string}
     */
    var MDBLIST_API_KEY = 'm8po461k1zq14sroj2ez5d7um'; // не мій ключ

    /**
     * API ключ для OMDB (використовується ТІЛЬКИ для нагород та віку, і фолбеків рейтингів)
     * !!! ВСТАВ СВІЙ КЛЮЧ НИЖЧЕ !!!
     * @type {string}
     */
    var OMDB_API_KEY = '12c9249c';

    /**
     * Встановіть true для чорно-білих іконок (як у Enchanser), false — для кольорових
     * @type {boolean}
     */
    var USE_GRAYSCALE_ICONS = true;

    /**
     * Базовий URL для PNG-іконок з GitHub
     * @type {string}
     */
    var ICON_BASE_URL = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';

    // ---------------------------------------------------
    // -- УТИЛІТИ, СТИЛІ та ІКОНИ --
    // ---------------------------------------------------

    // Enchanser-like inline SVG для джерел (IMDb/TMDB/MC/RT-Fresh)
    var SVG = {
        imdb: '<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><rect rx="4" ry="4" x="1" y="1" width="62" height="30" fill="currentColor"/><text x="12" y="22" font-size="16" fill="#000" font-family="Arial,Helvetica,sans-serif" font-weight="700">IMDb</text></svg>',
        tmdb: '<svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="34" height="34" rx="6" ry="6" stroke="currentColor" fill="none" stroke-width="3"/><text x="8" y="25" font-size="11" fill="currentColor" font-family="Arial,Helvetica,sans-serif" font-weight="700">TMDB</text></svg>',
        mc:   '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" stroke="currentColor" fill="none" stroke-width="3"/><path d="M9 20 L23 12" stroke="currentColor" stroke-width="3"/></svg>',
        rtFresh: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="currentColor"/><path d="M11 16 l3 3 l7 -7" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'
    };

    var grayscaleCss = USE_GRAYSCALE_ICONS ? 'filter: grayscale(100%);' : '';

    function getIconHtml(iconFileOrSvg, isSvg){
        if(isSvg){
            return '<span class="rate--icon-img" style="'+grayscaleCss+'">'+iconFileOrSvg+'</span>';
        }
        return '<img src="'+ ICON_BASE_URL + iconFileOrSvg + '" class="rate--icon-img" style="'+grayscaleCss+'">';
    }

    // Додаткові стилі: Enchanser-size (22px) + капсули
    var style = "<style id=\"maxsm_omdb_rating_fixed\">"+
        ".full-start-new__rate-line{"+
        "  visibility:hidden; flex-wrap:wrap; gap:.4em 0; position:relative;"+
        "}"+
        ".full-start-new__rate-line > *{"+
        "  margin-left:0 !important; margin-right:.6em !important;"+
        "}"+
        ".full-start__rate{"+
        "  display:inline-flex; align-items:center; gap:6px; padding:2px 8px;"+
        "  border-radius:9999px; background:rgba(255,255,255,.15); height:26px; line-height:1;"+
        "}"+
        ".rate--icon-img{"+
        "  height:22px; width:auto; display:inline-block; vertical-align:middle; object-fit:contain;"+
        "  transform:scale(1.05); margin-top:-2px;"+
        "}"+
        ".rate--avg.rating--green{color:#4caf50;}"+
        ".rate--avg.rating--lime{color:#3399ff;}"+
        ".rate--avg.rating--orange{color:#ff9933;}"+
        ".rate--avg.rating--red{color:#f44336;}"+
        ".rate--oscars,.rate--emmy,.rate--awards{color:gold;}"+
        ".loading-dots-container{position:absolute; top:50%; left:0; right:0; text-align:left; transform:translateY(-50%); z-index:10;}"+
        ".loading-dots{display:inline-flex; align-items:center; gap:.4em; color:#fff; font-size:1em; background:rgba(0,0,0,.3); padding:.6em 1em; border-radius:.5em;}"+
        ".loading-dots__text{margin-right:1em;}"+
        ".loading-dots__dot{width:.5em; height:.5em; border-radius:50%; background-color:currentColor; animation:loading-dots-bounce 1.4s infinite ease-in-out both;}"+
        ".loading-dots__dot:nth-child(1){animation-delay:-.32s;}"+
        ".loading-dots__dot:nth-child(2){animation-delay:-.16s;}"+
        "@keyframes loading-dots-bounce{0%,80%,100%{transform:translateY(0);opacity:.6;}40%{transform:translateY(-.5em);opacity:1;}}"+
    "</style>";

    if(!document.getElementById('maxsm_omdb_rating_fixed')){
        $('body').append(style);
    }

    // ---------------------------------------------------
    // -- ЛОКАЛІЗАЦІЯ (і джерела-іконки) --
    // ---------------------------------------------------
    Lampa.Lang.add({
        ratimg_omdb_avg: { ru:'ИТОГ', en:'TOTAL', uk:getIconHtml('star.png'), be:'ВЫНІК' },
        loading_dots: { ru:'Загрузка рейтингов', en:'Loading ratings', uk:'Трішки зачекаємо ...', be:'Загрузка рэйтынгаў' },

        // Oscars/Emmy — залишаємо як у omdb (тільки підпис)
        maxsm_omdb_oscars: { ru:'Оскары', en:'Oscars', uk:'Оскари', be:'Оскары' },
        maxsm_omdb_emmy:   { ru:'Эмми',   en:'Emmy',   uk:'Еммі',   be:'Эммі' },

        // Інші нагороди — PNG з GitHub
        maxsm_omdb_awards_other: {
            ru: getIconHtml('awards.png'),
            en: getIconHtml('awards.png'),
            uk: getIconHtml('awards.png')
        },

        // Джерела як у Enchanser (SVG)
        source_imdb: { ru:'IMDB', en:'IMDB', uk:getIconHtml(SVG.imdb, true), be:'IMDB' },
        source_tmdb: { ru:'TMDB', en:'TMDB', uk:getIconHtml(SVG.tmdb, true), be:'TMDB' },
        source_mc:   { ru:'Metacritic', en:'Metacritic', uk:getIconHtml(SVG.mc, true), be:'Metacritic' }
    });

    // ---------------------------------------------------
    // -- КОНСТАНТИ, КЕШ, ВАГИ, МАПИ ВІКУ --
    // ---------------------------------------------------

    var CACHE_TIME = 3 * 24 * 60 * 60 * 1000; // 3 дні
    var AWARDS_CACHE = 'maxsm_rating_omdb';       // кеш для OMDB (нагороди, вік, фолбеки рейтингів)
    var MDBLIST_CACHE = 'maxsm_rating_mdblist';   // кеш для MDBList (рейтинги + popcorn)
    var ID_MAPPING_CACHE = 'maxsm_rating_id_mapping';

    var AGE_RATINGS = {
        'G':'3+','PG':'6+','PG-13':'13+','R':'17+','NC-17':'18+',
        'TV-Y':'0+','TV-Y7':'7+','TV-G':'3+','TV-PG':'6+','TV-14':'14+','TV-MA':'17+'
    };

    var WEIGHTS = { imdb:0.40, tmdb:0.40, mc:0.10, rt:0.10 };

    // ---------------------------------------------------
    // -- УТИЛІТИ КЕШУ, ID, ПАРСИНГУ --
    // ---------------------------------------------------

    function getCache(cacheName, key){
        var cache = Lampa.Storage.get(cacheName) || {};
        var item = cache[key];
        return item && (Date.now() - item.timestamp < CACHE_TIME) ? item.data : null;
    }
    function setCache(cacheName, key, data){
        var cache = Lampa.Storage.get(cacheName) || {};
        cache[key] = { data:data, timestamp:Date.now() };
        Lampa.Storage.set(cacheName, cache);
    }

    function getCardType(card){
        var type = card.media_type || card.type;
        if (type === 'movie' || type === 'tv') return type;
        return (card.name || card.original_name) ? 'tv' : 'movie';
    }

    // Парсинг OMDB.Awards
    function parseAwards(awardsText){
        if (typeof awardsText !== 'string') return {oscars:0, emmy:0, awards:0};
        var result = { oscars:0, emmy:0, awards:0 };
        var oscarMatch = awardsText.match(/Won (\d+) Oscars?/i);
        if (oscarMatch && oscarMatch[1]) result.oscars = parseInt(oscarMatch[1], 10);

        var emmyMatch = awardsText.match(/Won (\d+) Primetime Emmys?/i);
        if (emmyMatch && emmyMatch[1]) result.emmy = parseInt(emmyMatch[1], 10);

        var otherMatch = awardsText.match(/Another (\d+) wins?/i);
        if (otherMatch && otherMatch[1]) result.awards = parseInt(otherMatch[1], 10);

        if (result.awards === 0){
            var simpleMatch = awardsText.match(/(\d+) wins?/i);
            if (simpleMatch && simpleMatch[1]) result.awards = parseInt(simpleMatch[1], 10);
        }
        return result;
    }

    // RT/MC/IMDb з масиву OMDB.Ratings
    function extractOmdbRating(ratings, source){
        if (!ratings || !Array.isArray(ratings)) return 0;
        for (var i=0;i<ratings.length;i++){
            if (ratings[i].Source === source){
                try{
                    return source === 'Rotten Tomatoes'
                        ? parseFloat(String(ratings[i].Value).replace('%',''))    // 0-100
                        : parseFloat(String(ratings[i].Value).split('/')[0]);     // x/100
                }catch(e){ return 0; }
            }
        }
        return 0;
    }

    // ---------------------------------------------------
    // -- ЗАПИТ 1: MDBList (основне джерело рейтингів) --
    // ---------------------------------------------------
    function fetchMdbListData(card){
        return new Promise(function(resolve){
            if (!MDBLIST_API_KEY || MDBLIST_API_KEY.indexOf('<<<PUT_YOUR_') === 0){
                console.warn('MDBList API key not set');
                return resolve({});
            }

            var cardType = getCardType(card) === 'tv' ? 'show' : 'movie';
            var cacheKey = cardType + '_' + card.id;
            var cachedData = getCache(MDBLIST_CACHE, cacheKey);
            if (cachedData) return resolve(cachedData);

            var url = "https://api.mdblist.com/tmdb/" + cardType + "/" + card.id + "?apikey=" + MDBLIST_API_KEY;

            new Lampa.Reguest().silent(url, function (data) {
                var ratings = { imdb:0, tmdb:0, rt:0, mc:0, popcorn:0 };

                // універсальний парсер
                if (data){
                    if (data.ratings && data.ratings.length){
                        data.ratings.forEach(function(r){
                            var src = (r.source || '').toLowerCase();
                            var val = parseFloat(r.value);
                            if (!isFinite(val)) return;
                            if (src === 'imdb') ratings.imdb = val;             // 0-10
                            if (src === 'tmdb') ratings.tmdb = val;             // 0-10
                            if (src === 'tomatoes') ratings.rt = val;           // 0-100
                            if (src === 'metacritic') ratings.mc = val;         // 0-100
                            if (src === 'popcornmeter' || src === 'popcorn' || src === 'audience')
                                ratings.popcorn = val;                           // 0-100
                        });
                    }
                    // альтернативні поля
                    if (!ratings.imdb && isFinite(data.imdb_rating)) ratings.imdb = parseFloat(data.imdb_rating);
                    if (!ratings.tmdb && isFinite(data.tmdb_rating)) ratings.tmdb = parseFloat(data.tmdb_rating);
                    if (!ratings.rt && isFinite(data.rotten_tomatoes)) ratings.rt = parseFloat(data.rotten_tomatoes);
                    if (!ratings.mc && isFinite(data.metacritic)) ratings.mc = parseFloat(data.metacritic);
                    if (!ratings.popcorn && isFinite(data.popcornmeter)) ratings.popcorn = parseFloat(data.popcornmeter);
                    if (!ratings.popcorn && isFinite(data.popcorn)) ratings.popcorn = parseFloat(data.popcorn);
                    if (!ratings.popcorn && isFinite(data.audience_score)) ratings.popcorn = parseFloat(data.audience_score);
                }

                setCache(MDBLIST_CACHE, cacheKey, ratings);
                resolve(ratings);
            }, function(){
                resolve({});
            });
        });
    }

    // ---------------------------------------------------
    // -- ЗАПИТ 2: OMDB (нагороди + фолбеки рейтингів) --
    // ---------------------------------------------------
    function fetchOmdbData(card){
        return new Promise(function(resolve){
            if (!OMDB_API_KEY || OMDB_API_KEY.indexOf('<<<PUT_YOUR_') === 0){
                return resolve({}); // без ключа просто пропустимо
            }
            getImdbId(card, function(imdbId){
                if (!imdbId) return resolve({});

                var cardType = getCardType(card);
                var cacheKey = cardType + '_' + imdbId;
                var cachedData = getCache(AWARDS_CACHE, cacheKey);
                if (cachedData) return resolve(cachedData);

                var typeParam = (cardType === 'tv') ? '&type=series' : '';
                var url = 'https://www.omdbapi.com/?apikey=' + OMDB_API_KEY + '&i=' + imdbId + typeParam;

                new Lampa.Reguest().silent(url, function(data){
                    if (data && data.Response === 'True'){
                        var parsedAwards = parseAwards(data.Awards || '');
                        var result = {
                            rt: extractOmdbRating(data.Ratings, 'Rotten Tomatoes'), // 0-100
                            mc: extractOmdbRating(data.Ratings, 'Metacritic') * 10,  // OMDB віддає x/100 -> помножимо якщо треба
                            imdb: (data.imdbRating && data.imdbRating !== "N/A") ? parseFloat(data.imdbRating) : 0, // 0-10
                            ageRating: data.Rated || null,
                            oscars: parsedAwards.oscars,
                            emmy: parsedAwards.emmy,
                            awards: parsedAwards.awards
                        };
                        setCache(AWARDS_CACHE, cacheKey, result);
                        resolve(result);
                    } else resolve({});
                }, function(){
                    resolve({});
                });
            });
        });
    }

    // Отримати imdb_id по TMDB id
    function getImdbId(card, callback){
        if (card.imdb_id) return callback(card.imdb_id);

        var cardType = getCardType(card);
        var cacheKey = cardType + '_' + card.id;
        var cachedId = getCache(ID_MAPPING_CACHE, cacheKey);
        if (cachedId) return callback(cachedId);

        var url = 'https://api.themoviedb.org/3/' + cardType + '/' + card.id + '/external_ids?api_key=' + Lampa.TMDB.key();
        new Lampa.Reguest().silent(url, function(data){
            if (data && data.imdb_id){
                setCache(ID_MAPPING_CACHE, cacheKey, data.imdb_id);
                callback(data.imdb_id);
            } else callback(null);
        }, function(){ callback(null); });
    }

    // ---------------------------------------------------
    // -- ОНОВЛЕННЯ UI (приховані поля + вставки) --
    // ---------------------------------------------------

    function addLoadingAnimation(){
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;
        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length || $('.loading-dots-container', rateLine).length) return;
        rateLine.append(
            '<div class="loading-dots-container">'+
              '<div class="loading-dots">'+
                '<span class="loading-dots__text">'+ Lampa.Lang.translate("loading_dots") +'</span>'+
                '<span class="loading-dots__dot"></span>'+
                '<span class="loading-dots__dot"></span>'+
                '<span class="loading-dots__dot"></span>'+
              '</div>'+
            '</div>'
        );
        $('.loading-dots-container', rateLine).css({ opacity:'1', visibility:'visible' });
    }

    function removeLoadingAnimation(){
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;
        $('.loading-dots-container', render).remove();
    }

    function updateHiddenElements(r){
        var render = Lampa.Activity.active().activity.render();
        if (!render || !render[0]) return;

        // Вік (PG)
        var pgElement = $('.full-start__pg.hide', render);
        if (pgElement.length && r.ageRating){
            var invalid = ['N/A','Not Rated','Unrated'];
            if (invalid.indexOf(r.ageRating) === -1){
                var localized = AGE_RATINGS[r.ageRating] || r.ageRating;
                pgElement.removeClass('hide').text(localized);
            }
        }

        // IMDb
        var imdbContainer = $('.rate--imdb', render);
        if (imdbContainer.length && r.imdb > 0){
            imdbContainer.removeClass('hide');
            imdbContainer.children('div').eq(0).text(parseFloat(r.imdb).toFixed(1));
            imdbContainer.children('div').eq(1).html(Lampa.Lang.translate('source_imdb'));
        }

        // TMDB
        var tmdbContainer = $('.rate--tmdb', render);
        if (tmdbContainer.length && r.tmdb > 0){
            tmdbContainer.removeClass('hide');
            tmdbContainer.children('div').eq(0).text(parseFloat(r.tmdb).toFixed(1));
            tmdbContainer.children('div').eq(1).html(Lampa.Lang.translate('source_tmdb'));
        }
    }

    function getRatingClass(v){
        if (v >= 8.0) return 'rating--green';
        if (v >= 6.0) return 'rating--lime';
        if (v >= 5.5) return 'rating--orange';
        return 'rating--red';
    }

    // Вставка блоків: RT, MC, Popcorn, Awards/Emmy/Oscars
    function insertRatings(r){
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;

        var lastRate = $('.full-start__rate:last', rateLine);

        // Rotten Tomatoes (0-100), поріг 60%
        if (r.rt > 0 && !$('.rate--rt', rateLine).length){
            var rtValue = Math.round(r.rt) + '%';
            var isFresh = r.rt >= 60;
            var rtIconHtml = isFresh ? getIconHtml(SVG.rtFresh, true) : getIconHtml('RottenBad.png');

            var rtEl = $('<div class="full-start__rate rate--rt">'+
                '<div>'+ rtValue +'</div>'+
                '<div class="source--name">'+ rtIconHtml +'</div>'+
            '</div>');

            var afterRT = $('.rate--mc', rateLine).length ? $('.rate--mc', rateLine) : lastRate;
            if (afterRT.length) rtEl.insertAfter(afterRT);
            else rateLine.prepend(rtEl);
        }

        // Metacritic (0-100)
        if (r.mc > 0 && !$('.rate--mc', rateLine).length){
            var mcValue = Math.round(r.mc) + '%';
            var mcEl = $('<div class="full-start__rate rate--mc">'+
                '<div>'+ mcValue +'</div>'+
                '<div class="source--name">'+ Lampa.Lang.translate('source_mc') +'</div>'+
            '</div>');
            var afterMC = $('.rate--rt', rateLine).length ? $('.rate--rt', rateLine) : lastRate;
            if (afterMC.length) mcEl.insertAfter(afterMC);
            else rateLine.prepend(mcEl);
        }

        // PopcornMeter (0-100) — у рядку (НЕ на постері)
        if (r.popcorn > 0 && !$('.rate--popcorn', rateLine).length){
            var pcValue = Math.round(r.popcorn) + '%';
            var pcEl = $('<div class="full-start__rate rate--popcorn">'+
                '<div>'+ pcValue +'</div>'+
                '<div class="source--name">'+ getIconHtml('popcorn.png') +'</div>'+
            '</div>');
            var afterPC = $('.rate--rt', rateLine).length ? $('.rate--rt', rateLine)
                        : ($('.rate--mc', rateLine).length ? $('.rate--mc', rateLine) : lastRate);
            if (afterPC.length) pcEl.insertAfter(afterPC);
            else rateLine.append(pcEl);
        }

        // Інші нагороди
        if (r.awards > 0 && !$('.rate--awards', rateLine).length){
            var awardsEl = $('<div class="full-start__rate rate--awards rate--gold">'+
                '<div>'+ r.awards +'</div>'+
                '<div class="source--name">'+ Lampa.Lang.translate("maxsm_omdb_awards_other") +'</div>'+
            '</div>');
            rateLine.prepend(awardsEl);
        }

        // Emmy
        if (r.emmy > 0 && !$('.rate--emmy', rateLine).length){
            var emmyEl = $('<div class="full-start__rate rate--emmy rate--gold">'+
                '<div>'+ r.emmy +'</div>'+
                '<div class="source--name">'+ Lampa.Lang.translate("maxsm_omdb_emmy") +'</div>'+
            '</div>');
            rateLine.prepend(emmyEl);
        }

        // Oscars
        if (r.oscars > 0 && !$('.rate--oscars', rateLine).length){
            var oscEl = $('<div class="full-start__rate rate--oscars">'+
                '<div>'+ r.oscars +'</div>'+
                '<div class="source--name">'+ Lampa.Lang.translate("maxsm_omdb_oscars") +'</div>'+
            '</div>');
            rateLine.prepend(oscEl);
        }
    }

    // Середній рейтинг (біла цифра, конвертація 0-100 → 0-10 для підрахунку)
    function calculateAverageRating(fr){
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) return;

        var ratings = {
            imdb: fr.imdb || 0,             // 0-10
            tmdb: fr.tmdb || 0,             // 0-10
            mc: (fr.mc/10) || 0,            // 0-100 → 0-10
            rt: (fr.rt/10) || 0             // 0-100 → 0-10
        };

        var totalWeight = 0, weightedSum = 0, cnt = 0;
        Object.keys(ratings).forEach(function(k){
            var v = ratings[k];
            if (isFinite(v) && v > 0){
                weightedSum += v * WEIGHTS[k];
                totalWeight += WEIGHTS[k];
                cnt++;
            }
        });

        $('.rate--avg', rateLine).remove();

        if (cnt > 1 && totalWeight > 0){
            var avg = weightedSum / totalWeight;
            var cls = getRatingClass(avg);
            var avgEl = $('<div class="full-start__rate rate--avg '+cls+'">'+
                '<div>'+ avg.toFixed(1) +'</div>'+
                '<div class="source--name">'+ Lampa.Lang.translate("ratimg_omdb_avg") +'</div>'+
            '</div>');
            $('.full-start__rate:first', rateLine).before(avgEl);
        }

        removeLoadingAnimation();
        rateLine.css('visibility','visible');
    }

    // ---------------------------------------------------
    // -- Контролер: збір даних і відмальовка --
    // ---------------------------------------------------
    function fetchAdditionalRatings(card){
        var render = Lampa.Activity.active().activity.render();
        if (!render) return;

        var rateLine = $('.full-start-new__rate-line', render);
        if (rateLine.length){
            rateLine.css('visibility','hidden');
            addLoadingAnimation();
        }

        // Попкорн інколи є у картці — використаємо як запасний варіант
        var popcornFromCard = card.popcorn_rating || card.audience_score || 0;

        Promise.all([ fetchOmdbData(card), fetchMdbListData(card) ])
        .then(function(res){
            var omdbData = res[0] || {};
            var mdbData  = res[1] || {};

            var finalRatings = {
                // Пріоритет MDBList, далі OMDB, далі картка
                imdb: mdbData.imdb || omdbData.imdb || (isFinite(card.imdb_rating) ? parseFloat(card.imdb_rating) : 0),
                tmdb: mdbData.tmdb || (isFinite(card.vote_average) ? parseFloat(card.vote_average) : 0),
                rt:   mdbData.rt   || omdbData.rt   || 0,   // 0-100
                mc:   mdbData.mc   || omdbData.mc   || 0,   // 0-100
                popcorn: mdbData.popcorn || popcornFromCard || 0, // 0-100

                // Нагороди/вік тільки з OMDB
                ageRating: omdbData.ageRating,
                oscars: omdbData.oscars || 0,
                emmy: omdbData.emmy || 0,
                awards: omdbData.awards || 0
            };

            updateHiddenElements(finalRatings);
            insertRatings(finalRatings);
            calculateAverageRating(finalRatings);
        })
        .catch(function(){
            removeLoadingAnimation();
            rateLine.css('visibility','visible');
        });
    }

    // ---------------------------------------------------
    // -- ІНІЦІАЛІЗАЦІЯ ПІДПИСКИ --
    // ---------------------------------------------------
    function startPlugin(){
        if (window.combined_ratings_plugin_fixed) return;
        window.combined_ratings_plugin_fixed = true;

        Lampa.Listener.follow('full', function(e){
            if (e.type === 'complite'){
                setTimeout(function(){
                    fetchAdditionalRatings(e.data.movie);
                }, 400);
            }
        });
    }

    if (!window.combined_ratings_plugin_fixed) startPlugin();
})();
