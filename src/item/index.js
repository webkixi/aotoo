import createComponet, {$$, lib} from '../core'
import { resetItem, addClass, removeClass, hasClass, css, toggleClass } from "./_common/foritem";
import {attrKey, accessKey, eventName} from '../_common'
import getConfig from "./_common/getconfig";

// import * as partments from '../_common/partment'
import partments from '../_common/partment'

const curContext = lib.curContext()
const subClassNames = ['hb-item', 'hf-item', 'hdot-item', 'li-item']

function rnTemplate(state, props, clsNmae, attr={}, myTemplate){
  const thisContext = this
  let events = this.events
  let animatedStyle = state.animatedStyle  // rn animated.view 样式
  if (typeof animatedStyle === 'function') {
    animatedStyle = animatedStyle.call(thisContext)
  }

  const children = (
    <View 
      id={state.id}
      key={state.__key}
      className={clsNmae}
      style={state.itemStyle}
      {...attr}
    >
      <React.Fragment>
        {myTemplate}
        {props.children}
      </React.Fragment>
    </View>
  )

  const GRE = curContext.globalRNelements
  const PanResponder = GRE.PanResponder
  const Animated = GRE.Animated

  // onClick  TouchableOpacity
  // onPress  TouchableHighlight
  // tap 
  // aim 
  // touchstart
  // touchmove
  // touchend
  // touchcancel
  // longpress
  // longaim
  
  let   target = children
  const helperTapEventsType = ['onClick', 'onPress', 'onMouseDown']
  const customTouchEventsType = ['onTouchStart', 'onTouchEnd', 'onTouchMove', 'onTouchCancel']
  if (GRE.TouchableOpacity) {
    let longpressTimeId = null
    let longpressDone = false

    function dealCustomTapEvent(eventKey, callback, otherCallback) {
      const eventFunContext = callback.context
      let   startRep = {}
      if (eventKey === 'tap' || eventKey === 'longpress') {
        startRep = {
          onStartShouldSetPanResponder: (evt, gestureState) => true
        }
      }
      if (eventKey === 'aim' || eventKey === 'longaim') {
        startRep = {
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true
        }
      }

      const attributsResponder = PanResponder.create({
        ...startRep,
        onPanResponderGrant: (evt, gestureState) => {
          // 手指接触后
          clearTimeout(longpressTimeId)
          if (typeof otherCallback === 'function') {  // longpress longaim
            longpressTimeId = setTimeout(() => {
              longpressDone = true
              otherCallback.call(thisContext, evt, gestureState)
            }, 600);
          }
        },
        onPanResponderRelease: (evt, gestureState) =>{
          // 手指释放
          if (!longpressTimeId) {
            callback.call(thisContext, evt, gestureState)
          } else {
            clearTimeout(longpressTimeId)
            if (!longpressDone) {
              callback.call(thisContext, evt, gestureState)
            }
            longpressDone = false
          }
        }
      })

      return attributsResponder.panHandlers
    }

    function dealCustomTouchEvent(touchEvents=[]) {
      let touchstartItem = null
      let touchmoveItem = null
      let touchendItem = null
      let touchcancelItem = null
      let startRep = {
        onStartShouldSetPanResponder: (evt, gestureState) => true
      }

      touchEvents.forEach(item=>{
        const evtKey = item[0]
        const evtFun = item[1]
        if (evtKey === 'onTouchStart') {
          touchstartItem = item
          startRep.onMoveShouldSetPanResponder = (evt, gestureState) => true
        }
        if (evtKey === 'onTouchMove') {
          // const evtResult = evtFun.call(thisContext)
          // touchmoveItem = evtResult ? evtResult : item
          if (lib.isPlainObject(item[1])) {
            item[1] = function(){
              return item[1]
            }
          }
          touchmoveItem = item
          startRep.onMoveShouldSetPanResponder = (evt, gestureState) => true
        }
        if (evtKey === 'onTouchEnd') {
          touchendItem = item
        }
        if (evtKey === 'onTouchCancel') {
          touchcancelItem = item
        }
      })

      const attributsResponder = PanResponder.create({
        ...startRep,
        onPanResponderGrant: (evt, gestureState) => {
          if (touchstartItem) {
            clearTimeout(longpressTimeId)
            longpressDone = false
            const evtFun = touchstartItem[1]
            if (typeof evtFun === 'function') {
              evtFun.call(thisContext, evt, gestureState)
            }
          }
        },

        onPanResponderMove: touchmoveItem[1].call(thisContext) ||  ((evt, gestureState) => {
          if (touchmoveItem) {
            const evtFun = touchmoveItem[1]
            if (typeof evtFun === 'function') {
              evtFun.call(thisContext, evt, gestureState)
            }
          }
          if (touchcancelItem) {
            const evtFun = touchcancelItem[1]
            if (typeof evtFun === 'function') {
              evtFun.call(thisContext, evt, gestureState)
            }
          }
        }),

        onPanResponderRelease: (evt, gestureState) =>{
          if (touchendItem) {
            const evtFun = touchendItem[1]
            if (typeof evtFun === 'function') {
              evtFun.call(thisContext, evt, gestureState)
            }
          }
        }
      })


      return attributsResponder.panHandlers
    }

    helperTapEventsType.forEach(evk=>{
      if (events[evk]) {
        const eventFun = events[evk]
        const eventOriKey = eventFun.__oriEventKey__
        const context = eventFun.context
        if (evk === 'onClick') {
          if (eventOriKey) {  // tap, aim会转换key名为onClick
            let otherCallback = null
            if (events['onMouseDown'] && events['onMouseDown'].__oriEventKey__) {
              otherCallback = events['onMouseDown']
            }
            const pressResponder = dealCustomTapEvent(eventOriKey, eventFun, otherCallback)
            target = React.cloneElement(target, pressResponder)
          } else {
            const TouchableOpacity = GRE.TouchableOpacity
            target = <TouchableOpacity onPress={events[evk]} >{target}</TouchableOpacity>
          }
          if (animatedStyle) {
            target = (
              <Animated.View style={animatedStyle}>
                {target}
              </Animated.View>
            )
          }
        }
        if (evk === 'onPress') {
          const TouchableHighlight = GRE.TouchableHighlight
          target = <TouchableHighlight onPress={events[evk]} >{target}</TouchableHighlight>
        }
        if (evk === 'onMouseDown') {
          if (eventOriKey === 'longpress') {
            if (events['onPress'] || (events['onClick'] && !events['onClick'].__oriEventKey__)) {
              target = React.cloneElement(target, {onLongPress: events[evk]})
            } else {
              const longPressResponder = dealCustomTapEvent(eventOriKey, eventFun)
              if (!events['onClick']) {
                target = React.cloneElement(target, longPressResponder)
              }
            }
          }
        }
      }
    })

    // touch事件
    const touchEvents = []
    let   touchResponder = {}
    customTouchEventsType.forEach(evk=>{
      if (events[evk]) {
        const eventFun = events[evk]
        touchEvents.push([evk, eventFun])
      }
    })
    if (touchEvents.length) {
      touchResponder = dealCustomTouchEvent(touchEvents)
      target = (
        <Animated.View style={ animatedStyle } {...touchResponder}>
          {target}
        </Animated.View>
      )
    }

    return target
  }
}

