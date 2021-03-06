"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetItem = resetItem;
exports.attr = attr;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.hasClass = hasClass;
exports.css = css;
exports.toggleClass = toggleClass;

var _lib = require("../../lib");

var _core = require("../../core");

var _common = require("../../_common");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mediaKeys = ['img', 'url'];
var blockKeys = ['body', 'footer', 'dot', 'li']; // img, url

function getEvents(params, context) {
  var events = {};

  _core.lib.forEach(params, function (item, ii, k) {
    if ((0, _common.isEvents)(k)) {
      events[k] = item;
    }
  });

  events = (0, _common.bindEvents)(events, context);
  return Object.assign(params, events);
}

function parseImg(src) {
  if ((0, _lib.isString)(src)) {
    var ary = src.split('@');

    if (ary.length > 1) {
      src = src.replace('@', '?');
      var obj = (0, _lib.urlTOquery)(src);
      return obj;
    } else {
      return {
        url: src,
        query: {}
      };
    }
  }
}

function formatImg(props, context) {
  var img = props.img;

  if ((0, _lib.isString)(img)) {
    var obj = parseImg(img);
    props.img = _objectSpread({
      src: obj.url
    }, obj.query);
  }

  if ((0, _lib.isObject)(img)) {
    var _obj = parseImg(img.src);

    if (_obj) {
      var tmp = _objectSpread({
        src: _obj.url
      }, _obj.query);

      props.img = Object.assign({}, props.img, tmp);
    }
  }

  if ((0, _lib.isNumber)(img)) {
    props.img = {
      src: img
    };
  }

  if (_core.lib.isArray(img)) {
    props.img = img.map(function (pic) {
      var tmp = formatImg({
        img: pic
      }, context);
      return tmp.img;
    }); // props.img = img.map(pic => {
    //   if (isString(pic)) {
    //     let obj = parseImg(pic)
    //     return { src: obj.url, ...obj.query }
    //   }
    //   if (isObject(pic)) {
    //     let obj = parseImg(img.src)
    //     if (obj) {
    //       let tmp = { src: obj.url, ...obj.query }
    //       pic = Object.assign({}, props.img, tmp)
    //     }
    //     return pic
    //   }
    // })
  }

  if (_core.lib.isPlainObject(props.img)) {
    props.img = getEvents(props.img, context);

    if (_core.lib.isReactNative()) {
      if (props.img.src) {
        if ((0, _lib.isNumber)(props.img.src)) {
          props.img.source = props.img.src;
        } else {
          props.img.source = {
            uri: props.img.src || ''
          };
        }

        delete props.img.src;
      }
    }
  } // if (lib.isArray(props.img)) {
  //   props.img = props.img.map(pic => getEvents(pic, context))
  // }


  return props;
} // 处理url
// hash 传递navigate组件的参数


function formatUrl(props, context) {
  var url = props.url;

  if ((0, _lib.isString)(url) && url.length > 1 || url === '/') {
    var ary = url.split('@');
    var isbutton = url.indexOf('button://') === 0;
    var __isAd = null;

    var funName = function () {
      if (url.indexOf('button://') === 0) {
        ary[0] = ary[0].replace('button://', '');
        return ary[0];
      }

      if (url.indexOf('ad://') === 0) {
        __isAd = true;
        ary[0] = ary[0].replace('ad://', '');
        return ary[0];
      }
    }();

    if (ary.length === 1) {
      if (isbutton) {
        props.url = {
          value: props.title,
          tap: funName
        };
      } else {
        props.url = {
          title: props.title,
          url: url
        };
      }
    } else {
      var obj = (0, _lib.urlTOquery)('?' + ary[1]); // 获取navigate的配置

      if (isbutton) {
        props.url = _objectSpread({
          value: props.title,
          tap: funName
        }, obj.query);
      } else if (__isAd) {
        props.url = _objectSpread({
          __isAd: true,
          tap: funName
        }, obj.query);
      } else {
        url = ary[0];
        props.url = _objectSpread({
          title: props.title,
          url: url
        }, obj.query);
      }
    }

    delete props.title;
  }

  if (_core.lib.isPlainObject(props.url)) {
    props.url = getEvents(props.url, context);
  }

  return props;
}

