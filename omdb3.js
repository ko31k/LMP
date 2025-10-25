(function() {
    'use strict';

    // ===================================================
    // ============== К О Н Ф І Г У Р А Ц І Я ============
    // ===================================================

    /**
     * Ключ для MDBList (основні рейтинги: IMDb/TMDB/RT/MC)
     * https://api.mdblist.com
     */
    var MDBLIST_API_KEY = 'm8po461k1zq14sroj2ez5d7um'; // 👈 заміни за потреби

    /**
     * Ключ OMDb (нагороди, віковий рейтинг, фолбек рейтинги)
     * https://www.omdbapi.com
     */
    var OMDB_API_KEY = window.RATINGS_PLUGIN_TOKENS?.OMDB_API_KEY || '12c9249c';

    /**
     * Брати іконки у кольорі (користувач просив КОЛЬОРОВІ)
     */
    var USE_GRAYSCALE_ICONS = false;

    /**
     * Базовий URL для додаткових іконок (RT bad / popcorn тощо)
     * (RT bad — з твоєї GitHub-папки; інші — як у тебе далі у коді)
     */
    var ICON_BASE_URL = 'https://raw.githubusercontent.com/ko31k/LMPStyle/main/wwwroot/';

    /**
     * Ваги для TOTAL (усе конвертуємо в /10 перед розрахунком)
     * IMDb 40% + TMDB 40% + MC 10% + RT 10%
     */
    var WEIGHTS = { imdb: 0.40, tmdb: 0.40, mc: 0.10, rt: 0.10 };

    /**
     * Кеш: 3 дні
     */
    var CACHE_TIME = 3 * 24 * 60 * 60 * 1000;
    var AWARDS_CACHE = 'maxsm_rating_omdb';      // OMDb (нагороди, Rated, фолбек)
    var MDBLIST_CACHE = 'maxsm_rating_mdblist';  // MDBList (рейтинги)
    var ID_MAPPING_CACHE = 'maxsm_rating_id_mapping';

    /**
     * Вік-рейтинги → короткий формат
     */
    var AGE_RATINGS = {
        'G':'3+','PG':'6+','PG-13':'13+','R':'17+','NC-17':'18+',
        'TV-Y':'0+','TV-Y7':'7+','TV-G':'3+','TV-PG':'6+','TV-14':'14+','TV-MA':'17+'
    };

    // ===================================================
    // ================== І К О Н К И ====================
    // ===================================================

    // Глобальний фільтр для ч/б (нам НЕ треба, але збережемо опцію)
    var grayscaleFilter = USE_GRAYSCALE_ICONS ? 'filter: grayscale(100%);' : '';

    // Іконка RT (GOOD) — із твого payload (base64)
    var RT_GOOD_IMG = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8KPCF...'; // ⚠️ скорочено: підстав свій повний base64 з твого повідомлення

    // Іконка RT (BAD) — з GitHub папки
    var RT_BAD_FILE = ICON_BASE_URL + 'RottenBad.png';

    // Popcorn іконка з GitHub (як домовлялися)
    var POPCORN_FILE = ICON_BASE_URL + 'popcorn.png';

    // IMDb / TMDB / Metacritic — як у streamingdiscovery
    var ICON_IMDB = 'https://www.streamingdiscovery.com/logo/imdb.png';
    var ICON_TMDB = 'https://www.streamingdiscovery.com/logo/tmdb.png';
    var ICON_MC   = 'https://www.streamingdiscovery.com/logo/metacritic.png';

    // OSCAR (іконка з твого блоку, base64)
    var OSCAR_IMG = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8KPHN2Zy...'; // ⚠️ скорочено: підстав свій повний base64 з твого блоку Lampa.Lang.add

    // EMMY (візьми svg з твого блоку emmy_svg)
    var EMMY_SVG = (function(){/*
      (тут твій повний emmy_svg – довгий <svg ...>...</svg>)
    */}).toString().split('\n').slice(1,-1).join('\n');

    // Хелпер: IMG-тег іконки з потрібним розміром
    function iconImg(src, sizePx) {
        return '<img src="'+src+'" style="height:'+sizePx+'px;width:auto;display:inline-block;vertical-align:middle;object-fit:contain;'+grayscaleFilter+'">';
    }

    // Хелпер: SVG (Emmy) в контейнері розміру
    function iconSvg(svg, sizePx) {
        return '<span style="display:inline-block;height:'+sizePx+'px;vertical-align:middle;transform:translateY(1px)">'+svg+'</span>';
    }

    // ===================================================
    // ============= Л О К А Л І З А Ц І Я ===============
    // ===================================================

    // Підміняємо джерела (назви під іконками), і «TOTAL», «Awards», тощо
    Lampa.Lang.add({
        ratimg_omdb_avg: {
            ru: 'ИТОГ',
            en: 'TOTAL',
            uk: '<svg width="16px" height="16px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#FFAC33" d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379z"></path></svg>',
            be: 'ВЫНІК'
        },
        loading_dots: {
            ru: 'Загрузка рейтингов',
            en: 'Loading ratings',
            uk: 'Трішки зачекаємо ...',
            be: 'Загрузка рэйтынгаў'
        },
        // Джерела
        source_imdb: { ru:'IMDB', en:'IMDB', uk: iconImg(ICON_IMDB,16), be:'IMDB' },
        source_tmdb: { ru:'TMDB', en:'TMDB', uk: iconImg(ICON_TMDB,16), be:'TMDB' },
        source_mc:   { ru:'Metacritic', en:'Metacritic', uk: iconImg(ICON_MC,16), be:'Metacritic' },
        source_rt:   { ru:'Rotten Tomatoes', en:'Rotten Tomatoes', uk: iconImg(RT_GOOD_IMG,16), be:'Rotten Tomatoes' },

        // Нагороди (золотий колір; іконки — як просив)
        maxsm_omdb_oscars: { ru:'Оскары', en:'Oscars', uk: iconImg(OSCAR_IMG,16), be:'Оскары' },
        maxsm_omdb_emmy:   { ru: iconSvg(EMMY_SVG,14), en: iconSvg(EMMY_SVG,14), uk: iconSvg(EMMY_SVG,14) },
        maxsm_omdb_awards_other: {
            ru:'<span style="display:inline-block;height:14px;vertical-align:middle">🏆</span>',
            en:'<span style="display:inline-block;height:14px;vertical-align:middle">🏆</span>',
            uk:'<span style="display:inline-block;height:14px;vertical-align:middle">🏆</span>'
        }
    });

    // ===================================================
    // =================== С Т И Л І =====================
    // ===================================================

    // Візуал як у Enchancer: великі іконки/числа, але з напівпрозорою КАПСУЛОЮ
    var style = `
    <style id="maxsm_omdb_rating">
        .full-start-new__rate-line{
            position:relative;
            visibility:hidden;
            display:flex;
            flex-wrap:wrap;
            gap:.45em .55em;
        }
        .full-start-new__rate-line > *{
            margin:0 !important;
        }
        /* капсула */
        .rate-chip{
            display:inline-flex;
            align-items:center;
            gap:.45em;
            padding:.24em .6em;
            border-radius:10px;
            background: rgba(0,0,0,.35);
            backdrop-filter: blur(2px);
            line-height:1;
        }
        .rate-chip .value{
            font-weight:700;
            font-size:14px; /* як у Enchancer */
            letter-spacing:.3px;
        }
        .rate-chip .src{
            display:inline-flex;
            align-items:center;
            line-height:1;
        }
        /* кольори TOTAL */
        .rate--avg.rating--green  { color:#4caf50; }
        .rate--avg.rating--lime   { color:#3399ff; }
        .rate--avg.rating--orange { color:#ff9933; }
        .rate--avg.rating--red    { color:#f44336; }

        /* золото для нагород */
        .rate--oscars .value,
        .rate--emmy .value,
        .rate--awards .value{
            color:#FFD54F; /* золотистий; якщо нема кольору — помаранчевий */
        }

        /* іконка всередині капсули */
        .rate-chip img,
        .rate-chip svg{
            height:16px; /* як у Enchancer */
            width:auto;
            display:inline-block;
            vertical-align:middle;
            object-fit:contain;
            ${grayscaleFilter}
        }

        /* проміжні відступи щоб шеренга була щільною */
        .full-start__rate{ margin:0 !important; }
    </style>`;
    Lampa.Template.add('card_css', style);
    $('body').append(Lampa.Template.get('card_css', {}, true));

    // Лоадер
    var loadingCss = `
    <style id="maxsm_loading_animation">
        .loading-dots-container{
            position:absolute; top:50%; left:0; right:0;
            transform:translateY(-50%);
            z-index:10;
        }
        .loading-dots{
            display:inline-flex; align-items:center; gap:.5em;
            color:#fff; font-size:.95em;
            background:rgba(0,0,0,.35);
            padding:.5em .9em; border-radius:.6em;
        }
        .loading-dots__dot{
            width:.5em;height:.5em;border-radius:50%;
            background:currentColor; animation:ldots 1.4s infinite ease-in-out both;
        }
        .loading-dots__dot:nth-child(1){ animation-delay:-.32s; }
        .loading-dots__dot:nth-child(2){ animation-delay:-.16s; }
        @keyframes ldots {
            0%,80%,100%{ transform:translateY(0); opacity:.6;}
            40%{ transform:translateY(-.45em); opacity:1;}
        }
    </style>`;
    Lampa.Template.add('loading_animation_css', loadingCss);
    $('body').append(Lampa.Template.get('loading_animation_css', {}, true));

    // ===================================================
    // =============== У Т И Л І Т И =====================
    // ===================================================

    function addLoadingAnimation(){
        var render = Lampa.Activity.active().activity.render();
        if(!render) return;
        var line = $('.full-start-new__rate-line', render);
        if(!line.length || $('.loading-dots-container', line).length) return;
        line.append(
            '<div class="loading-dots-container">'+
              '<div class="loading-dots">'+
                '<span class="loading-dots__text">'+Lampa.Lang.translate('loading_dots')+'</span>'+
                '<span class="loading-dots__dot"></span>'+
                '<span class="loading-dots__dot"></span>'+
                '<span class="loading-dots__dot"></span>'+
              '</div>'+
            '</div>'
        );
        $('.loading-dots-container', line).css({opacity:'1',visibility:'visible'});
    }
    function removeLoadingAnimation(){
        var render = Lampa.Activity.active().activity.render();
        if(!render) return;
        $('.loading-dots-container', render).remove();
    }

    function getCardType(card){
        var t = card.media_type || card.type;
        if(t==='movie'||t==='tv') return t;
        return card.name || card.original_name ? 'tv' : 'movie';
    }

    function getRatingClass(v){ // для TOTAL
        if(v>=8.0) return 'rating--green';
        if(v>=6.0) return 'rating--lime';
        if(v>=5.5) return 'rating--orange';
        return 'rating--red';
    }

    function getCache(cacheName, key){
        var cache = Lampa.Storage.get(cacheName)||{};
        var it = cache[key];
        return it && (Date.now()-it.timestamp<CACHE_TIME) ? it.data : null;
    }
    function setCache(cacheName, key, data){
        var cache = Lampa.Storage.get(cacheName)||{};
        cache[key] = { data:data, timestamp:Date.now() };
        Lampa.Storage.set(cacheName, cache);
    }

    function getImdbId(card, cb){
        if(card.imdb_id) return cb(card.imdb_id);
        var type = getCardType(card);
        var ckey = type+'_'+card.id;
        var cached = getCache(ID_MAPPING_CACHE, ckey);
        if(cached) return cb(cached);

        var url = 'https://api.themoviedb.org/3/'+type+'/'+card.id+'/external_ids?api_key='+Lampa.TMDB.key();
        new Lampa.Reguest().silent(url,function(d){
            if(d && d.imdb_id){
                setCache(ID_MAPPING_CACHE, ckey, d.imdb_id);
                cb(d.imdb_id);
            }else cb(null);
        },function(){ cb(null); });
    }

    // Парсимо OMDb нагороди
    function parseAwards(text){
        if(typeof text!=='string') return {oscars:0,emmy:0,awards:0};
        var r={oscars:0,emmy:0,awards:0};
        var m1=text.match(/Won (\d+) Oscars?/i); if(m1) r.oscars=parseInt(m1[1],10);
        var m2=text.match(/Won (\d+) Primetime Emmys?/i); if(m2) r.emmy=parseInt(m2[1],10);
        var m3=text.match(/Another (\d+) wins?/i); if(m3) r.awards=parseInt(m3[1],10);
        if(r.awards===0){
            var s=text.match(/(\d+) wins?/i); if(s) r.awards=parseInt(s[1],10);
        }
        return r;
    }

    // ===================================================
    // ============= А П І  В И К Л И ====================
    // ===================================================

    // MDBList: основні рейтинги
    function fetchMdbListData(card){
        return new Promise(function(resolve){
            var ctype = getCardType(card)==='tv'?'show':'movie';
            var ckey = ctype+'_'+card.id;
            var cached = getCache(MDBLIST_CACHE, ckey);
            if(cached) return resolve(cached);

            var url = 'https://api.mdblist.com/tmdb/'+ctype+'/'+card.id+'?apikey='+MDBLIST_API_KEY;
            new Lampa.Reguest().silent(url,function(d){
                var r={imdb:0, tmdb:0, rt:0, mc:0};
                if(d && d.ratings && d.ratings.length){
                    d.ratings.forEach(function(x){
                        if(x.source==='imdb')       r.imdb=parseFloat(x.value)||0;          // 0–10
                        if(x.source==='tmdb')       r.tmdb=parseFloat(x.value)||0;          // 0–10
                        if(x.source==='tomatoes')   r.rt=Math.round(parseFloat(x.value)||0);// 0–100
                        if(x.source==='metacritic') r.mc=Math.round(parseFloat(x.value)||0);// 0–100
                    });
                }
                setCache(MDBLIST_CACHE, ckey, r);
                resolve(r);
            },function(){ resolve({}); });
        });
    }

    // OMDb: нагороди + Rated + фолбек рейтингів
    function fetchOmdbData(card){
        return new Promise(function(resolve){
            getImdbId(card, function(imdbId){
                if(!imdbId) return resolve({});
                var type = getCardType(card);
                var ckey = type+'_'+imdbId;
                var cached = getCache(AWARDS_CACHE, ckey);
                if(cached) return resolve(cached);

                var typeParam = (type==='tv') ? '&type=series' : '';
                var url = 'https://www.omdbapi.com/?apikey='+OMDB_API_KEY+'&i='+imdbId+typeParam;

                new Lampa.Reguest().silent(url,function(d){
                    if(d && d.Response==='True'){
                        var awards = parseAwards(d.Awards||'');
                        var out = {
                            // фолбеки
                            imdb: (d.imdbRating && d.imdbRating!=="N/A") ? parseFloat(d.imdbRating) : 0, // 0–10
                            rt:   omdbExtract(d.Ratings,'Rotten Tomatoes'), // повернемо 0–100
                            mc:   omdbExtract(d.Ratings,'Metacritic'),      // повернемо 0–100 (число)
                            ageRating: d.Rated || null,
                            oscars: awards.oscars,
                            emmy: awards.emmy,
                            awards: awards.awards
                        };
                        setCache(AWARDS_CACHE, ckey, out);
                        resolve(out);
                    } else resolve({});
                },function(){ resolve({}); });
            });
        });
    }

    function omdbExtract(ratings, source){
        if(!ratings || !Array.isArray(ratings)) return 0;
        for(var i=0;i<ratings.length;i++){
            var it = ratings[i];
            if(it.Source===source){
                try{
                    if(source==='Rotten Tomatoes'){ // "92%"
                        return Math.round(parseFloat(it.Value.replace('%',''))||0);
                    }else if(source==='Metacritic'){ // "78/100"
                        return Math.round(parseFloat(it.Value.split('/')[0])||0);
                    }
                }catch(e){ return 0; }
            }
        }
        return 0;
    }

    // ===================================================
    // =================== U I  Б Л О К ==================
    // ===================================================

    function chip(valueHtml, sourceHtml, extraClass){
        extraClass = extraClass||'';
        return (
            '<div class="full-start__rate rate-chip '+extraClass+'">'+
                '<div class="value">'+valueHtml+'</div>'+
                '<div class="src">'+sourceHtml+'</div>'+
            '</div>'
        );
    }

    // Віковий рейтинг + IMDb/TMDB (сховані штатні) — оновлюємо
    function updateHiddenBuiltIns(r){
        var render = Lampa.Activity.active().activity.render();
        if(!render||!render[0]) return;

        // Вік
        var pg = $('.full-start__pg.hide', render);
        if(pg.length && r.ageRating){
            var bad = ['N/A','Not Rated','Unrated'];
            if(bad.indexOf(r.ageRating)===-1){
                pg.removeClass('hide').text(AGE_RATINGS[r.ageRating]||r.ageRating);
            }
        }

        // IMDb
        var imdbC = $('.rate--imdb', render);
        if(imdbC.length && r.imdb>0){
            imdbC.removeClass('hide');
            imdbC.children('div').eq(0).text(parseFloat(r.imdb).toFixed(1));
            imdbC.children('div').eq(1).html(Lampa.Lang.translate('source_imdb'));
        }

        // TMDB
        var tmdbC = $('.rate--tmdb', render);
        if(tmdbC.length && r.tmdb>0){
            tmdbC.removeClass('hide');
            tmdbC.children('div').eq(0).text(parseFloat(r.tmdb).toFixed(1));
            tmdbC.children('div').eq(1).html(Lampa.Lang.translate('source_tmdb'));
        }
    }

    // Вставка кастомних чипів у твоєму ПОРЯДКУ:
    // TOTAL → Oscars → Emmy → Awards → TMDB → IMDb → MC → RT → Popcorn
    function insertChips(r){
        var render = Lampa.Activity.active().activity.render();
        if(!render) return;
        var line = $('.full-start-new__rate-line', render);
        if(!line.length) return;

        // Почистимо наші попередні
        line.find('.rate-chip.rate--avg,.rate-chip.rate--oscars,.rate-chip.rate--emmy,.rate-chip.rate--awards,.rate-chip.rate--tmdb2,.rate-chip.rate--imdb2,.rate-chip.rate--mc,.rate-chip.rate--rt,.rate-chip.rate--popcorn').remove();

        // 1) TOTAL (якщо є хоча б 2 джерела з вагами > 0)
        var total = calcTotal(r);
        if(total.show){
            var cls = getRatingClass(total.value);
            var totalHtml = chip(total.value.toFixed(1), Lampa.Lang.translate('ratimg_omdb_avg'), 'rate--avg '+cls);
            line.prepend(totalHtml);
        }

        // 2) Нагороди (Oscars → Emmy → Awards)
        if(r.oscars>0){
            line.append( chip(r.oscars, Lampa.Lang.translate('maxsm_omdb_oscars'), 'rate--oscars') );
        }
        if(r.emmy>0){
            line.append( chip(r.emmy, Lampa.Lang.translate('maxsm_omdb_emmy'), 'rate--emmy') );
        }
        if(r.awards>0){
            line.append( chip(r.awards, Lampa.Lang.translate('maxsm_omdb_awards_other'), 'rate--awards') );
        }

        // 3) TMDB (десяткова)
        if(r.tmdb>0){
            line.append( chip(parseFloat(r.tmdb).toFixed(1), Lampa.Lang.translate('source_tmdb'), 'rate--tmdb2') );
        }

        // 4) IMDb (десяткова)
        if(r.imdb>0){
            line.append( chip(parseFloat(r.imdb).toFixed(1), Lampa.Lang.translate('source_imdb'), 'rate--imdb2') );
        }

        // 5) Metacritic — ЦІЛЕ (наприклад, 78) — БЕЗ «%»
        if(r.mc>0){
            line.append( chip(parseInt(r.mc,10), Lampa.Lang.translate('source_mc'), 'rate--mc') );
        }

        // 6) Rotten Tomatoes — показуємо у %
        if(r.rt>0){
            // ≥60 — GOOD (твій критерій 60+ good, ≤59 bad)
            var isGood = r.rt>=60;
            var rtIcon = isGood ? iconImg(RT_GOOD_IMG,16) : iconImg(RT_BAD_FILE,16);
            var rtHtml = chip( parseInt(r.rt,10), rtIcon, 'rate--rt' );
            line.append(rtHtml);
        }

        // 7) PopcornMeter (якщо прийшов)
        if(r.popcorn>0){
            line.append( chip(parseInt(r.popcorn,10), iconImg(POPCORN_FILE,16), 'rate--popcorn') );
        }
    }

    function calcTotal(r){
        // все в /10
        var imdb = r.imdb||0;             // вже /10
        var tmdb = r.tmdb||0;             // вже /10
        var mc   = r.mc ? (r.mc/10) : 0;  // 0–100 → /10
        var rt   = r.rt ? (r.rt/10) : 0;  // 0–100 → /10

        var wsum=0, s=0, count=0;
        if(imdb>0){ s+=imdb*WEIGHTS.imdb; wsum+=WEIGHTS.imdb; count++; }
        if(tmdb>0){ s+=tmdb*WEIGHTS.tmdb; wsum+=WEIGHTS.tmdb; count++; }
        if(mc>0){   s+=mc*WEIGHTS.mc;     wsum+=WEIGHTS.mc;   count++; }
        if(rt>0){   s+=rt*WEIGHTS.rt;     wsum+=WEIGHTS.rt;   count++; }

        if(count>1 && wsum>0){
            return { show:true, value:(s/wsum) };
        }
        return { show:false, value:0 };
    }

    // ===================================================
    // =========== Г О Л О В Н И Й   П О Т О К ===========
    // ===================================================

    function fetchAdditionalRatings(card){
        var render = Lampa.Activity.active().activity.render();
        if(!render) return;

        var line = $('.full-start-new__rate-line', render);
        if(line.length){
            line.css('visibility','hidden');
            addLoadingAnimation();
        }

        // Попкорн одразу з картки (якщо є)
        var popcornFromCard = card.popcorn_rating || 0;

        // Паралельно тягнемо OMDb + MDBList
        Promise.all([
            fetchOmdbData(card),
            fetchMdbListData(card)
        ]).then(function(res){
            var omdb = res[0]||{};
            var mdb  = res[1]||{};

            // Фінальний набір (MDBList пріоритет, OMDb як фолбек)
            var final = {
                imdb: mdb.imdb || omdb.imdb || card.imdb_rating || 0, // /10
                tmdb: mdb.tmdb || (card.vote_average ? parseFloat(card.vote_average) : 0) || 0, // /10
                rt:   mdb.rt   || omdb.rt   || 0, // 0–100, у UI показуємо %
                mc:   mdb.mc   || omdb.mc   || 0, // 0–100, у UI — цілим, без %
                popcorn: popcornFromCard ? Math.round(popcornFromCard) : 0, // %
                ageRating: omdb.ageRating || null,
                oscars: omdb.oscars||0,
                emmy: omdb.emmy||0,
                awards: omdb.awards||0
            };

            // Оновлюємо штатні сховані: PG/IMDb/TMDB
            updateHiddenBuiltIns(final);
            // Наші «капсули» у твоєму порядку
            insertChips(final);

        }).catch(function(err){
            console.error('Ratings load error', err);
        }).finally(function(){
            removeLoadingAnimation();
            line && line.css('visibility','visible');
        });
    }

    // ===================================================
    // ================= І Н І Ц І А Л І З А Ц І Я =======
    // ===================================================

    function startPlugin(){
        window.combined_ratings_plugin = true;
        Lampa.Listener.follow('full', function(e){
            if(e.type==='complite'){
                setTimeout(function(){
                    fetchAdditionalRatings(e.data.movie);
                }, 500);
            }
        });
    }
    if(!window.combined_ratings_plugin) startPlugin();
})();
