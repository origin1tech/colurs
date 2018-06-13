export interface IColursChain extends IColursStyle {
    (): boolean;
    (str: any, ...args: any[]): any;
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
    blackBright?: IColursChain;
    redBright?: IColursChain;
    greenBright?: IColursChain;
    yellowBright?: IColursChain;
    blueBright?: IColursChain;
    magentaBright?: IColursChain;
    cyanBright?: IColursChain;
    whiteBright?: IColursChain;
    bgBlackBright?: IColursChain;
    bgRedBright?: IColursChain;
    bgGreenBright?: IColursChain;
    bgYellowBright?: IColursChain;
    bgBlueBright?: IColursChain;
    bgMagentaBright?: IColursChain;
    bgCyanBright?: IColursChain;
    bgWhiteBright?: IColursChain;
}
export declare type AnsiTuple = number[];
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
    redBright: AnsiTuple;
    greenBright: AnsiTuple;
    yellowBright: AnsiTuple;
    blueBright: AnsiTuple;
    magentaBright: AnsiTuple;
    cyanBright: AnsiTuple;
    whiteBright: AnsiTuple;
    bgBlackBright?: AnsiTuple;
    bgRedBright?: AnsiTuple;
    bgGreenBright?: AnsiTuple;
    bgYellowBright?: AnsiTuple;
    bgBlueBright?: AnsiTuple;
    bgMagentaBright?: AnsiTuple;
    bgCyanBright?: AnsiTuple;
    bgWhiteBright?: AnsiTuple;
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
    blackBright: string;
    redBright: string;
    greenBright: string;
    yellowBright: string;
    blueBright: string;
    magentaBright: string;
    cyanBright: string;
    whiteBright: string;
    bgBlackBright?: string;
    bgRedBright?: string;
    bgGreenBright?: string;
    bgYellowBright?: string;
    bgBlueBright?: string;
    bgMagentaBright?: string;
    bgCyanBright?: string;
    bgWhiteBright?: string;
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
    /**
     * Colurs options.
     */
    options?: IColurOptions;
    /**
     * Enables setting options after init.
     *
     * @param key the key to set or object.
     * @param val the value to set if key is not an object.
     */
    setOption?(key: any, val: any): void;
    /**
     * Strips ansi styles from value.
     *
     * @param val the value to strip ansi styling from.
     */
    strip?(val: any): any;
    /**
     * Checks if value has any ansi styling.
     *
     * @param val the value to inspect.
     */
    hasAnsi?(val: any): boolean;
    /**
     * Apply ansi styling to value.
     *
     * @example .applyAnsi('foo', 'red');
     *
     * @param str the value to be styled.
     * @param style the style to be applied.
     */
    applyAnsi?(str: string, style: any): string;
    /**
     * Apply ansi styling to value.
     *
     * @example .applyAnsi('foo', ['red', 'bold']);
     *
     * @param str the value to be styled.
     * @param styles the styles to be applied.
     */
    applyAnsi?(str: string, styles: any[]): string;
    /**
     * Apply ansi styling to value.
     *
     * @example .applyAnsi('foo', 'red', true);
     *
     * @param str the value to be styled.
     * @param style the style to be applied.
     * @param isBrowser allows override to style for browser.
     */
    applyAnsi?(str: string, style: any, isBrowser: boolean): any[];
    /**
     * Apply ansi styling to value.
     *
     * @example .applyAnsi('foo', ['red', 'bold'], true);
     *
     * @param str the value to be styled.
     * @param styles the styles to be applied.
     * @param isBrowser allows override to style for browser.
     */
    applyAnsi?(str: string, styles: any[], isBrowser: boolean): any[];
    applyAnsi?(str: string, style: any | any[], isBrowser?: boolean): string | any[];
    /**
     * Applies styling for html output.
     *
     * @param str the value to apply html styles to.
     * @param style the style or styles to be applied.
     */
    applyHtml?(str: any, style: any | any[]): string;
    /**
     * Converts to html styling from ansi, simply a
     * convenience wrapper to ansi-html module.
     *
     * @param str the value to convert.
     */
    toHtml?(str: string): string;
    /**
     * Applies styling for css.
     *
     * @param str the value to apply css styling to.
     * @param style the style or styles to apply.
     */
    applyCss?(str: string, style: string | string[]): any[];
    /**
     * Toggles enable/disable of browser mode.
     *
     * @param state when true using browser mode.
     */
    browser?(state?: boolean): boolean;
    /**
     * Toggles state when false colorizing is disabled.
     *
     * @param state toggles the enabled state.
     */
    enabled?(state?: boolean): boolean;
}
