"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContextCallback = getContextCallback;
exports.$$ = $$;
exports.ReturnPromiseComponent = ReturnPromiseComponent;
exports.extTemplate = extTemplate;
exports["default"] = _default;
exports.lib = exports._elements = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _elements2 = _interopRequireDefault(require("./elements"));

var _hoc = _interopRequireDefault(require("./hoc"));

var _partment = require("../_common/partment");

var lib = _interopRequireWildcard(require("../lib"));

exports.lib = lib;

var _index = require("../_common/index");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var context = lib.curContext();
context.React = _react["default"];

if (lib.isNode()) {// context.ReactDOM = null
  // context.ReactDom = null
} else {
  context.ReactDOM = _reactDom["default"];
  context.ReactDom = _reactDom["default"];
}

var _elements = (0, _elements2["default"])('core');

exports._elements = _elements;

function getContextCallback(ctx, f) {
  if (!f) return;

  if (ctx) {
    if (ctx[f]) return ctx;else {
      return getContextCallback(ctx.parentInst, f);
    }
  }
}

function $$(id) {
  return _elements.getElement(id);
}

function ReturnPromiseComponent(props) {
  var _React$useState = React.useState( /*#__PURE__*/React.createElement("div", {
    className: 'ui-loading ' + (props.loadingClass || '')
  })),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      value = _React$useState2[0],
      setValue = _React$useState2[1];

  React.useEffect(function () {
    props.content.then(function (value) {
      setValue(value);
    });
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, value);
}

function getReactComponentClass(_data, parent, template, splitProps) {
  var selfStateChanging = false;
  var selfStateChanged = false;

  var InnerClass = /*#__PURE__*/function (_React$Component) {
    _inherits(InnerClass, _React$Component);

    var _super = _createSuper(InnerClass);

    function InnerClass(props) {
      var _this;

      _classCallCheck(this, InnerClass);

      _this = _super.call(this, props);
      var propsData = props.data;
      _data = Object.assign({}, _data, propsData);
      var myState = splitProps ? _data : Object.assign({}, _data, props);
      _this.state = myState;
      _this.template = template;
      _this.selfStateChanging = false;
      _this.selfStateChanged = false;
      _this.oriState = lib.cloneDeep(myState);
      _this.id = props.id || myState.id;
      if (props.id) parent.id = _this.id;
      _this.ref = React.createRef();
      parent.ref = _this.ref;
      parent.reactComponentInstance = _assertThisInitialized(_this);
      _this.setSelfState = _this.setSelfState.bind(_assertThisInitialized(_this));
      _this.reset = _this.reset.bind(_assertThisInitialized(_this));
      _this.syncParentData = _this.syncParentData.bind(_assertThisInitialized(_this));

      if (!parent.isINmemery) {
        parent._onload_(_this.props);
      }

      _this.syncParentData();

      return _this;
    } // 组件内修改state后，不允许props从外部污染数据
    // reset之后，恢复从props穿透数据渲染


    _createClass(InnerClass, [{
      key: "reset",
      value: function reset(param) {
        this.setSelfState(param || this.oriState);
        this.selfStateChanged = false;
        selfStateChanged = false;
      }
    }, {
      key: "syncParentData",
      value: function syncParentData() {
        var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var state = lib.cloneDeep(this.state);
        parent.data = lib.merge({}, state, param);
        parent.hooks.emit('sync-state-data', parent.data);
      }
    }, {
      key: "setSelfState",
      value: function setSelfState(param, cb) {
        var _this2 = this;

        if (!parent.hasMounted) return;
        this.selfStateChanging = true;
        this.selfStateChanged = true;
        selfStateChanging = true;
        selfStateChanged = true;

        var setMYstate = function setMYstate(param) {
          var $state = _this2.state;

          if (lib.isPlainObject(param)) {
            Object.keys(param).forEach(function (ky) {
              var val = param[ky];
              lib.set($state, ky, val);
            });
          }

          var events = {};

          for (var ky in $state) {
            var val = $state[ky];

            if ((0, _index.isEvents)(ky)) {
              if (['item', 'list'].indexOf(parent.$$is) === -1) {
                events[ky] = val;
              }
            } else {
              if (lib.isFunction(val)) {
                parent[ky] = val;
              }
            }
          }

          events = (0, _index.bindEvents)(events, parent);
          return Object.assign($state, events);
        };

        param = setMYstate(param);
        this.syncParentData(param);

        var setStat = function setStat() {
          _this2.selfStateChanging = false;
          selfStateChanging = false;
          if (lib.isFunction(cb)) cb();
        };

        if (parent.hasMounted === 'component_init_set_state') {
          this.state = param;
          setStat();
        } else {
          this.setState(param, setStat);
        }
      } // 未实现，应该是该组件出现在可视窗口中时，运用lazyload的概念
      // 应该只针对page级别的组件
      // onShow(){}  
      // onReady

    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var current = this.ref.current;
        parent.dom = current;
        parent.hasMounted = true;
        parent.isINmemery = false;
        parent.hooks.emit('sync-state-data', parent.data);

        parent._ready_();
      } // 父级传导数据触发更新  -----  step 1

    }, {
      key: "getSnapshotBeforeUpdate",
      // 父级传导数据触发更新  -----  step 2
      // shouldComponentUpdate(nextProps, nextState)
      // update ---- before
      // 在render之前调用，state已更新
      value: function getSnapshotBeforeUpdate(prevProps, prevState) {
        if (lib.isFunction(parent.getSnapshotBeforeUpdate)) {
          return parent.getSnapshotBeforeUpdate(prevProps, prevState);
        }

        return null;
      } // update ----- after
      // 在render之后调用，state已更新
      // snapshot 为getSnapshotBeforeUpdate方法返回的值

    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState, snapshot) {
        parent.componentDidUpdate && parent.componentDidUpdate(prevProps, prevState, snapshot);
        parent.didUpdate(prevProps, prevState, snapshot);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        parent.hasMounted = false;
        parent.isINmemery = true;
        var unLoad = parent.onUnload || parent.componentWillUnmount;

        if (lib.isFunction(unLoad)) {
          unLoad.call(parent);
        }
      } // static getDerivedStateFromError(error)
      // componentDidCatch(error, info)

    }, {
      key: "render",
      value: function render() {
        if (parent.__showStat) {
          var state = lib.cloneDeep(this.state);
          var props = lib.cloneDeep(this.props);
          var JSX = template.call(parent, state, props, this.ref);

          if (lib.isFunction(JSX.then)) {
            return /*#__PURE__*/React.createElement(ReturnPromiseComponent, {
              content: JSX,
              loadingClass: state.loadingClass || ''
            });
          }

          if (lib.isString(JSX.type)) {
            return React.cloneElement(JSX, {
              ref: this.ref
            });
          } else {
            return JSX;
          }
        } else {
          return null;
        }
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        if (selfStateChanging) {
          return state;
        } else {
          var res = props;

          if (lib.isFunction(parent.getDerivedStateFromProps)) {
            res = parent.getDerivedStateFromProps(props, state) || {};
          } // let propsData = res.data||res
          // res = Object.assign({}, state, propsData)


          if (!selfStateChanged) {
            // 当没有内部更新，自动放行props的数据
            return res;
          } else {
            if (parent.alwaysSyncProps) {
              return res;
            }

            if (splitProps) {
              if (res && res.forceSyncProps) {
                return res;
              }

              return null;
            }
          }
        }

        return null;
      }
    }]);

    return InnerClass;
  }(React.Component);

  return InnerClass;
} // function setContainerDom(ele) {
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

  if (this.reactComponentInstance && this.hasMounted) {
    this.reactComponentInstance.setSelfState(param, cb);
  } else {
    // created生命周期中
    this.data = Object.assign({}, this.data, param);
  }
}