const template = function(state, props) {

  let events = this.events

  let _attr = state.attr || props.attr || {}
  let attr = {}
  Object.keys(_attr).forEach(ky=>{
    let $ky = ky
    if (ky.indexOf('data-') === -1) {
      $ky = 'data-' + ky
    }
    attr[$ky] = _attr[ky]
  })


  let sort = state.__sort
  let partElement = partments()
  sort = sort.filter(ky => partElement[ky] ? true : false)
  let myTemplate = sort.map((ky, ii) => {
    let elementKey = lib.uniqueId('part_')
    let value = state[ky]
    return (
      <React.Fragment key={elementKey}>
        {partElement[ky](value, undefined, state, props)}
      </React.Fragment>
    )
    // return partElement[ky](value, state, props, elementKey, _ky)
  })

  let clsNmae = 'item ' + (state.itemClass||'')
  let propsClassName = props.className
  if (propsClassName) {
    subClassNames.forEach(cls=>{
      if (propsClassName.indexOf(cls)>-1) {
        clsNmae = propsClassName
      }
    })
  }

  if (lib.isReactNative() && curContext.globalRNelements) {
    return rnTemplate.call(this, state, props, clsNmae, attr, myTemplate)
  }

  return (
    <View 
      id={state.id}
      key={state.__key}
      className={clsNmae}
      style={state.itemStyle}
      {...attr}
      {...events}
    >
      <React.Fragment>
        {myTemplate}
        {props.children}
      </React.Fragment>
    </View>
  )
}

const defaultConfig = {
  // data: {},
  $$is: 'item',
  attached: null,
  ready: null,
  __ready: null,
}

