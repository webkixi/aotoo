import * as lib from '../../lib'
import {attrKey, accessKey, eventName, isEvents} from '../../_common'

export function attachItem(pay, context) {
  let payload = []
  pay = [].concat(pay)
  pay.forEach(it => {
    if (lib.isNumber(it) || lib.isString(it) || React.isValidElement(it)) {
      it = { title: it }
    }
    if (lib.isPlainObject(it)) {
      let cClass = context.data.itemClass||''
      let iClass = it.itemClass||''
      it.itemClass = iClass ? cClass+' '+iClass : cClass
      it['__key'] = it['__key'] || lib.uniqueId('list_item_')
      payload.push(it)
    }
  })
  return payload
}

export default function getConfig(opts, context) {
  let mydata = {}
  let oriData = null
  let myoptions = {}
  let attr = {}
  let config = {}
  let itemMethod = {}
  let itemClass = ''
  let re = /\@[\w]+/g

  Object.keys(opts).forEach(k => {
    let v = opts[k]
    
    if (isEvents(k)) {
      itemMethod[k] = opts[k]
    } else if (k.indexOf('data-') === 0) {
      attr[k] = v
    } else if (re.test(k)) { 
      mydata[k] = v
    } else if (attrKey.indexOf(k) > -1) {
      if (k === 'data') {
        oriData = opts[k]
      } else {
        mydata[k] = opts[k]
      }
    } else {
      myoptions[k] = opts[k]
    }
  })

  if (mydata.methods) {
    for (let ky in mydata.methods) {
      myoptions[ky] = mydata.methods[ky]
    }
    delete mydata.methods
  }

  attr = Object.assign({}, mydata.attr, attr, myoptions.attr)
  mydata.attr = attr
  delete myoptions.attr

  if (myoptions.listMethod) {
    
  }

  if (mydata.itemMethod) {
    let itmMethod = mydata.itemMethod; delete mydata.itemMethod
    itemMethod = Object.assign({}, itemMethod, itmMethod)
  }

  if (mydata.itemClass) {
    let itmClass = mydata.itemClass;
    itemClass = itmClass
  }

  if (!lib.isArray(oriData)) {
    oriData = []
  }

  let datas = oriData.map(item => {
    if (lib.isString(item) || lib.isNumber(item) || React.isValidElement(item)) {
      item = {title: item}
    }
    if (lib.isPlainObject(item)) {
      item.itemClass = item.itemClass ? item.itemClass + ' ' + (itemClass||'') : itemClass
      item = Object.assign({__key: lib.uniqueId('list_item_')}, item, itemMethod)
    }
    return item
  })

  mydata.data = datas

  config = {
    data: mydata,
    ...myoptions,
  }

  return config
}