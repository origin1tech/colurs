
import { IColursChain, IColursStyle, IColurs, IColursInstance, IColurOptions, IAnsiStyles, ICssStyles } from './interfaces';
import * as toHtml from 'ansi-html';
import { stripexp as _stripExp } from './stripexp';

// prevents Typescript from complaining.
declare var window;
declare var module;

// CONSTANTS & DEFAULTS

const DOT_EXP = /\./g;
const IS_WIN_TERM = process.platform === 'win32' && !(process.env.TERM || '')
  .toLowerCase()
  .startsWith('xterm');

const ANSI_PATTERN = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');
const ANSI_EXP = new RegExp(ANSI_PATTERN, 'g');

let _enabled = true;
let _browser = false;

// Default options.
let _defaults: IColurOptions = {

  enabled: true,
  browser: false,

  ansiStyles: {

    // modifiers
    reset: [0, 0],
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
    bgGray: [47, 49], // fallback to white.
    bgGrey: [47, 49]

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
let _colorNames = [
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
let _bgColorNames = [
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

let levelMap = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan'
};

// Get array of each prop.
let _ansiKeys = Object.keys(_defaults.ansiStyles);
let _cssKeys = Object.keys(_defaults.cssStyles);
let prefix = '\x1B['; // '\u001B';

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

function isPlainObject(val: any) {
  if (typeof val === 'undefined')
    return false;
  return val ? val.constructor === {}.constructor : false;
}

function isUndefined(val: any) {
  return (typeof val === 'undefined');
}

// Don't be foolish and use this elsewhere
// suits purpose here but won't work for
// all cases!
function extend(obj, ...args: any[]) {
  obj = obj || {};
  args.forEach((o) => {
    for (let p in o) {
      if (o.hasOwnProperty(p)) {
        if (isPlainObject(o[p])) {
          obj[p] = extend(obj[p], o[p]);
        }
        else {
          obj[p] = o[p];
        }
      }
    }
  });
  return obj;
}

function contains(arr: string[], val: string): string {
  if (arr.indexOf(val) !== -1)
    return val;
  return undefined;
}

function containsAny(src: string[], vals: string[]): string {
  let i = vals.length;
  let found;
  while (i-- && !found) {
    if (contains(src, vals[i]))
      found = vals[i];
  }
  return found;
}

class ColursInstance implements IColurs {

  exp: RegExp = ANSI_EXP;
  options: IColurOptions;

  constructor(options?: IColurOptions) {

    options = options || {};
    if (isUndefined(options.browser) && !isNode())
      options.browser = true;

    this.options = extend({}, _defaults, options);

    // Iterate ansi keys and create
    // colurs styling instance.
    _ansiKeys.forEach((k) => {
      Object.defineProperty(this, k, {
        get() {
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
  private start(style: string): string {
    let code = this.options.ansiStyles[style][0];
    if (IS_WIN_TERM) {
      if (style === 'blue')
        code = 94;
      if (style === 'dim')
        return '';
    }
    return style ? `${prefix}${this.options.ansiStyles[style][0]}m` : '';
  }

  /**
   * End
   * Applies the ending style.
   *
   * @param style the style to be applied.
   */
  private end(style: string): string {
    return style ? `${prefix}${this.options.ansiStyles[style][1]}m` : '';
  }

  private getInverse(str: string, def?: string): string {

    let inv: any;
    const bgExp = /^bg/;
    const isBg = bgExp.test(str);

    if (!def) {
      if (isBg) def = this.options.cssStyles.gray;
      else def = this.options.cssStyles.bgGray;
    }

    if (!str)
      return def;

    // Inversing background color.
    if (isBg)
      inv = str.replace(bgExp, '');

    // Inversing color.
    else
      inv = 'bg' + str.charAt(0).toUpperCase() + str.slice(1);

    inv = this.options.cssStyles[inv];

    if (!inv)
      return def;

    return inv;

  }

  private styleInstance(colurs, style) {

    const self = this;
    const styles = [style];

    function c(str) {

      const args = [].slice.call(arguments, 1);
      const isBrowser = (typeof args[args.length - 1] === 'boolean') ? args.pop() : undefined;
      let result = colurs.applyAnsi(str, styles, isBrowser);

      // Add any additional args to array.
      if (Array.isArray(result))
        return result.concat(args);

      // Join any args add to string.
      return (args.length ? result + (' ' + args.join(' ')) : result);

    }

    // Iterate the keys building getters.
    _ansiKeys.forEach((k) => {
      Object.defineProperty(c, k, {
        get() {
          styles.push(k);
          return c;
        }
      });
    });

    return c;

  }

  private log(type: string, ...args: any[]): void {

    let color = levelMap[type];
    type = <string>this.applyAnsi(type, color) + ':';

    args.unshift(type);

    process.stderr.write(args.join(' ') + '\n');

  }

  /**
   * To Html
   * Returns ansi-html.
   */
  get toHtml() {
    return toHtml;
  }

  /**
   * Set Option
   * Sets an option(s) for the instance.
   *
   * @param key the key or object of options.
   * @param val the value to be set.
   */
  setOption(key: any, val?: any): void {

    let obj: IColurOptions = key;

    if (!isPlainObject(key)) {
      obj = {};
      obj[key] = val;
    }

    for (let p in obj) {

      if (obj.hasOwnProperty(p)) {

        // check if ansi or css styles.
        // if yes ensure valid keys then merge
        // from defaults.
        if (p === 'ansiStyles' || p === 'cssStyles') {

          const keys = Object.keys(obj[p]);

          keys.forEach((k) => {

            if (p === 'ansiStyles') {
              if (!contains(_ansiKeys, k)) {
                this.log('warn', `invalid ansi style ${k} was ignored.`);
                delete obj[p][k];
              }
            }

            else {
              if (!contains(_ansiKeys, k)) {
                this.log('warn', `invalid css style ${k} was ignored.`);
                delete obj[p][k];
              }
            }

          });

          // Ensure valid styles ansi styles.
          if (p === 'ansiStyles')
            obj[p] = extend({}, this.options.ansiStyles, obj[p]);

          // Ensure valid css styles.
          if (p === 'cssStyles')
            obj[p] = extend({}, this.options.cssStyles, obj[p]);

        }

        this.options[p] = obj[p];

      }

    }

  }

  /**
   * Has Ansi
   * Check if value has ansi styling.
   *
   * @param val the value to be inspected.
   */
  hasAnsi(val: any) {
    if (typeof val !== 'string')
      return false;
    return ANSI_EXP.test(val);
  }

  /**
   * Style
   * Applies color and styles to string.
   *
   * @param obj the string to be styled.
   * @param style the style or array of styles to apply.
   * @param isBrowser indicates browser css styles should be returned.
   */
  applyAnsi<T>(str: any, style: string | string[], isBrowser?: boolean): T | T[] {

    isBrowser = isUndefined(isBrowser) ? this.options.browser : isBrowser;

    if (!this.options.enabled) {
      if (isBrowser)
        return [str];
      return str;
    }

    // Ensure style is an array.
    if (!Array.isArray(style)) {

      if (DOT_EXP.test(style as string))
        style = (style as string).split('.');
      else
        style = <string[]>[style];

    }

    const hasColor = containsAny(_colorNames, style);
    const hasBgColor = containsAny(_bgColorNames, style);

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

        let color = hasBgColor ? hasBgColor.replace(/^bg/, '').toLowerCase() : 'black';
        let bgColor = hasColor ? 'bg' + hasColor.charAt(0).toUpperCase() + hasColor.slice(1) : 'bgGray';

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
    (style as string[]).forEach((s) => {
      str = `${this.start(s)}${str}${this.end(s)}`;
    });

    return str;

  }

  /**
   * Apply Styles as HTML
   * Applies ANSI styles then converts to HTML.
   *
   * @param obj the value to be styled.
   * @param style the style(s) to be applied.
   */
  applyHtml(str: any, style: string | string[]): string {
    return this.toHtml(this.applyAnsi(str, style, false));
  }

  /**
   * To Styles
   * Gets css styles.
   *
   * @param str the string to parse styles for.
   * @param style the style or style names to be applied.
   */
  applyCss(str: any, style: string | string[]): any[] {

    let _styles: any = [];

    if (_enabled === false)
      return [str];

    // Ensure style is an array.
    if (!Array.isArray(style)) {

      if (DOT_EXP.test(style as string))
        style = (style as string).split('.');
      else
        style = <string[]>[style];

    }

    // Check if we should inverse colors.
    if (~style.indexOf('inverse')) {

      const hasColor = containsAny(_colorNames, style);
      const hasBgColor = containsAny(_bgColorNames, style);

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

    (style as string[]).forEach((s) => {

      if (s !== 'inverse') {
        const _style = this.options.cssStyles[s];
        if (_style)
          _styles.push(_style);
      }

    });

    _styles = _styles.join(' ');
    _styles = ['%c ' + str, _styles];

    return _styles;

  }

  /**
   * Strip
   * Strips ansi colors from value.
   *
   * @param obj the object to strip color from.
   */
  strip(obj: any) {

    if (typeof obj === 'string')
      return obj.replace(_stripExp, '');

    // Iterate array check if "replace" exists.
    if (Array.isArray(obj)) {
      let i = obj.length;
      while (i--) {
        if (typeof obj[i].replace === 'function')
          obj[i] = obj[i].replace(_stripExp, '');
      }
      return obj;
    }

    // Iterate object check if prop's val has "replace".
    else if (isPlainObject(obj)) {
      for (let prop in obj) {
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

  }

  /**
   * Enabled
   * Gets or set the enabled state.
   *
   * @param state the state to set.
   */
  enabled(state?: boolean) {
    if (!state)
      return this.options.enabled;
    this.options.enabled = state;
  }

  /**
   * Browser
   * Gets or set the browser state.
   *
   * @param state the state to set.
   */
  browser(state?: boolean) {
    if (!state)
      return this.options.browser;
    this.options.browser = state;
  }

}

let instance: IColurs;

// Create default Colurs instance.
function createInstance(options?: IColurOptions): IColurs {
  if (!instance)
    instance = new ColursInstance(options);
  return instance;
}

// Expose Colurs for creating instances.
const Colurs: IColursInstance & IColurs = ColursInstance;

const get = (options?: IColurOptions) => {
  process.stderr.write('DEPRECATED: colurs.get() has been deprecated use colurs.init() instead.\n');
  return createInstance(options);
};

export { get, createInstance as init, Colurs };
