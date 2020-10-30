import {
  isString,
  isObject,
  isArray,
  isNumber,
  isFunction,
  urlTOquery,
  uniqueId,
  isPlainObject
} from '../../lib'

import {$$, getContextCallback, lib} from '../../core'
import {attrKey, accessKey, eventName, internalKeys, isEvents, bindEvents} from '../../_common'

const mediaKeys = ['img', 'url']
const blockKeys = ['body', 'footer', 'dot', 'li']

// img, url
function getEvents(params, context) {
  let events = {}
  lib.forEach(params, (item, ii, k) => {
    if (isEvents(k)) {
      events[k] = item
    }
  })
  events = bindEvents(events, context)
  return Object.assign(params, events)
  // let events = {}
  // lib.forEach(params, (item, ii, k) => {
  //   if (isEvents(k)) {
  //     let evt = item
  //     if (isFunction(evt)) {
  //       let fun = evt
  //       let funKey = uniqueId('__on_') + k
  //       events[k] = funKey
  //       context[funKey] = fun
  //       evt = funKey
  //     }

  //     if (isString(evt)) {
  //       let {url, query, hasQuery} = urlTOquery(evt)
  //       let functionName = url
  //       events[k] = function(e, param, inst) {
  //         let responseContext = getContextCallback(context, functionName)
  //         if (responseContext) {
  //           responseContext[functionName].call(responseContext, e, query, context)
  //         } else {
  //           console.warn('没有找到定义方法:'+k);  // 定义pager的__fromParent
  //         }
  //       }
  //     }
  //   }
  // })
  // return Object.assign(params, events)
}

function parseImg(src) {
  if (isString(src)) {
    let ary = src.split('@')
    if (ary.length > 1) {
      src = src.replace('@', '?')
      let obj = urlTOquery(src)
      return obj
    } else {
      return {url: src, query: {}}
    }
  }
}

function formatImg(props, context) {
  let img = props.img
  if (isString(img)) {
    let obj = parseImg(img)
    props.img = { src: obj.url, ...obj.query }
  }
  if (isObject(img)) {
    let obj = parseImg(img.src)
    if (obj) {
      let tmp = { src: obj.url, ...obj.query }
      props.img = Object.assign({}, props.img, tmp)
    }
  }
  if (isArray(img)) {
    props.img = img.map(pic => {
      if (isString(pic)) {
        let obj = parseImg(pic)
        return { src: obj.url, ...obj.query }
      }
      if (isObject(pic)) {
        let obj = parseImg(img.src)
        if (obj) {
          let tmp = { src: obj.url, ...obj.query }
          pic = Object.assign({}, props.img, tmp)
        }
        return pic
      }
    })
  }

  if (lib.isPlainObject(props.img)) {
    props.img = getEvents(props.img, context)
  }

  if (lib.isArray(props.img)) {
    props.img = props.img.map(pic => getEvents(pic, context))
  }

  return props
}

// 处理url
// hash 传递navigate组件的参数
function formatUrl(props, context) {
  let url = props.url
  if (isString(url) && url.length > 1) {
    let ary = url.split('@')
    let isbutton = url.indexOf('button://') === 0
    let __isAd = null
    let funName = (()=>{
      if (url.indexOf('button://') === 0) {
        ary[0] = ary[0].replace('button://', '')
        return ary[0]
      }
      if (url.indexOf('ad://') === 0) {
        __isAd = true
        ary[0] = ary[0].replace('ad://', '')
        return ary[0]
      }
    })()
    if (ary.length === 1) {
      if (isbutton) {
        props.url = {value: props.title, tap: funName}
      } else {
        props.url = {title: props.title, url: url}
      }
    } else {
      let obj = urlTOquery('?' + ary[1]) // 获取navigate的配置
      if (isbutton) {
        props.url = {value: props.title, tap: funName, ...obj.query}
      } else if(__isAd){
        props.url = {__isAd: true, tap: funName, ...obj.query}
      } else {
        url = ary[0]
        props.url = {title: props.title, url, ...obj.query}
      }
    }
    delete props.title
  }

  if (lib.isPlainObject(props.url)) {
    props.url = getEvents(props.url, context)
  }

  return props
}

