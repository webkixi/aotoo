"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aotooEventEmitter = exports.createCombinClass = exports.CombineClass = exports.combineX = exports.wrap = undefined;

var _wrap = require("./wrap");

Object.defineProperty(exports, "wrap", {
  enumerable: true,
  get: function get() {
    return _wrap.wrap;
  }
});
Object.defineProperty(exports, "combineX", {
  enumerable: true,
  get: function get() {
    return _wrap.combineX;
  }
});

var _aotooeventemitter = require("./aotooeventemitter");

var _aotooeventemitter2 = _interopRequireDefault(_aotooeventemitter);

var _combineclass = require("./combineclass");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CombineClass = _combineclass.CombineClass;
exports.createCombinClass = _combineclass.createCombinClass;
exports.aotooEventEmitter = _aotooeventemitter2.default;
// export function createCombinClass(rctCls, acts = {}, config, embeds) {
//   return new CombineClass(rctCls, acts, config, embeds)
// }
//# sourceMappingURL=../../maps/suba/lib/aotoocombinx.js.map
