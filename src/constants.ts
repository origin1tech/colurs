
import './extens';

/**
 * see https://github.com/chalk/ansi-regex
 * Chalk typings don't seem stable at the moment
 * at least and why this module exists.
 */
export const STRIP_PATTERN = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');

export const STRIP_EXP = new RegExp(STRIP_PATTERN, 'g');

export const HAS_ANSI_PATTERN = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');

export const HAS_ANSI_EXP = new RegExp(HAS_ANSI_PATTERN, 'g');

export const ANSI_STYLES = {

  // modifiers
  reset: [0, 0],
  inverse: [7, 27],
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
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
  bgGrey: [47, 49],

  // bright
  blackBright: [30, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],

  // backgrounds bright
  bgBlackBright: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49]

};

export const CSS_STYLES = {

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
  bgGrey: 'background: #888',

  // bright
  blackBright: 'color: #000;',
  redBright: 'color: #FF0000;',
  greenBright: 'color: #209805;',
  yellowBright: 'color: #e8bf03;',
  blueBright: 'color: #0000ff;',
  magentaBright: 'color: #ff00ff;',
  cyanBright: 'color: #00ffee;',
  whiteBright: 'color: #F0F0F0;',

  // background bright.
  bgBlackBright: 'background: #000;',
  bgRedBright: 'background: #FF0000;',
  bgGreenBright: 'background: #209805;',
  bgYellowBright: 'background: #e8bf03;',
  bgBlueBright: 'background: #0000ff;',
  bgMagentaBright: 'background: #ff00ff;',
  bgCyanBright: 'background: #00ffee;',
  bgWhiteBright: 'background: #F0F0F0;'

};

export const ANSI_STYLE_NAMES =
  Object.keys(ANSI_STYLES).filter(v => !v.beginsWith('bg'));

export const ANSI_STYLE_BG_NAMES =
  Object.keys(ANSI_STYLES).filter(v => v.beginsWith('bg'));

export const CSS_STYLE_NAMES =
  Object.keys(CSS_STYLES).filter(v => !v.beginsWith('bg'));

export const CSS_STYLE_BG_NAMES =
  Object.keys(CSS_STYLES).filter(v => v.beginsWith('bg'));

export const ANSI_STYLE_NAMES_ALL = [...ANSI_STYLE_NAMES, ...ANSI_STYLE_BG_NAMES];
export const CSS_STYLE_NAMES_ALL = [...CSS_STYLE_NAMES, ...CSS_STYLE_BG_NAMES];
