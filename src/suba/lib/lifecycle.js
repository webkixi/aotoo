import {
  noop,
  uniqueId,
  objTypeof,
  isArray,
  isObject,
  isFunction,
  isString,
  // 下面三个是常量
  isClient,
  isReactNative,
  isServer,

  sizeof,
  merge,
  forEach,
  arr2json,
  deepFind,
  protectProperty,

  find,
  findIndex,
  filter,
  cloneDeep,
  sax
} from './util'

const findDOMNode = ReactDom.findDOMNode || function (ctx) { return ctx }

/**
 * 
 * @param {Object} rcInst:  ReactClass的实例
 */
export function didMount(rcInst, opts) {
  var componentCtx = {}
  if (this && rcInst) {
    if ((isClient && this !== window) || (!isClient && this !== global)) {
      if (this.holdDispatchQueue && this.holdDispatchQueue.length) {
        const newState = this.holdDispatchQueue.reduce((p, n) => {
          if (isArray(n)) {
            const key = n[0]
            const param = n[1]
            const actions = this.data('actions')
            let oState = this.originalState
            let curState = this.curState || cloneDeep(rcInst.state)
            const act = actions[key]
            if (isFunction(act)) {
              n = act.call({curState}, oState, param, this)
            } else {
              n = {}
            }
          }
          return merge(p, n)
        }, {})
        this.holdDispatchQueue = []
        this.curState = newState
        rcInst.setState(newState)
        return 
      } 
    
      // if ((typeof window !== 'undefined' && this !== window) || (typeof global !== 'undefined' && this !== global)) {
      const didMethod = rcInst.props.rendered || rcInst.props.itemMethod || this.rendered || this.config.rendered
      componentCtx = {
        dom: findDOMNode(rcInst),
        refs: rcInst.refs,
        index: rcInst.props.idf,
        context: this,
        ctx: this
      }

      if (isFunction(rcInst.on)) {
        rcInst.emit('beforeRendered', componentCtx)
        rcInst.emit('__beforeRendered', componentCtx)
        rcInst.emit('_beforeRendered', componentCtx)
        rcInst.off('__beforeRendered')
        rcInst.off('_beforeRendered')
      }

      if (isFunction(didMethod)) {
        didMethod.call(this, componentCtx.dom, rcInst.intent)
      }
  
      if (isFunction(rcInst.on)) {
        rcInst.emit('rendered', componentCtx)
        rcInst.emit('__rendered', componentCtx)
        rcInst.emit('_rendered', componentCtx)
        rcInst.off('__rendered')
        rcInst.off('_rendered')
      }
    }
  }
}

/**
 * 
 * @param {Object} rcInst ReactClass的实例
 */
export function unMount(rcInst) {
  /** destory some thing */
  const operat = {
    destory: noop
  }
  const leaveFunction = rcInst.props.leave || rcInst.config.leave
  if (isFunction(leaveFunction)) {
    leaveFunction(operat)
  }
  if (this && this.destory) {
    this.destory()
    this.xInst = Object.create(null)
    this.curState = Object.create(null)
    this.liveState = Object.create(null)
    this.originalState = Object.create(null)
    this.config = Object.create(null)
  }
}