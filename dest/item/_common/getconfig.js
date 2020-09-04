"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getConfig;

var lib = _interopRequireWildcard(require("../../lib"));

var _common = require("../../_common");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getConfig(opts, context) {
  var mydata = {};
  var myoptions = {};
  var attr = {};
  var config = {};
  var methods = {};
  var re = /\@[\w]+/g;

  if (lib.isString(opts) || lib.isNumber(opts)) {
    opts = {
      text: opts
    };
  }

  if (React.isValidElement(opts)) {
    opts = {
      title: opts
    };
  }

  Object.keys(opts).forEach(function (k) {
    var v = opts[k];

    if ((0, _common.isEvents)(k)) {
      mydata[k] = opts[k];
    } else if (k.indexOf('data-') > -1) {
      attr[k] = v;
    } else if (k.indexOf('@') === 0) {
      mydata[k] = v;
    } else if (_common.attrKey.indexOf(k) > -1) {
      mydata[k] = opts[k];
    } else {
      myoptions[k] = opts[k];
    }
  }); // if (opts.data) {
  //   config = opts
  // }

  if (mydata.methods) {
    for (var ky in mydata.methods) {
      myoptions[ky] = mydata.methods[ky];
    }

    delete mydata.methods;
  }

  attr = Object.assign({}, mydata.attr, attr, myoptions.attr);
  mydata.attr = attr;
  delete myoptions.attr;
  config = _objectSpread({
    data: mydata
  }, myoptions);
  return config;
}