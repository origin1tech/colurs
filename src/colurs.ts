import './extens';
import { IColurs, IColursInstance, IColurOptions, IAnsiStyles } from './interfaces';
import * as toHtml from 'ansi-html';
import * as assign from 'object-assign';
import { STRIP_EXP, HAS_ANSI_EXP, ANSI_STYLE_NAMES as STYLE_NAMES, ANSI_STYLE_NAMES_ALL as ANSI_KEYS, ANSI_STYLES, CSS_STYLE_NAMES, CSS_STYLES, ANSI_STYLE_BG_NAMES as BG_STYLE_NAMES } from './constants';

// declare these for build.
declare var window;
declare var module;

// CONSTANTS & DEFAULTS

const DOT_EXP = /\./g;
const IS_WIN_TERM = process.platform === 'win32' && !(process.env.TERM || '')
  .toLowerCase()
  .beginsWith('xterm');

// Default options.
const DEFAULTS: IColurOptions = {
  enabled: true,
  browser: false,
  ansiStyles: ANSI_STYLES,
  cssStyles: CSS_STYLES
};

let levelMap = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan'
};

const PREFIX = '\x1B[';

// HELPER METHODS

function isNode() {
  if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined')
    return true;
  return false;
}

function isPlainObject(val: any) {
  if (typeof val === 'undefined')
    return false;
  return val ? val.constructor === {}.constructor : false;
}

function isUndefined(val: any) {
  return (typeof val === 'undefined');
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

  options: IColurOptions;

  constructor(options?: IColurOptions) {

    options = options || {};
    if (isUndefined(options.browser) && !isNode())
      options.browser = true;

    this.options = assign({}, DEFAULTS, options);

    // Iterate ansi keys and create
    // colurs styling instance.
    ANSI_KEYS.forEach((k) => {
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
    const tuple = this.options.ansiStyles[style];
    if (IS_WIN_TERM) {
      if (style === 'dim')
        return '';
      if (style === 'blue')
        tuple[0] = 94;
    }
    return style ? `${PREFIX}${tuple[0]}m` : '';
  }

  /**
   * End
   * Applies the ending style.
   *
   * @param style the style to be applied.
   */
  private end(style: string): string {
    return style ? `${PREFIX}${this.options.ansiStyles[style][1]}m` : '';
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
    ANSI_KEYS.forEach((k) => {
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
              if (!contains(ANSI_KEYS, k)) {
                this.log('warn', `invalid ansi style ${k} was ignored.`);
                delete obj[p][k];
              }
            }

            else {
              if (!contains(ANSI_KEYS, k)) {
                this.log('warn', `invalid css style ${k} was ignored.`);
                delete obj[p][k];
              }
            }

          });

          // Ensure valid styles ansi styles.
          if (p === 'ansiStyles')
            obj[p] = assign({}, this.options.ansiStyles, obj[p]);

          // Ensure valid css styles.
          if (p === 'cssStyles')
            obj[p] = assign({}, this.options.cssStyles, obj[p]);

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
    return HAS_ANSI_EXP.test(val);
  }

  /**
   *
   */
  applyAnsi(str: any, style: any | any[], isBrowser?: boolean): any | any[] {

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

    const hasColor = containsAny(STYLE_NAMES, style);
    const hasBgColor = containsAny(BG_STYLE_NAMES, style);

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

    if (this.options.enabled === false)
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

      const hasColor = containsAny(STYLE_NAMES, style);
      const hasBgColor = containsAny(BG_STYLE_NAMES, style);

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
      return obj.replace(STRIP_EXP, '');

    // Iterate array check if "replace" exists.
    if (Array.isArray(obj)) {
      let i = obj.length;
      while (i--) {
        if (typeof obj[i].replace === 'function')
          obj[i] = obj[i].replace(STRIP_EXP, '');
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
              obj[prop] = obj[prop].replace(STRIP_EXP, '');
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
    if (typeof state === 'undefined')
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
