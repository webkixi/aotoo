"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = item;

var _core = _interopRequireWildcard(require("../core"));

var _foritem = require("./_common/foritem");

var _common = require("../_common");

var _getconfig = _interopRequireDefault(require("./_common/getconfig"));

var _partment = _interopRequireDefault(require("../_common/partment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var curContext = _core.lib.curContext();

var subClassNames = ['hb-item', 'hf-item', 'hdot-item', 'li-item'];

function rnTemplate(state, props, clsNmae) {
  var attr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var myTemplate = arguments.length > 4 ? arguments[4] : undefined;
  var thisContext = this;
  var events = this.events;
  var animatedStyle = state.animatedStyle; // rn animated.view 样式

  if (typeof animatedStyle === 'function') {
    animatedStyle = animatedStyle.call(thisContext);
  }

  var children = /*#__PURE__*/React.createElement(View, _extends({
    id: state.id,
    key: state.__key,
    className: clsNmae,
    style: state.itemStyle
  }, attr), /*#__PURE__*/React.createElement(React.Fragment, null, myTemplate, props.children));
  var GRE = curContext.globalRNelements;
  var PanResponder = GRE.PanResponder;
  var Animated = GRE.Animated; // onClick  TouchableOpacity
  // onPress  TouchableHighlight
  // tap 
  // aim 
  // touchstart
  // touchmove
  // touchend
  // touchcancel
  // longpress
  // longaim

  var target = children;
  var helperTapEventsType = ['onClick', 'onPress', 'onMouseDown'];
  var customTouchEventsType = ['onTouchStart', 'onTouchEnd', 'onTouchMove', 'onTouchCancel'];

  if (GRE.TouchableOpacity) {
    var dealCustomTapEvent = function dealCustomTapEvent(eventKey, callback, otherCallback) {
      var eventFunContext = callback.context;
      var startRep = {};

      if (eventKey === 'tap' || eventKey === 'longpress') {
        startRep = {
          onStartShouldSetPanResponder: function onStartShouldSetPanResponder(evt, gestureState) {
            return true;
          }
        };
      }

      if (eventKey === 'aim' || eventKey === 'longaim') {
        startRep = {
          onStartShouldSetPanResponderCapture: function onStartShouldSetPanResponderCapture(evt, gestureState) {
            return true;
          }
        };
      }

      var attributsResponder = PanResponder.create(_objectSpread(_objectSpread({}, startRep), {}, {
        onPanResponderGrant: function onPanResponderGrant(evt, gestureState) {
          // 手指接触后
          clearTimeout(longpressTimeId);

          if (typeof otherCallback === 'function') {
            // longpress longaim
            longpressTimeId = setTimeout(function () {
              longpressDone = true;
              otherCallback.call(thisContext, evt, gestureState);
            }, 600);
          }
        },
        onPanResponderRelease: function onPanResponderRelease(evt, gestureState) {
          // 手指释放
          if (!longpressTimeId) {
            callback.call(thisContext, evt, gestureState);
          } else {
            clearTimeout(longpressTimeId);

            if (!longpressDone) {
              callback.call(thisContext, evt, gestureState);
            }

            longpressDone = false;
          }
        }
      }));
      return attributsResponder.panHandlers;
    };

    var dealCustomTouchEvent = function dealCustomTouchEvent() {
      var touchEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var touchstartItem = null;
      var touchmoveItem = null;
      var touchendItem = null;
      var touchcancelItem = null;
      var startRep = {
        onStartShouldSetPanResponder: function onStartShouldSetPanResponder(evt, gestureState) {
          return true;
        }
      };
      touchEvents.forEach(function (item) {
        var evtKey = item[0];
        var evtFun = item[1];

        if (evtKey === 'onTouchStart') {
          touchstartItem = item;

          startRep.onMoveShouldSetPanResponder = function (evt, gestureState) {
            return true;
          };
        }

        if (evtKey === 'onTouchMove') {
          // const evtResult = evtFun.call(thisContext)
          // touchmoveItem = evtResult ? evtResult : item
          if (_core.lib.isPlainObject(item[1])) {
            item[1] = function () {
              return item[1];
            };
          }

          touchmoveItem = item;

          startRep.onMoveShouldSetPanResponder = function (evt, gestureState) {
            return true;
          };
        }

        if (evtKey === 'onTouchEnd') {
          touchendItem = item;
        }

        if (evtKey === 'onTouchCancel') {
          touchcancelItem = item;
        }
      });
      var attributsResponder = PanResponder.create(_objectSpread(_objectSpread({}, startRep), {}, {
        onPanResponderGrant: function onPanResponderGrant(evt, gestureState) {
          if (touchstartItem) {
            clearTimeout(longpressTimeId);
            longpressDone = false;
            var evtFun = touchstartItem[1];

            if (typeof evtFun === 'function') {
              evtFun.call(thisContext, evt, gestureState);
            }
          }
        },
        onPanResponderMove: touchmoveItem[1].call(thisContext) || function (evt, gestureState) {
          if (touchmoveItem) {
            var evtFun = touchmoveItem[1];

            if (typeof evtFun === 'function') {
              evtFun.call(thisContext, evt, gestureState);
            }
          }

          if (touchcancelItem) {
            var _evtFun = touchcancelItem[1];

            if (typeof _evtFun === 'function') {
              _evtFun.call(thisContext, evt, gestureState);
            }
          }
        },
        onPanResponderRelease: function onPanResponderRelease(evt, gestureState) {
          if (touchendItem) {
            var evtFun = touchendItem[1];

            if (typeof evtFun === 'function') {
              evtFun.call(thisContext, evt, gestureState);
            }
          }
        }
      }));
      return attributsResponder.panHandlers;
    };

    var longpressTimeId = null;
    var longpressDone = false;
    helperTapEventsType.forEach(function (evk) {
      if (events[evk]) {
        var eventFun = events[evk];
        var eventOriKey = eventFun.__oriEventKey__;
        var _context = eventFun.context;

        if (evk === 'onClick') {
          if (eventOriKey) {
            // tap, aim会转换key名为onClick
            var otherCallback = null;

            if (events['onMouseDown'] && events['onMouseDown'].__oriEventKey__) {
              otherCallback = events['onMouseDown'];
            }

            var pressResponder = dealCustomTapEvent(eventOriKey, eventFun, otherCallback);
            target = React.cloneElement(target, pressResponder);
          } else {
            var TouchableOpacity = GRE.TouchableOpacity;
            target = /*#__PURE__*/React.createElement(TouchableOpacity, {
              onPress: events[evk]
            }, target);
          }

          if (animatedStyle) {
            target = /*#__PURE__*/React.createElement(Animated.View, {
              style: animatedStyle
            }, target);
          }
        }

        if (evk === 'onPress') {
          var TouchableHighlight = GRE.TouchableHighlight;
          target = /*#__PURE__*/React.createElement(TouchableHighlight, {
            onPress: events[evk]
          }, target);
        }

        if (evk === 'onMouseDown') {
          if (eventOriKey === 'longpress') {
            if (events['onPress'] || events['onClick'] && !events['onClick'].__oriEventKey__) {
              target = React.cloneElement(target, {
                onLongPress: events[evk]
              });
            } else {
              var longPressResponder = dealCustomTapEvent(eventOriKey, eventFun);

              if (!events['onClick']) {
                target = React.cloneElement(target, longPressResponder);
              }
            }
          }
        }
      }
    }); // touch事件

    var touchEvents = [];
    var touchResponder = {};
    customTouchEventsType.forEach(function (evk) {
      if (events[evk]) {
        var eventFun = events[evk];
        touchEvents.push([evk, eventFun]);
      }
    });

    if (touchEvents.length) {
      touchResponder = dealCustomTouchEvent(touchEvents);
      target = /*#__PURE__*/React.createElement(Animated.View, _extends({
        style: animatedStyle
      }, touchResponder), target);
    }

    return target;
  }
}

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
  var partElement = (0, _partment.default)();
  sort = sort.filter(function (ky) {
    return partElement[ky] ? true : false;
  });
  var myTemplate = sort.map(function (ky, ii) {
    var elementKey = _core.lib.uniqueId('part_');

    var value = state[ky];
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: elementKey
    }, partElement[ky](value, undefined, state, props)); // return partElement[ky](value, state, props, elementKey, _ky)
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

  if (_core.lib.isReactNative() && curContext.globalRNelements) {
    return rnTemplate.call(this, state, props, clsNmae, attr, myTemplate);
  }

  return /*#__PURE__*/React.createElement(View, _extends({
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
    var data = this.getData();
    var $itemClass = (0, _foritem.addClass)(data, cls, cb);
    this.update({
      itemClass: $itemClass
    }, cb); // if (cls) {
    //   cls = cls.replace(/\./g, '')
    //   cls = lib.isString(cls) ? cls.split(' ') : []
    //   let $item = this.getData()
    //   let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
    //   cls = cls.filter(cls => $itemClass.indexOf(cls) == -1)
    //   $itemClass = $itemClass.concat(cls)
    //   this.update({
    //     itemClass: $itemClass.join(' ')
    //   }, cb)
    // }
  },
  removeClass: function removeClass(cls, cb) {
    var data = this.getData();
    var $itemClass = (0, _foritem.removeClass)(data, cls, cb);
    this.update({
      itemClass: $itemClass || ' '
    }, cb); // if (cls) {
    //   cls = cls.replace(/\./g, '')
    //   cls = lib.isString(cls) ? cls.split(' ') : []
    //   let $item = this.getData()
    //   let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
    //   let _cls = $itemClass.filter(c => c.indexOf(cls) === -1)
    //   $itemClass = _cls
    //   this.update({
    //     itemClass: ($itemClass.join(' ') || ' ')
    //   }, cb)
    // }
  },
  hasClass: function hasClass(cls) {
    var data = this.getData();
    return (0, _foritem.hasClass)(data, cls); // if (cls) {
    //   cls = cls.replace(/\./g, '')
    //   cls = lib.isString(cls) ? cls.split(' ') : []
    //   let len = cls.length
    //   let $item = this.getData()
    //   let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
    //   cls = cls.filter(c => $itemClass.indexOf(c) !== -1)
    //   return len === cls.length ? true : false
    // }
  },
  css: function css(params, cb) {
    var data = this.getData();
    var itemStyle = (0, _foritem.css)(data, params, cb);
    this.update({
      itemStyle: itemStyle
    }, cb); // if (!lib.isPlainObject(params)) {
    //   console.warn('不符合react的内联样式格式');
    //   return
    // }
    // let $item = this.getData()
    // let itemStyle = Object.assign({}, ($item.itemStyle||{}), params)
    // this.update({ itemStyle }, cb)
  },
  toggleClass: function toggleClass(cls, cb) {
    _foritem.toggleClass.call(this, cls, cb); // if (cls) {
    //   let clsAry = lib.isString(cls) ? cls.split(' ') : []
    //   if (clsAry.length) {
    //     cls = clsAry[0]
    //     if (this.hasClass(cls)) {
    //       this.removeClass(cls, cb)
    //     } else {
    //       this.addClass(cls, cb)
    //     }
    //   }
    // }

  },
  disable: function disable() {
    this.addClass('disabled _disabled');
  },
  enable: function enable() {
    this.removeClass('disabled _disabled');
  },
  siblings: function siblings(indentify) {
    var _this2 = this;

    if (this.parentInst) {
      var allChilds = this.parentInst.children;
      var broChilds = allChilds.filter(function (child) {
        return child.uniqId !== _this2.uniqId;
      });

      if (indentify) {
        broChilds = broChilds.filter(function (child) {
          return child.hasClass(indentify);
        });
      }

      var obj = {};
      obj = _objectSpread({}, broChilds);
      obj.length = broChilds.length;
      Object.setPrototypeOf(obj, {
        forEach: [].forEach,
        addClass: function addClass() {
          var _arguments = arguments;
          this.forEach(function (it) {
            return it.addClass.apply(it, _arguments);
          });
        },
        removeClass: function removeClass() {
          var _arguments2 = arguments;
          this.forEach(function (it) {
            return it.removeClass.apply(it, _arguments2);
          });
        },
        toggleClass: function toggleClass() {
          var _arguments3 = arguments;
          this.forEach(function (it) {
            return it.toggleClass.apply(it, _arguments3);
          });
        },
        hasClass: function hasClass() {},
        show: function show() {
          this.forEach(function (it) {
            return it.show();
          });
        },
        hide: function hide() {
          this.forEach(function (it) {
            return it.hide();
          });
        },
        reset: function reset() {
          var _arguments4 = arguments;
          this.forEach(function (it) {
            return it.reset.apply(it, _arguments4);
          });
        },
        disable: function disable() {
          var _arguments5 = arguments;
          this.forEach(function (it) {
            return it.disable.apply(it, _arguments5);
          });
        },
        enable: function enable() {
          var _arguments6 = arguments;
          this.forEach(function (it) {
            return it.enable.apply(it, _arguments6);
          });
        },
        css: function css() {
          var _arguments7 = arguments;
          this.forEach(function (it) {
            return it.css.apply(it, _arguments7);
          });
        },
        attr: function attr() {
          var _arguments8 = arguments;
          this.forEach(function (it) {
            return it.attr.apply(it, _arguments8);
          });
        }
      });
      return obj;
    }
  }
};

function item() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // ??? options === string   options === reactElement options === reactClass
  var config = (0, _getconfig.default)(options);
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

  return (0, _core.default)(config, template);
}

var context = _core.lib.curContext();

if (!context.ui_item) {
  context.ui_item = item;
}