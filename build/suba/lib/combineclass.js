'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CombineClass = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.createCombinClass = createCombinClass;

var _util = require('./util');

var _lifecycle = require('./lifecycle');

var _aotooeventemitter = require('./aotooeventemitter');

var _aotooeventemitter2 = _interopRequireDefault(_aotooeventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const evts = ['on', 'off', 'emit', 'roll', 'hasOn', 'pop', 'set', 'get', 'append', 'update', 'bind', 'unbind']
var evts = ['on', 'off', 'emit', 'roll', 'hasOn'];

function embedPlugins(ctx, extensions) {
  if ((0, _util.isObject)(extensions)) {
    (0, _util.forEach)(extensions, function (ext, ii) {
      var plug = extensions[ext];
      if ((0, _util.isFunction)(plug)) {
        ctx[ext] = plug;
      }
    });
  }
}

function embedActions(ctx, inst) {
  var actionsLowerCaseNames = inst['_actionMethodlowerCaseNames'];
  (0, _util.forEach)(actionsLowerCaseNames, function (ii, item) {
    ctx[item] = inst[item].bind(inst);
  });
}

function AotooHoc(oriReactClass, actions, inst) {
  var AotooClass = function (_oriReactClass) {
    _inherits(AotooClass, _oriReactClass);

    function AotooClass(props) {
      _classCallCheck(this, AotooClass);

      var _this = _possibleConstructorReturn(this, (AotooClass.__proto__ || Object.getPrototypeOf(AotooClass)).call(this, props));

      _this.props = _this.props || props;

      (0, _util.forEach)(evts, function (ii, evt) {
        _this[evt] = inst[evt].bind(inst);
      });
      _this.dispatch = inst.dispatch.bind(inst);
      _this.setComponentState = function (obj) {
        if ((0, _util.isObject)(obj)) {
          inst.curState = obj;
          this.setState(obj);
        }
      }.bind(_this);
      embedPlugins(_this, inst.embeds); // 绑定外部插件
      embedActions(_this, inst); // 绑定actions的方法

      inst.originalState = (0, _util.cloneDeep)(_this.state || {});
      inst.liveState = _this.state;
      inst.xInst = _this;
      // this.saxer = inst
      _this.saxer = inst._saxer(inst);
      _this.config = inst.config;
      _this.intent = _this.props.intent || _this.props.idf || 0;
      return _this;
    }

    _createClass(AotooClass, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        inst._hasMounted = false;
        _get(AotooClass.prototype.__proto__ || Object.getPrototypeOf(AotooClass.prototype), 'componentWillUnmount', this) ? _get(AotooClass.prototype.__proto__ || Object.getPrototypeOf(AotooClass.prototype), 'componentWillUnmount', this).call(this) : '';
        inst.unMount.call(inst, this);
        // opts.leave = opts.leave || this.props.leave
        // unMount(opts, this.props, queryer)
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.didUpdate = true;
        _get(AotooClass.prototype.__proto__ || Object.getPrototypeOf(AotooClass.prototype), 'componentDidUpdate', this) ? _get(AotooClass.prototype.__proto__ || Object.getPrototypeOf(AotooClass.prototype), 'componentDidUpdate', this).call(this) : '';
        this.componentDidMount();
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        inst._hasMounted = true;
        if (this.didUpdate = true) {
          this.didUpdate = false;
        }
        var _ctx = {
          refs: this.refs,
          index: this.props.idf
        };
        inst.refs = this.refs;
        _get(AotooClass.prototype.__proto__ || Object.getPrototypeOf(AotooClass.prototype), 'componentDidMount', this) ? _get(AotooClass.prototype.__proto__ || Object.getPrototypeOf(AotooClass.prototype), 'componentDidMount', this).call(this) : '';
        inst.didMount.call(inst, this);
      }
    }, {
      key: 'render',
      value: function render() {
        if (_util.isClient || _util.isReactNative) {
          // if (!inst.fromAotooRender) {
          //   inst.setProps(merge({}, this.props))
          //   inst.fromAotooRender = true //如果从<Instance.x {...}/>过来，需要同步一次props，已经同步过一次，不需要再次同步
          // }
          return _get(AotooClass.prototype.__proto__ || Object.getPrototypeOf(AotooClass.prototype), 'render', this).call(this);
        } else {
          var renderJsx = _get(AotooClass.prototype.__proto__ || Object.getPrototypeOf(AotooClass.prototype), 'render', this).call(this);
          return inst.render(renderJsx);
        }
      }
    }]);

    return AotooClass;
  }(oriReactClass);

  AotooClass.defaultProps = {};

  return AotooClass;
}