export function resetItem(data, context, loop, ky) {
  if (typeof data == 'string' || 
    typeof data == 'number' || 
    typeof data == 'boolean' || 
    React.isValidElement(data)
  ) {
    return data
  }

  if (isObject(data)) {
    let methods = data.methods
    let extAttrs = {}
    let incAttrs = []
    let events = {}
    let funs = {}
    
    data['__sort'] = []
    data.show = data.hasOwnProperty('show') ? data.show : true
    data.__relationId = data.__relationId || uniqueId('relation_')

    data.fromComponent = context.data.fromComponent || data.fromComponent || context.data.uniqId || context.uniqId
    data.__fromParent = context.data.__fromParent

    if ((ky && ky.indexOf('@') === 0) || isPlainObject(data)) {
      data.__key = data.__key || lib.uniqueId('innerComponent_')
    }

    if (!blockKeys.includes(ky)) {
      if (ky !== 'url' && data.url) {
        data = formatUrl(data, context)
      }
      if (ky !== 'img' && data.img) {
        data = formatImg(data, context)
      }
    }

    if (isPlainObject(methods)) {
      if (ky && ky.indexOf('@') > -1) {
        /** 不处理 @组件的methods */
      } else if (data.data && loop) {
        // footer body dot 的子项为list/tree的配置时，不处理methods与itemMethod
      } else {
        Object.keys(methods).forEach(key => {
          let fun = methods[key]
          if (!internalKeys.includes(key)) {
            if (isFunction(fun)) {
              fun = fun.bind(context)
              context[key] = fun
            }
          } else {
            context.config[key] = fun
          }
        })
        delete data.methods
        delete data.itemMethod
      }
    }


    if (context.$$is && (context.$$is === 'list' || context.$$is === 'tree')) {
      if (!data['__key']) data['__key'] = uniqueId('list_item_')
    }

    // (dot, body...)的子元素
    if (loop === 'itemSubArray') {
      if (!data['__key']) data['__key'] = uniqueId('arykey_')
    }
    
    
    Object.keys(data).forEach(function (key) {
      if (data[key] || data[key]===0 || typeof data[key] === 'boolean') {
        if (accessKey.indexOf(key) > -1 || (key.indexOf('@') === 0 && key.length > 1)) {
          incAttrs.push(key)
        }
        // if (key == 'aim') {
        //   data.catchtap = data[key]
        //   extAttrs['catchtap'] = data[key]
        //   delete data.aim
        // } 
        if (isEvents(key) && context && !loop) {
          events[key] = data[key]
        } 
        // else if (isEvents(key) && context && mediaKeys.indexOf(ky) > -1) {
        //   events[key] = data[key]
        // } 
        else if (isFunction(data[key]) ) {
          funs[key] = data[key]
        } else {
          extAttrs[key] = data[key]
        }
      } else {
        delete data[key]
      }
    })

    // 处理绑定事件
    if (context) {
      for (let funKey in funs) {
        if (internalKeys.includes(funKey)) {  // 内部关键字方法
          context.config[funKey] = funs[funKey]
        } else {
          context[funKey] = funs[funKey]
        }
      }
      
      // Object.keys(events).forEach(k=>{
      //   let evt = events[k]
      //   if (isFunction(evt)) {
      //     let fun = evt
      //     let funKey = uniqueId('__on_') + k
      //     events[k] = funKey
      //     context[funKey] = fun
      //     evt = funKey
      //   }
        
      //   if (isString(evt)) {
      //     let {url, query, hasQuery} = urlTOquery(evt)
      //     let functionName = url
      //     events[k] = function(e, param, inst) {
      //       let responseContext = getContextCallback(context, functionName)
      //       if (responseContext) {
      //         responseContext[functionName].call(responseContext, e, query, context)
      //       } else {
      //         console.warn('没有找到定义方法:'+k);  // 定义pager的__fromParent
      //       }
      //     }
      //   }
      // })
      events = bindEvents(events, context)

      if (ky && mediaKeys.indexOf(ky) > -1) {
        let evts = []
        lib.forEach(events, (fun, ii, k) => {
          data[k] = events[k]
          evts.push(k)
        })
        evts.forEach(k => (delete events[k]))
      }

      if (context.config.$$is === 'item') {
        context.events = context.events ? Object.assign({}, context.events, events) : events
      }
    }
    
    
    data['__sort'] = incAttrs
    for (var attr of incAttrs) {
      const sonItem = data[attr]
      if (isArray(sonItem)) {
        data[attr] = sonItem.filter(item => resetItem(item, context, 'itemSubArray', attr))
      } else {
        if (ky && attr.indexOf('@') > -1) {
          /** 不去污染内部的父级链，只做表层 */
        }
        else {
          if (!React.isValidElement(sonItem)) {
            data[attr] = resetItem(sonItem, context, true, attr)
          }
        }
      }
    }

    
    if (!data.parent && !loop) data.itemDataRoot = true // 标识该item是最顶层item，class style用作容器描述
    
    if (ky && mediaKeys.indexOf(ky)>-1) {
      delete data.__sort
      delete data.show
      delete data.__relationId
      delete data.fromComponent
      delete data.__fromParent
      delete data.__key
      delete data.itemDataRoot
      data.className = data.itemClass; delete data.itemClass
      data.style = data.itemStyle; delete data.itemStyle
    }
  }

  return data
}


