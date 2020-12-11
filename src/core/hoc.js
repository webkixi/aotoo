import * as lib from "../lib";
import {attrKey, accessKey, eventName, internalKeys, isEvents, bindEvents} from '../_common/index'

import elementsCollection from './elements'
let _elements = elementsCollection('core')

function combineComponent(ORIClass, options, parent, splitProps) {
  let selfStateChanging = false
  let selfStateChanged = false

  return class CComponent extends ORIClass {
    constructor(props){
      super(props)
      let _data = parent.data||{}
      let myState = splitProps ? _data : Object.assign({}, _data, props);
      this.state = Object.assign({}, this.state, myState)
      this.selfStateChanging = false
      this.selfStateChanged = false
      this.oriState = lib.cloneDeep(this.state)
      this.id = props.id || this.state.id
      if (props.id) parent.id = this.id
      this.uiCount = parent.uiCount
      
      this.ref = React.createRef()
      this.env = parent
      parent.ref = this.ref
      parent.reactComponentInstance = this;
      this.setSelfState = this.setSelfState.bind(this)
      this.reset = this.reset.bind(this)
      this.syncParentData = this.syncParentData.bind(this) 
      if (parent.isINmemery === undefined) {
      // if (!parent.isINmemery) {
        parent._onload_(this.props)
      }
      this.syncParentData(this.props);
    }

    // 组件内修改state后，不允许props从外部污染数据
    // reset之后，恢复从props穿透数据渲染
    reset(param) {
      this.setSelfState((param || this.oriState))
      this.selfStateChanged = false
      selfStateChanged = false
    }

    syncParentData(param = {}) {
      let state = lib.cloneDeep(this.state)
      parent.data = lib.merge({}, state, param);
      parent.hooks.emit('sync-state-data', parent.data)
    }

    setSelfState(param, cb) {
      if (!parent.hasMounted) return
      this.selfStateChanging = true
      this.selfStateChanged = true
      selfStateChanging = true
      selfStateChanged = true

      const setMYstate = (param) => {
        let $state = this.state
        if (lib.isPlainObject(param)) {
          Object.keys(param).forEach(ky => {
            let val = param[ky]
            lib.set($state, ky, val)
          })
        }

        let events = {}
        for (let ky in $state) {
          let val = $state[ky]

          if (isEvents(ky)) {
            if ( ['item', 'list'].indexOf(parent.$$is) === -1) {
              events[ky] = val
            }
          } else {
            if (lib.isFunction(val)) {
              parent[ky] = val
            }
          }
        }
        events = bindEvents(events, parent)
        
        return Object.assign($state, events)
      }

      param = setMYstate(param)
      this.syncParentData(param);

      const setStat = () => {
        this.selfStateChanging = false
        selfStateChanging = false
        if (lib.isFunction(cb)) cb()
      }

      if (parent.hasMounted === 'component_init_set_state') {
        this.state = param
        setStat()
      } else {
        this.setState(param, setStat)
      }
    }

    // 父级传导数据触发更新  -----  step 1
    static getDerivedStateFromProps(props, state){
      if (ORIClass.getDerivedStateFromProps) {
        return ORIClass.getDerivedStateFromProps(props, state)
      }
      if (selfStateChanging) {
        return state
      } else {
        let res = props
        if (lib.isFunction(parent.getDerivedStateFromProps)) {
          res = (parent.getDerivedStateFromProps(props, state) || {})
        } 

        // let propsData = res.data||res
        // res = Object.assign({}, state, propsData)
        
        if (!selfStateChanged) { // 当没有内部更新，自动放行props的数据
          return res
        } else {
          if (parent.alwaysSyncProps) {
            return res
          }

          if (splitProps) {
            if (res && res.forceSyncProps) {
              return res
            }
            return null
          }
        }
      }
      return null
    }


    // 父级传导数据触发更新  -----  step 2
    // shouldComponentUpdate(nextProps, nextState)


    // update ---- before
    // 在render之前调用，state已更新
    getSnapshotBeforeUpdate(prevProps, prevState){
      if (super.getSnapshotBeforeUpdate) {
        return super.getSnapshotBeforeUpdate(prevProps, prevState)
      }
      if (lib.isFunction(parent.getSnapshotBeforeUpdate)) {
        return parent.getSnapshotBeforeUpdate(prevProps, prevState)
      }
      return null
    }

    // onReady
    componentDidMount() {
      const {current} = this.ref
      parent.dom = current
      parent.hasMounted = true;
      parent.isINmemery = false
      super.componentDidMount && super.componentDidMount()
      parent.hooks.emit('sync-state-data', parent.data)
      parent._ready_()
    }

    // update ----- after
    // 在render之后调用，state已更新
    // snapshot 为getSnapshotBeforeUpdate方法返回的值
    componentDidUpdate(prevProps, prevState, snapshot) {
      super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, snapshot)
      parent.componentDidUpdate && parent.componentDidUpdate(prevProps, prevState, snapshot)
      parent.didUpdate(prevProps, prevState, snapshot)
    }

    componentWillUnmount() {
      if (this.uiCount !== parent.uiCount) return
      parent.hasMounted = false
      parent.isINmemery = true
      super.componentWillUnmount && super.componentWillUnmount()
      let unLoad = parent.onUnload || parent.componentWillUnmount || parent.detached
      if (lib.isFunction(unLoad)) {
        unLoad.call(parent)
      }
    }

    // static getDerivedStateFromError(error)

    // componentDidCatch(error, info)

    render() {
      if (parent.__showStat) {
        let JSX =  super.render()
        return React.cloneElement(JSX, { ref: this.ref })
      } else {
        return null
      }
    }
  }
}

