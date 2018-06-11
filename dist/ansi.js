"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * see https://github.com/chalk/ansi-regex
 */
var STRIP_PATTERN = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');
exports.STRIP_EXP = new RegExp(STRIP_PATTERN, 'g');
var HAS_ANSI_PATTERN = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');
exports.HAS_ANSI_EXP = new RegExp(HAS_ANSI_PATTERN, 'g');
//# sourceMappingURL=ansi.js.map