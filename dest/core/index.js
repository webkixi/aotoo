"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$$ = $$;
exports.ReturnPromiseComponent = ReturnPromiseComponent;
exports.extTemplate = extTemplate;
exports.default = _default;
exports.lib = exports._elements = void 0;

var _react = _interopRequireDefault(require("react"));

var _elements2 = _interopRequireDefault(require("./elements"));

var _hoc = _interopRequireDefault(require("./hoc"));

var _wrap = _interopRequireDefault(require("./wrap"));

var _partment = require("../_common/partment");

var lib = _interopRequireWildcard(require("../lib"));

exports.lib = lib;

var _index = require("../_common/index");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var context = lib.curContext();
context.React = context.React || _react.default;

var _elements = (0, _elements2.default)('core');

exports._elements = _elements;

function $$(id) {
  return _elements.getElement(id);
}

function ReturnPromiseComponent(props) {
  var rendered = false;
  var content = props.content;

  var _React$useState = React.useState( /*#__PURE__*/React.createElement(View, {
    className: 'ui-loading ' + (props.loadingClass || '')
  })),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      value = _React$useState2[0],
      setValue = _React$useState2[1];

  React.useEffect(function () {
    rendered = true;

    if (props.content.then) {
      props.content.then(function (value) {
        if (rendered) {
          if (value.UI) {
            setValue( /*#__PURE__*/React.createElement(value.UI, null));
          } else {
            setValue(value);
          }
        }
      });
    }

    return function () {
      rendered = false;
    };
  });

  if (React.isValidElement(content)) {
    return content;
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, value);
}

var getFunctionComponent = require('./getfunctioncomponent');

var getReactComponentClass = require('./getreactcomponentclass'); // function setContainerDom(ele) {
//   return this.reactComponentInstance.ref
//   // this.dom = ele
// }


function _onload_(props) {
  this.hasMounted = 'component_init_set_state';
  this.hooks.emit('constructor-react-component', props, this);
  this.attached(props); // 小程序组件生命周期 attached

  this.hasMounted = false;
}

function _ready_(params) {
  this.ready();
}

function _setData_() {
  var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cb = arguments.length > 1 ? arguments[1] : undefined;
  var that = this;

  if (this.hasMounted) {
    if (this.reactComponentInstance) {
      this.reactComponentInstance.setSelfState(param, cb);
    } else {
      // created生命周期中
      this.data = Object.assign({}, this.data, param);

      if (lib.isFunction(cb)) {
        cb();
      }
    }
  } else {
    var waitingData = this.hooks.getItem('waiting-for-mounted-state-data') || {};
    waitingData = Object.assign({}, waitingData, param);
    this.hooks.setItem('waiting-for-mounted-state-data', waitingData);
    this.hooks.on('component-has-mounted', function () {
      that.hooks.delete('waiting-for-mounted-state-data');

      _setData_.call(that, waitingData, cb);
    });
  }
} // function _setData_(param = {}, cb) {
//   // if (this.reactComponentInstance && this.hasMounted) {
//   if (this.reactComponentInstance) {
//     this.reactComponentInstance.setSelfState(param, cb);
//   } else {
//     // created生命周期中
//     this.data = Object.assign({}, this.data, param)
//     if (lib.isFunction(cb)) {
//       cb()
//     }
//   }
// }


function removeParentChild() {
  if (this.parentInst && this.parentInst.children.length) {
    var uniqId = this.uniqId;
    var tmpAry = [];
    this.parentInst.children.forEach(function (child) {
      if (child.uniqId !== uniqId) tmpAry.push(child);
    });
    this.parentInst.children = tmpAry;
  }
}