function resetItem(data, context, loop, ky) {
  if (typeof data == 'string' || typeof data == 'number' || typeof data == 'boolean' || React.isValidElement(data)) {
    return data;
  }

  if ((0, _lib.isObject)(data)) {
    var methods = data.methods;
    var extAttrs = {};
    var incAttrs = [];
    var events = {};
    var funs = {};
    data['__sort'] = [];
    data.show = data.hasOwnProperty('show') ? data.show : true;
    data.__relationId = data.__relationId || (0, _lib.uniqueId)('relation_');
    data.fromComponent = context.data.fromComponent || data.fromComponent || context.data.uniqId || context.uniqId;
    data.__fromParent = context.data.__fromParent;

    if (!blockKeys.includes(ky)) {
      if (ky !== 'url' && data.url) {
        data = formatUrl(data, context);
      }

      if (ky !== 'img' && data.img) {
        data = formatImg(data, context);
      }
    }

    if ((0, _lib.isPlainObject)(methods)) {
      if (ky && ky.indexOf('@') > -1) {
        /** 不处理 @组件的methods */
      } else if (data.data && loop) {// footer body dot 的子项为list/tree的配置时，不处理methods与itemMethod
      } else {
        Object.keys(methods).forEach(function (key) {
          var fun = methods[key];

          if (!_common.internalKeys.includes(key)) {
            if ((0, _lib.isFunction)(fun)) {
              fun = fun.bind(context);
              context[key] = fun;
            }
          } else {
            context.config[key] = fun;
          }
        });
        delete data.methods;
        delete data.itemMethod;
      }
    }

    if (ky && ky.indexOf('@') === 0 || (0, _lib.isPlainObject)(data)) {
      data.__key = data.__key || _core.lib.uniqueId('innerComponent_');
    }

    if (context.$$is && (context.$$is === 'list' || context.$$is === 'tree')) {
      if (!data['__key']) data['__key'] = (0, _lib.uniqueId)('list_item_');
    } // (dot, body...)的子元素


    if (loop === 'itemSubArray') {
      if (!data['__key']) data['__key'] = (0, _lib.uniqueId)('arykey_');
    }

    Object.keys(data).forEach(function (key) {
      if (data[key] || data[key] === 0 || typeof data[key] === 'boolean') {
        if (_common.accessKey.indexOf(key) > -1 || key.indexOf('@') === 0 && key.length > 1) {
          incAttrs.push(key);
        } // if (key == 'aim') {
        //   data.catchtap = data[key]
        //   extAttrs['catchtap'] = data[key]
        //   delete data.aim
        // } 


        if ((0, _common.isEvents)(key) && context && !loop) {
          events[key] = data[key];
        } // else if (isEvents(key) && context && mediaKeys.indexOf(ky) > -1) {
        //   events[key] = data[key]
        // } 
        else if ((0, _lib.isFunction)(data[key])) {
            funs[key] = data[key];
          } else {
            extAttrs[key] = data[key];
          }
      } else {
        delete data[key];
      }
    }); // 处理绑定事件

    if (context) {
      for (var funKey in funs) {
        if (_common.internalKeys.includes(funKey)) {
          // 内部关键字方法
          context.config[funKey] = funs[funKey];
        } else {
          context[funKey] = funs[funKey];
        }
      }

      events = (0, _common.bindEvents)(events, context);

      if (ky && mediaKeys.indexOf(ky) > -1) {
        var evts = [];

        _core.lib.forEach(events, function (fun, ii, k) {
          data[k] = events[k];
          evts.push(k);
        });

        evts.forEach(function (k) {
          return delete events[k];
        });
      }

      if (context.config.$$is === 'item') {
        context.events = context.events ? Object.assign({}, context.events, events) : events;
      }
    }

    data['__sort'] = incAttrs;

    for (var _i = 0, _incAttrs = incAttrs; _i < _incAttrs.length; _i++) {
      var attr = _incAttrs[_i];
      var sonItem = data[attr];

      if ((0, _lib.isArray)(sonItem)) {
        data[attr] = sonItem.filter(function (item) {
          return resetItem(item, context, 'itemSubArray', attr);
        });
      } else {
        if (ky && attr.indexOf('@') > -1) {
          /** 不去污染内部的父级链，只做表层 */
        } else {
          if (!React.isValidElement(sonItem)) {
            data[attr] = resetItem(sonItem, context, true, attr);
          }
        }
      }
    }

    if (!data.parent && !loop) data.itemDataRoot = true; // 标识该item是最顶层item，class style用作容器描述

    if (ky && mediaKeys.indexOf(ky) > -1) {
      delete data.__sort;
      delete data.show;
      delete data.__relationId;
      delete data.fromComponent;
      delete data.__fromParent;
      delete data.__key;
      delete data.itemDataRoot;
      data.className = data.itemClass;
      delete data.itemClass;
      data.style = data.itemStyle;
      delete data.itemStyle;
    }
  }

  return data;
}

