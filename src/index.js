import path from 'path'
import react from 'react'
import reactDom from 'react-dom'
import * as util from './suba/lib'
import lodash from 'lodash/lodash.min'
// const reactDomServer = require('react-com/server')
const noop = util.noop
const sax  = util.sax
const isClient = util.isClient
const isReactNative = util.isReactNative
const context = isClient ? eval('window') : eval('global')

// if (!isClient) {
//   if (!isReactNative) {
//     reactDom = require('react-dom/server')
//     context.ReactDOMServer = reactDom
//     context.ReactDomServer = reactDom
//   }
// }

context.React = react
context.ReactDom = reactDom
context.ReactDOM = reactDom
context.SAX = sax
context._ = lodash
aotoo.context = context
context.Aotoo = aotoo
const {
  wrap, 
  combineX, 
  CombineClass, 
  createCombinClass,
  aotooEventEmitter
} = require('./suba/lib/aotoocombinx')

let extension = { plugins: {} }
let render = function (jsx) { return jsx }
let pureRender = function (jsx) { return jsx }

// if (!isReactNative) {
//   console.log('======== 1111');
//   if (isClient) {
//     console.log('======== 2222');
//     render = pureRender = ReactDom.render
//   } 
//   // else {
//   //   render = ReactDomServer.renderToString
//   //   pureRender = ReactDomServer.renderToStaticMarkup
//   // }
// }

// 前端render
function fedRender(element, id) {
  const targetDom = util.isString(id) ? document.getElementById(id) : (util.isDomElement(id)) ? id : ''
  if (targetDom) {
    return ReactDom.render(element, targetDom)
  } else {
    return element
  }
}

function aotoo(rctCls, acts, opts) {
  return createCombinClass(rctCls, acts, opts, extension)
}

function setAtRender(params) {
  if (isClient) {
    aotoo.html = aotoo.render = fedRender
  } 
}

aotoo.version = '4.0.17'
aotoo.combinex = combineX
aotoo.CombineClass = CombineClass
aotoo.isClient = isClient
aotoo.isReactNative = isReactNative
if (isReactNative) {
  aotoo.render = aotoo.html = render
} else {
  setAtRender()
}
for (let item in util) {
  aotoo[item] = util[item]
}

aotoo.wrapEx = function (key, cb) {
  aotoo[key] = function (ComposedComponent, opts, func) {
    return wrap(ComposedComponent, function (dom) {
      var result = cb(dom, opts, util)
      var isFun = typeof func == 'function'
      return isFun ? func(result) : result
    })
  }
}

aotoo.plugins = function (key, fun) {
  aotoo[key] = fun
  extension.plugins[key] = fun
}

aotoo.extend = function (key, cb) {
  aotoo[key] = function (opts) {
    return cb(opts, util)
  }
}

aotoo.plugins('wrap', wrap)

export default aotoo
export {
  combineX as combinex,
  CombineClass,
  aotooEventEmitter as AotooEventEmitter,
  wrap
}