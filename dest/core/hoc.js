"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hocClass;

var lib = _interopRequireWildcard(require("../lib"));

var _index = require("../_common/index");

var _elements2 = _interopRequireDefault(require("./elements"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _elements = (0, _elements2.default)('core');

function combineComponent(ORIClass, options, parent, splitProps) {
  var selfStateChanging = false;
  var selfStateChanged = false;
  return /*#__PURE__*/function (_ORIClass) {
    _inherits(CComponent, _ORIClass);

    var _super = _createSuper(CComponent);

    function CComponent(props) {
      var _this;

      _classCallCheck(this, CComponent);

      _this = _super.call(this, props);

      var _data = parent.data || {}; // let myState = splitProps ? _data : Object.assign({}, _data, props);


      var myState = Object.assign({}, _data, props);
      _this.state = Object.assign({}, _this.state, myState);
      _this.selfStateChanging = false;
      _this.selfStateChanged = false;
      _this.oriState = lib.cloneDeep(_this.state);
      _this.id = props.id || _this.state.id;
      if (props.id) parent.id = _this.id;
      _this.uiCount = parent.uiCount;
      _this.ref = React.createRef();
      _this.env = parent;
      parent.ref = _this.ref;
      parent.reactComponentInstance = _assertThisInitialized(_this);
      _this.setSelfState = _this.setSelfState.bind(_assertThisInitialized(_this));
      _this.reset = _this.reset.bind(_assertThisInitialized(_this));
      _this.syncParentData = _this.syncParentData.bind(_assertThisInitialized(_this));

      if (parent.isINmemery === undefined) {
        // if (!parent.isINmemery) {
        parent._onload_(_this.props);
      }

      _this.syncParentData(_this.props);

      return _this;
    } // 组件内修改state后，不允许props从外部污染数据
    // reset之后，恢复从props穿透数据渲染


    _createClass(CComponent, [{
      key: "reset",
      value: function reset(param) {
        parent.children.forEach(function (it) {
          return it.destory();
        });
        parent.children = [];
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
      } // 父级传导数据触发更新  -----  step 1

    }, {
      key: "getSnapshotBeforeUpdate",
      // 父级传导数据触发更新  -----  step 2
      // shouldComponentUpdate(nextProps, nextState)
      // update ---- before
      // 在render之前调用，state已更新
      value: function getSnapshotBeforeUpdate(prevProps, prevState) {
        if (_get(_getPrototypeOf(CComponent.prototype), "getSnapshotBeforeUpdate", this)) {
          return _get(_getPrototypeOf(CComponent.prototype), "getSnapshotBeforeUpdate", this).call(this, prevProps, prevState);
        }

        if (lib.isFunction(parent.getSnapshotBeforeUpdate)) {
          return parent.getSnapshotBeforeUpdate(prevProps, prevState);
        }

        return null;
      } // onReady

    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var current = this.ref.current;
        parent.dom = current;
        parent.hasMounted = true;
        parent.isINmemery = false;
        _get(_getPrototypeOf(CComponent.prototype), "componentDidMount", this) && _get(_getPrototypeOf(CComponent.prototype), "componentDidMount", this).call(this);
        parent.hooks.emit('sync-state-data', parent.data);

        parent._ready_();
      } // update ----- after
      // 在render之后调用，state已更新
      // snapshot 为getSnapshotBeforeUpdate方法返回的值

    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState, snapshot) {
        _get(_getPrototypeOf(CComponent.prototype), "componentDidUpdate", this) && _get(_getPrototypeOf(CComponent.prototype), "componentDidUpdate", this).call(this, prevProps, prevState, snapshot);
        parent.componentDidUpdate && parent.componentDidUpdate(prevProps, prevState, snapshot);
        parent.didUpdate(prevProps, prevState, snapshot);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.uiCount !== parent.uiCount) return;
        parent.hasMounted = false;
        parent.isINmemery = true;
        parent.removeParentChild();
        _get(_getPrototypeOf(CComponent.prototype), "componentWillUnmount", this) && _get(_getPrototypeOf(CComponent.prototype), "componentWillUnmount", this).call(this);
        var unLoad = parent.onUnload || parent.componentWillUnmount || parent.detached;

        if (lib.isFunction(unLoad)) {
          unLoad.call(parent);
        }
      } // static getDerivedStateFromError(error)
      // componentDidCatch(error, info)

    }, {
      key: "render",
      value: function render() {
        parent.uiCount++;

        if (parent.__showStat) {
          var JSX = _get(_getPrototypeOf(CComponent.prototype), "render", this).call(this);

          return React.cloneElement(JSX, {
            ref: this.ref
          });
        } else {
          return null;
        }
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        if (ORIClass.getDerivedStateFromProps) {
          return ORIClass.getDerivedStateFromProps(props, state);
        }

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

    return CComponent;
  }(ORIClass);
}

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

    if (lib.isFunction(cb)) {
      cb();
    }
  }
}

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

var CombineClass = /*#__PURE__*/function () {
  function CombineClass(oriClass) {
    var _this3 = this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var splitProps = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, CombineClass);

    var _param = lib.cloneDeep(config);

    ;

    var _data = _param.data || {};

    delete _param.data;
    var _property = _param;
    this.config = _param;
    var that = this; // this.uniqId = _param.__key || _data.__key || lib.uniqueId('base_')

    this.uniqId = _param.uniqId || _data.uniqId || lib.uniqueId('base_'); // 存储实例

    _elements.setElement(this.uniqId, this);

    if (config.$$id) {
      this.$$id = config.$$id;
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
          val = val.bind(_this3);
        }

        _this3[ky] = val;
      }
    });
    this.created(); // 小程序组件生命周期 created

    this.UI = combineComponent(oriClass, config, this, splitProps); // let UI = combineComponent(oriClass, config, this, splitProps);
    // this.UI = function(props) {
    //   return <UI {...props} />
    //   // that.jsx = that.jsx || <UI {...props} />
    //   // // that.jsx = that.jsx ? React.cloneElement(that.jsx, props) : <UI {...props} />
    //   // return that.jsx
    // }
  }

  _createClass(CombineClass, [{
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
    key: "didUpdate",
    value: function didUpdate(prevProps, prevState, snapshot) {
      var customDidUpdate = this.config.didUpdate || this.config.__ready;

      if (lib.isFunction(customDidUpdate)) {
        customDidUpdate.call(this, prevProps, prevState, snapshot);
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
      var __key = this.config.__key || this.config.data.__key;

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
      } // 方案一


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

  return CombineClass;
}();

function hocClass(reactComponentClass, options, splitProps) {
  return new CombineClass(reactComponentClass, options, splitProps);
}