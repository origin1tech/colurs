

declare interface String {
  /**
   * Simple polyfill to simulate startsWith.
   *
   * @param suffix the suffix to inspect.
   */
  beginsWith(suffix): boolean;
}

String.prototype.beginsWith = function (suffix) {
  return this.indexOf(suffix, 0) === 0;
};

declare interface Object {

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

const hasAssign = ~Object.getOwnPropertyNames(Object).indexOf('assign');

Object.prototype.assign = function (target, ...sources: any[]) {
  if (hasAssign)
    return Object.assign(target, sources);
  target = target || {};
  sources.forEach((o) => {
    for (const p in o) {
      if (o.hasOwnProperty(p)) {
        if (typeof o[p] === 'object') {
          target[p] = Object.assign(target[p], o[p]);
        }
        else {
          target[p] = o[p];
        }
      }
    }
  });
  return target;

};