"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var lib = _interopRequireWildcard(require("../lib"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function groupEelements(elements) {
  var obj = {};
  elements.forEach(function (item, ii) {
    obj[ii] = item;
  });
  obj.length = elements.length;
  Reflect.setPrototypeOf(obj, {
    forEach: Array.prototype.forEach,
    map: Array.prototype.map,
    filter: Array.prototype.filter,
    splice: function splice() {},
    reset: function reset(param) {
      this.forEach(function (item) {
        if (item.reset) item.reset(param);
      });
    },
    attr: function attr(param1, param2) {
      this.forEach(function (item) {
        if (item.attr) item.attr(param1, param2);
      });
    },
    show: function show() {
      this.forEach(function (item) {
        if (item.show) item.show();
      });
    },
    hide: function hide() {
      this.forEach(function (item) {
        if (item.hide) item.hide();
      });
    },
    toggleClass: function toggleClass(cls, cb) {
      this.forEach(function (item) {
        if (item.toggleClass) item.toggleClass(cls, cb);
      });
    },
    addClass: function addClass(cls, cb) {
      this.forEach(function (item) {
        if (item.addClass) item.addClass(cls, cb);
      });
    },
    removeClass: function removeClass(cls, cb) {
      this.forEach(function (item) {
        if (item.removeClass) item.removeClass(cls, cb);
      });
    },
    update: function update(param, cb) {
      this.forEach(function (item) {
        if (item.update) item.update(param, cb);
      });
    },
    find: function find(indentify) {
      var targets = this.filter(function (item) {
        return item.hasClass(indentify);
      });
      return groupEelements(targets);
    }
  });
  return obj;
}

var ElementsCollection = /*#__PURE__*/function () {
  function ElementsCollection() {
    _classCallCheck(this, ElementsCollection);

    this.elements = {};
  }

  _createClass(ElementsCollection, [{
    key: "setElement",
    value: function setElement(id, instance) {
      if (id && instance) {
        this.elements[id] = instance;
      }
    }
  }, {
    key: "delElement",
    value: function delElement(id) {
      this.elements[id] = null;
      delete this.elements[id];
    }
  }, {
    key: "getElement",
    value: function getElement(indentify, context) {
      var target = [];

      if (indentify) {
        var findFromRoot = context ? context.children || [].concat(context) : this.elements;
        indentify = indentify.replace('#', '');

        if (indentify.indexOf('.') === 0) {
          lib.forEach(findFromRoot, function (ele, ii, ky) {
            if (ele.hasClass && ele.hasClass(indentify)) {
              target.push(ele);
            }
          });
        } else {
          target = [this.elements[indentify]];
        }

        return target.length === 1 ? target[0] : groupEelements(target);
      } else {
        return groupEelements(this.elements);
      }
    }
  }]);

  return ElementsCollection;
}(); // let _elements = new ElementsCollection()


var memory = {};

function _default(prefix) {
  if (!memory[prefix]) {
    memory[prefix] = new ElementsCollection();
  }

  return memory[prefix];
}