function attr(data, p1, p2) {
  var attributs = data.attr || {};

  if (_core.lib.isString(p1)) {
    if (p2) {
      attributs[p1] = p2;
    }
  } else if (_core.lib.isPlainObject(p1)) {
    attributs = Object.assign({}, attributs, p1);
  }

  return attributs;
}

function addClass(data, cls, cb) {
  if (cls) {
    cls = cls.replace(/\./g, '');
    cls = _core.lib.isString(cls) ? cls.split(' ') : [];
    var $itemClass = data.itemClass && data.itemClass.split(' ') || [];
    cls = cls.filter(function (c) {
      return $itemClass.indexOf(c) == -1;
    });
    $itemClass = $itemClass.concat(cls).join(' ');
    return $itemClass; // this.update({
    //   itemClass: $itemClass.join(' ')
    // }, cb)
  }
}

function removeClass(data, cls, cb) {
  if (cls) {
    cls = cls.replace(/\./g, '');
    cls = _core.lib.isString(cls) ? cls.split(' ') : [];
    var $itemClass = data.itemClass && data.itemClass.split(' ') || [];

    var _cls = $itemClass.filter(function (c) {
      return c.indexOf(cls) === -1;
    });

    $itemClass = _cls.join(' ') || ' ';
    return $itemClass; // this.update({
    //   itemClass: ($itemClass.join(' ') || ' ')
    // }, cb)
  }
}

function hasClass(data, cls) {
  if (cls) {
    cls = cls.replace(/\./g, '');
    cls = _core.lib.isString(cls) ? cls.split(' ') : [];
    var len = cls.length;
    var $itemClass = data.itemClass && data.itemClass.split(' ') || [];
    cls = cls.filter(function (c) {
      return $itemClass.indexOf(c) !== -1;
    });
    return len === cls.length ? true : false;
  }
}

function css(data, params, cb) {
  if (!_core.lib.isPlainObject(params)) {
    console.warn('不符合react的内联样式格式');
    return;
  }

  var itemStyle = Object.assign({}, data.itemStyle || {}, params);
  return itemStyle; // this.update({ itemStyle }, cb)
}

function toggleClass(cls, cb) {
  if (cls) {
    var clsAry = _core.lib.isString(cls) ? cls.split(' ') : [];

    if (clsAry.length) {
      cls = clsAry[0];

      if (this.hasClass(cls)) {
        this.removeClass(cls, cb);
      } else {
        this.addClass(cls, cb);
      }
    }
  }
}