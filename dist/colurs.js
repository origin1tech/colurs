"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./extens");
var toHtml = require("ansi-html");
var constants_1 = require("./constants");
// CONSTANTS & DEFAULTS
var DOT_EXP = /\./g;
var IS_WIN_TERM = process.platform === 'win32' && !(process.env.TERM || '')
    .toLowerCase()
    .beginsWith('xterm');
// Default options.
var DEFAULTS = {
    enabled: true,
    browser: false,
    ansiStyles: constants_1.ANSI_STYLES,
    cssStyles: constants_1.CSS_STYLES
};
var levelMap = {
    error: 'red',
    warn: 'yellow',
    info: 'cyan'
};
var PREFIX = '\x1B['; // '\u001B';
// HELPER METHODS
function isNode() {
    if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined')
        return true;
    return false;
}
function isPlainObject(val) {
    if (typeof val === 'undefined')
        return false;
    return val ? val.constructor === {}.constructor : false;
}
function isUndefined(val) {
    return (typeof val === 'undefined');
}
function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    target = target || {};
    sources.forEach(function (o) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                if (typeof o[p] === 'object') {
                    target[p] = assign(target[p], o[p]);
                }
                else {
                    target[p] = o[p];
                }
            }
        }
    });
    return target;
}
function contains(arr, val) {
    if (arr.indexOf(val) !== -1)
        return val;
    return undefined;
}
function containsAny(src, vals) {
    var i = vals.length;
    var found;
    while (i-- && !found) {
        if (contains(src, vals[i]))
            found = vals[i];
    }
    return found;
}
var ColursInstance = (function () {
    function ColursInstance(options) {
        var _this = this;
        options = options || {};
        if (isUndefined(options.browser) && !isNode())
            options.browser = true;
        this.options = assign({}, DEFAULTS, options);
        // Iterate ansi keys and create
        // colurs styling instance.
        constants_1.ANSI_STYLE_NAMES_ALL.forEach(function (k) {
            Object.defineProperty(_this, k, {
                get: function () {
                    return this.styleInstance(this, k);
                }
            });
        });
        if (!isNode())
            window.colurs = this;
    }
    /**
     * Start
     * Applies the starting style.
     *
     * @param style the starting style.
     */
    ColursInstance.prototype.start = function (style) {
        var code = this.options.ansiStyles[style][0];
        if (IS_WIN_TERM) {
            if (style === 'blue')
                code = 94;
            if (style === 'dim')
                return '';
        }
        return style ? "" + PREFIX + this.options.ansiStyles[style][0] + "m" : '';
    };
    /**
     * End
     * Applies the ending style.
     *
     * @param style the style to be applied.
     */
    ColursInstance.prototype.end = function (style) {
        return style ? "" + PREFIX + this.options.ansiStyles[style][1] + "m" : '';
    };
    ColursInstance.prototype.getInverse = function (str, def) {
        var inv;
        var bgExp = /^bg/;
        var isBg = bgExp.test(str);
        if (!def) {
            if (isBg)
                def = this.options.cssStyles.gray;
            else
                def = this.options.cssStyles.bgGray;
        }
        if (!str)
            return def;
        // Inversing background color.
        if (isBg)
            inv = str.replace(bgExp, '');
        else
            inv = 'bg' + str.charAt(0).toUpperCase() + str.slice(1);
        inv = this.options.cssStyles[inv];
        if (!inv)
            return def;
        return inv;
    };
    ColursInstance.prototype.styleInstance = function (colurs, style) {
        var self = this;
        var styles = [style];
        function c(str) {
            var args = [].slice.call(arguments, 1);
            var isBrowser = (typeof args[args.length - 1] === 'boolean') ? args.pop() : undefined;
            var result = colurs.applyAnsi(str, styles, isBrowser);
            // Add any additional args to array.
            if (Array.isArray(result))
                return result.concat(args);
            // Join any args add to string.
            return (args.length ? result + (' ' + args.join(' ')) : result);
        }
        // Iterate the keys building getters.
        constants_1.ANSI_STYLE_NAMES_ALL.forEach(function (k) {
            Object.defineProperty(c, k, {
                get: function () {
                    styles.push(k);
                    return c;
                }
            });
        });
        return c;
    };
    ColursInstance.prototype.log = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var color = levelMap[type];
        type = this.applyAnsi(type, color) + ':';
        args.unshift(type);
        process.stderr.write(args.join(' ') + '\n');
    };
    Object.defineProperty(ColursInstance.prototype, "toHtml", {
        /**
         * To Html
         * Returns ansi-html.
         */
        get: function () {
            return toHtml;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set Option
     * Sets an option(s) for the instance.
     *
     * @param key the key or object of options.
     * @param val the value to be set.
     */
    ColursInstance.prototype.setOption = function (key, val) {
        var _this = this;
        var obj = key;
        if (!isPlainObject(key)) {
            obj = {};
            obj[key] = val;
        }
        var _loop_1 = function (p) {
            if (obj.hasOwnProperty(p)) {
                // check if ansi or css styles.
                // if yes ensure valid keys then merge
                // from defaults.
                if (p === 'ansiStyles' || p === 'cssStyles') {
                    var keys = Object.keys(obj[p]);
                    keys.forEach(function (k) {
                        if (p === 'ansiStyles') {
                            if (!contains(constants_1.ANSI_STYLE_NAMES_ALL, k)) {
                                _this.log('warn', "invalid ansi style " + k + " was ignored.");
                                delete obj[p][k];
                            }
                        }
                        else {
                            if (!contains(constants_1.ANSI_STYLE_NAMES_ALL, k)) {
                                _this.log('warn', "invalid css style " + k + " was ignored.");
                                delete obj[p][k];
                            }
                        }
                    });
                    // Ensure valid styles ansi styles.
                    if (p === 'ansiStyles')
                        obj[p] = assign({}, this_1.options.ansiStyles, obj[p]);
                    // Ensure valid css styles.
                    if (p === 'cssStyles')
                        obj[p] = assign({}, this_1.options.cssStyles, obj[p]);
                }
                this_1.options[p] = obj[p];
            }
        };
        var this_1 = this;
        for (var p in obj) {
            _loop_1(p);
        }
    };
    /**
     * Has Ansi
     * Check if value has ansi styling.
     *
     * @param val the value to be inspected.
     */
    ColursInstance.prototype.hasAnsi = function (val) {
        if (typeof val !== 'string')
            return false;
        return constants_1.HAS_ANSI_EXP.test(val);
    };
    /**
     *
     */
    ColursInstance.prototype.applyAnsi = function (str, style, isBrowser) {
        var _this = this;
        isBrowser = isUndefined(isBrowser) ? this.options.browser : isBrowser;
        if (!this.options.enabled) {
            if (isBrowser)
                return [str];
            return str;
        }
        // Ensure style is an array.
        if (!Array.isArray(style)) {
            if (DOT_EXP.test(style))
                style = style.split('.');
            else
                style = [style];
        }
        var hasColor = containsAny(constants_1.ANSI_STYLE_NAMES, style);
        var hasBgColor = containsAny(constants_1.ANSI_STYLE_BG_NAMES, style);
        // When Browser return styles for formatting
        // with console.log.
        if (isBrowser)
            return this.applyCss(str, style);
        // Hijack inverse and handle manually
        // TODO: make common method for CSS and Terminal to handle this.
        if (~style.indexOf('inverse')) {
            if (hasColor || hasBgColor) {
                // Remove inverse and bgColor or color.
                style.splice(style.indexOf('inverse'), 1);
                if (hasColor)
                    style.splice(style.indexOf(hasColor), 1);
                if (hasBgColor)
                    style.splice(style.indexOf(hasBgColor), 1);
                var color = hasBgColor ? hasBgColor.replace(/^bg/, '').toLowerCase() : 'black';
                var bgColor = hasColor ? 'bg' + hasColor.charAt(0).toUpperCase() + hasColor.slice(1) : 'bgGray';
                if (bgColor !== 'bgGray' && color === 'black')
                    color = 'white';
                if (bgColor.replace(/^bg/, '').toLocaleLowerCase() === color) {
                    color = 'black';
                }
                // Add the new styles.
                style.push(bgColor);
                style.push(color);
            }
        }
        // Iterate and apply styles.
        style.forEach(function (s) {
            str = "" + _this.start(s) + str + _this.end(s);
        });
        return str;
    };
    /**
     * Apply Styles as HTML
     * Applies ANSI styles then converts to HTML.
     *
     * @param obj the value to be styled.
     * @param style the style(s) to be applied.
     */
    ColursInstance.prototype.applyHtml = function (str, style) {
        return this.toHtml(this.applyAnsi(str, style, false));
    };
    /**
     * To Styles
     * Gets css styles.
     *
     * @param str the string to parse styles for.
     * @param style the style or style names to be applied.
     */
    ColursInstance.prototype.applyCss = function (str, style) {
        var _this = this;
        var _styles = [];
        if (this.options.enabled === false)
            return [str];
        // Ensure style is an array.
        if (!Array.isArray(style)) {
            if (DOT_EXP.test(style))
                style = style.split('.');
            else
                style = [style];
        }
        // Check if we should inverse colors.
        if (~style.indexOf('inverse')) {
            var hasColor = containsAny(constants_1.ANSI_STYLE_NAMES, style);
            var hasBgColor = containsAny(constants_1.ANSI_STYLE_BG_NAMES, style);
            // If has color or bgColor inverse
            // it then remove from array.
            if (hasColor) {
                style.splice(style.indexOf(hasColor), 1);
                _styles.push(this.getInverse(hasColor));
            }
            if (hasBgColor) {
                style.splice(style.indexOf(hasBgColor), 1);
                _styles.push(this.getInverse(hasBgColor));
            }
            if (!hasBgColor && !hasColor)
                _styles.push(this.options.cssStyles.bgGray);
        }
        style.forEach(function (s) {
            if (s !== 'inverse') {
                var _style = _this.options.cssStyles[s];
                if (_style)
                    _styles.push(_style);
            }
        });
        _styles = _styles.join(' ');
        _styles = ['%c ' + str, _styles];
        return _styles;
    };
    /**
     * Strip
     * Strips ansi colors from value.
     *
     * @param obj the object to strip color from.
     */
    ColursInstance.prototype.strip = function (obj) {
        if (typeof obj === 'string')
            return obj.replace(constants_1.STRIP_EXP, '');
        // Iterate array check if "replace" exists.
        if (Array.isArray(obj)) {
            var i = obj.length;
            while (i--) {
                if (typeof obj[i].replace === 'function')
                    obj[i] = obj[i].replace(constants_1.STRIP_EXP, '');
            }
            return obj;
        }
        else if (isPlainObject(obj)) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (isPlainObject(obj[prop])) {
                        obj[prop] = this.strip(obj[prop]);
                    }
                    else {
                        if (typeof obj[prop].replace === 'function')
                            obj[prop] = obj[prop].replace(constants_1.STRIP_EXP, '');
                    }
                }
            }
        }
        return obj;
    };
    /**
     * Enabled
     * Gets or set the enabled state.
     *
     * @param state the state to set.
     */
    ColursInstance.prototype.enabled = function (state) {
        if (!state)
            return this.options.enabled;
        this.options.enabled = state;
    };
    /**
     * Browser
     * Gets or set the browser state.
     *
     * @param state the state to set.
     */
    ColursInstance.prototype.browser = function (state) {
        if (!state)
            return this.options.browser;
        this.options.browser = state;
    };
    return ColursInstance;
}());
var instance;
// Create default Colurs instance.
function createInstance(options) {
    if (!instance)
        instance = new ColursInstance(options);
    return instance;
}
exports.init = createInstance;
// Expose Colurs for creating instances.
var Colurs = ColursInstance;
exports.Colurs = Colurs;
var get = function (options) {
    process.stderr.write('DEPRECATED: colurs.get() has been deprecated use colurs.init() instead.\n');
    return createInstance(options);
};
exports.get = get;
//# sourceMappingURL=colurs.js.map