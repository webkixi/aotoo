"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var lib = _interopRequireWildcard(require("../lib"));

var _index = require("../_common/index");

var _elements2 = _interopRequireDefault(require("./elements"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _elements = (0, _elements2.default)('core');

function useState(od) {
  var cbRef = React.useRef();

  var _React$useState = React.useState(od),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      data = _React$useState2[0],
      setData = _React$useState2[1];

  React.useEffect(function () {
    cbRef.current && cbRef.current(od);
  }, [od]);
  return [data, function (d, callback) {
    cbRef.current = callback;
    setData(d);
  }];
}

function getFunctionComponent(_data, parent, template, splitProps) {
  var selfStateChanging = false;
  var selfStateChanged = false;
  var oriData = _data;
  var statusCallback = null;
  var $ref = parent.ref;

  function BaseFunctionComponent(props) {
    // 初始化，第一次渲染该组件时
    if (parent.isINmemery === undefined) {
      parent._onload_(props);
    }

    if (parent.uiCount !== 0) {
      parent.uiCount++;
    }

    var uiCount = parent.uiCount;
    var propsData = props.data || {};
    var $data = Object.assign({}, parent.data, propsData); // let state = splitProps ? $data : Object.assign({}, $data, props);

    var state = Object.assign({}, $data, props);

    if (parent.hasMounted === false) {
      oriData = Object.assign({}, state, oriData);
    }

    var _useState = useState(state),
        _useState2 = _slicedToArray(_useState, 2),
        status = _useState2[0],
        setStatus = _useState2[1];

    var _useState3 = useState(parent.__showStat),
        _useState4 = _slicedToArray(_useState3, 2),
        showStat = _useState4[0],
        setShowstat = _useState4[1];

    var context = {
      show: function show(cb) {
        setShowstat(true, cb);
      },
      hide: function hide(cb) {
        setShowstat(false, cb);
      },
      reset: function reset(param, cb) {
        parent.children.forEach(function (it) {
          return it.destory();
        });
        parent.children = [];
        this.setSelfState(param || oriData, cb);
      },
      syncParentData: function syncParentData() {
        var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        parent.data = lib.merge({}, status, param);
        parent.hooks.emit('sync-state-data', parent.data);
      },
      setSelfState: function setSelfState(param, cb) {
        if (!parent.hasMounted) return;
        selfStateChanging = true;
        selfStateChanged = false;

        var setMYstate = function setMYstate(param) {
          var $state = lib.cloneDeep(status);

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
        setStatus(param, cb);
      }
    };
    context.syncParentData();
    parent.reactComponentInstance = context;
    React.useEffect(function () {
      var _ref = $ref || {},
          current = _ref.current;

      parent.dom = current;
      parent.hasMounted = true;
      parent.isINmemery = false;
      parent.hooks.emit('sync-state-data', parent.data);

      if (parent.uiCount === 0) {
        parent.uiCount++;

        parent._ready_();
      } else {
        parent.didUpdate();
      }

      return function () {
        if (selfStateChanging) {
          selfStateChanging = false;
          selfStateChanged = true;
        } else {
          if (uiCount !== parent.uiCount) return;
          selfStateChanging = false;
          selfStateChanged = false;
          parent.hasMounted = false;
          parent.isINmemery = true;
          parent.removeParentChild(); // 清除父级的父级的该实例的子元素

          var unLoad = parent.onUnload || parent.componentWillUnmount || parent.detached;

          if (lib.isFunction(unLoad)) {
            unLoad.call(parent);
          }
        }
      };
    }); // }, [status])

    if (showStat) {
      var cloneState = lib.cloneDeep(status);
      var cloneProps = lib.cloneDeep(props);
      var JSX = template.call(parent, cloneState, cloneProps, $ref);

      if (lib.isPromise(JSX)) {
        return /*#__PURE__*/React.createElement(ReturnPromiseComponent, {
          content: JSX,
          loadingClass: cloneState.loadingClass || ''
        });
      }

      if (lib.isString(JSX.type)) {
        return React.cloneElement(JSX, {
          ref: $ref
        });
      } else {
        return JSX;
      }
    } else {
      return null;
    }
  } // return React.forwardRef(BaseFunctionComponent)


  return BaseFunctionComponent;
}

module.exports = getFunctionComponent;