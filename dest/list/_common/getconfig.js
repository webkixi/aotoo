"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachItem = attachItem;
exports.default = getConfig;

var lib = _interopRequireWildcard(require("../../lib"));

var _common = require("../../_common");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function attachItem(pay, context) {
  var config = context && context.config || {};
  var itemMethod = config._itemMethod || {};
  var payload = [];
  pay = [].concat(pay);
  pay.forEach(function (it) {
    if (lib.isNumber(it) || lib.isString(it) || React.isValidElement(it)) {
      it = {
        title: it
      };
    }

    if (lib.isPlainObject(it)) {
      var cClass = context.data.itemClass || '';
      var iClass = it.itemClass || '';
      it.itemClass = iClass ? cClass + ' ' + iClass : cClass;
      it['__key'] = it['__key'] || lib.uniqueId('list_item_');
      it = Object.assign(it, itemMethod);
      payload.push(it);
    }
  });
  return payload;
}

function getConfig(opts, context) {
  var mydata = {};
  var oriData = [];
  var myoptions = {};
  var attr = {};
  var config = {};
  var itemMethod = {};
  var itemClass = '';
  var re = /\@[\w]+/g;
  Object.keys(opts).forEach(function (k) {
    var v = opts[k];

    if ((0, _common.isEvents)(k)) {
      itemMethod[k] = opts[k];
    } else if (k.indexOf('data-') === 0) {
      attr[k] = v;
    } else if (re.test(k)) {
      mydata[k] = v;
    } else if (_common.attrKey.indexOf(k) > -1) {
      if (k === 'data') {
        oriData = opts[k];
      } else {
        mydata[k] = opts[k];
      }
    } else {
      myoptions[k] = opts[k];
    }
  });

  if (mydata.methods) {
    for (var ky in mydata.methods) {
      myoptions[ky] = mydata.methods[ky];
    }

    delete mydata.methods;
  }

  attr = Object.assign({}, mydata.attr, attr, myoptions.attr);
  mydata.attr = attr;
  delete myoptions.attr;

  if (myoptions.listMethod) {}

  if (mydata.itemMethod) {
    var itmMethod = mydata.itemMethod;
    delete mydata.itemMethod;
    itemMethod = Object.assign({}, itemMethod, itmMethod);
  }

  if (mydata.itemClass) {
    var itmClass = mydata.itemClass;
    itemClass = itmClass;
  }

  if (!lib.isArray(oriData)) {
    oriData = [];
  }

  var datas = oriData.map(function (item) {
    if (lib.isString(item) || lib.isNumber(item) || React.isValidElement(item)) {
      item = {
        title: item
      };
    }

    if (lib.isPlainObject(item)) {
      item.itemClass = item.itemClass ? item.itemClass + ' ' + (itemClass || '') : itemClass;
      item = Object.assign({
        __key: lib.uniqueId('list_item_')
      }, item, itemMethod);
    }

    return item;
  });
  mydata.data = datas;
  config = _objectSpread({
    data: mydata,
    _itemMethod: itemMethod
  }, myoptions);
  return config;
}