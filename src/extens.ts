

interface String {
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