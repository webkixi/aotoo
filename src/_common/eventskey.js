// import * as lib from '../lib'
import { 
  isReactNative,
  forEach,
  uniqueId,
  isFunction,
  isString
} from '../lib/util'

import { 
  urlTOquery
} from '../lib/url'

const lib = {
  isReactNative,
  forEach,
  uniqueId,
  isFunction,
  isString,
  urlTOquery
}


function getContextCallback(ctx, f) {
  if (!f) return
  if (ctx) {
    if (ctx[f]) return ctx
    else {
      return getContextCallback(ctx.parentInst, f)
    }
  }
}

const ClipboardEvents = [
  'onCopy', 'onCut', 'onPaste'
]

//中文输入法
const CompositionEvents = [
  'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate'
]

const KeyboardEvents = [
  'onKeyDown', 'onKeyPress', 'onKeyUp'
]

const FocusEvents = [
  'onFocus', 'onBlur'
]

const FormEvents = [
  'onChange', 'onInput', 'onInvalid', 'onReset', 'onSubmit'
]

const GenericEvents = [
  'onError', 'onLoad'
]

const ImageEvents = [
  'onLoad', 'onError'
]

const MouseEvents = [
  'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit',
  'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave',
  'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp',

  'onLongPress', 'onLongTap'
]

//笔 鼠标 等
const PointerEvents = [
  'onPointerDown', 'onPointerMove', 'onPointerUp', 'onPointerCancel', 'onGotPointerCapture',
  'onLostPointerCapture', 'onPointerEnter', 'onPointerLeave', 'onPointerOver', 'onPointerOut'
]

const SelectionEvents = [
  'onSelect'
]

const TouchEvents = [
  'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onTouchOption'
]

const UIEvents = [
  'onScroll'
]

const WheelEvents = [
  'onWheel'
]

const MediaEvents = [
  'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted',
  'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay',
  'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend',
  'onTimeUpdate', 'onVolumeChange', 'onWaiting'
]

const AnimationEvents = [
  'onAnimationStart', 'onAnimationEnd', 'onAnimationIteration'
]

const TransitionEvents = [
  'onTransitionEnd'
]

const OtherEvents = [
  'onToggle',
]

const RNEvents = [
  'onPress'
]

// 仿小程序事件
const minipEvents = [
  'tap', 'aim',
  'longpress', 'longtap', 'catchtap',
  'touchstart', 'touchmove', 'touchcancel', 'touchend',
  'catchlongpress', 'catchlongtap', 
  'catchtouchstart', 'catchtouchmove', 'catchtouchcancel', 'catchtouchend'
]

export const eventName = [].concat(
  ClipboardEvents, 
  CompositionEvents, 
  KeyboardEvents, 
  FocusEvents, 
  FormEvents, 
  ImageEvents, 
  MouseEvents, 
  PointerEvents, 
  SelectionEvents, 
  TouchEvents, 
  UIEvents, 
  WheelEvents, 
  MediaEvents, 
  AnimationEvents, 
  TransitionEvents, 
  RNEvents,
  OtherEvents
)

export function isEvents(key) {
  if (minipEvents.indexOf(key)>-1) {
    return true
  }
  let eventString = eventName.join(',')
  if (eventString.indexOf(key) > -1) {
    let index = eventString.indexOf(key)
    if (eventString.charAt(index) === 'o') {
      return true
    }
  }
}


// reset/getconfig等初始化数据方法中对event事件的重新封装
export function bindEvents(events, context) {
  function eventFunction(funKey, functionName, myquery={}, ky) {
    return function a(e, rn_gestureState) {
      const curContext = a.curContext || context
      if (rn_gestureState) {
        myquery.gestureState = rn_gestureState
      }
      if (curContext && curContext.hasClass && curContext.hasClass('_disabled')) return // 无效状态，则不允许事件触发
      let responseContext = getContextCallback(curContext, functionName)
      if (responseContext) {
        if (!lib.isReactNative()) {
          e.persist()

          if (ky === 'aim' || ky.indexOf('catch')===0) {
            e.stopPropagation()
            e.preventDefault()
          }

          if (ky.indexOf('longpress')>-1) {
            let start;
            let longpressId;
            function step(timestamp) {
              if (start === undefined) start = timestamp;
              const elapsed = timestamp - start;
              if (elapsed < 300) { // 在两秒后停止动画
                longpressId = window.requestAnimationFrame(step);
              } else {
                window.cancelAnimationFrame(longpressId);
                let rightContext = responseContext === curContext ? responseContext.parentInst ? responseContext.parentInst : responseContext : responseContext;
                responseContext[functionName].call(rightContext, e, myquery, curContext)
              }
            }
            longpressId = window.requestAnimationFrame(step);
            return
          }
        }

        let rightContext = responseContext === curContext ? responseContext.parentInst ? responseContext.parentInst : responseContext : responseContext;
        return responseContext[functionName].call(rightContext, e, myquery, curContext)
      } else {
        console.warn('没有找到定义方法:' + functionName); // 定义pager的__fromParent
      }
    }
  }
  lib.forEach(events, (fun, ii, ky) => {
    let evt = fun
    let funKey = lib.uniqueId('__on_')
    if (lib.isFunction(evt)) {
      if (!evt.funKey) {
        context[funKey] = evt
        evt = funKey
      } else {
        evt.curContext = context
      }
    }

    if (lib.isString(evt)) {
      let {url, query, hasQuery} = lib.urlTOquery(evt)
      let functionName = url
      let evtFun = eventFunction(funKey, functionName, query, ky)
      let oky = ''
      if (minipEvents.indexOf(ky) > -1) {
        oky = ky
        if (ky.indexOf('aim')>-1) ky = 'onClick'
        if (ky.indexOf('tap')>-1) ky = 'onClick'
        if (ky.indexOf('catchtap')>-1) ky = 'onClick'
        if (ky.indexOf('touchstart')>-1) ky = 'onTouchStart'
        if (ky.indexOf('touchmove')>-1) ky = 'onTouchMove'
        if (ky.indexOf('touchend')>-1) ky = 'onTouchEnd'
        if (ky.indexOf('touchcancel')>-1) ky = 'onTouchCancel'
        if (ky.indexOf('longpress')>-1) ky = 'onMouseDown'
        if (ky.indexOf('longtap')>-1) ky = 'onLongTap'
      }
      events[ky] = evtFun.bind(context);
      if (oky) {
        events[ky].__oriEventKey__ = oky
        delete events[oky];
      }
      events[ky].funKey = funKey
      events[ky].context = context
    }
  })
  return events
}