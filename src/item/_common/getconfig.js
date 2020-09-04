import * as lib from '../../lib'
import {attrKey, accessKey, eventName, isEvents} from '../../_common'

export default function getConfig(opts, context) {
  let mydata = {}
  let myoptions = {}
  let attr = {}
  let config = {}
  let methods = {}
  let re = /\@[\w]+/g

  if (lib.isString(opts) || lib.isNumber(opts)) {
    opts = {text: opts}
  }

  if (React.isValidElement(opts)) {
    opts = {title: opts}
  }

  Object.keys(opts).forEach(k => {
    let v = opts[k]
    
    if (isEvents(k)) {
      mydata[k] = opts[k]
    } else if (k.indexOf('data-') > -1) {
      attr[k] = v
    } else if (k.indexOf('@')===0) { 
      mydata[k] = v
    } else if (attrKey.indexOf(k) > -1) {
      mydata[k] = opts[k]
    } else {
      myoptions[k] = opts[k]
    }
  })

  // if (opts.data) {
  //   config = opts
  // }

  if (mydata.methods) {
    for (let ky in mydata.methods) {
      myoptions[ky] = mydata.methods[ky]
    }
    delete mydata.methods
  }

  attr = Object.assign({}, mydata.attr, attr, myoptions.attr)
  mydata.attr = attr
  delete myoptions.attr

  config = {
    data: mydata,
    ...myoptions,
  }

  return config
}