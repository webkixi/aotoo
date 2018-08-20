'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineX = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.wrap = wrap;

var _util = require('./util');

var _lifecycle = require('./lifecycle');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * [combineX description]
 * @param  {react class | react element}   ComposedComponent [description]
 * @param  {object}   opts              [description]
 * @param  {Function} cb                [description]
 * @return {react class | object}       [description]
 */
function _combineX(ComposedComponent, opts, cb) {
  if ((0, _util.isFunction)(ComposedComponent) || (0, _util.isObject)(ComposedComponent)) {
    var returnReactClass = false;
    if ((0, _util.isObject)(opts) && opts.type == 'reactClass') {
      returnReactClass = true;
      opts.type = undefined;
    }

    if (React.isValidElement(ComposedComponent)) {
      return dealWithReactElement(ComposedComponent, opts, cb);
    }

    if (returnReactClass) {
      return dealWithReactClass(ComposedComponent, opts, cb);
    }
  }
}

/**
 * [dealWithReactElement 处理传入为react element 的场景，一般用于wrap]
 * @param  {react element} CComponent [description]
 * @return {react class}            [description]
 */
function dealWithReactElement(CComponent) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments[2];

  return function (_ref) {
    _inherits(_class, _ref);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this.config = opts;
      _this.intent = _this.props.intent;
      _this.dom;
      // this.rendered = cb
      _this.rendered = function (dom, intent) {
        var ctx = this;
        if ((0, _util.isFunction)(cb)) {
          cb.call(ctx, dom, intent);
        } else {
          if ((0, _util.isObject)(opts) && (0, _util.isFunction)(opts.rendered)) {
            opts.rendered.call(ctx, dom, intent);
          }
        }
      };
      return _this;
    }

    _createClass(_class, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        (0, _lifecycle.unMount)(this);
        // unMount(opts, this.props)
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _ctx = {};
        _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'componentDidMount', this) ? _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'componentDidMount', this).call(this) : '';
        _lifecycle.didMount.call(this, this, opts);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var that = this;
        var props = {},
            evts = {};
        var _props = (0, _util.merge)({}, opts.props, this.props);
        Object.keys(_props).forEach(function (key) {
          if (key.indexOf('on') == 0) {
            if ((0, _util.isFunction)(_props[key])) {
              evts[key] = function (e) {
                _props[key].call(that.dom, e, that.config);
              };
            }
          } else {
            props[key] = _props[key];
          }
        });
        return React.cloneElement(CComponent, _extends({}, props, evts, { ref: function ref(_ref2) {
            return _this2.dom = _ref2;
          } }));
      }
    }]);

    return _class;
  }(React.PureComponent || React.Component);
}

function dealWithReactClass(CComponent) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments[2];

  return function (_CComponent) {
    _inherits(_class2, _CComponent);

    function _class2(props) {
      _classCallCheck(this, _class2);

      var _this3 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props));

      _this3.config = opts;
      _this3.intent = _this3.props.intent;
      // this.rendered = cb
      _this3.rendered = function (dom, intent) {
        var ctx = this;
        if ((0, _util.isFunction)(cb)) {
          cb.call(ctx, dom, intent);
        } else {
          if ((0, _util.isObject)(opts) && (0, _util.isFunction)(opts.rendered)) {
            opts.rendered.call(ctx, dom, intent);
          }
        }
      };
      return _this3;
    }

    _createClass(_class2, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentWillUnmount', this) ? _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentWillUnmount', this).call(this) : '';
        (0, _lifecycle.unMount)(this);
        // unMount(opts, this.props)
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentDidMount', this) ? _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'componentDidMount', this).call(this) : '';
        _lifecycle.didMount.call(this, this, opts);
      }
    }]);

    return _class2;
  }(CComponent);
}

function wrap(ComposedComponent, opts, cb) {
  opts = opts || { type: 'reactClass' };
  if ((0, _util.isObject)(opts)) {
    opts.type = 'reactClass';
  }

  if ((0, _util.isFunction)(opts)) {
    cb = opts;
    opts = { type: 'reactClass' };
  }

  return _combineX(ComposedComponent, opts, cb);
}

var combineX = exports.combineX = wrap;
//# sourceMappingURL=../../maps/suba/lib/wrap.js.map
