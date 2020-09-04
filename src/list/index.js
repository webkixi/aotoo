import createComponet, {$$, lib, getContextCallback} from '../core'
import { resetItem } from "./_common/foritem";
import transTree from "./_common/tree";
import {attrKey, accessKey, eventName, isEvents, bindEvents} from '../_common'
import getConfig, {attachItem} from "./_common/getconfig";
import * as partments from '../_common/partment'

function getListMethod(events) {
  return bindEvents(events, this)
  // const that = this
  // lib.forEach(events, (fun, ii, ky) => {
  //   let evt = fun
  //   if (lib.isFunction(evt)) {
  //     let funKey = lib.uniqueId('__on_')
  //     this[funKey] = evt
  //     evt = funKey
  //   }

  //   if (lib.isString(evt)) {
  //     let {url, query, hasQuery} = lib.urlTOquery(evt)
  //     let functionName = url
  //     events[ky] = function(e, param, inst) {
  //       let responseContext = getContextCallback(that, functionName)
  //       if (responseContext) {
  //         responseContext[functionName].call(responseContext, e, query, that)
  //       } else {
  //         console.warn('没有找到定义方法:'+ky);  // 定义pager的__fromParent
  //       }
  //     }
  //   }
  // })
  // return events
}

const template = function(state, props) {
  let events = this.events
  let mode = state.mode || 'list'
  let _attr = state.attr || props.attr || {}
  let data = state.data

  let attr = {}
  Object.keys(_attr).forEach(ky=>{
    let $ky = ky
    if (ky.indexOf('data-') === -1) {
      $ky = 'data-' + ky
    }
    attr[$ky] = _attr[ky]
  })

  let items = []
  if (mode === 'list') {
    items = data.map(item => {
      item = resetItem(item, this, true)
      let it = ui_item(item)
      return <it.UI key={item.__key}/>
    })
  }

  if (mode === 'tree') {
    items = data.map(item => resetItem(item, this, true) )
    items = transTree(items, state)
    items = items.map(item => {
      let it = ui_item(item)
      return <it.UI key={item.__key}/>
    })
  }

  let header = state.header
  let footer = state.footer

  return (
    <div 
      id={state.id}
      className={'hlist '+(state.listClass||'')}
      style={state.listStyle}
      {...attr}
      {...events}
    >
      {header}
      {items}
      {footer}
      {props.children}
    </div>
  )
}

const defaultConfig = {
  data: [],
  $$is: 'list',
  attached: null,
  ready: null,
  __ready: null,
}

let defaultBehavior = {
  insert(query, pay){
    if (!pay) return
    pay = attachItem(pay)
    let $data = this.getData().data
    let index = -1
    if (lib.isNumber(query)) {
      index = query
    }
    if (lib.isPlainObject(query)) {
      index = lib.findIndex($data, query)
    }

    if (index || index===0) {
      $data.splice(index, 0, ...pay)
    }

    this.update({data: $data})
  },
  append(pay){
    if (!pay) return
    pay = attachItem(pay)
    let $data = this.getData().data
    if (pay) {
      $data = $data.concat(pay)
      this.update({ data: $data })
    }
  },
  prepend(pay){
    if (!pay) return
    pay = attachItem(pay)
    let $data = this.getData().data
    if (pay) {
      $data = [].concat(pay).concat($data)
      this.update({ data: $data })
    }
  },
  remove(query){
    let $data = this.getData().data
    let index = -1
    if (lib.isNumber(query)) {
      index = query
    }
    if (lib.isPlainObject(query)) {
      index = lib.findIndex($data, query)
    }

    if (index || index === 0) {
      $data.splice(index, 1)
    }

    this.update({
      data: $data
    })
  },
  setData(param, cb) {
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
      let $list = this.getData()
      let $listClass = $list.listClass && $list.listClass.split(' ') || []
      cls = cls.filter(cls => $listClass.indexOf(cls) == -1)
      $listClass = $listClass.concat(cls)
      this.update({
        listClass: $listClass.join(' ')
      }, cb)
    }
  },

  removeClass(cls, cb) {
    if (cls) {
      cls = cls.replace(/\./g, '')
      cls = lib.isString(cls) ? cls.split(' ') : []
      let $list = this.getData()
      let $listClass = $list.listClass && $list.listClass.split(' ') || []
      let _cls = $listClass.filter(c => c.indexOf(cls) === -1)
      $listClass = _cls
      this.update({
        listClass: ($listClass.join(' ') || ' ')
      }, cb)
    }
  },

  hasClass(cls) {
    if (cls) {
      cls = cls.replace(/\./g, '')
      cls = lib.isString(cls) ? cls.split(' ') : []
      let len = cls.length
      let $list = this.getData()
      let $listClass = $list.listClass && $list.listClass.split(' ') || []
      cls = cls.filter(c => $listClass.indexOf(c) !== -1)
      return len === cls.length ? true : false
    }
  },

  css(params, cb) {
    if (!lib.isPlainObject(params)) {
      console.warn('不符合react的内联样式格式');
      return
    }

    let $list = this.getData()
    let listStyle = Object.assign({}, ($list.listStyle||{}), params)
    this.update({ listStyle }, cb)
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

  // didUpdate(){
  //   if (lib.isFunction(this.config.didUpdate)) {
  //     this.config.didUpdate.apply(this, arguments)
  //   }
  // }

  // reset(){},
  // parent(){},
}


/**
 * 
 * @param {*} options 
 * {
 *   data: [],
 *   listClass: '',
 *   itemClass: '',
 *   itemMethod: {},
 *   methods: {},
 *   footer: <>,
 *   header: <>
 * }
 */
export default function list(options={}) {
  let config = getConfig(options)
  config = Object.assign({}, defaultConfig, config, defaultBehavior)

  let customCreated = config.created
  config.created = function () {
    this.$$is = this.config.$$is
    this.events = getListMethod.call(this, (this.config.listMethod || {}))
    if (lib.isFunction(customCreated)) {
      customCreated.call(this)
    }
  }

  return createComponet(config, template)
}

let context = lib.curContext()
context.ui_list = list;
context.ui_tree = function(options){
  if (lib.isPlainObject(options)) {
    options.mode = 'tree'
    return list(options)
  }
}