var baseClass = /*#__PURE__*/function () {
  function baseClass() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var template = arguments.length > 1 ? arguments[1] : undefined;
    var splitProps = arguments.length > 2 ? arguments[2] : undefined;
    var useConfigComponent = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, baseClass);

    if (!config.data) {
      console.warn('需要指定data数据');
      config.data = {}; // return 
    }

    ;

    if (!lib.isPlainObject(config.data)) {
      console.warn('data数据必须为Object');
      return;
    }

    ;
    var that = this;

    var _param = lib.cloneDeep(config);

    var _data = _param.data || {};

    delete _param.data;
    var _property = _param;
    this.config = _param; // this.uniqId = _param.__key || _data.__key || lib.uniqueId('base_')

    this.uniqId = _param.uniqId || _data.uniqId || lib.uniqueId('base_'); // 存储实例

    _elements.setElement(this.uniqId, this);

    if (_data.$$id) {
      this.$$id = _data.$$id;
      this.id = this.$$id;

      _elements.setElement(this.$$id, this);
    }

    var defaultData = {// alwaysSyncProps: false
    };
    this.alwaysSyncProps = this.config.alwaysSyncProps || false; // 是否持续更新props(任何时候)

    this.__showStat = _data.hasOwnProperty('show') ? _data.show : true;
    this.id = this.$$id || _data.id;
    this.dom = null; // 真实dom实例，最外层的容器

    this.hasMounted = false;
    this.data = Object.assign({
      uniqId: this.uniqId
    }, defaultData, _data);
    this.hooks = lib.hooks(lib.uniqueId('baseClass_'));
    this.children = [];
    this.events = null; // data中的event合集

    this.ref = React.createRef(); // 祖先节点

    if ((this.data.fromComponent || this.data.rootComponent) && (this.data.fromComponent || this.data.rootComponent) !== this.uniqId) {
      this.componentInst = $$(this.data.fromComponent);
      this.rootInstance = this.componentInst;
    } // 父级节点


    if (this.data.__fromParent && this.data.__fromParent !== this.uniqId) {
      this.parentInst = $$(this.data.__fromParent);

      if (this.parentInst) {
        var isExist = false;
        (this.parentInst.children || []).forEach(function (child) {
          if (child.uniqId === _this.uniqId) isExist = true;
        });

        if (!isExist) {
          this.parentInst.children.push(this);
        }

        if (!this.componentInst) {
          this.componentInst = this.parentInst;
          this.rootInstance = this.componentInst;
        }
      }
    } else {
      this.data.fromComponent = this.uniqId;
      this.data.rootComponent = this.uniqId;
    }

    this.data.__fromParent = this.uniqId; // react组件内部的上下文环境

    Object.defineProperty(this, "reactComponentInstance", lib.protectProperty(null)); // react dom销毁后，实例是否仍驻内存

    Object.defineProperty(this, "isINmemery", lib.protectProperty()); // 组件的被渲染次数

    Object.defineProperty(this, "uiCount", lib.protectProperty(0)); // 渲染过后把jsx存储在本地

    Object.defineProperty(this, "jsx", lib.protectProperty()); // UI被移除时，移除父级children的引用

    Object.defineProperty(this, "removeParentChild", lib.protectProperty(removeParentChild.bind(this))); // 小程序组件生命周期 attached, page生命周期 onLoad

    Object.defineProperty(this, "_onload_", lib.protectProperty(_onload_.bind(this))); // 小程序组件生命周期 ready, page生命周期 onReady

    Object.defineProperty(this, "_ready_", lib.protectProperty(_ready_.bind(this)));
    Object.defineProperty(this, "_setData_", lib.protectProperty(_setData_.bind(this))); // 批量设置实例属性

    Object.keys(_property).forEach(function (ky) {
      if (_index.internalKeys.indexOf(ky) === -1) {
        var val = _property[ky];

        if (lib.isFunction(val)) {
          val = val.bind(_this);
        }

        _this[ky] = val;
      }
    });
    this.created(); // 小程序组件生命周期 created

    if (useConfigComponent) {
      this.UI = getReactComponentClass(this.data, this, template, splitProps); // let UI = getReactComponentClass(this.data, this, template, splitProps);
      // this.UI = function(props) {
      //   that.uiCount++
      //   return <UI {...props} />
      // }
    } else {
      this.UI = getFunctionComponent(this.data, this, template, splitProps);
    }
  }

  _createClass(baseClass, [{
    key: "created",
    value: function created() {
      var _this2 = this;

      this.tasks = []; // setData的更新任务

      this.taskData = this.getData();
      this.taskStat = true; // setData的更新状态

      this.taskTimmer = null;
      var config = this.config;
      var $data = this.data;
      var events = {};
      lib.forEach($data, function (val, ii, ky) {
        if ((0, _index.isEvents)(ky)) {
          if (['item', 'list'].indexOf(_this2.$$is) === -1) {
            events[ky] = val;
          }
        } else {
          if (lib.isFunction(val)) {
            _this2[ky] = val;
          }
        }
      });
      events = (0, _index.bindEvents)(events, this);

      if (lib.isFunction(config.created)) {
        config.created.call(this);
      }

      this.data = Object.assign($data, events);
    }
  }, {
    key: "attached",
    value: function attached(props) {
      var config = this.config;

      if (lib.isFunction(config.attached)) {
        this.properties = props;
        config.attached.call(this, props);
      }
    }
  }, {
    key: "detached",
    value: function detached() {
      var config = this.config;
      var mydetached = config.onUnload || config.detached || config.componentWillUnmount;

      if (lib.isFunction(mydetached)) {
        // 小程序组件生命周期 ready / Pager的onReady
        mydetached.call(this);
      }
    }
  }, {
    key: "getData",
    value: function getData() {
      if (lib.isFunction(this.config.getData)) {
        return this.config.getData.call(this);
      } else {
        if (this.tasks.length || this.taskTimmer) {
          return lib.cloneDeep(this.taskData);
        }

        return lib.cloneDeep(this.data);
      }
    }
  }, {
    key: "parent",
    value: function parent(indentify) {
      if (!indentify) {
        return this.parentInst;
      } else {
        if (this.parentInst) {
          if (this.parentInst.hasClass(indentify)) {
            return this.parentInst;
          } else {
            return this.parentInst.parent(indentify);
          }
        }
      }
    }
  }, {
    key: "attr",
    value: function attr(params, value) {
      if (lib.isString(params)) {
        if (!value) {
          return this.getData().attr[params];
        } else {
          var $attr = this.getData().attr(params);

          if ($attr) {
            var setKey = "attr[".concat(params, "]");
            this.setData(_defineProperty({}, setKey, value));
          }
        }
      } else {
        if (lib.isObject(params)) {
          var _$attr = this.getData().attr || {};

          _$attr = Object.assign({}, _$attr, params);
          this.setData({
            attr: _$attr
          });
        } else {
          return this.getData().attr;
        }
      }
    }
  }, {
    key: "didUpdate",
    value: function didUpdate(prevProps, prevState, snapshot) {
      if (lib.isFunction(this.config.didUpdate)) {
        this.config.didUpdate.call(this, prevProps, prevState, snapshot);
      }

      this.hooks.fire('component-has-mounted', {}, this);
    }
  }, {
    key: "ready",
    value: function ready() {
      var config = this.config;
      var myready = config.onReady || config.ready || config.__ready;

      if (lib.isFunction(myready)) {
        // 小程序组件生命周期 ready / Pager的onReady
        myready.call(this);
      }

      this.hooks.fire('component-has-mounted', {}, this);
    }
  }, {
    key: "reset",
    value: function reset(param, cb) {
      if (lib.isFunction(this.config.reset)) {
        this.config.reset.call(this, param, cb);
      } else {
        this.reactComponentInstance && this.reactComponentInstance.reset(param, cb);
      }
    }
  }, {
    key: "show",
    value: function show() {
      this.__showStat = true;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.__showStat = false;
    }
  }, {
    key: "destory",
    value: function destory() {
      var __key = this.config.__key || this.config.data && this.config.data.__key;

      if (this.$$id) {
        _elements.delElement(this.$$id);
      }

      if (__key) {
        _elements.delElement(__key);
      }

      _elements.delElement(this.uniqId);

      this.reactComponentInstance = null;
      this.hasMounted = false;
      this.isINmemery = undefined;
      this.UI = null;
      this.dom = null;
      this.hooks = null;
    }
  }, {
    key: "setData",
    value: function setData() {
      if (this.config.setData) {
        this.config.setData.apply(this, arguments);
      } else {
        this._setData.apply(this, arguments);
      }
    }
  }, {
    key: "__setData",
    value: function __setData(param, cb) {
      var _marked = /*#__PURE__*/regeneratorRuntime.mark(tmp);

      clearTimeout(this.taskTimmer);
      var that = this;

      if (!this.tasks.length) {
        this.taskData = this.getData();
      } // created


      if (!this.hasMounted) {
        this.__setData(param, cb);

        return;
      } // attached/onload
      // 插入任务前转走


      if (this.hasMounted === 'component_init_set_state') {
        this.__setData(param, cb);

        return;
      }

      if (param) {
        this.tasks.push([param, cb]);
      }

      function tmp(opt) {
        var p, callback;
        return regeneratorRuntime.wrap(function tmp$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                p = opt[0];
                callback = opt[1];
                lib.forEach(p, function (val, ii, ky) {
                  lib.set(that.taskData, ky, val);
                });
                if (lib.isFunction(callback)) callback();
                _context.next = 6;
                return;

              case 6:
                return _context.abrupt("return", function () {
                  that.__setData(that.taskData, callback); // that.taskTimmer = setTimeout(() => {
                  //   that.__setData(that.taskData, callback)
                  // }, 51);

                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _marked);
      }

      var task = this.tasks.shift();
      var gen = tmp(task);
      gen.next();

      if (!this.tasks.length) {
        var res = gen.next();
        var fun = res.value;
        fun();
      } // 方案一结束

    } // 真实setData，可以直接调用

  }, {
    key: "_setData",
    value: function _setData() {
      var _this3 = this;

      var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments.length > 1 ? arguments[1] : undefined;
      if (!lib.isPlainObject(param)) return;
      var result = this.hooks.emit('before-setdata', param, this);

      if (result && result[0]) {
        result = result[0];

        if (lib.isFunction(result.then)) {
          result.then(function (res) {
            return _this3._setData_(res, cb);
          }).catch(function (err) {
            return err;
          });
        } else {
          this._setData_(result, cb);
        }
      } else {
        this._setData_(param, cb);
      }
    }
  }, {
    key: "update",
    value: function update() {
      if (lib.isFunction(this.config.update)) {
        this.config.update.apply(this, arguments);
      }
    }
  }, {
    key: "render",
    value: function render(props) {
      var UI = this.UI;
      return lib.isPlainObject(props) ? /*#__PURE__*/React.createElement(UI, props) : /*#__PURE__*/React.createElement(UI, null);
    }
  }]);

  return baseClass;
}();

// 扩展内部模板
function extTemplate() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _partment.extendsTemplate)(params);
}

