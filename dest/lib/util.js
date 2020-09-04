"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPromise = isPromise;
exports.isDomElement = isDomElement;
exports.protectProperty = protectProperty;
exports.isReactNative = isReactNative;
exports.isClient = isClient;
exports.isNode = isNode;
exports.curContext = curContext;
exports.sizeof = sizeof;
exports.forEach = forEach;
exports.noop = noop;
exports.isClass = isClass;
Object.defineProperty(exports, "uniqueId", {
  enumerable: true,
  get: function get() {
    return _lodash.uniqueId;
  }
});
Object.defineProperty(exports, "isString", {
  enumerable: true,
  get: function get() {
    return _lodash.isString;
  }
});
Object.defineProperty(exports, "isBoolean", {
  enumerable: true,
  get: function get() {
    return _lodash.isBoolean;
  }
});
Object.defineProperty(exports, "isEmpty", {
  enumerable: true,
  get: function get() {
    return _lodash.isEmpty;
  }
});
Object.defineProperty(exports, "isRegExp", {
  enumerable: true,
  get: function get() {
    return _lodash.isRegExp;
  }
});
Object.defineProperty(exports, "isSymbol", {
  enumerable: true,
  get: function get() {
    return _lodash.isSymbol;
  }
});
Object.defineProperty(exports, "isNumber", {
  enumerable: true,
  get: function get() {
    return _lodash.isNumber;
  }
});
Object.defineProperty(exports, "isArray", {
  enumerable: true,
  get: function get() {
    return _lodash.isArray;
  }
});
Object.defineProperty(exports, "isObject", {
  enumerable: true,
  get: function get() {
    return _lodash.isObject;
  }
});
Object.defineProperty(exports, "isPlainObject", {
  enumerable: true,
  get: function get() {
    return _lodash.isPlainObject;
  }
});
Object.defineProperty(exports, "isFunction", {
  enumerable: true,
  get: function get() {
    return _lodash.isFunction;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function get() {
    return _lodash.merge;
  }
});
Object.defineProperty(exports, "find", {
  enumerable: true,
  get: function get() {
    return _lodash.find;
  }
});
Object.defineProperty(exports, "findIndex", {
  enumerable: true,
  get: function get() {
    return _lodash.findIndex;
  }
});
Object.defineProperty(exports, "clone", {
  enumerable: true,
  get: function get() {
    return _lodash.clone;
  }
});
Object.defineProperty(exports, "cloneDeep", {
  enumerable: true,
  get: function get() {
    return _lodash.cloneDeep;
  }
});
exports.toArray = void 0;

var _lodash = require("lodash");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isPromise(fn) {
  if (!!fn && typeof fn.then === 'function') {
    return true;
  }
}

function isDomElement(obj) {
  return _typeof(obj) == 'object' && obj.nodeType;
} // 定义一个对象内不被枚举的属性
// usage:  Object.defineProperty(obj, "key", protectProperty("static"));


function protectProperty(value, opts) {
  var d = protectProperty.d || (protectProperty.d = {
    enumerable: false,
    writable: true,
    configurable: true,
    value: null
  });

  if ((0, _lodash.isObject)(opts)) {
    d = (0, _lodash.merge)(d, opts);
  }

  d.value = value || undefined;
  return d;
}

function isReactNative() {
  // return window.__BUNDLE_START_TIME__ ? false : true
  if (typeof process !== 'undefined') {
    return process.chdir ? false : true;
  }
}

function isClient() {
  return !isReactNative() && typeof window !== 'undefined';
}

function isNode() {
  return !isClient() && typeof process !== 'undefined' && process.chdir ? true : false;
}

function curContext(params) {
  if (isClient()) {
    return window;
  } else {
    return global;
  }
}

function sizeof(obj) {
  if (obj) {
    if ((0, _lodash.isArray)(obj) || (0, _lodash.isString)(obj)) return obj.length;
    if ((0, _lodash.isObject)(obj)) return Object.keys(obj).length;
  }
}

function forEach(obj, callback) {
  if (_typeof(obj) == 'object') {
    if ((0, _lodash.isArray)(obj)) {
      obj.forEach(function (item, ii) {
        callback(item, ii);
      });
    }

    if ((0, _lodash.isObject)(obj)) {
      Object.keys(obj).forEach(function (key, ii) {
        callback(obj[key], ii, key); // callback(key, ii, obj[key])
      });
    }
  }
}

var toArray = function toArray(a) {
  if (!a) return [];
  if (a instanceof Array) return a;
  var arr = [],
      len = a.length;

  if (/string|number/.test(_typeof(a)) || a instanceof Function || len === undefined) {
    arr[0] = a;
  } else {
    for (var i = 0; i < len; i++) {
      arr[i] = a[i];
    }
  }

  return arr;
};

exports.toArray = toArray;

function noop() {} // 方法是否为类


function isClass(obj) {
  if (typeof obj != "function") return false; // async function or arrow function

  if (obj.prototype === undefined) return false; // generator function and malformed inheritance

  if (obj.prototype.constructor !== obj) return false; // has own prototype properties

  if (Object.getOwnPropertyNames(obj.prototype).length >= 2) return true;
  var str = String(obj); // ES6 class

  if (str.slice(0, 5) == "class") return true; // anonymous function

  if (/^function\s*\(|^function anonymous\(/.test(str)) return false;
  var hasThis = /(call|apply|_classCallCheck)\(this(, arguments)?\)|\bthis(.\S+|\[.+?\])\s*(=|\()|=\s*this[,;]/.test(str); // Upper-cased first char of the name and has `this` in the body, or it's
  // a native class in ES5 style.

  if (/^function\s+[A-Z]/.test(str) && (hasThis || /\[native code\]/.test(str) && obj.name !== "BigInt" && // ES6 BigInt and Symbol is not class
  obj.name !== "Symbol")) {
    return true;
  } // TypeScript anonymous class to ES5 with default export


  if (hasThis && obj.name === "default_1") return true;
  return false;
}