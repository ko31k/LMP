(function () {
    'use strict';

    // Конфигурация плагина
    var CONFIG = {
        API_KEY: 'm8po461k1zq14sroj2ez5d7um',

        // Базовий URL для SVG-іконок
        ICON_BASE_URL: (function() {
            var base = window.location.origin;

            // Якщо локально — використовуємо локальні іконки
            if (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1') {
                return base + '/wwwroot/img/';
            }

            // Якщо не локально — підтягуємо з GitHub RAW
            return 'https://raw.githubusercontent.com/ko31k/LMP/main/wwwroot/img/';
        })(),

        ICONS: {
            imdb: { file: 'imdb.svg', bg: 'rgba(0,0,0,0.1)', text: '#F5C518' },
            tomatoes: { file: 'rt.svg', bg: 'rgba(0,0,0,0.1)', text: '#F93109' },
            tomatoes_bad: { file: 'rt-bad.svg', bg: 'rgba(0,0,0,0.1)', text: '#00a600' },
            popcorn: { file: 'pcrn.svg', bg: 'rgba(0,0,0,0.1)', text: '#FCD24C' },
            tmdb: { file: 'tmdb.svg', bg: 'rgba(0,0,0,0.1)', text: '#00b3e5' },
            metacritic: { file: 'metacritic.svg', bg: 'rgba(0,0,0,0.1)', text: '#FFCC33' }
        },

        RATING_ORDER: ['tomatoes', 'popcorn', 'imdb', 'tmdb', 'metacritic']
    };

    // Локализация
    var LANG = {
        ratings_desc: {
            ru: "Добавляет дополнительные рейтинги",
            en: "Adds additional ratings",
            uk: "Додає додаткові рейтинги"
        }
    };

    function addLocalization() {
        Lampa.Lang.add({
            enhanced_ratings_desc: LANG.ratings_desc
        });
    }

    function createRatingElement(source, value) {
        if (!value || value <= 0) return '';

        var icon = CONFIG.ICONS[source] || CONFIG.ICONS.tmdb;
        var isPercent = source === 'tomatoes' || source === 'popcorn' || source === 'metacritic';

        var displayValue;
        if (source === 'tmdb') {
            displayValue = (value / 10).toFixed(1);
        } else if (isPercent) {
            displayValue = Math.round(value) + '%';
        } else {
            displayValue = parseFloat(value).toFixed(1);
        }

        var finalSource = (source === 'tomatoes' && value < 50) ? 'tomatoes_bad' : source;
        var finalIcon = CONFIG.ICONS[finalSource] || icon;

        return '<div class="full-start__rate rate--' + finalSource + '" ' +
            'style="background:' + finalIcon.bg + ';color:' + finalIcon.text + '">' +
            '<img src="' + CONFIG.ICON_BASE_URL + finalIcon.file + '" ' +
            'alt="' + finalSource.toUpperCase() + '" height="16" ' +
            'onerror="this.style.display=\'none\'">' +
            '<span style="font-weight:bold;">' + displayValue + '</span>' +
            '</div>';
    }

    function getAllRatings(cardData, apiRatings) {
        var ratings = [];
        var apiSources = {};

        if (apiRatings && apiRatings.length) {
            for (var i = 0; i < apiRatings.length; i++) {
                var rating = apiRatings[i];
                if (rating.value > 0) {
                    if (rating.source === 'tmdb' && cardData.source === 'cub') continue;

                    ratings.push({
                        source: rating.source,
                        value: rating.value
                    });
                    apiSources[rating.source] = true;
                }
            }
        }

        var sourcesToAdd = [
            { source: 'imdb', value: cardData.movie && cardData.movie.imdb_rating },
            { source: 'tmdb', value: cardData.movie && cardData.movie.vote_average },
            { source: 'tomatoes', value: cardData.movie && cardData.movie.rt_rating },
            { source: 'popcorn', value: cardData.movie && cardData.movie.popcorn_rating },
            { source: 'metacritic', value: cardData.movie && cardData.movie.metacritic_rating }
        ];

        for (var j = 0; j < sourcesToAdd.length; j++) {
            var item = sourcesToAdd[j];
            if (item.value > 0 && !apiSources[item.source]) {
                var finalValue = item.value;
                if (item.source === 'tmdb' && item.value > 10) {
                    finalValue = item.value / 10;
                }
                ratings.push({
                    source: item.source,
                    value: finalValue
                });
            }
        }

        var uniqueRatings = [];
        var seenSources = {};

        for (var k = 0; k < ratings.length; k++) {
            var rating = ratings[k];
            if (!seenSources[rating.source]) {
                uniqueRatings.push(rating);
                seenSources[rating.source] = true;
            }
        }

        var allowedSources = ['imdb', 'tomatoes', 'popcorn', 'metacritic', 'tmdb'];
        var filteredRatings = uniqueRatings.filter(function(r) {
            return allowedSources.includes(r.source);
        });

        return filteredRatings.sort(function(a, b) {
            var indexA = CONFIG.RATING_ORDER.indexOf(a.source);
            var indexB = CONFIG.RATING_ORDER.indexOf(b.source);
            return indexA - indexB;
        });
    }

    function displayRatings(cardData, ratings) {
        var rateLine = $(".full-start-new__rate-line");
        if (!rateLine.length) {
            console.log('Rating line not found, skipping ratings display');
            return;
        }

        var pgElement = $(".full-start__pg");
        var statusElement = $(".full-start__status");

        rateLine.empty().css({
            'display': 'flex',
            'flex-wrap': 'wrap',
            'gap': '8px',
            'align-items': 'center'
        });

        var allRatings = getAllRatings(cardData, ratings);

        for (var i = 0; i < allRatings.length; i++) {
            var rating = allRatings[i];
            var ratingElement = createRatingElement(rating.source, rating.value);
            if (ratingElement) rateLine.append(ratingElement);
        }

        if (pgElement.length) rateLine.append(pgElement);
        if (statusElement.length) rateLine.append(statusElement);

        if (rateLine.children().length === 0) {
            rateLine.html('<div style="color:#999;font-size:14px;">Рейтинги не знайдені</div>');
        }
    }

    function loadRatings(cardData) {
        var type = cardData.method === 'tv' ? 'show' : cardData.method;
        var url = 'https://api.mdblist.com/tmdb/' + type + '/' + cardData.id + '?apikey=' + CONFIG.API_KEY;

        $.ajax({
            url: url,
            method: "GET",
            timeout: 5000
        })
        .done(function(response) {
            displayRatings(cardData, response.ratings || []);
        })
        .fail(function() {
            console.warn('MDBList API unavailable, using fallback ratings');
            displayRatings(cardData, []);
        });
    }

    function main() {
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                loadRatings(e.object);
            }
        });
    }

    function initPlugin() {
        addLocalization();
        main();

        $('<style>').text(
            '.full-start__rate {' +
            'display:inline-flex;' +
            'align-items:center;' +
            'gap:6px;' +
            'padding:7px 7px;' +
            'border-radius:9px;' +
            'font-size:15px;' +
            'font-weight:bold;' +
            'text-shadow:0 1px 2px rgba(0,0,0,0.1);' +
            'z-index:10;' +
            'position:relative;' +
            '}' +
            '.full-start__rate img {' +
            'height:20px;' +
            'width:auto;' +
            '}'
        ).appendTo('head');
    }

    if (!window.plugin_enhanced_ratings) {
        window.plugin_enhanced_ratings = true;
        console.log('Enhanced Ratings plugin initialized');

        var manifest = {
            type: "other",
            version: "0.0.8",
            author: 'ko31k',
            name: "Enhanced Ratings",
            description: "Adds ratings with SVG icons from GitHub"
        };

        if (window.appready) {
            initPlugin();
        } else {
            Lampa.Listener.follow('app', function(e) {
                if (e.type === 'ready') {
                    initPlugin();
                }
            });
        }
    }
})();
