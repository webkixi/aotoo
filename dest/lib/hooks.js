"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = hooks;

var _util = require("./util");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function getStorageSync(params) {
  if (typeof wx !== 'undefined') {
    return wx.getStorageSync(params);
  } else if ((0, _util.isClient)()) {
    var res = localStorage.getItem(params);
    return JSON.parse(res);
  } else if ((0, _util.isNode)()) {
    return global.Cache && global.Cache.get(params);
  } else {
    return {};
  }
}

function removeStorage(params) {
  if (typeof wx !== 'undefined') {
    wx.removeStorage(params);
  } else if ((0, _util.isClient)()) {
    localStorage.removeItem(params.key);
  } else if ((0, _util.isNode)()) {
    global.Cache && global.Cache.del(params.key);
  }
}

function getStorageInfoSync(params) {
  if (typeof wx !== 'undefined') {
    return wx.getStorageInfoSync(params);
  } else {
    console.warn('该环境下没有getStorageInfoSync方法');
  }
}

function setStorageSync(key, value) {
  try {
    if (typeof wx !== 'undefined') {
      wx.setStorageSync(key, value);
    } else if ((0, _util.isClient)()) {
      value = JSON.stringify(value);
      localStorage.setItem(key, value);
    } else if ((0, _util.isNode)()) {
      global.Cache && global.Cache.set(key, value);
    }
  } catch (error) {
    console.error(error);
  }
}

