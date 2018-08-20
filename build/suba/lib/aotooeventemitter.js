'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.sax = sax;

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eeStock = {};

function appendActions(acts) {
  var eeActions = this.eeActions;
  var actions = {};
  (0, _util.forEach)(acts, function (act, ii) {
    var actValue = acts[act];
    if ((0, _util.isObject)(actValue)) {
      actions[act] = actValue;
    }

    if ((0, _util.isArray)(actValue)) {
      var target = {};
      (0, _util.forEach)(actValue, function (ii, item) {
        if ((0, _util.isFunction)(item)) {
          target[item.guid || ii] = item;
        }
      });
      actions[act] = target;
    }

    if ((0, _util.isFunction)(actValue)) {
      var target = {};
      target[actValue.guid] = actValue;
      actions[act] = target;
    }
  });
  this.eeActions = (0, _util.merge)({}, eeActions, actions);
}

/**
 * AotooEventEmitter
 */

var AotooEventEmitter = function () {
  function AotooEventEmitter() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var instanceName = arguments[1];

    _classCallCheck(this, AotooEventEmitter);

    this.config = config;
    this._id = config._id;
    this.instanceName = instanceName;
    Object.defineProperty(this, 'eeData', (0, _util.protectProperty)({}));
    Object.defineProperty(this, 'eeActions', (0, _util.protectProperty)({}));
    Object.defineProperty(this, 'eeContext', (0, _util.protectProperty)(null));
    this.data = this.eeData;
    // this.eeData = {}
    // this.eeActions = {}
    // this.eeContext = null
  }

  _createClass(AotooEventEmitter, [{
    key: 'destyory',
    value: function destyory() {
      this.eeData = Object.create(null);
      this.eeActions = Object.create(null);
      this.eeContext = undefined;
      if (this.instanceName) {
        eeStock[this.instanceName] = undefined;
      }
    }
  }, {
    key: 'on',
    value: function on(key, onOpts, fun, after) {
      var tmp = {};
      if (!fun) fun = onOpts;
      if ((0, _util.isFunction)(fun)) {
        // if (!fun.guid) fun.guid = fun.name || uniqueId('event_')
        if (!fun.guid) fun.guid = (0, _util.uniqueId)('event_');
        if (after) fun.after = after;
        tmp[key] = fun;
        appendActions.call(this, tmp);
      }

      if ((0, _util.isArray)(fun)) {
        var myFuns = [];
        fun.forEach(function (_fun) {
          if ((0, _util.isFunction)(_fun)) {
            myFuns.push(_fun); // if (!_fun.guid) _fun.guid = uniqueId('event_')
          }
        });
        tmp[key] = myFuns;
        appendActions.call(this, tmp);
      }

      if ((0, _util.isObject)(fun)) {
        tmp = fun;
        appendActions.call(this, tmp);
      }
    }
  }, {
    key: 'one',
    value: function one(key, oneOpts, fun) {
      if (key) {
        // this.on(key, oneOpts, fun)
        // this.set('_one', {[key]: true})
        var that = this;
        this.on(key, oneOpts, fun, function () {
          that.off(key, oneOpts, fun);
        });
      }
    }
  }, {
    key: 'once',
    value: function once(key, onceOpts, fun) {
      if (key) {
        if (this.hasOn(key)) {
          this.off(key);
        }
        this.on(key, onceOpts, fun);
      }
    }
  }, {
    key: 'off',
    value: function off(key, offopts, ccb) {
      var _sact = this.eeActions;
      if (!ccb) ccb = offopts;

      if ((0, _util.isFunction)(ccb)) {
        var valueFuns = _sact[key];
        (0, _util.forEach)(valueFuns, function (_key, ii) {
          if (valueFuns[_key]) {
            if (valueFuns[_key].guid == ccb.guid) {
              // valueFuns[_key] = undefined
              delete valueFuns[_key];
            } else if (valueFuns[_key].name == ccb.name) {
              // valueFuns[_key] = undefined
              delete valueFuns[_key];
            }
          }
        });
      } else {
        _sact[key] = undefined;
      }
    }
  }, {
    key: 'emit',
    value: function emit(key, param) {
      var values = [];
      var _sact = this.eeActions;
      var eeContext = this.eeContext;
      param = param || this.eeData;
      if (_sact[key]) {
        var valueFuns = _sact[key];
        var target = (0, _util.deepFind)(_sact, key);

        // 删除one绑定的方法
        // if (this.eeData._one && this.eeData._one[key]) {
        //   setTimeout(() => {
        //     this.off(key)
        //   }, 100);
        // }

        if ((0, _util.isFunction)(target)) {
          if (target.after && (0, _util.isFunction)(target.after)) {
            setTimeout(function () {
              target.after();
            }, 100);
          }
          return target.call(eeContext, param);
        }
        (0, _util.forEach)(target, function (key, ii) {
          var fun = target[key];
          if ((0, _util.isFunction)(fun)) {
            if (fun.after && (0, _util.isFunction)(fun.after)) {
              setTimeout(function () {
                fun.after();
              }, 100);
            }
            values.push(fun.call(eeContext, param));
          }
        });
        return values.length == 1 ? values[0] : values;
      }
    }
  }, {
    key: 'roll',
    value: function roll() {
      this.emit.apply(this, arguments);
    }
  }, {
    key: 'hasOn',
    value: function hasOn(key) {
      var _sact = this.eeActions;
      return _sact[key] ? true : false;
    }

    // has() { }

  }, {
    key: 'pop',
    value: function pop(key) {
      console.log('======== pop api of aotoo EventEmitter that will be deprecated');
      var _sact = this.eeActions;
      var result;
      if (key) {
        var target = (0, _util.deepFind)(_sact, key);
        if (target) {
          var len = (0, _util.sizeof)(target);
          (0, _util.forEach)(target, function (key, ii) {
            if (ii == len - 1) {
              result = target[key];
              target[key] = undefined;
            }
          });
        }
      }
      return result;
    }
  }, {
    key: 'trigger',
    value: function trigger() {
      console.log('======== trigger api of aotoo EventEmitter that is an empty method');
    }

    //  =====  处理数据  ==========

  }, {
    key: 'set',
    value: function set(key, value) {
      var _sdata = this.eeData;
      _sdata[key] = value;
      return this;
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _sdata = this.eeData;
      return key ? (0, _util.deepFind)(_sdata, key) : _sdata;
    }
  }, {
    key: 'append',
    value: function append(data) {
      var _sdata = this.eeData;
      // if (data) this.eeData = merge({}, _sdata, data)
      if (data) this.eeData = (0, _util.merge)(_sdata, data);
      return this;
    }
  }, {
    key: 'update',
    value: function update(key, data) {
      if ((0, _util.isString)(key)) {
        var target = (0, _util.deepFind)(this.eeData, key);
        if (target) {
          this.eeData[key] = data;
        }
      }
      if ((0, _util.isObject)(key)) {
        this.eeData = key;
      }
    }

    //  =====  处理上下文环境变量  ==========

  }, {
    key: 'bind',
    value: function bind(obj) {
      if ((0, _util.isObject)(obj)) this.eeContext = obj;
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      this.eeContext = null;
    }
  }]);

  return AotooEventEmitter;
}();

exports.default = AotooEventEmitter;
function sax(instName, opts) {
  if (eeStock[instName]) return eeStock[instName];else {
    eeStock[instName] = new AotooEventEmitter(opts, instName);
    return eeStock[instName];
  }
}
//# sourceMappingURL=../../maps/suba/lib/aotooeventemitter.js.map
