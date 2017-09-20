"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * see https://github.com/chalk/ansi-regex
 */
var pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');
exports.stripexp = new RegExp(pattern, 'g');
//# sourceMappingURL=stripexp.js.map