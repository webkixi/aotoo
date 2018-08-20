"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPlainObject = exports.filter = exports.findIndex = exports.find = exports.sax = exports.cloneDeep = exports.merge = exports.isServer = exports.isClient = exports.isReactNative = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.noop = noop;
exports.uniqueId = uniqueId;
exports.objTypeof = objTypeof;
exports.isDomElement = isDomElement;
exports.protectProperty = protectProperty;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.isString = isString;
exports.sizeof = sizeof;
exports.forEach = forEach;
exports.arr2json = arr2json;
exports.deepFind = deepFind;

var _lodash = require("lodash");

var _aotooeventemitter = require("./aotooeventemitter");

var uuid = 1;
function noop() {}
function uniqueId(prefix) {
  if (!prefix) prefix = 'random_';
  uuid++;
  return prefix + uuid;
}

function objTypeof(object) {
  return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

function isDomElement(obj) {
  return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == 'object' && obj.nodeType;
}

// 循环使用同一对象
// usage:  Object.defineProperty(obj, "key", protectProperty("static"));
function protectProperty(value, opts) {
  var d = protectProperty.d || (protectProperty.d = {
    enumerable: false,
    writable: true,
    configurable: true,
    value: null
  });
  if (isObject(opts)) {
    d = (0, _lodash.merge)(d, opts);
  }
  d.value = value || undefined;
  return d;
}
// ... 并且 ...

function _isReactNative(params) {
  // return window.__BUNDLE_START_TIME__ ? false : true
  if (typeof process !== 'undefined') {
    return process.chdir ? false : true;
  }
}
var isReactNative = exports.isReactNative = _isReactNative();

function _isClient() {
  return !isReactNative && typeof window !== 'undefined';
}
var isClient = exports.isClient = _isClient();

function _isServer() {
  // return !isClient && typeof process !== 'undefined' && process.title == 'node'
  return !isClient && typeof process !== 'undefined' && process.chdir ? true : false;
}
var isServer = exports.isServer = _isServer();

function isArray(obj) {
  return objTypeof(obj) == 'Array';
}

function isObject(obj) {
  return objTypeof(obj) == 'Object';
}

function isFunction(obj) {
  return objTypeof(obj) == 'Function';
}

function isString(obj) {
  return objTypeof(obj) == 'String';
}

function sizeof(obj) {
  if (obj) {
    if (isArray(obj) || isString(obj)) return obj.length;
    if (isObject(obj)) return Object.keys(obj).length;
  }
}

exports.merge = _lodash.merge;
// export function merge(obj) {
//   var i = 1
//     , target
//     , key;

//   for (; i < arguments.length; i++) {
//     target = arguments[i];
//     for (key in target) {
//       if (Object.prototype.hasOwnProperty.call(target, key)) {
//         obj[key] = target[key];
//       }
//     }
//   }
//   return obj;
// }

function forEach(obj, callback) {
  if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == 'object') {
    if (isArray(obj)) {
      obj.forEach(function (item, ii) {
        callback(ii, item);
      });
    }

    if (isObject(obj)) {
      Object.keys(obj).forEach(function (item, ii) {
        callback(item, ii, obj[item]);
      });
    }
  }
}

function arr2json(obj) {
  var tmp = {};
  if (isArray(obj)) {
    forEach(obj, function (ii, item) {
      tmp[ii] = item;
    });
    return tmp;
  }
}

function deepFind(obj, key) {
  var findout = {};
  var findKey = false;
  var mykey = key.split('->');
  if (mykey.length > 1) {
    for (var jj = 0; jj < mykey.length; jj++) {
      var property = mykey[jj];
      findout = jj == 0 ? obj[property] : findout[property];
      if (!findout) break;
    }
  } else {
    key = mykey[0];
    findout = obj[key];
  }
  findKey = findout ? true : false;
  return findout;
}

// export function find(collection, callback, forindex) {
//   if (isObject(callback) || isString(callback) || isArray(callback)) {
//     if (isString(callback)) {
//       callback = [callback]
//     }
//     if (isArray(callback)) {
//       var tmp = {}
//       for(var ii=0; ii<callback.length; ii++) {
//         if (ii%2==0) {
//           tmp[callback[ii]] = callback[(ii+1)]||true
//         } else{
//           continue;
//         }
//       }
//       callback = tmp
//     }

//     var select = {}
//     var selected = []
//     for (let index=0; index<collection.length; index++) {
//       let o = collection[index]
//       forEach(callback, function(key, ii) {
//         if (o[key] == callback[key]) {
//           select[index] = true
//         } else if(callback[key]==true&&o[key]){
//           select[index] = true
//         } else {
//           select[index] = false
//         }
//       })
//       if (select[index]) break;
//     }

//     if (sizeof(select)) {
//       forEach(select, function (_index, ii) {
//         if (select[_index]) selected.push(_index)
//       })
//       if (selected.length) {
//         if (forindex) return selected[0]
//         return collection[selected[0]]
//       }
//     }
//   }
// }

// export function findIndex(collection, callback) {
//   return find(collection, callback, true)
// }

// export function filter(collection, callback) {
//   return collection.filter(callback)
// }

exports.cloneDeep = _lodash.cloneDeep;
exports.sax = _aotooeventemitter.sax;
exports.find = _lodash.find;
exports.findIndex = _lodash.findIndex;
exports.filter = _lodash.filter;
exports.isPlainObject = _lodash.isPlainObject;
//# sourceMappingURL=../../maps/suba/lib/util.js.map
