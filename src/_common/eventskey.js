import {lib, getContextCallback} from '../core'

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
  'onToggle'
]

export const eventName = [].concat(ClipboardEvents, CompositionEvents, KeyboardEvents, FocusEvents, FormEvents, ImageEvents, MouseEvents, PointerEvents, SelectionEvents, TouchEvents, UIEvents, WheelEvents, MediaEvents, AnimationEvents, TransitionEvents, OtherEvents)

export function isEvents(key) {
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
  function eventFunction(funKey, functionName, myquery) {
    return function a(e, param, inst) {
      const curContext = a.curContext || context
      if (curContext && curContext.hasClass && curContext.hasClass('_disabled')) return // 无效状态，则不允许事件触发
      let responseContext = getContextCallback(curContext, functionName)
      if (responseContext) {
        e.persist()
        let rightContext = responseContext === curContext ? responseContext.parentInst ? responseContext.parentInst : responseContext : responseContext;
        responseContext[functionName].call(rightContext, e, myquery, curContext)
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
      let evtFun = eventFunction(funKey, functionName, query)
      evtFun.funKey = funKey
      events[ky] = evtFun.bind(context)
    }
  })
  return events
}