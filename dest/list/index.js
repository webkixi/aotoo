"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = list;

var _core = _interopRequireWildcard(require("../core"));

var _foritem = require("./_common/foritem");

var _tree = _interopRequireDefault(require("./_common/tree"));

var _common = require("../_common");

var _getconfig = _interopRequireWildcard(require("./_common/getconfig"));

var partments = _interopRequireWildcard(require("../_common/partment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function getListMethod(events) {
  return (0, _common.bindEvents)(events, this);
}

var template = function template(state, props) {
  var _this = this;

  var events = this.events;
  var mode = state.mode || 'list';
  var type = state.type || 'list'; // expose  scroll swiper

  var _attr = state.attr || props.attr || {};

  var data = state.data;
  var select = state.select || -1;
  var attr = {};
  Object.keys(_attr).forEach(function (ky) {
    var $ky = ky;

    if (ky.indexOf('data-') === -1) {
      $ky = 'data-' + ky;
    }

    attr[$ky] = _attr[ky];
  });
  var items = [];
  items = data.map(function (item, ii) {
    item = (0, _foritem.resetItem)(item, _this, true);

    if (_core.lib.isNumber(item) || _core.lib.isString(item) || React.isValidElement(item)) {
      if (React.isValidElement(item)) {
        item = {
          title: item
        };
      } else {
        item = {
          text: item
        };
      }
    } else {
      if (_core.lib.isPlainObject(select) && _core.lib.isPlainObject(item)) {
        select = _core.lib.findIndex([item], select);
      }
    }

    if (select !== -1 && ii === select && _core.lib.isPlainObject(item)) {
      item.itemClass = item.itemClass ? item.className + ' active' : 'active';
    }

    if (item.select === true) {
      var tmpClass = item.itemClass || 'active';

      if (tmpClass.indexOf('active') === -1) {
        tmpClass += ' active';
      }

      item.itemClass = tmpClass;
    }

    return item;
  });

  if (mode === 'list') {
    items = items.map(function (item) {
      var it = ui_item(item);
      return /*#__PURE__*/React.createElement(it.UI, {
        key: item.__key
      });
    });
  }

  if (mode === 'tree') {
    items = (0, _tree.default)(items, state);
    items = items.map(function (item) {
      var it = ui_item(item);
      return /*#__PURE__*/React.createElement(it.UI, {
        key: item.__key
      });
    });
  }

  var header = state.header;
  var footer = state.footer;

  if (header && !React.isValidElement(header) && _core.lib.isPlainObject(header)) {
    header = (0, _foritem.resetItem)(header, this, true);
    var head = ui_item(header);
    header = /*#__PURE__*/React.createElement(head.UI, null);
  }

  if (footer && !React.isValidElement(footer) && _core.lib.isPlainObject(footer)) {
    footer = (0, _foritem.resetItem)(footer, this, true);
    var foot = ui_item(footer);
    footer = /*#__PURE__*/React.createElement(foot.UI, null);
  }

  var bodys = /*#__PURE__*/React.createElement(React.Fragment, null, items, props.children);

  if (header || footer) {
    bodys = /*#__PURE__*/React.createElement(React.Fragment, null, header, /*#__PURE__*/React.createElement(View, {
      className: "list-body"
    }, items, props.children), footer);
  }

  if (type === 'expose') {
    return /*#__PURE__*/React.createElement(React.Fragment, null, header, items, props.children, footer);
  }

  return /*#__PURE__*/React.createElement(View, _extends({
    id: state.id,
    className: 'hlist ' + (state.listClass || ''),
    style: state.listStyle
  }, attr, events), bodys);
};

var defaultConfig = {
  data: [],
  $$is: 'list',
  attached: null,
  ready: null,
  __ready: null
};
var defaultBehavior = {
  reset: function reset(param, cb) {
    var that = this;

    if (_core.lib.isFunction(param)) {
      cb = param;
      param = null;
    }

    if (this.reactComponentInstance) {
      this.reactComponentInstance.reset({
        data: []
      }, function () {
        if (_core.lib.isArray(param)) {
          param = {
            data: param
          };
        }

        if (_core.lib.isPlainObject(param)) {
          if (param.data) {
            if (_core.lib.isArray(param.data)) {
              param.data = (0, _getconfig.attachItem)(param.data, that);
            } else {
              delete param.data;
            }
          }
        }

        that.reactComponentInstance.reset(param, cb);
      });
    }
  },
  insert: function insert(query, pay, cb) {
    if (!pay) return;
    pay = (0, _getconfig.attachItem)(pay, this);
    var $data = this.getData().data;
    var index = this.findIndex(query); // if (lib.isNumber(query)) {
    //   index = query
    // }
    // if (lib.isPlainObject(query)) {
    //   index = lib.findIndex($data, query)
    // }

    if (index > -1) {
      $data.splice.apply($data, [index, 0].concat(_toConsumableArray(pay)));
    }

    this.update({
      data: $data
    }, cb);
  },
  append: function append(pay, cb) {
    if (!pay) return;
    pay = (0, _getconfig.attachItem)(pay, this);
    var $data = this.getData().data;

    if (pay) {
      $data = $data.concat(pay);
      this.update({
        data: $data
      }, cb);
    }
  },
  prepend: function prepend(pay, cb) {
    if (!pay) return;
    pay = (0, _getconfig.attachItem)(pay, this);
    var $data = this.getData().data;

    if (pay) {
      $data = [].concat(pay).concat($data);
      this.update({
        data: $data
      }, cb);
    }
  },
  remove: function remove(query, cb) {
    var $data = this.getData().data;
    var index = this.findIndex(query); // if (lib.isNumber(query)) {
    //   index = query
    // }
    // if (lib.isPlainObject(query)) {
    //   index = lib.findIndex($data, query)
    // }

    if (!query) {
      index = $data.length - 1;
    }

    if (query === 'shift') {
      index = 0;
    }

    if (index > -1) {
      var target = $data.splice(index, 1);
      target.destory && target.destory();
    } // this.children = []


    this.update({
      data: $data
    }, cb);
  },
  pop: function pop(cb) {
    this.remove(null, cb);
  },
  push: function push(pay, cb) {
    this.append(pay, cb);
  },
  shift: function shift(cb) {
    this.remove('shift', cb);
  },
  unshift: function unshift(pay, cb) {
    this.prepend(pay, cb);
  },
  setData: function setData(param, cb) {
    this.update(param, cb);
  },
  update: function update(_param, cb) {
    var _this2 = this;

    // let param = lib.clone(_param)
    var param = _param;
    var $data = this.getData();

    var updateFun = function updateFun() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var ky in opts) {
        var val = opts[ky];

        if (ky === 'data') {
          val = val.map(function (item) {
            return (0, _foritem.resetItem)(item, _this2, true);
          });
        }

        _core.lib.set($data, ky, val);
      }

      _this2._setData($data, cb);
    };

    var result = this.hooks.emit('before-update', param);

    if (result && result[0]) {
      result = result[0];

      if (_core.lib.isFunction(result.then)) {
        result.then(function (res) {
          return updateFun(res);
        }).catch(function (err) {
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
  },
  disable: function disable() {},
  enable: function enable() {},
  forEach: function forEach(cb) {
    var _this3 = this;

    var that = this; // 方案一
    // 使用子元素自己更新
    // 一旦子元素自更新，则list组件不再能够透过props影响子元素，考虑到子元素更新应该要交给用户

    var theData = this.getData().data;

    if (theData.length === this.children.length) {
      this.children.forEach(function (item, ii) {
        if (_core.lib.isFunction(cb)) cb.call(item, item, ii);
      });
    } else {
      var validChildren = [];
      theData.forEach(function (item) {
        var key = item.__key;

        _this3.children.forEach(function (child) {
          var $key = child.data.__key;

          if (key === $key) {
            validChildren.push(child);
          }
        });
      });
      validChildren.forEach(function (item, ii) {
        if (_core.lib.isFunction(cb)) cb.call(item, item, ii);
      });
    } // 方案二
    // 由list透过props更新子元素
    // let myupdates = {}
    // let $data = this.getData().data
    // $data.forEach((_item, ii)=>{
    //   let item = lib.clone(_item)
    //   let itemContext = {
    //     addClass(cls){
    //       let $itemClass = addClass(item, cls)
    //       let ky = `data[${ii}].itemClass`
    //       myupdates[ky] = $itemClass
    //     },
    //     removeClass(cls){
    //       let $itemClass = removeClass(item, cls)
    //       let ky = `data[${ii}].itemClass`
    //       myupdates[ky] = $itemClass
    //     },
    //     hasClass(cls){
    //       return hasClass(item, cls)
    //     },
    //     css(params){
    //       let itemStyle = css(item, params)
    //       let ky = `data[${ii}].itemStyle`
    //       myupdates[ky] = itemStyle
    //     },
    //     toggleClass(cls){
    //       if (this.hasClass(cls)) {
    //         this.removeClass(cls)
    //       } else {
    //         this.addClass(cls)
    //       }
    //     },
    //     update(param){
    //       let ky = `data[${ii}]`
    //       myupdates[ky] = param
    //     },
    //     show(){
    //       let ky = `data[${ii}].show`
    //       myupdates[ky] = true
    //     },
    //     hide(){
    //       let ky = `data[${ii}].show`
    //       myupdates[ky] = false
    //     },
    //     attr(p1, p2){
    //       let ky = `data[${ii}].attr`
    //       myupdates[ky] = attr(item, p1, p2)
    //     },
    //     disable(){
    //       this.addClass('disabled _disabled')
    //     },
    //     enable(){
    //       this.removeClass('disabled _disabled')
    //     }
    //   }
    //   if (lib.isFunction(cb)) cb.call(itemContext, item, ii)
    // })
    // if (!lib.isEmpty(myupdates)) {
    //   this.update(myupdates)
    // }

  },
  length: function length() {
    if (this.tasks.length || this.taskTimmer) {
      return this.taskData.data.length;
    }

    return this.getData().data.length;
  },
  select: function select(query) {
    var cls = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'active';
    var cb = arguments.length > 2 ? arguments[2] : undefined;
    var $data = this.getData().data;
    var index = this.findIndex(query); // if (lib.isNumber(query)) {
    //   index = query
    // }
    // if (lib.isPlainObject(query)) {
    //   index = lib.findIndex($data, query)
    // }

    if (_core.lib.isFunction(cls)) {
      cb = cls;
      cls = 'active';
    }

    if (index > -1) {
      this.forEach(function (item, ii) {
        if (ii === index) {
          item.addClass(cls, cb);
        } else {
          if (item.hasClass(cls)) {
            item.removeClass(cls);
          }
        }
      });
    }
  },
  findIndex: function findIndex(param) {
    var index = -1;
    var $data = this.getData().data;

    if (_core.lib.isNumber(param)) {
      if ($data[param]) index = param;
    }

    if (_core.lib.isPlainObject(param)) {
      return _core.lib.findIndex($data, param);
    }

    if (_core.lib.isFunction(param)) {
      $data.forEach(function (item, ii) {
        if (param(item)) index = ii;
      });
    }

    return index;
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
 *   select: [number|object]  //默认选中项
 * }
 */

function list() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var config = (0, _getconfig.default)(options);
  config = Object.assign({}, defaultConfig, config, defaultBehavior);
  var customCreated = config.created;

  config.created = function () {
    // this.$$is = this.config.$$is
    this.$$is = options.mode || 'list';
    this.events = getListMethod.call(this, this.config.listMethod || {});

    if (_core.lib.isFunction(customCreated)) {
      customCreated.call(this);
    }
  };

  return (0, _core.default)(config, template);
}

var context = _core.lib.curContext();

if (!context.ui_list) {
  context.ui_list = list;

  context.ui_tree = function (options) {
    if (_core.lib.isPlainObject(options)) {
      options.mode = 'tree';
      return list(options);
    }
  };
}