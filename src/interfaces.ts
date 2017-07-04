

export interface IColursChain extends IColursStyle {
  (): boolean;
  (str: string, isBrowser: boolean): string | any[];
  (str: string, ...args: any[]): string | any[];
}

export interface IColursStyle {

  // modifiers
  bold?: IColursChain;
  dim?: IColursChain;
  italic?: IColursChain;
  underline?: IColursChain;
  inverse?: IColursChain;
  hidden?: IColursChain;
  strikethrough?: IColursChain;

  // colors
  black?: IColursChain;
  red?: IColursChain;
  green?: IColursChain;
  yellow?: IColursChain;
  blue?: IColursChain;
  magenta?: IColursChain;
  cyan?: IColursChain;
  white?: IColursChain;
  gray?: IColursChain;
  grey?: IColursChain;

  // backgrounds
  bgBlack?: IColursChain;
  bgRed?: IColursChain;
  bgGreen?: IColursChain;
  bgYellow?: IColursChain;
  bgBlue?: IColursChain;
  bgMagenta?: IColursChain;
  bgCyan?: IColursChain;
  bgWhite?: IColursChain;
  bgGray?: IColursChain;
  bgGrey?: IColursChain;

  // bright
  // redBright?: IColursChain;
  // greenBright?: IColursChain;
  // yellowBright?: IColursChain;
  // blueBright?: IColursChain;
  // magentaBright?: IColursChain;
  // cyanBright?: IColursChain;
  // whiteBright?: IColursChain;

  // backgrounds bright
  // bgBlackBright?: IColursChain;
  // bgRedBright?: IColursChain;
  // bgGreenBright?: IColursChain;
  // bgYellowBright?: IColursChain;
  // bgBlueBright?: IColursChain;
  // bgMagentaBright?: IColursChain;
  // bgCyanBright?: IColursChain;
  // bgWhiteBright?: IColursChain;

}

export type AnsiTuple = [number, number];

export interface IAnsiStyles {

  bold?: AnsiTuple;
  italic?: AnsiTuple;
  underline?: AnsiTuple;
  inverse?: AnsiTuple;
  dim?: AnsiTuple;
  hidden?: AnsiTuple;
  strikethrough?: AnsiTuple;

  // colors
  black?: AnsiTuple;
  red?: AnsiTuple;
  green?: AnsiTuple;
  yellow?: AnsiTuple;
  blue?: AnsiTuple;
  magenta?: AnsiTuple;
  cyan?: AnsiTuple;
  white?: AnsiTuple;
  grey?: AnsiTuple;
  gray?: AnsiTuple;

  // backgrounds
  bgBlack?: AnsiTuple;
  bgRed?: AnsiTuple;
  bgGreen?: AnsiTuple;
  bgYellow?: AnsiTuple;
  bgBlue?: AnsiTuple;
  bgMagenta?: AnsiTuple;
  bgCyan?: AnsiTuple;
  bgWhite?: AnsiTuple;
  bgGray?: AnsiTuple;
  bgGrey?: AnsiTuple;

}

export interface ICssStyles {

  bold?: string;
  italic?: string;
  underline?: string;
  dim?: string;
  hidden?: string;
  strikethrough?: string;

  // colors
  black?: string;
  red?: string;
  green?: string;
  yellow?: string;
  blue?: string;
  magenta?: string;
  cyan?: string;
  white?: string;
  grey?: string;
  gray?: string;

  // background.
  bgBlack?: string;
  bgRed?: string;
  bgGreen?: string;
  bgYellow?: string;
  bgBlue?: string;
  bgMagenta?: string;
  bgCyan?: string;
  bgWhite?: string;
  bgGray?: string;
  bgGrey?: string;

}

export interface IColurOptions {
  enabled?: boolean;
  browser?: boolean;
  ansiStyles?: IAnsiStyles;
  cssStyles?: ICssStyles;
}

export interface IColursInstance {
  new(options?: IColurOptions): IColurs;
}

export interface IColurs extends IColursStyle {

  Colurs: IColursInstance;
  options: IColurOptions;

  setOption(key: any, val: any): void;
  strip(obj: any): any;
  applyAnsi(str: string, style: string | string[], isBrowser?: boolean): string | any[];
  applyHtml(str: string, style: string | string[]): string;
  toHtml(str: string): string;
  applyCss(str: string, style: string | string[]): any[];
  browser(state?: boolean): boolean;
  enabled(state?: boolean): boolean;

}
