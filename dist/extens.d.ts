interface String {
    /**
     * Simple polyfill to simulate startsWith.
     *
     * @param suffix the suffix to inspect.
     */
    beginsWith(suffix: any): boolean;
}
interface Object {
    /**
     * Polyfill for Object assign, this is not complete
     * only suits the purposes here.
     *
     * @param target the target to assign to.
     * @param source the source to assing from.
     */
    assign<T, U>(target: any, source: any): T & U;
    /**
     * Polyfill for Object assign, this is not complete
     * only suits the purposes here.
     *
     * @param target the target to assing to.
     * @param sources rest param of sources to assign to target.
     */
    assign<T>(target: any, ...sources: any[]): T;
}
declare const hasAssign: number;
