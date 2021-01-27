"use strict";

var lib = _interopRequireWildcard(require("../lib"));

var _index = require("../_common/index");

var _elements2 = _interopRequireDefault(require("./elements"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var _elements = (0, _elements2.default)('core');

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
      var propsData = props.data; // _data = Object.assign({}, _data, propsData)

      _data = Object.assign({}, parent.data, propsData); // let myState = splitProps ? _data : Object.assign({}, _data, props);

      var myState = Object.assign({}, _data, props);
      _this.state = myState;
      _this.template = template;
      _this.selfStateChanging = false;
      _this.selfStateChanged = false;
      _this.oriState = lib.cloneDeep(myState);
      _this.id = props.id || myState.id;
      if (props.id) parent.id = _this.id;
      _this.uiCount = parent.uiCount;
      _this.ref = parent.ref;
      _this.env = parent;
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


    _createClass(InnerClass, [{
      key: "reset",
      value: function reset(param, cb) {
        parent.children.forEach(function (it) {
          return it.destory();
        });
        parent.children = [];
        this.setSelfState(param || this.oriState, cb);
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
        if (this.uiCount !== parent.uiCount) return;
        parent.hasMounted = false;
        parent.isINmemery = true;
        parent.removeParentChild(); // 清除父级的父级的该实例的子元素

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
          var state = lib.cloneDeep(this.state);
          var props = lib.cloneDeep(this.props);
          var JSX = template.call(parent, state, props, this.ref); // if (lib.isFunction(JSX.then)) {

          if (lib.isPromise(JSX)) {
            return /*#__PURE__*/React.createElement(ReturnPromiseComponent, {
              content: JSX,
              loadingClass: state.loadingClass || ''
            });
          }

          if (lib.isString(JSX.type)) {
            return JSX; // return React.cloneElement(JSX, { ref: this.ref }) 
          } else {
            return JSX;
          }
        } else {
          return null;
        }
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(nextProps, prevState) {
        var props = nextProps;
        var state = prevState;

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
}

module.exports = getReactComponentClass;