(function () {
    'use strict';

    /**
     * 🔧 CONFIG — головна конфігурація плагіна
     * Тут зберігаються:
     *  - API ключ MDBList
     *  - базовий шлях до SVG іконок
     *  - стилі та кольори для різних джерел рейтингів
     *  - порядок відображення рейтингів
     */
    var CONFIG = {
        // 👉 Сюди встав свій особистий API ключ з https://mdblist.com/
        API_KEY: 'm8po461k1zq14sroj2ez5d7um',

        /**
         * 📂 ICON_BASE_URL — динамічне визначення шляху до SVG-іконок
         * 1. Якщо локальний запуск → бере /wwwroot/img/
         * 2. Якщо на GitHub Pages → бере https://ko31k.github.io/LMP/wwwroot/img/
         * 3. Якщо інше середовище → fallback на GitHub raw (резервний варіант)
         */
        ICON_BASE_URL: (function() {
            var base = window.location.origin;
            var path = window.location.pathname;

            // ✅ Для локального середовища (наприклад, тестування на localhost)
            if (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1') {
                return base + '/wwwroot/img/';
            }

            // ✅ Для GitHub Pages (твоє сховище: ko31k.github.io/LMP/)
            if (window.location.hostname === 'ko31k.github.io') {
                return base + '/LMP/wwwroot/img/';
            }

            // 🔁 Резервний варіант — якщо плагін запущено в іншому місці
            return 'https://raw.githubusercontent.com/ko31k/LMP/main/wwwroot/img/';
        })(),

        /**
         * 🎨 ICONS — набір усіх іконок рейтингових систем із кольорами
         * file: назва SVG файлу
         * bg: колір фону елемента
         * text: основний колір тексту/значення
         */
        ICONS: {
            imdb:         { file: 'imdb.svg',       bg: 'rgba(0,0,0,0.1)', text: '#F5C518' },
            tomatoes:     { file: 'rt.svg',         bg: 'rgba(0,0,0,0.1)', text: '#F93109' },
            tomatoes_bad: { file: 'rt-bad.svg',     bg: 'rgba(0,0,0,0.1)', text: '#00a600' },
            popcorn:      { file: 'pcrn.svg',       bg: 'rgba(0,0,0,0.1)', text: '#FCD24C' },
            tmdb:         { file: 'tmdb.svg',       bg: 'rgba(0,0,0,0.1)', text: '#00b3e5' },
            metacritic:   { file: 'metacritic.svg', bg: 'rgba(0,0,0,0.1)', text: '#FFCC33' }
        },

        /**
         * 📊 Порядок відображення рейтингів на екрані
         * Зверху вниз або зліва направо
         */
        RATING_ORDER: ['tomatoes', 'popcorn', 'imdb', 'tmdb', 'metacritic']
    };

    /**
     * 🌐 Локалізація опису плагіна для різних мов інтерфейсу Lampa
     */
    var LANG = {
        ratings_desc: {
            ru: "Добавляет дополнительные рейтинги",
            en: "Adds additional ratings",
            uk: "Додає додаткові рейтинги"
        }
    };

    // 🔠 Додає локалізовані тексти у Lampa
    function addLocalization() {
        Lampa.Lang.add({
            enhanced_ratings_desc: LANG.ratings_desc
        });
    }

    /**
     * 🧱 Створює HTML-елемент одного рейтингу з іконкою
     * @param {string} source - джерело рейтингу (imdb, tmdb, tomatoes тощо)
     * @param {number} value - числове значення рейтингу
     */
    function createRatingElement(source, value) {
        if (!value || value <= 0) return '';

        var icon = CONFIG.ICONS[source] || CONFIG.ICONS.tmdb;
        var isPercent = ['tomatoes', 'popcorn', 'metacritic'].includes(source);

        // Форматування числа для кожного типу рейтингу
        var displayValue;
        if (source === 'tmdb') {
            // TMDB рейтинг від 0–100 → конвертуємо у шкалу 0–10
            displayValue = (value / 10).toFixed(1);
        } else if (isPercent) {
            displayValue = Math.round(value) + '%';
        } else {
            displayValue = parseFloat(value).toFixed(1);
        }

        // Якщо томатів <50 — міняємо іконку на "погану"
        var finalSource = (source === 'tomatoes' && value < 50) ? 'tomatoes_bad' : source;
        var finalIcon = CONFIG.ICONS[finalSource] || icon;

        // Повертає готовий HTML фрагмент
        return `
            <div class="full-start__rate rate--${finalSource}"
                 style="background:${finalIcon.bg};color:${finalIcon.text}">
                <img src="${CONFIG.ICON_BASE_URL + finalIcon.file}"
                     alt="${finalSource.toUpperCase()}" height="16"
                     onerror="this.style.display='none'">
                <span style="font-weight:bold;">${displayValue}</span>
            </div>`;
    }

    /**
     * 🔎 Збирає всі доступні рейтинги для фільму/серіалу
     * поєднує ті, що прийшли з API і локальні дані з cardData
     */
    function getAllRatings(cardData, apiRatings) {
        var ratings = [];
        var apiSources = {};

        // 1️⃣ Рейтинги з API (MDBList)
        if (apiRatings && apiRatings.length) {
            for (var i = 0; i < apiRatings.length; i++) {
                var rating = apiRatings[i];
                if (rating.value > 0) {
                    if (rating.source === 'tmdb' && cardData.source === 'cub') continue;
                    ratings.push({ source: rating.source, value: rating.value });
                    apiSources[rating.source] = true;
                }
            }
        }

        // 2️⃣ Рейтинги, що зберігаються в самій картці Lampa
        var sourcesToAdd = [
            { source: 'imdb', value: cardData.movie && cardData.movie.imdb_rating },
            { source: 'tmdb', value: cardData.movie && cardData.movie.vote_average },
            { source: 'tomatoes', value: cardData.movie && cardData.movie.rt_rating },
            { source: 'popcorn', value: cardData.movie && cardData.movie.popcorn_rating },
            { source: 'metacritic', value: cardData.movie && cardData.movie.metacritic_rating }
        ];

        // 3️⃣ Додаємо тільки ті, що ще не були в API
        for (var j = 0; j < sourcesToAdd.length; j++) {
            var item = sourcesToAdd[j];
            if (item.value > 0 && !apiSources[item.source]) {
                var finalValue = item.value;
                if (item.source === 'tmdb' && item.value > 10) {
                    finalValue = item.value / 10;
                }
                ratings.push({ source: item.source, value: finalValue });
            }
        }

        // 4️⃣ Видаляємо дублікати джерел
        var uniqueRatings = [];
        var seenSources = {};
        for (var k = 0; k < ratings.length; k++) {
            var rating = ratings[k];
            if (!seenSources[rating.source]) {
                uniqueRatings.push(rating);
                seenSources[rating.source] = true;
            }
        }

        // 5️⃣ Фільтруємо тільки потрібні джерела і сортуємо
        var allowedSources = ['imdb', 'tomatoes', 'popcorn', 'metacritic', 'tmdb'];
        var filteredRatings = uniqueRatings.filter(r => allowedSources.includes(r.source));

        return filteredRatings.sort(function(a, b) {
            var indexA = CONFIG.RATING_ORDER.indexOf(a.source);
            var indexB = CONFIG.RATING_ORDER.indexOf(b.source);
            return indexA - indexB;
        });
    }

    /**
     * 🎬 Відображає всі зібрані рейтинги в інтерфейсі Lampa
     */
    function displayRatings(cardData, ratings) {
        var rateLine = $(".full-start-new__rate-line");
        if (!rateLine.length) {
            console.log('Rating line not found, skipping ratings display');
            return;
        }

        var pgElement = $(".full-start__pg");
        var statusElement = $(".full-start__status");

        // Очищення та базове форматування контейнера
        rateLine.empty().css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center'
        });

        var allRatings = getAllRatings(cardData, ratings);

        // Додаємо кожен рейтинг у DOM
        for (var i = 0; i < allRatings.length; i++) {
            var rating = allRatings[i];
            var ratingElement = createRatingElement(rating.source, rating.value);
            if (ratingElement) rateLine.append(ratingElement);
        }

        // Додаємо решту елементів Lampa (вік, статус тощо)
        if (pgElement.length) rateLine.append(pgElement);
        if (statusElement.length) rateLine.append(statusElement);

        // Якщо рейтингів немає
        if (rateLine.children().length === 0) {
            rateLine.html('<div style="color:#999;font-size:14px;">Рейтинги не знайдені</div>');
        }
    }

    /**
     * 🌍 Завантажує рейтинги з API MDBList
     */
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

    /**
     * 🧩 Основна логіка підключення плагіна до Lampa
     */
    function main() {
        // Слухає подію "full complite" — коли сторінка фільму повністю завантажена
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                loadRatings(e.object);
            }
        });
    }

    /**
     * 🚀 Ініціалізація плагіна (один раз)
     */
    function initPlugin() {
        addLocalization();
        main();

        // Додаємо CSS стилі для рейтингових блоків
        $('<style>').text(`
            .full-start__rate {
                display:inline-flex;
                align-items:center;
                gap:6px;
                padding:7px 7px;
                border-radius:9px;
                font-size:15px;
                font-weight:bold;
                text-shadow:0 1px 2px rgba(0,0,0,0.1);
                z-index:10;
                position:relative;
            }
            .full-start__rate img {
                height:20px;
                width:auto;
            }
        `).appendTo('head');
    }

    /**
     * 🛠 Глобальний блок ініціалізації
     * Запускається тільки один раз, щоб уникнути дублювання плагіна
     */
    if (!window.plugin_enhanced_ratings) {
        window.plugin_enhanced_ratings = true;
        console.log('✅ Enhanced Ratings plugin initialized');

        var manifest = {
            type: "other",
            version: "0.0.9",
            author: 'ko31k',
            name: "Enhanced Ratings",
            description: "Adds ratings with SVG icons from multiple sources"
        };

        // Якщо Lampa вже готова
        if (window.appready) {
            initPlugin();
        } else {
            // Інакше чекаємо подію готовності
            Lampa.Listener.follow('app', function(e) {
                if (e.type === 'ready') initPlugin();
            });
        }
    }
})();
