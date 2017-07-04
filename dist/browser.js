(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toHtml = require("ansi-html");
// CONSTANTS & DEFAULTS
var _enabled = true;
var _browser = false;
var _dotExp = /\./g;
var _stripExp = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
// Default options.
var _defaults = {
    enabled: true,
    browser: false,
    ansiStyles: {
        // modifiers
        bold: [1, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        dim: [2, 22],
        hidden: [8, 28],
        strikethrough: [9, 29],
        // colors
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        grey: [90, 39],
        gray: [90, 39],
        // backgrounds
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgGray: [90, 39],
        bgGrey: [90, 39]
        // bright
        // redBright: [91, 39],
        // greenBright: [92, 39],
        // yellowBright: [93, 39],
        // blueBright: [94, 39],
        // magentaBright: [95, 39],
        // cyanBright: [96, 39],
        // whiteBright: [97, 39],
        // backgrounds bright
        // bgBlackBright: [100, 49],
        // bgRedBright: [101, 49],
        // bgGreenBright: [102, 49],
        // bgYellowBright: [103, 49],
        // bgBlueBright: [104, 49],
        // bgMagentaBright: [105, 49],
        // bgCyanBright: [106, 49],
        // bgWhiteBright: [107, 49]
    },
    cssStyles: {
        // modifiers
        bold: 'font-weight: bold;',
        italic: 'font-style: italic;',
        underline: 'text-decoration: underline;',
        dim: 'opacity:0.5;',
        hidden: 'display: none;',
        strikethrough: 'text-decoration: line-through;',
        // colors
        black: 'color: #000;',
        red: 'color: #FF0000;',
        green: 'color: #209805;',
        yellow: 'color: #e8bf03;',
        blue: 'color: #0000ff;',
        magenta: 'color: #ff00ff;',
        cyan: 'color: #00ffee;',
        white: 'color: #F0F0F0;',
        grey: 'color: #888;',
        gray: 'color: #888;',
        // background.
        bgBlack: 'background: #000;',
        bgRed: 'background: #FF0000;',
        bgGreen: 'background: #209805;',
        bgYellow: 'background: #e8bf03;',
        bgBlue: 'background: #0000ff;',
        bgMagenta: 'background: #ff00ff;',
        bgCyan: 'background: #00ffee;',
        bgWhite: 'background: #F0F0F0;',
        bgGray: 'background: #888;',
        bgGrey: 'background: #888'
        // bright
        // blackBright: 'color: #000;',
        // redBright: 'color: #FF0000;',
        // greenBright: 'color: #209805;',
        // yellowBright: 'color: #e8bf03;',
        // blueBright: 'color: #0000ff;',
        // magentaBright: 'color: #ff00ff;',
        // cyanBright: 'color: #00ffee;',
        // whiteBright: 'color: #F0F0F0;',
        // background bright.
        // bgBlackBright: 'background: #000;',
        // bgRedBright: 'background: #FF0000;',
        // bgGreeBrightn: 'background: #209805;',
        // bgYellowBright: 'background: #e8bf03;',
        // bgBlueBright: 'background: #0000ff;',
        // bgMagentaBright: 'background: #ff00ff;',
        // bgCyanBright: 'background: #00ffee;',
        // bgWhiteBright: 'background: #F0F0F0;',
    }
};
// Array of color names.
var _colorNames = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'grey',
    'gray',
];
// Array of background color names.
var _bgColorNames = [
    'bgBlack',
    'bgRed',
    'bgGreen',
    'bgYellow',
    'bgBlue',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'bgGray',
    'bgGrey'
];
var levelMap = {
    error: 'red',
    warn: 'yellow',
    info: 'cyan'
};
// Get array of each prop.
var _ansiKeys = Object.keys(_defaults.ansiStyles);
var _cssKeys = Object.keys(_defaults.cssStyles);
// HELPER METHODS
function isNode() {
    if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined')
        return true;
    return false;
}
// Cheesy clone but works fine here
// prevents need for another dep.
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function isPlainObject(val) {
    if (typeof val === 'undefined')
        return false;
    return val ? val.constructor === {}.constructor : false;
}
function isUndefined(val) {
    return (typeof val === 'undefined');
}
// Don't be foolish and use this elsewhere
// suits purpose here but won't work for
// all cases!
function extend(obj) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    args.forEach(function (o) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                if (isPlainObject(o[p])) {
                    obj[p] = extend(o[p]);
                }
                else {
                    obj[p] = o[p];
                }
            }
        }
    });
    return obj;
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
var Colurs = (function () {
    function Colurs(options) {
        var _this = this;
        this.Colurs = Colurs;
        options = options || {};
        if (isUndefined(options.browser) && !isNode())
            options.browser = true;
        this.options = extend({}, _defaults, options);
        // Iterate ansi keys and create
        // colurs styling instance.
        _ansiKeys.forEach(function (k) {
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
    Colurs.prototype.start = function (style) {
        return style ? "\u001B[" + this.options.ansiStyles[style][0] + "m" : '';
    };
    /**
     * End
     * Applies the ending style.
     *
     * @param style the style to be applied.
     */
    Colurs.prototype.end = function (style) {
        return style ? "\u001B[" + this.options.ansiStyles[style][1] + "m" : '';
    };
    Colurs.prototype.getInverse = function (str, def) {
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
    Colurs.prototype.styleInstance = function (colurs, style) {
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
        _ansiKeys.forEach(function (k) {
            Object.defineProperty(c, k, {
                get: function () {
                    styles.push(k);
                    return c;
                }
            });
        });
        return c;
    };
    Colurs.prototype.log = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var color = levelMap[type];
        type = this.applyAnsi(type, color) + ':';
        args.unshift(type);
        console.log.apply(console, args);
    };
    Object.defineProperty(Colurs.prototype, "toHtml", {
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
    Colurs.prototype.setOption = function (key, val) {
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
                            if (!contains(_ansiKeys, k)) {
                                _this.log('warn', "invalid ansi style " + k + " was ignored.");
                                delete obj[p][k];
                            }
                        }
                        else {
                            if (!contains(_ansiKeys, k)) {
                                _this.log('warn', "invalid css style " + k + " was ignored.");
                                delete obj[p][k];
                            }
                        }
                    });
                    // Ensure valid styles ansi styles.
                    if (p === 'ansiStyles')
                        obj[p] = extend({}, this_1.options.ansiStyles, obj[p]);
                    // Ensure valid css styles.
                    if (p === 'cssStyles')
                        obj[p] = extend({}, this_1.options.cssStyles, obj[p]);
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
     * Style
     * Applies color and styles to string.
     *
     * @param obj the string to be styled.
     * @param style the style or array of styles to apply.
     * @param isBrowser indicates browser css styles should be returned.
     */
    Colurs.prototype.applyAnsi = function (str, style, isBrowser) {
        var _this = this;
        isBrowser = isUndefined(isBrowser) ? this.options.browser : isBrowser;
        if (!this.options.enabled) {
            if (isBrowser)
                return [str];
            return str;
        }
        // Ensure style is an array.
        if (!Array.isArray(style)) {
            if (_dotExp.test(style))
                style = style.split('.');
            else
                style = [style];
        }
        // When Browser return styles for formatting
        // with console.log.
        if (isBrowser)
            return this.applyCss(str, style);
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
    Colurs.prototype.applyHtml = function (str, style) {
        return this.toHtml(this.applyAnsi(str, style, false));
    };
    /**
     * To Styles
     * Gets css styles.
     *
     * @param str the string to parse styles for.
     * @param style the style or style names to be applied.
     */
    Colurs.prototype.applyCss = function (str, style) {
        var _this = this;
        var _styles = [];
        if (_enabled === false)
            return [str];
        // Ensure style is an array.
        if (!Array.isArray(style)) {
            if (_dotExp.test(style))
                style = style.split('.');
            else
                style = [style];
        }
        // Check if we should inverse colors.
        if (style.indexOf('inverse') !== -1) {
            var hasColor = containsAny(_colorNames, style);
            var hasBgColor = containsAny(_bgColorNames, style);
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
    Colurs.prototype.strip = function (obj) {
        if (typeof obj === 'string')
            return obj.replace(_stripExp, '');
        // Iterate array check if "replace" exists.
        if (Array.isArray(obj)) {
            var i = obj.length;
            while (i--) {
                if (typeof obj[i].replace === 'function')
                    obj[i] = obj[i].replace(_stripExp, '');
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
                            obj[prop] = obj[prop].replace(_stripExp, '');
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
    Colurs.prototype.enabled = function (state) {
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
    Colurs.prototype.browser = function (state) {
        if (!state)
            return this.options.browser;
        this.options.browser = state;
    };
    return Colurs;
}());
exports.Colurs = Colurs;
// Makes type definitions play a little nicer
// avoiding private class not exported error.
function createInstance(options) {
    return new Colurs(options);
}
exports.get = createInstance;

},{"ansi-html":2}],2:[function(require,module,exports){
'use strict'

module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()

},{}]},{},[1]);
