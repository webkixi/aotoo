"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = item;

var _core = _interopRequireWildcard(require("../core"));

var _foritem = require("./_common/foritem");

var _common = require("../_common");

var _getconfig = _interopRequireDefault(require("./_common/getconfig"));

var _partment = _interopRequireDefault(require("../_common/partment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var subClassNames = ['hb-item', 'hf-item', 'hdot-item', 'li-item'];

var template = function template(state, props) {
  var events = this.events;

  var _attr = state.attr || props.attr || {};

  var attr = {};
  Object.keys(_attr).forEach(function (ky) {
    var $ky = ky;

    if (ky.indexOf('data-') === -1) {
      $ky = 'data-' + ky;
    }

    attr[$ky] = _attr[ky];
  });
  var sort = state.__sort;
  sort = sort.filter(function (ky) {
    return _partment["default"][ky] ? true : false;
  });
  var myTemplate = sort.map(function (ky, ii) {
    var elementKey = _core.lib.uniqueId('part_');

    var value = state[ky];
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: elementKey
    }, _partment["default"][ky](value, undefined, state, props)); // return partments[ky](value, state, props, elementKey, _ky)
  });
  var clsNmae = 'item ' + (state.itemClass || '');
  var propsClassName = props.className;

  if (propsClassName) {
    subClassNames.forEach(function (cls) {
      if (propsClassName.indexOf(cls) > -1) {
        clsNmae = propsClassName;
      }
    });
  }

  return /*#__PURE__*/React.createElement("div", _extends({
    id: state.id,
    key: state.__key,
    className: clsNmae,
    style: state.itemStyle
  }, attr, events), /*#__PURE__*/React.createElement(React.Fragment, null, myTemplate, props.children));
};

var defaultConfig = {
  // data: {},
  $$is: 'item',
  attached: null,
  ready: null,
  __ready: null
};
var defaultBehavior = {
  setData: function setData(param, cb) {
    this.update(param, cb);
  },
  update: function update(_param, cb) {
    var _this = this;

    // let param = lib.clone(_param)
    var param = _param;
    var $data = this.data;

    var updateFun = function updateFun() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var ky in opts) {
        var val = opts[ky];

        _core.lib.set($data, ky, val);
      }

      $data = (0, _foritem.resetItem)($data, _this);

      _this._setData($data);
    };

    var result = this.hooks.emit('before-update', param);

    if (result && result[0]) {
      result = result[0];

      if (_core.lib.isFunction(result.then)) {
        result.then(function (res) {
          return updateFun(res);
        })["catch"](function (err) {
          return err;
        });
      } else {
        updateFun(result);
      }
    } else {
      updateFun(param);
    }
  },
  addClass: function addClass(cls, cb) {
    if (cls) {
      cls = cls.replace(/\./g, '');
      cls = _core.lib.isString(cls) ? cls.split(' ') : [];
      var $item = this.getData();
      var $itemClass = $item.itemClass && $item.itemClass.split(' ') || [];
      cls = cls.filter(function (cls) {
        return $itemClass.indexOf(cls) == -1;
      });
      $itemClass = $itemClass.concat(cls);
      this.update({
        itemClass: $itemClass.join(' ')
      }, cb);
    }
  },
  removeClass: function removeClass(cls, cb) {
    if (cls) {
      cls = cls.replace(/\./g, '');
      cls = _core.lib.isString(cls) ? cls.split(' ') : [];
      var $item = this.getData();
      var $itemClass = $item.itemClass && $item.itemClass.split(' ') || [];

      var _cls = $itemClass.filter(function (c) {
        return c.indexOf(cls) === -1;
      });

      $itemClass = _cls;
      this.update({
        itemClass: $itemClass.join(' ') || ' '
      }, cb);
    }
  },
  hasClass: function hasClass(cls) {
    if (cls) {
      cls = cls.replace(/\./g, '');
      cls = _core.lib.isString(cls) ? cls.split(' ') : [];
      var len = cls.length;
      var $item = this.getData();
      var $itemClass = $item.itemClass && $item.itemClass.split(' ') || [];
      cls = cls.filter(function (c) {
        return $itemClass.indexOf(c) !== -1;
      });
      return len === cls.length ? true : false;
    }
  },
  css: function css(params, cb) {
    if (!_core.lib.isPlainObject(params)) {
      console.warn('不符合react的内联样式格式');
      return;
    }

    var $item = this.getData();
    var itemStyle = Object.assign({}, $item.itemStyle || {}, params);
    this.update({
      itemStyle: itemStyle
    }, cb);
  },
  toggleClass: function toggleClass(cls, cb) {
    if (cls) {
      var clsAry = _core.lib.isString(cls) ? cls.split(' ') : [];

      if (clsAry.length) {
        cls = clsAry[0];

        if (this.hasClass(cls)) {
          this.removeClass(cls, cb);
        } else {
          this.addClass(cls, cb);
        }
      }
    }
  },
  siblings: function siblings(indentify) {
    var _this2 = this;

    if (this.parentInst) {
      var allChilds = this.parentInst.children;
      broChilds = allChilds.filter(function (child) {
        return child.uniqId !== _this2.uniqId;
      });

      if (indentify) {
        broChilds = broChilds.filter(function (child) {
          return child.hasClass(indentify);
        });
      }

      return broChilds;
    }
  }
};

function item() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // ??? options === string   options === reactElement options === reactClass
  var config = (0, _getconfig["default"])(options);
  config = Object.assign({}, defaultConfig, config, defaultBehavior);
  var customCreated = config.created;

  config.created = function () {
    this.$$is = this.config.$$is;
    this.data = (0, _foritem.resetItem)(this.data, this);

    if (_core.lib.isFunction(customCreated)) {
      customCreated.call(this);
    }
  };

  var customAttached = config.attached;

  config.attached = function (props) {
    if (_core.lib.isFunction(customAttached)) {
      customAttached.call(this, props);
    }
  };

  var customReady = config.ready || config.__ready;

  config.ready = function () {
    if (_core.lib.isFunction(customReady)) {
      customReady.call(this);
    }
  };

  return (0, _core["default"])(config, template);
}

var context = _core.lib.curContext();

context.ui_item = item;