function setUniqId(param) {
  var _uid = param.uniqId || param.data.uniqId;

  if (_uid) return param;else {
    param.uniqId = lib.uniqueId('base_');

    if (param.data) {
      param.data.uniqId = param.uniqId;
      delete param.uniqId;
    }
  }
  return param;
}
/**
 * 
 * @param {Object} param param.data = state，param的其它参数作为实例属性
 * @param {*} template react需要的模板
 * @param {*} splitProps 分离props数据和state数据
 */


function _default() {
  var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var template = arguments.length > 1 ? arguments[1] : undefined;
  var splitProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (React.isValidElement(param)) {
    return (0, _wrap.default)(param, template);
  }

  var $instance = null;

  if (lib.isFunction(param)) {
    if (lib.isClass(param)) {
      var options = template;

      var __id = options.$$id || options.data.$$id;

      if (__id) {
        $instance = $$(__id);
      }

      var __uniqId = options.uniqId || options.data.uniqId;

      if (__uniqId && !$instance) {
        $instance = $$(__uniqId);
      }

      if (!$instance) {
        $instance = new _hoc.default(param, options, splitProps);
      } else {
        if ($instance.parentInst) {
          var isExist = false;
          ($instance.parentInst.children || []).forEach(function (child) {
            if (child.uniqId === $instance.uniqId) isExist = true;
          });

          if (!isExist) {
            $instance.parentInst.children.push($instance);
          }
        }
      } // options = setUniqId(options)
      // let __uniqId = options.uniqId || options.data.uniqId
      // if (__uniqId && $$(__uniqId)) {
      //   $instance = $$(__uniqId)
      // }
      // else if (__id && $$(__id)) {
      //   $instance = $$(__id)
      // }
      // else {
      //   $instance = new hocClass(param, options, splitProps)
      // }

    } else {
      template = param;
      param = {};
      $instance = new baseClass(param, template, splitProps);
    }
  } else {
    var __key = param.data && param.data.__key;

    if (__key) {
      $instance = $$(__key);
    }

    var _id = param.$$id || param.data.$$id;

    if (_id && !$instance) {
      $instance = $$(_id);
    } // param = setUniqId(param)


    var _uniqId = param.uniqId || param.data.uniqId;

    if (_uniqId && !$instance) {
      $instance = $$(_uniqId);
    }

    if (!$instance) {
      $instance = new baseClass(param, template, splitProps); // __id 和 __uniqId会在实例生成时自动保存

      if (__key) {
        _elements.setElement(__key, $instance);
      }
    } else {
      if ($instance.parentInst) {
        var _isExist = false;
        ($instance.parentInst.children || []).forEach(function (child) {
          if (child.uniqId === $instance.uniqId) _isExist = true;
        });

        if (!_isExist) {
          $instance.parentInst.children.push($instance);
        }
      }
    }
  }

  if (!$instance.UI) {
    var _key = param.data && param.data.__key; // $instance = new baseClass(param, template, splitProps, true)


    $instance = new baseClass(param, template, splitProps);

    if (_key) {
      _elements.setElement(_key, $instance);
    }
  }

  return $instance;
}