export function attr(data, p1, p2) {
  let attributs = data.attr || {}
  if (lib.isString(p1)) {
    if (p2) {
      attributs[p1] = p2
    }
  } else if(lib.isPlainObject(p1)) {
    attributs = Object.assign({}, attributs, p1)
  }
  return attributs
}

export function addClass(data, cls, cb) {
  if (cls) {
    cls = cls.replace(/\./g, '')
    cls = lib.isString(cls) ? cls.split(' ') : []
    let $itemClass = data.itemClass && data.itemClass.split(' ') || []
    cls = cls.filter(c => $itemClass.indexOf(c) == -1)
    $itemClass = $itemClass.concat(cls).join(' ')
    return $itemClass
    // this.update({
    //   itemClass: $itemClass.join(' ')
    // }, cb)
  }
}

export function removeClass(data, cls, cb) {
  if (cls) {
    cls = cls.replace(/\./g, '')
    cls = lib.isString(cls) ? cls.split(' ') : []
    let $itemClass = data.itemClass && data.itemClass.split(' ') || []
    let _cls = $itemClass.filter(c => c.indexOf(cls) === -1)
    $itemClass = _cls.join(' ')||' '
    return $itemClass
    // this.update({
    //   itemClass: ($itemClass.join(' ') || ' ')
    // }, cb)
  }
}

export function hasClass(data, cls) {
  if (cls) {
    cls = cls.replace(/\./g, '')
    cls = lib.isString(cls) ? cls.split(' ') : []
    let len = cls.length
    let $itemClass = data.itemClass && data.itemClass.split(' ') || []
    cls = cls.filter(c => $itemClass.indexOf(c) !== -1)
    return len === cls.length ? true : false
  }
}

export function css(data, params, cb) {
  if (!lib.isPlainObject(params)) {
    console.warn('不符合react的内联样式格式');
    return
  }

  let itemStyle = Object.assign({}, (data.itemStyle||{}), params)
  return itemStyle
  // this.update({ itemStyle }, cb)
}

export function toggleClass(cls, cb) {
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
}