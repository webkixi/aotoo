"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.html = html;
exports.$$ = $$;
Object.defineProperty(exports, "lib", {
  enumerable: true,
  get: function get() {
    return _core.lib;
  }
});
Object.defineProperty(exports, "_elements", {
  enumerable: true,
  get: function get() {
    return _core._elements;
  }
});
Object.defineProperty(exports, "ReturnPromiseComponent", {
  enumerable: true,
  get: function get() {
    return _core.ReturnPromiseComponent;
  }
});
Object.defineProperty(exports, "extTemplate", {
  enumerable: true,
  get: function get() {
    return _core.extTemplate;
  }
});
exports["default"] = void 0;

var _core = _interopRequireWildcard(require("./core"));

require("./item");

require("./list");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function $$(indentify) {
  return _core._elements.getElement(indentify);
}

function render(jsx, id, cb) {
  if (_core.lib.isClient()) {
    var root = id;

    if (_core.lib.isString(id)) {
      root = document.getElementById(id);
    }

    if (_core.lib.isDomElement(root)) {
      ReactDOM.unmountComponentAtNode(root);
      root.innerHTML = ''; // ReactDOM.render(jsx, root)
      // ReactDOM.hydrate(jsx, root)

      typeof noserver === 'undefined' ? ReactDOM.hydrate(jsx, root, cb) : ReactDOM.render(jsx, root, cb);
    }
  }

  if (_core.lib.isNode()) {
    return ReactDomServer.renderToString(jsx);
  }
}

function html(jsx) {
  if (_core.lib.isNode()) {
    return ReactDomServer.renderToStaticMarkup(jsx);
  }
}

var _default = _core["default"];
exports["default"] = _default;