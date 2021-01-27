"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  isEvent: true,
  bindEvent: true,
  eventName: true,
  hooks: true,
  strlen: true,
  subcontent: true,
  urlTOquery: true,
  queryTOurl: true,
  get: true,
  set: true,
  find: true,
  update: true,
  camelCase: true
};
Object.defineProperty(exports, "eventName", {
  enumerable: true,
  get: function get() {
    return _index.eventName;
  }
});
Object.defineProperty(exports, "hooks", {
  enumerable: true,
  get: function get() {
    return _hooks.hooks;
  }
});
Object.defineProperty(exports, "strlen", {
  enumerable: true,
  get: function get() {
    return _string.strlen;
  }
});
Object.defineProperty(exports, "subcontent", {
  enumerable: true,
  get: function get() {
    return _string.subcontent;
  }
});
Object.defineProperty(exports, "urlTOquery", {
  enumerable: true,
  get: function get() {
    return _url.urlTOquery;
  }
});
Object.defineProperty(exports, "queryTOurl", {
  enumerable: true,
  get: function get() {
    return _url.queryTOurl;
  }
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function get() {
    return _lodash.get;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function get() {
    return _lodash.set;
  }
});
Object.defineProperty(exports, "find", {
  enumerable: true,
  get: function get() {
    return _lodash.find;
  }
});
Object.defineProperty(exports, "update", {
  enumerable: true,
  get: function get() {
    return _lodash.update;
  }
});
Object.defineProperty(exports, "camelCase", {
  enumerable: true,
  get: function get() {
    return _lodash.camelCase;
  }
});
exports.bindEvent = exports.isEvent = void 0;

var _index = require("../_common/index");

var _util = require("./util");

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
    }
  });
});

var _hooks = require("./hooks");

var _string = require("./string");

var _url = require("./url");

var _lodash = require("lodash");

var isEvent = _index.isEvents;
exports.isEvent = isEvent;
var bindEvent = _index.bindEvents;
exports.bindEvent = bindEvent;