/**
 * eeData
 * eeActions
 * on, off, emit ...
 */

var CombineClass = exports.CombineClass = function (_Aee) {
  _inherits(CombineClass, _Aee);

  function CombineClass(reactClass) {
    var actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var embeds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, CombineClass);

    var _this2 = _possibleConstructorReturn(this, (CombineClass.__proto__ || Object.getPrototypeOf(CombineClass)).call(this, config));

    _this2.config = config;
    // this.setProps({
    //   loaderContext: this,
    //   eventContext: this
    // })
    _this2.isClient = _util.isClient;

    // 是否mounted
    Object.defineProperty(_this2, "_hasMounted", (0, _util.protectProperty)(false));
    // 原始state数据
    Object.defineProperty(_this2, "originalState", (0, _util.protectProperty)(undefined));
    // 实时state数据
    Object.defineProperty(_this2, "liveState", (0, _util.protectProperty)(undefined));
    Object.defineProperty(_this2, "curState", (0, _util.protectProperty)(undefined));
    // 新react class的实例
    Object.defineProperty(_this2, "xInst", (0, _util.protectProperty)(undefined));

    Object.defineProperty(_this2, "holdDispatchQueue", (0, _util.protectProperty)([]));
    // react class 绑定后的方法
    Object.defineProperty(_this2, "didMount", (0, _util.protectProperty)(_lifecycle.didMount));
    // react class 解绑后的方法
    Object.defineProperty(_this2, "unMount", (0, _util.protectProperty)(_lifecycle.unMount));

    Object.defineProperty(_this2, "_actionMethodlowerCaseNames", (0, _util.protectProperty)([]));

    // 保存actions
    _this2.embeds = embeds.plugins;
    if ((0, _util.isObject)(actions)) {
      _this2.eeData.actions = actions;
      (0, _util.forEach)(actions, function (actName, ii) {
        var lowerCaseActName = '$' + actName.toLowerCase();
        _this2['_actionMethodlowerCaseNames'].push(lowerCaseActName);
        _this2[lowerCaseActName] = function (params) {
          this.dispatch(actName, params);
          return this;
        };
      });
    }

    // 剔除AotooEventEmitter的数据处理方法
    // 使用data的方法代替以下方法
    _this2.pop = undefined;
    // this.set = undefined
    // this.get = undefined
    _this2.append = undefined;
    _this2.update = undefined;

    _this2.data = function (key, val) {
      if (!key) {
        return this.eeData;
      }

      if ((0, _util.isString)(key)) {
        if (!val) {
          return this.eeData[key];
        } else {
          this.eeData[key] = val;
          return this;
        }
      }

      if ((0, _util.isObject)(key)) {
        if (val === true) {
          this.eeData = key;
        } else {
          this.eeData = (0, _util.merge)(this.eeData, key);
        }
      }
    };

    _this2.saxer = _this2._saxer(_this2);
    // this.x = AotooHoc(reactClass, actions, this)
    _this2.HocClass = AotooHoc(reactClass, actions, _this2);
    _this2.x = function () {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.setProps(props);
      return this.render();
    }.bind(_this2);
    return _this2;
  }

  _createClass(CombineClass, [{
    key: '_saxer',
    value: function _saxer(ctx) {
      return {
        on: this.on.bind(ctx),
        off: this.off.bind(ctx),
        emit: this.emit.bind(ctx),
        roll: this.roll.bind(ctx),
        hasOn: this.hasOn.bind(ctx),
        set: this.data.bind(ctx),
        get: this.data.bind(ctx),
        append: this.data.bind(ctx),
        update: this.data.bind(ctx),
        data: this.data.bind(ctx)
      };
    }
  }, {
    key: 'getState',
    value: function getState() {
      // return this.liveState
      return this.curState || this.liveState;
    }
  }, {
    key: 'dispatch',
    value: function dispatch(key, params) {
      var _this3 = this;

      if (_util.isClient) {
        setTimeout(function () {
          dispatcher(key, params, _this3);
        }, 0);
      }
    }
  }, {
    key: 'hasMounted',
    value: function hasMounted() {
      return this._hasMounted;
    }
  }, {
    key: 'extend',
    value: function extend(exts) {
      var _this4 = this;

      if ((typeof exts === 'undefined' ? 'undefined' : _typeof(exts)) == 'object') {
        (0, _util.forEach)(exts, function (key, ii) {
          var rightValue = exts[key];
          if ((0, _util.isFunction)(rightValue)) {
            _this4[key] = rightValue.bind(_this4);
          } else {
            _this4[key] = rightValue;
          }
        });
      }
    }
  }, {
    key: 'setConfig',
    value: function setConfig(config) {
      this.config = config || {};
      return this;
    }
  }, {
    key: 'setProps',
    value: function setProps(props) {
      // this.config.props = props
      this.config.props = (0, _util.merge)({}, this.config.props, props);
      return this;
    }
  }, {
    key: 'render',
    value: function render(id, callback) {
      if (_util.isServer && id && React.isValidElement(id)) {
        var self = this;
        setTimeout(function () {
          self.destyory();
          self.xInst = Object.create(null);
          self.curState = Object.create(null);
          self.liveState = Object.create(null);
          self.originalState = Object.create(null);
          self.config = Object.create(null);
          self.x = Object.create(null);
          self.HocClass = Object.create(null);
        }, 100);
        return id;
      } else {
        // const X = this.x
        var X = this.HocClass;

        if ((0, _util.isFunction)(id)) {
          callback = id;
          id = undefined;
        }

        id = id || this.config.container;

        var _props = this.config.props || {};
        var didMethod = callback || this.rendered || _props.rendered || this.config.rendered;
        _props.rendered = didMethod;

        var leaveMethod = _props.leave || this.config.leave || this.leave;
        _props.leave = leaveMethod;
        this.config.props = _props;

        if (_util.isClient) {
          this.config.container = id;
          return browserRender(id, X, _props, this.config);
        } else {
          return React.createElement(X, _props);
        }
      }
    }
  }]);

  return CombineClass;
}(_aotooeventemitter2.default);

