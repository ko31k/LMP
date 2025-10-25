(function() {
    'use strict';

    // ---------------------------------------------------
    // -- КОНФІГУРАЦІЯ ПЛАГІНА --
    // ---------------------------------------------------

    /** MDBList API key (основні рейтинги) */
    var MDBLIST_API_KEY = '000000000000000000000000'; // ← заміни своїм

    /** OMDB API key (вік, нагороди, фолбек-рейтинги) */
    var OMDB_API_KEY = (window.RATINGS_PLUGIN_TOKENS && window.RATINGS_PLUGIN_TOKENS.OMDB_API_KEY) || '00000000';

    /** Перемикач ч/б іконок (true = ч/б). За замовчуванням КОЛЬОРОВІ */
    var USE_GRAYSCALE_ICONS = false;

    /** База для "своєї" GitHub-папки (інші іконки) */
    var ICON_BASE_URL = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';

    /** База для streamingdiscovery (IMDb, TMDB, MC і RT good) */
    var STREAMING_BASE_URL = 'https://www.streamingdiscovery.com/logo/';

    // ---------------------------------------------------
    // -- ГЕНЕРАТОРИ ІКОНОК --
    // ---------------------------------------------------

    var grayscaleFilter = USE_GRAYSCALE_ICONS ? ' filter: grayscale(100%);' : '';

    // універсальний IMG (розмір як у твоїй спробі)
    function iconImg(src) {
        return '<img src="' + src + '" style="height:14px; width:auto; display:inline-block; vertical-align:middle; object-fit:contain; transform:scale(1.2);' + grayscaleFilter + '">';
    }

    function iconFromStreaming(file) { return iconImg(STREAMING_BASE_URL + file); }
    function iconFromGithub(file)    { return iconImg(ICON_BASE_URL + file); }

    // ---------------------------------------------------
    // -- ЛОКАЛІЗАЦІЯ (лейбли-іконки) --
    // ---------------------------------------------------

    Lampa.Lang.add({
        ratimg_omdb_avg: {
            ru: 'ИТОГ',
            en: 'TOTAL',
            uk: '<svg width="14" height="14" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#FFAC33" d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379z"/></svg>',
            be: 'ВЫНІК'
        },
        loading_dots: {
            ru: 'Загрузка рейтингов',
            en: 'Loading ratings',
            uk: 'Трішки зачекаємо ...',
            be: 'Загрузка рэйтынгаў'
        },
        // Нагороди — залишаємо як було (іконки з GitHub-папки)
        maxsm_omdb_oscars:      { uk: iconFromGithub('oscar.png'), en: 'Oscars',  ru: 'Оскары' },
        maxsm_omdb_emmy:        { uk: iconFromGithub('emmy.png'),  en: 'Emmy',    ru: 'Эмми'   },
        maxsm_omdb_awards_other:{ uk: iconFromGithub('awards.png'),en: 'Awards',  ru: 'Награды' },

        // Джерела — IMDb/TMDB/MC з streamingdiscovery
        source_imdb: { uk: iconFromStreaming('imdb.png'), en: 'IMDB', ru: 'IMDB' },
        source_tmdb: { uk: iconFromStreaming('tmdb.png'), en: 'TMDB', ru: 'TMDB' },
        source_mc:   { uk: iconFromStreaming('metacritic.png'), en: 'Metacritic', ru: 'Metacritic' }
        // RT іконка буде динамічна (good/bad), тому окремий ключ не фіксуємо
    });

    // ---------------------------------------------------
    // -- СТИЛІ --
    // ---------------------------------------------------

    var style = "<style id=\"maxsm_omdb_rating\">\
.full-start-new__rate-line{visibility:hidden;flex-wrap:wrap;gap:0.4em 0;}\
.full-start-new__rate-line>*{margin-left:0!important;margin-right:0.6em!important;}\
.rate--avg.rating--green{color:#4caf50;}\
.rate--avg.rating--lime{color:#3399ff;}\
.rate--avg.rating--orange{color:#ff9933;}\
.rate--avg.rating--red{color:#f44336;}\
.rate--oscars{color:gold;}\
.rate--emmy{color:gold;}\
.rate--awards{color:gold;}\
</style>";

    Lampa.Template.add('card_css', style);
    $('body').append(Lampa.Template.get('card_css', {}, true));

    var loadingStyles = "<style id=\"maxsm_loading_animation\">\
.loading-dots-container{position:absolute;top:50%;left:0;right:0;text-align:left;transform:translateY(-50%);z-index:10;}\
.full-start-new__rate-line{position:relative;}\
.loading-dots{display:inline-flex;align-items:center;gap:0.4em;color:#fff;font-size:1em;background:rgba(0,0,0,.3);padding:.6em 1em;border-radius:.5em;}\
.loading-dots__text{margin-right:1em;}\
.loading-dots__dot{width:.5em;height:.5em;border-radius:50%;background-color:currentColor;animation:loading-dots-bounce 1.4s infinite ease-in-out both;}\
.loading-dots__dot:nth-child(1){animation-delay:-.32s;}\
.loading-dots__dot:nth-child(2){animation-delay:-.16s;}\
@keyframes loading-dots-bounce{0%,80%,100%{transform:translateY(0);opacity:.6;}40%{transform:translateY(-.5em);opacity:1;}}\
</style>";

    Lampa.Template.add('loading_animation_css', loadingStyles);
    $('body').append(Lampa.Template.get('loading_animation_css', {}, true));

    // ---------------------------------------------------
    // -- КОНСТАНТИ / КЕШ --
    // ---------------------------------------------------

    var CACHE_TIME       = 3 * 24 * 60 * 60 * 1000; // 3 дні
    var AWARDS_CACHE     = 'maxsm_rating_omdb';      // OMDB (нагороди, вік, фолбек-рейтинги)
    var MDBLIST_CACHE    = 'maxsm_rating_mdblist';   // MDBList (рейтинги)
    var ID_MAPPING_CACHE = 'maxsm_rating_id_mapping';

    var AGE_RATINGS = {
        'G':'3+','PG':'6+','PG-13':'13+','R':'17+','NC-17':'18+',
        'TV-Y':'0+','TV-Y7':'7+','TV-G':'3+','TV-PG':'6+','TV-14':'14+','TV-MA':'17+'
    };

    // Ваги TOTAL (в 10-бальній шкалі)
    var WEIGHTS = { imdb:0.40, tmdb:0.40, mc:0.10, rt:0.10 };

    // ---------------------------------------------------
    // -- ХЕЛПЕРИ --
    // ---------------------------------------------------

    function addLoadingAnimation(){
        var render = Lampa.Activity.active().activity.render(); if(!render) return;
        var line = $('.full-start-new__rate-line', render);
        if(!line.length || $('.loading-dots-container', line).length) return;
        line.append('<div class="loading-dots-container">\
            <div class="loading-dots">\
            <span class="loading-dots__text">'+Lampa.Lang.translate("loading_dots")+'</span>\
            <span class="loading-dots__dot"></span><span class="loading-dots__dot"></span><span class="loading-dots__dot"></span>\
            </div></div>');
        $('.loading-dots-container', line).css({opacity:'1',visibility:'visible'});
    }
    function removeLoadingAnimation(){
        var render = Lampa.Activity.active().activity.render(); if(!render) return;
        $('.loading-dots-container', render).remove();
    }

    function getCardType(card){
        var t = card.media_type || card.type;
        if(t === 'movie' || t === 'tv') return t;
        return (card.name || card.original_name) ? 'tv' : 'movie';
    }

    function getRatingClass(x){
        if(x>=8.0) return 'rating--green';
        if(x>=6.0) return 'rating--lime';
        if(x>=5.5) return 'rating--orange';
        return 'rating--red';
    }

    function getCache(ns, key){
        var c = Lampa.Storage.get(ns) || {}, item = c[key];
        return item && (Date.now()-item.timestamp < CACHE_TIME) ? item.data : null;
    }
    function setCache(ns, key, data){
        var c = Lampa.Storage.get(ns) || {};
        c[key] = { data:data, timestamp:Date.now() };
        Lampa.Storage.set(ns, c);
    }

    // OMDB Ratings (масив Ratings) → числові значення
    function extractOmdbRating(ratings, source){
        if(!Array.isArray(ratings)) return 0;
        for(var i=0;i<ratings.length;i++){
            if(ratings[i].Source === source){
                try{
                    if(source === 'Rotten Tomatoes'){
                        // OMDB RT приходить як "83%" → повертаємо 0–100
                        return parseFloat(String(ratings[i].Value).replace('%','')) || 0;
                    }else if(source === 'Metacritic'){
                        // "78/100" → повертаємо 0–100
                        return parseFloat(String(ratings[i].Value).split('/')[0]) || 0;
                    }
                }catch(e){ return 0; }
            }
        }
        return 0;
    }

    // Нагороди (як у твоєму omdb.js)
    function parseAwards(text){
        if(typeof text!=='string') return {oscars:0, emmy:0, awards:0};
        var res = {oscars:0, emmy:0, awards:0};
        var m;
        m = text.match(/Won (\d+) Oscars?/i);          if(m && m[1]) res.oscars = parseInt(m[1],10);
        m = text.match(/Won (\d+) Primetime Emmys?/i);  if(m && m[1]) res.emmy   = parseInt(m[1],10);
        m = text.match(/Another (\d+) wins?/i);         if(m && m[1]) res.awards = parseInt(m[1],10);
        if(res.awards===0){
            m = text.match(/(\d+) wins?/i);
            if(m && m[1]) res.awards = parseInt(m[1],10);
        }
        return res;
    }

    // ---------------------------------------------------
    // -- ФЕТЧЕРИ --
    // ---------------------------------------------------

    // MDBList: основні рейтинги (imdb 0–10, tmdb 0–10, rt 0–100, mc 0–100, + можлива popcorn)
    function fetchMdbListData(card){
        return new Promise(function(resolve){
            var kind = getCardType(card) === 'tv' ? 'show' : 'movie';
            var cacheKey = kind + '_' + card.id;
            var cached = getCache(MDBLIST_CACHE, cacheKey);
            if(cached) return resolve(cached);

            if(!MDBLIST_API_KEY){
                console.warn('MDBList key not set');
                return resolve({});
            }

            var url = "https://api.mdblist.com/tmdb/" + kind + "/" + card.id + "?apikey=" + MDBLIST_API_KEY;

            new Lampa.Reguest().silent(url, function(data){
                var out = { imdb:0, tmdb:0, rt:0, mc:0, popcorn:0 };
                if(data && Array.isArray(data.ratings)){
                    data.ratings.forEach(function(r){
                        if(r.source === 'imdb')        out.imdb = parseFloat(r.value) || 0;
                        if(r.source === 'tmdb')        out.tmdb = parseFloat(r.value) || 0;
                        if(r.source === 'tomatoes')    out.rt   = parseFloat(r.value) || 0;     // 0–100
                        if(r.source === 'metacritic')  out.mc   = parseFloat(r.value) || 0;     // 0–100
                        if(r.source === 'popcornmeter')out.popcorn = parseFloat(r.value) || 0;  // 0–100
                    });
                }
                setCache(MDBLIST_CACHE, cacheKey, out);
                resolve(out);
            }, function(){ resolve({}); });
        });
    }

    // TMDB → IMDb ID
    function getImdbId(card, cb){
        if(card.imdb_id) return cb(card.imdb_id);
        var kind = getCardType(card);
        var cacheKey = kind + '_' + card.id;
        var cached = getCache(ID_MAPPING_CACHE, cacheKey);
        if(cached) return cb(cached);

        var url = 'https://api.themoviedb.org/3/' + kind + '/' + card.id + '/external_ids?api_key=' + Lampa.TMDB.key();
        new Lampa.Reguest().silent(url, function(data){
            if(data && data.imdb_id){
                setCache(ID_MAPPING_CACHE, cacheKey, data.imdb_id);
                cb(data.imdb_id);
            }else cb(null);
        }, function(){ cb(null); });
    }

    // OMDB: вік, нагороди + фолбек рейтинги
    function fetchOmdbData(card){
        return new Promise(function(resolve){
            getImdbId(card, function(imdbId){
                if(!imdbId || !OMDB_API_KEY) return resolve({});
                var kind = getCardType(card);
                var cacheKey = kind + '_' + imdbId;
                var cached = getCache(AWARDS_CACHE, cacheKey);
                if(cached) return resolve(cached);

                var typeParam = (kind==='tv') ? '&type=series' : '';
                var url = 'https://www.omdbapi.com/?apikey=' + OMDB_API_KEY + '&i=' + imdbId + typeParam;

                new Lampa.Reguest().silent(url, function(data){
                    if(data && data.Response==='True'){
                        var aw = parseAwards(data.Awards || '');
                        var result = {
                            // фолбек-рейтинги (0–100 для RT/MC; 0–10 для IMDb)
                            rt:   extractOmdbRating(data.Ratings, 'Rotten Tomatoes') || 0,
                            mc:   extractOmdbRating(data.Ratings, 'Metacritic') || 0,
                            imdb: (data.imdbRating && data.imdbRating!=='N/A') ? parseFloat(data.imdbRating) : 0,

                            ageRating: data.Rated || null,
                            oscars: aw.oscars,
                            emmy: aw.emmy,
                            awards: aw.awards
                        };
                        setCache(AWARDS_CACHE, cacheKey, result);
                        resolve(result);
                    } else resolve({});
                }, function(){ resolve({}); });
            });
        });
    }

    // ---------------------------------------------------
    // -- ОНОВЛЕННЯ UI --
    // ---------------------------------------------------

    // НЕ чіпаємо базові елементи (ті що вже є): просто наповнюємо їх
    function updateHiddenElements(r){
        var render = Lampa.Activity.active().activity.render(); if(!render || !render[0]) return;

        // Віковий рейтинг
        var pgEl = $('.full-start__pg.hide', render);
        if(pgEl.length && r.ageRating){
            var bad = ['N/A','Not Rated','Unrated'];
            if(bad.indexOf(r.ageRating) === -1){
                pgEl.removeClass('hide').text(AGE_RATINGS[r.ageRating] || r.ageRating);
            }
        }

        // IMDb
        var imdbBox = $('.rate--imdb', render);
        if(imdbBox.length && r.imdb>0){
            imdbBox.removeClass('hide');
            imdbBox.children('div').eq(0).text(parseFloat(r.imdb).toFixed(1)); // 0–10
            imdbBox.children('div').eq(1).html(Lampa.Lang.translate('source_imdb'));
        }

        // TMDB
        var tmdbBox = $('.rate--tmdb', render);
        if(tmdbBox.length && r.tmdb>0){
            tmdbBox.removeClass('hide');
            tmdbBox.children('div').eq(0).text(parseFloat(r.tmdb).toFixed(1)); // 0–10
            tmdbBox.children('div').eq(1).html(Lampa.Lang.translate('source_tmdb'));
        }
    }

    // Підставляємо нові плашки у потрібному порядку:
    // TOTAL → Oscars → Emmy → Awards → TMDB → IMDb → MC → RT → Popcorn
    function insertRatings(r){
        var render = Lampa.Activity.active().activity.render(); if(!render) return;
        var line = $('.full-start-new__rate-line', render); if(!line.length) return;

        // очищаємо наші "додані" блоки (щоб не дублювати при повторному відкритті)
        ['avg','oscars','emmy','awards','mc','rt','popcorn'].forEach(function(cls){
            $('.rate--'+cls, line).remove();
        });

        // --- Нагороди спочатку (prepend в зворотньому порядку, щоб зліва був Oscars, потім Emmy, потім Awards) ---
        if(r.awards>0 && !$('.rate--awards', line).length){
            var awardsEl = $('<div class="full-start__rate rate--awards rate--gold">\
                <div>'+ r.awards +'</div><div class="source--name"></div></div>');
            awardsEl.find('.source--name').html(Lampa.Lang.translate('maxsm_omdb_awards_other'));
            line.prepend(awardsEl);
        }
        if(r.emmy>0 && !$('.rate--emmy', line).length){
            var emmyEl = $('<div class="full-start__rate rate--emmy rate--gold">\
                <div>'+ r.emmy +'</div><div class="source--name"></div></div>');
            emmyEl.find('.source--name').html(Lampa.Lang.translate('maxsm_omdb_emmy'));
            line.prepend(emmyEl);
        }
        if(r.oscars>0 && !$('.rate--oscars', line).length){
            var oscEl = $('<div class="full-start__rate rate--oscars">\
                <div>'+ r.oscars +'</div><div class="source--name"></div></div>');
            oscEl.find('.source--name').html(Lampa.Lang.translate('maxsm_omdb_oscars'));
            line.prepend(oscEl);
        }

        // --- TMDB (залишаємо вбудований блок як є; ми його показуємо в updateHiddenElements) ---

        // --- IMDb (так само) ---

        // --- Metacritic (ціле число, БЕЗ відсотка) ---
        if(r.mc>0 && !$('.rate--mc', line).length){
            var mcInt = Math.round(r.mc); // наприклад 78
            var mcEl = $('<div class="full-start__rate rate--mc">\
                <div>'+ mcInt +'</div><div class="source--name"></div></div>');
            mcEl.find('.source--name').html(Lampa.Lang.translate('source_mc'));
            // після IMDb/TMDB — тобто шукаємо їх і вставляємо після
            var afterEl = $('.rate--imdb', line).length ? $('.rate--imdb', line) : ($('.rate--tmdb', line).length ? $('.rate--tmdb', line) : $('.full-start__rate:last', line));
            if(afterEl.length) mcEl.insertAfter(afterEl); else line.append(mcEl);
        }

        // --- RottenTomatoes (відображення у %, іконка good/bad) ---
        if(r.rt>0 && !$('.rate--rt', line).length){
            var rtInt = Math.round(r.rt);
            var rtIcon = (rtInt >= 60)
                ? iconFromStreaming('rotten-tomatoes.png') // GOOD (зі streamingdiscovery)
                : iconFromGithub('RottenBad.png');         // BAD  (з GitHub)
            var rtEl = $('<div class="full-start__rate rate--rt">\
                <div>'+ rtInt +'%</div><div class="source--name"></div></div>');
            rtEl.find('.source--name').html(rtIcon);
            // після MC
            var afterMc = $('.rate--mc', line).length ? $('.rate--mc', line) : $('.full-start__rate:last', line);
            if(afterMc.length) rtEl.insertAfter(afterMc); else line.append(rtEl);
        }

        // --- PopcornMeter (тільки з GitHub-папки) ---
        if(r.popcorn>0 && !$('.rate--popcorn', line).length){
            var pcInt = Math.round(r.popcorn);
            var pcEl = $('<div class="full-start__rate rate--popcorn">\
                <div>'+ pcInt +'%</div><div class="source--name"></div></div>');
            pcEl.find('.source--name').html(iconFromGithub('popcorn.png'));
            // в самому кінці
            line.append(pcEl);
        }
    }

    // TOTAL (10-бальна, з вагами; RT/MC перетворюємо у 0–10)
    function calculateAverageRating(r){
        var render = Lampa.Activity.active().activity.render(); if(!render) return;
        var line = $('.full-start-new__rate-line', render); if(!line.length) return;

        // очищаємо попередній TOTAL
        $('.rate--avg', line).remove();

        var imdb = r.imdb || 0;           // 0–10
        var tmdb = r.tmdb || 0;           // 0–10
        var mc   = r.mc ? (r.mc/10) : 0;  // 0–100 → 0–10
        var rt   = r.rt ? (r.rt/10) : 0;  // 0–100 → 0–10

        var values = { imdb:imdb, tmdb:tmdb, mc:mc, rt:rt };
        var sum = 0, wsum = 0, count = 0;

        Object.keys(values).forEach(function(k){
            var v = values[k];
            if(v && !isNaN(v) && v>0){
                sum += v * WEIGHTS[k];
                wsum += WEIGHTS[k];
                count++;
            }
        });

        if(count>1 && wsum>0){
            var avg = sum/wsum;
            var cls = getRatingClass(avg);
            var avgEl = $('<div class="full-start__rate rate--avg '+cls+'">\
                <div>'+ avg.toFixed(1) +'</div><div class="source--name">'+Lampa.Lang.translate('ratimg_omdb_avg')+'</div></div>');
            // TOTAL має бути першим
            line.prepend(avgEl);
        }

        removeLoadingAnimation();
        line.css('visibility','visible');
    }

    // ---------------------------------------------------
    // -- КОНТРОЛЕР --
    // ---------------------------------------------------

    function fetchAdditionalRatings(card){
        var render = Lampa.Activity.active().activity.render(); if(!render) return;
        var line = $('.full-start-new__rate-line', render);
        if(line.length){ line.css('visibility','hidden'); addLoadingAnimation(); }

        // паралельно тягнемо обидва джерела
        Promise.all([
            fetchMdbListData(card), // основні рейтинги
            fetchOmdbData(card)     // нагороди, вік + фолбек
        ]).then(function(rs){
            var mdb = rs[0] || {};
            var omd = rs[1] || {};

            // ПРІОРИТЕТ: MDBList → OMDB → card
            var final = {
                imdb:    (mdb.imdb || omd.imdb || card.imdb_rating || 0),
                tmdb:    (mdb.tmdb || card.vote_average || 0),
                rt:      (mdb.rt   || omd.rt   || 0),           // завжди 0–100 для відображення %
                mc:      (mdb.mc   || omd.mc   || 0),           // завжди 0–100, показуємо цілим
                popcorn: (mdb.popcorn || card.popcorn_rating || 0),

                ageRating: omd.ageRating || null,
                oscars:    omd.oscars || 0,
                emmy:      omd.emmy   || 0,
                awards:    omd.awards || 0
            };

            // Оновити існуючі елементи (імовірно приховані)
            updateHiddenElements(final);

            // Додати/оновити наші додаткові плашки в потрібному порядку
            insertRatings(final);

            // TOTAL зверху
            calculateAverageRating(final);

        }).catch(function(err){
            console.error('Ratings load error', err);
            removeLoadingAnimation();
            line && line.css('visibility','visible');
        });
    }

    // ---------------------------------------------------
    // -- ІНІЦІАЛІЗАЦІЯ --
    // ---------------------------------------------------

    function startPlugin(){
        window.combined_ratings_plugin = true;
        Lampa.Listener.follow('full', function(e){
            if(e.type === 'complite'){
                setTimeout(function(){ fetchAdditionalRatings(e.data.movie); }, 500);
            }
        });
    }
    if(!window.combined_ratings_plugin) startPlugin();
})();
