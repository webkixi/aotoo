'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = exports.AotooEventEmitter = exports.CombineClass = exports.combinex = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lib = require('./suba/lib');

var util = _interopRequireWildcard(_lib);

var _lodash = require('lodash/lodash.min');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const reactDomServer = require('react-com/server')
var noop = util.noop;
var sax = util.sax;
var isClient = util.isClient;
var isReactNative = util.isReactNative;
var context = isClient ? eval('window') : eval('global');

// if (!isClient) {
//   if (!isReactNative) {
//     reactDom = require('react-dom/server')
//     context.ReactDOMServer = reactDom
//     context.ReactDomServer = reactDom
//   }
// }

context.React = _react2.default;
context.ReactDom = _reactDom2.default;
context.ReactDOM = _reactDom2.default;
context.SAX = sax;
context._ = _lodash2.default;
aotoo.context = context;
context.Aotoo = aotoo;

var _require = require('./suba/lib/aotoocombinx'),
    wrap = _require.wrap,
    combineX = _require.combineX,
    CombineClass = _require.CombineClass,
    createCombinClass = _require.createCombinClass,
    aotooEventEmitter = _require.aotooEventEmitter;

var extension = { plugins: {} };
var render = function render(jsx) {
  return jsx;
};
var pureRender = function pureRender(jsx) {
  return jsx;
};

// if (!isReactNative) {
//   console.log('======== 1111');
//   if (isClient) {
//     console.log('======== 2222');
//     render = pureRender = ReactDom.render
//   } 
//   // else {
//   //   render = ReactDomServer.renderToString
//   //   pureRender = ReactDomServer.renderToStaticMarkup
//   // }
// }

// 前端render
function fedRender(element, id) {
  var targetDom = util.isString(id) ? document.getElementById(id) : util.isDomElement(id) ? id : '';
  if (targetDom) {
    return ReactDom.render(element, targetDom);
  } else {
    return element;
  }
}

function aotoo(rctCls, acts, opts) {
  return createCombinClass(rctCls, acts, opts, extension);
}

function setAtRender(params) {
  if (isClient) {
    aotoo.html = aotoo.render = fedRender;
  }
}

aotoo.version = '4.0.17';
aotoo.combinex = combineX;
aotoo.CombineClass = CombineClass;
aotoo.isClient = isClient;
aotoo.isReactNative = isReactNative;
if (isReactNative) {
  aotoo.render = aotoo.html = render;
} else {
  setAtRender();
}
for (var item in util) {
  aotoo[item] = util[item];
}

aotoo.wrapEx = function (key, cb) {
  aotoo[key] = function (ComposedComponent, opts, func) {
    return wrap(ComposedComponent, function (dom) {
      var result = cb(dom, opts, util);
      var isFun = typeof func == 'function';
      return isFun ? func(result) : result;
    });
  };
};

aotoo.plugins = function (key, fun) {
  aotoo[key] = fun;
  extension.plugins[key] = fun;
};

aotoo.extend = function (key, cb) {
  aotoo[key] = function (opts) {
    return cb(opts, util);
  };
};

aotoo.plugins('wrap', wrap);

exports.default = aotoo;
exports.combinex = combineX;
exports.CombineClass = CombineClass;
exports.AotooEventEmitter = aotooEventEmitter;
exports.wrap = wrap;
//# sourceMappingURL=maps/index.js.map
