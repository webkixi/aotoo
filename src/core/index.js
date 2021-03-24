import react from 'react'
// import reactDom from 'react-dom'  //  多次引用会造成问题

import elementsCollection from './elements'
import hocClass from './hoc'
import wrapClass from './wrap'
import {extendsTemplate} from '../_common/partment'
import * as lib from "../lib";
import {attrKey, accessKey, eventName, internalKeys, isEvents, bindEvents} from '../_common/index'

const context = lib.curContext()
context.React = context.React || react

let _elements = elementsCollection('core')

export function $$(id) {
  return _elements.getElement(id)
}

export function ReturnPromiseComponent(props){
  let rendered = false
  let [value, setValue] = React.useState(
    <View className={'ui-loading '+(props.loadingClass||'')}/>
  )

  React.useEffect(()=>{
    rendered = true
    props.content.then(value=>{
      if (rendered) {
        setValue(value)
      }
    })
    return function(){
      rendered = false
    }
  })
  
  return (
    <>
      {value}
    </>
  )
}

let getFunctionComponent = require('./getfunctioncomponent')
let getReactComponentClass = require('./getreactcomponentclass')

// function setContainerDom(ele) {
//   return this.reactComponentInstance.ref
//   // this.dom = ele
// }

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
  // if (this.reactComponentInstance && this.hasMounted) {
  if (this.reactComponentInstance) {
    this.reactComponentInstance.setSelfState(param, cb);
  } else {
    // created生命周期中
    this.data = Object.assign({}, this.data, param)
    if (lib.isFunction(cb)) {
      cb()
    }
  }
}

function removeParentChild(){
  if (this.parentInst && this.parentInst.children.length) {
    let uniqId = this.uniqId
    let tmpAry = []
    this.parentInst.children.forEach(child=>{
      if (child.uniqId !== uniqId) tmpAry.push(child)
    })
    this.parentInst.children = tmpAry
  }
}

class baseClass {
  constructor(config={}, template, splitProps, useConfigComponent) {
    if (!config.data) {
      console.warn('需要指定data数据');
      config.data = {}
      // return 
    };
    if (!lib.isPlainObject(config.data)) {
      console.warn('data数据必须为Object');
      return
    };

    let that = this

    let _param = lib.cloneDeep(config);
    let _data = _param.data||{}; delete _param.data;
    let _property = _param;
    this.config = _param
    
    // this.uniqId = _param.__key || _data.__key || lib.uniqueId('base_')
    this.uniqId = _param.uniqId || _data.uniqId || lib.uniqueId('base_')
    // 存储实例
    _elements.setElement(this.uniqId, this)
    if (_data.$$id) {
      this.$$id = _data.$$id
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
    this.ref = React.createRef()
    
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

    // UI被移除时，移除父级children的引用
    Object.defineProperty(this, "removeParentChild", lib.protectProperty(removeParentChild.bind(this)));
    
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
    if (useConfigComponent) {
      this.UI = getReactComponentClass(this.data, this, template, splitProps);
      // let UI = getReactComponentClass(this.data, this, template, splitProps);
      // this.UI = function(props) {
      //   that.uiCount++
      //   return <UI {...props} />
      // }
    } else {
      this.UI = getFunctionComponent(this.data, this, template, splitProps)
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

  detached(){
    let config = this.config
    let mydetached = config.onUnload || config.detached || config.componentWillUnmount
    if (lib.isFunction(mydetached)) { // 小程序组件生命周期 ready / Pager的onReady
      mydetached.call(this)
    }
  }

  getData(){
    if (lib.isFunction(this.config.getData)) {
      return this.config.getData.call(this)
    } else {
      if (this.tasks.length || this.taskTimmer) {
        return lib.cloneDeep(this.taskData)
      }
      return lib.cloneDeep(this.data)
    }
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

  reset(param, cb){
    if (lib.isFunction(this.config.reset)) {
      this.config.reset.call(this, param, cb)
    } else {
      this.reactComponentInstance && this.reactComponentInstance.reset(param, cb)
    }
  }

  show(){
    this.__showStat = true
  }

  hide(){
    this.__showStat = false
  }

  destory(){
    let __key = this.config.__key || (this.config.data && this.config.data.__key)
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

  setData(){
    if (this.config.setData) {
      this.config.setData.apply(this, arguments)
    } else {
      this._setData.apply(this, arguments)
    }
  }

  __setData(param, cb){
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

    if (param){
      this.tasks.push([param, cb])
    }

    function *tmp(opt) {
      let p = opt[0]
      let callback = opt[1]
      lib.forEach(p, (val, ii, ky)=>{
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

export {
  lib,
  _elements
}

// 扩展内部模板
export function extTemplate(params={}){
  return extendsTemplate(params)
}

function setUniqId(param){
  let _uid = param.uniqId || param.data.uniqId
  if (_uid) return param
  else {
    param.uniqId = lib.uniqueId('base_')
    if (param.data) {
      param.data.uniqId = param.uniqId
      delete param.uniqId
    }
  }
  return param
}

/**
 * 
 * @param {Object} param param.data = state，param的其它参数作为实例属性
 * @param {*} template react需要的模板
 * @param {*} splitProps 分离props数据和state数据
 */
export default function(param={}, template, splitProps=true) {
  if (React.isValidElement(param)) {
    return wrapClass(param, template)
  }
  let $instance = null
  if (lib.isFunction(param)) {
    if (lib.isClass(param)) {
      let options = template
      let __id = options.$$id || options.data.$$id
      if (__id) {
        $instance = $$(__id)
      }

      let __uniqId = options.uniqId || options.data.uniqId
      if (__uniqId && !$instance) {
        $instance = $$(__uniqId)
      }

      if (!$instance) {
        $instance = new hocClass(param, options, splitProps)
      } else {
        if ($instance.parentInst) {
          let isExist = false;
          ($instance.parentInst.children || []).forEach(child=>{
            if (child.uniqId === $instance.uniqId) isExist = true
          })
          if (!isExist) {
            $instance.parentInst.children.push($instance)
          }
        }
      }

      // options = setUniqId(options)
      // let __uniqId = options.uniqId || options.data.uniqId
      // if (__uniqId && $$(__uniqId)) {
      //   $instance = $$(__uniqId)
      // }
      // else if (__id && $$(__id)) {
      //   $instance = $$(__id)
      // }
      // else {
      //   $instance = new hocClass(param, options, splitProps)
      // }
    } else {
      template = param
      param = {}
      $instance = new baseClass(param, template, splitProps)
    }
  } else {

    let __key = param.data && param.data.__key
    if (__key) {
      $instance = $$(__key)
    }
    
    let __id = param.$$id || param.data.$$id
    if (__id && !$instance) {
      $instance = $$(__id)
    }

    // param = setUniqId(param)
    let __uniqId = param.uniqId || param.data.uniqId
    if (__uniqId && !$instance) {
      $instance = $$(__uniqId)
    } 

    if (!$instance) {
      $instance = new baseClass(param, template, splitProps)
      // __id 和 __uniqId会在实例生成时自动保存
      if (__key) {
        _elements.setElement(__key, $instance)
      }
    } else {
      if ($instance.parentInst) {
        let isExist = false;
        ($instance.parentInst.children || []).forEach(child=>{
          if (child.uniqId === $instance.uniqId) isExist = true
        })
        if (!isExist) {
          $instance.parentInst.children.push($instance)
        }
      }
    }
  }
  
  if (!$instance.UI) {
    let __key = param.data && param.data.__key
    $instance = new baseClass(param, template, splitProps, true)
    if (__key) {
      _elements.setElement(__key, $instance)
    }
  }
  return $instance
}