function browserRender(id, X, props, config) {
  // const props = config.props
  if ((0, _util.isString)(id)) {
    if (document.getElementById(id)) {
      ReactDom.render(React.createElement(X, props), document.getElementById(id));
    }
  } else if ((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object' && id.nodeType) {
    // } else if (isObject(id) && id.nodeType) {
    ReactDom.render(React.createElement(X, props), id);
  } else {
    return React.createElement(X, props);
  }
}

/**
 * type 2
 * ComposedComponent 为 React class
 * @type {[type]}
 */
// let curState = undefined
function dispatcher(key, params, control) {
  var xInst = control.xInst;
  if (xInst) {
    var oState = control.originalState;
    // let curState = curState || cloneDeep(xInst.state)
    var curState = control.curState || (0, _util.cloneDeep)(xInst.state);
    var actions = control.data('actions');
    // actions.curState = curState
    var act = actions[key];
    if ((0, _util.isFunction)(act)) {
      var newState = act.call({ curState: curState }, oState, params, control);
      if ((0, _util.isObject)(newState)) {
        control.curState = newState;
        if (control._hasMounted) {
          control._hasMounted = false;
          // curState = undefined
          xInst.setState(newState);
        } else {
          control.holdDispatchQueue.push(newState);
        }
      }
    }
  } else {
    control.holdDispatchQueue.push([key, params]);
  }
}

function createCombinClass(rctCls) {
  var acts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var config = arguments[2];
  var embeds = arguments[3];

  // if (isClient) {
  //   const globalName = uniqueId('Combinex_')
  //   instanceCollection[globalName] = new CombineClass(config, rctCls, acts, exts, globalName)
  //   return instanceCollection[globalName]
  // } else {
  //   return createServerClass(config, rctCls, acts, exts)
  // }

  return new CombineClass(rctCls, acts, config, embeds);
}
//# sourceMappingURL=../../maps/suba/lib/combineclass.js.map
