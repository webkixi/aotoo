"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEvents = isEvents;
exports.bindEvents = bindEvents;
exports.eventName = void 0;

var _core = require("../core");

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
var eventName = [].concat(ClipboardEvents, CompositionEvents, KeyboardEvents, FocusEvents, FormEvents, ImageEvents, MouseEvents, PointerEvents, SelectionEvents, TouchEvents, UIEvents, WheelEvents, MediaEvents, AnimationEvents, TransitionEvents, OtherEvents);
exports.eventName = eventName;

function isEvents(key) {
  var eventString = eventName.join(',');

  if (eventString.indexOf(key) > -1) {
    var index = eventString.indexOf(key);

    if (eventString.charAt(index) === 'o') {
      return true;
    }
  }
} // reset/getconfig等初始化数据方法中对event事件的重新封装


function bindEvents(events, context) {
  function eventFunction(funKey, functionName, myquery) {
    return function a(e, param, inst) {
      var curContext = a.curContext || context;
      if (curContext && curContext.hasClass && curContext.hasClass('_disabled')) return; // 无效状态，则不允许事件触发

      var responseContext = (0, _core.getContextCallback)(curContext, functionName);

      if (responseContext) {
        e.persist();
        responseContext[functionName].call(responseContext, e, myquery, curContext);
      } else {
        console.warn('没有找到定义方法:' + functionName); // 定义pager的__fromParent
      }
    };
  }

  _core.lib.forEach(events, function (fun, ii, ky) {
    var evt = fun;

    var funKey = _core.lib.uniqueId('__on_');

    if (_core.lib.isFunction(evt)) {
      if (!evt.funKey) {
        context[funKey] = evt;
        evt = funKey;
      } else {
        evt.curContext = context;
      }
    }

    if (_core.lib.isString(evt)) {
      var _lib$urlTOquery = _core.lib.urlTOquery(evt),
          url = _lib$urlTOquery.url,
          query = _lib$urlTOquery.query,
          hasQuery = _lib$urlTOquery.hasQuery;

      var functionName = url;
      var evtFun = eventFunction(funKey, functionName, query);
      evtFun.funKey = funKey;
      events[ky] = evtFun.bind(context);
    }
  });

  return events;
}