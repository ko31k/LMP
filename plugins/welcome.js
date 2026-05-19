(function () {
    'use strict';

    // Мінімальний час затримки (в мілісекундах). 3000 = 3 секунди
    var MIN_DISPLAY_TIME = 3000;
    var startTime = Date.now();

    // Масив ваших фонів
    var images = [
        'https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/w0.jpg',
        'https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/w1.jpg',
        'https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/w2.jpg',
        'https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/w3.jpg',
        'https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/w4.jpg'
    ];
    var randomImage = images[Math.floor(Math.random() * images.length)];
    var customLogo = 'https://raw.githubusercontent.com/ko3ik/LMP/main/wwwroot/logoUA.png';

    // 1. Додаємо стилі для заміни фону та налаштування позицій
    var style = document.createElement('style');
    style.innerHTML = [
        /* Перебиваємо фон на випадковий, щоб заповнював увесь екран */
        '.welcome {',
        '    background-image: url("' + randomImage + '") !important;',
        '    background-size: cover !important;',
        '    background-position: center center !important;',
        '}',

        /* Піднімаємо блок з текстами та логотипом вище (використовуємо transform) */
        '.lp-step {',
        '    transform: translateY(-18vh) !important;',
        '}',

        /* Збільшене лого над текстом */
        '.lp-step::before {',
        '    content: ""; display: block;',
        '    width: 330px; height: 110px; max-width: 80vw;',
        '    margin: 0 auto 25px auto;',
        '    background: url("' + customLogo + '") no-repeat center bottom;',
        '    background-size: contain;',
        '}',

        /* Тіні для контрасту текстів */
        '.lp-step, .lp-status {',
        '    text-shadow: 0px 2px 5px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,0,0,0.7) !important;',
        '}'
    ].join('\n');
    
    var headOrDoc = document.head || document.documentElement;
    headOrDoc.appendChild(style);

    // 2. Перехоплюємо jQuery fadeOut для затримки приховування фону (.welcome)
    function delayFadeOut() {
        if (typeof $ !== 'undefined' && $.fn && $.fn.fadeOut && !window.myBgFadeHooked) {
            window.myBgFadeHooked = true;
            var origFadeOut = $.fn.fadeOut;
            
            $.fn.fadeOut = function(speed, callback) {
                if (this.hasClass && this.hasClass('welcome')) {
                    var $el = this;
                    var elapsed = Date.now() - startTime;
                    var remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);
                    
                    setTimeout(function() {
                        origFadeOut.call($el, speed, callback);
                    }, remaining);
                    return this;
                }
                return origFadeOut.apply(this, arguments);
            };
        } else if (!window.myBgFadeHooked) {
            setTimeout(delayFadeOut, 50);
        }
    }
    delayFadeOut();

    // 3. Перехоплюємо LoadingProgress для затримки приховування лого та тексту
    function delayTexts() {
        if (window.Lampa && window.Lampa.LoadingProgress && !window.myTextsHooked) {
            window.myTextsHooked = true;
            var origDestroy = window.Lampa.LoadingProgress.destroy;
            
            window.Lampa.LoadingProgress.destroy = function() {
                var self = this, args = arguments;
                var elapsed = Date.now() - startTime;
                var remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);
                
                setTimeout(function() {
                    if (origDestroy) origDestroy.apply(self, args);
                }, remaining);
            };
        } else if (!window.myTextsHooked) {
            setTimeout(delayTexts, 50);
        }
    }
    delayTexts();

})();
