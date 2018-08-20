import {
  noop,
  uniqueId,
  objTypeof,
  isArray,
  isObject,
  isFunction,
  isString,
  isClient,
  isReactNative,
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

import {
  didMount,
  unMount
} from './lifecycle'

/**
 * [combineX description]
 * @param  {react class | react element}   ComposedComponent [description]
 * @param  {object}   opts              [description]
 * @param  {Function} cb                [description]
 * @return {react class | object}       [description]
 */
function _combineX(ComposedComponent, opts, cb) {
  if (isFunction(ComposedComponent) || isObject(ComposedComponent)) {
    let returnReactClass = false
    if (isObject(opts) && opts.type == 'reactClass') {
      returnReactClass = true
      opts.type = undefined
    }

    if (React.isValidElement(ComposedComponent)) {
      return dealWithReactElement(ComposedComponent, opts, cb)
    }

    if (returnReactClass) {
      return dealWithReactClass( ComposedComponent, opts, cb )
    }
  }
}

/**
 * [dealWithReactElement 处理传入为react element 的场景，一般用于wrap]
 * @param  {react element} CComponent [description]
 * @return {react class}            [description]
 */
function dealWithReactElement(CComponent, opts = {}, cb) {
  return class extends (React.PureComponent || React.Component) {
    constructor(props) {
      super(props)
      this.config = opts
      this.intent = this.props.intent
      this.dom
      // this.rendered = cb
      this.rendered = function(dom, intent) {
        const ctx = this
        if (isFunction(cb)) {
          cb.call(ctx, dom, intent)
        } else {
          if (isObject(opts) && isFunction(opts.rendered)) {
            opts.rendered.call(ctx, dom, intent)
          }
        }
      }
    }

    componentWillUnmount() {
      unMount(this)
      // unMount(opts, this.props)
    }

    componentDidMount() {
      const _ctx = {}
      super.componentDidMount ? super.componentDidMount() : ''
      didMount.call(this, this, opts)
    }

    render() {
      let that = this
      let props = {}, evts = {}
      let _props = merge({}, opts.props, this.props)
      Object.keys(_props).forEach(key=>{
        if (key.indexOf('on') == 0 ) {
          if (isFunction(_props[key])) {
            evts[key] = function(e) {
              _props[key].call(that.dom, e, that.config)
            }
          }
        } else {
          props[key] = _props[key]
        }
      })
      return React.cloneElement(CComponent, {...props, ...evts, ref:ref=>this.dom=ref })
    }
  }
}

function dealWithReactClass(CComponent, opts = {}, cb) {
  return class extends CComponent {
    constructor(props) {
      super(props)
      this.config = opts
      this.intent = this.props.intent
      // this.rendered = cb
      this.rendered = function (dom, intent) {
        const ctx = this
        if (isFunction(cb)) {
          cb.call(ctx, dom, intent)
        } else {
          if (isObject(opts) && isFunction(opts.rendered)) {
            opts.rendered.call(ctx, dom, intent)
          }
        }
      }
    }

    componentWillUnmount() {
      super.componentWillUnmount ? super.componentWillUnmount() : ''
      unMount(this)
      // unMount(opts, this.props)
    }

    componentDidMount() {
      super.componentDidMount ? super.componentDidMount() : ''
      didMount.call(this, this, opts)
    }
  }
}

export function wrap(ComposedComponent, opts, cb) {
  opts = opts || { type: 'reactClass' }
  if (isObject(opts)) {
    opts.type = 'reactClass'
  }

  if (isFunction(opts)) {
    cb = opts
    opts = { type: 'reactClass' }
  }

  return _combineX(ComposedComponent, opts, cb)
}

export const combineX = wrap