"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = list;

var _core = _interopRequireWildcard(require("../core"));

var _foritem = require("./_common/foritem");

var _tree = _interopRequireDefault(require("./_common/tree"));

var _common = require("../_common");

var _getconfig = _interopRequireWildcard(require("./_common/getconfig"));

var partments = _interopRequireWildcard(require("../_common/partment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function getListMethod(events) {
  return (0, _common.bindEvents)(events, this); // const that = this
  // lib.forEach(events, (fun, ii, ky) => {
  //   let evt = fun
  //   if (lib.isFunction(evt)) {
  //     let funKey = lib.uniqueId('__on_')
  //     this[funKey] = evt
  //     evt = funKey
  //   }
  //   if (lib.isString(evt)) {
  //     let {url, query, hasQuery} = lib.urlTOquery(evt)
  //     let functionName = url
  //     events[ky] = function(e, param, inst) {
  //       let responseContext = getContextCallback(that, functionName)
  //       if (responseContext) {
  //         responseContext[functionName].call(responseContext, e, query, that)
  //       } else {
  //         console.warn('没有找到定义方法:'+ky);  // 定义pager的__fromParent
  //       }
  //     }
  //   }
  // })
  // return events
}

var template = function template(state, props) {
  var _this = this;

  var events = this.events;
  var mode = state.mode || 'list';

  var _attr = state.attr || props.attr || {};

  var data = state.data;
  var attr = {};
  Object.keys(_attr).forEach(function (ky) {
    var $ky = ky;

    if (ky.indexOf('data-') === -1) {
      $ky = 'data-' + ky;
    }

    attr[$ky] = _attr[ky];
  });
  var items = [];

  if (mode === 'list') {
    items = data.map(function (item) {
      item = (0, _foritem.resetItem)(item, _this, true);
      var it = ui_item(item);
      return /*#__PURE__*/React.createElement(it.UI, {
        key: item.__key
      });
    });
  }

  if (mode === 'tree') {
    items = data.map(function (item) {
      return (0, _foritem.resetItem)(item, _this, true);
    });
    items = (0, _tree["default"])(items, state);
    items = items.map(function (item) {
      var it = ui_item(item);
      return /*#__PURE__*/React.createElement(it.UI, {
        key: item.__key
      });
    });
  }

  var header = state.header;
  var footer = state.footer;
  return /*#__PURE__*/React.createElement("div", _extends({
    id: state.id,
    className: 'hlist ' + (state.listClass || ''),
    style: state.listStyle
  }, attr, events), header, items, footer, props.children);
};

var defaultConfig = {
  data: [],
  $$is: 'list',
  attached: null,
  ready: null,
  __ready: null
};
var defaultBehavior = {
  insert: function insert(query, pay) {
    if (!pay) return;
    pay = (0, _getconfig.attachItem)(pay);
    var $data = this.getData().data;
    var index = -1;

    if (_core.lib.isNumber(query)) {
      index = query;
    }

    if (_core.lib.isPlainObject(query)) {
      index = _core.lib.findIndex($data, query);
    }

    if (index || index === 0) {
      $data.splice.apply($data, [index, 0].concat(_toConsumableArray(pay)));
    }

    this.update({
      data: $data
    });
  },
  append: function append(pay) {
    if (!pay) return;
    pay = (0, _getconfig.attachItem)(pay);
    var $data = this.getData().data;

    if (pay) {
      $data = $data.concat(pay);
      this.update({
        data: $data
      });
    }
  },
  prepend: function prepend(pay) {
    if (!pay) return;
    pay = (0, _getconfig.attachItem)(pay);
    var $data = this.getData().data;

    if (pay) {
      $data = [].concat(pay).concat($data);
      this.update({
        data: $data
      });
    }
  },
  remove: function remove(query) {
    var $data = this.getData().data;
    var index = -1;

    if (_core.lib.isNumber(query)) {
      index = query;
    }

    if (_core.lib.isPlainObject(query)) {
      index = _core.lib.findIndex($data, query);
    }

    if (index || index === 0) {
      $data.splice(index, 1);
    }

    this.update({
      data: $data
    });
  },
  setData: function setData(param, cb) {
    this.update(param, cb);
  },
  update: function update(_param, cb) {
    var _this2 = this;

    // let param = lib.clone(_param)
    var param = _param;
    var $data = this.data;

    var updateFun = function updateFun() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var ky in opts) {
        var val = opts[ky];

        _core.lib.set($data, ky, val);
      }

      _this2._setData($data);
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
      var $list = this.getData();
      var $listClass = $list.listClass && $list.listClass.split(' ') || [];
      cls = cls.filter(function (cls) {
        return $listClass.indexOf(cls) == -1;
      });
      $listClass = $listClass.concat(cls);
      this.update({
        listClass: $listClass.join(' ')
      }, cb);
    }
  },
  removeClass: function removeClass(cls, cb) {
    if (cls) {
      cls = cls.replace(/\./g, '');
      cls = _core.lib.isString(cls) ? cls.split(' ') : [];
      var $list = this.getData();
      var $listClass = $list.listClass && $list.listClass.split(' ') || [];

      var _cls = $listClass.filter(function (c) {
        return c.indexOf(cls) === -1;
      });

      $listClass = _cls;
      this.update({
        listClass: $listClass.join(' ') || ' '
      }, cb);
    }
  },
  hasClass: function hasClass(cls) {
    if (cls) {
      cls = cls.replace(/\./g, '');
      cls = _core.lib.isString(cls) ? cls.split(' ') : [];
      var len = cls.length;
      var $list = this.getData();
      var $listClass = $list.listClass && $list.listClass.split(' ') || [];
      cls = cls.filter(function (c) {
        return $listClass.indexOf(c) !== -1;
      });
      return len === cls.length ? true : false;
    }
  },
  css: function css(params, cb) {
    if (!_core.lib.isPlainObject(params)) {
      console.warn('不符合react的内联样式格式');
      return;
    }

    var $list = this.getData();
    var listStyle = Object.assign({}, $list.listStyle || {}, params);
    this.update({
      listStyle: listStyle
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
  } // didUpdate(){
  //   if (lib.isFunction(this.config.didUpdate)) {
  //     this.config.didUpdate.apply(this, arguments)
  //   }
  // }
  // reset(){},
  // parent(){},

};
/**
 * 
 * @param {*} options 
 * {
 *   data: [],
 *   listClass: '',
 *   itemClass: '',
 *   itemMethod: {},
 *   methods: {},
 *   footer: <>,
 *   header: <>
 * }
 */

function list() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var config = (0, _getconfig["default"])(options);
  config = Object.assign({}, defaultConfig, config, defaultBehavior);
  var customCreated = config.created;

  config.created = function () {
    this.$$is = this.config.$$is;
    this.events = getListMethod.call(this, this.config.listMethod || {});

    if (_core.lib.isFunction(customCreated)) {
      customCreated.call(this);
    }
  };

  return (0, _core["default"])(config, template);
}

var context = _core.lib.curContext();

context.ui_list = list;

context.ui_tree = function (options) {
  if (_core.lib.isPlainObject(options)) {
    options.mode = 'tree';
    return list(options);
  }
};