var _hooks = /*#__PURE__*/function () {
  function _hooks() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _hooks);

    var max = 0;
    var expireTime = 0;
    var storage = props.storage;

    if ((0, _util.isObject)(storage)) {
      storage = props.storage.localstorage; // 是否启用本地存储

      max = props.storage.max || 0;
      expireTime = props.storage.expire || 0;
      delete props.storage.localstorage;
    }

    this.storage = storage;
    this.namespace = props.namespace;
    this.actions = {};
    this.storeData = {};
    this.expireData = {};
    this.expireDataKey = this.namespace + "-expire-data";

    if (this.storage) {
      var oldData = getStorageSync(this.namespace);
      var oldExpireData = getStorageSync(this.expireDataKey);
      this.storeData = oldData || {};
      this.expireData = oldExpireData || {};
    }

    this.syncTimmer = null; // lru

    this.max = max;
    this.shadowData = {}; // 超时，设置所有变量的默认超时时间

    this.expire = expireTime;
  }

  _createClass(_hooks, [{
    key: "destory",
    value: function destory() {
      this.syncData(null, 'destory');
      this.actions = {};
      this.storeData = {};
      this.expireData = {}; // wx.clearStorageSync()
    }
  }, {
    key: "getInfo",
    value: function getInfo() {
      return this.storage ? getStorageInfoSync() : this.storeData;
    }
  }, {
    key: "setItem",
    value: function setItem(key, val, expire) {
      if (!key) return;

      if (val && val.$$value && val.$$timestamp) {
        this.storeData[key] = val;
      } else {
        this.storeData[key] = {
          $$value: val,
          $$hit: 1,
          $$timestamp: new Date().getTime()
        };
      }

      expire = expire || this.expire;

      if (expire && (0, _util.isNumber)(expire)) {
        var timestamp = new Date().getTime();
        var expireTime = timestamp + expire;
        var gapTime = expire;
        expire = {
          expire: expireTime,
          gap: gapTime
        };
        this.expireData[key] = expire;
      }

      this.syncData(key, 'set');
    }
  }, {
    key: "syncData",
    value: function syncData(key, type) {
      var _this = this;

      if (this.max) {
        var shadowData = this.shadowData;
        var storeData = this.storeData;
        var expireData = this.expireData;

        if (type === 'set') {
          var res = this.emit('cache-set', storeData[key].$$value); // 此时数据已存在

          if (res && res.length) {
            storeData[key].$$value = res[0];
          }
        }

        if (type === 'get') {
          if (shadowData[key] && !storeData[key]) {
            storeData[key] = shadowData[key];
            delete shadowData[key];
          }

          var _res2 = this.emit('cache-get', storeData[key].$$value);

          if (_res2 && _res2.length) {
            storeData[key].$$value = _res2[0];
          }
        }

        if (type === 'delete') {
          this.emit('cache-delete', storeData[key] && storeData[key].$$value || {});
          delete shadowData[key];
          delete storeData[key];
          delete expireData[key];
        }

        if (type === 'destory') {
          var allData = Object.assign(shadowData, storeData);
          this.emit('cache-destory', allData);
          this.storeData = {};
          this.expireData = {};
        }

        var max = this.max;
        var len = Object.keys(this.storeData).length;

        if (len > max) {
          this.emit('cache-switch', shadowData);
          shadowData = storeData;
          storeData = _defineProperty({}, key, shadowData[key]);
          delete shadowData[key];
        }

        this.shadowData = shadowData;
        this.storeData = storeData;
        this.expireData = expireData;
      }

      if (this.storage) {
        clearTimeout(this.syncTimmer);
        this.syncTimmer = setTimeout(function () {
          setStorageSync(_this.namespace, _this.storeData);
          setStorageSync(_this.expireDataKey, _this.expireData);
        }, 500);
      }
    }
    /**
     * orin: true: 返回源数据; false: 返回$$value
     */

  }, {
    key: "getItem",
    value: function getItem(key, orin) {
      if (key) {
        if (key === '*') {
          return this.storeData;
        }

        var res;
        var _res = this.storeData[key];

        if (!_res) {
          _res = this.shadowData[key];
        }

        if (_res) {
          _res.$$hit += 1;
          res = _res.$$value;
          this.syncData(key, 'get');
          var expire = this.expireData[key];

          if (expire) {
            var expireTime = expire.expire;
            var gapTime = expire.gap;
            var nowTime = new Date().getTime();

            if (expireTime && expireTime > nowTime) {
              return orin ? _res : res;
            } else {
              this["delete"](key);
            }
          } else {
            return orin ? _res : res;
          }
        }
      }
    }
  }, {
    key: "append",
    value: function append(key, val, expireDate) {
      if (key) {
        var res, expireTime, gapTime;

        var _res = this.getItem(key, 'full');

        res = _res && _res.$$value;
        var expire = this.expireData[key];

        if ((0, _util.isArray)(res)) {
          res = res.concat(val);
        } else if ((0, _util.isObject)(res)) {
          res = (0, _util.isObject)(val) ? Object.assign(res, val) : Object.assign(res, _defineProperty({}, (0, _util.uniqueId)('val_'), val));
        } else {
          if ((0, _util.isObject)(val) || (0, _util.isArray)(val)) res = val;else {
            res = _defineProperty({}, (0, _util.uniqueId)('val_'), val);
          }
        }

        if (expire) {
          expireTime = expire.expire + new Date().getTime();
          gapTime = expire.gap;
          this.expireData[key] = {
            expire: expireTime,
            gap: gapTime
          };
        }

        _res = {
          $$value: res,
          $$hit: _res ? _res.hit : 1,
          $$timestamp: new Date().getTime()
        };
        this.setItem(key, _res, expireDate);
      }
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      if (key) {
        if (key === '*') {
          this.clear();
        } else {
          this.storeData[key] = null;
          this.expireData[key] = null;
          this.shadowData[key] = null;
        }

        this.syncData(key, 'delete');
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.destory();

      if (this.storage) {
        removeStorage({
          key: this.namespace
        });
        removeStorage({
          key: this.expireDataKey
        });
      } // wx.clearStorageSync()

    } // ========= 下面为钩子方法 ===========

  }, {
    key: "on",
    value: function on(key, cb) {
      var myActions = this.actions;
      var hooksActionUniqId = (0, _util.uniqueId)('hooks_action_');

      if (cb) {
        cb['hooksActionUniqId'] = hooksActionUniqId;
      }

      if ((0, _util.isString)(key)) {
        if (myActions[key]) {
          myActions[key] = [].concat(myActions[key]).concat(cb);
        } else {
          myActions[key] = [cb];
        }
      }
    }
  }, {
    key: "reverseOn",
    value: function reverseOn(key, cb) {
      var myActions = this.actions;
      var hooksActionUniqId = (0, _util.uniqueId)('hooks_action_');

      if (cb) {
        cb['hooksActionUniqId'] = hooksActionUniqId;
      }

      if ((0, _util.isString)(key)) {
        if (myActions[key]) {
          myActions[key] = [].concat([cb], myActions[key]);
        } else {
          myActions[key] = [cb];
        }
      }
    }
  }, {
    key: "hasOn",
    value: function hasOn(key) {
      var myActions = this.actions;
      return myActions[key] ? myActions[key].length ? true : false : false;
    }
  }, {
    key: "off",
    value: function off(key, fun) {
      if ((0, _util.isString)(key)) {
        if (key === '*') {
          this.actions = {};
          return;
        }

        if (fun && typeof fun === 'function') {
          var hooksActionUniqId = fun.hooksActionUniqId || fun.name;

          if (hooksActionUniqId) {
            var theFuns = this.actions[key];
            var selectFunIndex = -1;

            if (theFuns) {
              theFuns.forEach(function ($f, ii) {
                if ($f['hooksActionUniqId'] == hooksActionUniqId || $f.name === hooksActionUniqId) {
                  selectFunIndex = ii;
                }
              });

              if (~selectFunIndex) {
                theFuns.splice(selectFunIndex, 1);
              }
            }
          }
        } else {
          delete this.actions[key];
        }
      }
    }
  }, {
    key: "emit",
    value: function emit(key, param) {
      var _this2 = this;

      var ctx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if ((0, _util.isString)(key)) {
        if (this.actions[key]) {
          var vals = [];
          var funs = this.actions[key];
          funs.forEach(function (fun) {
            if ((0, _util.isFunction)(fun)) {
              var res = fun.call(ctx, param);
              if (res) vals.push(res);else {
                if (typeof res === "boolean") {
                  vals.push(res);
                } else {
                  vals.push(undefined);
                }
              }

              if (fun.onlyonetime) {
                _this2.off(key, fun);
              }
            }
          });

          if (vals.length) {
            return vals;
          }
        }
      }
    }
  }, {
    key: "fire",
    value: function fire(key, param) {
      var ctx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var vals = [];

      function _fire() {
        var funcs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        if (funcs.length) {
          var fun = funcs.shift();
          var res = fun.call(ctx, param);
          vals.push(res);

          _fire(funcs);
        } else {
          return vals;
        }
      }

      if ((0, _util.isString)(key) && this.actions[key]) {
        _fire(this.actions[key]);

        if (vals.length) return vals;
      }
    }
  }, {
    key: "one",
    value: function one(key, cb) {
      if (key && typeof cb == 'function') {
        var mycb = function mycb() {
          return cb.apply(this, arguments);
        };

        mycb.onlyonetime = true;
        this.on(key, mycb);
      }
    }
  }, {
    key: "once",
    value: function once(key, cb) {
      var myActions = this.actions;

      if ((0, _util.isString)(key) && (0, _util.isFunction)(cb)) {
        myActions[key] = [cb];
      }
    }
  }]);

  return _hooks;
}();

var myhooks = {};

function hooks(namespace, storage) {
  if ((0, _util.isString)(namespace)) {
    if (!myhooks[namespace]) {
      myhooks[namespace] = new _hooks({
        storage: storage,
        namespace: namespace
      });
    }

    return myhooks[namespace];
  }
}