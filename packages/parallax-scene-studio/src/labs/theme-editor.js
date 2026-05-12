(function () {
    if (!document.getElementById('theme-editor')) return;

    var filterEditMode = 'both';

    function getActiveFilterMode() {
        return document.documentElement.getAttribute('data-coreui-theme') === 'light' ? 'light' : 'dark';
    }

    function hexToRgbArr(h) { return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]; }
    function rgbToHsl(r,g,b) {
        r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),h,s,l=(mx+mn)/2;
        if(mx===mn){h=s=0}else{var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);
        switch(mx){case r:h=((g-b)/d+(g<b?6:0))*60;break;case g:h=((b-r)/d+2)*60;break;case b:h=((r-g)/d+4)*60;break;}}
        return[Math.round(h),Math.round(s*100),Math.round(l*100)];
    }
    function hslToHex(h,s,l) {
        s/=100;l/=100;var a=s*Math.min(l,1-l);
        var f=function(n){var k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(Math.min(k-3,9-k,1),-1))).toString(16).padStart(2,'0');};
        return'#'+f(0)+f(8)+f(4);
    }
    function applyAccentLive(hex) {
        var rgb = hexToRgbArr(hex);
        var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        var ah = hsl[0];
        var hueDist = function(a,b){return Math.min(Math.abs(a-b),360-Math.abs(a-b));};
        var defs = [
            {key:'success',h:145,s:78,ld:52,ll:40},
            {key:'danger', h:348,s:85,ld:58,ll:46},
            {key:'warning',h:42, s:88,ld:54,ll:46},
            {key:'info',   h:195,s:85,ld:53,ll:45}
        ];
        var hues = [];
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i], h = d.h;
            if (hueDist(h, ah) < 35) {
                var plus = (h + 70) % 360, minus = (h - 70 + 360) % 360;
                var dp = hueDist(plus, ah), dm = hueDist(minus, ah);
                h = (dp > dm + 15) ? plus : (dm > dp + 15) ? minus : plus;
            }
            hues.push(h);
        }
        for (var i = 0; i < hues.length; i++) {
            for (var j = i + 1; j < hues.length; j++) {
                if (hues[i] !== defs[i].h && hues[j] !== defs[j].h && hueDist(hues[i], hues[j]) < 25) {
                    var orig = defs[i].h;
                    var alt = (hues[i] === (orig + 70) % 360) ? (orig - 70 + 360) % 360 : (orig + 70) % 360;
                    if (hueDist(alt, ah) > 20) hues[i] = alt;
                }
            }
        }
        function hueTintedDark(cr) {
            var ch = rgbToHsl(cr[0], cr[1], cr[2]);
            return hslToHex(ch[0], Math.min(ch[1] + 10, 100), 18);
        }
        function contrastText(colHex, preferWhite) {
            var cr = hexToRgbArr(colHex);
            var L = relativeLuminance(cr[0], cr[1], cr[2]);
            if (preferWhite) return L > 0.55 ? hueTintedDark(cr) : '#ffffff';
            return L < 0.25 ? '#ffffff' : hueTintedDark(cr);
        }
        function elRule(sel, key, tc) {
            return sel + ' .btn-' + key + ',' + sel + ' .btn-' + key + '-gradient,' + sel + ' .badge.bg-' + key + '{color:' + tc + ' !important}';
        }
        var pText = contrastText(hex, true);
        var css = 'html[data-coreui-theme="dark"]{--cui-primary:' + hex + ' !important;--cui-primary-rgb:' + rgb.join(',') + ' !important;';
        var elCss = elRule('html[data-coreui-theme="dark"]', 'primary', pText);
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i], dHex = hslToHex(hues[i], d.s, d.ld), dr = hexToRgbArr(dHex);
            css += '--cui-' + d.key + ':' + dHex + ' !important;--cui-' + d.key + '-rgb:' + dr.join(',') + ' !important;';
            elCss += elRule('html[data-coreui-theme="dark"]', d.key, contrastText(dHex, false));
        }
        css += '}html[data-coreui-theme="light"]{--cui-primary:' + hex + ' !important;--cui-primary-rgb:' + rgb.join(',') + ' !important;';
        elCss += elRule('html[data-coreui-theme="light"]', 'primary', pText);
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i], lHex = hslToHex(hues[i], d.s, d.ll), lr = hexToRgbArr(lHex);
            css += '--cui-' + d.key + ':' + lHex + ' !important;--cui-' + d.key + '-rgb:' + lr.join(',') + ' !important;';
            elCss += elRule('html[data-coreui-theme="light"]', d.key, contrastText(lHex, false));
        }
        css += '}' + elCss;
        var el = document.getElementById('te-accent-live');
        if (!el) { el = document.createElement('style'); el.id = 'te-accent-live'; }
        el.textContent = css;
        document.head.appendChild(el);
    }

    function applyBlurLive() {
        var el = document.getElementById('te-blur-live');
        if (!el) { el = document.createElement('style'); el.id = 'te-blur-live'; }
        el.textContent = 'html[data-coreui-theme="dark"]{--blur:' + (editorState.blur.dark || 'rgba(28,35,48,0.95)') + '}' +
                         'html[data-coreui-theme="light"]{--blur:' + (editorState.blur.light || 'rgba(240,240,240,0.95)') + '}';
        document.head.appendChild(el);
    }

    function sRGBtoLinear(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    function relativeLuminance(r, g, b) { return 0.2126 * sRGBtoLinear(r) + 0.7152 * sRGBtoLinear(g) + 0.0722 * sRGBtoLinear(b); }
    function contrastRatio(hex1, hex2) {
        var a = hexToRgbArr(hex1), b = hexToRgbArr(hex2);
        var L1 = relativeLuminance(a[0], a[1], a[2]), L2 = relativeLuminance(b[0], b[1], b[2]);
        var lighter = Math.max(L1, L2), darker = Math.min(L1, L2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    function compositeHex(bgHex, fgR, fgG, fgB, alpha) {
        var bg = hexToRgbArr(bgHex);
        var r = Math.round(fgR * alpha + bg[0] * (1 - alpha));
        var g = Math.round(fgG * alpha + bg[1] * (1 - alpha));
        var b = Math.round(fgB * alpha + bg[2] * (1 - alpha));
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    function vivifyAccent(hex) {
        var rgb = hexToRgbArr(hex), hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        var h = hsl[0], bestL = 50, lo = 5, hi = 95;
        while (lo <= hi) {
            var mid = Math.round((lo + hi) / 2);
            if (contrastRatio(hslToHex(h, 100, mid), '#ffffff') >= 3) {
                bestL = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return hslToHex(h, 100, bestL);
    }
    function enhanceAccent(accent, bgHex, fgR, fgG, fgB, alpha, dir, target) {
        target = target || 7;
        var card = compositeHex(bgHex, fgR, fgG, fgB, alpha);
        if (contrastRatio(accent, card) >= target) return accent;
        var rgb = hexToRgbArr(accent), hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        var h = hsl[0], s = hsl[1], l = hsl[2];
        while (l > 5 && l < 95 && contrastRatio(hslToHex(h, Math.min(s, 100), l), card) < target) {
            l += dir;
        }
        return hslToHex(h, Math.min(s, 100), Math.max(5, Math.min(95, l)));
    }

    var defaultFilter = { saturate: 130, brightness: 65, contrast: 100 };

    function loadFilterSliders() {
        var mode = filterEditMode === 'both' ? getActiveFilterMode() : filterEditMode;
        var f = editorState.scene['filter_' + mode] || {};
        var sat = f.saturate != null ? f.saturate : defaultFilter.saturate;
        var bri = f.brightness != null ? f.brightness : defaultFilter.brightness;
        var con = f.contrast != null ? f.contrast : defaultFilter.contrast;
        $('#te-filter-sat').val(sat); $('#te-filter-sat-num').val(sat);
        $('#te-filter-bri').val(bri); $('#te-filter-bri-num').val(bri);
        $('#te-filter-con').val(con); $('#te-filter-con-num').val(con);
        $('[data-fmode]').removeClass('active');
        $('#te-filter-mode-' + filterEditMode).addClass('active');
    }

    function applyActiveSceneFilter() {
        var fd = editorState.scene.filter_dark || {};
        var fl = editorState.scene.filter_light || {};
        var dSat = fd.saturate != null ? fd.saturate : defaultFilter.saturate;
        var dBri = fd.brightness != null ? fd.brightness : defaultFilter.brightness;
        var dCon = fd.contrast != null ? fd.contrast : defaultFilter.contrast;
        var lSat = fl.saturate != null ? fl.saturate : defaultFilter.saturate;
        var lBri = fl.brightness != null ? fl.brightness : defaultFilter.brightness;
        var lCon = fl.contrast != null ? fl.contrast : defaultFilter.contrast;
        var el = document.getElementById('te-scene-filter');
        if (el) el.remove();
        el = document.createElement('style');
        el.id = 'te-scene-filter';
        document.head.appendChild(el);
        el.textContent = 'html[data-coreui-theme="dark"] #scene{filter:saturate(' + dSat + '%) brightness(' + dBri + '%) contrast(' + dCon + '%) !important}' +
            'html[data-coreui-theme="light"] #scene{filter:saturate(' + lSat + '%) brightness(' + lBri + '%) contrast(' + lCon + '%) !important}';
    }

    function applyTransform(el, rotation, flipX, flipY, zoom) {
        el.style.rotate = rotation ? rotation + 'deg' : '';
        var z = (zoom && zoom !== 1) ? zoom : 1;
        var sx = (flipX ? -1 : 1) * z, sy = (flipY ? -1 : 1) * z;
        el.style.scale = (sx !== 1 || sy !== 1) ? sx + ' ' + sy : '';
    }

    var $editor = $('#theme-editor');
    var mode = $editor.data('mode') || 'new';
    var config = window.__themeEditorConfig || null;
    var editorState = {
        type: 'parallax',
        mode: 'scene',
        name: '',
        accent: '#FF6B1A',
        scene: {
            background_color: '#1c2330',
            relative_input: true,
            scalar_x: 2, scalar_y: 2,
            friction_x: 0.1, friction_y: 0.1,
            invert_x: true, invert_y: true
        },
        blur: { dark: 'rgba(28,35,48,0.95)', light: 'rgba(240,240,240,0.95)' },
        layer_offset: { left: 0, top: 0 },
        design_ratio: 1.778,
        layers: [],
        theme_id: null,
        forked_from: null,
        dirty: false
    };
    var selectedLayerIdx = null;
    var selectedElementIdx = null;
    var selectedChildIdx = null;
    var parallaxInstance = null;
    var idleTimer = null;
    var zenMode = false;
    var expandedLayers = {};
    var interactInstances = [];
    var parallaxPaused = false;
    var linkedWH = true;
    var aspectRatio = null;
    var undoStack = [];
    var redoStack = [];
    var MAX_UNDO = 30;

    function extractCssProps(el) {
        if (!el.css) return;
        var props = {
            'background-size': 'bgSize',
            'background-position': 'bgPosition',
            'background-repeat': 'bgRepeat',
            'opacity': 'opacity'
        };
        el.css.split(';').forEach(function (part) {
            var p = part.trim();
            if (!p) return;
            var m = p.match(/^([\w-]+)\s*:\s*(.+)$/);
            if (m) {
                var key = props[m[1]];
                if (key && !el[key]) {
                    el[key] = key === 'opacity' ? parseFloat(m[2]) : m[2].trim();
                }
            }
        });
        if (el.children) {
            el.children.forEach(function (c) { extractCssProps(c); });
        }
    }

    // ── Init ──
    function init() {
        // Remove server-rendered style tags so editor's live tags win the cascade
        document.querySelectorAll('style:not([id])').forEach(function(s) {
            var t = s.textContent;
            if (t.indexOf('#scene{filter:') !== -1 || t.indexOf('.btn-primary') !== -1 || t.indexOf('--blur:') !== -1) s.remove();
        });
        var utc = document.getElementById('user-theme-css');
        if (utc) utc.remove();

        if (config) {
            Object.assign(editorState, {
                type: config.type || 'parallax',
                mode: config.mode || 'scene',
                name: config.name || '',
                accent: config.accent || '#FF6B1A',
                scene: Object.assign({}, editorState.scene, config.scene || {}),
                blur: Object.assign({}, editorState.blur, config.blur || {}),
                layer_offset: Object.assign({}, editorState.layer_offset, config.layer_offset || {}),
                design_ratio: config.design_ratio || 1.778,
                layers: (config.layers || []).map(function (l) {
                    var layer = Object.assign({ depth: 0.5, elements: [] }, l);
                    if (layer.image && (!layer.elements || !layer.elements.length)) {
                        layer.elements = [{
                            image: layer.image,
                            x: '-5%', y: '-5%',
                            width: '110%', height: '110%',
                            css: 'background-size:cover;background-position:center;border:none',
                            animation: '', animation_duration: ''
                        }];
                        delete layer.image;
                    }
                    layer.elements.forEach(function (el) { extractCssProps(el); });
                    var fe = layer.elements[0];
                    if (fe && isFullScreenElement(fe)
                        && parseFloat(fe.x) === -5 && parseFloat(fe.y) === -5
                        && parseFloat(fe.width) === 110 && parseFloat(fe.height) === 110) {
                        fe.x = '0%'; fe.y = '0%';
                        fe.width = '100%'; fe.height = '100%';
                    }
                    return layer;
                }),
                theme_id: config.theme_id || null,
                forked_from: config.forked_from || null
            });
            // Auto-expand layers that have elements
            editorState.layers.forEach(function (l, i) {
                if (l.elements && l.elements.length) expandedLayers[i] = true;
            });
        }

        var teNode = document.getElementById('theme-editor');
        var isViewOnly = teNode && teNode.dataset.mode === 'view';

        populateControls();
        renderLayerTree();
        renderScene();
        showPropsFor(null);
        if (!isViewOnly) {
            bindEvents();
            bindKeyboard();
            bindDragDrop();
            bindBeforeUnload();
            resetIdleTimer();
        } else {
            $('#te-parallax-toggle').on('click', function () {
                if (parallaxPaused) resumeParallax(); else pauseParallax();
            });
            $('#te-zen-btn').on('click', function () { toggleZen(true); });
            $('#te-zen-exit').on('click', function () { toggleZen(false); });
            $('#te-exit-btn').on('click', function () { window.history.back(); });
            // Read-only tree navigation (toggle on re-click)
            $(document).on('click', '.te-layer-row', function (e) {
                if ($(e.target).hasClass('te-expand-toggle')) return;
                var idx = parseInt($(this).data('idx'));
                if (selectedLayerIdx === idx && selectedElementIdx === null) {
                    selectedLayerIdx = null; highlightDepth(null); renderLayerTree(); showPropsFor(null);
                } else { selectLayer(idx); }
            });
            $(document).on('click', '.te-child-row[data-el-idx]:not(.te-grandchild-row)', function () {
                var li = parseInt($(this).data('layer-idx'));
                var ei = parseInt($(this).data('el-idx'));
                if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === null) {
                    selectedElementIdx = null; highlightDepth(null); renderLayerTree();
                    showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
                } else { selectElement(li, ei); }
            });
            $(document).on('click', '.te-grandchild-row[data-child-idx]', function () {
                var li = parseInt($(this).data('layer-idx'));
                var ei = parseInt($(this).data('el-idx'));
                var ci = parseInt($(this).data('child-idx'));
                if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === ci) {
                    selectedChildIdx = null; renderLayerTree();
                    showPropsFor('element');
                } else { selectChild(li, ei, ci); }
            });
            $(document).on('click', '.te-expand-toggle', function (e) {
                e.stopPropagation();
                expandedLayers[parseInt($(this).data('idx'))] = !expandedLayers[parseInt($(this).data('idx'))];
                renderLayerTree();
            });
            $('#te-deselect-layer, #te-deselect-element').on('click', function () {
                selectedElementIdx = null; selectedChildIdx = null;
                highlightDepth(null); renderLayerTree();
                showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
            });
            $(document).on('click', '[data-nav="scene"]', function () {
                selectedLayerIdx = null; selectedElementIdx = null; selectedChildIdx = null;
                highlightDepth(null); renderLayerTree(); showPropsFor(null);
            });
        }
        bindPanelDrag();
        observePanelResize();
        renderShortcutHints();
        restorePanelPositions();
        lastSnapshot = captureSnapshot();
        $('[data-coreui-toggle="tooltip"]').each(function () {
            if (coreui && coreui.Tooltip) new coreui.Tooltip(this, { container: 'body', trigger: 'hover' });
        });
    }

    // ── Populate controls from state ──
    function populateControls() {
        $('#te-title-input').val(editorState.name);
        $('#te-accent-color').val(editorState.accent);
        $('#te-accent-swatch').css('background', editorState.accent);
        if (editorState.accent) applyAccentLive(editorState.accent);
        $('#te-bg-color').val(editorState.scene.background_color);
        $('#te-bg-swatch').css('background', editorState.scene.background_color);
        $('#te-bg-hex').val(editorState.scene.background_color);
        $('#te-blur-dark').val(rgbaToHex(editorState.blur.dark));
        $('#te-blur-light').val(rgbaToHex(editorState.blur.light));
        applyBlurLive();
        $('#te-scalar-x').val(editorState.scene.scalar_x);
        $('#te-scalar-x-num').val(editorState.scene.scalar_x);
        $('#te-scalar-y').val(editorState.scene.scalar_y);
        $('#te-scalar-y-num').val(editorState.scene.scalar_y);
        var fricRaw = Math.round((editorState.scene.friction_x || 0.1) * 100);
        $('#te-friction').val(fricRaw);
        $('#te-friction-num').val(fricRaw);
        $('#te-invert-x').toggleClass('active', editorState.scene.invert_x !== false).attr('data-toggled', editorState.scene.invert_x !== false);
        $('#te-invert-y').toggleClass('active', editorState.scene.invert_y !== false).attr('data-toggled', editorState.scene.invert_y !== false);
        $('#te-offset-left').val(editorState.layer_offset.left);
        $('#te-offset-top').val(editorState.layer_offset.top);

        if (!editorState.scene.filter_dark) {
            editorState.scene.filter_dark = { saturate: defaultFilter.saturate, brightness: defaultFilter.brightness, contrast: defaultFilter.contrast };
        }
        if (!editorState.scene.filter_light) {
            editorState.scene.filter_light = { saturate: defaultFilter.saturate, brightness: defaultFilter.brightness, contrast: defaultFilter.contrast };
        }
        loadFilterSliders();
        applyActiveSceneFilter();

        setToggleActive('#te-type-toggle', editorState.type);

        updateLayerEmptyState();
    }

    function setToggleActive(sel, val) {
        $(sel + ' button').removeClass('active');
        $(sel + ' button[data-val="' + val + '"]').addClass('active');
    }

    function isFullScreenElement(el) {
        var isFullSize = parseFloat(el.width) >= 100 && (el.width || '').indexOf('%') !== -1
            && parseFloat(el.height) >= 100 && (el.height || '').indexOf('%') !== -1;
        if (!isFullSize) return false;
        var css = el.css || '';
        if (css.indexOf('bottom') !== -1) return false;
        if (/background-position\s*:\s*(?!center|50%)/.test(css)) return false;
        return true;
    }

    function buildElementDiv(el, layerIdx, elIdx) {
        var div = document.createElement('div');
        div.className = 'te-element' + (el['class'] ? ' ' + el['class'] : '');
        if (el.animation) div.classList.add('te-anim-' + el.animation);
        div.dataset.layerIdx = layerIdx;
        div.dataset.elIdx = elIdx;
        div.style.position = 'absolute';
        if (el.x && el.x !== 'auto') div.style.left = el.x;
        if (el.y && el.y !== 'auto') div.style.top = el.y;
        div.style.width = el.width || '100px';
        div.style.height = el.height || '100px';
        if (el.animation_duration) div.style.animationDuration = el.animation_duration;
        if (el.image) div.style.backgroundImage = 'url(' + el.image + ')';
        div.style.backgroundSize = el.bgSize || 'contain';
        div.style.backgroundRepeat = el.bgRepeat || 'no-repeat';
        if (el.bgPosition) div.style.backgroundPosition = el.bgPosition;
        if (el.opacity != null && el.opacity < 1) div.style.opacity = el.opacity;
        if (el.css) {
            div.style.cssText += ';' + el.css;
        }
        applyTransform(div, el.rotation, el.flipX, el.flipY, el.scale);
        return div;
    }

    // ── Apply cached viewport-sized textures to scene-mode layers ──
    function applyOptimizedTextures() {
        if (editorState.type !== 'parallax' && editorState.type !== 'static') return;
        var scene = document.getElementById('scene');
        if (!scene || !window.indexedDB) return;
        var layers = scene.querySelectorAll('[data-depth]');
        if (layers.length < 2) return;

        var targetW = Math.ceil(window.innerWidth * 1.15);
        var targetH = Math.ceil(window.innerHeight * 1.15);
        var vpBucket = Math.ceil(targetW / 200) * 200 + 'x' + Math.ceil(targetH / 200) * 200;
        var cacheKey = 'editor|' + (editorState.forked_from || editorState.theme_id || 'new') + '|' + vpBucket;

        var req = indexedDB.open('parallax_cache', 3);
        req.onupgradeneeded = function () {
            var db = req.result;
            if (!db.objectStoreNames.contains('textures')) db.createObjectStore('textures');
        };
        req.onsuccess = function () {
            var db = req.result;
            if (!db.objectStoreNames.contains('textures')) return;
            var tx = db.transaction('textures', 'readonly');
            var get = tx.objectStore('textures').get(cacheKey);
            get.onsuccess = function () {
                var data = get.result;
                if (data && data.layers) {
                    data.layers.forEach(function (cached) {
                        var el = layers[cached.idx];
                        if (el) {
                            el.style.backgroundImage = 'url(' + URL.createObjectURL(cached.blob) + ')';
                            el.style.backgroundSize = 'cover';
                        }
                    });
                    return;
                }
                // Not cached — build optimized textures
                var imgLayers = Array.from(layers);
                var cachedEntries = [];
                var done = 0;
                imgLayers.forEach(function (layer, i) {
                    var bg = getComputedStyle(layer).backgroundImage;
                    var m = bg.match(/url\(["']?([^"']*)["']?\)/);
                    if (!m || !m[1]) { if (++done === imgLayers.length) saveEditorCache(); return; }
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = function () {
                        var c = document.createElement('canvas');
                        c.width = targetW; c.height = targetH;
                        c.getContext('2d').drawImage(img, 0, 0, targetW, targetH);
                        c.toBlob(function (blob) {
                            if (blob) {
                                layer.style.backgroundImage = 'url(' + URL.createObjectURL(blob) + ')';
                                layer.style.backgroundSize = 'cover';
                                cachedEntries.push({ idx: i, blob: blob });
                            }
                            if (++done === imgLayers.length) saveEditorCache();
                        }, 'image/webp', 0.85);
                    };
                    img.onerror = function () { if (++done === imgLayers.length) saveEditorCache(); };
                    img.src = m[1];
                });

                function saveEditorCache() {
                    if (!cachedEntries.length) return;
                    try {
                        var wtx = db.transaction('textures', 'readwrite');
                        wtx.objectStore('textures').put({
                            origCount: imgLayers.length,
                            layers: cachedEntries
                        }, cacheKey);
                    } catch (e) {}
                }
            };
        };
    }

    // ── Render parallax scene ──
    function renderScene() {
        var scene = document.getElementById('scene');
        if (!scene) return;

        if (parallaxInstance) {
            parallaxInstance.destroy();
            parallaxInstance = null;
        }
        destroyInteract();

        scene.innerHTML = '';
        scene.style.backgroundColor = editorState.scene.background_color;

        var bgCover = document.querySelector('.bg-cover');
        if (bgCover && editorState.design_ratio) {
            bgCover.style.setProperty('--design-ratio', editorState.design_ratio);
        }

        // Inject offset as CSS !important so Parallax.js can't overwrite it
        var existingStyle = document.getElementById('te-offset-style');
        if (existingStyle) existingStyle.remove();
        var ssrOffset = document.getElementById('te-layer-offset-ssr');
        if (ssrOffset) ssrOffset.remove();
        var oL = editorState.layer_offset.left || 0;
        var oT = editorState.layer_offset.top || 0;
        if (oL || oT) {
            var style = document.createElement('style');
            style.id = 'te-offset-style';
            style.textContent = '#scene .te-element-layer{left:' + oL + 'px!important;top:' + oT + 'px!important}';
            document.head.appendChild(style);
        }

        var hasSprites = editorState.layers.some(function (l) {
            return (l.elements || []).some(function (el) {
                return el.animation || el.children && el.children.length || el.tag;
            });
        });

        if (editorState.type === 'parallax' || editorState.type === 'static') {
            editorState.layers.forEach(function (layer, i) {
                var layerDiv = document.createElement('div');
                layerDiv.setAttribute('data-depth', layer.depth);
                layerDiv.className = 'te-element-layer';
                layerDiv.style.position = 'absolute';
                layerDiv.style.width = '100%';
                layerDiv.style.height = '100%';

                (layer.elements || []).forEach(function (el, ei) {
                    var sprite = buildElementDiv(el, i, ei);
                    if (el.hidden) sprite.style.display = 'none';
                    if (el.children && el.children.length) {
                        sprite.style.position = 'relative';
                        if (el.tag === 'img' && el.image) {
                            var img = document.createElement('img');
                            img.src = el.image;
                            img.style.cssText = 'width:100%;display:block;pointer-events:none';
                            sprite.style.backgroundImage = 'none';
                            sprite.appendChild(img);
                        }
                        el.children.forEach(function (child, ci) {
                            var childDiv = buildElementDiv(child, i, ei + '.' + ci);
                            if (child.hidden || el.hidden) childDiv.style.display = 'none';
                            sprite.appendChild(childDiv);
                        });
                    }
                    if (selectedLayerIdx === i && selectedElementIdx === ei) {
                        sprite.classList.add('selected');
                        addHandles(sprite);
                    }
                    layerDiv.appendChild(sprite);
                });
                scene.appendChild(layerDiv);
            });
        }

        scene.setAttribute('data-relative-input', editorState.scene.relative_input ? 'true' : 'false');
        scene.classList.add('te-no-filter');
        applyActiveSceneFilter();

        if (editorState.type === 'parallax' && scene.children.length > 0) {
            try {
                parallaxInstance = new Parallax(scene, {
                    scalarX: editorState.scene.scalar_x || 10,
                    scalarY: editorState.scene.scalar_y || 10,
                    relativeInput: editorState.scene.relative_input !== false,
                    pointerEvents: true
                });
                parallaxInstance.friction(
                    editorState.scene.friction_x || 0.1,
                    editorState.scene.friction_y || 0.1
                );
                if (editorState.scene.invert_x === false || editorState.scene.invert_y === false) {
                    parallaxInstance.invert(
                        editorState.scene.invert_x !== false,
                        editorState.scene.invert_y !== false
                    );
                }
                if (hasSprites) {
                    parallaxInstance.disable();
                    parallaxPaused = true;
                    updateParallaxButton();
                }
            } catch (e) {
                console.warn('Parallax init failed:', e);
            }
        }

        updateMiniPreview();
        var teNode = document.getElementById('theme-editor');
        if (!teNode || teNode.dataset.mode !== 'view') {
            bindSpriteInteractions();
        } else {
            applyOptimizedTextures();
        }
    }

    var sceneRebuildTimer = null;
    function debouncedRenderScene() {
        clearTimeout(sceneRebuildTimer);
        sceneRebuildTimer = setTimeout(renderScene, 200);
    }

    // ── Update element DOM in-place without rebuilding scene ──
    function updateElementInPlace(target) {
        if (!target || selectedLayerIdx === null || selectedElementIdx === null) return;
        var elIdxStr = selectedChildIdx !== null
            ? selectedElementIdx + '.' + selectedChildIdx
            : String(selectedElementIdx);
        var $el = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx + '"][data-el-idx="' + elIdxStr + '"]');
        if (!$el.length) { debouncedRenderScene(); return; }

        var el = $el[0];
        if (target.x && target.x !== 'auto') { el.style.left = target.x; el.style.right = 'auto'; }
        if (target.y && target.y !== 'auto') { el.style.top = target.y; el.style.bottom = 'auto'; }
        if (target.width) el.style.width = target.width;
        if (target.height) el.style.height = target.height;
        if (target.animation_duration) el.style.animationDuration = target.animation_duration;

        // Update animation class
        el.className = el.className.replace(/\bte-anim-\S+/g, '');
        if (target.animation) el.classList.add('te-anim-' + target.animation);

        applyTransform(el, target.rotation, target.flipX, target.flipY, target.scale);
        el.style.opacity = (target.opacity != null && target.opacity < 1) ? target.opacity : '';
        el.style.backgroundSize = target.bgSize || 'contain';
        el.style.backgroundPosition = target.bgPosition || '';
        el.style.backgroundRepeat = target.bgRepeat || 'no-repeat';

        updateCoordsReadout($el);
    }

    // ── Update parallax params without rebuild ──
    function updateParallaxParams() {
        if (!parallaxInstance) return;
        try {
            parallaxInstance.scalar(editorState.scene.scalar_x, editorState.scene.scalar_y);
            parallaxInstance.friction(editorState.scene.friction_x, editorState.scene.friction_y);
            parallaxInstance.invert(
                editorState.scene.invert_x !== false,
                editorState.scene.invert_y !== false
            );
        } catch (e) {}
    }

    // ── Mini preview ──
    function updateMiniPreview() {
        var mp = document.getElementById('te-mini-preview');
        if (!mp) return;
        mp.style.background = editorState.scene.background_color;
    }

    function disposeDynamicTooltips() {
        if (!coreui || !coreui.Tooltip) return;
        $('#te-layer-tree [data-coreui-toggle="tooltip"]').each(function () {
            var existing = coreui.Tooltip.getInstance(this);
            if (existing) existing.dispose();
        });
        document.querySelectorAll('body > .tooltip').forEach(function (t) { t.remove(); });
    }

    function refreshDynamicTooltips() {
        if (!coreui || !coreui.Tooltip) return;
        $('#te-layer-tree [data-coreui-toggle="tooltip"]').each(function () {
            new coreui.Tooltip(this, { container: 'body', trigger: 'hover' });
        });
    }

    // ── Layer tree ──
    function renderLayerTree(scrollToSelected) {
        var $tree = $('#te-layer-tree');
        disposeDynamicTooltips();
        $tree.empty();

        editorState.layers.forEach(function (layer, i) {
            var isSelected = selectedLayerIdx === i && selectedElementIdx === null && selectedChildIdx === null;
            var hasElements = layer.elements && layer.elements.length > 0;
            var isExpanded = !!expandedLayers[i];
            var firstElImg = '';
            if (hasElements && layer.elements[0].image) {
                var isBg = isFullScreenElement(layer.elements[0]);
                firstElImg = 'url(' + layer.elements[0].image + ') center/' + (isBg ? 'cover' : 'contain') + ' no-repeat';
            }
            var thumbBg = firstElImg || 'linear-gradient(135deg,#3a4459,#1c2330)';
            var elCount = 0;
            (layer.elements || []).forEach(function(e) { elCount += 1 + (e.children ? e.children.length : 0); });

            var arrowChar = isExpanded ? '▾' : '▸';
            var hiddenClass = layer.hidden ? ' te-layer-hidden' : '';
            var lockedClass = layer.locked ? ' te-layer-locked' : '';
            var eyeIcon = layer.hidden ? '◻' : '◼';
            var lockIcon = layer.locked ? '🔒' : '🔓';
            var $row = $('<div class="te-layer-row' + (isSelected ? ' selected' : '') + hiddenClass + lockedClass + '" data-idx="' + i + '">' +
                '<span class="te-grip te-expand-toggle" data-idx="' + i + '" title="Expand/collapse" data-coreui-toggle="tooltip">' + arrowChar + '</span>' +
                '<span class="te-layer-idx">' + (i + 1) + '</span>' +
                '<span class="te-layer-thumb" style="background:' + thumbBg + '"></span>' +
                '<span class="te-layer-name">' + (layer.name || ('Layer ' + (i + 1))) + ' · <abbr title="Parallax motion depth">' + layer.depth + '</abbr></span>' +
                (elCount ? '<span class="te-layer-count">' + elCount + '</span>' : '') +
                '<span class="te-layer-eye' + (layer.hidden ? ' active' : '') + '" data-idx="' + i + '" title="Toggle visibility" data-coreui-toggle="tooltip">' + eyeIcon + '</span>' +
                '<span class="te-layer-lock' + (layer.locked ? ' active' : '') + '" data-idx="' + i + '" title="Toggle lock" data-coreui-toggle="tooltip">' + lockIcon + '</span>' +
                '</div>');
            $tree.append($row);

            if (isExpanded) {
                var $rail = $('<div class="te-child-rail" data-layer-idx="' + i + '"></div>');
                if (hasElements) {
                    layer.elements.forEach(function (el, ei) {
                        var isElSel = selectedLayerIdx === i && selectedElementIdx === ei && selectedChildIdx === null;
                        var isBgEl = isFullScreenElement(el);
                        var elName = isBgEl ? 'BG' : (el.image ? el.image.split('/').pop().split('_').pop() : 'element');
                        var thumbStyle = el.image ? 'background:url(' + el.image + ') center/contain no-repeat' : '';
                        var hasChildren = el.children && el.children.length > 0;
                        var isContainer = hasChildren || el.tag === 'img';
                        var containerBadge = isContainer ? '<span class="te-container-badge">⊞</span>' : '';
                        var childCountLabel = hasChildren ? ' <span class="te-layer-count">' + el.children.length + '</span>' : '';
                        var animLabel = el.animation || 'none';
                        var elHiddenClass = el.hidden ? ' te-layer-hidden' : '';
                        var elEyeIcon = el.hidden ? '◻' : '◼';
                        var $child = $('<div class="te-child-row' + (isElSel ? ' selected' : '') + (isContainer ? ' te-is-container' : '') + elHiddenClass + '" data-layer-idx="' + i + '" data-el-idx="' + ei + '">' +
                            '<span class="te-el-thumb" style="' + thumbStyle + '"></span>' +
                            containerBadge +
                            '<span class="te-el-name">' + truncate(elName, 12) + '</span>' +
                            '<span class="te-hint" style="flex:1">' + animLabel + childCountLabel + '</span>' +
                            '<span class="te-el-eye' + (el.hidden ? ' active' : '') + '" data-layer-idx="' + i + '" data-el-idx="' + ei + '" title="Toggle visibility" data-coreui-toggle="tooltip">' + elEyeIcon + '</span>' +
                            '</div>');
                        $rail.append($child);

                        // Render grandchildren + add-child row
                        var showGrandRail = hasChildren || isElSel;
                        if (showGrandRail) {
                            var $grandRail = $('<div class="te-grandchild-rail" data-layer-idx="' + i + '" data-el-idx="' + ei + '"></div>');
                            if (hasChildren) {
                                var $railHint = $('<div class="te-grandchild-hint">positioned relative to ' + truncate(elName, 10) + '</div>');
                                $grandRail.append($railHint);
                                el.children.forEach(function (child, ci) {
                                    var isChildSel = selectedLayerIdx === i && selectedElementIdx === ei && selectedChildIdx === ci;
                                    var childName = child.image ? child.image.split('/').pop().split('_').pop() : 'child';
                                    var childThumb = child.image ? 'background:url(' + child.image + ') center/contain no-repeat' : '';
                                    var childAnim = child.animation || 'none';
                                    var gcHiddenClass = child.hidden ? ' te-layer-hidden' : '';
                                    var gcEyeIcon = child.hidden ? '◻' : '◼';
                                    var $gc = $('<div class="te-child-row te-grandchild-row' + (isChildSel ? ' selected' : '') + gcHiddenClass + '" data-layer-idx="' + i + '" data-el-idx="' + ei + '" data-child-idx="' + ci + '">' +
                                        '<span class="te-el-thumb" style="' + childThumb + '"></span>' +
                                        '<span class="te-el-name">' + truncate(childName, 12) + '</span>' +
                                        '<span class="te-hint" style="flex:1">' + childAnim + '</span>' +
                                        '<span class="te-el-eye' + (child.hidden ? ' active' : '') + '" data-layer-idx="' + i + '" data-el-idx="' + ei + '" data-child-idx="' + ci + '" title="Toggle visibility" data-coreui-toggle="tooltip">' + gcEyeIcon + '</span>' +
                                        '</div>');
                                    $grandRail.append($gc);
                                });
                            }
                            var $addChild = $('<div class="te-child-row te-add-element-row te-grandchild-row">' +
                                '<span class="te-hint te-add-upload" data-action="upload-child" data-layer-idx="' + i + '" data-el-idx="' + ei + '">⬆ upload</span>' +
                                '<span class="te-add-sep">&middot;</span>' +
                                '<span class="te-hint te-add-pick" data-action="pick-child" data-layer-idx="' + i + '" data-el-idx="' + ei + '">◫ assets</span></div>');
                            $grandRail.append($addChild);
                            $rail.append($grandRail);
                        }
                    });
                }
                if (selectedLayerIdx === i) {
                    var $addEl = $('<div class="te-child-row te-add-element-row">' +
                        '<span class="te-hint te-add-upload" data-action="upload-element" data-layer-idx="' + i + '">⬆ upload</span>' +
                        '<span class="te-add-sep">&middot;</span>' +
                        '<span class="te-hint te-add-pick" data-action="pick-element" data-layer-idx="' + i + '">◫ assets</span></div>');
                    $rail.append($addEl);
                }
                $tree.append($rail);
            }
        });

        var $addLayer = $('<div class="te-child-row te-add-element-row te-add-layer-inline">' +
            '<span class="te-hint te-add-upload" data-action="upload-layer">⬆ upload layer</span>' +
            '<span class="te-add-sep">&middot;</span>' +
            '<span class="te-hint te-add-pick" data-action="pick-layer">◫ assets</span></div>');
        $tree.append($addLayer);

        updateLayerEmptyState();
        initSortable();
        refreshDynamicTooltips();

        if (scrollToSelected) {
            setTimeout(function () {
                var $sel = $('#te-layer-tree .selected');
                if ($sel.length) {
                    var panel = document.getElementById('te-layer-panel');
                    if (panel) {
                        var selTop = $sel[0].offsetTop;
                        var selH = $sel[0].offsetHeight;
                        var visTop = panel.scrollTop;
                        var visBottom = visTop + panel.clientHeight;
                        if (selTop < visTop || selTop + selH > visBottom) {
                            panel.scrollTop = Math.max(0, selTop - panel.clientHeight / 3);
                        }
                    }
                }
            }, 0);
        }
    }

    function updateLayerEmptyState() {
        var empty = editorState.layers.length === 0;
        $('#te-layer-empty').toggle(empty);
        $('#te-layer-tree').toggle(!empty);
    }

    // ── SortableJS ──
    function initSortable() {
        var el = document.getElementById('te-layer-tree');
        if (!el || !window.Sortable) return;
        Sortable.create(el, {
            handle: '.te-layer-idx',
            animation: 150,
            ghostClass: 'te-sortable-ghost',
            filter: '.te-child-rail, .te-child-row',
            onEnd: function (evt) {
                var from = evt.oldIndex;
                var to = evt.newIndex;
                if (from === to) return;
                var moved = editorState.layers.splice(from, 1)[0];
                editorState.layers.splice(to, 0, moved);
                if (selectedLayerIdx === from) selectedLayerIdx = to;
                else if (selectedLayerIdx !== null) {
                    if (from < selectedLayerIdx && to >= selectedLayerIdx) selectedLayerIdx--;
                    else if (from > selectedLayerIdx && to <= selectedLayerIdx) selectedLayerIdx++;
                }
                markDirty();
                renderLayerTree();
                debouncedRenderScene();
            }
        });
    }

    function moveLayer(fromIdx, dir) {
        var toIdx = fromIdx + dir;
        if (toIdx < 0 || toIdx >= editorState.layers.length) return;
        var moved = editorState.layers.splice(fromIdx, 1)[0];
        editorState.layers.splice(toIdx, 0, moved);
        var expFrom = !!expandedLayers[fromIdx];
        var expTo = !!expandedLayers[toIdx];
        expandedLayers[toIdx] = expFrom;
        expandedLayers[fromIdx + dir] = expTo;
        if (selectedLayerIdx === fromIdx) selectedLayerIdx = toIdx;
        markDirty();
        renderLayerTree();
        debouncedRenderScene();
    }

    function duplicateSelected() {
        if (selectedLayerIdx === null) return;
        if (selectedElementIdx !== null) {
            var layer = editorState.layers[selectedLayerIdx];
            if (selectedChildIdx !== null) {
                var parent = layer.elements[selectedElementIdx];
                var child = JSON.parse(JSON.stringify(parent.children[selectedChildIdx]));
                child.x = (parseFloat(child.x) + 3) + '%';
                child.y = (parseFloat(child.y) + 3) + '%';
                parent.children.splice(selectedChildIdx + 1, 0, child);
                selectChild(selectedLayerIdx, selectedElementIdx, selectedChildIdx + 1);
            } else {
                var el = JSON.parse(JSON.stringify(layer.elements[selectedElementIdx]));
                el.x = (parseFloat(el.x) + 3) + '%';
                el.y = (parseFloat(el.y) + 3) + '%';
                layer.elements.splice(selectedElementIdx + 1, 0, el);
                selectElement(selectedLayerIdx, selectedElementIdx + 1);
            }
        } else {
            var layer = JSON.parse(JSON.stringify(editorState.layers[selectedLayerIdx]));
            layer.name = (layer.name || 'Layer') + ' copy';
            editorState.layers.splice(selectedLayerIdx + 1, 0, layer);
            expandedLayers[selectedLayerIdx + 1] = true;
            selectLayer(selectedLayerIdx + 1);
        }
        markDirty();
        renderLayerTree(true);
        debouncedRenderScene();
    }

    // ── Properties panel ──
    function getSelectedTarget() {
        if (selectedLayerIdx === null || selectedElementIdx === null) return null;
        var el = editorState.layers[selectedLayerIdx] && editorState.layers[selectedLayerIdx].elements
            ? editorState.layers[selectedLayerIdx].elements[selectedElementIdx] : null;
        if (!el) return null;
        if (selectedChildIdx !== null && el.children && el.children[selectedChildIdx]) {
            return el.children[selectedChildIdx];
        }
        return el;
    }

    function updateBreadcrumb() {
        var $bc = $('#te-breadcrumb');
        var parts = ['<span class="te-bc-item" data-nav="scene">Scene</span>'];
        if (selectedLayerIdx !== null) {
            var layerName = editorState.layers[selectedLayerIdx].name || 'Layer ' + (selectedLayerIdx + 1);
            parts.push('<span class="te-bc-sep">▸</span>');
            parts.push('<span class="te-bc-item" data-nav="layer">' + layerName + '</span>');
        }
        if (selectedElementIdx !== null) {
            var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            var elName = el && el.image ? el.image.split('/').pop().split('_').pop() : 'element';
            parts.push('<span class="te-bc-sep">▸</span>');
            parts.push('<span class="te-bc-item" data-nav="element">' + elName + '</span>');
        }
        if (selectedChildIdx !== null) {
            var parent = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            var child = parent && parent.children ? parent.children[selectedChildIdx] : null;
            var childName = child && child.image ? child.image.split('/').pop().split('_').pop() : 'child';
            parts.push('<span class="te-bc-sep">▸</span>');
            parts.push('<span class="te-bc-item" data-nav="child">' + childName + '</span>');
        }
        // Mark last item as active
        $bc.html(parts.join(''));
        $bc.find('.te-bc-item').last().addClass('te-bc-active');
    }

    function updateRibbon() {
        var hasSelection = selectedLayerIdx !== null;
        $('#te-action-ribbon').toggle(hasSelection);
        var isElement = selectedElementIdx !== null;
        $('#te-rb-center').toggle(isElement);
    }

    function showPropsFor(what) {
        $('#te-scene-props').hide();
        $('#te-layer-props').hide();
        $('#te-element-props').hide();
        $('#te-coords').hide();
        updateBreadcrumb();
        updateRibbon();

        if (what === null) {
            $('#te-scene-props').show();
        } else if (what === 'layer' && selectedLayerIdx !== null) {
            var layer = editorState.layers[selectedLayerIdx];
            if (!layer) return showPropsFor(null);
            $('#te-layer-props').show();
            $('#te-layer-props-title').text((layer.name || 'Layer ' + (selectedLayerIdx + 1)));
            $('#te-layer-depth').val(Math.round(layer.depth * 100));
            $('#te-layer-depth-val').text(layer.depth.toFixed(2));
        } else if ((what === 'element' || what === 'child') && selectedLayerIdx !== null && selectedElementIdx !== null) {
            var target = getSelectedTarget();
            if (!target) return showPropsFor(null);
            $('#te-element-props').show();
            $('#te-coords').show();
            var targetName = target.image ? target.image.split('/').pop() : 'element';
            var layerName = editorState.layers[selectedLayerIdx].name || 'Layer ' + (selectedLayerIdx + 1);
            var parentEl = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            if (selectedChildIdx !== null) {
                var parentName = parentEl.image ? parentEl.image.split('/').pop().split('_').pop() : 'element';
                $('#te-element-props-title').text(targetName + ' · child of ' + parentName);
            } else {
                $('#te-element-props-title').text(targetName + ' · in ' + layerName);
            }
            $('#te-el-x').val(target.x || '50%');
            $('#te-el-y').val(target.y || '50%');
            $('#te-el-w').val(target.width || '100px');
            $('#te-el-h').val(target.height || '100px');
            var _w = parseFloat(target.width), _h = parseFloat(target.height);
            aspectRatio = (_w && _h) ? _w / _h : null;
            $('#te-el-duration').val(parseInt(target.animation_duration) || 4);
            $('#te-el-duration-val').text((parseInt(target.animation_duration) || 4) + 's');
            var scaleVal = target.scale || 1;
            var scaleInt = Math.round(scaleVal * 100);
            $('#te-el-scale').val(scaleInt);
            $('#te-el-scale-num').val(scaleInt);
            var rotVal = parseFloat(target.rotation) || 0;
            $('#te-el-rotate').val(Math.round(rotVal));
            $('#te-el-rotate-num').val(Math.round(rotVal));
            $('#te-el-flipx').toggleClass('active', !!target.flipX);
            $('#te-el-flipy').toggleClass('active', !!target.flipY);
            var opVal = target.opacity != null ? Math.round(target.opacity * 100) : 100;
            $('#te-el-opacity').val(opVal);
            $('#te-el-opacity-num').val(opVal);
            var bgSize = target.bgSize || 'contain';
            if (['contain', 'cover'].indexOf(bgSize) === -1) {
                $('#te-el-bgsize').val('custom');
                $('#te-el-bgsize-custom').show().val(bgSize);
            } else {
                $('#te-el-bgsize').val(bgSize);
                $('#te-el-bgsize-custom').hide();
            }
            var bgPos = target.bgPosition || '';
            var bgPosOpts = ['', 'center', 'top center', 'bottom center', 'left center', 'right center'];
            if (bgPos && bgPosOpts.indexOf(bgPos) === -1) {
                $('#te-el-bgpos').val('custom');
                $('#te-el-bgpos-custom').show().val(bgPos);
            } else {
                $('#te-el-bgpos').val(bgPos);
                $('#te-el-bgpos-custom').hide();
            }
            $('#te-el-bgrepeat').val(target.bgRepeat || 'no-repeat');
            $('#te-anim-chips .te-chip').removeClass('active');
            $('#te-anim-chips .te-chip[data-anim="' + (target.animation || '') + '"]').addClass('active');

            // Container section + add child — only for elements (not children)
            if (selectedChildIdx === null) {
                var hasChildren = parentEl.children && parentEl.children.length > 0;
                var isTagImg = parentEl.tag === 'img';
                $('#te-container-section').show();
                $('#te-add-child-btn').show();
                $('#te-container-toggle').prop('checked', hasChildren || isTagImg);
                $('#te-container-img-toggle').prop('checked', isTagImg);
                $('#te-container-child-count').text(hasChildren ? parentEl.children.length + ' children' : 'no children');
                $('#te-container-opts').toggle(hasChildren || isTagImg);
            } else {
                $('#te-container-section').hide();
                $('#te-add-child-btn').hide();
            }

            // Prev/next navigation visibility
            var layer = editorState.layers[selectedLayerIdx];
            $('#te-nav-parent').toggle(selectedChildIdx !== null);
            if (selectedChildIdx !== null) {
                var siblings = layer.elements[selectedElementIdx].children || [];
                $('#te-nav-prev').prop('disabled', selectedChildIdx <= 0);
                $('#te-nav-next').prop('disabled', selectedChildIdx >= siblings.length - 1);
            } else {
                var siblings = layer.elements || [];
                $('#te-nav-prev').prop('disabled', selectedElementIdx <= 0);
                $('#te-nav-next').prop('disabled', selectedElementIdx >= siblings.length - 1);
            }
        }
    }

    // ── interact.js — drag + resize for element-mode sprites ──
    function destroyInteract() {
        interactInstances.forEach(function (inst) {
            try { inst.unset(); } catch (e) {}
        });
        interactInstances = [];
    }

    function findSceneElementAt(x, y) {
        var elements = document.querySelectorAll('#scene .te-element');
        var found = null;
        for (var i = elements.length - 1; i >= 0; i--) {
            var rect = elements[i].getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                var li = parseInt(elements[i].dataset.layerIdx);
                if (!isNaN(li) && editorState.layers[li] && editorState.layers[li].locked) continue;
                found = elements[i];
                break;
            }
        }
        return found;
    }

    function bindSpriteInteractions() {
        var anyElements = editorState.layers.some(function (l) { return l.elements && l.elements.length > 0; });
        if (!anyElements) return;

        // Unified interaction handler: click on canvas to select/deselect/drag
        $(document).off('mousedown.tecanvas').on('mousedown.tecanvas', function (e) {
            if (!e.target || !e.target.closest) return;
            var $t = $(e.target);

            // Ignore clicks on editor panels, buttons, inputs
            if ($t.closest('.te-panel, .te-topbar, .te-bottombar, .te-coords, .te-btn, .te-chip, .te-seg, .te-expand-toggle, .te-drop-overlay, .te-3d-overlay, .te-zen-exit, .modal, .modal-backdrop, input, label, select').length) return;

            // If an element is already selected, check handles first, then bounds
            var currentSelected = document.querySelector('#scene .te-element.selected');
            var teEl = null;
            if (currentSelected) {
                // Check handle hit first (handles extend beyond element bounds)
                var earlyHandle = hitTestHandle(e.clientX, e.clientY);
                if (earlyHandle) {
                    teEl = currentSelected;
                } else {
                    var selRect = currentSelected.getBoundingClientRect();
                    var handleMargin = 10;
                    if (e.clientX >= selRect.left - handleMargin && e.clientX <= selRect.right + handleMargin &&
                        e.clientY >= selRect.top - handleMargin && e.clientY <= selRect.bottom + handleMargin) {
                        teEl = currentSelected;
                    }
                }
            }
            if (!teEl) teEl = findSceneElementAt(e.clientX, e.clientY);

            if (teEl) {
                e.preventDefault();
                // Check if clicking a resize/rotate handle on already-selected element
                var handlePos = teEl.classList.contains('selected') ? hitTestHandle(e.clientX, e.clientY) : null;
                if (handlePos) {
                    if (handlePos === 'rotate') {
                        startCanvasRotate(e, teEl);
                    } else {
                        startCanvasResize(e, teEl, handlePos);
                    }
                    return;
                }
                // Only re-select if clicking a different element
                var li = parseInt(teEl.dataset.layerIdx);
                var eiStr = teEl.dataset.elIdx;
                var alreadySelected = teEl.classList.contains('selected');
                if (!alreadySelected) {
                    if (eiStr && eiStr.indexOf('.') !== -1) {
                        var parts = eiStr.split('.');
                        selectChild(li, parseInt(parts[0]), parseInt(parts[1]), true);
                    } else {
                        var ei = parseInt(eiStr);
                        if (!isNaN(li) && !isNaN(ei)) selectElement(li, ei, true);
                    }
                }
                startCanvasDrag(e, teEl);
            } else {
                // Clicked empty canvas → deselect
                if (selectedElementIdx !== null || selectedChildIdx !== null) {
                    selectedElementIdx = null;
                    selectedChildIdx = null;
                    highlightDepth(null);
                    renderLayerTree();
                    showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
                    $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
                }
            }
        });

        $(document).off('mousemove.tecursor').on('mousemove.tecursor', function (e) {
            var selected = document.querySelector('#scene .te-element.selected');
            if (!selected) { document.body.style.cursor = ''; return; }
            var handle = hitTestHandle(e.clientX, e.clientY);
            document.body.style.cursor = handle ? HANDLE_CURSORS[handle] || '' : '';
        });

    }

    var SNAP_PCT = 1;

    function snapPct(val) {
        return Math.round(val / SNAP_PCT) * SNAP_PCT;
    }

    function resolveStartPct(target, teEl, parentW, parentH) {
        var x = target ? parseFloat(target.x) : NaN;
        var y = target ? parseFloat(target.y) : NaN;
        if (isNaN(x) || (target && (target.x === 'auto' || !target.x))) {
            var cs = getComputedStyle(teEl);
            var ml = parseFloat(cs.marginLeft) || 0;
            x = ((teEl.offsetLeft - ml) / parentW) * 100;
        }
        if (isNaN(y) || (target && (target.y === 'auto' || !target.y))) {
            var cs2 = getComputedStyle(teEl);
            var mt = parseFloat(cs2.marginTop) || 0;
            y = ((teEl.offsetTop - mt) / parentH) * 100;
        }
        return { x: x, y: y };
    }

    function stripPositionConflicts(target) {
        if (!target || !target.css) return;
        target.css = target.css
            .replace(/\bbottom\s*:\s*[^;]+;?/g, '')
            .replace(/\bright\s*:\s*[^;]+;?/g, '')
            .replace(/;+/g, ';').replace(/^;|;$/g, '').trim();
    }

    function startCanvasDrag(e, teEl) {
        var $s = $(teEl);
        var startX = e.clientX, startY = e.clientY;
        var moved = false;
        var parentEl = teEl.parentNode;
        var parentW = parentEl ? parentEl.offsetWidth : window.innerWidth;
        var parentH = parentEl ? parentEl.offsetHeight : window.innerHeight;
        var target = getSelectedTarget();
        var resolved = resolveStartPct(target, teEl, parentW, parentH);
        var startPctX = resolved.x;
        var startPctY = resolved.y;

        function onMove(ev) {
            var dx = ev.clientX - startX;
            var dy = ev.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
            if (!moved) return;
            if (!teEl.classList.contains('te-dragging')) {
                teEl.dataset.origAnim = teEl.style.animation || '';
                teEl.style.animation = 'none';
                teEl.classList.add('te-dragging');
            }
            var newPctX = startPctX + (dx / parentW * 100);
            var newPctY = startPctY + (dy / parentH * 100);
            teEl.style.left = newPctX.toFixed(1) + '%';
            teEl.style.top = newPctY.toFixed(1) + '%';
            teEl.style.bottom = 'auto';
            teEl.style.right = 'auto';
            updateCoordsReadout($s);
        }
        function onUp(ev) {
            $(document).off('mousemove.tedrag mouseup.tedrag');
            if (!moved) return;
            var dx = ev.clientX - startX;
            var dy = ev.clientY - startY;
            var pctX = startPctX + (dx / parentW * 100);
            var pctY = startPctY + (dy / parentH * 100);
            // Clamp to safe bounds so elements stay findable
            pctX = Math.max(-20, Math.min(90, pctX));
            pctY = Math.max(-20, Math.min(90, pctY));
            if (!ev.shiftKey) {
                pctX = snapPct(pctX);
                pctY = snapPct(pctY);
            } else {
                pctX = parseFloat(pctX.toFixed(1));
                pctY = parseFloat(pctY.toFixed(1));
            }
            teEl.style.left = pctX + '%';
            teEl.style.top = pctY + '%';
            teEl.style.bottom = 'auto';
            teEl.style.right = 'auto';
            teEl.style.animation = teEl.dataset.origAnim || '';
            delete teEl.dataset.origAnim;
            teEl.classList.remove('te-dragging');
            var target = getSelectedTarget();
            if (target) {
                target.x = pctX + '%';
                target.y = pctY + '%';
                stripPositionConflicts(target);
                markDirty();
                showPropsFor(selectedChildIdx !== null ? 'child' : 'element');
            }
        }
        $(document).on('mousemove.tedrag', onMove).on('mouseup.tedrag', onUp);
    }

    function addHandles($sprite) {
        var el = $sprite.appendChild ? $sprite : $sprite[0];
        ['tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r', 'rotate'].forEach(function (pos) {
            var h = document.createElement('span');
            h.className = 'te-handle ' + pos;
            h.dataset.handle = pos;
            el.appendChild(h);
        });
    }

    var HANDLE_CURSORS = {
        tl: 'nwse-resize', tr: 'nesw-resize', bl: 'nesw-resize', br: 'nwse-resize',
        t: 'ns-resize', b: 'ns-resize', l: 'ew-resize', r: 'ew-resize',
        rotate: 'grab'
    };

    function hitTestHandle(mx, my) {
        var handles = document.querySelectorAll('#scene .te-handle');
        var hitRadius = 10;
        for (var i = 0; i < handles.length; i++) {
            var r = handles[i].getBoundingClientRect();
            var cx = r.left + r.width / 2;
            var cy = r.top + r.height / 2;
            if (Math.abs(mx - cx) <= hitRadius && Math.abs(my - cy) <= hitRadius) {
                return handles[i].dataset.handle;
            }
        }
        return null;
    }

    function startCanvasResize(e, teEl, handle) {
        var target = getSelectedTarget();
        if (!target) return;
        var startX = e.clientX, startY = e.clientY;
        var parentEl = teEl.parentNode;
        var parentW = parentEl ? parentEl.offsetWidth : window.innerWidth;
        var parentH = parentEl ? parentEl.offsetHeight : window.innerHeight;

        var startW = parseFloat(target.width) || 0;
        var startH = parseFloat(target.height) || 0;
        var resolved = resolveStartPct(target, teEl, parentW, parentH);
        var startElX = resolved.x;
        var startElY = resolved.y;
        var wUnit = (target.width || '').toString().indexOf('%') !== -1 ? '%' : 'px';
        var hUnit = (target.height || '').toString().indexOf('%') !== -1 ? '%' : 'px';
        var xResolved = !target.x || target.x === 'auto' || isNaN(parseFloat(target.x));
        var yResolved = !target.y || target.y === 'auto' || isNaN(parseFloat(target.y));
        var xUnit = xResolved ? '%' : ((target.x || '').toString().indexOf('%') !== -1 ? '%' : 'px');
        var yUnit = yResolved ? '%' : ((target.y || '').toString().indexOf('%') !== -1 ? '%' : 'px');

        var resizesLeft = handle.indexOf('l') !== -1;
        var resizesRight = handle.indexOf('r') !== -1 || handle === 'tr' || handle === 'br';
        var resizesTop = handle.indexOf('t') !== -1;
        var resizesBottom = handle.indexOf('b') !== -1 || handle === 'bl' || handle === 'br';
        var isCorner = handle.length === 2;

        function toDelta(px, total, unit) {
            return unit === '%' ? (px / total * 100) : px;
        }

        function onMove(ev) {
            var dx = ev.clientX - startX;
            var dy = ev.clientY - startY;
            var dw = 0, dh = 0, dex = 0, dey = 0;

            if (resizesRight) dw = toDelta(dx, parentW, wUnit);
            if (resizesLeft) { dw = toDelta(-dx, parentW, wUnit); dex = toDelta(dx, parentW, xUnit); }
            if (resizesBottom) dh = toDelta(dy, parentH, hUnit);
            if (resizesTop) { dh = toDelta(-dy, parentH, hUnit); dey = toDelta(dy, parentH, yUnit); }

            var newW = Math.max(1, startW + dw);
            var newH = Math.max(1, startH + dh);

            if (isCorner && linkedWH && aspectRatio) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    newH = newW / aspectRatio;
                    if (resizesTop) dey = toDelta(-(newH - startH), parentH, yUnit) * (resizesLeft ? -1 : 1);
                    if (resizesTop) dey = startH - newH > 0 ? toDelta(startH - newH, parentH, yUnit) : toDelta(-(newH - startH), parentH, yUnit);
                } else {
                    newW = newH * aspectRatio;
                    if (resizesLeft) dex = startW - newW > 0 ? toDelta(startW - newW, parentW, xUnit) : toDelta(-(newW - startW), parentW, xUnit);
                }
            }

            var finalX = resizesLeft ? startElX + dex : startElX;
            var finalY = resizesTop ? startElY + dey : startElY;

            teEl.style.width = newW.toFixed(1) + wUnit;
            teEl.style.height = newH.toFixed(1) + hUnit;
            if (resizesLeft) teEl.style.left = finalX.toFixed(1) + xUnit;
            if (resizesTop) teEl.style.top = finalY.toFixed(1) + yUnit;
            updateCoordsReadout($(teEl));
        }

        function onUp(ev) {
            $(document).off('mousemove.teresize mouseup.teresize');
            var dx = ev.clientX - startX;
            var dy = ev.clientY - startY;
            var dw = 0, dh = 0, dex = 0, dey = 0;

            if (resizesRight) dw = toDelta(dx, parentW, wUnit);
            if (resizesLeft) { dw = toDelta(-dx, parentW, wUnit); dex = toDelta(dx, parentW, xUnit); }
            if (resizesBottom) dh = toDelta(dy, parentH, hUnit);
            if (resizesTop) { dh = toDelta(-dy, parentH, hUnit); dey = toDelta(dy, parentH, yUnit); }

            var newW = Math.max(1, startW + dw);
            var newH = Math.max(1, startH + dh);

            if (isCorner && linkedWH && aspectRatio) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    newH = newW / aspectRatio;
                    if (resizesTop) dey = startH - newH > 0 ? toDelta(startH - newH, parentH, yUnit) : toDelta(-(newH - startH), parentH, yUnit);
                } else {
                    newW = newH * aspectRatio;
                    if (resizesLeft) dex = startW - newW > 0 ? toDelta(startW - newW, parentW, xUnit) : toDelta(-(newW - startW), parentW, xUnit);
                }
            }

            if (!ev.shiftKey) {
                newW = snapPct(newW);
                newH = snapPct(newH);
            } else {
                newW = parseFloat(newW.toFixed(1));
                newH = parseFloat(newH.toFixed(1));
            }

            target.width = newW + wUnit;
            target.height = newH + hUnit;
            if (resizesLeft) target.x = parseFloat((startElX + dex).toFixed(1)) + xUnit;
            if (resizesTop) target.y = parseFloat((startElY + dey).toFixed(1)) + yUnit;
            if (resizesLeft || resizesTop) stripPositionConflicts(target);

            teEl.style.width = target.width;
            teEl.style.height = target.height;
            if (resizesLeft) { teEl.style.left = target.x; teEl.style.right = 'auto'; }
            if (resizesTop) { teEl.style.top = target.y; teEl.style.bottom = 'auto'; }

            markDirty();
            showPropsFor(selectedChildIdx !== null ? 'child' : 'element');
            updateCoordsReadout($(teEl));
        }

        $(document).on('mousemove.teresize', onMove).on('mouseup.teresize', onUp);
    }

    function startCanvasRotate(e, teEl) {
        var target = getSelectedTarget();
        if (!target) return;
        var rect = teEl.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        var currentRotation = parseFloat(target.rotation) || 0;
        document.body.style.cursor = 'grabbing';

        function onMove(ev) {
            var angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
            var delta = (angle - startAngle) * (180 / Math.PI);
            var newRot = currentRotation + delta;
            if (!ev.shiftKey) {
                newRot = Math.round(newRot);
            } else {
                newRot = Math.round(newRot / 15) * 15;
            }
            applyTransform(teEl, newRot, target.flipX, target.flipY, target.scale);
        }
        function onUp(ev) {
            $(document).off('mousemove.terotate mouseup.terotate');
            document.body.style.cursor = '';
            var angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
            var delta = (angle - startAngle) * (180 / Math.PI);
            var newRot = currentRotation + delta;
            if (!ev.shiftKey) {
                newRot = Math.round(newRot);
            } else {
                newRot = Math.round(newRot / 15) * 15;
            }
            if (newRot > 180) newRot -= 360;
            if (newRot < -180) newRot += 360;
            target.rotation = newRot;
            applyTransform(teEl, newRot, target.flipX, target.flipY, target.scale);
            markDirty();
            showPropsFor(selectedChildIdx !== null ? 'child' : 'element');
        }
        $(document).on('mousemove.terotate', onMove).on('mouseup.terotate', onUp);
    }

    function updateCoordsReadout($s) {
        var p = $s.position();
        $('#te-coord-x').text(Math.round(p.left));
        $('#te-coord-y').text(Math.round(p.top));
        $('#te-coord-w').text(Math.round($s.outerWidth()));
        $('#te-coord-h').text(Math.round($s.outerHeight()));
    }

    function pauseParallax() {
        if (parallaxInstance && parallaxInstance.disable) {
            parallaxInstance.disable();
            parallaxPaused = true;
            updateParallaxButton();
        }
    }

    function resumeParallax() {
        if (parallaxInstance && parallaxInstance.enable) {
            parallaxInstance.enable();
            parallaxPaused = false;
            updateParallaxButton();
        }
    }

    function updateParallaxButton() {
        var $btn = $('#te-parallax-toggle');
        if (!$btn.length) return;
        if (editorState.type === 'static') {
            $btn.html('▪ Static').addClass('te-parallax-paused');
            return;
        }
        if (parallaxPaused) {
            $btn.html('▶ Parallax paused').addClass('te-parallax-paused').removeClass('te-parallax-live');
            $btn.css({ background: 'rgba(var(--cui-danger-rgb),0.25)', borderColor: 'rgba(var(--cui-danger-rgb),0.5)' });
        } else {
            $btn.html('⏸ Parallax live').removeClass('te-parallax-paused').addClass('te-parallax-live');
            $btn.css({ background: 'rgba(var(--cui-success-rgb),0.25)', borderColor: 'rgba(var(--cui-success-rgb),0.5)' });
        }
    }

    function navigateSibling(dir) {
        if (selectedLayerIdx === null || selectedElementIdx === null) return;
        var layer = editorState.layers[selectedLayerIdx];
        if (!layer) return;

        if (selectedChildIdx !== null) {
            // Navigate between children of the same element
            var parent = layer.elements[selectedElementIdx];
            if (!parent || !parent.children) return;
            var next = selectedChildIdx + dir;
            if (next >= 0 && next < parent.children.length) {
                selectChild(selectedLayerIdx, selectedElementIdx, next);
            }
        } else {
            // Navigate between elements in the same layer
            var next = selectedElementIdx + dir;
            if (next >= 0 && next < (layer.elements || []).length) {
                selectElement(selectedLayerIdx, next);
            }
        }
    }

    function highlightDepth(layerIdx) {
        var sceneLayers = document.querySelectorAll('#scene > div');
        if (layerIdx === null) {
            sceneLayers.forEach(function (l) { l.classList.remove('te-depth-dimmed'); });
            return;
        }
        var targetDepth = editorState.layers[layerIdx] ? editorState.layers[layerIdx].depth : null;
        sceneLayers.forEach(function (l, i) {
            var layer = editorState.layers[i];
            if (layer && targetDepth !== null && layer.depth !== targetDepth) {
                l.classList.add('te-depth-dimmed');
            } else {
                l.classList.remove('te-depth-dimmed');
            }
        });
    }

    function selectLayer(idx) {
        selectedLayerIdx = idx;
        selectedElementIdx = null;
        selectedChildIdx = null;
        expandedLayers[idx] = true;
        resumeParallax();
        highlightDepth(null);
        renderLayerTree();
        showPropsFor('layer');
    }

    function selectElement(layerIdx, elIdx, fromCanvas) {
        selectedLayerIdx = layerIdx;
        selectedElementIdx = elIdx;
        selectedChildIdx = null;
        expandedLayers[layerIdx] = true;
        pauseParallax();
        highlightDepth(layerIdx);
        renderLayerTree(!!fromCanvas);
        showPropsFor('element');
        $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
        var $target = $('#scene .te-element[data-layer-idx="' + layerIdx + '"][data-el-idx="' + elIdx + '"]');
        if ($target.length) {
            $target.addClass('selected');
            addHandles($target[0]);
            updateCoordsReadout($target);
        }
    }

    function selectChild(layerIdx, elIdx, childIdx, fromCanvas) {
        selectedLayerIdx = layerIdx;
        selectedElementIdx = elIdx;
        selectedChildIdx = childIdx;
        expandedLayers[layerIdx] = true;
        pauseParallax();
        highlightDepth(layerIdx);
        renderLayerTree(!!fromCanvas);
        showPropsFor('child');
        $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
        var $parent = $('#scene .te-element[data-layer-idx="' + layerIdx + '"][data-el-idx="' + elIdx + '"]');
        if ($parent.length) $parent.addClass('te-parent-highlight');
        var $target = $('#scene .te-element[data-layer-idx="' + layerIdx + '"][data-el-idx="' + elIdx + '.' + childIdx + '"]');
        if ($target.length) {
            $target.addClass('selected');
            addHandles($target[0]);
            updateCoordsReadout($target);
        }
    }

    // ── Events ──
    function bindEvents() {
        // Expand/collapse toggle
        $(document).on('click', '.te-expand-toggle', function (e) {
            e.stopPropagation();
            var idx = parseInt($(this).data('idx'));
            if (isNaN(idx)) return;
            expandedLayers[idx] = !expandedLayers[idx];
            renderLayerTree();
        });

        // Layer tree clicks (on the row itself, not the toggle)
        $(document).on('click', '.te-layer-row', function (e) {
            if ($(e.target).hasClass('te-expand-toggle') || $(e.target).hasClass('te-layer-eye') || $(e.target).hasClass('te-layer-lock') || $(e.target).hasClass('te-el-eye')) return;
            var idx = parseInt($(this).data('idx'));
            if (selectedLayerIdx === idx && selectedElementIdx === null) {
                selectedLayerIdx = null;
                highlightDepth(null);
                renderLayerTree();
                showPropsFor(null);
            } else {
                selectLayer(idx);
            }
        });
        // Click on grandchild (child of element)
        $(document).on('click', '.te-grandchild-row[data-child-idx]', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            var ci = parseInt($(this).data('childIdx'));
            if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === ci) {
                selectedChildIdx = null;
                highlightDepth(null);
                renderLayerTree();
                showPropsFor('element');
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            } else {
                selectChild(li, ei, ci);
            }
        });
        // Click on element (exclude grandchild rows which also have data-el-idx)
        $(document).on('click', '.te-child-row[data-el-idx]:not(.te-grandchild-row)', function () {
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === null) {
                selectedElementIdx = null;
                highlightDepth(null);
                resumeParallax();
                renderLayerTree();
                showPropsFor('layer');
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            } else {
                selectElement(li, ei);
            }
        });
        $(document).on('click', '[data-action="upload-element"]', function () {
            var li = parseInt($(this).data('layerIdx'));
            triggerUpload('element', li);
        });
        $(document).on('click', '[data-action="pick-element"]', function () {
            var li = parseInt($(this).data('layerIdx'));
            showAssetPicker('element', li);
        });
        $(document).on('click', '[data-action="upload-layer"]', function () {
            triggerUpload('new-layer');
        });
        $(document).on('click', '[data-action="pick-layer"]', function () {
            showAssetPicker('new-layer');
        });
        $(document).on('click', '[data-action="upload-child"]', function () {
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            triggerUpload('add-child', li, ei);
        });
        $(document).on('click', '[data-action="pick-child"]', function () {
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            showAssetPicker('add-child', li, ei);
        });

        // Delete child element
        $(document).on('click', '.te-child-delete', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            var ci = parseInt($(this).data('childIdx'));
            if (editorState.layers[li] && editorState.layers[li].elements[ei] && editorState.layers[li].elements[ei].children) {
                editorState.layers[li].elements[ei].children.splice(ci, 1);
                selectedChildIdx = null;
                markDirty();
                renderLayerTree();
                debouncedRenderScene();
                showPropsFor('element');
            }
        });

        // Delete layer/element
        $(document).on('click', '.te-layer-delete', function (e) {
            e.stopPropagation();
            if ($(this).data('elIdx') !== undefined) {
                var li = parseInt($(this).data('layerIdx'));
                var ei = parseInt($(this).data('elIdx'));
                editorState.layers[li].elements.splice(ei, 1);
            } else {
                var idx = parseInt($(this).data('idx'));
                editorState.layers.splice(idx, 1);
                if (selectedLayerIdx === idx) { selectedLayerIdx = null; selectedElementIdx = null; }
                else if (selectedLayerIdx !== null && selectedLayerIdx > idx) selectedLayerIdx--;
                delete expandedLayers[idx];
            }
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
            showPropsFor(null);
        });

        // Force native color picker open on click (some browsers need showPicker)
        $(document).on('click', '.te-color-pick', function () {
            if (this.showPicker) {
                try { this.showPicker(); } catch (e) {}
            }
        });

        // Scene property controls
        $('#te-bg-color').on('input', function () {
            editorState.scene.background_color = this.value;
            $('#te-bg-hex').val(this.value);
            document.getElementById('scene').style.backgroundColor = this.value;
            updateMiniPreview();
            markDirty();
        });
        $('#te-bg-hex').on('change', function () {
            if (/^#[0-9a-f]{6}$/i.test(this.value)) {
                editorState.scene.background_color = this.value;
                $('#te-bg-color').val(this.value);
                $('#te-bg-swatch').css('background', this.value);
                document.getElementById('scene').style.backgroundColor = this.value;
                updateMiniPreview();
                markDirty();
            }
        });

        $('#te-scalar-x').on('input', function () {
            var v = parseInt(this.value);
            editorState.scene.scalar_x = v;
            $('#te-scalar-x-num').val(v);
            updateParallaxParams();
        });
        $('#te-scalar-x').on('change', function () { markDirty(); });
        $('#te-scalar-x-num').on('change', function () {
            var v = Math.max(1, Math.min(50, parseInt(this.value) || 1));
            this.value = v; $('#te-scalar-x').val(v);
            editorState.scene.scalar_x = v;
            updateParallaxParams(); markDirty();
        });
        $('#te-scalar-y').on('input', function () {
            var v = parseInt(this.value);
            editorState.scene.scalar_y = v;
            $('#te-scalar-y-num').val(v);
            updateParallaxParams();
        });
        $('#te-scalar-y').on('change', function () { markDirty(); });
        $('#te-scalar-y-num').on('change', function () {
            var v = Math.max(1, Math.min(50, parseInt(this.value) || 1));
            this.value = v; $('#te-scalar-y').val(v);
            editorState.scene.scalar_y = v;
            updateParallaxParams(); markDirty();
        });
        $('#te-friction').on('input', function () {
            var v = parseInt(this.value) / 100;
            editorState.scene.friction_x = v;
            editorState.scene.friction_y = v;
            $('#te-friction-num').val(parseInt(this.value));
            updateParallaxParams();
        });
        $('#te-friction').on('change', function () { markDirty(); });
        $('#te-friction-num').on('change', function () {
            var v = Math.max(1, Math.min(100, parseInt(this.value) || 1));
            this.value = v; $('#te-friction').val(v);
            editorState.scene.friction_x = v / 100;
            editorState.scene.friction_y = v / 100;
            updateParallaxParams(); markDirty();
        });
        $('#te-invert-x').on('click', function () {
            var on = $(this).attr('data-toggled') !== 'true';
            $(this).toggleClass('active', on).attr('data-toggled', on);
            editorState.scene.invert_x = on;
            updateParallaxParams();
            markDirty();
        });
        $('#te-invert-y').on('click', function () {
            var on = $(this).attr('data-toggled') !== 'true';
            $(this).toggleClass('active', on).attr('data-toggled', on);
            editorState.scene.invert_y = on;
            updateParallaxParams();
            markDirty();
        });
        $('#te-offset-left').on('change', function () {
            editorState.layer_offset.left = parseInt(this.value) || 0;
            markDirty();
            debouncedRenderScene();
        });
        $('#te-offset-top').on('change', function () {
            editorState.layer_offset.top = parseInt(this.value) || 0;
            markDirty();
            debouncedRenderScene();
        });

        function updateFilterProp(prop, val) {
            if (filterEditMode === 'both') {
                if (!editorState.scene.filter_dark) editorState.scene.filter_dark = {};
                if (!editorState.scene.filter_light) editorState.scene.filter_light = {};
                editorState.scene.filter_dark[prop] = val;
                editorState.scene.filter_light[prop] = val;
            } else {
                if (!editorState.scene['filter_' + filterEditMode]) editorState.scene['filter_' + filterEditMode] = {};
                editorState.scene['filter_' + filterEditMode][prop] = val;
            }
            applyActiveSceneFilter();
        }
        $('#te-filter-sat').on('input', function () { var v = parseInt(this.value); $('#te-filter-sat-num').val(v); updateFilterProp('saturate', v); });
        $('#te-filter-sat-num').on('change', function () { var v = Math.max(0, Math.min(200, parseInt(this.value) || 0)); this.value = v; $('#te-filter-sat').val(v); updateFilterProp('saturate', v); markDirty(); });
        $('#te-filter-bri').on('input', function () { var v = parseInt(this.value); $('#te-filter-bri-num').val(v); updateFilterProp('brightness', v); });
        $('#te-filter-bri-num').on('change', function () { var v = Math.max(0, Math.min(200, parseInt(this.value) || 0)); this.value = v; $('#te-filter-bri').val(v); updateFilterProp('brightness', v); markDirty(); });
        $('#te-filter-con').on('input', function () { var v = parseInt(this.value); $('#te-filter-con-num').val(v); updateFilterProp('contrast', v); });
        $('#te-filter-con-num').on('change', function () { var v = Math.max(0, Math.min(200, parseInt(this.value) || 0)); this.value = v; $('#te-filter-con').val(v); updateFilterProp('contrast', v); markDirty(); });
        $('#te-filter-sat, #te-filter-bri, #te-filter-con').on('change', function () { markDirty(); });

        $('[data-fmode]').on('click', function () {
            filterEditMode = $(this).data('fmode');
            if (filterEditMode === 'both') {
                var mode = getActiveFilterMode();
                var src = editorState.scene['filter_' + mode] || {};
                var synced = { saturate: src.saturate, brightness: src.brightness, contrast: src.contrast };
                editorState.scene.filter_dark = Object.assign(editorState.scene.filter_dark || {}, synced);
                editorState.scene.filter_light = Object.assign(editorState.scene.filter_light || {}, synced);
                applyActiveSceneFilter();
            }
            loadFilterSliders();
        });

        function updateModeLabel() {
            var isDark = document.documentElement.getAttribute('data-coreui-theme') !== 'light';
            $('#te-mode-icon').text(isDark ? '🌙' : '☀️');
            $('#te-mode-label').text(isDark ? 'Dark' : 'Light');
        }
        updateModeLabel();

        $('#te-preview-mode-toggle').on('click', function () {
            var curr = document.documentElement.getAttribute('data-coreui-theme');
            var next = curr === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-coreui-theme', next);
            if (filterEditMode === 'both') {
                var src = editorState.scene['filter_' + curr] || {};
                var synced = { saturate: src.saturate, brightness: src.brightness, contrast: src.contrast };
                editorState.scene['filter_' + next] = Object.assign(editorState.scene['filter_' + next] || {}, synced);
            }
            applyActiveSceneFilter();
            applyAccentLive(editorState.accent);
            updateModeLabel();
            if (filterEditMode === 'both') loadFilterSliders();
        });

        var blurOn = $('body').hasClass('hwa-enabled');
        $('#te-blur-label').text(blurOn ? 'Blur on' : 'Blur off');
        $('#te-blur-toggle').on('click', function () {
            blurOn = !blurOn;
            $('body').toggleClass('hwa-enabled', blurOn).toggleClass('hwa-disabled', !blurOn);
            $('#te-blur-label').text(blurOn ? 'Blur on' : 'Blur off');
            applyBlurLive();
        });

        $('#te-sample-cards-toggle').on('click', function () {
            var el = document.getElementById('te-sample-cards');
            el.style.display = el.style.display === 'none' ? '' : 'none';
        });
        $('#te-dismiss-samples').on('click', function () {
            document.getElementById('te-sample-cards').style.display = 'none';
        });

        // Blur controls
        $('#te-blur-dark').on('input', function () {
            var alpha = parseInt($('#te-blur-dark-alpha').val()) / 100;
            editorState.blur.dark = hexToRgba(this.value, alpha);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-dark-alpha').on('input', function () {
            var v = parseInt(this.value);
            $('#te-blur-dark-num').val(v);
            editorState.blur.dark = hexToRgba($('#te-blur-dark').val(), v / 100);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-dark-num').on('change', function () {
            var v = Math.max(80, Math.min(100, parseInt(this.value) || 95));
            this.value = v; $('#te-blur-dark-alpha').val(v);
            editorState.blur.dark = hexToRgba($('#te-blur-dark').val(), v / 100);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-light').on('input', function () {
            var alpha = parseInt($('#te-blur-light-alpha').val()) / 100;
            editorState.blur.light = hexToRgba(this.value, alpha);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-light-alpha').on('input', function () {
            var v = parseInt(this.value);
            $('#te-blur-light-num').val(v);
            editorState.blur.light = hexToRgba($('#te-blur-light').val(), v / 100);
            applyBlurLive(); markDirty();
        });
        $('#te-blur-light-num').on('change', function () {
            var v = Math.max(80, Math.min(100, parseInt(this.value) || 95));
            this.value = v; $('#te-blur-light-alpha').val(v);
            editorState.blur.light = hexToRgba($('#te-blur-light').val(), v / 100);
            applyBlurLive(); markDirty();
        });

        // Layer depth slider
        $('#te-layer-depth').on('input', function () {
            if (selectedLayerIdx === null) return;
            var v = parseInt(this.value) / 100;
            editorState.layers[selectedLayerIdx].depth = parseFloat(v.toFixed(2));
            $('#te-layer-depth-val').text(v.toFixed(2));
            markDirty();
            debouncedRenderScene();
            renderLayerTree();
        });

        // Element props
        $('#te-el-x, #te-el-y').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.x = $('#te-el-x').val();
            target.y = $('#te-el-y').val();
            markDirty();
            updateElementInPlace(target);
        });
        $('#te-el-w').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var oldW = parseFloat(target.width);
            var newW = parseFloat(this.value);
            var unit = this.value.replace(/[\d.]+/, '');
            // Center-preserving: shift x by half the width difference
            if (oldW && newW && target.x) {
                var dx = (oldW - newW) / 2;
                target.x = parseFloat(parseFloat(target.x) + dx).toFixed(1) + (target.x.toString().indexOf('%') !== -1 ? '%' : unit);
                $('#te-el-x').val(target.x);
            }
            target.width = this.value;
            if (linkedWH && aspectRatio) {
                if (newW) {
                    var oldH = parseFloat(target.height);
                    var newH = Math.round(newW / aspectRatio);
                    var dy = (oldH - newH) / 2;
                    if (oldH && target.y) {
                        target.y = parseFloat(parseFloat(target.y) + dy).toFixed(1) + (target.y.toString().indexOf('%') !== -1 ? '%' : unit);
                        $('#te-el-y').val(target.y);
                    }
                    target.height = newH + unit;
                    $('#te-el-h').val(target.height);
                }
            }
            markDirty();
            updateElementInPlace(target);
        });
        $('#te-el-h').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var oldH = parseFloat(target.height);
            var newH = parseFloat(this.value);
            var unit = this.value.replace(/[\d.]+/, '');
            // Center-preserving: shift y by half the height difference
            if (oldH && newH && target.y) {
                var dy = (oldH - newH) / 2;
                target.y = parseFloat(parseFloat(target.y) + dy).toFixed(1) + (target.y.toString().indexOf('%') !== -1 ? '%' : unit);
                $('#te-el-y').val(target.y);
            }
            target.height = this.value;
            if (linkedWH && aspectRatio) {
                if (newH) {
                    var oldW = parseFloat(target.width);
                    var newW = Math.round(newH * aspectRatio);
                    var dx = (oldW - newW) / 2;
                    if (oldW && target.x) {
                        target.x = parseFloat(parseFloat(target.x) + dx).toFixed(1) + (target.x.toString().indexOf('%') !== -1 ? '%' : unit);
                        $('#te-el-x').val(target.x);
                    }
                    target.width = newW + unit;
                    $('#te-el-w').val(target.width);
                }
            }
            markDirty();
            updateElementInPlace(target);
        });
        // Link W/H toggle
        $('#te-link-wh').on('click', function () {
            linkedWH = !linkedWH;
            $(this).toggleClass('active', linkedWH);
            if (linkedWH) {
                var w = parseFloat($('#te-el-w').val());
                var h = parseFloat($('#te-el-h').val());
                aspectRatio = (w && h) ? w / h : null;
            }
        });

        // Animation chips
        $(document).on('click', '#te-anim-chips .te-chip', function () {
            var target = getSelectedTarget();
            if (!target) return;
            $('#te-anim-chips .te-chip').removeClass('active');
            $(this).addClass('active');
            var anim = $(this).data('anim');
            target.animation = anim || '';
            markDirty();
            updateElementInPlace(target);
        });

        $('#te-el-duration').on('input', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = this.value + 's';
            target.animation_duration = v;
            $('#te-el-duration-val').text(v);
            markDirty();
            updateElementInPlace(target);
        });

        $('#te-el-scale').on('input', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = parseInt(this.value);
            target.scale = v / 100;
            $('#te-el-scale-num').val(v);
            updateElementInPlace(target);
        });
        $('#te-el-scale').on('change', function () { markDirty(); });
        $('#te-el-scale-num').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = Math.max(5, Math.min(500, parseInt(this.value) || 100));
            this.value = v; $('#te-el-scale').val(v);
            target.scale = v / 100;
            updateElementInPlace(target); markDirty();
        });
        $('#te-el-rotate').on('input', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = parseInt(this.value);
            target.rotation = v;
            $('#te-el-rotate-num').val(v);
            updateElementInPlace(target);
        });
        $('#te-el-rotate').on('change', function () { markDirty(); });
        $('#te-el-rotate-num').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = Math.max(-180, Math.min(180, parseInt(this.value) || 0));
            this.value = v; $('#te-el-rotate').val(v);
            target.rotation = v;
            updateElementInPlace(target); markDirty();
        });

        $('#te-el-flipx').on('click', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.flipX = !target.flipX;
            $(this).toggleClass('active', !!target.flipX);
            updateElementInPlace(target);
            markDirty();
        });
        $('#te-el-flipy').on('click', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.flipY = !target.flipY;
            $(this).toggleClass('active', !!target.flipY);
            updateElementInPlace(target);
            markDirty();
        });

        // Opacity
        function syncOpacity(v) {
            var target = getSelectedTarget();
            if (!target) return;
            target.opacity = v / 100;
            updateElementInPlace(target);
        }
        $('#te-el-opacity').on('input', function () {
            var v = parseInt(this.value);
            $('#te-el-opacity-num').val(v);
            syncOpacity(v);
        });
        $('#te-el-opacity').on('change', function () { markDirty(); });
        $('#te-el-opacity-num').on('change', function () {
            var v = Math.max(0, Math.min(100, parseInt(this.value) || 100));
            this.value = v; $('#te-el-opacity').val(v);
            syncOpacity(v); markDirty();
        });

        // Background-size
        $('#te-el-bgsize').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = this.value;
            if (v === 'custom') {
                $('#te-el-bgsize-custom').show().focus();
                return;
            }
            $('#te-el-bgsize-custom').hide();
            target.bgSize = v;
            updateElementInPlace(target); markDirty();
        });
        $('#te-el-bgsize-custom').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.bgSize = this.value || 'contain';
            updateElementInPlace(target); markDirty();
        });

        // Background-position
        $('#te-el-bgpos').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var v = this.value;
            if (v === 'custom') {
                $('#te-el-bgpos-custom').show().focus();
                return;
            }
            $('#te-el-bgpos-custom').hide();
            target.bgPosition = v;
            updateElementInPlace(target); markDirty();
        });
        $('#te-el-bgpos-custom').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.bgPosition = this.value || '';
            updateElementInPlace(target); markDirty();
        });

        // Background-repeat
        $('#te-el-bgrepeat').on('change', function () {
            var target = getSelectedTarget();
            if (!target) return;
            target.bgRepeat = this.value;
            updateElementInPlace(target); markDirty();
        });

        // Layer move up/down
        $(document).on('click', '.te-layer-move', function (e) {
            e.stopPropagation();
            moveLayer(parseInt($(this).data('idx')), parseInt($(this).data('dir')));
        });
        // Layer duplicate
        $(document).on('click', '.te-layer-dup', function (e) {
            e.stopPropagation();
            var idx = parseInt($(this).data('idx'));
            selectLayer(idx);
            duplicateSelected();
        });

        // Element move up/down within a layer
        $(document).on('click', '.te-el-move', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            var dir = parseInt($(this).data('dir'));
            var els = editorState.layers[li].elements;
            if (!els) return;
            var toIdx = ei + dir;
            if (toIdx < 0 || toIdx >= els.length) return;
            var moved = els.splice(ei, 1)[0];
            els.splice(toIdx, 0, moved);
            if (selectedLayerIdx === li && selectedElementIdx === ei) selectedElementIdx = toIdx;
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
        });
        // Child move up/down within an element
        $(document).on('click', '.te-gc-move', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layerIdx'));
            var ei = parseInt($(this).data('elIdx'));
            var ci = parseInt($(this).data('childIdx'));
            var dir = parseInt($(this).data('dir'));
            var children = editorState.layers[li].elements[ei].children;
            if (!children) return;
            var toIdx = ci + dir;
            if (toIdx < 0 || toIdx >= children.length) return;
            var moved = children.splice(ci, 1)[0];
            children.splice(toIdx, 0, moved);
            if (selectedLayerIdx === li && selectedElementIdx === ei && selectedChildIdx === ci) selectedChildIdx = toIdx;
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
        });

        // ── Action ribbon buttons ──
        $('#te-rb-move-up').on('click', function () {
            if (selectedLayerIdx === null) return;
            if (selectedChildIdx !== null) {
                var children = editorState.layers[selectedLayerIdx].elements[selectedElementIdx].children;
                if (!children || selectedChildIdx <= 0) return;
                var m = children.splice(selectedChildIdx, 1)[0];
                children.splice(selectedChildIdx - 1, 0, m);
                selectedChildIdx--;
            } else if (selectedElementIdx !== null) {
                var els = editorState.layers[selectedLayerIdx].elements;
                if (!els || selectedElementIdx <= 0) return;
                var m = els.splice(selectedElementIdx, 1)[0];
                els.splice(selectedElementIdx - 1, 0, m);
                selectedElementIdx--;
            } else {
                moveLayer(selectedLayerIdx, -1);
                return;
            }
            markDirty(); renderLayerTree(); debouncedRenderScene();
        });
        $('#te-rb-move-down').on('click', function () {
            if (selectedLayerIdx === null) return;
            if (selectedChildIdx !== null) {
                var children = editorState.layers[selectedLayerIdx].elements[selectedElementIdx].children;
                if (!children || selectedChildIdx >= children.length - 1) return;
                var m = children.splice(selectedChildIdx, 1)[0];
                children.splice(selectedChildIdx + 1, 0, m);
                selectedChildIdx++;
            } else if (selectedElementIdx !== null) {
                var els = editorState.layers[selectedLayerIdx].elements;
                if (!els || selectedElementIdx >= els.length - 1) return;
                var m = els.splice(selectedElementIdx, 1)[0];
                els.splice(selectedElementIdx + 1, 0, m);
                selectedElementIdx++;
            } else {
                moveLayer(selectedLayerIdx, 1);
                return;
            }
            markDirty(); renderLayerTree(); debouncedRenderScene();
        });
        $('#te-rb-duplicate').on('click', function () {
            if (selectedLayerIdx === null) return;
            duplicateSelected();
        });
        $('#te-rb-center').on('click', function () {
            var target = getSelectedTarget();
            if (!target) return;
            var elIdxStr = selectedChildIdx !== null
                ? selectedElementIdx + '.' + selectedChildIdx
                : String(selectedElementIdx);
            var $el = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx
                + '"][data-el-idx="' + elIdxStr + '"]');
            if (!$el.length) return;
            var el = $el[0];
            var parentEl = el.parentNode;
            var parentW = parentEl ? parentEl.offsetWidth : window.innerWidth;
            var parentH = parentEl ? parentEl.offsetHeight : window.innerHeight;
            var cs = getComputedStyle(el);
            var ml = parseFloat(cs.marginLeft) || 0;
            var mt = parseFloat(cs.marginTop) || 0;
            var centerX = Math.round(((parentW / 2 - el.offsetWidth / 2 - ml) / parentW * 100) * 10) / 10;
            var centerY = Math.round(((parentH / 2 - el.offsetHeight / 2 - mt) / parentH * 100) * 10) / 10;
            target.x = centerX + '%';
            target.y = centerY + '%';
            stripPositionConflicts(target);
            el.style.left = target.x;
            el.style.top = target.y;
            el.style.bottom = 'auto';
            el.style.right = 'auto';
            $('#te-el-x').val(target.x);
            $('#te-el-y').val(target.y);
            markDirty();
            updateElementInPlace(target);
        });
        $('#te-rb-delete').on('click', function () {
            if (selectedLayerIdx === null) return;
            if (selectedChildIdx !== null) {
                var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
                if (el && el.children) {
                    el.children.splice(selectedChildIdx, 1);
                    selectedChildIdx = null;
                }
            } else if (selectedElementIdx !== null) {
                editorState.layers[selectedLayerIdx].elements.splice(selectedElementIdx, 1);
                selectedElementIdx = null;
                selectedChildIdx = null;
            } else {
                editorState.layers.splice(selectedLayerIdx, 1);
                selectedLayerIdx = null;
            }
            markDirty(); renderLayerTree(); renderScene(); showPropsFor(null);
        });

        // Layer visibility + lock toggles
        $(document).on('click', '.te-layer-eye', function (e) {
            e.stopPropagation();
            var idx = parseInt($(this).data('idx'));
            var layer = editorState.layers[idx];
            if (!layer) return;
            layer.hidden = !layer.hidden;
            markDirty();
            renderLayerTree();
            var sceneLayer = document.querySelectorAll('#scene > div')[idx];
            if (sceneLayer) sceneLayer.style.display = layer.hidden ? 'none' : '';
        });
        $(document).on('click', '.te-layer-lock', function (e) {
            e.stopPropagation();
            var idx = parseInt($(this).data('idx'));
            var layer = editorState.layers[idx];
            if (!layer) return;
            layer.locked = !layer.locked;
            renderLayerTree();
        });

        // Element/child visibility toggle
        $(document).on('click', '.te-el-eye', function (e) {
            e.stopPropagation();
            var li = parseInt($(this).data('layer-idx'));
            var ei = parseInt($(this).data('el-idx'));
            var ci = $(this).data('child-idx');
            var layer = editorState.layers[li];
            if (!layer) return;
            var target;
            if (ci !== undefined) {
                target = layer.elements[ei] && layer.elements[ei].children ? layer.elements[ei].children[parseInt(ci)] : null;
            } else {
                target = layer.elements ? layer.elements[ei] : null;
            }
            if (!target) return;
            target.hidden = !target.hidden;
            markDirty();
            renderLayerTree();
            var elIdxStr = ci !== undefined ? ei + '.' + ci : String(ei);
            var $sceneEl = $('#scene .te-element[data-layer-idx="' + li + '"][data-el-idx="' + elIdxStr + '"]');
            if ($sceneEl.length) $sceneEl.css('display', target.hidden ? 'none' : '');
            // Cascade: if hiding a parent element, also hide its children in the scene
            if (ci === undefined && target.children && target.children.length) {
                target.children.forEach(function (child, childIdx) {
                    var $childEl = $('#scene .te-element[data-layer-idx="' + li + '"][data-el-idx="' + ei + '.' + childIdx + '"]');
                    if ($childEl.length) $childEl.css('display', target.hidden ? 'none' : (child.hidden ? 'none' : ''));
                });
            }
        });

        // Replace/delete buttons
        $('#te-replace-layer-img').on('click', function () {
            if (selectedLayerIdx !== null) triggerUpload('replace-layer', selectedLayerIdx);
        });
        $('#te-delete-layer').on('click', function () {
            if (selectedLayerIdx === null) return;
            editorState.layers.splice(selectedLayerIdx, 1);
            delete expandedLayers[selectedLayerIdx];
            selectedLayerIdx = null;
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
            showPropsFor(null);
        });
        // Container toggles
        $('#te-container-toggle').on('change', function () {
            if (selectedLayerIdx === null || selectedElementIdx === null || selectedChildIdx !== null) return;
            var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            if (this.checked) {
                if (!el.children) el.children = [];
                el.tag = 'img';
                $('#te-container-opts').show();
                $('#te-container-img-toggle').prop('checked', true);
            } else {
                el.children = [];
                delete el.tag;
                $('#te-container-opts').hide();
                $('#te-container-img-toggle').prop('checked', false);
            }
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
        });
        $('#te-container-img-toggle').on('change', function () {
            if (selectedLayerIdx === null || selectedElementIdx === null) return;
            var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            if (this.checked) {
                el.tag = 'img';
            } else {
                delete el.tag;
            }
            markDirty();
            debouncedRenderScene();
        });

        $('#te-replace-el-img').on('click', function () {
            if (selectedChildIdx !== null) {
                triggerUpload('replace-child', selectedLayerIdx, selectedElementIdx, selectedChildIdx);
            } else if (selectedLayerIdx !== null && selectedElementIdx !== null) {
                triggerUpload('replace-element', selectedLayerIdx, selectedElementIdx);
            }
        });
        $('#te-delete-el').on('click', function () {
            if (selectedChildIdx !== null) {
                editorState.layers[selectedLayerIdx].elements[selectedElementIdx].children.splice(selectedChildIdx, 1);
                selectedChildIdx = null;
                markDirty();
                renderLayerTree();
                debouncedRenderScene();
                showPropsFor('element');
                return;
            }
            if (selectedLayerIdx === null || selectedElementIdx === null) return;
            editorState.layers[selectedLayerIdx].elements.splice(selectedElementIdx, 1);
            selectedElementIdx = null;
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
            showPropsFor('layer');
        });
        // Breadcrumb navigation
        $(document).on('click', '.te-bc-item:not(.te-bc-active)', function () {
            var nav = $(this).data('nav');
            if (nav === 'scene') {
                selectedLayerIdx = null;
                selectedElementIdx = null;
                selectedChildIdx = null;
                highlightDepth(null);
                resumeParallax();
                renderLayerTree();
                showPropsFor(null);
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            } else if (nav === 'layer') {
                selectedElementIdx = null;
                selectedChildIdx = null;
                highlightDepth(null);
                resumeParallax();
                renderLayerTree();
                showPropsFor('layer');
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            } else if (nav === 'element') {
                selectedChildIdx = null;
                renderLayerTree();
                showPropsFor('element');
                $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
                var $target = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx + '"][data-el-idx="' + selectedElementIdx + '"]');
                if ($target.length) {
                    $target.addClass('selected');
                    addHandles($target[0]);
                }
            }
        });

        $('#te-deselect-layer').on('click', function () {
            selectedLayerIdx = null;
            selectedElementIdx = null;
            selectedChildIdx = null;
            highlightDepth(null);
            resumeParallax();
            renderLayerTree();
            showPropsFor(null);
        });
        // × fully deselects everything → back to Scene
        $('#te-deselect-element').on('click', function () {
            selectedLayerIdx = null;
            selectedElementIdx = null;
            selectedChildIdx = null;
            highlightDepth(null);
            resumeParallax();
            renderLayerTree();
            showPropsFor(null);
            $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
        });
        // ↑ goes from child to parent element
        $('#te-nav-parent').on('click', function () {
            if (selectedChildIdx === null) return;
            selectedChildIdx = null;
            renderLayerTree();
            showPropsFor('element');
            $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
            var $target = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx + '"][data-el-idx="' + selectedElementIdx + '"]');
            if ($target.length) {
                $target.addClass('selected');
                addHandles($target[0]);
                updateCoordsReadout($target);
            }
            return;
        });

        // Toggle buttons
        $(document).on('click', '#te-type-toggle button', function () {
            editorState.type = $(this).data('val');
            setToggleActive('#te-type-toggle', editorState.type);
            markDirty();
            renderLayerTree();
            debouncedRenderScene();
            updateParallaxButton();
        });
        // Mode toggle removed — mode is auto-detected per layer

        // Name + accent
        $('#te-title-input').on('input', function () {
            editorState.name = this.value;
            markDirty();
        });
        $('#te-accent-color').on('input change', function () {
            editorState.accent = this.value;
            $('#te-accent-swatch').css('background', this.value);
            applyAccentLive(this.value);
            markDirty();
        });

        $('#te-accent-enhance').on('click', function () {
            var accent = editorState.accent || '#FF6B1A';
            var enhanced = vivifyAccent(accent);
            if (enhanced !== accent) {
                editorState.accent = enhanced;
                $('#te-accent-color').val(enhanced);
                applyAccentLive(enhanced);
                markDirty();
                try { new Toast('Enhanced', 'now', 'Vivid neon accent applied', { autohide: true, delay: 2000 }).show(); } catch (ex) {}
            } else {
                try { new Toast('Already vivid', 'now', 'Accent is already at peak vibrancy', { autohide: true, delay: 2000 }).show(); } catch (ex) {}
            }
        });

        // Add layer button
        $('#te-add-layer-btn').on('click', function () {
            triggerUpload('new-layer');
        });

        // Add child to element
        // Prev/next element navigation
        $('#te-nav-prev').on('click', function () { navigateSibling(-1); });
        $('#te-nav-next').on('click', function () { navigateSibling(1); });

        $('#te-add-child-btn').on('click', function () {
            if (selectedLayerIdx === null || selectedElementIdx === null) return;
            var el = editorState.layers[selectedLayerIdx].elements[selectedElementIdx];
            if (!el.children) {
                el.children = [];
                el.tag = 'img';
            }
            triggerUpload('add-child', selectedLayerIdx, selectedElementIdx);
        });

        // 3D peek
        // Parallax pause/resume
        $('#te-parallax-toggle').on('click', function () {
            if (parallaxPaused) resumeParallax();
            else pauseParallax();
        });

        $('#te-3d-btn').on('click', toggle3DPeek);

        // Zen mode
        $('#te-zen-btn').on('click', function () { toggleZen(true); });
        $('#te-zen-exit').on('click', function () { toggleZen(false); });

        // Help
        $('#te-help-btn').on('click', showHelp);

        // Reset panel positions
        $('#te-reset-panels-btn').on('click', function () {
            $('.te-panel').each(function () {
                this.classList.remove('te-panel-dragged');
                this.style.left = '';
                this.style.top = '';
                this.style.right = '';
                this.style.bottom = '';
                this.style.width = '';
            });
            $.post('/api/app/preferences', {
                preference_id: 'theme_editor_panels',
                value: '{}'
            });
            try { new Toast('Panels reset', 'now', 'Panel positions restored to default', { autohide: true, delay: 2000 }).show(); } catch (ex) {}
        });

        // Exit editor
        $('#te-exit-btn').on('click', function () {
            if (!editorState.dirty) { window.location.href = '/dashboard'; return; }
            var d = new Dialog('Unsaved Changes', 'You have unsaved changes. Exit anyway?', 'small');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: 'Exit', class: 'btn btn-danger', dismiss: true, onClick: function () { editorState.dirty = false; window.location.href = '/dashboard'; } }
            ]);
            d.show();
        });

        // Save / Discard
        $('#te-save-btn').on('click', function () { saveTheme('save'); });
        $('#te-save-apply-btn').on('click', function () { $('#te-save-menu').removeClass('open'); saveTheme('apply'); });
        $('#te-save-exit-btn').on('click', function () { $('#te-save-menu').removeClass('open'); saveTheme('exit'); });
        $('#te-retake-thumb-btn').on('click', function () {
            $('#te-save-menu').removeClass('open');
            $(this).text('Capturing...').prop('disabled', true);
            var $btn = $(this);
            captureThumbnail(function (url) {
                if (url) {
                    new Toast('Thumbnail updated', 'now',
                        '<img src="' + url + '" style="width:100%;max-width:240px;border-radius:6px;margin-top:6px;display:block;">',
                        { autohide: true, delay: 5000 }).show();
                    // Save the new thumbnail to the theme immediately
                    if (editorState.theme_id) {
                        $.post('/api/app/user_themes', {
                            theme_id: editorState.theme_id,
                            config: JSON.stringify({
                                name: editorState.name,
                                type: editorState.type,
                                mode: 'element',
                                scene: editorState.scene,
                                blur: editorState.blur,
                                layer_offset: editorState.layer_offset,
                                design_ratio: editorState.design_ratio,
                                layers: editorState.layers,
                                accent: editorState.accent,
                                thumbnail_url: url
                            })
                        });
                    }
                } else {
                    new Toast('Error', 'now', 'Failed to capture thumbnail', { autohide: true, delay: 3000 }).show();
                }
                $btn.html('&#x1F4F7; Retake Thumbnail').prop('disabled', false);
            });
        });
        $('#te-save-dropdown').on('click', function (e) {
            e.stopPropagation();
            $('#te-save-menu').toggleClass('open');
        });
        $(document).on('click', function () { $('#te-save-menu').removeClass('open'); });
        $('#te-discard-btn').on('click', function () {
            if (!editorState.dirty) { window.location.href = '/dashboard'; return; }
            var d = new Dialog('Discard Changes', 'Discard all unsaved changes?', 'small');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: 'Discard', class: 'btn btn-danger', dismiss: true, onClick: function () { editorState.dirty = false; window.location.href = '/dashboard'; } }
            ]);
            d.show();
        });

        // Submit for review
        $('#te-submit-review-btn').on('click', function () {
            $('#te-save-menu').removeClass('open');
            if (!editorState.theme_id) {
                saveTheme('save', function () {
                    if (editorState.theme_id) {
                        $('#te-submit-review-btn').trigger('click');
                    } else {
                        new Toast('Error', 'now', 'Save failed — cannot submit', { autohide: true, delay: 3000 }).show();
                    }
                });
                return;
            }
            var submitBody = '<div style="text-align:center;padding:0.5rem 0">' +
                '<div style="font-size:2rem;margin-bottom:0.5rem">🎨</div>' +
                '<p style="margin-bottom:0.75rem">Submit <b>' + (editorState.name || 'your theme') + '</b> for admin review.</p>' +
                '<div class="liquid-rim" style="padding:0.75rem;border-radius:0.5rem;margin-bottom:0.75rem;text-align:left">' +
                    '<div style="font-size:0.85rem"><b>⚡ Jolt Rewards</b></div>' +
                    '<div style="font-size:0.8rem;opacity:0.8;margin-top:0.25rem">Approved themes earn <b>10–1000 ⚡ Jolt</b> based on quality. Great designs earn more!</div>' +
                '</div>' +
                '<div style="font-size:0.8rem;opacity:0.6">You can keep editing while your submission is being reviewed.</div>' +
            '</div>';
            var d = new Dialog('Submit for Review', submitBody, 'medium');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: '🚀 Submit for Review', class: 'btn btn-primary', dismiss: true, onClick: function () {
                    saveTheme('save', function () {
                        $.post('/api/app/user_themes', { _method: 'SUBMIT', theme_id: editorState.theme_id }, function (resp) {
                            if (resp.result === 'success') {
                                $('#te-save-status').text('pending review');
                                new Toast('Submitted', 'now', 'Theme submitted for review!', { autohide: true, delay: 3000 }).show();
                            } else {
                                new Toast('Error', 'now', resp.error || 'Submit failed').show();
                            }
                        }).fail(function () { new Toast('Error', 'now', 'Submit failed').show(); });
                    });
                }}
            ]);
            d.show();
        });

        // Admin approve (from editor)
        $('#te-admin-approve').on('click', function () {
            var themeId = editorState.theme_id;
            if (!themeId) return;
            var d = new Dialog('Approve Theme', '<div class="mb-3"><label class="form-label">Jolt Reward (0-1000)</label><input type="number" class="form-control" id="ed-approve-reward" min="0" max="1000" value="50"></div><div><label class="form-label">Note (optional)</label><input type="text" class="form-control" id="ed-approve-note" placeholder="Great work!"></div>', 'small');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: 'Approve & Reward', class: 'btn btn-success', dismiss: true, onClick: function () {
                    var reward = parseInt($('#ed-approve-reward').val()) || 0;
                    var note = $('#ed-approve-note').val();

                    $.post('/api/admin/themes/review', { theme_id: themeId, action: 'approve', reward: reward, note: note }, function (resp) {
                        if (resp.result === 'success') {
                            new Toast('Approved', 'now', resp.message, { autohide: true, delay: 3000 }).show();
                            $('#te-save-status').text('approved');
                        } else {
                            new Toast('Error', 'now', resp.error || 'Failed').show();
                        }
                    });
                }}
            ]);
            d.show();
        });

        // Admin reject (from editor)
        $('#te-admin-reject').on('click', function () {
            var themeId = editorState.theme_id;
            if (!themeId) return;
            var d = new Dialog('Reject Theme', '<div><label class="form-label">Reason</label><input type="text" class="form-control" id="ed-reject-note" placeholder="Needs improvement..."></div>', 'small');
            d.setButtons([
                { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
                { name: 'Reject', class: 'btn btn-danger', dismiss: true, onClick: function () {
                    var note = $('#ed-reject-note').val();

                    $.post('/api/admin/themes/review', { theme_id: themeId, action: 'reject', note: note }, function (resp) {
                        if (resp.result === 'success') {
                            new Toast('Rejected', 'now', resp.message, { autohide: true, delay: 3000 }).show();
                            $('#te-save-status').text('rejected');
                        } else {
                            new Toast('Error', 'now', resp.error || 'Failed').show();
                        }
                    });
                }}
            ]);
            d.show();
        });
    }

    // ── Keyboard ──
    function bindKeyboard() {
        $(document).on('keydown.te', function (e) {
            if (!document.getElementById('theme-editor')) return;
            if (e.key === 'Tab') {
                e.preventDefault();
                toggleZen(!zenMode);
            }
            if (e.key === 'Escape') {
                if (zenMode) { toggleZen(false); return; }
                if (selectedElementIdx !== null || selectedChildIdx !== null) {
                    selectedElementIdx = null;
                    selectedChildIdx = null;
                    highlightDepth(null);
                    resumeParallax();
                    renderLayerTree();
                    showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
                    $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
                    return;
                }
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                saveTheme();
            }
            if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
                e.preventDefault();
                doUndo();
            }
            if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))) {
                e.preventDefault();
                doRedo();
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (document.activeElement.tagName === 'INPUT') return;
                if (selectedElementIdx !== null && selectedLayerIdx !== null) {
                    editorState.layers[selectedLayerIdx].elements.splice(selectedElementIdx, 1);
                    selectedElementIdx = null;
                    markDirty();
                    renderLayerTree();
                    debouncedRenderScene();
                    showPropsFor('layer');
                }
            }
            // Ctrl+D duplicate
            if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
                e.preventDefault();
                duplicateSelected();
            }
            // Ctrl+]/[ move layer up/down
            if ((e.metaKey || e.ctrlKey) && e.key === ']' && selectedLayerIdx !== null) {
                e.preventDefault();
                moveLayer(selectedLayerIdx, -1);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === '[' && selectedLayerIdx !== null) {
                e.preventDefault();
                moveLayer(selectedLayerIdx, 1);
            }
            // Arrow key nudge: 1% per press, 0.2% with Shift
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) !== -1) {
                if (document.activeElement.tagName === 'INPUT') return;
                var target = getSelectedTarget();
                if (!target) return;
                e.preventDefault();
                var step = e.shiftKey ? 0.2 : 1;
                var x = parseFloat(target.x) || 0;
                var y = parseFloat(target.y) || 0;
                if (e.key === 'ArrowLeft') x -= step;
                if (e.key === 'ArrowRight') x += step;
                if (e.key === 'ArrowUp') y -= step;
                if (e.key === 'ArrowDown') y += step;
                x = Math.max(-20, Math.min(90, parseFloat(x.toFixed(1))));
                y = Math.max(-20, Math.min(90, parseFloat(y.toFixed(1))));
                target.x = x + '%';
                target.y = y + '%';
                markDirty();
                updateElementInPlace(target);
                // Also update the DOM left/top directly
                var elIdxStr = selectedChildIdx !== null
                    ? selectedElementIdx + '.' + selectedChildIdx
                    : String(selectedElementIdx);
                var $el = $('#scene .te-element[data-layer-idx="' + selectedLayerIdx + '"][data-el-idx="' + elIdxStr + '"]');
                if ($el.length) {
                    $el[0].style.left = target.x;
                    $el[0].style.top = target.y;
                    $el[0].style.bottom = 'auto';
                    $el[0].style.right = 'auto';
                    updateCoordsReadout($el);
                }
                showPropsFor(selectedChildIdx !== null ? 'child' : 'element');
            }
        });
    }

    // ── Zen mode ──
    function toggleZen(on) {
        zenMode = on;
        $editor.toggleClass('zen', on);
        $('#te-zen-exit').toggle(on);
    }

    // ── 3D peek ──
    var peek3DOpen = false;
    function toggle3DPeek() {
        if (peek3DOpen) {
            $('#te-3d-overlay').remove();
            peek3DOpen = false;
            $('#te-3d-btn').removeClass('active');
            return;
        }
        peek3DOpen = true;
        $('#te-3d-btn').addClass('active');

        var $overlay = $('<div id="te-3d-overlay" class="te-3d-overlay">' +
            '<div class="te-3d-viewport">' +
                '<div class="te-3d-stack" id="te-3d-stack"></div>' +
            '</div>' +
            '<div class="te-3d-footer">' +
                '<span class="te-hint">Click a plate to select that layer</span>' +
                '<button class="te-btn te-btn-glass te-btn-sm" id="te-3d-close">Close 3D ✕</button>' +
            '</div>' +
        '</div>');

        var $stack = $overlay.find('#te-3d-stack');
        var total = editorState.layers.length;
        editorState.layers.forEach(function (layer, i) {
            var zOff = i * 30;
            var isSelected = selectedLayerIdx === i;
            var firstImg = '';
            if (layer.elements && layer.elements.length && layer.elements[0].image) {
                firstImg = 'url(' + layer.elements[0].image + ') center/cover';
            }
            var bg = firstImg || 'linear-gradient(135deg, #3a4459, #1c2330)';
            var $plate = $('<div class="te-3d-plate' + (isSelected ? ' selected' : '') + '" data-idx="' + i + '" style="transform:translateZ(' + zOff + 'px);background:' + bg + '">' +
                '<span class="te-3d-plate-label">' + (layer.name || 'Layer ' + (i+1)) + ' · ' + layer.depth + '</span>' +
            '</div>');
            $stack.append($plate);
        });

        $editor.append($overlay);

        $overlay.on('click', '.te-3d-plate', function () {
            selectLayer(parseInt($(this).data('idx')));
            toggle3DPeek();
        });
        $overlay.on('click', '#te-3d-close', function () {
            toggle3DPeek();
        });

        // Drag to rotate 3D view
        var rotX = 40, rotY = -15, zoomScale = 1;
        $overlay.on('mousedown', function (e) {
            if ($(e.target).closest('#te-3d-close').length) return;
            var isPlate = $(e.target).closest('.te-3d-plate').length > 0;
            var startX = e.clientX, startY = e.clientY;
            var startRotX = rotX, startRotY = rotY;
            var moved = false;
            function onMove(ev) {
                var dx = ev.clientX - startX, dy = ev.clientY - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
                rotY = startRotY + dx * 0.5;
                rotX = Math.max(5, Math.min(80, startRotX - dy * 0.5));
                $stack.css('transform', 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(' + zoomScale + ')');
            }
            function onUp(ev) {
                $(document).off('mousemove.te3d mouseup.te3d');
                if (!moved && isPlate) {
                    var idx = $(ev.target).closest('.te-3d-plate').data('idx');
                    if (idx !== undefined) { selectLayer(parseInt(idx)); toggle3DPeek(); }
                }
            }
            $(document).on('mousemove.te3d', onMove).on('mouseup.te3d', onUp);
            e.preventDefault();
        });

        // Scroll to zoom
        $overlay.on('wheel', function (e) {
            zoomScale += e.originalEvent.deltaY > 0 ? -0.1 : 0.1;
            zoomScale = Math.max(0.5, Math.min(2.5, zoomScale));
            $stack.css('transform', 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(' + zoomScale + ')');
            e.preventDefault();
        });
    }

    // ── Idle auto-hide ──
    function resetIdleTimer() {
        $editor.removeClass('idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
            if (!zenMode) $editor.addClass('idle');
        }, 6000);
    }
    $(document).on('mousemove.teidle', resetIdleTimer);

    // ── Drag & drop uploads ──
    function bindDragDrop() {
        var $overlay = $('#te-drop-overlay');

        document.addEventListener('dragenter', function (e) {
            if (e.dataTransfer.types.includes('Files')) {
                $overlay.show();
            }
        });
        $overlay.on('dragleave', function (e) {
            if (e.target === this) $overlay.hide();
        });
        $overlay.on('dragover', function (e) { e.preventDefault(); });
        $overlay.on('drop', function (e) {
            e.preventDefault();
            $overlay.hide();
            var files = e.originalEvent.dataTransfer.files;
            if (!files.length) return;
            handleFileUpload(files[0], 'new-layer');
        });

        // Also allow drop on layer rows
        $(document).on('dragover', '.te-layer-row', function (e) {
            e.preventDefault();
            $(this).addClass('drop-into');
        });
        $(document).on('dragleave', '.te-layer-row', function () {
            $(this).removeClass('drop-into');
        });
        $(document).on('drop', '.te-layer-row', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('drop-into');
            $overlay.hide();
            var idx = parseInt($(this).data('idx'));
            var files = e.originalEvent.dataTransfer.files;
            if (!files.length) return;
            handleFileUpload(files[0], 'replace-layer', idx);
        });

        // Drop on child rail = nest as element
        $(document).on('dragover', '.te-child-rail', function (e) {
            e.preventDefault();
            $(this).css('background', 'rgba(226,109,92,.1)');
        });
        $(document).on('dragleave', '.te-child-rail', function () {
            $(this).css('background', '');
        });
        $(document).on('drop', '.te-child-rail', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).css('background', '');
            $overlay.hide();
            var li = parseInt($(this).data('layerIdx'));
            var files = e.originalEvent.dataTransfer.files;
            if (!files.length || isNaN(li)) return;
            handleFileUpload(files[0], 'element', li);
        });
    }

    // ── File upload ──
    function triggerUpload(action, layerIdx, elIdx) {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png,.jpg,.jpeg,.webp,.svg';
        input.onchange = function () {
            if (this.files.length) handleFileUpload(this.files[0], action, layerIdx, elIdx);
        };
        input.click();
    }

    function showAssetPicker(action, layerIdx, elIdx) {
        var d = new Dialog('Pick from Assets',
            '<div class="text-center py-3"><div class="spinner-border spinner-border-sm"></div> Loading assets...</div>',
            'xlarge');
        d.setButtons([{ "name": "Cancel", "class": "btn-secondary", "dismiss": true }]);
        d.setEvents([{
            action: 'shown',
            callback: function (event) {
                var $modal = $(event.data.modal);
                $.get('/api/app/user_files?mode=picker&filter=theme').done(function (html) {
                    $modal.find('.modal-body').html(html);
                    $modal.on('click', '.uf-item', function () {
                        var url = $(this).data('url');
                        var filename = $(this).data('filename');
                        if (url) {
                            d.hide();
                            applyUpload(url, action, layerIdx, elIdx, filename);
                        }
                    });
                    $modal.on('click', '#uf-upload-new', function () {
                        d.hide();
                        triggerUpload(action, layerIdx, elIdx);
                    });
                    // Client-side filter pills
                    $modal.on('click', '.uf-filter-pill', function () {
                        var f = $(this).data('filter');
                        $modal.find('.uf-filter-pill').removeClass('active');
                        $(this).addClass('active');
                        if (f === 'all') {
                            $modal.find('.uf-item').show();
                        } else {
                            $modal.find('.uf-item').hide().filter('[data-feature="' + f + '"]').show();
                        }
                    });
                    $modal.find('.uf-filter-pill[data-filter="theme_layer"]').trigger('click');
                }).fail(function () {
                    $modal.find('.modal-body').html('<div class="text-danger text-center py-3">Failed to load assets.</div>');
                });
            }
        }]);
        d.show();
    }

    function handleFileUpload(file, action, layerIdx, elIdx) {
        if (file.size > 5 * 1024 * 1024) {
            new Toast('Error', 'now', 'Max file size is 5MB', { autohide: true, delay: 3000 }).show();
            return;
        }

        var fd = new FormData();
        fd.append('file', file);
        fd.append('theme_id', editorState.theme_id || 'draft');

        $.ajax({
            url: '/api/app/user_theme_upload',
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            success: function (resp) {
                if (resp.result !== 'success') {
                    new Toast('Error', 'now', resp.error || 'Upload failed').show();
                    return;
                }
                applyUpload(resp.url, action, layerIdx, elIdx, file.name);
            },
            error: function () {
                new Toast('Error', 'now', 'Upload failed').show();
            }
        });
    }

    function applyUpload(url, action, layerIdx, elIdx, filename) {
        if (action === 'new-layer') {
            var depth = 0.5;
            if (editorState.layers.length > 0) {
                var lastDepth = editorState.layers[editorState.layers.length - 1].depth;
                depth = Math.max(0.05, lastDepth - 0.1);
            }
            var newIdx = editorState.layers.length;
            editorState.layers.push({
                depth: parseFloat(depth.toFixed(2)),
                name: filename ? filename.replace(/\.[^.]+$/, '') : 'Layer',
                elements: [{
                    image: url,
                    x: '-5%', y: '-5%',
                    width: '110%', height: '110%',
                    css: 'background-size:cover;background-position:center;border:none',
                    animation: '', animation_duration: ''
                }]
            });
            expandedLayers[newIdx] = true;
        } else if (action === 'replace-layer' && layerIdx !== undefined) {
            var layer = editorState.layers[layerIdx];
            if (layer.elements && layer.elements.length > 0) {
                layer.elements[0].image = url;
            }
        } else if (action === 'element' && layerIdx !== undefined) {
            if (!editorState.layers[layerIdx].elements) editorState.layers[layerIdx].elements = [];
            editorState.layers[layerIdx].elements.push({
                image: url,
                x: '30%', y: '20%',
                width: '30%', height: '30%',
                animation: '',
                animation_duration: '4s'
            });
            expandedLayers[layerIdx] = true;
        } else if (action === 'replace-element' && layerIdx !== undefined && elIdx !== undefined) {
            editorState.layers[layerIdx].elements[elIdx].image = url;
        } else if (action === 'add-child' && layerIdx !== undefined && elIdx !== undefined) {
            var parentEl = editorState.layers[layerIdx].elements[elIdx];
            if (!parentEl.children) parentEl.children = [];
            parentEl.children.push({
                image: url,
                x: '20%', y: '20%',
                width: '30%', height: '30%',
                animation: '',
                animation_duration: '4s'
            });
        } else if (action === 'replace-child' && layerIdx !== undefined && elIdx !== undefined) {
            var childTarget = editorState.layers[layerIdx].elements[elIdx].children;
            if (childTarget && childTarget[selectedChildIdx]) {
                childTarget[selectedChildIdx].image = url;
            }
        }
        markDirty();
        renderLayerTree(true);
        renderScene();

        // Auto-select newly added element/child so it's immediately editable
        if (action === 'element' && layerIdx !== undefined) {
            var newElIdx = editorState.layers[layerIdx].elements.length - 1;
            selectElement(layerIdx, newElIdx, true);
        } else if (action === 'add-child' && layerIdx !== undefined && elIdx !== undefined) {
            var pe = editorState.layers[layerIdx].elements[elIdx];
            if (pe && pe.children) selectChild(layerIdx, elIdx, pe.children.length - 1, true);
        } else if (action === 'new-layer') {
            selectLayer(editorState.layers.length - 1);
        }
    }

    // ── Save ──
    function showSlotPurchaseDialog(price, used, max, retryAction) {
        var body = '<div style="text-align:center;padding:0.5rem 0">' +
            '<div style="font-size:2rem;margin-bottom:0.5rem">🎨</div>' +
            '<p>' + (max === 1 ? 'Your free theme slot is full.' : 'All <b>' + max + '</b> theme slots are full (' + used + '/' + max + ').') + '</p>' +
            '<div class="liquid-rim" style="padding:0.75rem;border-radius:0.5rem;margin-bottom:0.75rem">' +
                '<div style="font-size:0.9rem"><b>Unlock slot #' + (max + 1) + '</b></div>' +
                '<div style="font-size:1.5rem;font-weight:700;margin:0.25rem 0">' + price + ' ⚡</div>' +
                '<div style="font-size:0.8rem;opacity:0.7">Next slot costs ' + Math.min(price + 50, 500) + ' ⚡ · Max 50 slots</div>' +
            '</div>' +
            '<p style="font-size:0.8rem;opacity:0.6">Or delete an existing theme to free up a slot.</p>' +
        '</div>';
        var d = new Dialog('Theme Slot Full', body, 'small');
        d.setButtons([
            { name: 'Cancel', class: 'btn btn-ghost', dismiss: true },
            { name: '⚡ Buy & Save', class: 'btn btn-primary', dismiss: true, onClick: function () {
                $.post('/api/app/user_theme_slot', function (resp) {
                    if (resp.result === 'success') {
                        new Toast('Unlocked', 'now', resp.message, { autohide: true, delay: 2000 }).show();
                        saveTheme(retryAction || 'save');
                    } else {
                        new Toast('Error', 'now', resp.error || 'Purchase failed').show();
                    }
                }).fail(function () { new Toast('Error', 'now', 'Purchase failed').show(); });
            }}
        ]);
        d.show();
    }

    function saveTheme(action, onSaved) {
        action = action || 'save';
        if (!editorState.name.trim()) {
            new Toast('Warning', 'now', 'Please enter a theme name', { autohide: true, delay: 3000 }).show();
            $('#te-title-input').focus();
            return;
        }
        if (editorState.layers.length === 0) {
            new Toast('Warning', 'now', 'Add at least one layer', { autohide: true, delay: 3000 }).show();
            return;
        }

        $('.te-save-action').prop('disabled', true);
        $('#te-save-btn').text('Saving...');

        var bgCover = document.querySelector('.bg-cover');
        if (bgCover && bgCover.offsetWidth && bgCover.offsetHeight) {
            editorState.design_ratio = parseFloat((bgCover.offsetWidth / bgCover.offsetHeight).toFixed(4));
        }

        captureThumbnail(function (thumbnailUrl) {
            var configData = {
                name: editorState.name,
                type: editorState.type,
                mode: 'element',
                scene: editorState.scene,
                blur: editorState.blur,
                layer_offset: editorState.layer_offset,
                design_ratio: editorState.design_ratio,
                layers: editorState.layers,
                accent: editorState.accent,
                forked_from: editorState.forked_from
            };
            if (thumbnailUrl) configData.thumbnail_url = thumbnailUrl;

            var payload = { config: JSON.stringify(configData) };
            if (editorState.theme_id) payload.theme_id = editorState.theme_id;

            $.post('/api/app/user_themes', payload, function (resp) {
                if (resp.result === 'success') {
                    editorState.dirty = false;
                    editorState.theme_id = resp.theme_id || editorState.theme_id;
                    $('#te-save-status').text('saved');
                    // Invalidate IndexedDB texture cache so next page load gets fresh textures
                    try { indexedDB.deleteDatabase('parallax_cache'); } catch (e) {}
                    // Update URL to edit mode so subsequent saves work
                    if (editorState.theme_id && window.history.replaceState) {
                        window.history.replaceState(null, '', '/theme/editor?edit=' + editorState.theme_id);
                    }

                    var thumbPreview = thumbnailUrl
                        ? '<img src="' + thumbnailUrl + '" style="width:100%;max-width:200px;border-radius:6px;margin-top:6px;display:block;">'
                        : '';

                    if (action === 'apply' || action === 'exit') {
                        $.get('/api/app/set_theme?id=custom:' + editorState.theme_id, function () {
                            var msg = (action === 'exit' ? 'Theme applied!' : 'Saved & applied') + thumbPreview;
                            new Toast('Saved', 'now', msg, { autohide: true, delay: thumbPreview ? 4000 : 2000 }).show();
                            if (action === 'exit') {
                                setTimeout(function () { window.location.href = '/dashboard'; }, 1200);
                            }
                        });
                    } else {
                        new Toast('Saved', 'now', 'Theme saved' + thumbPreview, { autohide: true, delay: thumbPreview ? 4000 : 2000 }).show();
                        if (typeof onSaved === 'function') onSaved();
                    }
                } else if (resp.code === 'slot_limit') {
                    showSlotPurchaseDialog(resp.next_price, resp.slots_used, resp.slots_max, action);
                } else {
                    new Toast('Error', 'now', resp.error || 'Save failed').show();
                }
            }).fail(function (xhr) {
                var resp = xhr.responseJSON || {};
                if (resp.code === 'slot_limit') {
                    showSlotPurchaseDialog(resp.next_price, resp.slots_used, resp.slots_max, action);
                } else {
                    new Toast('Error', 'now', resp.error || 'Save failed').show();
                }
            }).always(function () {
                $('.te-save-action').prop('disabled', false);
                $('#te-save-btn').text('Save');
            });
        });
    }

    function captureThumbnail(callback) {
        if (typeof html2canvas !== 'function') {
            callback(null);
            return;
        }
        var scene = document.getElementById('scene');
        if (!scene) { callback(null); return; }

        // Clean scene for screenshot: deselect, clear dim, remove handles, apply saved filter
        $('#scene .te-element').removeClass('selected te-parent-highlight').find('.te-handle').remove();
        var prevLayer = selectedLayerIdx, prevEl = selectedElementIdx, prevChild = selectedChildIdx;
        selectedElementIdx = null;
        selectedChildIdx = null;
        highlightDepth(null);
        applyActiveSceneFilter();

        var wasZen = zenMode;
        if (!wasZen) toggleZen(true);

        setTimeout(function () {
            html2canvas(scene, {
                scale: 0.5,
                useCORS: true,
                backgroundColor: editorState.scene.background_color || '#000',
                width: window.innerWidth,
                height: window.innerHeight
            }).then(function (fullCanvas) {
                if (!wasZen) toggleZen(false);
                // Restore selection and filter
                selectedLayerIdx = prevLayer;
                selectedElementIdx = prevEl;
                selectedChildIdx = prevChild;
                renderScene();

                // Scale full capture down to thumbnail, applying scene filter
                var thumb = document.createElement('canvas');
                thumb.width = 480;
                thumb.height = Math.round(480 * fullCanvas.height / fullCanvas.width);
                var ctx = thumb.getContext('2d');
                var isDark = document.documentElement.getAttribute('data-coreui-theme') === 'dark';
                var sf = isDark ? (editorState.scene.filter_dark || {}) : (editorState.scene.filter_light || {});
                var sat = sf.saturate != null ? sf.saturate : 100;
                var bri = sf.brightness != null ? sf.brightness : 100;
                var con = sf.contrast != null ? sf.contrast : 100;
                if (sat !== 100 || bri !== 100 || con !== 100) {
                    ctx.filter = 'saturate(' + sat + '%) brightness(' + bri + '%) contrast(' + con + '%)';
                }
                ctx.drawImage(fullCanvas, 0, 0, thumb.width, thumb.height);
                var canvas = thumb;

                canvas.toBlob(function (blob) {
                    if (!blob) { callback(null); return; }
                    var fd = new FormData();
                    fd.append('file', blob, 'thumbnail.jpg');
                    fd.append('theme_id', editorState.theme_id || 'draft');
                    $.ajax({
                        url: '/api/app/user_theme_upload',
                        method: 'POST',
                        data: fd,
                        processData: false,
                        contentType: false,
                        success: function (resp) {
                            callback(resp.result === 'success' ? resp.url : null);
                        },
                        error: function () { callback(null); }
                    });
                }, 'image/jpeg', 0.8);
            }).catch(function () {
                if (!wasZen) toggleZen(false);
                callback(null);
            });
        }, 300);
    }

    // ── Dirty state ──
    var undoTimer = null;
    var lastSnapshot = null;

    function captureSnapshot() {
        return JSON.stringify({
            layers: editorState.layers,
            scene: editorState.scene,
            blur: editorState.blur,
            layer_offset: editorState.layer_offset,
            design_ratio: editorState.design_ratio,
            type: editorState.type,
            name: editorState.name,
            accent: editorState.accent
        });
    }

    function restoreSnapshot(snapshot) {
        var data = JSON.parse(snapshot);
        editorState.layers = data.layers;
        editorState.scene = data.scene;
        editorState.blur = data.blur;
        editorState.layer_offset = data.layer_offset;
        editorState.design_ratio = data.design_ratio || 1.778;
        editorState.type = data.type;
        editorState.name = data.name;
        editorState.accent = data.accent;
    }

    function doUndo() {
        if (!undoStack.length) return;
        redoStack.push(captureSnapshot());
        restoreSnapshot(undoStack.pop());
        lastSnapshot = captureSnapshot();
        selectedElementIdx = null;
        selectedChildIdx = null;
        populateControls();
        renderLayerTree();
        debouncedRenderScene();
        showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
    }

    function doRedo() {
        if (!redoStack.length) return;
        undoStack.push(captureSnapshot());
        restoreSnapshot(redoStack.pop());
        lastSnapshot = captureSnapshot();
        selectedElementIdx = null;
        selectedChildIdx = null;
        populateControls();
        renderLayerTree();
        debouncedRenderScene();
        showPropsFor(selectedLayerIdx !== null ? 'layer' : null);
    }

    function markDirty() {
        // Push undo snapshot (debounced — rapid changes like slider drags batch into one undo step)
        if (!undoTimer) {
            var snap = lastSnapshot || captureSnapshot();
            undoStack.push(snap);
            if (undoStack.length > MAX_UNDO) undoStack.shift();
            redoStack = [];
        }
        clearTimeout(undoTimer);
        undoTimer = setTimeout(function () {
            undoTimer = null;
            lastSnapshot = captureSnapshot();
        }, 500);
        editorState.dirty = true;
        $('#te-save-status').text('unsaved');
    }

    // ── Util ──
    function hexToRgba(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha.toFixed(2) + ')';
    }

    function rgbaToHex(rgba) {
        var m = rgba.match(/[\d.]+/g);
        if (!m || m.length < 3) return '#000000';
        return '#' + [m[0], m[1], m[2]].map(function (c) {
            return ('0' + parseInt(c).toString(16)).slice(-2);
        }).join('');
    }

    function truncate(s, n) {
        return s.length > n ? s.substring(0, n) + '…' : s;
    }

    function isMac() {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    }

    function renderShortcutHints() {
        var mod = isMac() ? '⌘' : 'Ctrl+';
        $('#te-shortcuts').html(
            '<kbd>' + mod + 'Z</kbd> undo · ' +
            '<kbd>' + mod + '⇧Z</kbd> redo · ' +
            '<kbd>' + mod + 'D</kbd> dup · ' +
            '<kbd>' + mod + 'S</kbd> save · ' +
            '<kbd>Tab</kbd> zen · ' +
            '<kbd>Esc</kbd> deselect'
        );
    }

    function bindPanelDrag() {
        $('.te-panel').each(function () {
            var $panel = $(this);

            $panel.on('mousedown.tepanel', function (e) {
                if ($(e.target).closest('.te-btn, input, select, textarea, a, label, .te-chip, .te-toggle, .te-layer-row, .te-el-row, .te-child-row, .te-add-row, .te-layer-eye, .te-el-eye, .te-anim-chips, .swatch-circle, [type="color"], [type="range"]').length) return;
                // Don't intercept the native resize grip (bottom-right 18px corner)
                var rect = this.getBoundingClientRect();
                if (e.clientX > rect.right - 18 && e.clientY > rect.bottom - 18) return;
                e.preventDefault();
                var startX = e.clientX, startY = e.clientY;
                var panelEl = $panel[0];
                var rect = panelEl.getBoundingClientRect();
                var startLeft = rect.left;
                var startTop = rect.top;

                $panel.addClass('te-panel-dragged');
                panelEl.style.left = startLeft + 'px';
                panelEl.style.top = startTop + 'px';

                function onMove(ev) {
                    panelEl.style.left = (startLeft + ev.clientX - startX) + 'px';
                    panelEl.style.top = (startTop + ev.clientY - startY) + 'px';
                }
                function onUp() {
                    $(document).off('mousemove.tepanel mouseup.tepanel');
                    savePanelPositions();
                }
                $(document).on('mousemove.tepanel', onMove).on('mouseup.tepanel', onUp);
            });
        });
    }

    var panelSaveTimer = null;
    function savePanelPositions() {
        var positions = {};
        $('.te-panel').each(function () {
            var id = this.id;
            if (!id) return;
            var entry = {};
            if (this.classList.contains('te-panel-dragged')) {
                entry.left = this.style.left;
                entry.top = this.style.top;
            }
            var w = this.style.width || this.offsetWidth + 'px';
            if (parseInt(w) !== 300) entry.width = w;
            if (Object.keys(entry).length) positions[id] = entry;
        });
        clearTimeout(panelSaveTimer);
        panelSaveTimer = setTimeout(function () {
            $.post('/api/app/preferences', {
                preference_id: 'theme_editor_panels',
                value: JSON.stringify(positions)
            });
        }, 500);
    }

    function restorePanelPositions() {
        // Positions + widths are rendered server-side via inline styles
    }

    function observePanelResize() {
        if (!window.ResizeObserver) return;
        var ro = new ResizeObserver(function () { savePanelPositions(); });
        $('.te-panel').each(function () { ro.observe(this); });
    }

    function bindBeforeUnload() {
        window.addEventListener('beforeunload', function (e) {
            if (editorState.dirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    // ── Help dialog ──
    function showHelp() {
        $.get('/api/app/theme_help').done(function (html) {
            var d = new Dialog('Theme Editor Guide', html, 'xlarge');
            d.show();

            var $modal = $('#' + d.cloneId);
            var total = $modal.find('.te-help-section').length;
            var current = 0;

            function go(idx) {
                if (idx < 0 || idx >= total) return;
                current = idx;
                $modal.find('.te-help-nav-btn').removeClass('active').filter('[data-idx="' + idx + '"]').addClass('active');
                $modal.find('.te-help-section').removeClass('active').filter('[data-idx="' + idx + '"]').addClass('active');
                $modal.find('.te-help-prev').prop('disabled', idx === 0);
                $modal.find('.te-help-next').prop('disabled', idx === total - 1);
                $modal.find('.te-help-counter').text((idx + 1) + ' / ' + total);
                $modal.find('.te-help-nav-btn.active')[0].scrollIntoView({ block: 'nearest', inline: 'center' });
            }

            $modal.on('click', '.te-help-nav-btn', function () { go(parseInt($(this).data('idx'))); });
            $modal.on('click', '.te-help-prev', function () { go(current - 1); });
            $modal.on('click', '.te-help-next', function () { go(current + 1); });
        });
    }

    // ── Boot ──
    $(document).ready(init);
})();
