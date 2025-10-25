(function() {
    // ============= DRXAOS THEMES PLUGIN 2025 =============
    // 🎨 МИРОВОЙ УРОВЕНЬ КОДА - СОЗДАНО ДЛЯ ТИМА КУКА, ДЖЕФФА БЕЗОСА И СОЗДАТЕЛЕЙ GOOGLE! 🚀
    // ✨ АРХИТЕКТУРА МИРОВОГО КЛАССА ✨
    // 🏆 ПРОИЗВОДИТЕЛЬНОСТЬ НА УРОВНЕ APPLE, AMAZON И GOOGLE 🏆
    
    // ============= НЕМЕДЛЕННОЕ ИСПРАВЛЕНИЕ ПРЕДУПРЕЖДЕНИЙ КОНСОЛИ =============
    // Перехватываем создание Canvas контекстов ДО загрузки основного кода
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype.getContext) {
        var originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
            if (contextType === '2d') {
                if (!contextAttributes) contextAttributes = {};
                contextAttributes.willReadFrequently = true;
            }
            if (contextType === 'webgl' || contextType === 'webgl2') {
                if (!contextAttributes) contextAttributes = {};
                contextAttributes.willReadFrequently = true;
            }
            return originalGetContext.call(this, contextType, contextAttributes);
        };
    }
    
    // Перехватываем установку CSS стилей для исправления slider-vertical
    if (typeof CSSStyleDeclaration !== 'undefined') {
        var originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
        CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
            if (property === 'appearance' && value === 'slider-vertical') {
                value = 'none';
                this.writingMode = 'vertical-lr';
                this.direction = 'rtl';
            }
            return originalSetProperty.call(this, property, value, priority);
        };
        
        // Перехватываем прямое присвоение стилей
        var originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if (name === 'style' && value.includes('slider-vertical')) {
                value = value.replace(/appearance:\s*slider-vertical/g, 'appearance: none; writing-mode: vertical-lr; direction: rtl');
            }
            return originalSetAttribute.call(this, name, value);
        };
    }
    
    // Применяем глобальные CSS исправления немедленно
    var immediateCSS = document.createElement('style');
    immediateCSS.textContent = `
        /* НЕМЕДЛЕННОЕ ИСПРАВЛЕНИЕ УСТАРЕВШИХ СТИЛЕЙ */
        * {
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
        }
        
        input, button, select, textarea {
            appearance: auto !important;
            -webkit-appearance: auto !important;
            -moz-appearance: auto !important;
        }
        
        input[type="range"] {
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            writing-mode: vertical-lr !important;
            direction: rtl !important;
        }
    `;
    document.head.appendChild(immediateCSS);
    
    // Перехватываем создание элементов для исправления slider-vertical
    if (typeof document !== 'undefined' && document.createElement) {
        var originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            var element = originalCreateElement.call(this, tagName);
            
            // Если это input с type="range", применяем правильные стили
            if (tagName.toLowerCase() === 'input') {
                var originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name === 'type' && value === 'range') {
                        this.style.appearance = 'none';
                        this.style.writingMode = 'vertical-lr';
                        this.style.direction = 'rtl';
                    }
                    return originalSetAttribute.call(this, name, value);
                };
            }
            
            return element;
        };
    }
    
    
    
    
    
    
    
    // ============= ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И УТИЛИТЫ =============
    
    // Глобальная загрузка шрифтов для оптимизации производительности
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
        var fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&family=SF+Pro+Display:wght@300;400;500;600;700;800;900&subset=cyrillic,cyrillic-ext,latin,latin-ext&display=swap';
        document.head.appendChild(fontLink);
    }
    
    // Глобальные настройки шрифтов для оптимизации производительности
    var globalFontStyles = `
        * {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            font-display: swap !important;
            font-synthesis: none !important;
            font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
            font-variant-ligatures: common-ligatures !important;
            font-optical-sizing: auto !important;
            text-rendering: optimizeLegibility !important;
        }
    `;
    
    // Применяем глобальные стили шрифтов
    if (!document.querySelector('#drxaos-global-font-styles')) {
        var globalFontStyle = document.createElement('style');
        globalFontStyle.id = 'drxaos-global-font-styles';
        globalFontStyle.textContent = globalFontStyles;
        document.head.appendChild(globalFontStyle);
    }
    
    // Система логирования и мониторинга производительности
    var performanceMonitor = {
        startTime: 0,
        metrics: {},
        
        start: function(operation) {
            this.startTime = performance.now();
            this.metrics[operation] = { start: this.startTime };
        },
        
        end: function(operation) {
            if (this.metrics[operation]) {
                this.metrics[operation].duration = performance.now() - this.startTime;
            }
        },
        
        log: function(message, data) {
            // Логирование отключено
        }
    };
    
    // Система оптимизации рендеринга на основе HTML Canvas спецификации
    var renderingOptimizer = {
        // Origin-clean flag для безопасности (из HTML Canvas spec)
        originClean: true,
        
        // Проверка безопасности для cross-origin ресурсов
        checkOriginClean: function() {
            // Проверяем, что все ресурсы из того же источника
            var isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
            this.originClean = isSecure;
            
            if (!this.originClean) {
            }
            
            return this.originClean;
        },
        
        // Premultiplied alpha для корректной работы с прозрачностью
        usePremultipliedAlpha: true,
        
        // Оптимизация для частого чтения (will-read-frequently)
        willReadFrequently: function() {
            return /Android TV|Google TV|WebOS|Tizen|Smart TV|TV|Fire TV|FireTV|AFT|Roku|Apple TV|Chromecast/i.test(navigator.userAgent);
        },
        
        // Применение willReadFrequently для Canvas элементов согласно HTML спецификации
        applyCanvasOptimizations: function() {
            try {
                // Находим все canvas элементы и применяем willReadFrequently
                var canvasElements = document.querySelectorAll('canvas');
                canvasElements.forEach(function(canvas) {
                    if (canvas.getContext) {
                        // Применяем к 2D контексту согласно спецификации
                        try {
                            var context2d = canvas.getContext('2d', { willReadFrequently: true });
                            if (context2d) {
                                // lampaLogger.log('Применен willReadFrequently для 2D Canvas', { canvas: canvas });
                            }
                        } catch(e) {
                            // 2D контекст может быть недоступен
                        }
                        
                        // Применяем к WebGL контексту
                        try {
                            var gl = canvas.getContext('webgl', { willReadFrequently: true });
                            if (gl) {
                                // lampaLogger.log('Применен willReadFrequently для WebGL Canvas', { canvas: canvas });
                            }
                        } catch(e) {
                            // WebGL может быть недоступен
                        }
                        
                        // Применяем к WebGL2 контексту
                        try {
                            var gl2 = canvas.getContext('webgl2', { willReadFrequently: true });
                            if (gl2) {
                                // lampaLogger.log('Применен willReadFrequently для WebGL2 Canvas', { canvas: canvas });
                            }
                        } catch(e) {
                            // WebGL2 может быть недоступен
                        }
                        
                        // Применяем к ImageBitmap контексту
                        try {
                            var bitmap = canvas.getContext('bitmaprenderer', { willReadFrequently: true });
                            if (bitmap) {
                                // lampaLogger.log('Применен willReadFrequently для ImageBitmap Canvas', { canvas: canvas });
                            }
                        } catch(e) {
                            // ImageBitmap контекст может быть недоступен
                        }
                    }
                });
                
                // Также применяем к OffscreenCanvas элементам
                if (typeof OffscreenCanvas !== 'undefined') {
                    var offscreenCanvases = document.querySelectorAll('canvas');
                    offscreenCanvases.forEach(function(canvas) {
                        if (canvas.transferControlToOffscreen) {
                            try {
                                var offscreen = canvas.transferControlToOffscreen();
                                if (offscreen.getContext) {
                                    var offscreenContext = offscreen.getContext('2d', { willReadFrequently: true });
                                    if (offscreenContext) {
                                        // lampaLogger.log('Применен willReadFrequently для OffscreenCanvas', { canvas: canvas });
                                    }
                                }
                            } catch(e) {
                                // OffscreenCanvas может быть недоступен
                            }
                        }
                    });
                }
                
                // Перехватываем создание новых Canvas контекстов
                this.interceptCanvasContext();
            } catch(e) {
                // lampaLogger.error('Ошибка применения Canvas оптимизаций', e);
            }
        },
        
        // Перехват создания Canvas контекстов согласно HTML Canvas спецификации
        interceptCanvasContext: function() {
            try {
                // Сохраняем оригинальный метод getContext
                var originalGetContext = HTMLCanvasElement.prototype.getContext;
                
                // Переопределяем метод getContext согласно спецификации
                HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                    // Если это 2D контекст, добавляем willReadFrequently для оптимизации getImageData
                    if (contextType === '2d') {
                        if (!contextAttributes) {
                            contextAttributes = {};
                        }
                        // Согласно спецификации: willReadFrequently=true для частых getImageData операций
                        contextAttributes.willReadFrequently = true;
                        // lampaLogger.log('Перехвачен 2D Canvas контекст с willReadFrequently', { canvas: this });
                    }
                    
                    // Если это WebGL контекст, также добавляем willReadFrequently
                    if (contextType === 'webgl' || contextType === 'webgl2') {
                        if (!contextAttributes) {
                            contextAttributes = {};
                        }
                        contextAttributes.willReadFrequently = true;
                        // lampaLogger.log('Перехвачен WebGL Canvas контекст с willReadFrequently', { canvas: this });
                    }
                    
                    // Если это ImageBitmap контекст, также добавляем willReadFrequently
                    if (contextType === 'bitmaprenderer') {
                        if (!contextAttributes) {
                            contextAttributes = {};
                        }
                        contextAttributes.willReadFrequently = true;
                        // lampaLogger.log('Перехвачен ImageBitmap Canvas контекст с willReadFrequently', { canvas: this });
                    }
                    
                    // Вызываем оригинальный метод с обновленными атрибутами
                    return originalGetContext.call(this, contextType, contextAttributes);
                };
                
                // Дополнительно перехватываем OffscreenCanvas
                if (typeof OffscreenCanvas !== 'undefined' && OffscreenCanvas.prototype.getContext) {
                    var originalOffscreenGetContext = OffscreenCanvas.prototype.getContext;
                    OffscreenCanvas.prototype.getContext = function(contextType, contextAttributes) {
                        if (contextType === '2d') {
                            if (!contextAttributes) {
                                contextAttributes = {};
                            }
                            contextAttributes.willReadFrequently = true;
                            // lampaLogger.log('Перехвачен OffscreenCanvas 2D контекст с willReadFrequently', { canvas: this });
                        }
                        return originalOffscreenGetContext.call(this, contextType, contextAttributes);
                    };
                }
                
                // lampaLogger.log('Настроен перехват Canvas контекстов согласно HTML спецификации');
            } catch(e) {
                // lampaLogger.error('Ошибка настройки перехвата Canvas контекстов', e);
            }
        },
        
        // Оптимизация рендеринга для разных устройств
        optimizeForDevice: function() {
            var isTV = deviceDetection.isTV();
            var isMobile = deviceDetection.isMobile();
            
            if (isTV) {
                return {
                    useGPU: true,
                    premultipliedAlpha: true,
                    willReadFrequently: false,
                    optimizeForSpeed: true
                };
            } else if (isMobile) {
                return {
                    useGPU: true,
                    premultipliedAlpha: true,
                    willReadFrequently: true,
                    optimizeForSpeed: false
                };
            } else {
                return {
                    useGPU: false,
                    premultipliedAlpha: true,
                    willReadFrequently: true,
                    optimizeForSpeed: false
                };
            }
        },
        
        // Применение оптимизаций к элементам
        applyOptimizations: function() {
            // Проверяем безопасность перед применением оптимизаций
            this.checkOriginClean();
            
            var optimizations = this.optimizeForDevice();
            
            // УБРАЛИ ВСЕ АГРЕССИВНЫЕ GPU ОПТИМИЗАЦИИ - ОНИ ЛОМАЮТ LAMPA
            if (optimizations.useGPU) {
                var gpuCSS = `
                    /* УБРАЛИ ВСЕ АГРЕССИВНЫЕ GPU ОПТИМИЗАЦИИ - ОНИ ЛОМАЮТ LAMPA */
                `;
                styleManager.setStyle('drxaos-gpu-optimizations', gpuCSS);
            }
            
            // УБРАЛИ ВСЕ АГРЕССИВНЫЕ АЛЬФА ОПТИМИЗАЦИИ - ОНИ ЛОМАЮТ LAMPA
            if (optimizations.premultipliedAlpha) {
                var alphaCSS = `
                    /* УБРАЛИ ВСЕ АГРЕССИВНЫЕ АЛЬФА ОПТИМИЗАЦИИ - ОНИ ЛОМАЮТ LAMPA */
                `;
                styleManager.setStyle('drxaos-alpha-optimizations', alphaCSS);
            }
            
            // УБРАЛИ ВСЕ АГРЕССИВНЫЕ ОПТИМИЗАЦИИ ЧТЕНИЯ - ОНИ ЛОМАЮТ LAMPA
            if (optimizations.willReadFrequently) {
                var readOptimizations = `
                    /* УБРАЛИ ВСЕ АГРЕССИВНЫЕ ОПТИМИЗАЦИИ ЧТЕНИЯ - ОНИ ЛОМАЮТ LAMPA */
                `;
                styleManager.setStyle('drxaos-read-optimizations', readOptimizations);
            }
            
            // УБРАЛИ ВСЕ АГРЕССИВНЫЕ ОПТИМИЗАЦИИ СКОРОСТИ - ОНИ ЛОМАЮТ LAMPA
            if (optimizations.optimizeForSpeed) {
                var speedOptimizations = `
                    /* УБРАЛИ ВСЕ АГРЕССИВНЫЕ ОПТИМИЗАЦИИ СКОРОСТИ - ОНИ ЛОМАЮТ LAMPA */
                `;
                styleManager.setStyle('drxaos-speed-optimizations', speedOptimizations);
            }
            
            // Применяем Canvas оптимизации
            this.applyCanvasOptimizations();
            
            // Исправляем устаревшие slider элементы
            this.fixDeprecatedSliders();
            
            // lampaLogger.log('Применены оптимизации рендеринга', optimizations);
        },
        
        // Исправление устаревшего slider-vertical
        fixDeprecatedSliders: function() {
            try {
                // Находим все элементы с устаревшим slider-vertical
                var sliders = document.querySelectorAll('[style*="appearance: slider-vertical"], [style*="appearance:slider-vertical"]');
                
                sliders.forEach(function(slider) {
                    // Заменяем на стандартный input type="range"
                    if (slider.tagName !== 'INPUT' || slider.type !== 'range') {
                        var newSlider = document.createElement('input');
                        newSlider.type = 'range';
                        newSlider.style.cssText = 'writing-mode: vertical-lr; direction: rtl;';
                        
                        // Копируем атрибуты
                        Array.from(slider.attributes).forEach(function(attr) {
                            if (attr.name !== 'style') {
                                newSlider.setAttribute(attr.name, attr.value);
                            }
                        });
                        
                        // Заменяем элемент
                        slider.parentNode.replaceChild(newSlider, slider);
                        // lampaLogger.log('Заменен устаревший slider-vertical на стандартный input', { element: newSlider });
                    }
                });
                
                // Также исправляем CSS стили
                var deprecatedCSS = `
                    /* ИСПРАВЛЕНИЕ УСТАРЕВШЕГО SLIDER-VERTICAL */
                    input[type="range"] {
                        writing-mode: vertical-lr !important;
                        direction: rtl !important;
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        -moz-appearance: none !important;
                    }
                    
                    /* Убираем устаревшие appearance значения */
                    *[style*="appearance: slider-vertical"],
                    *[style*="appearance:slider-vertical"] {
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        -moz-appearance: none !important;
                        writing-mode: vertical-lr !important;
                        direction: rtl !important;
                    }
                    
                    /* АГРЕССИВНОЕ ИСПРАВЛЕНИЕ ВСЕХ УСТАРЕВШИХ СТИЛЕЙ */
                    * {
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        -moz-appearance: none !important;
                    }
                    
                    /* Восстанавливаем нужные appearance для конкретных элементов */
                    input, button, select, textarea {
                        appearance: auto !important;
                        -webkit-appearance: auto !important;
                        -moz-appearance: auto !important;
                    }
                    
                    input[type="range"] {
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        -moz-appearance: none !important;
                        writing-mode: vertical-lr !important;
                        direction: rtl !important;
                    }
                `;
                styleManager.setStyle('drxaos-slider-fixes', deprecatedCSS);
                
                // lampaLogger.log('Исправлены устаревшие slider элементы');
            } catch(e) {
                // lampaLogger.error('Ошибка исправления устаревших slider элементов', e);
            }
        },
        
        // Наблюдатель за динамически создаваемыми элементами
        setupDynamicElementObserver: function() {
            try {
                // Создаем наблюдатель за изменениями DOM
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            // Проверяем новые добавленные узлы
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) { // Element node
                                    // Проверяем на устаревшие slider элементы
                                    if (node.style && (node.style.appearance === 'slider-vertical' || 
                                        node.getAttribute('style') && node.getAttribute('style').includes('slider-vertical'))) {
                                        // Исправляем сразу
                                        node.style.appearance = 'none';
                                        node.style.writingMode = 'vertical-lr';
                                        node.style.direction = 'rtl';
                                        // lampaLogger.log('Исправлен динамически созданный slider элемент', { element: node });
                                    }
                                    
                                    // Проверяем на Canvas элементы
                                    if (node.tagName === 'CANVAS') {
                                        // Применяем willReadFrequently к новому Canvas
                                        if (node.getContext) {
                                            try {
                                                var context = node.getContext('2d', { willReadFrequently: true });
                                                if (context) {
                                                    // lampaLogger.log('Применен willReadFrequently к новому Canvas', { canvas: node });
                                                }
                                            } catch(e) {
                                                // Canvas может быть недоступен
                                            }
                                        }
                                    }
                                    
                                    // Рекурсивно проверяем дочерние элементы
                                    var childSliders = node.querySelectorAll && node.querySelectorAll('[style*="appearance: slider-vertical"], [style*="appearance:slider-vertical"]');
                                    if (childSliders) {
                                        childSliders.forEach(function(slider) {
                                            slider.style.appearance = 'none';
                                            slider.style.writingMode = 'vertical-lr';
                                            slider.style.direction = 'rtl';
                                            // lampaLogger.log('Исправлен дочерний slider элемент', { element: slider });
                                        });
                                    }
                                    
                                    var childCanvases = node.querySelectorAll && node.querySelectorAll('canvas');
                                    if (childCanvases) {
                                        childCanvases.forEach(function(canvas) {
                                            if (canvas.getContext) {
                                                try {
                                                    var context = canvas.getContext('2d', { willReadFrequently: true });
                                                    if (context) {
                                                        // lampaLogger.log('Применен willReadFrequently к дочернему Canvas', { canvas: canvas });
                                                    }
                                                } catch(e) {
                                                    // Canvas может быть недоступен
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
                
                // Начинаем наблюдение
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style']
                });
                
                // lampaLogger.log('Настроен наблюдатель за динамическими элементами');
                
                // Возвращаем observer для возможного отключения
                return observer;
            } catch(e) {
                // lampaLogger.error('Ошибка настройки наблюдателя за динамическими элементами', e);
                return null;
            }
        }
    };
    
    // Система логирования в консоль Lampa
    var lampaLogger = {
        log: function(message, data) {
            // Логирование отключено
        },
        error: function(message, error) {
            // Логирование отключено
        },
        warn: function(message, data) {
            // Логирование отключено
        },
        info: function(message, data) {
            // Логирование отключено
        }
    };
    
    // Единая система детекции устройств для всего плагина
    var deviceDetection = {
        isTV: function() {
            return /Android TV|Google TV|WebOS|Tizen|Smart TV|TV|Fire TV|FireTV|AFT|Roku|Apple TV|Chromecast/i.test(navigator.userAgent) || 
                   (window.screen.width >= 1920 && window.screen.height >= 1080 && 
                   /Android|Linux/i.test(navigator.userAgent)) ||
                   /AFT/i.test(navigator.userAgent) ||
                   (window.screen.width >= 3840 && window.screen.height >= 2160) || // 4K TV detection
                   (navigator.userAgent.includes('TV') && window.screen.width > 1280); // Generic TV detection
        },
        
        isMobile: function() {
            return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        isDesktop: function() {
            return !this.isTV() && !this.isMobile();
        },
        
        getDeviceType: function() {
            if (this.isTV()) return 'tv';
            if (this.isMobile()) return 'mobile';
            return 'desktop';
        }
    };
    
    // Единая система обработки событий карточек
    var cardEventManager = {
        // Применяет стили при наведении
        applyHoverStyles: function($img) {
            if ($img.length) {
                $img.css({
                    'border': '8px solid #5a3494 !important',
                    'border-radius': '1.5em !important',
                    'box-shadow': '0 0 40px #5a3494, 0 0 80px #5a3494, 0 8px 20px rgba(0,0,0,0.6) !important',
                    'filter': 'brightness(1.2) contrast(1.1) saturate(1.1) !important',
                    'transform': 'scale(1.02) !important'
                });
            }
        },
        
        // Убирает стили при уходе курсора
        removeHoverStyles: function($img) {
            if ($img.length) {
                $img.css({
                    'border': 'none !important',
                    'border-radius': '1em !important',
                    'box-shadow': 'none !important',
                    'filter': 'none !important',
                    'transform': 'scale(var(--hover-scale, 1)) !important'
                });
            }
        },
        
        // Инициализирует обработчики событий для всех карточек
        initCardEvents: function() {
            // Удаляем старые обработчики
            $('.card').off('mouseenter.drxaos mouseleave.drxaos');
            $('.card.selector').off('mouseenter.drxaos mouseleave.drxaos');
            
            // Добавляем новые обработчики для всех карточек
            $('.card, .card.selector').on('mouseenter.drxaos', function() {
                var $card = $(this);
                var $img = $card.find('.card__img');
                cardEventManager.applyHoverStyles($img);
            });
            
            $('.card, .card.selector').on('mouseleave.drxaos', function() {
                var $card = $(this);
                var $img = $card.find('.card__img');
                cardEventManager.removeHoverStyles($img);
            });
        }
    };
    
    // Единая система управления CSS стилями
    var styleManager = {
        styles: {},
        
        // Добавляет или обновляет стиль
        setStyle: function(id, css) {
            this.removeStyle(id);
            this.styles[id] = $('<style id="' + id + '">' + css + '</style>').appendTo('head');
        },
        
        // Удаляет стиль
        removeStyle: function(id) {
            if (this.styles[id]) {
                this.styles[id].remove();
                delete this.styles[id];
            } else {
                $('#' + id).remove();
            }
        },
        
        // Очищает все стили плагина
        clearAllStyles: function() {
            var styleIds = [
                'drxaos-advanced-styles',
                'drxaos-poster-styles', 
                'drxaos-hover-scale-styles',
                'drxaos-interface-size-styles',
                'drxaos_animations_style',
                'drxaos_font_weight_style',
                'drxaos-glow-styles',
                'drxaos_fullbuttons_style',
                'drxaos_fullbuttons_style_on',
                'drxaos_theme_style'
            ];
            
            styleIds.forEach(function(id) {
                $('#' + id).remove();
            });
            
            this.styles = {};
        }
    };
    
    // Функция для принудительного создания обводок постеров
    function createPosterOutlines() {
        try {
            // Находим все карточки
            var $cards = $('.card');
            
            $cards.each(function() {
                var $card = $(this);
                var $view = $card.find('.card__view');
                
                if ($view.length > 0) {
                    // Удаляем старые обводки
                    $view.find('.drxaos-poster-outline').remove();
                    
                    // Создаем новую обводку
                    var $outline = $('<div class="drxaos-poster-outline"></div>');
                    $outline.css({
                        'position': 'absolute',
                        'top': '-0.5em',
                        'left': '-0.5em',
                        'right': '-0.5em',
                        'bottom': '-0.5em',
                        'border': '0.5em solid var(--theme-primary, #5a3494)',
                        'border-radius': '1.5em',
                        'z-index': '9999',
                        'pointer-events': 'none',
                        'opacity': '0',
                        'box-shadow': '0 0 30px var(--theme-primary, #5a3494)',
                        'display': 'block',
                        'visibility': 'visible',
                        'background': 'transparent',
                        'transition': 'opacity 0.3s ease'
                    });
                    
                    $view.append($outline);
                    
                    // Добавляем события
                    $card.on('mouseenter', function() {
                        $outline.css({
                            'opacity': '1',
                            'border-color': 'var(--theme-primary, #5a3494)',
                            'box-shadow': '0 0 30px var(--theme-primary, #5a3494)'
                        });
                    });
                    
                    $card.on('mouseleave', function() {
                        $outline.css('opacity', '0');
                    });
                    
                    $card.on('focus', function() {
                        $outline.css({
                            'opacity': '1',
                            'border-color': 'var(--theme-accent, #0088bb)',
                            'box-shadow': '0 0 40px var(--theme-accent, #0088bb)'
                        });
                    });
                    
                    $card.on('blur', function() {
                        $outline.css('opacity', '0');
                    });
                }
            });
        } catch(e) {
            // lampaLogger.error('Ошибка создания обводок постеров', e);
        }
    }
    // Оптимизировано для TV устройств с современными методами 2025 года:
    // - GPU ускорение (transform3d, will-change, contain)
    // - Оптимизированные анимации (cubic-bezier, content-visibility)
    // - Улучшенная детекция TV (4K, Roku, Apple TV, Chromecast)
    // - Оптимизация рендеринга (backface-visibility, perspective)
    // - Современные CSS свойства (contain, content-visibility)

    // ============= РАСШИРЕННЫЕ НАСТРОЙКИ DRXAOS =============

    var advancedSettings = {
        cardBrightness: 100,
        cardSaturation: 100,
        shadowOpacity: 40,
        animationSpeed: 0.3,
        hoverScale: 1.05,
        modalOpacity: 95,
        modalBlur: 50,
        modalRadius: 2,
        menuWidth: 20,
        menuOpacity: 95,
        menuBlur: 30,
        contrast: 100,
        brightness: 100,
        saturation: 100,
        hue: 0,
        // Новые настройки
        posterBorderWidth: 2,
        posterBorderRadius: '1',
        posterGlowIntensity: 10,
        posterAnimationSpeed: 0.3,
        cardBackgroundOpacity: 70,
        interfaceSize: 'normal' // normal, small, medium, large, xlarge
    };

    function loadAdvancedSettings() {
        try {
            // Загружаем настройки из Lampa.Storage
            advancedSettings.interfaceSize = Lampa.Storage.get('interface_size', 'normal');
            advancedSettings.posterBorderWidth = parseInt(Lampa.Storage.get('poster_border_width', '2')) || 2;
            advancedSettings.posterBorderRadius = Lampa.Storage.get('poster_border_radius', '1');
            advancedSettings.posterGlowIntensity = parseInt(Lampa.Storage.get('poster_glow_intensity', '10')) || 10;
            advancedSettings.posterAnimationSpeed = parseFloat(Lampa.Storage.get('poster_animation_speed', '0.3')) || 0.3;
            advancedSettings.cardBackgroundOpacity = parseInt(Lampa.Storage.get('card_background_opacity', '70')) || 70;
            advancedSettings.hoverScale = parseFloat(Lampa.Storage.get('hover_scale', '1.05')) || 1.05;
            advancedSettings.animationSpeed = parseFloat(Lampa.Storage.get('animation_speed', '0.3')) || 0.3;
            
            // lampaLogger.log('Загружены расширенные настройки');
        } catch(e) {
            // lampaLogger.error('Ошибка загрузки настроек', e);
        }
    }

    function saveAdvancedSettings() {
        try {
            // Сохраняем настройки в Lampa.Storage
            Lampa.Storage.set('interface_size', advancedSettings.interfaceSize);
            Lampa.Storage.set('poster_border_width', advancedSettings.posterBorderWidth.toString());
            Lampa.Storage.set('poster_border_radius', advancedSettings.posterBorderRadius);
            Lampa.Storage.set('poster_glow_intensity', advancedSettings.posterGlowIntensity.toString());
            Lampa.Storage.set('poster_animation_speed', advancedSettings.posterAnimationSpeed.toString());
            Lampa.Storage.set('card_background_opacity', advancedSettings.cardBackgroundOpacity.toString());
            Lampa.Storage.set('hover_scale', advancedSettings.hoverScale.toString());
            Lampa.Storage.set('animation_speed', advancedSettings.animationSpeed.toString());
            
            // lampaLogger.log('Настройки сохранены');
        } catch(e) {
            // lampaLogger.error('Ошибка сохранения настроек', e);
        }
    }

    function applyAdvancedSettings() {
        try {
            performanceMonitor.start('applyAdvancedSettings');
            if (!window.jQuery || !window.$) return;
        // Удаляем только стили расширенных настроек, НЕ стили темы
        styleManager.removeStyle('drxaos-advanced-styles');
        styleManager.removeStyle('drxaos-poster-styles');
        styleManager.removeStyle('drxaos-hover-scale-styles');
        styleManager.removeStyle('drxaos-interface-size-styles');
        var s = advancedSettings;
        
        // Определяем масштаб интерфейса
        var scaleMultiplier = 1.0;
        switch(s.interfaceSize) {
            case 'normal': scaleMultiplier = 1.0; break;  // Обычный - без изменений
            case 'small': scaleMultiplier = 0.8; break;   // Маленький
            case 'medium': scaleMultiplier = 1.1; break;  // Средний
            case 'large': scaleMultiplier = 1.25; break; // Большой
            case 'xlarge': scaleMultiplier = 1.4; break; // Очень большой
            default: scaleMultiplier = 1.0; break;
        }
            
            // Определяем тип устройства через единую систему
            var isTV = deviceDetection.isTV();
            
            // Оптимизация для ТВ-устройств
            var css = isTV ? 
                // Упрощенные стили для ТВ (все параметры учитываются)
                '.card,.selector__item{box-shadow:0 8px 20px rgba(0,0,0,' + (s.shadowOpacity/100) + ')!important;transition:opacity 0.2s ease,transform 0.2s ease!important}.modal,.modal__content{opacity:' + (s.modalOpacity/100) + '!important;border-radius:' + s.modalRadius + 'em!important}.menu{width:' + s.menuWidth + 'em!important;opacity:' + (s.menuOpacity/100) + '!important}.card__img img{filter:contrast(' + s.contrast + '%) brightness(' + s.brightness + '%) saturate(' + s.saturation + '%) hue-rotate(' + s.hue + 'deg)!important}' :
                // Полные стили для ПК/мобильных (все параметры учитываются)
                '.card,.selector__item{box-shadow:0 8px 20px rgba(0,0,0,' + (s.shadowOpacity/100) + ')!important;transition:all ' + s.animationSpeed + 's ease!important}.modal,.modal__content{opacity:' + (s.modalOpacity/100) + '!important;backdrop-filter:blur(' + s.modalBlur + 'px)!important;border-radius:' + s.modalRadius + 'em!important}.menu{width:' + s.menuWidth + 'em!important;opacity:' + (s.menuOpacity/100) + '!important}.card__img img{filter:contrast(' + s.contrast + '%) brightness(' + s.brightness + '%) saturate(' + s.saturation + '%) hue-rotate(' + s.hue + 'deg)!important}';
            
        // Применяем новые настройки для обводок постеров
        var posterCSS = `
            .card .card__img {
                border: none !important;
                border-radius: ${s.posterBorderRadius === '50' ? '50%' : s.posterBorderRadius + 'em'} !important;
                transition: all ${s.posterAnimationSpeed}s ease !important;
            }
            .card:hover .card__img {
                border: ${s.posterBorderWidth}px solid var(--theme-primary, #5a3494) !important;
                box-shadow: 0 0 ${s.posterGlowIntensity}px var(--theme-primary, #5a3494) !important;
            }
            .card.focus .card__img {
                border: ${s.posterBorderWidth}px solid var(--theme-accent, #0088bb) !important;
                box-shadow: 0 0 ${s.posterGlowIntensity * 1.5}px var(--theme-accent, #0088bb) !important;
            }
            .card {
                background: rgba(0,0,0,${s.cardBackgroundOpacity/100}) !important;
            }
        `;
        
        // CSS для масштабирования интерфейса - только если не нормальный режим
        var interfaceSizeCSS = '';
        
        // Добавляем CSS переменную для hover-scale
        var hoverScaleCSS = `
            :root {
                --hover-scale: ${s.hoverScale};
            }
        `;
        
        if (scaleMultiplier !== 1.0) {
            interfaceSizeCSS = `
                /* Масштабирование основного контейнера - только размеры */
                .full-start {
                    font-size: ${scaleMultiplier}em !important;
                }
                
                /* Масштабирование контейнеров карточек - только размеры */
                .selector {
                    font-size: ${scaleMultiplier}em !important;
                }
                
                /* Адаптация количества карточек в зависимости от масштаба */
                .selector__item {
                    width: ${100 / Math.max(4, Math.floor(4 * scaleMultiplier))}% !important;
                    flex: 0 0 ${100 / Math.max(4, Math.floor(4 * scaleMultiplier))}% !important;
                }
                
                /* Дополнительная адаптация для маленького размера */
                ${scaleMultiplier < 1 ? `
                .selector {
                    overflow-x: auto !important;
                }
                .selector__item {
                    min-width: ${200 * scaleMultiplier}px !important;
                }
                ` : ''}
                
                /* Масштабирование шрифтов */
                body {
                    font-size: ${scaleMultiplier}em !important;
                }
                
                /* Масштабирование кнопок - только размер шрифта */
                .button, .settings-param {
                
                /* Масштабирование модальных окон */
                .modal, .modal__content {
                    transform: scale(${scaleMultiplier}) !important;
                    transform-origin: center !important;
                }
                
                /* Масштабирование страниц с полными списками (раздел "Еще") */
                .full-start__content, .full-start__buttons {
                    font-size: ${scaleMultiplier}em !important;
                }
                
                /* Адаптация карточек в полных списках - только размер */
                .card {
                    font-size: ${scaleMultiplier}em !important;
                }
                
                /* Правильные hover-эффекты для карточек */
                .card:hover {
                    transform: scale(${s.hoverScale}) !important;
                }
            `;
        }
        
        styleManager.setStyle('drxaos-advanced-styles', css);
        styleManager.setStyle('drxaos-poster-styles', posterCSS);
        styleManager.setStyle('drxaos-hover-scale-styles', hoverScaleCSS);
        styleManager.setStyle('drxaos-interface-size-styles', interfaceSizeCSS);
        
        performanceMonitor.end('applyAdvancedSettings');
        performanceMonitor.log('Advanced settings applied successfully');
        
        // ПРИНУДИТЕЛЬНОЕ ПРИМЕНЕНИЕ СТИЛЕЙ КНОПКИ ФИЛЬТРА
        setTimeout(function() {
            var filterButtons = document.querySelectorAll('div.simple-button.simple-button--filter.filter--filter.selector');
            
            filterButtons.forEach(function(button) {
                if (button) {
                    button.style.setProperty('background', 'var(--glass-bg, rgba(0,0,0,0.7))', 'important');
                    button.style.setProperty('border', '2px solid var(--theme-primary, #5a3494)', 'important');
                    button.style.setProperty('border-radius', '2em', 'important');
                    button.style.setProperty('color', 'var(--text-main, #ffffff)', 'important');
                    button.style.setProperty('box-shadow', '0 4px 12px rgba(0,0,0,0.3)', 'important');
                }
            });
        }, 100);
        
        
        } catch(e) {
            // lampaLogger.error('Ошибка применения расширенных настроек', e);
        }
    }

    loadAdvancedSettings();


'use strict';

Lampa.Lang.add({

drxaos_themes: { ru: 'DRXAOS Темы', en: 'DRXAOS Themes', uk: 'DRXAOS Теми' },

drxaos_theme: { ru: 'Цветовая схема', en: 'Color Scheme', uk: 'Кольорова схема' },

drxaos_animations: { ru: 'Анимации', en: 'Animations', uk: 'Анімації' },

drxaos_glow: { ru: 'Свечение', en: 'Glow', uk: 'Світіння' },

drxaos_fullbuttons: { ru: 'Полные названия кнопок', en: 'Full Button Labels', uk: 'Повні назви кнопок' },

drxaos_transparency: { ru: 'Прозрачность', en: 'Transparency', uk: 'Прозорість' },

drxaos_theme_desc: { ru: 'Выберите цветовую схему интерфейса', en: 'Choose interface color scheme', uk: 'Виберіть кольорову схему інтерфейсу' },

drxaos_glow_desc: { ru: 'Интенсивность свечения карточек и кнопок при наведении', en: 'Intensity of cards and buttons glow on hover', uk: 'Інтенсивність світіння карток і кнопок при наведенні' },

drxaos_transparency_desc: { ru: 'Уровень прозрачности панелей навигации и настроек', en: 'Transparency level of navigation and settings panels', uk: 'Рівень прозорості панелей навігації та налаштувань' },

drxaos_fullbuttons_desc: { ru: 'Показывать текст кнопок в карточках фильмов (Онлайн/Торренты/Избранное)', en: 'Show button text in movie cards', uk: 'Показувати текст кнопок в картках фільмів' },

drxaos_animations_desc: { ru: 'Плавные анимации при наведении (отключите на слабых устройствах)', en: 'Smooth animations on hover (disable on weak devices)', uk: 'Плавні анімації при наведенні (вимкніть на слабких пристроях)' },

drxaos_font_weight: { ru: 'Толщина шрифта', en: 'Font Weight', uk: 'Товщина шрифту' },

drxaos_font_weight_desc: { ru: 'Глобальная настройка толщины шрифта для всех тем', en: 'Global font weight setting for all themes', uk: 'Глобальне налаштування товщини шрифту для всіх тем' },

drxaos_quick_theme: { ru: 'Быстрый выбор темы', en: 'Quick Theme Selector', uk: 'Швидкий вибір теми' },

interface_size: { ru: 'Размер интерфейса', en: 'Interface Size', uk: 'Розмір інтерфейсу' },

interface_size_desc: { ru: 'Изменяет размер всех элементов интерфейса (шрифты, кнопки, карточки и т.д.)', en: 'Changes the size of all interface elements (fonts, buttons, cards, etc.)', uk: 'Змінює розмір всіх елементів інтерфейсу (шрифти, кнопки, картки тощо)' },

interface_size_small: { ru: 'Маленький', en: 'Small', uk: 'Малий' },

interface_size_medium: { ru: 'Средний', en: 'Medium', uk: 'Середній' },

interface_size_large: { ru: 'Большой', en: 'Large', uk: 'Великий' },

interface_size_xlarge: { ru: 'Очень большой', en: 'Extra Large', uk: 'Дуже великий' },

interface_size_normal: { ru: 'Обычный', en: 'Normal', uk: 'Звичайний' }

});

var prevtheme = '';

function applyTheme(theme) {
    try {
        // lampaLogger.log('Начинаем применение темы', { theme: theme, device: deviceDetection.getDeviceType() });
        if (!window.jQuery || !window.$) return;
styleManager.removeStyle('drxaos_theme_style');

prevtheme = theme;

// Для темы 'default' просто удаляем все кастомные стили
if (theme === 'default') {
    styleManager.removeStyle('drxaos_theme_style');
    return;
}

var glow = Lampa.Storage.get('drxaos_glow', 'medium');

var transparency = Lampa.Storage.get('drxaos_transparency', 85);

var glowValues = { 'off': '0', 'low': '0.15em', 'medium': '0.3em', 'high': '0.5em' };

var glowSize = glowValues[glow] || '0.3em';

var alpha = transparency / 100;

// Используем единую систему детекции устройств
var isTVDevice = (function() {
    return /Android TV|Google TV|WebOS|Tizen|Smart TV|TV|Fire TV|FireTV|AFT|Roku|Apple TV|Chromecast/i.test(navigator.userAgent) || 
           (window.screen.width >= 1920 && window.screen.height >= 1080 && 
           /Android|Linux/i.test(navigator.userAgent)) ||
           /AFT/i.test(navigator.userAgent) ||
           (window.screen.width >= 3840 && window.screen.height >= 2160) || // 4K TV detection
           (navigator.userAgent.includes('TV') && window.screen.width > 1280); // Generic TV detection
})();

var commonStyles = `

/* ОПТИМИЗАЦИЯ ДЛЯ ТВ-УСТРОЙСТВ (2025) */
${isTVDevice ? `
/* УБРАЛИ АГРЕССИВНЫЕ GPU ОПТИМИЗАЦИИ - ОНИ ЛОМАЮТ LAMPA */

/* УБРАЛИ АГРЕССИВНЫЕ ОПТИМИЗАЦИИ - ОНИ ЛОМАЮТ LAMPA */



/* Дополнительная оптимизация для ТВ - настройки шрифтов применяются глобально */

/* Убираем сложные градиенты на ТВ */
.button, .settings-param {
    background: var(--glass-bg, rgba(0,0,0,0.7)) !important;
    color: var(--text-main, #ffffff) !important;
    border: 1px solid var(--theme-primary, #5a3494) !important;
    border-radius: 0.8em !important;
    transition: all 0.3s ease !important;
}

/* Упрощаем тени */
.button, .settings-param {
    box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
}

/* ОБВОДКИ ДЛЯ КАРТОЧЕК НА ТВ (2025) */
body .card, .card {
    border: none !important;
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), 
                opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

body .card .card__img, .card .card__img {
    border: none !important;
    border-radius: 1em !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

/* ОБВОДКИ ПРИ HOVER НА TV */
body .card:hover .card__img, .card:hover .card__img {
    border: 3px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.2em !important;
    box-shadow: 0 0 20px var(--theme-primary, #5a3494) !important;
}

/* ОБВОДКИ ПРИ FOCUS НА TV */
body .card.focus .card__img, .card.focus .card__img {
    border: 3px solid var(--theme-accent, #0088bb) !important;
    border-radius: 1.2em !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb) !important;
}


body .card.focus, .card.focus {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}

/* Обводки для постеров на TV с помощью псевдоэлементов */
body .card.focus .card__view::after,
body .card.hover .card__view::after {
    content: "" !important;
    position: absolute !important;
    top: -0.5em !important;
    left: -0.5em !important;
    right: -0.5em !important;
    bottom: -0.5em !important;
    border: 0.3em solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.4em !important;
    z-index: 9999 !important;
    pointer-events: none !important;
    opacity: 1 !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
    display: block !important;
    visibility: visible !important;
}

body .card.focus .card__view::after {
    border-color: var(--theme-accent, #0088bb) !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb) !important;
}


/* Стили для меню на ТВ - исправляем черную рамку и текст */
body .menu__item, .menu__item {
    background: var(--glass-bg, rgba(0,0,0,0.7)) !important;
    color: var(--text-main, #ffffff) !important;
    border: 1px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1em !important;
    transition: all 0.2s ease !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

body .menu__item:hover, .menu__item:hover {
    background: var(--theme-primary, #5a3494) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 1.2em !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
    /* Убрано увеличение при наведении */
}

body .menu__item.focus, .menu__item.focus {
    background: var(--theme-accent, #0088bb) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.2em !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb), 0 6px 15px rgba(0,0,0,0.4) !important;
    /* Убрано увеличение при фокусе */
}

/* СТИЛИЗАЦИЯ TORRENT-SERIAL_CONTENT ДЛЯ ТВ */
.torrent-serial_content, div.torrent-serial_content {
    background: rgba(0,0,0,0.8) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.2em !important;
    color: #ffffff !important;
    font-family: var(--font-family) !important;
    padding: 1em 1.5em !important;
    margin: 0.5em !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.4) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    min-height: 3em !important;
}

.torrent-serial_content:hover, div.torrent-serial_content:hover {
    background: var(--theme-primary, #5a3494) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 1.5em !important;
    color: #ffffff !important;
    box-shadow: 0 0 25px var(--theme-primary, #5a3494), 0 12px 35px rgba(0,0,0,0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
}

.torrent-serial_content.focus, div.torrent-serial_content.focus {
    background: var(--theme-accent, #0088bb) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.5em !important;
    color: #ffffff !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb), 0 12px 35px rgba(0,0,0,0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
}


/* Стили для кнопки быстрой смены тем на ТВ */
.drxaos-theme-quick-btn {
    background: rgba(0,0,0,0.7) !important;
    color: #ffffff !important;
    border: 1px solid transparent !important;
    border-radius: 0.5em !important;
    padding: 0.5em !important;
    margin: 0.2em !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 2.5em !important;
    min-height: 2.5em !important;
    transition: all 0.2s ease !important;
}

.drxaos-theme-quick-btn:hover,
.drxaos-theme-quick-btn:focus,
.drxaos-theme-quick-btn.focused {
    background: var(--theme-primary, #5a3494) !important;
    color: #ffffff !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 0.8em !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
    /* Убрано увеличение при наведении */
    outline: none !important;
}

/* Отключаем перехват фокуса кнопкой */
.drxaos-theme-quick-btn {
    pointer-events: auto !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
}

.drxaos-theme-quick-btn:focus {
    outline: none !important;
    box-shadow: none !important;
}

/* АГРЕССИВНЫЕ ОБВОДКИ ДЛЯ КАРТОЧЕК - МАКСИМАЛЬНАЯ СПЕЦИФИЧНОСТЬ */
/* БАЗОВЫЕ СТИЛИ ДЛЯ КАРТОЧЕК - С ОБВОДКАМИ НА ПОСТЕРАХ */
html body .card.selector .card__img,
.card.selector .card__img,
html body .card .card__img,
.card .card__img {
    border: none !important;
    border-radius: 1em !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

/* ОБВОДКИ ПРИ HOVER */
html body .card.selector:hover .card__img,
.card.selector:hover .card__img,
html body .card:hover .card__img,
.card:hover .card__img {
    border: none !important;
    border-radius: 1.2em !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
    outline: none !important;
}

/* ОБВОДКИ ПРИ FOCUS */
html body .card.selector.focus .card__img,
.card.selector.focus .card__img,
html body .card.focus .card__img,
.card.focus .card__img {
    border: none !important;
    border-radius: 1.2em !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb) !important;
    outline: none !important;
}


/* Отключаем сложные CSS-фильтры на ТВ */
.card__img img, .card__img {
    filter: none !important;
    -webkit-filter: none !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
}

/* Убираем белую обводку с постеров - переопределяем стандартные стили Lampa */
.card .card__img,
.card .card__img img,
.card__view .card__img,
.card__view .card__img img {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: none !important;
    background-color: transparent !important;
}

/* Создаем обводки для постеров с помощью псевдоэлементов как в других плагинах */
.card.focus .card__view::after,
.card.hover .card__view::after {
    content: "" !important;
    position: absolute !important;
    top: -0.5em !important;
    left: -0.5em !important;
    right: -0.5em !important;
    bottom: -0.5em !important;
    border: 0.3em solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.4em !important;
    z-index: 9999 !important;
    pointer-events: none !important;
    opacity: 1 !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
    display: block !important;
    visibility: visible !important;
}

.card.focus .card__view::after {
    border-color: var(--theme-accent, #0088bb) !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb) !important;
}

/* Упрощаем градиенты */
.card {
    background-image: none !important;
    background: rgba(0,0,0,0.7) !important;
}

/* Оптимизация для прокрутки */
.scroll__content, .scroll__body {
    -webkit-overflow-scrolling: touch !important;
    overflow-scrolling: touch !important;
}


/* МЯГКАЯ ОПТИМИЗАЦИЯ ДЛЯ FIRE TV */
.card, .menu__item, .settings-param, .files__item, .torrent-item,
.filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line,
.online-prestige__item, .online-prestige__line, .online__tabs-item, 
.full-start__button, .head__action {
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
    filter: none !important;
    text-shadow: none !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
    transition: opacity 0.2s ease, transform 0.2s ease !important;
    will-change: auto !important;
}

/* ОБЩИЕ СТИЛИ ДЛЯ МЕНЮ - ВСЕ УСТРОЙСТВА */
.menu__item {
    background: var(--glass-bg, rgba(0,0,0,0.7)) !important;
    color: var(--text-main, #ffffff) !important;
    border: 1px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1em !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

.menu__item:hover {
    background: var(--theme-primary, #5a3494) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 1.2em !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
    /* Убрано увеличение при наведении */
}

.menu__item.focus {
    background: var(--theme-accent, #0088bb) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.2em !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb), 0 6px 15px rgba(0,0,0,0.4) !important;
    /* Убрано увеличение при фокусе */
}

/* Оптимизированные hover-эффекты для TV 2025 */
.menu__item {
    background: var(--glass-bg, rgba(0,0,0,0.7)) !important;
    color: var(--text-main, #ffffff) !important;
    border: 1px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1em !important;
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), 
                opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
    will-change: transform, opacity, border-color !important;
    contain: layout style paint !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

.button, .settings-param {
    border: 1px solid transparent !important;
    border-radius: 0.8em !important;
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), 
                opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
    will-change: transform, opacity, border-color !important;
    contain: layout style paint !important;
}

/* СТИЛИЗАЦИЯ ФИЛЬТРОВ - КАПСУЛЬНЫЙ СТИЛЬ */
.filter--search, .filter--sort, .filter--filter,
.simple-button--filter, .selector--filter,
div.simple-button.simple-button--filter.filter--filter.selector,
.simple-button.simple-button--filter.selector.filter--filter {
    background: var(--glass-bg, rgba(0,0,0,0.7)) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 2em !important;
    color: var(--text-main, #ffffff) !important;
    font-family: var(--font-family) !important;
    font-size: 0.9em !important;
    padding: 0.8em 1.5em !important;
    margin: 0.3em !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    display: flex !important;
    align-items: center !important;
    gap: 0.5em !important;
    min-height: 2.5em !important;
}

.filter--search:hover, .filter--sort:hover, .filter--filter:hover,
.simple-button--filter:hover, .selector--filter:hover,
div.simple-button.simple-button--filter.filter--filter.selector:hover,
.simple-button.simple-button--filter.selector.filter--filter:hover {
    background: var(--theme-primary, #5a3494) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 2.5em !important;
    color: var(--text-contrast, #ffffff) !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
}

.filter--search.focus, .filter--sort.focus, .filter--filter.focus,
.simple-button--filter.focus, .selector--filter.focus,
div.simple-button.simple-button--filter.filter--filter.selector.focus,
.simple-button.simple-button--filter.selector.filter--filter.focus {
    background: var(--theme-accent, #0088bb) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 2.5em !important;
    color: var(--text-contrast, #ffffff) !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb), 0 6px 15px rgba(0,0,0,0.4) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
}


/* СТИЛИЗАЦИЯ TORRENT-SERIAL_CONTENT */
.torrent-serial_content, div.torrent-serial_content {
    background: var(--glass-bg, rgba(0,0,0,0.8)) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.2em !important;
    color: var(--text-main, #ffffff) !important;
    font-family: var(--font-family) !important;
    padding: 1em 1.5em !important;
    margin: 0.5em !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.4) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    min-height: 3em !important;
}

.torrent-serial_content:hover, div.torrent-serial_content:hover {
    background: var(--theme-primary, #5a3494) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 1.5em !important;
    color: var(--text-contrast, #ffffff) !important;
    box-shadow: 0 0 30px var(--theme-primary, #5a3494), 0 12px 35px rgba(0,0,0,0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
}

.torrent-serial_content.focus, div.torrent-serial_content.focus {
    background: var(--theme-accent, #0088bb) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.5em !important;
    color: var(--text-contrast, #ffffff) !important;
    box-shadow: 0 0 35px var(--theme-accent, #0088bb), 0 12px 35px rgba(0,0,0,0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
}



/* СТИЛИЗАЦИЯ МОДАЛЬНЫХ ОКОН - ЕДИНОЕ ЦЕЛОЕ (2025) */
.console, .console *, .console .modal_content, .console .modal_head, .console .modal_title, .console .modal_body,
.extensions, .extensions *, .extensions .modal_content, .extensions .modal_head, .extensions .modal_title, .extensions .modal_body {
    background: var(--theme-primary, #5a3494) !important;
    color: #ffffff !important;
    font-family: var(--font-family) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 40px rgba(0,0,0,0.6) !important;
    opacity: 1 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    
    /* Оптимизация для TV 2025 */
    will-change: transform, opacity !important;
    contain: layout style paint !important;
    transform: translate3d(0, 0, 0) !important;
    backface-visibility: hidden !important;
    -webkit-transform: translate3d(0, 0, 0) !important;
    -webkit-backface-visibility: hidden !important;
}

/* ИСКЛЮЧАЕМ .modal--large ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal--large, .modal--large *, .modal--large .modal_content, .modal--large .modal_head, .modal--large .modal_title, .modal--large .modal_body {
    background: unset !important;
    color: unset !important;
    font-family: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
    opacity: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    will-change: unset !important;
    contain: unset !important;
    transform: unset !important;
    backface-visibility: unset !important;
    -webkit-transform: unset !important;
    -webkit-backface-visibility: unset !important;
}

/* Убираем все внутренние границы и фоны */
.about .modal_head, .about .modal_body, .about .modal_content,
.console .modal_head, .console .modal_body, .console .modal_content,
.extensions .modal_head, .extensions .modal_body, .extensions .modal_content {
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
}

/* Стилизация заголовков */
.console .modal_title, .extensions .modal_title {
    color: #ffffff !important;
    font-weight: 600 !important;
    font-size: 1.5em !important;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5) !important;
    background: transparent !important;
}

/* ИСКЛЮЧАЕМ ОКНО "О ПРИЛОЖЕНИИ" И "ФАЙЛЫ" ИЗ НАШИХ СТИЛЕЙ */
.about, .about *, .about .modal_content, .about .modal_head, .about .modal_title, .about .modal_body,
.about .scroll, .about .scroll_content, .about .scroll_body,
.about .files__item, .about .torrent-item, .about .card, .about .item, .about .row, .about .line,
.about .files__item:hover, .about .torrent-item:hover, .about .card:hover, .about .item:hover, .about .row:hover, .about .line:hover {
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    outline: none !important;
    text-shadow: none !important;
    font-weight: inherit !important;
    transform: none !important;
    transition: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    color: inherit !important;
    font-family: inherit !important;
}

/* ИСКЛЮЧАЕМ МОДАЛЬНОЕ ОКНО "ФАЙЛЫ" ИЗ ВСЕХ НАШИХ СТИЛЕЙ - СТАНДАРТНЫЙ ВИД */
.modal .modal_title:contains("файлы"), .modal .modal_title:contains("files"),
.modal .files__item, .modal .torrent-item, .modal .card, .modal .item, .modal .row, .modal .line,
.modal .files__item:hover, .modal .torrent-item:hover, .modal .card:hover, .modal .item:hover, .modal .row:hover, .modal .line:hover,
.modal .modal_content .files__item,
.modal .modal_content .torrent-item,
.modal .modal_content .card,
.modal .modal_content .item,
.modal .modal_content .row,
.modal .modal_content .line,
.modal .modal_content .files__item:hover,
.modal .modal_content .torrent-item:hover,
.modal .modal_content .card:hover,
.modal .modal_content .item:hover,
.modal .modal_content .row:hover,
.modal .modal_content .line:hover,
.modal .modal_content .files__item *,
.modal .modal_content .torrent-item *,
.modal .modal_content .card *,
.modal .modal_content .item *,
.modal .modal_content .row *,
.modal .modal_content .line * {
    /* Убираем ВСЕ наши стили - возвращаем стандартный вид */
    background: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
    outline: unset !important;
    text-shadow: unset !important;
    font-weight: unset !important;
    transform: unset !important;
    transition: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    color: unset !important;
    font-family: unset !important;
    padding: unset !important;
    margin: unset !important;
}

/* Убираем все внутренние стили */
.about .scroll, .about .scroll_content, .about .scroll_body,
.console .scroll, .console .scroll_content, .console .scroll_body,
.extensions .scroll, .extensions .scroll_content, .extensions .scroll_body {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* Стилизация элементов списков */
.modal--large .torrent-item, .modal--large .card, .modal--large .item, .modal--large .row, .modal--large .line,
.console .files__item, .console .torrent-item, .console .card, .console .item, .console .row, .console .line,
.extensions .files__item, .extensions .torrent-item, .extensions .card, .extensions .item, .extensions .row, .extensions .line {
    background: rgba(255,255,255,0.1) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    border-radius: 1em !important;
    color: #ffffff !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

/* ИСКЛЮЧАЕМ .modal--large .files__item ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal--large .files__item {
    background: unset !important;
    border: unset !important;
    border-radius: unset !important;
    color: unset !important;
    padding: unset !important;
    margin: unset !important;
    transition: unset !important;
}

.modal--large .torrent-item:hover, .modal--large .card:hover, .modal--large .item:hover, .modal--large .row:hover, .modal--large .line:hover,
.console .files__item:hover, .console .torrent-item:hover, .console .card:hover, .console .item:hover, .console .row:hover, .console .line:hover,
.extensions .files__item:hover, .extensions .torrent-item:hover, .extensions .card:hover, .extensions .item:hover, .extensions .row:hover, .extensions .line:hover {
    background: rgba(255,255,255,0.2) !important;
    border: 1px solid rgba(255,255,255,0.4) !important;
    border-radius: 1.2em !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
}

/* ИСКЛЮЧАЕМ .modal--large .files__item:hover ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal--large .files__item:hover {
    background: unset !important;
    border: unset !important;
    border-radius: unset !important;
    transform: unset !important;
}

/* Обводки для кнопок меню */
/* СТИЛИ ДЛЯ КНОПКИ БЫСТРОЙ СМЕНЫ ТЕМ */
.drxaos-theme-quick-btn {
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    border: 1px solid transparent !important;
    border-radius: 0.5em !important;
    padding: 0.5em !important;
    margin: 0.2em !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 2.5em !important;
    min-height: 2.5em !important;
    /* Принудительный фокус для навигации */
    position: relative !important;
    z-index: 1000 !important;
}

/* Простая защита от ihide.js - только убираем скрытие */
.drxaos-theme-quick-btn.hidden,
.head__action.drxaos-theme-quick-btn.hidden {
    display: flex !important;
}

/* Принудительные стили для фокуса */
.drxaos-theme-quick-btn:focus,
.drxaos-theme-quick-btn.focused {
    outline: 2px solid var(--theme-accent, #0088bb) !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 10px var(--theme-accent, #0088bb) !important;
}

.drxaos-theme-quick-btn:hover {
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 0.8em !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
    background: var(--theme-primary, #5a3494) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
}

.drxaos-theme-quick-btn:focus,
.drxaos-theme-quick-btn.focused {
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 0.8em !important;
    box-shadow: 0 0 20px var(--theme-accent, #0088bb) !important;
    background: var(--theme-accent, #0088bb) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    outline: none !important;
}

/* Стили для навигации Lampa */
.drxaos-theme-quick-btn[data-focus="true"]:focus,
.drxaos-theme-quick-btn[data-focusable="true"]:focus {
    outline: 2px solid var(--theme-accent, #0088bb) !important;
    outline-offset: 2px !important;
    background: var(--theme-primary, #5a3494) !important;
    color: var(--text-contrast, #ffffff) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 0.8em !important;
    box-shadow: 0 0 20px var(--theme-accent, #0088bb) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
}
` : ''}

/* GPU ACCELERATION */

.card, .menu__item, .settings-param, .files__item, .torrent-item,

.filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line,

.online-prestige__item, .online-prestige__line, .online__tabs-item,

.full-start__button, .head__action, .bottom-bar__item, .bottom-bar__btn {

will-change: transform, opacity;

transform: translateZ(0);

backface-visibility: hidden;

perspective: 1000px;

}



.button, .settings-param {
    background: var(--glass-bg, rgba(0,0,0,0.7)) !important;
    color: var(--text-main, #ffffff) !important;
    border: 1px solid var(--theme-primary, #5a3494) !important;
    border-radius: 0.8em !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

.button:hover, .settings-param:hover {
    background: var(--theme-primary, #5a3494) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    border-radius: 1em !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
    /* Убрано увеличение при наведении */
}

.button.focus, .settings-param.focus {
    background: var(--theme-accent, #0088bb) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1em !important;
    box-shadow: 0 0 30px var(--theme-accent, #0088bb), 0 6px 15px rgba(0,0,0,0.4) !important;
    /* Убрано увеличение при фокусе */
}

/* ПЛЕЕР */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

/* BOTTOM BAR */

body .bottom-bar, .bottom-bar,

body .bottom-bar__body, .bottom-bar__body {

background: rgba(var(--bg-rgb), ${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-top: 2px solid var(--theme-accent) !important;

box-shadow: 0 -4px 20px rgba(var(--primary-rgb), 0.2) !important;

}

body .bottom-bar__item, .bottom-bar__item,

body .bottom-bar__btn, .bottom-bar__btn {

background: transparent !important;

border: none !important;

color: var(--text-main) !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .bottom-bar__item svg, .bottom-bar__item svg,

body .bottom-bar__btn svg, .bottom-bar__btn svg {

fill: var(--text-main) !important;

color: var(--text-main) !important;

filter: drop-shadow(0 1px 3px rgba(0,0,0,0.5));

}

body .bottom-bar__item.active, body .bottom-bar__item:hover, body .bottom-bar__item.focus,

body .bottom-bar__btn.active, body .bottom-bar__btn:hover, body .bottom-bar__btn.focus {

background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary)) !important;

border-radius: 1em !important;

transform: scale(var(--hover-scale, 1.1)) translateZ(0) !important;

box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.6) !important;

}

body .bottom-bar__item.active svg, body .bottom-bar__item:hover svg, body .bottom-bar__item.focus svg,

body .bottom-bar__btn.active svg, body .bottom-bar__btn:hover svg, body .bottom-bar__btn.focus svg {

fill: var(--text-contrast) !important;

color: var(--text-contrast) !important;

filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));

}

body .bottom-bar__item-text, .bottom-bar__item-text,

body .bottom-bar__btn-text, .bottom-bar__btn-text {

color: var(--text-main) !important;

text-shadow: none !important;

}

body .bottom-bar__item.active .bottom-bar__item-text,

body .bottom-bar__item:hover .bottom-bar__item-text,

body .bottom-bar__btn.active .bottom-bar__btn-text,

body .bottom-bar__btn:hover .bottom-bar__btn-text {

color: var(--text-contrast) !important;

text-shadow: none !important;

font-weight: 600 !important;

}

/* КОНТЕЙНЕРЫ */

body .card, .card, body .rows, .rows, body .line, .line {

border: none !important;

box-shadow: none !important;

outline: none !important;

background: transparent !important;

}

/* МАКСИМАЛЬНАЯ СПЕЦИФИЧНОСТЬ ДЛЯ ОБВОДОК ПОСТЕРОВ */
html body .card.focus .card__view::after,
html body .card.hover .card__view::after,
.card.focus .card__view::after,
.card:hover .card__view::after {
    content: "" !important;
    position: absolute !important;
    top: -0.5em !important;
    left: -0.5em !important;
    right: -0.5em !important;
    bottom: -0.5em !important;
    border: 0.5em solid var(--theme-primary, #5a3494) !important;
    border-radius: 1.5em !important;
    z-index: 9999 !important;
    pointer-events: none !important;
    opacity: 1 !important;
    box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
    display: block !important;
    visibility: visible !important;
    background: transparent !important;
}

html body .card.focus .card__view::after,
.card.focus .card__view::after {
    border-color: var(--theme-accent, #0088bb) !important;
    box-shadow: 0 0 40px var(--theme-accent, #0088bb) !important;
}

body .menu__item, .menu__item {
    background: var(--glass-bg, rgba(0,0,0,0.7)) !important;
    color: var(--text-main, #ffffff) !important;
    border: 1px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1em !important;
    overflow: hidden !important;
    padding: 0.6em 0.8em !important;
    margin: 0.2em 0.3em !important;
    max-width: calc(100% - 0.6em) !important;
    box-sizing: border-box !important;
    font-size: 0.9em !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

/* КОНТЕЙНЕРЫ МЕНЮ - ТОЛЬКО ДЛЯ ЛЕВОГО МЕНЮ */
body .menu .scroll__content, 
body .menu .scroll__body {
    overflow-x: hidden !important;
    padding: 0 !important;
}

body .menu, .menu {
    width: 100% !important;
    padding: 0.5em 0 !important;
}

/* ВОССТАНОВЛЕНИЕ ОТСТУПОВ ДЛЯ КОНТЕНТА */
body .full-start, .full-start,
body .full-start__body, .full-start__body,
body .full-start__content, .full-start__content {
    padding: 1em 1.5em !important;
    margin: 0 !important;
}

body .card, .card {
    margin: 0.5em !important;
}

body .card__view, .card__view {
    border-radius: 1em !important;
    overflow: hidden !important;
}

/* ВОССТАНОВЛЕНИЕ ОТСТУПОВ ДЛЯ ЗАГОЛОВКОВ */
body .full-start__title, .full-start__title,
body .settings__title, .settings__title {
    padding: 0 1.5em !important;
    margin: 1em 0 0.5em 0 !important;
}

/* ВОССТАНОВЛЕНИЕ ОТСТУПОВ ДЛЯ ВСЕХ КОНТЕЙНЕРОВ КОНТЕНТА */
body .full-start__grid, .full-start__grid,
body .full-start__list, .full-start__list,
body .full-start__row, .full-start__row {
    padding: 0 1.5em !important;
    margin: 0 !important;
}

/* ВОССТАНОВЛЕНИЕ ОТСТУПОВ ДЛЯ СЕКЦИЙ */
body .full-start__section, .full-start__section,
body .full-start__block, .full-start__block {
    padding: 0 1.5em !important;
    margin: 0 0 2em 0 !important;
}

/* ВОССТАНОВЛЕНИЕ ОТСТУПОВ ДЛЯ СКРОЛЛ-КОНТЕЙНЕРОВ КОНТЕНТА - ТОЛЬКО ДЛЯ ГЛАВНОЙ СТРАНИЦЫ */
body .full-start .scroll__content,
body .full-start .scroll__body {
    padding: 1em 1.5em !important;
    margin: 0 !important;
}

/* СПЕЦИАЛЬНЫЕ СТИЛИ ДЛЯ ДЛИННЫХ НАЗВАНИЙ */
body .menu__item[data-name="Информация"], 
body .menu__item:contains("Информация"),
body .menu__item[data-name="Расписание"], 
body .menu__item:contains("Расписание"),
body .menu__item[data-name="Избранное"], 
body .menu__item:contains("Избранное") {

padding: 0.5em 0.6em !important;

font-size: 0.85em !important;

margin: 0.15em 0.25em !important;

max-width: calc(100% - 0.5em) !important;

}

/* АДАПТИВНЫЙ РАЗМЕР ШРИФТА ДЛЯ МЕНЮ */
body .menu__item-title, .menu__item-title {

font-size: 0.9em !important;

white-space: nowrap !important;

overflow: hidden !important;

text-overflow: ellipsis !important;

max-width: calc(100% - 2em) !important;

}


/* ОНЛАЙН ПРОСМОТР */

body .online, .online,

body .online__body, .online__body,

body .online-view, .online-view {

background: rgba(var(--glass-bg), 0.45) !important;

border: 1.5px solid rgba(var(--glass-border), 0.4) !important;

border-radius: 1em !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

}

body .online__item, .online__item,

body .online__item-line, .online__item-line,

body .online-prestige__item, .online-prestige__item,

body .online-prestige__line, .online-prestige__line {

background: rgba(var(--glass-bg), 0.45) !important;

border: 1.5px solid rgba(var(--glass-border), 0.4) !important;

border-radius: 0.8em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

backdrop-filter: blur(20px) saturate(180%) !important;

-webkit-backdrop-filter: blur(20px) saturate(180%) !important;

color: var(--text-main) !important;

margin-bottom: 0.3em !important;

}

body .online__item *, .online__item *,

body .online__item-line *, .online__item-line *,

body .online-prestige__item *, .online-prestige__item *,

body .online-prestige__line *, .online-prestige__line * {

color: var(--text-main) !important;

text-shadow: none !important;

}

body .online__item.focus, body .online__item:hover, body .online__item.active,

body .online__item-line.focus, body .online__item-line:hover, body .online__item-line.active,

body .online-prestige__item.focus, body .online-prestige__item:hover, body .online-prestige__item.active,

body .online-prestige__line.focus, body .online-prestige__line:hover, body .online-prestige__line.active {

background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary)) !important;

border: 2px solid var(--theme-accent) !important;

box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.6) !important;

transform: translateX(5px) scale(var(--hover-scale, 1.02)) translateZ(0) !important;

color: var(--text-contrast) !important;

backdrop-filter: blur(30px) saturate(200%) !important;

-webkit-backdrop-filter: blur(30px) saturate(200%) !important;

}

body .online__item.focus *, body .online__item:hover *, body .online__item.active *,

body .online__item-line.focus *, body .online__item-line:hover *, body .online__item-line.active *,

body .online-prestige__item.focus *, body .online-prestige__item:hover *, body .online-prestige__item.active *,

body .online-prestige__line.focus *, body .online-prestige__line:hover *, body .online-prestige__line.active * {

color: var(--text-contrast) !important;

text-shadow: none !important;

}

body .online__quality, .online__quality {

background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary)) !important;

font-weight: 700 !important;

color: var(--text-contrast) !important;

padding: 0.2em 0.5em !important;

border-radius: 0.3em !important;

text-shadow: none !important;

}

body .online__title, .online__title,

body .online__name, .online__name {

color: var(--theme-accent) !important;

text-shadow: 0 0 10px var(--theme-accent), 0 1px 3px rgba(0,0,0,0.5) !important;

font-weight: 600 !important;

}

body .online__tabs, .online__tabs,

body .online__tabs-item, .online__tabs-item {

background: rgba(var(--glass-bg), 0.45) !important;

border: 1.5px solid rgba(var(--glass-border), 0.4) !important;

border-radius: 1.5em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

backdrop-filter: blur(20px) saturate(180%) !important;

-webkit-backdrop-filter: blur(20px) saturate(180%) !important;

color: var(--text-main) !important;

}

body .online__tabs-item.focus, body .online__tabs-item:hover, body .online__tabs-item.active {

background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary)) !important;

border: 2px solid var(--theme-accent) !important;

box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.5) !important;

color: var(--text-contrast) !important;

}

/* ФАЙЛЫ И ТОРРЕНТЫ */

body .files, .files,

body .files__item, .files__item {

background: transparent !important;

border: none !important;

border-radius: 0 !important;

transition: none !important;

backdrop-filter: none !important;

-webkit-backdrop-filter: none !important;

color: var(--text-main) !important;

}

body .torrent-item, .torrent-item {

background: rgba(var(--glass-bg), 0.45) !important;

border: 1.5px solid rgba(var(--glass-border), 0.4) !important;

border-radius: 0.5em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

backdrop-filter: blur(20px) saturate(180%) !important;

-webkit-backdrop-filter: blur(20px) saturate(180%) !important;

color: var(--text-main) !important;

}

body .files__item.focus, body .files__item:hover {

background: transparent !important;

border: none !important;

box-shadow: none !important;

transform: none !important;

color: var(--text-contrast) !important;

backdrop-filter: none !important;

-webkit-backdrop-filter: none !important;

}

body .torrent-item.focus, body .torrent-item:hover {

background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary)) !important;

border: 2px solid var(--theme-accent) !important;

box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.6) !important;

transform: translateX(5px) translateZ(0) !important;

color: var(--text-contrast) !important;

backdrop-filter: blur(30px) saturate(200%) !important;

-webkit-backdrop-filter: blur(30px) saturate(200%) !important;

}

body .files__item *, .files__item *,

body .torrent-item *, .torrent-item * {

color: var(--text-main) !important;

text-shadow: none !important;

}

body .files__item.focus *, body .files__item:hover *,

body .torrent-item.focus *, body .torrent-item:hover * {

color: var(--text-contrast) !important;

text-shadow: none !important;

}

body .files__item-quality, .files__item-quality {

background: transparent !important;

font-weight: inherit;

color: var(--text-main) !important;

padding: 0;

border-radius: 0;

text-shadow: none !important;

}

/* РАЗМЕР ФАЙЛОВ/ТОРРЕНТОВ - ЧЁРНЫЙ ВО ВСЕХ ТЕМАХ */

body .torrent-item__size, .torrent-item__size {

background: #ffffff !important;

color: #000000 !important;

font-weight: 700 !important;

padding: 0.2em 0.5em !important;

border-radius: 0.3em !important;

text-shadow: none !important;

border: 1px solid rgba(0,0,0,0.1) !important;

}

body .files__item-size, .files__item-size,

body .online__size, .online__size {

background: transparent !important;

color: var(--text-main) !important;

font-weight: inherit !important;

padding: 0 !important;

border-radius: 0 !important;

text-shadow: none !important;

border: none !important;

}

/* МОДАЛЬНЫЕ ОКНА - ТОЛЬКО ВИЗУАЛЬНЫЕ СТИЛИ */

.selectbox__content.layer--height,

.selectbox__head,

.selectbox__body.layer--wheight {

background: rgba(var(--bg-rgb), ${alpha}) !important;

backdrop-filter: blur(40px) saturate(180%) !important;

-webkit-backdrop-filter: blur(40px) saturate(180%) !important;

}

.selectbox__title {

color: var(--theme-accent) !important;

text-shadow: 0 0 15px var(--theme-accent), 0 2px 4px rgba(0,0,0,0.6) !important;

font-weight: 700 !important;

}

.selectbox-item.selector,

.simple-button.simple-button--filter.selector.filter--search,

.simple-button.simple-button--filter.selector.filter--sort {

background: var(--glass-bg, rgba(0,0,0,0.7)) !important;

border: 3px solid var(--theme-primary, #5a3494) !important;

color: var(--text-main) !important;

text-shadow: none !important;

border-radius: 2em !important;

}

.selectbox-item.selector.focus,

.selectbox-item.selector:hover,

.simple-button.simple-button--filter.selector.filter--search.focus,

.simple-button.simple-button--filter.selector.filter--search:hover,

.simple-button.simple-button--filter.selector.filter--sort.focus,

.simple-button.simple-button--filter.selector.filter--sort:hover {

background: var(--theme-primary, #5a3494) !important;

border: 3px solid var(--theme-accent, #0088bb) !important;

border-radius: 2.5em !important;

color: var(--text-contrast, #ffffff) !important;

box-shadow: 0 0 20px var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;

                transform: scale(1.02) !important;

border: 2px solid var(--theme-accent) !important;

box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.6) !important;

color: var(--text-contrast) !important;

text-shadow: 0 2px 4px rgba(0,0,0,0.7) !important;

font-weight: 600 !important;

}

/* НАСТРОЙКИ */

body .settings__content, .settings__content {

background: rgba(var(--glass-bg), ${alpha}) !important;

backdrop-filter: blur(40px) saturate(180%) !important;

-webkit-backdrop-filter: blur(40px) saturate(180%) !important;

border: 2px solid rgba(var(--glass-border), 0.5) !important;

border-radius: 1em !important;

}

body .settings-param__name, .settings-param__name {

background: transparent !important;

border: none !important;

color: var(--text-main) !important;

font-size: 1.1em !important;

line-height: 1.4 !important;

font-weight: 600 !important;

width: 100% !important;

text-align: left !important;

display: block !important;

margin-bottom: 0.3em !important;

}

body .settings-param__descr, .settings-param__descr {

background: transparent !important;

border: none !important;

color: var(--text-main) !important;

font-size: 0.85em !important;

line-height: 1.3 !important;

opacity: 0.8 !important;

width: 100% !important;

text-align: left !important;

display: block !important;

margin-top: 0.2em !important;

}

body .settings-param__value, .settings-param__value {

background: transparent !important;

border: none !important;

color: var(--text-main) !important;

font-size: 0.9em !important;

line-height: 1.4 !important;

padding: 0 !important;

width: auto !important;

text-align: left !important;

white-space: nowrap !important;

overflow: hidden !important;

text-overflow: ellipsis !important;

display: block !important;

margin-bottom: 0.3em !important;

font-weight: 500 !important;

}

body .settings-param, .settings-param,

body .settings-folder, .settings-folder {

background: rgba(var(--glass-bg), 0.45) !important;

border: 1.5px solid rgba(var(--glass-border), 0.4) !important;

border-radius: 0.8em !important;

padding: 0.6em 0.8em !important;

margin: 0.2em 0 !important;

min-height: auto !important;

transition: all 0.3s ease !important;

backdrop-filter: blur(20px) saturate(180%) !important;

-webkit-backdrop-filter: blur(20px) saturate(180%) !important;

color: var(--text-main) !important;

display: block !important;

}

/* Адаптация для TV (Firestick 4K) */
@media (min-width: 1920px) {
    body .settings-param, .settings-param,
    body .settings-folder, .settings-folder {
        padding: 0.5em 0.6em !important;
        margin: 0.15em 0 !important;
        border-radius: 0.6em !important;
    }
    
    body .settings-param__name, .settings-param__name {
        font-size: 1em !important;
        margin-bottom: 0.2em !important;
    }
    
    body .settings-param__value, .settings-param__value {
        font-size: 0.85em !important;
        margin-bottom: 0.2em !important;
    }
    
    body .settings-param__descr, .settings-param__descr {
        font-size: 0.8em !important;
        margin-top: 0.1em !important;
    }
    
/* Усиленные рамки постеров для TV */
body .card.focus .card__view::after,
body .card.hover .card__view::after {
    border-width: 0.5em !important;
    box-shadow: 0 0 40px var(--theme-primary, #5a3494) !important;
}

body .card.focus .card__view::after {
    border-color: var(--theme-accent, #0088bb) !important;
    box-shadow: 0 0 50px var(--theme-accent, #0088bb) !important;
}

/* ИСКЛЮЧАЕМ МОДАЛЬНОЕ ОКНО ФАЙЛОВ НА TV ИЗ ВСЕХ СТИЛЕЙ - СТАНДАРТНЫЙ ВИД */
@media (min-width: 1920px) {
    .modal .modal_content .files__item,
    .modal .modal_content .torrent-item,
    .modal .modal_content .card,
    .modal .modal_content .item,
    .modal .modal_content .row,
    .modal .modal_content .line,
    .modal .modal_content .files__item:hover,
    .modal .modal_content .torrent-item:hover,
    .modal .modal_content .card:hover,
    .modal .modal_content .item:hover,
    .modal .modal_content .row:hover,
    .modal .modal_content .line:hover,
    .modal .modal_content .files__item *,
    .modal .modal_content .torrent-item *,
    .modal .modal_content .card *,
    .modal .modal_content .item *,
    .modal .modal_content .row *,
    .modal .modal_content .line * {
        /* Убираем ВСЕ наши стили - возвращаем стандартный вид */
        background: unset !important;
        border: unset !important;
        border-radius: unset !important;
        box-shadow: unset !important;
        outline: unset !important;
        text-shadow: unset !important;
        font-weight: unset !important;
        transform: unset !important;
        transition: unset !important;
        backdrop-filter: unset !important;
        -webkit-backdrop-filter: unset !important;
        color: unset !important;
        font-family: unset !important;
        padding: unset !important;
        margin: unset !important;
    }
}
    
    /* Исправление фокуса в левом меню на TV */
    body .menu__item {
        position: relative !important;
        z-index: 1000 !important;
    }
    
    body .menu__item.focus {
        z-index: 1001 !important;
        background: var(--theme-accent, #0088bb) !important;
        border: 2px solid var(--theme-primary, #5a3494) !important;
        box-shadow: 0 0 20px var(--theme-accent, #0088bb) !important;
    }
    
    /* Предотвращаем уход фокуса на карточки */
    body .card {
        pointer-events: none !important;
    }
    
    body .card.focus {
        pointer-events: auto !important;
    }
}

body .settings-param.focus, body .settings-param:hover,

body .settings-folder.focus, body .settings-folder:hover {

background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary)) !important;

border: 2px solid var(--theme-accent) !important;

box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.5) !important;

/* Убрано увеличение при наведении */

color: var(--text-contrast) !important;

}

body .settings-param.focus *, body .settings-param:hover *,

body .settings-folder.focus *, body .settings-folder:hover * {

color: var(--text-contrast) !important;

}

/* КНОПКИ В КАРТОЧКЕ ФИЛЬМА */

body .full-start__button, .full-start__button {

background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary)) !important;

border: 2px solid var(--theme-accent) !important;

color: var(--text-contrast) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

backdrop-filter: blur(20px) saturate(180%) !important;

-webkit-backdrop-filter: blur(20px) saturate(180%) !important;

}

body .full-start__button.focus, body .full-start__button:hover {

background: linear-gradient(90deg, var(--theme-secondary), var(--theme-primary)) !important;

box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.7) !important;

transform: scale(var(--hover-scale, 1.05)) translateZ(0) !important;

}

body .full-start__button svg,

.full-start__button svg {

fill: var(--text-contrast) !important;

color: var(--text-contrast) !important;

}

/* УНИВЕРСАЛЬНОЕ ПРАВИЛО: Убираем обводку для темного текста во всех темах */
.button, .settings-param { 
.card__quality, .card__quality *, .card__type::after,
.head__action.focus, .head__action.focus *,
.head__action:hover, .head__action:hover *,
.menu__item.focus, .menu__item.focus *,
.menu__item:hover, .menu__item:hover *,
.settings-param.focus, .settings-param.focus *,
.settings-param:hover, .settings-param:hover *,
.files__item.focus, .files__item.focus *,
.files__item:hover, .files__item:hover *,
.torrent-item.focus, .torrent-item.focus *,
.torrent-item:hover, .torrent-item:hover *,
.filter__item.focus, .filter__item.focus *,
.filter__item:hover, .filter__item:hover *,
.sort__item.focus, .sort__item.focus *,
.sort__item:hover, .sort__item:hover *,
.selectbox-item.focus, .selectbox-item.focus *,
.selectbox-item:hover, .selectbox-item:hover *,
.online__item.focus, .online__item.focus *,
.online__item:hover, .online__item:hover *,
.online__item-line.focus, .online__item-line.focus *,
.online__item-line:hover, .online__item-line:hover *,
.online-prestige__item.focus, .online-prestige__item.focus *,
.online-prestige__item:hover, .online-prestige__item:hover *,
.online-prestige__line.focus, .online-prestige__line.focus *,
.online-prestige__line:hover, .online-prestige__line:hover *,
.online__tabs-item.focus, .online__tabs-item.focus *,
.online__tabs-item:hover, .online__tabs-item:hover *,
.card.focus, .card.focus *,
.card:hover, .card:hover * {
    text-shadow: none !important;
}

/* УНИВЕРСАЛЬНОЕ ПРАВИЛО: Запрещаем смену цвета и веса шрифта при hover/focus */
.settings-param:hover, .settings-param:focus, .settings-param.focus, .settings-param.hover,
.menu__item:hover, .menu__item:focus, .menu__item.focus, .menu__item.hover,
.files__item:hover, .files__item:focus, .files__item.focus, .files__item.hover,
.torrent-item:hover, .torrent-item:focus, .torrent-item.focus, .torrent-item.hover,
.filter__item:hover, .filter__item:focus, .filter__item.focus, .filter__item.hover,
.sort__item:hover, .sort__item:focus, .sort__item.focus, .sort__item.hover,
.selectbox-item:hover, .selectbox-item:focus, .selectbox-item.focus, .selectbox-item.hover,
.online__item:hover, .online__item:focus, .online__item.focus, .online__item.hover,
.online__item-line:hover, .online__item-line:focus, .online__item-line.focus, .online__item-line.hover,
.online-prestige__item:hover, .online-prestige__item:focus, .online-prestige__item.focus, .online-prestige__item.hover,
.online-prestige__line:hover, .online-prestige__line:focus, .online-prestige__line.focus, .online-prestige__line.hover,
.online__tabs-item:hover, .online__tabs-item:focus, .online__tabs-item.focus, .online__tabs-item.hover,
.card:hover, .card:focus, .card.focus, .card.hover,
.full-start__button:hover, .full-start__button:focus, .full-start__button.focus, .full-start__button.hover,
.head__action:hover, .head__action:focus, .head__action.focus, .head__action.hover,
.bottom-bar__item:hover, .bottom-bar__item:focus, .bottom-bar__item.focus, .bottom-bar__item.hover,
.bottom-bar__btn:hover, .bottom-bar__btn:focus, .bottom-bar__btn.focus, .bottom-bar__btn.hover,
.settings-folder:hover, .settings-folder:focus, .settings-folder.focus, .settings-folder.hover,
.drxaos-theme-quick-btn:hover, .drxaos-theme-quick-btn:focus, .drxaos-theme-quick-btn.focus, .drxaos-theme-quick-btn.hover,
.button:hover, .button:focus, .button.focus, .button.hover,
.settings-param:hover, .settings-param:focus, .settings-param.focus, .settings-param.hover {
    font-weight: inherit !important;
    text-shadow: none !important;
}

.button, .button *, .settings-param, .settings-param *,
.menu__item, .menu__item *,
.full-start__button, .full-start__button * {
    font-weight: inherit !important;
    text-shadow: none !important;
}

/* УНИВЕРСАЛЬНОЕ ПРАВИЛО: Отключаем ВСЕ увеличения при наведении */
*:hover, *:focus, *.focus, *.hover {
    transform: none !important;
}

.settings-param:hover *, .settings-param:focus *, .settings-param.focus *, .settings-param.hover *,
.menu__item:hover *, .menu__item:focus *, .menu__item.focus *, .menu__item.hover *,
.files__item:hover *, .files__item:focus *, .files__item.focus *, .files__item.hover *,
.torrent-item:hover *, .torrent-item:focus *, .torrent-item.focus *, .torrent-item.hover *,
.filter__item:hover *, .filter__item:focus *, .filter__item.focus *, .filter__item.hover *,
.sort__item:hover *, .sort__item:focus *, .sort__item.focus *, .sort__item.hover *,
.selectbox-item:hover *, .selectbox-item:focus *, .selectbox-item.focus *, .selectbox-item.hover *,
.online__item:hover *, .online__item:focus *, .online__item.focus *, .online__item.hover *,
.online__item-line:hover *, .online__item-line:focus *, .online__item-line.focus *, .online__item-line.hover *,
.online-prestige__item:hover *, .online-prestige__item:focus *, .online-prestige__item.focus *, .online-prestige__item.hover *,
.online-prestige__line:hover *, .online-prestige__line:focus *, .online-prestige__line.focus *, .online-prestige__line.hover *,
.online__tabs-item:hover *, .online__tabs-item:focus *, .online__tabs-item.focus *, .online__tabs-item.hover *,
.card:hover *, .card:focus *, .card.focus *, .card.hover *,
.full-start__button:hover *, .full-start__button:focus *, .full-start__button.focus *, .full-start__button.hover *,
.head__action:hover *, .head__action:focus *, .head__action.focus *, .head__action.hover *,
.bottom-bar__item:hover *, .bottom-bar__item:focus *, .bottom-bar__item.focus *, .bottom-bar__item.hover *,
.bottom-bar__btn:hover *, .bottom-bar__btn:focus *, .bottom-bar__btn.focus *, .bottom-bar__btn.hover *,
.settings-folder:hover *, .settings-folder:focus *, .settings-folder.focus *, .settings-folder.hover *,
.drxaos-theme-quick-btn:hover *, .drxaos-theme-quick-btn:focus *, .drxaos-theme-quick-btn.focus *, .drxaos-theme-quick-btn.hover * {
    font-weight: inherit !important;
    text-shadow: none !important;
}

/* УНИВЕРСАЛЬНОЕ ПРАВИЛО: Убираем обводку для всех элементов с темным текстом */
*[style*="color: #000000"], *[style*="color:#000000"], 
*[style*="color: #001a1f"], *[style*="color:#001a1f"],
*[style*="color: #0a0a0a"], *[style*="color:#0a0a0a"],
*[style*="color: var(--text-contrast)"], 
.card__quality, .card__quality *, .card__type::after,
.head__action, .head__action *,
.menu__item, .menu__item *,
.settings-param, .settings-param *,
.files__item, .files__item *,
.torrent-item, .torrent-item *,
.filter__item, .filter__item *,
.sort__item, .sort__item *,
.selectbox-item, .selectbox-item *,
.online__item, .online__item *,
.online__item-line, .online__item-line *,
.online-prestige__item, .online-prestige__item *,
.online-prestige__line, .online-prestige__line *,
.online__tabs-item, .online__tabs-item *,
.card, .card *,
.bottom-bar__item, .bottom-bar__item *,
.bottom-bar__btn, .bottom-bar__btn *,
.settings-folder, .settings-folder *,
.drxaos-theme-quick-btn, .drxaos-theme-quick-btn * {
    text-shadow: none !important;
}

/* ДОПОЛНИТЕЛЬНОЕ ПРАВИЛО: Убираем обводку для всех элементов с темным цветом текста */
*[style*="color: #000"], *[style*="color:#000"],
*[style*="color: #001"], *[style*="color:#001"],
*[style*="color: #002"], *[style*="color:#002"],
*[style*="color: #003"], *[style*="color:#003"],
*[style*="color: #004"], *[style*="color:#004"],
*[style*="color: #005"], *[style*="color:#005"],
*[style*="color: #006"], *[style*="color:#006"],
*[style*="color: #007"], *[style*="color:#007"],
*[style*="color: #008"], *[style*="color:#008"],
*[style*="color: #009"], *[style*="color:#009"],
*[style*="color: #00a"], *[style*="color:#00a"],
*[style*="color: #00b"], *[style*="color:#00b"],
*[style*="color: #00c"], *[style*="color:#00c"],
*[style*="color: #00d"], *[style*="color:#00d"],
*[style*="color: #00e"], *[style*="color:#00e"],
*[style*="color: #00f"], *[style*="color:#00f"],
*[style*="color: #010"], *[style*="color:#010"],
*[style*="color: #020"], *[style*="color:#020"],
*[style*="color: #030"], *[style*="color:#030"],
*[style*="color: #040"], *[style*="color:#040"],
*[style*="color: #050"], *[style*="color:#050"],
*[style*="color: #060"], *[style*="color:#060"],
*[style*="color: #070"], *[style*="color:#070"],
*[style*="color: #080"], *[style*="color:#080"],
*[style*="color: #090"], *[style*="color:#090"],
*[style*="color: #0a0"], *[style*="color:#0a0"],
*[style*="color: #0b0"], *[style*="color:#0b0"],
*[style*="color: #0c0"], *[style*="color:#0c0"],
*[style*="color: #0d0"], *[style*="color:#0d0"],
*[style*="color: #0e0"], *[style*="color:#0e0"],
*[style*="color: #0f0"], *[style*="color:#0f0"],
*[style*="color: #100"], *[style*="color:#100"],
*[style*="color: #200"], *[style*="color:#200"],
*[style*="color: #300"], *[style*="color:#300"],
*[style*="color: #400"], *[style*="color:#400"],
*[style*="color: #500"], *[style*="color:#500"],
*[style*="color: #600"], *[style*="color:#600"],
*[style*="color: #700"], *[style*="color:#700"],
*[style*="color: #800"], *[style*="color:#800"],
*[style*="color: #900"], *[style*="color:#900"],
*[style*="color: #a00"], *[style*="color:#a00"],
*[style*="color: #b00"], *[style*="color:#b00"],
*[style*="color: #c00"], *[style*="color:#c00"],
*[style*="color: #d00"], *[style*="color:#d00"],
*[style*="color: #e00"], *[style*="color:#e00"],
*[style*="color: #f00"], *[style*="color:#f00"] {
    text-shadow: none !important;
}

/* МАКСИМАЛЬНО УНИВЕРСАЛЬНОЕ ПРАВИЛО: Убираем обводку для всех темных цветов */
*[style*="color: rgb(0,"], *[style*="color:rgb(0,"],
*[style*="color: rgb(1,"], *[style*="color:rgb(1,"],
*[style*="color: rgb(2,"], *[style*="color:rgb(2,"],
*[style*="color: rgb(3,"], *[style*="color:rgb(3,"],
*[style*="color: rgb(4,"], *[style*="color:rgb(4,"],
*[style*="color: rgb(5,"], *[style*="color:rgb(5,"],
*[style*="color: rgb(6,"], *[style*="color:rgb(6,"],
*[style*="color: rgb(7,"], *[style*="color:rgb(7,"],
*[style*="color: rgb(8,"], *[style*="color:rgb(8,"],
*[style*="color: rgb(9,"], *[style*="color:rgb(9,"],
*[style*="color: rgb(10,"], *[style*="color:rgb(10,"],
*[style*="color: rgb(11,"], *[style*="color:rgb(11,"],
*[style*="color: rgb(12,"], *[style*="color:rgb(12,"],
*[style*="color: rgb(13,"], *[style*="color:rgb(13,"],
*[style*="color: rgb(14,"], *[style*="color:rgb(14,"],
*[style*="color: rgb(15,"], *[style*="color:rgb(15,"],
*[style*="color: rgb(16,"], *[style*="color:rgb(16,"],
*[style*="color: rgb(17,"], *[style*="color:rgb(17,"],
*[style*="color: rgb(18,"], *[style*="color:rgb(18,"],
*[style*="color: rgb(19,"], *[style*="color:rgb(19,"],
*[style*="color: rgb(20,"], *[style*="color:rgb(20,"],
*[style*="color: rgb(21,"], *[style*="color:rgb(21,"],
*[style*="color: rgb(22,"], *[style*="color:rgb(22,"],
*[style*="color: rgb(23,"], *[style*="color:rgb(23,"],
*[style*="color: rgb(24,"], *[style*="color:rgb(24,"],
*[style*="color: rgb(25,"], *[style*="color:rgb(25,"],
*[style*="color: rgb(26,"], *[style*="color:rgb(26,"],
*[style*="color: rgb(27,"], *[style*="color:rgb(27,"],
*[style*="color: rgb(28,"], *[style*="color:rgb(28,"],
*[style*="color: rgb(29,"], *[style*="color:rgb(29,"],
*[style*="color: rgb(30,"], *[style*="color:rgb(30,"],
*[style*="color: rgb(31,"], *[style*="color:rgb(31,"],
*[style*="color: rgb(32,"], *[style*="color:rgb(32,"],
*[style*="color: rgb(33,"], *[style*="color:rgb(33,"],
*[style*="color: rgb(34,"], *[style*="color:rgb(34,"],
*[style*="color: rgb(35,"], *[style*="color:rgb(35,"],
*[style*="color: rgb(0,0,0)"], *[style*="color:rgb(0,0,0)"],
*[style*="color: rgb(1,1,1)"], *[style*="color:rgb(1,1,1)"],
*[style*="color: rgb(2,2,2)"], *[style*="color:rgb(2,2,2)"],
*[style*="color: rgb(3,3,3)"], *[style*="color:rgb(3,3,3)"],
*[style*="color: rgb(4,4,4)"], *[style*="color:rgb(4,4,4)"],
*[style*="color: rgb(5,5,5)"], *[style*="color:rgb(5,5,5)"],
*[style*="color: rgb(6,6,6)"], *[style*="color:rgb(6,6,6)"],
*[style*="color: rgb(7,7,7)"], *[style*="color:rgb(7,7,7)"],
*[style*="color: rgb(8,8,8)"], *[style*="color:rgb(8,8,8)"],
*[style*="color: rgb(9,9,9)"], *[style*="color:rgb(9,9,9)"],
*[style*="color: rgb(10,10,10)"], *[style*="color:rgb(10,10,10)"],
*[style*="color: rgb(11,11,11)"], *[style*="color:rgb(11,11,11)"],
*[style*="color: rgb(12,12,12)"], *[style*="color:rgb(12,12,12)"],
*[style*="color: rgb(13,13,13)"], *[style*="color:rgb(13,13,13)"],
*[style*="color: rgb(14,14,14)"], *[style*="color:rgb(14,14,14)"],
*[style*="color: rgb(15,15,15)"], *[style*="color:rgb(15,15,15)"],
*[style*="color: rgb(16,16,16)"], *[style*="color:rgb(16,16,16)"],
*[style*="color: rgb(17,17,17)"], *[style*="color:rgb(17,17,17)"],
*[style*="color: rgb(18,18,18)"], *[style*="color:rgb(18,18,18)"],
*[style*="color: rgb(19,19,19)"], *[style*="color:rgb(19,19,19)"],
*[style*="color: rgb(20,20,20)"], *[style*="color:rgb(20,20,20)"],
*[style*="color: rgb(21,21,21)"], *[style*="color:rgb(21,21,21)"],
*[style*="color: rgb(22,22,22)"], *[style*="color:rgb(22,22,22)"],
*[style*="color: rgb(23,23,23)"], *[style*="color:rgb(23,23,23)"],
*[style*="color: rgb(24,24,24)"], *[style*="color:rgb(24,24,24)"],
*[style*="color: rgb(25,25,25)"], *[style*="color:rgb(25,25,25)"],
*[style*="color: rgb(26,26,26)"], *[style*="color:rgb(26,26,26)"],
*[style*="color: rgb(27,27,27)"], *[style*="color:rgb(27,27,27)"],
*[style*="color: rgb(28,28,28)"], *[style*="color:rgb(28,28,28)"],
*[style*="color: rgb(29,29,29)"], *[style*="color:rgb(29,29,29)"],
*[style*="color: rgb(30,30,30)"], *[style*="color:rgb(30,30,30)"],
*[style*="color: rgb(31,31,31)"], *[style*="color:rgb(31,31,31)"],
*[style*="color: rgb(32,32,32)"], *[style*="color:rgb(32,32,32)"],
*[style*="color: rgb(33,33,33)"], *[style*="color:rgb(33,33,33)"],
*[style*="color: rgb(34,34,34)"], *[style*="color:rgb(34,34,34)"],
*[style*="color: rgb(35,35,35)"], *[style*="color:rgb(35,35,35)"] {
    text-shadow: none !important;
}

`;

var style = $('<style id="drxaos_theme_style"></style>');

var themes = {

cyberpunk: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #5a3494;

--theme-secondary: #0088bb;

--theme-accent: #00b8d4;

--text-contrast: #ffffff;

--text-main: #d4e9f0;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--font-weight: 400;

--primary-rgb: 0, 184, 212;

--bg-rgb: 18, 14, 28;

--glass-bg: 28, 23, 42;

--glass-border: 90, 52, 144;

}

.card__title, .card__title * { color: #00B8D4 !important; text-shadow: 0 0 8px rgba(0,184,212,0.5), 0 1px 3px rgba(0,0,0,0.6) !important; font-weight: 600; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #A8D8E8 !important; text-shadow: none !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #D4E9F0 !important; text-shadow: none !important; }

html, body, .extensions {

background: linear-gradient(135deg, #0a0a1e 0%, #14091c 25%, #22072e 50%, #14091c 75%, #0a0a1e 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 20s ease infinite !important;

}

@keyframes gradientShift {

0%, 100% { background-position: 0% 50%; }

50% { background-position: 100% 50%; }

}

body .head__action, .head__action {

background: rgba(90,52,148,0.3) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(90,52,148,0.45) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #5a3494, #0088bb) !important;

box-shadow: 0 0 12px rgba(0,136,187,0.5) !important;

}

/* УБРАЛИ ВСЕ СТИЛИ ПЛЕЕРА - ВОЗВРАЩАЕМ К ДЕФОЛТНОМУ СОСТОЯНИЮ LAMPA */

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(18,14,28,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 2px solid #0088bb !important;

}


.card__quality, .card__type::after {

background: linear-gradient(135deg, #5a3494, #0088bb) !important;

font-weight: 700;

color: #FFFFFF !important;

text-shadow: none !important;

}

::-webkit-scrollbar { width: 8px; }

::-webkit-scrollbar-track { background: rgba(90,52,148,0.12) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #5a3494, #0088bb) !important; border-radius: 4px; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`,

matrix: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #00b328;

--theme-secondary: #008a20;

--theme-accent: #28e850;

--text-contrast: #000000;

--text-main: #00b328;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--primary-rgb: 0, 179, 40;

--bg-rgb: 0, 16, 0;

--glass-bg: 0, 26, 0;

--glass-border: 0, 179, 40;

}

/* ИСКЛЮЧАЕМ ПЛЕЕР ИЗ ГЛОБАЛЬНЫХ ШРИФТОВ - ВОЗВРАЩАЕМ ДЕФОЛТНЫЙ ШРИФТ LAMPA */

.card__title, .card__title * { color: #00B328 !important; text-shadow: 0 0 10px rgba(0,179,40,0.7), 0 1px 3px rgba(0,0,0,0.8) !important; font-weight: 700; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #00B328 !important; text-shadow: none !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #A8D882 !important; text-shadow: none !important; }

html, body, .extensions {

background: linear-gradient(135deg, #000 0%, #001200 25%, #002400 50%, #001200 75%, #000 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 15s ease infinite !important;

}

body .head__action, .head__action {

background: rgba(0,179,40,0.18) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(0,179,40,0.35) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #00b328, #28e850) !important;

box-shadow: 0 0 12px rgba(0,179,40,0.6) !important;

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(0,16,0,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 2px solid #00b328 !important;

}


.card__quality, .card__type::after {

background: linear-gradient(135deg, #00b328, #008a20) !important;

color: #000 !important;

font-weight: 700;

}

::-webkit-scrollbar-track { background: rgba(0,179,40,0.12) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #00b328, #008a20) !important; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`,

retrowave: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #c11850;

--theme-secondary: #8a23a0;

--theme-accent: #00c4e6;

--text-contrast: #ffffff;

--text-main: #eee;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--primary-rgb: 193, 24, 80;

--bg-rgb: 26, 1, 42;

--glass-bg: 38, 5, 56;

--glass-border: 193, 24, 80;

}

/* ИСКЛЮЧАЕМ ПЛЕЕР ИЗ ГЛОБАЛЬНЫХ ШРИФТОВ - ВОЗВРАЩАЕМ ДЕФОЛТНЫЙ ШРИФТ LAMPA */

.card__title, .card__title * { color: #00C4E6 !important; text-shadow: 0 0 12px rgba(0,196,230,0.8), 0 1px 3px rgba(0,0,0,0.7) !important; font-weight: 700; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #D4E8F5 !important; text-shadow: none !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #EDD8F5 !important; text-shadow: none !important; }

html, body, .extensions {

background: linear-gradient(135deg, #0d0221 0%, #1a012e 20%, #220734 40%, #360c3e 60%, #220734 80%, #0d0221 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 25s ease infinite !important;

}

body .head__action, .head__action {

background: rgba(138,35,160,0.25) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(193,24,80,0.45) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #c11850, #8a23a0, #00c4e6) !important;

box-shadow: 0 0 12px rgba(193,24,80,0.6) !important;

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(26,1,42,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 3px solid transparent !important;

border-image: linear-gradient(90deg, #c11850, #8a23a0, #00c4e6) 1 !important;

}


.card__quality, .card__type::after {

background: linear-gradient(135deg, #c11850, #8a23a0, #00c4e6) !important;

font-weight: 800;

color: #FFF !important;

text-shadow: none !important;

}

::-webkit-scrollbar-track { background: rgba(138,35,160,0.12) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c11850, #8a23a0, #00c4e6) !important; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`,

iceblue: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #0088bb;

--theme-secondary: #00b8cc;

--theme-accent: #3ac8d4;

--text-contrast: #001a1f;

--text-main: #ffffff;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--primary-rgb: 0, 136, 187;

--bg-rgb: 0, 22, 32;

--glass-bg: 0, 32, 44;

--glass-border: 0, 136, 187;

}

/* ИСКЛЮЧАЕМ ПЛЕЕР ИЗ ГЛОБАЛЬНЫХ ШРИФТОВ - ВОЗВРАЩАЕМ ДЕФОЛТНЫЙ ШРИФТ LAMPA */

.card__title, .card__title * { color: #00B8CC !important; text-shadow: 0 0 10px rgba(0,184,204,0.7), 0 1px 3px rgba(0,0,0,0.7) !important; font-weight: 600; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #00B8CC !important; text-shadow: none !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #A8D4E0 !important; text-shadow: none !important; }

html, body, .extensions {

background: linear-gradient(135deg, #001218 0%, #002232 30%, #003446 50%, #002232 70%, #001218 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 18s ease infinite !important;

}

body .head__action, .head__action {

background: rgba(0,136,187,0.25) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(0,136,187,0.45) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #0088bb, #00b8cc) !important;

box-shadow: 0 0 12px rgba(0,184,204,0.6) !important;

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(0,22,32,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 2px solid #0088bb !important;

}

.card__quality, .card__type::after {

background: linear-gradient(135deg, #0088bb, #00b8cc) !important;

font-weight: 700;

color: #001a1f !important;

}

::-webkit-scrollbar-track { background: rgba(0,136,187,0.12) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #0088bb, #00b8cc) !important; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`,

monochrome: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #d9d9d9;

--theme-secondary: #bfbfbf;

--theme-accent: #f5f5f5;

--text-contrast: #0a0a0a;

--text-main: #e6e6e6;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--primary-rgb: 217, 217, 217;

--bg-rgb: 10, 10, 10;

--glass-bg: 26, 26, 26;

--glass-border: 217, 217, 217;

}

/* ИСКЛЮЧАЕМ ПЛЕЕР ИЗ ГЛОБАЛЬНЫХ ШРИФТОВ - ВОЗВРАЩАЕМ ДЕФОЛТНЫЙ ШРИФТ LAMPA */

.card__title, .card__title * { color: #F5F5F5 !important; text-shadow: 0 0 8px rgba(245,245,245,0.5), 0 1px 3px rgba(0,0,0,0.8) !important; font-weight: 600; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #E6E6E6 !important; text-shadow: none !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #D1D1D1 !important; text-shadow: none !important; }

html, body, .extensions {

background: linear-gradient(135deg, #0a0a0a 0%, #161616 30%, #222222 50%, #161616 70%, #0a0a0a 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 20s ease infinite !important;

}

body .head__action, .head__action {

background: rgba(217,217,217,0.15) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(217,217,217,0.3) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #d9d9d9, #bfbfbf) !important;

box-shadow: 0 0 12px rgba(217,217,217,0.5) !important;

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(10,10,10,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 2px solid #d9d9d9 !important;

}


font-weight: 600;

}

.card__quality, .card__type::after {

background: linear-gradient(135deg, #d9d9d9, #bfbfbf) !important;

font-weight: 700;

color: #0a0a0a !important;

}

::-webkit-scrollbar-track { background: rgba(217,217,217,0.08) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #d9d9d9, #bfbfbf) !important; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`,

yinyang: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #1a1a1a;

--theme-secondary: #d9d9d9;

--theme-accent: #7a7a7a;

--text-contrast: #ffffff;

--text-main: #e6e6e6;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--primary-rgb: 122, 122, 122;

--bg-rgb: 14, 14, 14;

--glass-bg: 30, 30, 30;

--glass-border: 122, 122, 122;

}

/* ИСКЛЮЧАЕМ ПЛЕЕР ИЗ ГЛОБАЛЬНЫХ ШРИФТОВ - ВОЗВРАЩАЕМ ДЕФОЛТНЫЙ ШРИФТ LAMPA */

.card__title, .card__title * { color: #E6E6E6 !important; text-shadow: 0 2px 5px rgba(0,0,0,0.9) !important; font-weight: 600; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #E6E6E6 !important; text-shadow: 0 1px 3px rgba(0,0,0,0.7) !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #C4C4C4 !important; text-shadow: none !important; }

html, body, .extensions {

background: radial-gradient(circle at 30% 50%, #000 0%, #161616 30%, #d9d9d9 31%, #d9d9d9 32%, #161616 33%, #000 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 30s ease infinite !important;

}

body .head__action, .head__action {

background: rgba(122,122,122,0.25) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(217,217,217,0.3) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #1a1a1a, #d9d9d9, #1a1a1a) !important;

box-shadow: 0 0 12px rgba(122,122,122,0.6) !important;

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(14,14,14,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 2px solid #7a7a7a !important;

}


transform: translateX(5px) translateZ(0) !important;

font-weight: 600;

}

.card__quality, .card__type::after {

background: linear-gradient(135deg, #1a1a1a, #d9d9d9) !important;

font-weight: 700;

color: #1a1a1a !important;

}

::-webkit-scrollbar-track { background: rgba(122,122,122,0.12) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #1a1a1a, #7a7a7a, #d9d9d9) !important; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`,

sunset: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #c8493f;

--theme-secondary: #d4711e;

--theme-accent: #e68f10;

--text-contrast: #ffffff;

--text-main: #f5d0a8;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--primary-rgb: 200, 73, 63;

--bg-rgb: 20, 8, 4;

--glass-bg: 32, 16, 8;

--glass-border: 200, 73, 63;

}

/* ИСКЛЮЧАЕМ ПЛЕЕР ИЗ ГЛОБАЛЬНЫХ ШРИФТОВ - ВОЗВРАЩАЕМ ДЕФОЛТНЫЙ ШРИФТ LAMPA */

.card__title, .card__title * { color: #E68F10 !important; text-shadow: 0 0 10px rgba(230,143,16,0.7), 0 1px 3px rgba(0,0,0,0.7) !important; font-weight: 600; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #F5D088 !important; text-shadow: none !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #F5D0A8 !important; text-shadow: none !important; }

html, body, .extensions {

background: linear-gradient(135deg, #140804 0%, #301610 25%, #c8493f 50%, #301610 75%, #140804 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 22s ease infinite !important;

}

body .head__action, .head__action {

background: rgba(200,73,63,0.25) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(200,73,63,0.45) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #c8493f, #d4711e) !important;

box-shadow: 0 0 12px rgba(200,73,63,0.6) !important;

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(20,8,4,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 2px solid #c8493f !important;

}


border: 2px solid #e68f10 !important;

transform: translateX(5px) translateZ(0) !important;

font-weight: 600;

}

.card__quality, .card__type::after {

background: linear-gradient(135deg, #c8493f, #d4711e) !important;

font-weight: 700;

color: #FFF !important;

text-shadow: none !important;

}

::-webkit-scrollbar-track { background: rgba(200,73,63,0.12) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c8493f, #d4711e, #e68f10) !important; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`,

ocean: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #004d6a;

--theme-secondary: #00699a;

--theme-accent: #18b0d8;

--text-contrast: #ffffff;

--text-main: #a8d8e8;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--primary-rgb: 6, 105, 154;

--bg-rgb: 4, 16, 24;

--glass-bg: 8, 29, 42;

--glass-border: 6, 105, 154;

}

/* ИСКЛЮЧАЕМ ПЛЕЕР ИЗ ГЛОБАЛЬНЫХ ШРИФТОВ - ВОЗВРАЩАЕМ ДЕФОЛТНЫЙ ШРИФТ LAMPA */

.card__title, .card__title * { color: #40CAE8 !important; text-shadow: 0 0 10px rgba(64,202,232,0.6), 0 1px 3px rgba(0,0,0,0.6) !important; font-weight: 600; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #94DCF0 !important; text-shadow: none !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #A8D8E8 !important; text-shadow: none !important; }

html, body, .extensions {

background: linear-gradient(135deg, #041018 0%, #092639 25%, #004d6a 50%, #092639 75%, #041018 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 20s ease infinite !important;

}

body .head__action, .head__action {

background: rgba(6,105,154,0.25) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(6,105,154,0.45) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #004d6a, #00699a) !important;

box-shadow: 0 0 12px rgba(6,105,154,0.6) !important;

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(4,16,24,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 2px solid #00699a !important;

}


transform: translateX(5px) translateZ(0) !important;

font-weight: 600;

}

.card__quality, .card__type::after {

background: linear-gradient(135deg, #004d6a, #00699a) !important;

font-weight: 700;

color: #FFF !important;

text-shadow: none !important;

}

::-webkit-scrollbar-track { background: rgba(6,105,154,0.12) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #004d6a, #00699a, #18b0d8) !important; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`,

forest: `

/* Шрифты загружаются глобально для оптимизации производительности */

:root {

--theme-primary: #284612;

--theme-secondary: #446d0c;

--theme-accent: #68a00a;

--text-contrast: #ffffff;

--text-main: #d0e698;

--font-family: 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

--primary-rgb: 68, 109, 12;

--bg-rgb: 8, 16, 4;

--glass-bg: 16, 29, 8;

--glass-border: 68, 109, 12;

}

/* ИСКЛЮЧАЕМ ПЛЕЕР ИЗ ГЛОБАЛЬНЫХ ШРИФТОВ - ВОЗВРАЩАЕМ ДЕФОЛТНЫЙ ШРИФТ LAMPA */

.card__title, .card__title * { color: #9DCE54 !important; text-shadow: 0 0 10px rgba(157,206,84,0.6), 0 1px 3px rgba(0,0,0,0.7) !important; font-weight: 600; }

.full-start__title, .full-start__title *, .menu__item-title, .menu__item-title *, .settings__title, .settings__title * { color: #C2DC80 !important; text-shadow: none !important; }

.card__description, .card__description *, .info__line, .info__line * { color: #D0E698 !important; text-shadow: none !important; }

html, body, .extensions {

background: linear-gradient(135deg, #081004 0%, #142206 25%, #284612 50%, #142206 75%, #081004 100%) !important;

background-size: 400% 400% !important;

animation: gradientShift 25s ease infinite !important;

}

body .head__action, .head__action {

background: rgba(68,109,12,0.25) !important;

backdrop-filter: blur(20px) saturate(180%) !important;

border: 1.5px solid rgba(68,109,12,0.45) !important;

border-radius: 2em !important;

transition: transform 0.15s ease, opacity 0.15s ease !important;

}

body .head__action.focus, body .head__action:hover {

background: linear-gradient(45deg, #284612, #446d0c) !important;

box-shadow: 0 0 12px rgba(68,109,12,0.6) !important;

transform: scale(var(--hover-scale, 1.08)) translateZ(0) !important;

}

body .navigation-bar__body, .navigation-bar__body {

background: rgba(8,16,4,${alpha}) !important;

backdrop-filter: blur(30px) saturate(180%) !important;

-webkit-backdrop-filter: blur(30px) saturate(180%) !important;

border-bottom: 2px solid #446d0c !important;

}


transform: translateX(5px) translateZ(0) !important;

font-weight: 600;

}

.card__quality, .card__type::after {

background: linear-gradient(135deg, #284612, #446d0c) !important;

font-weight: 700;

color: #FFF !important;

text-shadow: none !important;

}

::-webkit-scrollbar-track { background: rgba(68,109,12,0.12) !important; }

::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #284612, #446d0c, #68a00a) !important; }


/* === LOADER - ВСЕ ТИПЫ === */

.activity__loader,
.loader,
.loader__icon,
.broadcast__loader,
.player__loader,
.selector__loader,
.torrent-item__loader,
.files__loader,
.online__loader,
.full-start__loader,
.modal-loading,
body .activity__loader,
body .loader,
body .loader__icon,
body .broadcast__loader,
body .player__loader,
body .selector__loader,
body .torrent-item__loader,
body .files__loader,
body .online__loader,
body .modal-loading {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100px' height='100px' viewBox='0 0 100 100'%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.4s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect y='25' width='10' height='50' rx='4' ry='4' fill='%23fff'%3E%3Canimate attributeName='x' values='10;100' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 10 70' to='-60 100 70' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='0;1;0' dur='1.2s' begin='0.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3C/svg%3E") no-repeat 50% 50% !important;
    background-size: contain !important;
}

/* Специальный стиль для .modal-loading */
.modal-loading,
body .modal-loading {
    height: 6em !important;
}

/* Скрываем внутренности loader */
.loader::before,
.loader::after,
.loader svg,
.loader > *,
.loader__icon::before,
.loader__icon::after,
.loader__icon svg,
.loader__icon > * {
    display: none !important;
}

/* === МОДАЛЬНЫЕ ОКНА === */

/* ИСКЛЮЧАЕМ .modal И .modal__content ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal,
.modal__content,
body .modal,
body .modal__content {
    background: unset !important;
    backdrop-filter: unset !important;
    -webkit-backdrop-filter: unset !important;
    border: unset !important;
    border-radius: unset !important;
    box-shadow: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__head ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__head,
body .modal__head {
    background: unset !important;
    backdrop-filter: unset !important;
    border-bottom: unset !important;
    padding: unset !important;
    border-radius: unset !important;
}

/* ИСКЛЮЧАЕМ .modal__body ИЗ СТИЛИЗАЦИИ - СТАНДАРТНЫЙ ВИД */
.modal__body,
body .modal__body {
    background: unset !important;
    padding: unset !important;
}

.about,
body .about {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.92)) !important;
    backdrop-filter: blur(45px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(45px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.4) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    padding: 2em !important;
}

.console,
body .console {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.96)) !important;
    backdrop-filter: blur(35px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.35) !important;
    border-radius: 2em !important;
    font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
    font-weight: 400 !important;
}

/* Специальные правила для консоли на мобильных устройствах */
@media (max-width: 768px) {
    .console,
    body .console,
    .console *,
    .console_line,
    .console_line * {
        font-family: 'Consolas', 'Monaco', 'Courier New', 'Lucida Console', monospace !important;
        font-size: 0.9em !important;
        line-height: 1.4 !important;
        letter-spacing: 0.5px !important;
    }
}
}

.console_line,
.console_line.selector,
body .console_line,
body .console_line.selector {
    background: rgba(255,255,255,0.03) !important;
    backdrop-filter: blur(8px) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 0.5em !important;
    padding: 0.5em 1em !important;
    margin: 0.2em 0 !important;
    transition: all 0.3s ease !important;
}

.console_line:hover,
.console_line.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.15)) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}

.console_tab,
.console_tab.selector,
body .console_tab,
body .console_tab.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 0.8em !important;
    padding: 0.7em 1.5em !important;
    margin: 0.4em !important;
    transition: all 0.3s ease !important;
}

.console_tab:hover,
.console_tab.focus,
.console_tab.selector.active {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.2), rgba(var(--primary-rgb), 0.3)) !important;
    border-color: rgba(var(--primary-rgb), 0.6) !important;
    transform: scale(var(--hover-scale, 1.05)) !important;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions,
body .extensions {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(0,0,0,0.93)) !important;
    backdrop-filter: blur(40px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.38) !important;
    border-radius: 2em !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.6) !important;
}

.extensions__block-add,
.extensions__block-add.selector,
body .extensions__block-add,
body .extensions__block-add.selector {
    background: rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 1.2em !important;
    padding: 1.2em !important;
    margin: 0.8em 0 !important;
    transition: all 0.3s ease !important;
}

.extensions__block-add:hover,
.extensions__block-add.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.18), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 5px 20px rgba(var(--primary-rgb), 0.3) !important;
}

.extensions__item,
body .extensions__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.extensions__item:hover,
.extensions__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

.selector__item,
body .selector__item {
    background: rgba(255,255,255,0.04) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 1em !important;
    padding: 1em 1.5em !important;
    margin: 0.5em 0 !important;
    transition: all 0.3s ease !important;
}

.selector__item:hover,
.selector__item.focus {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.25)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    transform: translateX(8px) scale(var(--hover-scale, 1.02)) !important;
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4) !important;
}

/* === ПОЛЯ ВВОДА НАСТРОЕК === */

.settings-input__content,
body .settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.08), rgba(0,0,0,0.95)) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.25) !important;
    border-radius: 0.8em !important;
    padding: 1.5em !important;
    transition: all 0.3s ease !important;
}

.settings-input__content:focus,
.settings-input__content.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(0,0,0,0.95)) !important;
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3) !important;
}

${commonStyles}

`

};

var themeCSS = themes[theme] || '';

// Оптимизация для ТВ-устройств - заменяем backdrop-filter на простые тени
if (isTVDevice) {
    themeCSS = themeCSS.replace(/backdrop-filter:\s*blur\([^)]+\)[^;]*;?/gi, '');
    themeCSS = themeCSS.replace(/-webkit-backdrop-filter:\s*blur\([^)]+\)[^;]*;?/gi, '');
    themeCSS = themeCSS.replace(/backdrop-filter:\s*blur\([^)]+\)\s*saturate\([^)]+\)[^;]*;?/gi, '');
    themeCSS = themeCSS.replace(/-webkit-backdrop-filter:\s*blur\([^)]+\)\s*saturate\([^)]+\)[^;]*;?/gi, '');
    
    // Добавляем простые тени вместо backdrop-filter
    themeCSS += `
    .card, .menu__item, .settings-param, .files__item, .torrent-item,
    .filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line,
    .online-prestige__item, .online-prestige__line, .online__tabs-item, 
    .full-start__button, .head__action {
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    }
    `;
}

style.html(themeCSS);

$('head').append(style);

// Применение стилей к карточкам
setTimeout(function() {
    $('.card').each(function() {
        var $card = $(this);
        var $img = $card.find('.card__img');
        
        if ($img.length) {
            $img.css({
                'border': 'none !important',
                'border-radius': '1em !important',
                'transition': 'all 0.3s ease !important',
                'box-sizing': 'border-box !important'
            });
            
            $img.addClass('drxaos-styled');
        }
    });
    
    // Используем единую систему обработки событий
    cardEventManager.initCardEvents();
}, 100);

// Дополнительное применение стилей через 1 секунду
setTimeout(function() {
    $('.card').each(function() {
        var $card = $(this);
        var $img = $card.find('.card__img');
        
        if ($img.length && !$img.hasClass('drxaos-styled')) {
            $img.css({
                'border': 'none !important',
                'border-radius': '1em !important',
                'transition': 'all 0.3s ease !important',
                'box-sizing': 'border-box !important'
            });
            
            $img.addClass('drxaos-styled');
        }
    });
}, 1000);

// Убираем задержки и логи для модальных окон


        applyAnimations();
        
        applyFontWeight();
        applyGlow();
        
        // ПРОСТОЙ СПОСОБ - ПРЯМЫЕ ОБВОДКИ НА .card__img
        var outlineCSS = `
            .card:hover .card__img,
            .card.focus .card__img {
                border: 5px solid var(--theme-primary, #5a3494) !important;
                border-radius: 1em !important;
                box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
                outline: none !important;
            }
            .card.focus .card__img {
                border-color: var(--theme-accent, #0088bb) !important;
                box-shadow: 0 0 30px var(--theme-accent, #0088bb) !important;
            }
        `;
        
        // Добавляем стили в head
        if (!$('#drxaos-outline-styles').length) {
            $('head').append('<style id="drxaos-outline-styles">' + outlineCSS + '</style>');
        }
        
        // Принудительно применяем стили к существующим карточкам
        setTimeout(function() {
            $('.card .card__img').each(function() {
                var $img = $(this);
                $img.css({
                    'border': '2px solid var(--theme-primary, #5a3494)',
                    'border-radius': '1em',
                    'box-shadow': '0 4px 12px rgba(0,0,0,0.3)',
                    'transition': 'all 0.3s ease'
                });
            });
        }, 1000);
        
        // Пересоздаем обводки при изменении тем
        setTimeout(function() {
            createPosterOutlines();
        }, 2000);
    } catch(e) {
        // lampaLogger.error('Ошибка применения темы', e);
    }

applyFullButtons();

}

function applyAnimations() {
    try {
        if (!window.jQuery || !window.$) return;
var animations = Lampa.Storage.get('drxaos_animations', true);

styleManager.removeStyle('drxaos_animations_style');

if (animations) {
    // Определяем тип устройства через единую систему
    var isTV = deviceDetection.isTV();
    
    // Оптимизация анимаций для ТВ-устройств
    var animationCSS = isTV ? 
        // Оптимизированные анимации для TV 2025
        '.card, .menu__item, .settings-param, .files__item, .torrent-item, .filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line, .online-prestige__item, .online-prestige__line, .online__tabs-item, .full-start__button, .head__action { transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important; will-change: transform, opacity !important; contain: layout style paint !important; }' :
        // Полные анимации для ПК/мобильных
        '.card, .menu__item, .settings-param, .files__item, .torrent-item, .filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line, .online-prestige__item, .online-prestige__line, .online__tabs-item, .full-start__button, .head__action { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; will-change: auto !important; }';
    
    styleManager.setStyle('drxaos_animations_style', animationCSS);
    
    // Применение стилей к карточкам с оптимизацией для TV
    setTimeout(function() {
        $('.card').each(function() {
            var $card = $(this);
            var $img = $card.find('.card__img');
            
            if ($img.length) {
                var transitionType = isTV ? 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.3s ease';
                
                $img.css({
                    'border': 'none !important',
                    'border-radius': '1em !important',
                    'transition': transitionType + ' !important',
                    'box-sizing': 'border-box !important',
                    'will-change': isTV ? 'transform, border-color, box-shadow !important' : 'auto !important',
                    'contain': isTV ? 'layout style paint !important' : 'none !important'
                });
                
                $img.addClass('drxaos-styled');
            }
        });
    }, 50);
}
    } catch(e) {
        // lampaLogger.error('Ошибка применения анимаций', e);
    }
}

function applyFontWeight() {
    try {
        if (!window.jQuery || !window.$) return;
        
        var fontWeight = Lampa.Storage.get('drxaos_font_weight', '400');
        
        styleManager.removeStyle('drxaos_font_weight_style');
        
        // Чистые CSS-свойства для толщины шрифта без костылей
        var additionalCSS = `
            text-shadow: none !important;
            font-stretch: normal !important;
            letter-spacing: normal !important;
        `;
        
        var fontWeightCSS = `
            :root {
                --font-weight: ${fontWeight} !important;
            }
            
            *, body, .card, .menu__item, .settings-param, .files__item, .torrent-item,
            .filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line,
            .online-prestige__item, .online-prestige__line, .online__tabs-item, 
            .full-start__button, .head__action, .card__title, .card__description,
            .menu__item-title, .settings__title, .full-start__title {
                font-weight: var(--font-weight, ${fontWeight}) !important;
                ${additionalCSS}
            }
        `;
        
        styleManager.setStyle('drxaos_font_weight_style', fontWeightCSS);
        
    } catch(e) {
        // lampaLogger.error('Ошибка применения толщины шрифта', e);
    }
}

function applyGlow() {
    try {
        if (!window.jQuery || !window.$) return;
        
        var glow = Lampa.Storage.get('drxaos_glow', 'medium');
        var glowValues = { 'off': '0', 'low': '0.15em', 'medium': '0.3em', 'high': '0.5em' };
        var glowSize = glowValues[glow] || '0.3em';
        
        styleManager.removeStyle('drxaos-glow-styles');
        
        var glowCSS = `
            body .card:hover .card__img, .card:hover .card__img {
                box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
            }
            body .card.focus .card__img, .card.focus .card__img {
                box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
            }
            .menu__item:hover {
                box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
            }
            .button, .settings-param {
                box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
            }
            .drxaos-theme-quick-btn:hover {
                box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494) !important;
            }
            .filter--search:hover, .filter--sort:hover, .filter--filter:hover,
            .simple-button--filter:hover, .selector--filter:hover,
            div.simple-button.simple-button--filter.filter--filter.selector:hover {
                box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
            }
            .torrent-serial_content:hover, div.torrent-serial_content:hover {
                box-shadow: 0 0 ${glowSize} var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
            }
        `;
        
        styleManager.setStyle('drxaos-glow-styles', glowCSS);
        
    } catch(e) {
        // lampaLogger.error('Ошибка применения свечения', e);
    }
}

function applyFullButtons() {
    try {
        if (!window.jQuery || !window.$) return;
var fullbuttons = Lampa.Storage.get('drxaos_fullbuttons', false);

styleManager.removeStyle('drxaos_fullbuttons_style');

if (fullbuttons) {

styleManager.setStyle('drxaos_fullbuttons_style_on', '.full-start__button span { display: inline !important; }');

} else {

styleManager.setStyle('drxaos_fullbuttons_style', '.full-start__button span { display: none !important; }');

}
    } catch(e) {
        // lampaLogger.error('Ошибка применения полных кнопок', e);
    }
}

function createQuickThemeModal() {
    try {
        if (!window.jQuery || !window.$) return;
        
        // Функция закрытия модального окна
        function closeModal() {
            var modal = document.querySelector('.drxaos-quick-theme-modal');
            if (modal) {
                modal.remove();
                // Очищаем обработчики событий
                $(document).off('keydown.quickThemeModal');
                $(document).off('keyup.quickThemeModal');
                $(document).off('keydown.quickThemeNavigation');
                
                // Сбрасываем состояние кнопки с кисточкой
                var quickBtn = document.querySelector('#drxaos-quick-theme-btn');
                if (quickBtn) {
                    quickBtn.classList.remove('focus', 'focused', 'active');
                    quickBtn.blur();
                }
            }
        }
        
var modal = $('<div class="drxaos-quick-theme-modal"></div>');

var overlay = $('<div class="drxaos-modal-overlay"></div>');

var content = $('<div class="drxaos-modal-content"></div>');

var title = $('<h2 class="drxaos-modal-title">🎨 Выберите тему</h2>');

var themesGrid = $('<div class="drxaos-themes-grid"></div>');

// Переменная для предотвращения множественных вызовов
var themesList = [
{ id: 'cyberpunk', name: '🔮 Киберпанк', icon: '🔮' },
{ id: 'matrix', name: '💚 Матрица', icon: '💚' },
{ id: 'retrowave', name: '🌈 Ретроволна', icon: '🌈' },
{ id: 'iceblue', name: '❄️ Ледяная', icon: '❄️' },
{ id: 'monochrome', name: '⚪ Монохром', icon: '⚪' },
{ id: 'yinyang', name: '☯️ Инь-Янь', icon: '☯️' },
{ id: 'sunset', name: '🌅 Закат', icon: '🌅' },
{ id: 'ocean', name: '🌊 Океан', icon: '🌊' },
{ id: 'forest', name: '🌲 Лес', icon: '🌲' },
{ id: 'default', name: '🎯 Стандарт', icon: '🎯' }
];

var currentTheme = Lampa.Storage.get('drxaos_theme', 'default');

// Функция закрытия модального окна
function closeModal() {
    // Удаляем все обработчики событий
    $(document).off('keydown.quickThemeModal');
    $(document).off('keydown.quickThemeNavigation');
    $(document).off('click.quickThemeModal');
    // НЕ удаляем глобальный обработчик Esc - он должен работать всегда
    
    // Убираем фокус с модального окна
    if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
    }
    
    // Находим модальное окно и закрываем его
    var $modal = $('.drxaos-quick-theme-modal');
    if ($modal.length > 0) {
        $modal.stop().fadeOut(200, function() {
            $modal.remove();
            
            // Возвращаем фокус на кнопку быстрого выбора тем после закрытия
            setTimeout(function() {
                var $btn = $('#drxaos-quick-theme-btn');
                if ($btn.length) {
                    $btn.focus();
                } else {
                    // Если кнопка не найдена, убираем фокус с любого элемента
                    if (document.activeElement && document.activeElement.blur) {
                        document.activeElement.blur();
                    }
                }
            }, 100);
        });
    }
}

// Функция активации темы
function activateTheme(themeId) {
    // Сохраняем текущую тему ДО попытки изменения для возможности восстановления
    var previousTheme = Lampa.Storage.get('drxaos_theme', 'default');
    
    try {
        // lampaLogger.log('Активация темы', { theme: themeId });
        Lampa.Storage.set('drxaos_theme', themeId);
        applyTheme(themeId);
        applyAdvancedSettings();
        // lampaLogger.log('Тема активирована успешно', { theme: themeId });
    } catch(e) {
        // Обработка ошибок при смене темы
        console.error('Ошибка активации темы:', e);
        // Восстанавливаем предыдущую тему
        if (previousTheme !== themeId) {
            Lampa.Storage.set('drxaos_theme', previousTheme);
            try {
                applyTheme(previousTheme);
                applyAdvancedSettings();
            } catch(restoreError) {
                console.error('Ошибка восстановления темы:', restoreError);
            }
        }
    }
    
    // ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ СТИЛЕЙ КНОПКИ ФИЛЬТРА ПРИ СМЕНЕ ТЕМЫ
    setTimeout(function() {
        var filterButtons = document.querySelectorAll('div.simple-button.simple-button--filter.filter--filter.selector');
        
        filterButtons.forEach(function(button) {
            if (button) {
                button.style.setProperty('background', 'var(--glass-bg, rgba(0,0,0,0.7))', 'important');
                button.style.setProperty('border', '2px solid var(--theme-primary, #5a3494)', 'important');
                button.style.setProperty('border-radius', '2em', 'important');
                button.style.setProperty('color', 'var(--text-main, #ffffff)', 'important');
                button.style.setProperty('box-shadow', '0 4px 12px rgba(0,0,0,0.3)', 'important');
            }
        });
    }, 200);
    
    
    // Закрываем модальное окно с задержкой для корректного возврата фокуса
    setTimeout(function() {
        closeModal();
        
        // Дополнительная защита - убираем фокус после выбора темы
        setTimeout(function() {
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
            
            // Возвращаем фокус на кнопку быстрого выбора тем
            var $btn = $('#drxaos-quick-theme-btn');
            if ($btn.length) {
                $btn.focus();
            }
        }, 200);
    }, 100);
}

themesList.forEach(function(theme) {
    var themeBtn = $('<div class="drxaos-theme-item' + (currentTheme === theme.id ? ' active' : '') + '" data-theme="' + theme.id + '" tabindex="0" role="button" aria-label="Выбрать тему ' + theme.name + '"><span class="drxaos-theme-icon">' + theme.icon + '</span><span class="drxaos-theme-name">' + theme.name + '</span></div>');

    // Обработчик клика
    themeBtn.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            var selectedTheme = $(this).data('theme');
            activateTheme(selectedTheme);
            
            // Сбрасываем состояние кнопки с кисточкой после выбора темы
            var quickBtn = document.querySelector('#drxaos-quick-theme-btn');
            if (quickBtn) {
                quickBtn.classList.remove('focus', 'focused', 'active');
                quickBtn.blur();
            }
        } catch(error) {
            console.error('Ошибка при выборе темы:', error);
            // Закрываем модальное окно даже при ошибке
            closeModal();
        }
    });

    // Обработчик клавиатуры
    themeBtn.on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            e.stopPropagation();
            var selectedTheme = $(this).data('theme');
            activateTheme(selectedTheme);
            
            // Сбрасываем состояние кнопки с кисточкой после выбора темы
            var quickBtn = document.querySelector('#drxaos-quick-theme-btn');
            if (quickBtn) {
                quickBtn.classList.remove('focus', 'focused', 'active');
                quickBtn.blur();
            }
        }
    });

    // Обработчики фокуса
    themeBtn.on('focus', function() {
        $('.drxaos-theme-item').removeClass('active');
        $(this).addClass('active');
    });

    themeBtn.on('mouseenter', function() {
        $('.drxaos-theme-item').removeClass('active');
        $(this).addClass('active');
});

themesGrid.append(themeBtn);
});

content.append(title).append(themesGrid);
modal.append(overlay).append(content);

// Дополнительная защита для ТВ - обработчик кнопки Назад через Lampa
if (typeof Lampa !== 'undefined' && Lampa.Listener) {
    // Обработчик кнопки "назад" для ТВ
    var backHandler = function() {
        var $modal = $('.drxaos-quick-theme-modal');
        if ($modal.length > 0 && $modal.is(':visible')) {
            closeModal();
            return false; // Предотвращаем стандартное поведение
        }
        return true; // Позволяем стандартное поведение
    };
    
    // Регистрируем обработчик
    Lampa.Listener.follow('back', backHandler);
}

// Глобальный обработчик Esc для выхода после изменения темы
$(document).on('keydown.quickThemeGlobal', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        // Проверяем, есть ли открытое модальное окно
        var $modal = $('.drxaos-quick-theme-modal');
        if ($modal.length > 0 && $modal.is(':visible')) {
            // Модальное окно открыто - закрываем его
            closeModal();
        } else {
            // Модальное окно закрыто - убираем фокус и возвращаем на кнопку
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
            
            // Возвращаем фокус на кнопку быстрого выбора тем
            var $btn = $('#drxaos-quick-theme-btn');
            if ($btn.length) {
                $btn.focus();
            }
        }
    }
});

// Обработчик клика по overlay
overlay.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
});

// Единый обработчик для всех кнопок закрытия модального окна
$(document).on('keydown.quickThemeModal', function(e) {
    if (document.querySelector('.drxaos-quick-theme-modal')) {
        // Все возможные коды кнопки "Назад" и ESC
        if (e.key === 'Escape' || e.keyCode === 27 || 
            e.key === 'Backspace' || e.keyCode === 8 ||
            e.key === 'Back' || e.keyCode === 166 ||
            e.keyCode === 461 || e.keyCode === 462 || e.keyCode === 10009 ||
            e.keyCode === 4 || e.keyCode === 111 || e.keyCode === 115) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
            return false;
        }
    }
});

// Дополнительный обработчик для Android TV и Fire TV
$(document).on('keyup.quickThemeModal', function(e) {
    if (document.querySelector('.drxaos-quick-theme-modal')) {
        // Дополнительные коды для Android TV
        if (e.keyCode === 4 || e.keyCode === 111 || e.keyCode === 115) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
            return false;
        }
    }
});

// Предотвращаем закрытие при клике на содержимое модального окна
content.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
});

// Удален дублирующийся обработчик - используется единый выше

// Обработчик для навигации стрелками и кнопки Назад
$(document).on('keydown.quickThemeNavigation', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        
        var $items = $('.drxaos-theme-item');
        var $active = $items.filter('.active');
        var currentIndex = $items.index($active);
        var newIndex = currentIndex;
        
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : $items.length - 1;
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            newIndex = currentIndex < $items.length - 1 ? currentIndex + 1 : 0;
        }
        
        $active.removeClass('active');
        $items.eq(newIndex).addClass('active').focus();
    } else if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        var selectedTheme = $('.drxaos-theme-item.active').data('theme');
        if (selectedTheme) {
            activateTheme(selectedTheme);
            
            // Сбрасываем состояние кнопки с кисточкой после выбора темы
            var quickBtn = document.querySelector('#drxaos-quick-theme-btn');
            if (quickBtn) {
                quickBtn.classList.remove('focus', 'focused', 'active');
                quickBtn.blur();
            }
        }
    } else if (e.key === 'Backspace' || e.keyCode === 8 ||
               e.key === 'Back' || e.keyCode === 166 ||
               e.keyCode === 461 || e.keyCode === 462 || e.keyCode === 10009) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
        return false;
    }
});

var styles = `

<style>

.drxaos-quick-theme-modal {

position: fixed;

top: 0;

left: 0;

width: 100%;

height: 100%;

z-index: 10000;

display: flex;

align-items: center;

justify-content: center;

font-family: var(--font-family, 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Color Emoji', 'Apple Color Emoji', 'Twemoji', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif);

font-weight: var(--font-weight, 400);

}

.drxaos-modal-overlay {

position: absolute;

top: 0;

left: 0;

width: 100%;

height: 100%;

background: rgba(0, 0, 0, 0.7);

backdrop-filter: blur(10px);

-webkit-backdrop-filter: blur(10px);

cursor: pointer;

z-index: 1;

}

.drxaos-modal-content {

position: relative;

z-index: 2;

background: rgba(30, 30, 40, 0.95);

backdrop-filter: blur(40px) saturate(180%);

-webkit-backdrop-filter: blur(40px) saturate(180%);

border: 2px solid rgba(107, 63, 174, 0.6);

border-radius: 1.5em;

padding: 2em;

max-width: 90%;

width: 700px;

box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

animation: modalSlideIn 0.3s ease-out;

cursor: default;

}

@keyframes modalSlideIn {

from {

opacity: 0;

transform: translateY(-30px) scale(0.95);

}

to {

opacity: 1;

transform: translateY(0) scale(1);

}

}

.drxaos-modal-title {

color: #00c8e6;

font-size: 1.8em;

font-weight: 700;

margin: 0 0 1em 0;

text-align: center;

text-shadow: 0 0 20px rgba(0, 200, 230, 0.6);

}

.drxaos-themes-grid {

display: grid;

grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));

gap: 1em;

}

.drxaos-theme-item {

background: rgba(50, 50, 70, 0.5);

border: 2px solid rgba(107, 63, 174, 0.3);

border-radius: 1em;

padding: 1.5em 1em;

cursor: pointer;

transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

display: flex;

flex-direction: column;

align-items: center;

gap: 0.5em;

backdrop-filter: blur(10px);

-webkit-backdrop-filter: blur(10px);

}

.drxaos-theme-item:hover {

background: linear-gradient(135deg, rgba(107, 63, 174, 0.4), rgba(0, 153, 204, 0.4));

border-color: #00c8e6;

transform: translateY(-5px) scale(1.05);

box-shadow: 0 10px 30px rgba(0, 200, 230, 0.4);

}

.drxaos-theme-item.active {

background: linear-gradient(135deg, #6b3fae, #0099cc);

border-color: #00c8e6;

box-shadow: 0 0 20px rgba(0, 200, 230, 0.6);

}

.drxaos-theme-item:focus {

outline: none;

background: linear-gradient(135deg, rgba(107, 63, 174, 0.6), rgba(0, 153, 204, 0.6));

border-color: #00c8e6;

transform: translateY(-3px) scale(1.02);

box-shadow: 0 8px 25px rgba(0, 200, 230, 0.5);

}

.drxaos-theme-icon {

font-size: 2.5em;

line-height: 1;

filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

}

.drxaos-theme-name {

color: #fff;

font-size: 0.9em;

font-weight: 600;

text-align: center;

text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);

}

.drxaos-theme-item.active .drxaos-theme-name {

color: #fff;

font-weight: 700;

text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);

}

</style>

`;

$('head').append(styles);

$('body').append(modal);

modal.hide().fadeIn(300, function() {
    // Фокусируемся на активной теме или первой теме
    var $activeItem = $('.drxaos-theme-item.active');
    if ($activeItem.length > 0) {
        $activeItem.focus();
    } else {
        $('.drxaos-theme-item').first().focus().addClass('active');
    }
});
    } catch(e) {
        // lampaLogger.error('Ошибка создания модального окна выбора тем', e);
    }
}

function addQuickThemeButton() {
    try {
        if (!window.jQuery || !window.$) return;
        
var checkInterval = setInterval(function() {
if ($('.head__actions').length > 0 && $('#drxaos-quick-theme-btn').length === 0) {
                // Создаем кнопку как нативный элемент Lampa (правильный способ)
                var btn = $('<div class="head__action drxaos-theme-quick-btn selector" id="drxaos-quick-theme-btn" title="Быстрый выбор темы" data-action="drxaos-quick-theme"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41zM7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3z" fill="currentColor"/></svg></div>');

                // Добавляем кнопку в DOM
$('.head__actions').prepend(btn);

                // Проверяем, что кнопка создана
                if (btn && btn.length > 0) {
                    // Правильные обработчики для Lampa (как в других плагинах)
                    btn.on('hover:enter', function() {
                        // Проверяем, не открыто ли уже модальное окно
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });

                    btn.on('click', function() {
                        // Проверяем, не открыто ли уже модальное окно
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                    
                    // Отключаем перехват фокуса кнопкой
                    btn.on('focus', function() {
                        // Сразу убираем фокус с кнопки
                        setTimeout(function() {
                            btn.blur();
                        }, 100);
                    });
                    
                    // Предотвращаем получение фокуса
                    btn.attr('tabindex', '-1');
                }

clearInterval(checkInterval);
}
}, 100);

setTimeout(function() {
clearInterval(checkInterval);
}, 10000);

        // Добавляем обработчик для отслеживания изменений в навигации
        var lastHash = window.location.hash;
        setInterval(function() {
            var currentHash = window.location.hash;
            if (currentHash !== lastHash) {
                lastHash = currentHash;
                
                // Всегда восстанавливаем кнопку при навигации
                if ($('.head__actions').length > 0 && $('#drxaos-quick-theme-btn').length === 0) {
                    var btn = $('<div class="head__action drxaos-theme-quick-btn selector" id="drxaos-quick-theme-btn" title="Быстрый выбор темы" data-action="drxaos-quick-theme"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41zM7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3z" fill="currentColor"/></svg></div>');
                    $('.head__actions').prepend(btn);
                    
                    btn.on('hover:enter', function() {
                        // Проверяем, не открыто ли уже модальное окно
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                    btn.on('click', function() {
                        // Проверяем, не открыто ли уже модальное окно
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                    
                    // Отключаем перехват фокуса кнопкой
                    btn.on('focus', function() {
                        // Сразу убираем фокус с кнопки
                        setTimeout(function() {
                            btn.blur();
                        }, 100);
                    });
                    
                    // Предотвращаем получение фокуса
                    btn.attr('tabindex', '-1');
                }
            }
        }, 500);
        
    } catch(e) {
        // lampaLogger.error('Ошибка добавления кнопки быстрого выбора тем', e);
    }
}

function addSettings() {

Lampa.SettingsApi.addComponent({

component: 'drxaos_themes',

name: Lampa.Lang.translate('drxaos_themes'),

icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" fill="currentColor"/></svg>',

order: 0

});


// ============= НАСТРОЙКИ DRXAOS ТЕМ (ОТ САМОГО ПОЛЕЗНОГО К МЕНЕЕ ПОЛЕЗНОМУ) =============

// 🔥 САМЫЕ ЧАСТО ИСПОЛЬЗУЕМЫЕ (основные настройки)

// 1. 🎨 Цветовая схема - ГЛАВНАЯ настройка тем
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'drxaos_theme',
        type: 'select',
        values: {
            'default': 'Стандартная',
            'cyberpunk': '🔮 Киберпанк',
            'matrix': '💚 Матрица',
            'retrowave': '🌈 Ретроволна',
            'iceblue': '❄️ Ледяная',
            'monochrome': '⚪ Монохром',
            'yinyang': '☯️ Инь-Янь',
            'sunset': '🌅 Закат',
            'ocean': '🌊 Океан',
            'forest': '🌲 Лес'
        },
        default: 'default'
    },
    field: {
        name: Lampa.Lang.translate('drxaos_theme'),
        description: Lampa.Lang.translate('drxaos_theme_desc')
    },
    onChange: applyTheme
});

// 2. 📏 Размер интерфейса - новая важная настройка
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'interface_size',
        type: 'select',
        default: 'normal',
        values: {
            'normal': Lampa.Lang.translate('interface_size_normal'),
            'small': Lampa.Lang.translate('interface_size_small'),
            'medium': Lampa.Lang.translate('interface_size_medium'),
            'large': Lampa.Lang.translate('interface_size_large'),
            'xlarge': Lampa.Lang.translate('interface_size_xlarge')
        }
    },
    field: {
        name: Lampa.Lang.translate('interface_size'),
        description: Lampa.Lang.translate('interface_size_desc')
    },
    onChange: function(v) {
        advancedSettings.interfaceSize = v;
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
});

// 3. ✨ Свечение - визуальный эффект
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'drxaos_glow',
        type: 'select',
        values: {
            'off': 'Выключено',
            'low': 'Слабое',
            'medium': 'Среднее',
            'high': 'Сильное'
        },
        default: 'medium'
    },
    field: {
        name: Lampa.Lang.translate('drxaos_glow'),
        description: Lampa.Lang.translate('drxaos_glow_desc')
    },
    onChange: function() {
        applyAdvancedSettings();
        applyGlow();
    }
});

// 4. 🔘 Полные названия кнопок - удобство использования
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'drxaos_fullbuttons',
        type: 'trigger',
        default: false
    },
    field: {
        name: Lampa.Lang.translate('drxaos_fullbuttons'),
        description: Lampa.Lang.translate('drxaos_fullbuttons_desc')
    },
    onChange: applyFullButtons
});

// 🔧 ЧАСТО ИСПОЛЬЗУЕМЫЕ (настройки комфорта)

// 5. 🎬 Анимации - производительность
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'drxaos_animations',
        type: 'trigger',
        default: true
    },
    field: {
        name: Lampa.Lang.translate('drxaos_animations'),
        description: Lampa.Lang.translate('drxaos_animations_desc')
    },
    onChange: applyAnimations
});

// 6. 👁️ Прозрачность - визуальный комфорт
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'drxaos_transparency',
        type: 'select',
        values: {
            '10': '10%',
            '20': '20%',
            '30': '30%',
            '40': '40%',
            '50': '50%',
            '60': '60%',
            '70': '70%',
            '80': '80%',
            '85': '85%',
            '90': '90%',
            '95': '95%',
            '100': '100%'
        },
        default: '85'
    },
    field: {
        name: Lampa.Lang.translate('drxaos_transparency'),
        description: Lampa.Lang.translate('drxaos_transparency_desc')
    },
    onChange: function() {
        applyAdvancedSettings();
    }
});

// 7. 📝 Толщина шрифта - читаемость
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'drxaos_font_weight',
        type: 'select',
        values: {
            '400': 'Обычный',
            '600': 'Полужирный',
            '700': 'Жирный',
            '800': 'Очень жирный',
            '900': 'Жирнейший'
        },
        default: '400'
    },
    field: {
        name: Lampa.Lang.translate('drxaos_font_weight'),
        description: Lampa.Lang.translate('drxaos_font_weight_desc')
    },
    onChange: applyFontWeight
});

// 🎯 РЕДКО ИСПОЛЬЗУЕМЫЕ (тонкая настройка)

// 8. 🖼️ Толщина обводки постеров
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'poster_border_width',
        type: 'select',
        values: {
            '1': '1px',
            '2': '2px',
            '3': '3px',
            '4': '4px',
            '5': '5px',
            '6': '6px',
            '8': '8px',
            '10': '10px'
        },
        default: '2'
    },
    field: {
        name: 'Толщина обводки постеров',
        description: 'Толщина рамки вокруг постеров фильмов'
    },
    onChange: function(v) {
        advancedSettings.posterBorderWidth = parseInt(v) || 2;
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
});

// 9. 🔄 Скругление углов постеров
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'poster_border_radius',
        type: 'select',
        values: {
            '0': '0px (квадратные)',
            '0.5': '0.5em (слегка скругленные)',
            '1': '1em (скругленные)',
            '1.5': '1.5em (сильно скругленные)',
            '2': '2em (очень скругленные)',
            '50': '50% (круглые)'
        },
        default: '1'
    },
    field: {
        name: 'Скругление углов постеров',
        description: 'Степень скругления углов постеров'
    },
    onChange: function(v) {
        advancedSettings.posterBorderRadius = v;
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
});

// 10. 💫 Интенсивность свечения обводок
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'poster_glow_intensity',
        type: 'select',
        values: {
            '0': '0px (без свечения)',
            '5': '5px (слабое)',
            '10': '10px (умеренное)',
            '15': '15px (сильное)',
            '20': '20px (очень сильное)',
            '30': '30px (максимальное)'
        },
        default: '10'
    },
    field: {
        name: 'Интенсивность свечения',
        description: 'Сила свечения обводок постеров'
    },
    onChange: function(v) {
        advancedSettings.posterGlowIntensity = parseInt(v) || 10;
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
});

// 11. ⚡ Скорость анимации обводок
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'poster_animation_speed',
        type: 'select',
        values: {
            '0.1': '0.1s (очень быстро)',
            '0.2': '0.2s (быстро)',
            '0.3': '0.3s (нормально)',
            '0.5': '0.5s (медленно)',
            '0.8': '0.8s (очень медленно)',
            '1': '1s (максимально медленно)'
        },
        default: '0.3'
    },
    field: {
        name: 'Скорость анимации обводок',
        description: 'Скорость появления/исчезновения обводок'
    },
    onChange: function(v) {
        advancedSettings.posterAnimationSpeed = parseFloat(v) || 0.3;
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
});

// 12. 🎨 Прозрачность фона карточек
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'card_background_opacity',
        type: 'select',
        values: {
            '0': '0% (полностью прозрачный)',
            '10': '10% (очень прозрачный)',
            '20': '20% (прозрачный)',
            '30': '30% (слегка прозрачный)',
            '50': '50% (полупрозрачный)',
            '70': '70% (почти непрозрачный)',
            '90': '90% (почти полностью непрозрачный)',
            '100': '100% (полностью непрозрачный)'
        },
        default: '70'
    },
    field: {
        name: 'Прозрачность фона карточек',
        description: 'Прозрачность фонового слоя карточек'
    },
    onChange: function(v) {
        advancedSettings.cardBackgroundOpacity = parseInt(v) || 70;
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
});

// 13. 📈 Масштаб при наведении
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'hover_scale',
        type: 'select',
        values: {
            '1.0': '1.0x',
            '1.02': '1.02x',
            '1.05': '1.05x',
            '1.08': '1.08x',
            '1.1': '1.1x',
            '1.15': '1.15x',
            '1.2': '1.2x',
            '1.25': '1.25x',
            '1.3': '1.3x'
        },
        default: '1.05'
    },
    field: {
        name: 'Масштаб при наведении',
        description: 'Увеличение карточек при наведении'
    },
    onChange: function(v) {
        advancedSettings.hoverScale = parseFloat(v) || 1.05;
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
});

// 14. ⏱️ Скорость анимации
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'animation_speed',
        type: 'select',
        values: {
            '0.1': 'Очень быстро (0.1с)',
            '0.2': 'Быстро (0.2с)',
            '0.3': 'Средне (0.3с)',
            '0.5': 'Медленно (0.5с)',
            '0.8': 'Очень медленно (0.8с)',
            '1.0': 'Максимально медленно (1.0с)'
        },
        default: '0.3'
    },
    field: {
        name: '⚡ Скорость анимации',
        description: 'Настройка скорости анимаций для уменьшения лагов и повышения быстродействия'
    },
    onChange: function(v) {
        advancedSettings.animationSpeed = parseFloat(v) || 0.3;
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
});

// 🛠️ СЛУЖЕБНЫЕ (в конце)

// 15. 🔄 Сброс расширенных настроек
Lampa.SettingsApi.addParam({
    component: 'drxaos_themes',
    param: {
        name: 'reset_advanced',
        type: 'trigger',
        default: false
    },
    field: {
        name: '🔄 Сбросить расширенные настройки',
        description: 'Вернуть все расширенные настройки к значениям по умолчанию'
    },
    onChange: function() {
        advancedSettings = {
            cardBrightness: 100,
            cardSaturation: 100,
            shadowOpacity: 40,
            animationSpeed: 0.3,
            hoverScale: 1.05,
            modalOpacity: 95,
            modalBlur: 50,
            // Новые настройки
            posterBorderWidth: 2,
            posterBorderRadius: '1',
            posterGlowIntensity: 10,
            posterAnimationSpeed: 0.3,
            cardBackgroundOpacity: 70,
            interfaceSize: 'normal',
            modalRadius: 2,
            menuWidth: 20,
            menuOpacity: 95,
            menuBlur: 30,
            contrast: 100,
            brightness: 100,
            saturation: 100,
            hue: 0
        };
        saveAdvancedSettings();
        applyAdvancedSettings();
        Lampa.Noty.show('✅ Расширенные настройки сброшены!');
    }
});
}

function reorderButtons() {
    try {
        if (!window.jQuery || !window.$) return;
var buttonInterval = setInterval(function() {

var $buttonsContainer = $('.full-start__buttons');

if ($buttonsContainer.length > 0) {

var buttons = [];

var $onlineBtn = null;

var $torrentsBtn = null;

var $watchBtn = null;

var $favoriteBtn = null;

$buttonsContainer.find('.full-start__button').each(function() {

var $btn = $(this);

var text = $btn.find('span').text().trim();

if (text === 'Онлайн' || text === 'Online') {

$onlineBtn = $btn.clone();

$onlineBtn.find('svg').html('<path d="M8 5v14l11-7z" fill="currentColor"/>').attr('viewBox', '0 0 24 24');

} 

else if (text === 'Смотреть' || text === 'Watch' || text === 'Дивитися') {

$watchBtn = $btn.clone();

$watchBtn.find('svg').html('<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>').attr('viewBox', '0 0 24 24');

} 

else if (text === 'Торренты' || text === 'Torrents') {

$torrentsBtn = $btn.clone();

$torrentsBtn.find('svg').html('<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z" fill="currentColor"/>').attr('viewBox', '0 0 24 24');

} 

else if (text === 'Избранное' || text === 'Favorite' || text === 'Обране') {

$favoriteBtn = $btn.clone();

}

});

if ($onlineBtn && $watchBtn) {

$buttonsContainer.empty();

$buttonsContainer.append($onlineBtn);

if ($torrentsBtn) {

$buttonsContainer.append($torrentsBtn);

}

$buttonsContainer.append($watchBtn);

if ($favoriteBtn) {

$buttonsContainer.append($favoriteBtn);

}

clearInterval(buttonInterval);

}

}

}, 100);

setTimeout(function() {

clearInterval(buttonInterval);

}, 5000);
    } catch(e) {
        // lampaLogger.error('Ошибка переупорядочивания кнопок', e);
    }
}

function startPlugin() {
    try {
// lampaLogger.log('Запуск плагина DRXAOS Themes', { version: '2025', device: deviceDetection.getDeviceType() });

// Применяем оптимизации рендеринга на основе HTML Canvas спецификации
renderingOptimizer.applyOptimizations();

// Дополнительное исправление устаревших элементов
setTimeout(function() {
    renderingOptimizer.fixDeprecatedSliders();
}, 1000);

// Настройка наблюдателя за динамическими элементами
var dynamicObserver = renderingOptimizer.setupDynamicElementObserver();

addSettings();

var theme = Lampa.Storage.get('drxaos_theme', 'default');
// lampaLogger.log('Загружена сохраненная тема', { theme: theme });

applyTheme(theme);
applyAdvancedSettings();

addQuickThemeButton();
// lampaLogger.log('Плагин успешно запущен');

reorderButtons();

Lampa.Listener.follow('full', function(e) {

if (e.type === 'complite') {

setTimeout(reorderButtons, 300);

}

});
    } catch(e) {
        // lampaLogger.error('Ошибка запуска плагина', e);
    }
}

if (window.appready) {
    try {
        startPlugin();
    } catch(e) {
        // lampaLogger.error('Ошибка запуска плагина (app ready)', e);
    }
} else {
    try {
Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') {
                try {
                    startPlugin();
                } catch(e) {
                    // lampaLogger.error('Ошибка запуска плагина (listener)', e);
                }
            }
        });
    } catch(e) {
        // lampaLogger.error('Ошибка настройки listener', e);
    }
}



    // ============= UI РАСШИРЕННЫХ НАСТРОЕК =============
    // Расширенные настройки теперь регистрируются через SettingsApi выше

    // Автоинициализация при загрузке Lampa
    if (window.Lampa) {
        try {
        $(document).ready(function() {
            setTimeout(function() {
                    try {
                applyAdvancedSettings();
                        var theme = Lampa.Storage.get('drxaos_theme', 'default');
                        applyTheme(theme);
                    } catch(e) {
                        // lampaLogger.error('Ошибка автоматической инициализации', e);
                    }
            }, 1000);
        });
        } catch(e) {
            // lampaLogger.error('Ошибка инициализации (document ready)', e);
        }
    }

    // Создаем обводки постеров при загрузке
    setTimeout(function() {
        createPosterOutlines();
    }, 3000);

    // Глобальный обработчик Esc для выхода из модального окна выбора тем
    $(document).on('keydown.drxaosGlobalEsc', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            // Проверяем, есть ли открытое модальное окно
            var $modal = $('.drxaos-quick-theme-modal');
            if ($modal.length > 0 && $modal.is(':visible')) {
                // Модальное окно открыто - закрываем его
                $modal.fadeOut(200, function() {
                    $modal.remove();
                });
                
                // Убираем фокус и возвращаем на кнопку
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
                
                setTimeout(function() {
                    var $btn = $('#drxaos-quick-theme-btn');
                    if ($btn.length) {
                        $btn.focus();
                    }
                }, 300);
            }
        }
    });

    // ПРИНУДИТЕЛЬНЫЕ СТИЛИ ДЛЯ КНОПКИ ФИЛЬТРА - МАКСИМАЛЬНАЯ СПЕЦИФИЧНОСТЬ
    setTimeout(function() {
        var filterButtonCSS = `
            /* ДИНАМИЧЕСКИЕ СТИЛИ ДЛЯ КНОПКИ ФИЛЬТРА - СООТВЕТСТВУЮТ ТЕМЕ */
            div.simple-button.simple-button--filter.filter--filter.selector {
                background: var(--glass-bg, rgba(0,0,0,0.7)) !important;
                border: 2px solid var(--theme-primary, #5a3494) !important;
                border-radius: 2em !important;
                color: var(--text-main, #ffffff) !important;
                font-family: var(--font-family) !important;
                font-size: 0.9em !important;
                padding: 0.8em 1.5em !important;
                margin: 0.3em !important;
                transition: all 0.3s ease !important;
                backdrop-filter: blur(20px) saturate(180%) !important;
                -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                display: flex !important;
                align-items: center !important;
                gap: 0.5em !important;
                min-height: 2.5em !important;
            }
            
            div.simple-button.simple-button--filter.filter--filter.selector:hover {
                background: var(--theme-primary, #5a3494) !important;
                border: 2px solid var(--theme-accent, #0088bb) !important;
                border-radius: 2.5em !important;
                color: var(--text-contrast, #ffffff) !important;
                box-shadow: 0 0 20px var(--theme-primary, #5a3494), 0 6px 15px rgba(0,0,0,0.4) !important;
                transform: scale(1.02) !important;
            }
            
            div.simple-button.simple-button--filter.filter--filter.selector.focus {
                background: var(--theme-accent, #0088bb) !important;
                border: 2px solid var(--theme-primary, #5a3494) !important;
                border-radius: 2.5em !important;
                color: var(--text-contrast, #ffffff) !important;
                box-shadow: 0 0 30px var(--theme-accent, #0088bb), 0 6px 15px rgba(0,0,0,0.4) !important;
                transform: scale(1.02) !important;
            }
            
            /* ИСПРАВЛЕНИЕ ПРОБЛЕМЫ С РАМКАМИ В МОДАЛЬНЫХ ОКНАХ */
            .modal .simple-button,
            .modal .selector,
            .modal .menu__item,
            .modal .settings-param {
                border: 1px solid var(--theme-primary, #5a3494) !important;
                margin: 0.3em !important;
                padding: 0.8em 1em !important;
                min-height: auto !important;
                display: block !important;
                transition: all 0.3s ease !important;
            }
            
.modal .simple-button:hover,
.modal .selector:hover,
.modal .menu__item:hover,
.modal .settings-param:hover {
    border: 1px solid var(--theme-accent, #0088bb) !important;
    /* Убрано увеличение при наведении */
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}
        `;
        
        var style = document.createElement('style');
        style.id = 'drxaos-filter-button-fix';
        style.textContent = filterButtonCSS;
        document.head.appendChild(style);
        
        // lampaLogger.log('Принудительные стили для кнопки фильтра применены');
        
        // ПРИНУДИТЕЛЬНОЕ ПРИМЕНЕНИЕ СТИЛЕЙ ЧЕРЕЗ JAVASCRIPT
        setTimeout(function() {
            // Точные селекторы на основе HTML структуры
            var filterButtons = document.querySelectorAll('div.simple-button.simple-button--filter.filter--filter.selector');
            
            filterButtons.forEach(function(button) {
                if (button) {
                    // Принудительно применяем динамические стили
                    button.style.setProperty('background', 'var(--glass-bg, rgba(0,0,0,0.7))', 'important');
                    button.style.setProperty('border', '2px solid var(--theme-primary, #5a3494)', 'important');
                    button.style.setProperty('border-radius', '2em', 'important');
                    button.style.setProperty('color', 'var(--text-main, #ffffff)', 'important');
                    button.style.setProperty('font-family', 'var(--font-family)', 'important');
                    button.style.setProperty('font-size', '0.9em', 'important');
                    button.style.setProperty('padding', '0.8em 1.5em', 'important');
                    button.style.setProperty('margin', '0.3em', 'important');
                    button.style.setProperty('transition', 'all 0.3s ease', 'important');
                    button.style.setProperty('backdrop-filter', 'blur(20px) saturate(180%)', 'important');
                    button.style.setProperty('-webkit-backdrop-filter', 'blur(20px) saturate(180%)', 'important');
                    button.style.setProperty('box-shadow', '0 4px 12px rgba(0,0,0,0.3)', 'important');
                    button.style.setProperty('display', 'flex', 'important');
                    button.style.setProperty('align-items', 'center', 'important');
                    button.style.setProperty('gap', '0.5em', 'important');
                    button.style.setProperty('min-height', '2.5em', 'important');
                    
                    // lampaLogger.log('Динамические стили применены к кнопке фильтра');
                }
            });
        }, 1500);
    }, 1000);

})();