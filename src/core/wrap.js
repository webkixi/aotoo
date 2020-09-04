import * as lib from "../lib";
import {attrKey, accessKey, eventName, internalKeys, isEvents} from '../_common/index'

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
      
      this.ref = React.createRef()
      this.env = parent
      parent.ref = this.ref
      parent.reactComponentInstance = this;
      this.setSelfState = this.setSelfState.bind(this)
      this.reset = this.reset.bind(this)
      this.syncParentData = this.syncParentData.bind(this)
      if (!parent.isINmemery) {
        parent._onload_(this.props)
      }
      this.syncParentData();
    }

    reset(param) {
      this.setSelfState((param || this.oriState))
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

        for (let ky in $state) {
          let val = $state[ky]
          if (lib.isFunction(val) && !eventName.includes(ky)) {
            parent[ky] = val
          }
        }

        return $state
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
      if (lib.isFunction(parent.componentDidUpdate)) {
        super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, snapshot)
        parent.componentDidUpdate && parent.componentDidUpdate(prevProps, prevState, snapshot)
        parent.didUpdate(prevProps, prevState, snapshot)
        // this.componentDidMount()
      }
    }

    componentWillUnmount() {
      parent.hasMounted = false
      parent.isINmemery = true
      super.componentWillUnmount && super.componentWillUnmount()
      let unLoad = parent.onUnload || parent.componentWillUnmount
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
  this.reactComponentInstance.setSelfState(param, cb);
}

class CombineClass {
  constructor(oriClass, config={}, splitProps){
    let _param = config;
    let _data = _param.data||{}; delete _param.data;
    let _property = _param;
    this.data = _data
    this.config = _param
    this.uniqId = lib.uniqueId('base_')
    let defaultData = {
      // alwaysSyncProps: false
    }

    this.alwaysSyncProps = this.config.alwaysSyncProps || false  // 是否持续更新props(任何时候)
    this.__showStat = _data.show || true
    this.id = _data.id
    this.dom = null  // 真实dom实例，最外层的容器
    this.hasMounted = false;
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
      }
    } else {
      this.data.fromComponent = this.uniqId
      this.data.rootComponent = this.uniqId
    }
    this.data.__fromParent = this.uniqId

    // react组件内部的上下文环境
    Object.defineProperty(this, "reactComponentInstance", lib.protectProperty(null));

    // react dom销毁后，实例是否仍驻内存
    Object.defineProperty(this, "isINmemery", lib.protectProperty(false)); 
    
    // 小程序组件生命周期 attached, page生命周期 onLoad
    Object.defineProperty(this, "_onload_", lib.protectProperty(_onload_.bind(this)));
    
    // 小程序组件生命周期 ready, page生命周期 onReady
    Object.defineProperty(this, "_ready_", lib.protectProperty(_ready_.bind(this)));

    Object.defineProperty(this, "_setData_", lib.protectProperty(_setData_.bind(this)));

    // 存储实例
    _elements.setElement(this.uniqId, this)
    if (config.$$id) {
      this.$$id = config.$$id
      this.id = this.$$id
      _elements.setElement(this.$$id, this)
    }

    // 批量设置实例属性
    Object.keys(_property).forEach((ky) => {
      if (internalKeys.indexOf(ky) === -1) {
        this[ky] = _property[ky];
      }
    });

    this.created() // 小程序组件生命周期 created
    this.UI = combineComponent(oriClass, config, this, splitProps);
  }

  created(){
    let config = this.config
    if (lib.isFunction(config.created)) {
      config.created.call(this) 
    }
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

  getData(){
    return this.data
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
    this.reactComponentInstance.reset(param)
  }

  show(){
    this.__showStat = true
  }

  hide(){
    this.__showStat = false
  }

  destory(){
    if (this.$$id) {
      _elements[this.$$id] = null
    }
    this.isINmemery = false
    this.UI = null
    this.dom = null
    this.hooks = null
  }

  setData(param = {}, cb) {
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
  if (lib.isClass(reactComponentClass)) {
    return new CombineClass(reactComponentClass, options, splitProps)
  }
}