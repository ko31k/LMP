/*
 * Lampa Track Finder v3
 * --------------------------------------------------------------------------------
 * Цей плагін призначений для пошуку та відображення інформації про наявність
 * українських аудіодоріжок у торент релізах, доступних через Jacred API.
 * --------------------------------------------------------------------------------
 * - Виконує паралельний пошук за оригінальною та локалізованою назвою для максимального охоплення.
 * - Обирає реліз з найбільшою кількістю знайдених українських доріжок.
 * - Має надійний дворівневий фільтр для розрізнення фільмів та серіалів.
 * - Відображає мітку на постерах (динамічно адаптується до присутності плагіна RatingUp.js).
 */

(function () {
    'use strict';
    var ukraineFlagSVG = '<i class="flag-css"></i>';
    var LTF_CONFIG = window.LTF_CONFIG || {
        WRK_B: '',
        WRK_K: '',
        BADGE_STYLE: 'flag_count',
        SHOW_FOR_TV: true,
        CACHE_VERSION: 4,
        CACHE_KEY: 'lampa_ukr_tracks_cache',
        CACHE_VALID_TIME_MS: 48 * 60 * 60 * 1000,
        CACHE_REFRESH_THRESHOLD_MS: 24 * 60 * 60 * 1000,
        LOGGING_GENERAL: true,
        LOGGING_TRACKS: false,
        LOGGING_CARDLIST: true,
        JACRED_PROTOCOL: 'http://', 
        JACRED_URL: 'jacred.xyz',
        PROXY_LIST: [ // Список проксі-серверів для обходу CORS-обмежень.
            'https://api.allorigins.win/raw?url=',
            'https://cors.bwa.workers.dev/'
            ],
        PROXY_TIMEOUT_MS: 3500,
        MAX_PARALLEL_REQUESTS: 2,
        MAX_RETRY_ATTEMPTS: 2,
        MIN_GAP_MS: 800,
        SHOW_TRACKS_FOR_TV_SERIES: true,
        DISPLAY_MODE: 'flag_count',
        MANUAL_OVERRIDES: {
            '207703': { track_count: 1 },
            '1195518': { track_count: 2 },
            '215995': { track_count: 2 },
            '1234821': { track_count: 2 },
            '933260': { track_count: 3 },
            '245827': { track_count: 0 }
        }
    };

    window.LTF_CONFIG = LTF_CONFIG;

    (function resetOldCache() {
        var cache = Lampa.Storage.get(LTF_CONFIG.CACHE_KEY) || {};
        var keys = Object.keys(cache);
        var hasOld = false;
        
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf(LTF_CONFIG.CACHE_VERSION + '_') !== 0) {
                hasOld = true;
                break;
            }
        }
        
        if (hasOld) {
            console.log('UA-Finder: виявлено старий кеш, виконується очищення...');
            Lampa.Storage.set(LTF_CONFIG.CACHE_KEY, {});
        }
    })();

    var styleTracks = "<style id=\"lampa_tracks_styles\">" +
        ".card__view { position: relative; }" +
        ".card__tracks { position: absolute !important; right: 0.3em !important; left: auto !important; top: 0.3em !important; background: rgba(0,0,0,0.5) !important; color: #FFFFFF !important; font-size: 1.3em !important; padding: 0.2em 0.5em !important; border-radius: 1em !important; font-weight: 700 !important; z-index: 20 !important; width: fit-content !important; max-width: calc(100% - 1em) !important; overflow: hidden !important; }" +
        ".card__tracks.positioned-below-rating { top: 1.85em !important; }" +
        ".card__tracks div { text-transform: none !important; font-family: 'Roboto Condensed', 'Arial Narrow', Arial, sans-serif !important; font-weight: 700 !important; letter-spacing: 0.1px !important; font-size: 1.05em !important; color: #FFFFFF !important; padding: 0 !important; white-space: nowrap !important; display: flex !important; align-items: center !important; gap: 4px !important; text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.3) !important; }" +
        ".card__tracks .flag-css { display: inline-block; width: 1.5em; height: 0.8em; vertical-align: middle; background: linear-gradient(to bottom, #0057B7 0%, #0057B7 50%, #FFD700 50%, #FFD700 100%); border-radius: 2px; border: none !important; box-shadow: 0 0 2px 0 rgba(0,0,0,0.6), 0 0 1px 1px rgba(0,0,0,0.2), inset 0px 1px 0px 0px #004593, inset 0px -1px 0px 0px #D0A800; }" +
        "</style>";

    Lampa.Template.add('lampa_tracks_css', styleTracks);
    $('body').append(Lampa.Template.get('lampa_tracks_css', {}, true));

    var requestQueue = [];
    var activeRequests = 0;
    var networkHealth = 1.0;
    var NEXT_REQUEST_TS = 0;

    function scheduleStart(startFn) {
        var now = Date.now();
        var gap = (LTF_CONFIG.MIN_GAP_MS || 700);
        var wait = Math.max(0, NEXT_REQUEST_TS - now);
        NEXT_REQUEST_TS = Math.max(NEXT_REQUEST_TS, now) + gap;
        setTimeout(startFn, wait);
    }

    function enqueueTask(fn) {
        requestQueue.push(fn);
        processQueue();
    }

    function processQueue() {
        var base = Math.max(1, (LTF_CONFIG.MAX_PARALLEL_REQUESTS || 1));
        var adaptiveLimit = Math.max(1, Math.floor(base * networkHealth));

        if (activeRequests >= adaptiveLimit) return;

        var task = requestQueue.shift();
        if (!task) return;

        activeRequests++;

        scheduleStart(function () {
            try {
                task(function onTaskDone() {
                    activeRequests--;
                    setTimeout(processQueue, 0);
                });
            } catch (e) {
                console.error("LTF-LOG", "Помилка виконання завдання з черги:", e);
                activeRequests--;
                setTimeout(processQueue, 0);
            }
        });
    }

    function updateNetworkHealth(success) {
        if (success) {
            networkHealth = Math.min(1.0, networkHealth + 0.1);
        } else {
            networkHealth = Math.max(0.3, networkHealth - 0.2);
        }
        if (LTF_CONFIG.LOGGING_GENERAL) console.log("LTF-LOG", "Оновлено здоров'я мережі:", networkHealth);
    }

    function LTF_safeFetchText(url, timeoutMs) {
        timeoutMs = timeoutMs || 5000;

        if (window.fetch && window.AbortController) {
            return new Promise(function (resolve, reject) {
                var controller = new AbortController();
                var timer = setTimeout(function () {
                    controller.abort();
                    reject(new Error('fetch timeout'));
                }, timeoutMs);

                fetch(url, { signal: controller.signal })
                    .then(function (res) {
                        if (!res.ok) throw new Error('HTTP ' + res.status);
                        return res.text();
                    })
                    .then(function (txt) {
                        clearTimeout(timer);
                        resolve(txt);
                    })
                    .catch(function (err) {
                        clearTimeout(timer);
                        reject(err);
                    });
            });
        }

        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.timeout = timeoutMs;
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
                else reject(new Error('XHR ' + xhr.status));
            };
            xhr.onerror = xhr.ontimeout = function () {
                reject(new Error('XHR failed'));
            };
            xhr.send();
        });
    }

    function fetchSmart(url, cardId, callback) {
        var called = false;
        var proxyCount = (LTF_CONFIG.PROXY_LIST && LTF_CONFIG.PROXY_LIST.length) ? LTF_CONFIG.PROXY_LIST.length : 0;
        var totalMs = (Math.max(1500, LTF_CONFIG.PROXY_TIMEOUT_MS || 3000) 
                      + (LTF_CONFIG.PROXY_TIMEOUT_MS || 3000) * proxyCount 
                      + 800);
                      
        var hardTimer = setTimeout(function () {
            done(new Error('fetchSmart hard timeout'));
        }, totalMs);

        function done(err, data) {
            if (called) return;
            called = true;
            clearTimeout(hardTimer);
            if (typeof updateNetworkHealth === 'function') {
                updateNetworkHealth(!err);
            }
            callback(err, data);
        }

        LTF_safeFetchText(url, Math.max(1500, LTF_CONFIG.PROXY_TIMEOUT_MS || 3000))
            .then(function (text) {
                done(null, text);
            })
            .catch(function () {
                if (!LTF_CONFIG.PROXY_LIST || !LTF_CONFIG.PROXY_LIST.length) {
                    done(new Error('Direct fetch failed'));
                    return;
                }

                var index = 0;

                function tryProxy() {
                    if (index >= LTF_CONFIG.PROXY_LIST.length) {
                        done(new Error('All proxies failed'));
                        return;
                    }

                    var proxy = LTF_CONFIG.PROXY_LIST[index++];
                    var proxyUrl;

                    if (proxy === 'WRK') {
                        proxyUrl = LTF_CONFIG.WRK_B + '?key=' + encodeURIComponent(LTF_CONFIG.WRK_K) + '&url=' + encodeURIComponent(url);
                    } else if (proxy.indexOf('url=') !== -1) {
                        proxyUrl = proxy + encodeURIComponent(url);
                    } else {
                        proxyUrl = (proxy.charAt(proxy.length - 1) === '/' ? proxy : (proxy + '/')) + url;
                    }

                    LTF_safeFetchText(proxyUrl, LTF_CONFIG.PROXY_TIMEOUT_MS || 3000)
                        .then(function (text) { done(null, text); })
                        .catch(function () { tryProxy(); });
                }

                tryProxy();
            });
    }

    function getCardType(cardData) {
        var type = cardData.media_type || cardData.type;
        if (type === 'movie' || type === 'tv') return type;
        return cardData.name || cardData.original_name ? 'tv' : 'movie';
    }

    function countUkrainianTracks(title) {
        if (!title) return 0;
        var cleanTitle = title.toLowerCase();
        var subsIndex = cleanTitle.indexOf('sub');
        
        if (subsIndex !== -1) {
            cleanTitle = cleanTitle.substring(0, subsIndex);
        }

        var multiTrackMatch = cleanTitle.match(/(\d+)x\s*ukr/);
        if (multiTrackMatch && multiTrackMatch[1]) {
            return parseInt(multiTrackMatch[1], 10);
        }

        var singleTrackMatches = cleanTitle.match(/\bukr\b/g);
        if (singleTrackMatches) {
            return singleTrackMatches.length;
        }

        return 0;
    }

    function formatTrackLabel(count) {
        if (!count || count === 0) return null;

        switch (LTF_CONFIG.DISPLAY_MODE) {
            case 'flag_only':
                return ukraineFlagSVG;
            case 'flag_count':
                if (count === 1) return ukraineFlagSVG;
                return count + 'x' + ukraineFlagSVG;
            case 'text':
            default:
                if (count === 1) return 'Ukr';
                return count + 'xUkr';
        }
    }

    function getBestReleaseWithUkr(normalizedCard, cardId, callback) {
        enqueueTask(function (done) {
            if (!normalizedCard.release_date || normalizedCard.release_date.toLowerCase().indexOf('невідомо') !== -1 || isNaN(new Date(normalizedCard.release_date).getTime())) {
                callback(null);
                done();
                return;
            }

            var releaseDate = normalizedCard.release_date ? new Date(normalizedCard.release_date) : null;
            if (releaseDate && releaseDate.getTime() > Date.now()) {
                callback(null);
                done();
                return;
            }

            var year = '';
            if (normalizedCard.release_date && normalizedCard.release_date.length >= 4) {
                year = normalizedCard.release_date.substring(0, 4);
            }
            if (!year || isNaN(parseInt(year, 10))) {
                callback(null);
                done();
                return;
            }
            var searchYearNum = parseInt(year, 10);

            function extractYearFromTitle(title) {
                var regex = /(?:^|[^\d])(\d{4})(?:[^\d]|$)/g;
                var match, lastYear = 0;
                var currentYear = new Date().getFullYear();
                while ((match = regex.exec(title)) !== null) {
                    var extractedYear = parseInt(match[1], 10);
                    if (extractedYear >= 1900 && extractedYear <= currentYear + 2) {
                        lastYear = extractedYear;
                    }
                }
                return lastYear;
            }

            function searchJacredApi(searchTitle, searchYear, apiCallback) {
                var userId = Lampa.Storage.get('lampac_unic_id', '');
                var apiUrl = LTF_CONFIG.JACRED_PROTOCOL + LTF_CONFIG.JACRED_URL + '/api/v1.0/torrents?search=' +
                    encodeURIComponent(searchTitle) + '&year=' + searchYear + '&uid=' + userId;

                fetchSmart(apiUrl, cardId, function (error, responseText) {
                    if (error || !responseText) {
                        apiCallback(null);
                        return;
                    }
                    try {
                        var torrents = JSON.parse(responseText);
                        if (!Array.isArray(torrents) || torrents.length === 0) {
                            apiCallback(null);
                            return;
                        }

                        var bestTrackCount = 0;
                        var bestFoundTorrent = null;

                        for (var i = 0; i < torrents.length; i++) {
                            var currentTorrent = torrents[i];
                            var torrentTitle = currentTorrent.title.toLowerCase();
                            var isSeriesTorrent = /(сезон|season|s\d{1,2}|серии|серії|episodes|епізод|\d{1,2}\s*из\s*\d{1,2}|\d+×\d+)/.test(torrentTitle);

                            if (normalizedCard.type === 'tv' && !isSeriesTorrent) continue;
                            if (normalizedCard.type === 'movie' && isSeriesTorrent) continue;

                            if (normalizedCard.type === 'movie') {
                                var hasStrongSeriesIndicators = /(сезон|season|s\d|серії|episodes|епізод|\d+×\d+)/i.test(torrentTitle);
                                if (hasStrongSeriesIndicators) continue;
                            }

                            var parsedYear = extractYearFromTitle(currentTorrent.title) || parseInt(currentTorrent.relased, 10);
                            var yearDifference = Math.abs(parsedYear - searchYearNum);

                            if (parsedYear > 1900 && yearDifference > 0) continue;

                            var currentTrackCount = countUkrainianTracks(currentTorrent.title);

                            if (currentTrackCount > bestTrackCount) {
                                bestTrackCount = currentTrackCount;
                                bestFoundTorrent = currentTorrent;
                            } else if (currentTrackCount === bestTrackCount && bestTrackCount > 0 && bestFoundTorrent && currentTorrent.title.length > bestFoundTorrent.title.length) {
                                bestFoundTorrent = currentTorrent;
                            }
                        }

                        if (bestFoundTorrent) {
                            apiCallback({ track_count: bestTrackCount });
                        } else {
                            apiCallback(null);
                        }
                    } catch (e) {
                        apiCallback(null);
                    }
                });
            }

            var titlesToSearch = [normalizedCard.original_title, normalizedCard.title];
            var uniqueTitles = [];
            for (var t = 0; t < titlesToSearch.length; t++) {
                if (titlesToSearch[t] && uniqueTitles.indexOf(titlesToSearch[t]) === -1) {
                    uniqueTitles.push(titlesToSearch[t]);
                }
            }

            var searchPromises = uniqueTitles.map(function(title) {
                return new Promise(function(resolve) {
                    searchJacredApi(title, year, resolve);
                });
            });

            Promise.all(searchPromises).then(function(results) {
                var bestOverallResult = null;
                var maxTrackCount = 0;

                results.forEach(function(result) {
                    if (!result || !result.track_count) return;
                    if (result.track_count > maxTrackCount) {
                        maxTrackCount = result.track_count;
                        bestOverallResult = result;
                    }
                });

                callback(bestOverallResult);
                done();
            });
        });
    }

    var memoryCache = {};
    var storageCache = null;
    var inflightRequests = {};

    function getStorageCache() {
        if (!storageCache) storageCache = Lampa.Storage.get(LTF_CONFIG.CACHE_KEY) || {};
        return storageCache;
    }

    function getTracksCache(key) {
        var memoryItem = memoryCache[key];
        if (memoryItem && (Date.now() - memoryItem.timestamp < LTF_CONFIG.CACHE_VALID_TIME_MS)) {
            return memoryItem;
        }

        var cache = getStorageCache();
        var item = cache[key];
        var isCacheValid = item && (Date.now() - item.timestamp < LTF_CONFIG.CACHE_VALID_TIME_MS);
        if (isCacheValid) memoryCache[key] = item;
        return isCacheValid ? item : null;
    }

    function saveTracksCache(key, data) {
        var cache = getStorageCache();
        var payload = {
            track_count: data.track_count,
            timestamp: Date.now()
        };
        cache[key] = payload;
        memoryCache[key] = payload;
        Lampa.Storage.set(LTF_CONFIG.CACHE_KEY, cache);
    }

    function clearTracksCache() {
        storageCache = {};
        memoryCache = {};
        Lampa.Storage.set(LTF_CONFIG.CACHE_KEY, storageCache);
        console.log('UA-Finder: Кеш повністю очищено користувачем.');
        storageCache = {};
        Lampa.Storage.set(LTF_CONFIG.CACHE_KEY, storageCache);
    }

    document.addEventListener('ltf:settings-changed', function () {
        var cards = [].slice.call(document.querySelectorAll('.card'));
        cards.forEach(function (card) {
            var view = card.querySelector('.card__view');
            var data = card.card_data;
            if (!view || !data) return;

            var type = (data.media_type || data.type || (data.name || data.original_name ? 'tv' : 'movie'));
            if (type === 'tv' && !LTF_CONFIG.SHOW_TRACKS_FOR_TV_SERIES) {
                var ex = view.querySelector('.card__tracks');
                if (ex) ex.parentNode.removeChild(ex);
                return;
            }

            var id = data.id || '';
            var manual = LTF_CONFIG.MANUAL_OVERRIDES && LTF_CONFIG.MANUAL_OVERRIDES[id];
            if (manual) {
                updateCardListTracksElement(view, manual.track_count || 0);
                return;
            }

            var cacheKey = LTF_CONFIG.CACHE_VERSION + '_' + type + '_' + id;
            var cached = getTracksCache(cacheKey);
            var count = cached ? (cached.track_count || 0) : 0;

            updateCardListTracksElement(view, count);
        });
    });

    function updateCardListTracksElement(cardView, trackCount) {
        var displayLabel = formatTrackLabel(trackCount);
        var wrapper = cardView.querySelector('.card__tracks');

        function ensurePositionClass(el) {
            var parentCard = cardView.closest('.card');
            if (!parentCard) return;
            var vote = parentCard.querySelector('.card__vote');
            if (!vote) { el.classList.remove('positioned-below-rating'); return; }
            var topStyle = getComputedStyle(vote).top;
            if (topStyle !== 'auto' && parseInt(topStyle, 10) < 100) el.classList.add('positioned-below-rating');
            else el.classList.remove('positioned-below-rating');
        }

        if (!displayLabel) {
            if (wrapper) wrapper.parentNode.removeChild(wrapper);
            return;
        }

        if (wrapper) {
            var innerChild = wrapper.children[0];
            if (!innerChild) {
                innerChild = document.createElement('div');
                wrapper.appendChild(innerChild);
            }

            if (innerChild.innerHTML === displayLabel) {
                ensurePositionClass(wrapper);
                return;
            }

            innerChild.innerHTML = displayLabel;
            ensurePositionClass(wrapper);
            return;
        }

        var newWrapper = document.createElement('div');
        newWrapper.className = 'card__tracks';

        var inner = document.createElement('div');
        inner.innerHTML = displayLabel;

        newWrapper.appendChild(inner);
        ensurePositionClass(newWrapper);
        cardView.appendChild(newWrapper);
    }

    function processListCard(cardInstance) {
        var cardRoot = cardInstance && cardInstance.html ? (cardInstance.html[0] || cardInstance.html) : cardInstance;
        if (!cardRoot || !cardRoot.isConnected || !document.body.contains(cardRoot)) return;

        var cardData = cardInstance && cardInstance.data ? cardInstance.data : cardRoot.card_data;
        var cardView = cardRoot.querySelector ? cardRoot.querySelector('.card__view') : null;
        if (!cardData || !cardView) return;

        var isTvSeries = (getCardType(cardData) === 'tv');
        if (isTvSeries && !LTF_CONFIG.SHOW_TRACKS_FOR_TV_SERIES) return;

        var normalizedCard = {
            id: cardData.id || '',
            title: cardData.title || cardData.name || '',
            original_title: cardData.original_title || cardData.original_name || '',
            type: getCardType(cardData),
            release_date: cardData.release_date || cardData.first_air_date || ''
        };
        var cardId = normalizedCard.id;
        if (!cardId) return;
        var cacheKey = LTF_CONFIG.CACHE_VERSION + '_' + normalizedCard.type + '_' + cardId;

        var manualOverrideData = LTF_CONFIG.MANUAL_OVERRIDES[cardId];
        if (manualOverrideData) {
            updateCardListTracksElement(cardView, manualOverrideData.track_count);
            return;
        }

        var cachedData = getTracksCache(cacheKey);

        if (cachedData) {
            updateCardListTracksElement(cardView, cachedData.track_count);

            if (Date.now() - cachedData.timestamp > LTF_CONFIG.CACHE_REFRESH_THRESHOLD_MS) {
                if (inflightRequests[cacheKey]) return;
                inflightRequests[cacheKey] = true;

                getBestReleaseWithUkr(normalizedCard, cardId, function (liveResult) {
                    var trackCount = liveResult ? liveResult.track_count : 0;
                    saveTracksCache(cacheKey, { track_count: trackCount });

                    if (document.body.contains(cardRoot)) {
                        updateCardListTracksElement(cardView, trackCount);
                    }
                    delete inflightRequests[cacheKey];
                });
            }
        } else {
            if (inflightRequests[cacheKey]) return;
            inflightRequests[cacheKey] = true;

            getBestReleaseWithUkr(normalizedCard, cardId, function (liveResult) {
                var trackCount = liveResult ? liveResult.track_count : 0;
                saveTracksCache(cacheKey, { track_count: trackCount });

                if (document.body.contains(cardRoot)) {
                    updateCardListTracksElement(cardView, trackCount);
                }
                delete inflightRequests[cacheKey];
            });
        }
    }

    function initializeLampaTracksPlugin() {
        if (window.lampaTrackFinderPlugin) return;
        window.lampaTrackFinderPlugin = true;

        var card = Lampa.Maker.map('Card');
        if (!card || !card.Card) return;
        
        var originalOnVisible = card.Card.onVisible;

        card.Card.onVisible = function () {
            var self = this;
            if (typeof originalOnVisible === 'function') originalOnVisible.apply(self, arguments);
            processListCard(self);
        };

        if (LTF_CONFIG.LOGGING_GENERAL) console.log("LTF-LOG: Плагін пошуку українських доріжок (v3.4 ES5) успішно ініціалізовано!");
    }

    if (document.body) {
        initializeLampaTracksPlugin();
    } else {
        document.addEventListener('DOMContentLoaded', initializeLampaTracksPlugin);
    }


    (function () {
        'use strict';

        var SETTINGS_KEY = 'ltf_user_settings_v1';
        var st;

        function ltfToast(msg) {
            try { if (Lampa && Lampa.Noty) return Lampa.Noty(msg); } catch (e) { }
            var id = 'ltf_toast', el = document.getElementById(id);
            if (!el) {
                el = document.createElement('div');
                el.id = id;
                el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:2rem;padding:.6rem 1rem;background:rgba(0,0,0,.85);color:#fff;border-radius:.5rem;z-index:9999;font-size:14px;transition:opacity .2s;opacity:0';
                document.body.appendChild(el);
            }
            el.textContent = msg; el.style.opacity = '1';
            setTimeout(function () { el.style.opacity = '0'; }, 1300);
        }

        function toBool(v) { return v === true || String(v) === 'true'; }

        function load() {
            var s = Lampa.Storage.get(SETTINGS_KEY) || {};
            return {
                badge_style: s.badge_style || 'flag_count',
                show_tv: (typeof s.show_tv === 'boolean') ? s.show_tv : true
            };
        }

        function apply() {
            LTF_CONFIG.DISPLAY_MODE = st.badge_style;
            LTF_CONFIG.BADGE_STYLE = st.badge_style;
            LTF_CONFIG.SHOW_TRACKS_FOR_TV_SERIES = !!st.show_tv;
            LTF_CONFIG.SHOW_FOR_TV = !!st.show_tv;
            
            try {
                var detailObj = { badge_style: st.badge_style, show_tv: st.show_tv };
                var event;
                if (typeof CustomEvent === 'function') {
                    event = new CustomEvent('ltf:settings-changed', { detail: detailObj });
                } else {
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent('ltf:settings-changed', true, true, detailObj);
                }
                document.dispatchEvent(event);
            } catch (e) { }
        }

        function save() { Lampa.Storage.set(SETTINGS_KEY, st); apply(); ltfToast('Збережено'); }

        function clearTracks() {
            try {
                if (typeof clearTracksCache === 'function') {
                    clearTracksCache();
                } else {
                    Lampa.Storage.set(LTF_CONFIG.CACHE_KEY, {});
                }
            } catch (e) { }

            try {
                var detailObj = { badge_style: st.badge_style, show_tv: st.show_tv };
                var event;
                if (typeof CustomEvent === 'function') {
                    event = new CustomEvent('ltf:settings-changed', { detail: detailObj });
                } else {
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent('ltf:settings-changed', true, true, detailObj);
                }
                document.dispatchEvent(event);
            } catch (e) { }

            ltfToast('Кеш очищено. Оновлюю дані...');

            var MAX_RESCAN = 8;
            var RESCAN_GAP = 250;

            function isCardVisible(cardEl) {
                if (!cardEl || !cardEl.isConnected) return false;
                var r = cardEl.getBoundingClientRect();
                return (r.bottom > 0 && r.top < window.innerHeight);
            }

            var visibleCards = [].slice.call(document.querySelectorAll('.card')).filter(isCardVisible);
            visibleCards = visibleCards.slice(0, MAX_RESCAN);

            var idx = 0;

            function rescanNext() {
                if (idx >= visibleCards.length) return;
                var el = visibleCards[idx++];
                try {
                    if (typeof processListCard === 'function') processListCard(el);
                } catch (e) { }
                setTimeout(rescanNext, RESCAN_GAP);
            }

            rescanNext();
        }

        Lampa.Template.add('settings_ltf', '<div></div>');

        function registerUI() {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: { type: 'button', component: 'ltf' },
                field: { name: 'Мітки "UA" доріжок', description: 'Керування відображенням міток українських доріжок' },
                onChange: function () {
                    Lampa.Settings.create('ltf', {
                        template: 'settings_ltf',
                        onBack: function () { Lampa.Settings.create('interface'); }
                    });
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'ltf',
                param: {
                    name: 'ltf_badge_style', type: 'select',
                    values: { text: 'Текстова мітка (“Ukr”, “2xUkr”)', flag_count: 'Прапорець із лічильником', flag_only: 'Лише прапорець' },
                    default: st.badge_style
                },
                field: { name: 'Стиль мітки' },
                onChange: function (v) { st.badge_style = v; save(); }
            });

            Lampa.SettingsApi.addParam({
                component: 'ltf',
                param: { name: 'ltf_show_tv', type: 'select', values: { 'true': 'Увімкнено', 'false': 'Вимкнено' }, default: String(st.show_tv) },
                field: { name: 'Показувати для серіалів' },
                onChange: function (v) { st.show_tv = toBool(v); save(); }
            });

            Lampa.SettingsApi.addParam({
                component: 'ltf',
                param: { type: 'button', component: 'ltf_clear_cache' },
                field: { name: 'Очистити кеш доріжок' },
                onChange: clearTracks
            });
        }

        function start() {
            st = load();
            apply();
            if (window.Lampa && window.Lampa.SettingsApi && window.Lampa.SettingsApi.addParam) {
                setTimeout(registerUI, 0);
            }
        }

        if (window.appready) {
            start();
        } else if (window.Lampa && window.Lampa.Listener) {
            Lampa.Listener.follow('app', function(e) { 
                if (e.type === 'ready') start(); 
            });
        }
    })();
})();

