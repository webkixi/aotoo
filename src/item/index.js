import createComponet, {$$, lib} from '../core'
import { resetItem } from "./_common/foritem";
import {attrKey, accessKey, eventName} from '../_common'
import getConfig from "./_common/getconfig";

// import * as partments from '../_common/partment'
import partments from '../_common/partment'

const subClassNames = ['hb-item', 'hf-item', 'hdot-item', 'li-item']
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
  sort = sort.filter(ky => partments[ky] ? true : false)
  let myTemplate = sort.map((ky, ii) => {
    let elementKey = lib.uniqueId('part_')
    let value = state[ky]
    return (
      <React.Fragment key={elementKey}>
        {partments[ky](value, undefined, state, props)}
      </React.Fragment>
    )
    // return partments[ky](value, state, props, elementKey, _ky)
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

  return (
    <div 
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
    </div>
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
    if (cls) {
      cls = cls.replace(/\./g, '')
      cls = lib.isString(cls) ? cls.split(' ') : []
      let $item = this.getData()
      let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
      cls = cls.filter(cls => $itemClass.indexOf(cls) == -1)
      $itemClass = $itemClass.concat(cls)
      this.update({
        itemClass: $itemClass.join(' ')
      }, cb)
    }
  },

  removeClass(cls, cb) {
    if (cls) {
      cls = cls.replace(/\./g, '')
      cls = lib.isString(cls) ? cls.split(' ') : []
      let $item = this.getData()
      let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
      let _cls = $itemClass.filter(c => c.indexOf(cls) === -1)
      $itemClass = _cls
      this.update({
        itemClass: ($itemClass.join(' ') || ' ')
      }, cb)
    }
  },

  hasClass(cls) {
    if (cls) {
      cls = cls.replace(/\./g, '')
      cls = lib.isString(cls) ? cls.split(' ') : []
      let len = cls.length
      let $item = this.getData()
      let $itemClass = $item.itemClass && $item.itemClass.split(' ') || []
      cls = cls.filter(c => $itemClass.indexOf(c) !== -1)
      return len === cls.length ? true : false
    }
  },

  css(params, cb) {
    if (!lib.isPlainObject(params)) {
      console.warn('不符合react的内联样式格式');
      return
    }

    let $item = this.getData()
    let itemStyle = Object.assign({}, ($item.itemStyle||{}), params)
    this.update({ itemStyle }, cb)
  }, 

  toggleClass(cls, cb){
    if (cls) {
      let clsAry = lib.isString(cls) ? cls.split(' ') : []
      if (clsAry.length) {
        cls = clsAry[0]
        if (this.hasClass(cls)) {
          this.removeClass(cls, cb)
        } else {
          this.addClass(cls, cb)
        }
      }
    }
  },

  siblings(indentify) {
    if (this.parentInst) {
      let allChilds = this.parentInst.children
      broChilds = allChilds.filter(child=>child.uniqId!==this.uniqId)
      if (indentify) {
        broChilds = broChilds.filter(child=>child.hasClass(indentify))
      }
      return broChilds
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
context.ui_item = item