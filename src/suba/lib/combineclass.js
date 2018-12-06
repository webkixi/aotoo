import {
  noop,
  uniqueId,
  objTypeof,
  isArray,
  isObject,
  isDomElement,
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

import {
  didMount,
  unMount
} from './lifecycle'

import Aee from './aotooeventemitter'

// const evts = ['on', 'off', 'emit', 'roll', 'hasOn', 'pop', 'set', 'get', 'append', 'update', 'bind', 'unbind']
const evts = ['on', 'off', 'emit', 'roll', 'hasOn']

function embedPlugins(ctx, extensions) {
  if (isObject(extensions)) {
    forEach(extensions, (ext, ii) => {
      const plug = extensions[ext]
      if (isFunction(plug)) {
        ctx[ext] = plug
      }
    })
  }
}

function embedActions(ctx, inst) {
  const actionsLowerCaseNames = inst['_actionMethodlowerCaseNames']
  forEach(actionsLowerCaseNames, (ii, item)=>{
    ctx[item] = inst[item].bind(inst)
  })
}

function AotooHoc(oriReactClass, actions, inst) {
  class AotooClass extends oriReactClass {
    constructor(props){
      super(props)
      this.props = this.props || props

      forEach(evts, (ii, evt) => {
        this[evt] = inst::inst[evt]
      })
      this.dispatch = inst::inst.dispatch
      this.setComponentState = function (obj) {
        if (isObject(obj)) {
          inst.curState = obj
          this.setState(obj)
        }
      }.bind(this)
      embedPlugins(this, inst.embeds)   // 绑定外部插件
      embedActions(this, inst)   // 绑定actions的方法
      
      inst.originalState = cloneDeep(this.state||{})
      inst.liveState = this.state
      inst.xInst = this
      // this.saxer = inst
      this.saxer = inst._saxer(inst)
      this.config = inst.config
      this.intent = this.props.intent || this.props.idf || 0;
    }
    
    componentWillUnmount() {
      inst._hasMounted = false
      super.componentWillUnmount ? super.componentWillUnmount() : ''
      inst.unMount.call(inst, this)
      // opts.leave = opts.leave || this.props.leave
      // unMount(opts, this.props, queryer)
    }

    componentDidUpdate() {
      this.didUpdate = true
      super.componentDidUpdate ? super.componentDidUpdate() : ''
      this.componentDidMount()
    }

    componentDidMount() {
      inst._hasMounted = true
      if (this.didUpdate = true) {
        this.didUpdate = false
      }
      const _ctx = {
        refs: this.refs,
        index: this.props.idf
      }
      inst.refs = this.refs
      super.componentDidMount ? super.componentDidMount() : ''
      inst.didMount.call(inst, this)
    }

    render(){
      if (isClient || isReactNative) {
        // if (!inst.fromAotooRender) {
        //   inst.setProps(merge({}, this.props))
        //   inst.fromAotooRender = true //如果从<Instance.x {...}/>过来，需要同步一次props，已经同步过一次，不需要再次同步
        // }
        return super.render()
      } else {
        const renderJsx = super.render()
        return inst.render(renderJsx)
      }
    }
  }

  AotooClass.defaultProps = {}

  return AotooClass
}

/**
 * eeData
 * eeActions
 * on, off, emit ...
 */
export class CombineClass extends Aee {
  constructor(reactClass, actions={}, config={}, embeds={}){
    super(config)
    this.config = config
    // this.setProps({
    //   loaderContext: this,
    //   eventContext: this
    // })
    this.isClient = isClient

    // 是否mounted
    Object.defineProperty(this, "_hasMounted", protectProperty(false));
    // 原始state数据
    Object.defineProperty(this, "originalState", protectProperty(undefined));
    // 实时state数据
    Object.defineProperty(this, "liveState", protectProperty(undefined));
    Object.defineProperty(this, "curState", protectProperty(undefined));
    // 新react class的实例
    Object.defineProperty(this, "xInst", protectProperty(undefined));

    Object.defineProperty(this, "holdDispatchQueue", protectProperty([]));
    // react class 绑定后的方法
    Object.defineProperty(this, "didMount", protectProperty(didMount));
    // react class 解绑后的方法
    Object.defineProperty(this, "unMount", protectProperty(unMount));

    Object.defineProperty(this, "_actionMethodlowerCaseNames", protectProperty([]));

    // 保存actions
    this.embeds = embeds.plugins
    if (isObject(actions)) {
      this.eeData.actions = actions
      forEach(actions, (actName, ii) => {
        const lowerCaseActName = '$' + actName.toLowerCase()
        this['_actionMethodlowerCaseNames'].push(lowerCaseActName)
        this[lowerCaseActName] = function(params) {
          this.dispatch(actName, params)
          return this
        }
      })
    }

    // 剔除AotooEventEmitter的数据处理方法
    // 使用data的方法代替以下方法
    this.pop = undefined
    // this.set = undefined
    // this.get = undefined
    this.append = undefined
    this.update = undefined

    this.data = function(key, val) {
      if (!key) {
        return this.eeData
      }

      if (isString(key)) {
        if (!val) {
          return this.eeData[key]
        } else {
          this.eeData[key] = val
          return this
        }
      }

      if (isObject(key)) {
        if (val === true) {
          this.eeData = key
        } else {
          this.eeData = merge(this.eeData, key)
        }
      }
    }

    this.saxer = this._saxer(this)
    // this.x = AotooHoc(reactClass, actions, this)
    this.HocClass = AotooHoc(reactClass, actions, this)
    this.x = function(props={}) {
      this.setProps(props)
      return this.render()
    }.bind(this)
  }

  _saxer(ctx){
    return {
      on:     this.on.bind(ctx),
      off:    this.off.bind(ctx),
      emit:   this.emit.bind(ctx),
      roll:   this.roll.bind(ctx),
      hasOn:  this.hasOn.bind(ctx),
      set:    this.data.bind(ctx),
      get:    this.data.bind(ctx),
      append: this.data.bind(ctx),
      update: this.data.bind(ctx),
      data:   this.data.bind(ctx)
    }
  }

  getState(){
    // return this.liveState
    return this.curState||this.liveState
  }

  dispatch(key, params){
    if (isClient) {
      setTimeout(() => {
        dispatcher(key, params, this)
      }, 0);
    }
  }

  hasMounted(){
    return this._hasMounted
  }

  extend(exts) {
    if (typeof exts == 'object') {
      forEach(exts, (key, ii) => {
        const rightValue = exts[key]
        if (isFunction(rightValue)) {
          this[key] = rightValue.bind(this)
        } else {
          this[key] = rightValue
        }
      })
    }
  }

  setConfig(config) {
    this.config = config || {}
    return this
  }

  setProps(props) {
    // this.config.props = props
    this.config.props = merge({}, this.config.props, props)
    return this
  }

  render(id, callback){
    if (isServer && id && React.isValidElement(id)) {
      const self = this
      setTimeout(() => {
        self.destyory()
        self.xInst = Object.create(null)
        self.curState = Object.create(null)
        self.liveState = Object.create(null)
        self.originalState = Object.create(null)
        self.config = Object.create(null)
        self.x = Object.create(null)
        self.HocClass = Object.create(null)
      }, 100);
      return id
    } else {
      // const X = this.x
      const X = this.HocClass
  
      if (isFunction(id)) {
        callback = id
        id = undefined
      }
  
      id = id || this.config.container
  
      let _props = this.config.props || {}
      let didMethod = callback || this.rendered || _props.rendered || this.config.rendered
      _props.rendered = didMethod
  
      let leaveMethod = _props.leave || this.config.leave || this.leave
      _props.leave = leaveMethod
      this.config.props = _props
  
      if (isClient) {
        this.config.container = id
        return browserRender(id, X, _props, this.config)
      } else {
        return <X {..._props} />
      }
    }
  }
}

function browserRender(id, X, props, config) {
  // const props = config.props
  if (isString(id)) {
    if (document.getElementById(id)) {
      ReactDom.render(<X {...props} />, document.getElementById(id))
    }
  } else if (typeof id === 'object' && id.nodeType) {
  // } else if (isObject(id) && id.nodeType) {
    ReactDom.render(<X {...props} />, id)
  } else {
    return <X {...props} />
  }
}

/**
 * type 2
 * ComposedComponent 为 React class
 * @type {[type]}
 */
// let curState = undefined
function dispatcher(key, params, control) {
  const xInst = control.xInst
  if (xInst) {
    const oState = control.originalState
    // let curState = curState || cloneDeep(xInst.state)
    let curState = control.curState || cloneDeep(xInst.state)
    const actions = control.data('actions')
    // actions.curState = curState
    const act = actions[key]
    if (isFunction(act)) {
      let newState = act.call({curState: curState}, oState, params, control)
      if (isObject(newState)) {
        control.curState = newState
        if (control._hasMounted) {
          control._hasMounted = false
          // curState = undefined
          xInst.setState(newState)
        } else {
          control.holdDispatchQueue.push(newState)
        }
      }
    }
  } else {
    control.holdDispatchQueue.push([key, params])
  }
}

export function createCombinClass(rctCls, acts = {}, config, embeds) {
  // if (isClient) {
  //   const globalName = uniqueId('Combinex_')
  //   instanceCollection[globalName] = new CombineClass(config, rctCls, acts, exts, globalName)
  //   return instanceCollection[globalName]
  // } else {
  //   return createServerClass(config, rctCls, acts, exts)
  // }

  return new CombineClass(rctCls, acts, config, embeds)
}