var baseClass = /*#__PURE__*/function () {
  function baseClass() {
    var _this3 = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var template = arguments.length > 1 ? arguments[1] : undefined;
    var splitProps = arguments.length > 2 ? arguments[2] : undefined;

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
    this.config = _param;
    this.uniqId = _param.__key || _data.__key || lib.uniqueId('base_');
    var defaultData = {// alwaysSyncProps: false
    };
    this.alwaysSyncProps = this.config.alwaysSyncProps || false; // 是否持续更新props(任何时候)

    this.__showStat = _data.hasOwnProperty('show') ? _data.show : true;
    this.id = _data.id;
    this.dom = null; // 真实dom实例，最外层的容器

    this.hasMounted = false;
    this.data = Object.assign({
      uniqId: this.uniqId
    }, defaultData, _data);
    this.hooks = lib.hooks(lib.uniqueId('baseClass_'));
    this.children = [];
    this.events = null; // data中的event合集
    // 祖先节点

    if ((this.data.fromComponent || this.data.rootComponent) && (this.data.fromComponent || this.data.rootComponent) !== this.uniqId) {
      this.componentInst = $$(this.data.fromComponent);
      this.rootInstance = this.componentInst;
    } // 父级节点


    if (this.data.__fromParent && this.data.__fromParent !== this.uniqId) {
      this.parentInst = $$(this.data.__fromParent);

      if (this.parentInst) {
        var isExist = false;
        (this.parentInst.children || []).forEach(function (child) {
          if (child.uniqId === _this3.uniqId) isExist = true;
        });

        if (!isExist) {
          this.parentInst.children.push(this);
        }
      }
    } else {
      this.data.fromComponent = this.uniqId;
      this.data.rootComponent = this.uniqId;
    }

    this.data.__fromParent = this.uniqId; // react组件内部的上下文环境

    Object.defineProperty(this, "reactComponentInstance", lib.protectProperty(null)); // react dom销毁后，实例是否仍驻内存

    Object.defineProperty(this, "isINmemery", lib.protectProperty()); // 渲染过后把jsx存储在本地

    Object.defineProperty(this, "jsx", lib.protectProperty()); // 小程序组件生命周期 attached, page生命周期 onLoad

    Object.defineProperty(this, "_onload_", lib.protectProperty(_onload_.bind(this))); // 小程序组件生命周期 ready, page生命周期 onReady

    Object.defineProperty(this, "_ready_", lib.protectProperty(_ready_.bind(this)));
    Object.defineProperty(this, "_setData_", lib.protectProperty(_setData_.bind(this))); // 存储实例

    _elements.setElement(this.uniqId, this);

    if (_data.$$id) {
      this.$$id = _data.$$id;
      this.id = this.$$id;

      _elements.setElement(this.$$id, this);
    } // 批量设置实例属性


    Object.keys(_property).forEach(function (ky) {
      if (_index.internalKeys.indexOf(ky) === -1) {
        _this3[ky] = _property[ky];
      }
    });
    this.created(); // 小程序组件生命周期 created

    var UI = getReactComponentClass(this.data, this, template, splitProps);

    this.UI = function (props) {
      that.jsx = that.jsx || /*#__PURE__*/React.createElement(UI, props);
      return that.jsx;
    };
  }

  _createClass(baseClass, [{
    key: "created",
    value: function created() {
      var _this4 = this;

      this.tasks = []; // setData的更新任务

      this.taskData = this.getData();
      this.taskStat = true; // setData的更新状态

      this.taskTimmer = null;
      var config = this.config;
      var $data = this.data;
      var events = {};
      lib.forEach($data, function (val, ii, ky) {
        if ((0, _index.isEvents)(ky)) {
          if (['item', 'list'].indexOf(_this4.$$is) === -1) {
            events[ky] = val;
          }
        } else {
          if (lib.isFunction(val)) {
            _this4[ky] = val;
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
    key: "ready",
    value: function ready() {
      var config = this.config;
      var myready = config.onReady || config.ready || config.__ready;

      if (lib.isFunction(myready)) {
        // 小程序组件生命周期 ready / Pager的onReady
        myready.call(this);
      }
    }
  }, {
    key: "getData",
    value: function getData() {
      if (this.tasks.length || this.taskTimmer) {
        return lib.cloneDeep(this.taskData);
      }

      return lib.cloneDeep(this.data);
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
    }
  }, {
    key: "reset",
    value: function reset(param) {
      this.reactComponentInstance && this.reactComponentInstance.reset(param);
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
      if (this.$$id) {
        _elements[this.$$id] = null;
      }

      this.reactComponentInstance = null;
      this.hasMounted = false;
      this.isINmemery = false;
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
      var _this5 = this;

      var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments.length > 1 ? arguments[1] : undefined;
      if (!lib.isPlainObject(param)) return;
      var result = this.hooks.emit('before-setdata', param, this);

      if (result && result[0]) {
        result = result[0];

        if (lib.isFunction(result.then)) {
          result.then(function (res) {
            return _this5._setData_(res, cb);
          })["catch"](function (err) {
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
  (0, _partment.extendsTemplate)(params);
}

function setUniqKey(param) {
  if (param.key || param.data && param.data.key) {
    var key = param.key || param.data && param.data.key;
    param.__key = key;
  }

  if (param.__key || param.data && param.data.__key) {
    var _key = param.__key || param.data && param.data.__key;

    param.__key = _key;
  }

  return param;
}
/**
 * 
 * @param {Object} param param.data = state，param的其它参数作为实例属性
 * @param {*} template react需要的模板
 * @param {*} splitProps 分离props数据和state数据
 */


function _default(param, template) {
  var splitProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (lib.isFunction(param)) {
    if (lib.isClass(param)) {
      var options = template;
      options = setUniqKey(options);

      if (options.__key && $$(options.__key)) {
        return $$(options.__key);
      }

      return new _hoc["default"](param, options, splitProps);
    }

    template = param;
    param = {};
    return new baseClass(param, template, splitProps);
  }

  param = setUniqKey(param);

  if (param.__key && $$(param.__key)) {
    return $$(param.__key);
  }

  if (param.$$id && $$(param.$$id)) {
    return $$(param.$$id);
  }

  return new baseClass(param, template, splitProps);
}