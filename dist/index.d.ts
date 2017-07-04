import { IColurs, IColursInstance, IColurOptions } from './interfaces';
declare class Colurs implements IColurs {
    Colurs: IColursInstance;
    options: IColurOptions;
    constructor(options?: IColurOptions);
    /**
     * Start
     * Applies the starting style.
     *
     * @param style the starting style.
     */
    private start(style);
    /**
     * End
     * Applies the ending style.
     *
     * @param style the style to be applied.
     */
    private end(style);
    private getInverse(str, def?);
    private styleInstance(colurs, style);
    private log(type, ...args);
    /**
     * To Html
     * Returns ansi-html.
     */
    readonly toHtml: any;
    /**
     * Set Option
     * Sets an option(s) for the instance.
     *
     * @param key the key or object of options.
     * @param val the value to be set.
     */
    setOption(key: any, val?: any): void;
    /**
     * Style
     * Applies color and styles to string.
     *
     * @param obj the string to be styled.
     * @param style the style or array of styles to apply.
     * @param isBrowser indicates browser css styles should be returned.
     */
    applyAnsi(str: string, style: string | string[], isBrowser?: boolean): string | any[];
    /**
     * Apply Styles as HTML
     * Applies ANSI styles then converts to HTML.
     *
     * @param obj the value to be styled.
     * @param style the style(s) to be applied.
     */
    applyHtml(str: string, style: string | string[]): string;
    /**
     * To Styles
     * Gets css styles.
     *
     * @param str the string to parse styles for.
     * @param style the style or style names to be applied.
     */
    applyCss(str: string, style: string | string[]): any[];
    /**
     * Strip
     * Strips ansi colors from value.
     *
     * @param obj the object to strip color from.
     */
    strip(obj: any): any;
    /**
     * Enabled
     * Gets or set the enabled state.
     *
     * @param state the state to set.
     */
    enabled(state?: boolean): boolean;
    /**
     * Browser
     * Gets or set the browser state.
     *
     * @param state the state to set.
     */
    browser(state?: boolean): boolean;
}
declare function createInstance(options?: IColurOptions): IColurs;
export { createInstance as get, Colurs };
