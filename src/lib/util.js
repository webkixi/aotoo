import {
  merge,
  isObject,
  isArray,
  isString
} from "lodash";

import md5 from "md5";

export function isPromise (fn) {
  if (!!fn && typeof fn.then === 'function') {
    return true
  }
}

// export function isMobil(){}

export function isDomElement(obj) {
  return typeof obj == 'object' && obj.nodeType
}

// 定义一个对象内不被枚举的属性
// usage:  Object.defineProperty(obj, "key", protectProperty("static"));
export function protectProperty(value, opts) {
  var d = protectProperty.d || (
    protectProperty.d = {
      enumerable: false,
      writable: true,
      configurable: true,
      value: null
    }
  );
  if (isObject(opts)) {
    d = merge(d, opts)
  }
  if (value || value === 0) {
    d.value = value
  } else {
    d.value = undefined
  }
  return d;
}

export function isReactNative() {
  // return window.__BUNDLE_START_TIME__ ? false : true
  if (typeof process !== 'undefined') {
    return process.chdir ? false : true
  }
}

export function isClient() {
  return !isReactNative() && typeof window !== 'undefined'
}

export function isNode() {
  return (!isClient() && typeof process !== 'undefined' && process.chdir) ? true : false
}

export function curContext(params) {
  if (isClient()) {
    return window
  } else {
    return global
  }
}


export function sizeof(obj) {
  if (obj) {
    if (isArray(obj) || isString(obj)) return obj.length
    if (isObject(obj)) return Object.keys(obj).length
  }
}

export function forEach(obj, callback) {
  if (typeof obj == 'object') {
    if (isArray(obj)) {
      obj.forEach(function (item, ii) {
        callback(item, ii)
      })
    }

    if (isObject(obj)) {
      Object.keys(obj).forEach(function (key, ii) {
        callback(obj[key], ii, key)
      })
    }
  }
}

export const toArray = function (a) {
  if (!a) return [];
  if (a instanceof Array) return a;
  var arr = [],
    len = a.length;
  if (/string|number/.test(typeof a) || a instanceof Function || len === undefined) {
    arr[0] = a;
  } else {
    for (var i = 0; i < len; i++) {
      arr[i] = a[i];
    }
  }
  return arr;
}

export function noop() {}

// 方法是否为类
export function isClass(obj) {
  if (typeof obj != "function") return false;

  // async function or arrow function
  if (obj.prototype === undefined)
    return false;

  // generator function and malformed inheritance
  if (obj.prototype.constructor !== obj)
    return false;

  // has own prototype properties
  if (Object.getOwnPropertyNames(obj.prototype).length >= 2)
    return true;

  var str = String(obj);

  // ES6 class
  if (str.slice(0, 5) == "class")
    return true;

  // anonymous function
  if (/^function\s*\(|^function anonymous\(/.test(str))
    return false;

  var hasThis = /(call|apply|_classCallCheck)\(this(, arguments)?\)|\bthis(.\S+|\[.+?\])\s*(=|\()|=\s*this[,;]/.test(str);

  // Upper-cased first char of the name and has `this` in the body, or it's
  // a native class in ES5 style.
  if (/^function\s+[A-Z]/.test(str) && (hasThis ||
      (/\[native code\]/.test(str) &&
        obj.name !== "BigInt" && // ES6 BigInt and Symbol is not class
        obj.name !== "Symbol"
      )
    )) {
    return true;
  }

  // TypeScript anonymous class to ES5 with default export
  if (hasThis && obj.name === "default_1")
    return true;

  return false;
}

export {
  uniqueId,
  isString,
  isBoolean,
  isEmpty,
  isRegExp,
  isSymbol,
  isNumber,
  isArray,
  isObject,
  isPlainObject,
  isFunction,

  merge,
  find,
  findIndex,
  clone,
  cloneDeep,

  md5
} from 'lodash'