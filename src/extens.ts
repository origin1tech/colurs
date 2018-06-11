

declare interface String {
  beginsWith(suffix): boolean;
}

String.prototype.beginsWith = function (suffix) {
  return this.indexOf(suffix, 0) === 0;
};