function _onload_(props) {
  this.hasMounted = 'component_init_set_state'
  this.hooks.emit('constructor-react-component', props, this)
  this.attached(props) // 小程序组件生命周期 attached
  this.hasMounted = false
}

function _ready_(params) {
  this.ready()
}

function _setData_(param = {}, cb) {
  if (this.reactComponentInstance && this.hasMounted) {
    this.reactComponentInstance.setSelfState(param, cb);
  } else {
    // created生命周期中
    this.data = Object.assign({}, this.data, param)
  }
}

class CombineClass {
  constructor(oriClass, config={}, splitProps){
    let _param = lib.cloneDeep(config);;
    let _data = _param.data||{}; delete _param.data;
    let _property = _param;
    this.config = _param

    let that = this
    
    // this.uniqId = _param.__key || _data.__key || lib.uniqueId('base_')
    this.uniqId = _param.uniqId || _data.uniqId || lib.uniqueId('base_')
    // 存储实例
    _elements.setElement(this.uniqId, this)
    if (config.$$id) {
      this.$$id = config.$$id
      this.id = this.$$id
      _elements.setElement(this.$$id, this)
    }
    
    let defaultData = {
      // alwaysSyncProps: false
    }
    
    this.alwaysSyncProps = this.config.alwaysSyncProps || false  // 是否持续更新props(任何时候)
    this.__showStat = _data.hasOwnProperty('show') ? _data.show : true
    this.id = this.$$id || _data.id
    this.dom = null  // 真实dom实例，最外层的容器
    this.hasMounted = false;
    this.data = Object.assign({uniqId: this.uniqId}, defaultData, _data);
    this.hooks = lib.hooks(lib.uniqueId('baseClass_'))
    this.children = []
    this.events = null  // data中的event合集
    
    // 祖先节点
    if ((this.data.fromComponent || this.data.rootComponent) && 
    (this.data.fromComponent || this.data.rootComponent) !== this.uniqId) {
      this.componentInst = $$(this.data.fromComponent)
      this.rootInstance = this.componentInst
    }

    // 父级节点
    if (this.data.__fromParent && this.data.__fromParent !== this.uniqId) {
      this.parentInst = $$(this.data.__fromParent)
      if (this.parentInst) {
        let isExist = false;
        (this.parentInst.children || []).forEach(child=>{
          if (child.uniqId === this.uniqId) isExist = true
        })
        if (!isExist) {
          this.parentInst.children.push(this)
        }

        if (!this.componentInst) {
          this.componentInst = this.parentInst
          this.rootInstance = this.componentInst
        }
      }
    } else {
      this.data.fromComponent = this.uniqId
      this.data.rootComponent = this.uniqId
    }
    this.data.__fromParent = this.uniqId

    // react组件内部的上下文环境
    Object.defineProperty(this, "reactComponentInstance", lib.protectProperty(null));

    // react dom销毁后，实例是否仍驻内存
    Object.defineProperty(this, "isINmemery", lib.protectProperty());

    // 组件的被渲染次数
    Object.defineProperty(this, "uiCount", lib.protectProperty(0));

    // 渲染过后把jsx存储在本地
    Object.defineProperty(this, "jsx", lib.protectProperty());
    
    // 小程序组件生命周期 attached, page生命周期 onLoad
    Object.defineProperty(this, "_onload_", lib.protectProperty(_onload_.bind(this)));
    
    // 小程序组件生命周期 ready, page生命周期 onReady
    Object.defineProperty(this, "_ready_", lib.protectProperty(_ready_.bind(this)));

    Object.defineProperty(this, "_setData_", lib.protectProperty(_setData_.bind(this)));

    // 批量设置实例属性
    Object.keys(_property).forEach((ky) => {
      if (internalKeys.indexOf(ky) === -1) {
        let val = _property[ky];
        if (lib.isFunction(val)) {
          val = val.bind(this)
        }
        this[ky] = val
      }
    });

    this.created() // 小程序组件生命周期 created
    let UI = combineComponent(oriClass, config, this, splitProps);
    this.UI = function(props) {
      return <UI {...props} />
      // that.jsx = that.jsx || <UI {...props} />
      // // that.jsx = that.jsx ? React.cloneElement(that.jsx, props) : <UI {...props} />
      // return that.jsx
    }
  }