let defaultBehavior = {
  setData(param, cb){
    this.update(param, cb)
  },
  
  update(_param, cb) {
    // let param = lib.clone(_param)
    let param = (_param)
    let $data = this.data

    const updateFun = (opts = {}) => {
      for (let ky in opts) {
        let val = opts[ky]
        lib.set($data, ky, val)
      }
      $data = resetItem($data, this)
      this._setData($data)
    }

    let result = this.hooks.emit('before-update', param)
    if (result && result[0]) {
      result = result[0]
      if (lib.isFunction(result.then)) {
        result.then(res => updateFun(res)).catch(err => err)
      } else {
        updateFun(result)
      }
    } else {
      updateFun(param)
    }
  },

  addClass(cls, cb){
    let data = this.getData()
    let $itemClass = addClass(data, cls, cb)

    this.update({
      itemClass: $itemClass
    }, cb)

    // if (cls) {
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

  removeClass(cls, cb) {
    let data = this.getData()
    let $itemClass = removeClass(data, cls, cb)
    this.update({
      itemClass: ($itemClass || ' ')
    }, cb)
    // if (cls) {
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

  hasClass(cls) {
    let data = this.getData()
    return hasClass(data, cls)
    // if (cls) {
    //   cls = cls.replace(/\./g, '')
    //   cls = lib.isString(cls) ? cls.split(' ') : []
    //   let len = cls.length
    //   let $item = this.getData()
    //   let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
    //   cls = cls.filter(c => $itemClass.indexOf(c) !== -1)
    //   return len === cls.length ? true : false
    // }
  },

  css(params, cb) {
    let data = this.getData()
    let itemStyle = css(data, params, cb)
    this.update({ itemStyle }, cb)
    // if (!lib.isPlainObject(params)) {
    //   console.warn('不符合react的内联样式格式');
    //   return
    // }

    // let $item = this.getData()
    // let itemStyle = Object.assign({}, ($item.itemStyle||{}), params)
    // this.update({ itemStyle }, cb)
  }, 

  toggleClass(cls, cb){
    toggleClass.call(this, cls, cb)
    // if (cls) {
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

  disable() {
    this.addClass('disabled _disabled')
  },

  enable() {
    this.removeClass('disabled _disabled')
  },

  siblings(indentify) {
    if (this.parentInst) {
      let allChilds = this.parentInst.children
      let broChilds = allChilds.filter(child=>child.uniqId!==this.uniqId)
      if (indentify) {
        broChilds = broChilds.filter(child=>child.hasClass(indentify))
      }

      let obj = {}
      obj = {...broChilds}
      obj.length = broChilds.length
      Object.setPrototypeOf(obj, {
        forEach: [].forEach,
        addClass(){
          this.forEach(it => it.addClass.apply(it, arguments))
        },
        removeClass(){
          this.forEach(it => it.removeClass.apply(it, arguments))
        },
        toggleClass(){
          this.forEach(it => it.toggleClass.apply(it, arguments))
        },
        hasClass(){},
        show(){
          this.forEach(it => it.show())
        },
        hide(){
          this.forEach(it => it.hide())
        },
        reset(){
          this.forEach(it => it.reset.apply(it, arguments))
        },
        disable(){
          this.forEach(it => it.disable.apply(it, arguments))
        },
        enable(){
          this.forEach(it => it.enable.apply(it, arguments))
        },
        css(){
          this.forEach(it => it.css.apply(it, arguments))
        },
        attr(){
          this.forEach(it => it.attr.apply(it, arguments))
        }
      })
      return obj
    }
  },
}

export default function item(options={}) {
  // ??? options === string   options === reactElement options === reactClass
  let config = getConfig(options)
  config = Object.assign({}, defaultConfig, config, defaultBehavior)

  let customCreated = config.created
  config.created = function() {
    this.$$is = this.config.$$is
    this.data = resetItem(this.data, this)
    if (lib.isFunction(customCreated)) {
      customCreated.call(this)
    }
  }

  let customAttached = config.attached
  config.attached = function(props) {
    if (lib.isFunction(customAttached)) {
      customAttached.call(this, props)
    }
  }

  let customReady = config.ready||config.__ready
  config.ready = function() {
    if (lib.isFunction(customReady)) {
      customReady.call(this)
    }
  }

  return createComponet(config, template)
}

let context = lib.curContext()
if (!context.ui_item) {
  context.ui_item = item
}