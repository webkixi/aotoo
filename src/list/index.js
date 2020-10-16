import createComponet, {
  $$, 
  lib, 
  getContextCallback
} from '../core'

import {
  resetItem,
  addClass,
  removeClass,
  hasClass,
  css,
  toggleClass,
  attr
} from "./_common/foritem";

import transTree from "./_common/tree";

import {
  attrKey, 
  accessKey, 
  eventName, 
  isEvents, 
  bindEvents
} from '../_common'

import getConfig, {
  attachItem
} from "./_common/getconfig";

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
  let type = state.type || 'list'  // expose  scroll swiper
  let _attr = state.attr || props.attr || {}
  let data = state.data
  let select = state.select || -1

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
    items = data.map((item, ii) => {
      item = resetItem(item, this, true)
      if (lib.isNumber(item) || lib.isString(item) || React.isValidElement(item)) {
        if (React.isValidElement(item)) {
          item = {title: item}
        } else {
          item = {text: item}
        }
      } else {
        if (lib.isPlainObject(select) && lib.isPlainObject(item)){
          select = lib.findIndex([item], select)
        }
      }

      if (select !== -1 && ii === select && lib.isPlainObject(item)) {
        item.itemClass = item.itemClass ? item.className+' active' : 'active'
      }
      
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

  
  if (type === 'expose') {
    return (
      <>
        {header}
        {items}
        {footer}
        {props.children}
      </>
    )
  }

  return (
    <View 
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
    </View>
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
  reset(param, cb){
    let that = this
    if (this.reactComponentInstance) {
      this.reactComponentInstance.reset({data: []}, function() {
        if (lib.isArray(param)) {
          param = {data: param}
        }
        if (lib.isPlainObject(param)) {
          if (param.data) {
            if (lib.isArray(param.data)) {
              param.data = attachItem(param.data, that)
            } else {
              delete param.data
            }
          }
        }
        that.reactComponentInstance.reset(param, cb)
      })
    }
  },
  insert(query, pay, cb){
    if (!pay) return
    pay = attachItem(pay, this)
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
    this.update({data: $data}, cb)
  },
  append(pay, cb){
    if (!pay) return
    pay = attachItem(pay, this)
    let $data = this.getData().data
    if (pay) {
      $data = $data.concat(pay)
      this.update({ data: $data }, cb)
    }
  },
  prepend(pay, cb){
    if (!pay) return
    pay = attachItem(pay, this)
    let $data = this.getData().data
    if (pay) {
      $data = [].concat(pay).concat($data)
      this.update({ data: $data }, cb)
    }
  },
  remove(query, cb){
    let $data = this.getData().data
    let index = -1

    if (lib.isNumber(query)) {
      index = query
    }

    if (lib.isPlainObject(query)) {
      index = lib.findIndex($data, query)
    }

    if (!query) {
      index = ($data.length-1)
    }

    if (query === 'shift') {
      index = 0
    }

    if (index || index === 0) {
      let target = $data.splice(index, 1)
      target.destory&&target.destory()
    }
    // this.children = []
    this.update({ data: $data }, cb)
  },
  pop(){
    this.remove()
  },
  shift(){
    this.remove('shift')
  },
  setData(param, cb) {
    this.update(param, cb)
  },
  update(_param, cb) {
    // let param = lib.clone(_param)
    let param = (_param)
    let $data = this.getData()

    const updateFun = (opts = {}) => {
      for (let ky in opts) {
        let val = opts[ky]
        if (ky === 'data') {
          val = val.map(item=>{
            return resetItem(item, this, true)
          })
        }
        lib.set($data, ky, val)
      }
      this._setData($data, cb)
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

  disable(){},
  enable(){},

  forEach(cb){
    let that = this
    
    // 方案一
    // 使用子元素自己更新
    // 一旦子元素自更新，则list组件不再能够透过props影响子元素，考虑到子元素更新应该要交给用户
    this.children.forEach((item, ii)=>{
      if (lib.isFunction(cb)) cb.call(item, item, ii)
    })


    // 方案二
    // 由list透过props更新子元素
    // let myupdates = {}
    // let $data = this.getData().data
    // $data.forEach((_item, ii)=>{
    //   let item = lib.clone(_item)
    //   let itemContext = {
    //     addClass(cls){
    //       let $itemClass = addClass(item, cls)
    //       let ky = `data[${ii}].itemClass`
    //       myupdates[ky] = $itemClass
    //     },
    //     removeClass(cls){
    //       let $itemClass = removeClass(item, cls)
    //       let ky = `data[${ii}].itemClass`
    //       myupdates[ky] = $itemClass
    //     },
    //     hasClass(cls){
    //       return hasClass(item, cls)
    //     },
    //     css(params){
    //       let itemStyle = css(item, params)
    //       let ky = `data[${ii}].itemStyle`
    //       myupdates[ky] = itemStyle
    //     },

    //     toggleClass(cls){
    //       if (this.hasClass(cls)) {
    //         this.removeClass(cls)
    //       } else {
    //         this.addClass(cls)
    //       }
    //     },

    //     update(param){
    //       let ky = `data[${ii}]`
    //       myupdates[ky] = param
    //     },

    //     show(){
    //       let ky = `data[${ii}].show`
    //       myupdates[ky] = true
    //     },

    //     hide(){
    //       let ky = `data[${ii}].show`
    //       myupdates[ky] = false
    //     },

    //     attr(p1, p2){
    //       let ky = `data[${ii}].attr`
    //       myupdates[ky] = attr(item, p1, p2)
    //     },
    //     disable(){
    //       this.addClass('disabled _disabled')
    //     },
    //     enable(){
    //       this.removeClass('disabled _disabled')
    //     }
    //   }
    //   if (lib.isFunction(cb)) cb.call(itemContext, item, ii)
    // })
    // if (!lib.isEmpty(myupdates)) {
    //   this.update(myupdates)
    // }
  },

  length(){
    if (this.tasks.length || this.taskTimmer) {
      return this.taskData.data.length
    } 
    return this.getData().data.length
  },

  select(query, cls='active'){
    let $data = this.getData().data
    let index = null
    if (lib.isNumber(query)) {
      index = query
    }

    if (lib.isPlainObject(query)) {
      index = lib.findIndex($data, query)
    }

    if (lib.isNumber(index)) {
      this.forEach(function(item, ii){
        if (ii === index) {
          this.addClass(cls)
        } else {
          if (this.hasClass(cls)){
            this.removeClass(cls)
          }
        }
      })
    }
  }

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
 *   select: [number|object]  //默认选中项
 * }
 */
export default function list(options={}) {
  let config = getConfig(options)
  config = Object.assign({}, defaultConfig, config, defaultBehavior)

  let customCreated = config.created
  config.created = function () {
    // this.$$is = this.config.$$is
    this.$$is = 'list'
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