  created(){
    this.tasks = [] // setData的更新任务
    this.taskData = this.getData()
    this.taskStat = true // setData的更新状态
    this.taskTimmer = null

    let config = this.config
    let $data = this.data
    let events = {}
    lib.forEach($data, (val, ii, ky) => {
      if (isEvents(ky)) {
        if (['item', 'list'].indexOf(this.$$is) === -1) {
          events[ky] = val
        }
      } else {
        if (lib.isFunction(val)) {
          this[ky] = val
        }
      }
    })
    events = bindEvents(events, this)
    if (lib.isFunction(config.created)) {
      config.created.call(this) 
    }
    this.data = Object.assign($data, events)
  }

  attached(props){
    let config = this.config
    if (lib.isFunction(config.attached)) {
      this.properties = props
      config.attached.call(this, props)
    }
  }

  ready(){
    let config = this.config
    let myready = config.onReady || config.ready || config.__ready
    if (lib.isFunction(myready)) { // 小程序组件生命周期 ready / Pager的onReady
      myready.call(this)
    }
  }

  detached() {
    let config = this.config
    let mydetached = config.onUnload || config.detached || config.componentWillUnmount
    if (lib.isFunction(mydetached)) { // 小程序组件生命周期 ready / Pager的onReady
      mydetached.call(this)
    }
  }

  getData() {
    if (this.tasks.length || this.taskTimmer) {
      return lib.cloneDeep(this.taskData)
    }
    return lib.cloneDeep(this.data)
  }

  parent(indentify) {
    if (!indentify) {
      return this.parentInst
    } else {
      if (this.parentInst) {
        if (this.parentInst.hasClass(indentify)) {
          return this.parentInst
        } else {
          return this.parentInst.parent(indentify)
        }
      }
    }
  }

  attr(params, value) {
    if (lib.isString(params)) {
      if (!value) {
        return this.getData().attr[params]
      } else {
        let $attr = this.getData().attr(params)
        if ($attr) {
          let setKey = `attr[${params}]`
          this.setData({ [setKey]: value })
        }
      }
    } else {
      if (lib.isObject(params)) {
        let $attr = this.getData().attr || {}
        $attr = Object.assign({}, $attr, params)
        this.setData({
          attr: $attr
        })
      } else {
        return this.getData().attr
      }
    }
  }

  didUpdate(prevProps, prevState, snapshot) {
    if (lib.isFunction(this.config.didUpdate)) {
      this.config.didUpdate.call(this, prevProps, prevState, snapshot)
    }
  }

  reset(param){
    this.reactComponentInstance && this.reactComponentInstance.reset(param)
  }

  show(){
    this.__showStat = true
  }

  hide(){
    this.__showStat = false
  }

  destory(){
    let __key = this.config.__key || this.config.data.__key
    if (this.$$id) {
      _elements.delElement(this.$$id)
    }
    if (__key) {
      _elements.delElement(__key)
    }
    
    _elements.delElement(this.uniqId)
    this.reactComponentInstance = null
    this.hasMounted = false
    this.isINmemery = undefined
    this.UI = null
    this.dom = null
    this.hooks = null
  }

  setData() {
    if (this.config.setData) {
      this.config.setData.apply(this, arguments)
    } else {
      this._setData.apply(this, arguments)
    }
  }

  __setData(param, cb) {
    clearTimeout(this.taskTimmer)
    let that = this

    if (!this.tasks.length) {
      this.taskData = this.getData()
    }

    // created
    if (!this.hasMounted) {
      this.__setData(param, cb)
      return
    }

    // attached/onload
    // 插入任务前转走
    if (this.hasMounted === 'component_init_set_state') {
      this.__setData(param, cb)
      return
    }

    if (param) {
      this.tasks.push([param, cb])
    }

    // 方案一
    function* tmp(opt) {
      let p = opt[0]
      let callback = opt[1]
      lib.forEach(p, (val, ii, ky) => {
        lib.set(that.taskData, ky, val)
      })
      if (lib.isFunction(callback)) callback()
      yield
      return function () {
        that.__setData(that.taskData, callback)
        // that.taskTimmer = setTimeout(() => {
        //   that.__setData(that.taskData, callback)
        // }, 51);
      }
    }

    let task = this.tasks.shift()
    let gen = tmp(task)
    gen.next()
    if (!this.tasks.length) {
      let res = gen.next()
      let fun = res.value
      fun()
    }
    // 方案一结束
  }

  // 真实setData，可以直接调用
  _setData(param = {}, cb) {
    if (!lib.isPlainObject(param)) return;
    let result = this.hooks.emit('before-setdata', param, this)
    if (result && result[0]) {
      result = result[0]
      if (lib.isFunction(result.then)) {
        result.then(res => this._setData_(res, cb)).catch(err => err)
      } else {
        this._setData_(result, cb)
      }
    } else {
      this._setData_(param, cb)
    }
  }

  update(){
    if (lib.isFunction(this.config.update)) {
      this.config.update.apply(this, arguments)
    }
  }

  render(props) {
    let UI = this.UI
    return lib.isPlainObject(props) ? <UI {...props} /> : <UI />
  }
}

export default function hocClass(reactComponentClass, options, splitProps) {
  return new CombineClass(reactComponentClass, options, splitProps)
}