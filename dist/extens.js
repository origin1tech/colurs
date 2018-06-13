String.prototype.beginsWith = function (suffix) {
    return this.indexOf(suffix, 0) === 0;
};
var hasAssign = ~Object.getOwnPropertyNames(Object).indexOf('assign');
Object.prototype.assign = function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (hasAssign)
        return Object.assign(target, sources);
    target = target || {};
    sources.forEach(function (o) {
        for (var p in o) {
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
//# sourceMappingURL=extens.js.map