export interface IColursChain extends IColursStyle {
    (): boolean;
    (str: string, isBrowser: boolean): string | any[];
    (str: string, ...args: any[]): string | any[];
}
export interface IColursStyle {
    reset?: IColursChain;
    bold?: IColursChain;
    dim?: IColursChain;
    italic?: IColursChain;
    underline?: IColursChain;
    inverse?: IColursChain;
    hidden?: IColursChain;
    strikethrough?: IColursChain;
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
}
export declare type AnsiTuple = [number, number];
export interface IAnsiStyles {
    reset?: AnsiTuple;
    bold?: AnsiTuple;
    italic?: AnsiTuple;
    underline?: AnsiTuple;
    inverse?: AnsiTuple;
    dim?: AnsiTuple;
    hidden?: AnsiTuple;
    strikethrough?: AnsiTuple;
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
    new (options?: IColurOptions): IColurs;
}
export interface IColurs extends IColursStyle {
    options?: IColurOptions;
    setOption?(key: any, val: any): void;
    strip?(obj: any): any;
    applyAnsi?(str: string, style: string | string[], isBrowser?: boolean): string | any[];
    applyHtml?(str: string, style: string | string[]): string;
    toHtml?(str: string): string;
    applyCss?(str: string, style: string | string[]): any[];
    browser?(state?: boolean): boolean;
    enabled?(state?: boolean): boolean;
}
