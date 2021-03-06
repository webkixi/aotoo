"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEvents = isEvents;
exports.bindEvents = bindEvents;
exports.eventName = void 0;

var _util = require("../lib/util");

var _url = require("../lib/url");

// import * as lib from '../lib'
var lib = {
  isReactNative: _util.isReactNative,
  forEach: _util.forEach,
  uniqueId: _util.uniqueId,
  isFunction: _util.isFunction,
  isString: _util.isString,
  urlTOquery: _url.urlTOquery
};

function getContextCallback(ctx, f) {
  if (!f) return;

  if (ctx) {
    if (ctx[f]) return ctx;else {
      return getContextCallback(ctx.parentInst, f);
    }
  }
}

var ClipboardEvents = ['onCopy', 'onCut', 'onPaste']; //中文输入法

var CompositionEvents = ['onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate'];
var KeyboardEvents = ['onKeyDown', 'onKeyPress', 'onKeyUp'];
var FocusEvents = ['onFocus', 'onBlur'];
var FormEvents = ['onChange', 'onInput', 'onInvalid', 'onReset', 'onSubmit'];
var GenericEvents = ['onError', 'onLoad'];
var ImageEvents = ['onLoad', 'onError'];
var MouseEvents = ['onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onLongPress', 'onLongTap']; //笔 鼠标 等

var PointerEvents = ['onPointerDown', 'onPointerMove', 'onPointerUp', 'onPointerCancel', 'onGotPointerCapture', 'onLostPointerCapture', 'onPointerEnter', 'onPointerLeave', 'onPointerOver', 'onPointerOut'];
var SelectionEvents = ['onSelect'];
var TouchEvents = ['onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onTouchOption'];
var UIEvents = ['onScroll'];
var WheelEvents = ['onWheel'];
var MediaEvents = ['onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted', 'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate', 'onVolumeChange', 'onWaiting'];
var AnimationEvents = ['onAnimationStart', 'onAnimationEnd', 'onAnimationIteration'];
var TransitionEvents = ['onTransitionEnd'];
var OtherEvents = ['onToggle'];
var RNEvents = ['onPress']; // 仿小程序事件

var minipEvents = ['tap', 'aim', 'longpress', 'longtap', 'catchtap', 'touchstart', 'touchmove', 'touchcancel', 'touchend', 'catchlongpress', 'catchlongtap', 'catchtouchstart', 'catchtouchmove', 'catchtouchcancel', 'catchtouchend'];
var eventName = [].concat(ClipboardEvents, CompositionEvents, KeyboardEvents, FocusEvents, FormEvents, ImageEvents, MouseEvents, PointerEvents, SelectionEvents, TouchEvents, UIEvents, WheelEvents, MediaEvents, AnimationEvents, TransitionEvents, RNEvents, OtherEvents);
exports.eventName = eventName;

function isEvents(key) {
  if (minipEvents.indexOf(key) > -1) {
    return true;
  }

  var eventString = eventName.join(',');

  if (eventString.indexOf(key) > -1) {
    var index = eventString.indexOf(key);

    if (eventString.charAt(index) === 'o') {
      return true;
    }
  }
} // reset/getconfig等初始化数据方法中对event事件的重新封装


function bindEvents(events, context) {
  function eventFunction(funKey, functionName) {
    var myquery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var ky = arguments.length > 3 ? arguments[3] : undefined;
    return function a(e, rn_gestureState) {
      var curContext = a.curContext || context;

      if (rn_gestureState) {
        myquery.gestureState = rn_gestureState;
      }

      if (curContext && curContext.hasClass && curContext.hasClass('_disabled')) return; // 无效状态，则不允许事件触发

      var responseContext = getContextCallback(curContext, functionName);

      if (responseContext) {
        if (!lib.isReactNative()) {
          e.persist();

          if (ky === 'aim' || ky.indexOf('catch') === 0) {
            e.stopPropagation();
            e.preventDefault();
          }

          if (ky.indexOf('longpress') > -1) {
            var step = function step(timestamp) {
              if (start === undefined) start = timestamp;
              var elapsed = timestamp - start;

              if (elapsed < 300) {
                // 在两秒后停止动画
                longpressId = window.requestAnimationFrame(step);
              } else {
                window.cancelAnimationFrame(longpressId);

                var _rightContext = responseContext === curContext ? responseContext.parentInst ? responseContext.parentInst : responseContext : responseContext;

                responseContext[functionName].call(_rightContext, e, myquery, curContext);
              }
            };

            var start;
            var longpressId;
            longpressId = window.requestAnimationFrame(step);
            return;
          }
        }

        var rightContext = responseContext === curContext ? responseContext.parentInst ? responseContext.parentInst : responseContext : responseContext;
        return responseContext[functionName].call(rightContext, e, myquery, curContext);
      } else {
        console.warn('没有找到定义方法:' + functionName); // 定义pager的__fromParent
      }
    };
  }

  lib.forEach(events, function (fun, ii, ky) {
    var evt = fun;
    var funKey = lib.uniqueId('__on_');

    if (lib.isFunction(evt)) {
      if (!evt.funKey) {
        context[funKey] = evt;
        evt = funKey;
      } else {
        evt.curContext = context;
      }
    }

    if (lib.isString(evt)) {
      var _lib$urlTOquery = lib.urlTOquery(evt),
          url = _lib$urlTOquery.url,
          query = _lib$urlTOquery.query,
          hasQuery = _lib$urlTOquery.hasQuery;

      var functionName = url;
      var evtFun = eventFunction(funKey, functionName, query, ky);
      var oky = '';

      if (minipEvents.indexOf(ky) > -1) {
        oky = ky;
        if (ky.indexOf('aim') > -1) ky = 'onClick';
        if (ky.indexOf('tap') > -1) ky = 'onClick';
        if (ky.indexOf('catchtap') > -1) ky = 'onClick';
        if (ky.indexOf('touchstart') > -1) ky = 'onTouchStart';
        if (ky.indexOf('touchmove') > -1) ky = 'onTouchMove';
        if (ky.indexOf('touchend') > -1) ky = 'onTouchEnd';
        if (ky.indexOf('touchcancel') > -1) ky = 'onTouchCancel';
        if (ky.indexOf('longpress') > -1) ky = 'onMouseDown';
        if (ky.indexOf('longtap') > -1) ky = 'onLongTap';
      }

      events[ky] = evtFun.bind(context);

      if (oky) {
        events[ky].__oriEventKey__ = oky;
        delete events[oky];
      }

      events[ky].funKey = funKey;
      events[ky].context = context;
    }
  });
  return events;
}