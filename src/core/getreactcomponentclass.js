import * as lib from "../lib";
import {attrKey, accessKey, eventName, internalKeys, isEvents, bindEvents} from '../_common/index'
import elementsCollection from './elements'
let _elements = elementsCollection('core')

function getReactComponentClass(_data, parent, template, splitProps) {
  let selfStateChanging = false
  let selfStateChanged = false
  class InnerClass extends React.Component {
    constructor(props) {
      super(props);
      let propsData = props.data
      // _data = Object.assign({}, _data, propsData)
      _data = Object.assign({}, parent.data, propsData)
      let myState = splitProps ? _data : Object.assign({}, _data, props);
      this.state = myState;
      this.template = template;
      this.selfStateChanging = false
      this.selfStateChanged = false
      this.oriState = lib.cloneDeep(myState)
      this.id = props.id || myState.id
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
    reset(param, cb){
      this.setSelfState((param||this.oriState), cb)
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
    
    // 未实现，应该是该组件出现在可视窗口中时，运用lazyload的概念
    // 应该只针对page级别的组件
    // onShow(){}  

    // onReady
    componentDidMount() {
      const {current} = this.ref
      parent.dom = current
      parent.hasMounted = true;
      parent.isINmemery = false
      parent.hooks.emit('sync-state-data', parent.data)
      parent._ready_()
    }


    // 父级传导数据触发更新  -----  step 1
    static getDerivedStateFromProps(props, state){
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
      if (lib.isFunction(parent.getSnapshotBeforeUpdate)) {
        return parent.getSnapshotBeforeUpdate(prevProps, prevState)
      }
      return null
    }

    // update ----- after
    // 在render之后调用，state已更新
    // snapshot 为getSnapshotBeforeUpdate方法返回的值
    componentDidUpdate(prevProps, prevState, snapshot) {
      parent.componentDidUpdate && parent.componentDidUpdate(prevProps, prevState, snapshot)
      parent.didUpdate(prevProps, prevState, snapshot)
    }

    componentWillUnmount() {
      if (this.uiCount !== parent.uiCount) return
      parent.hasMounted = false
      parent.isINmemery = true
      let unLoad = parent.onUnload || parent.componentWillUnmount || parent.detached
      if (lib.isFunction(unLoad)) {
        unLoad.call(parent)
      }
    }

    // static getDerivedStateFromError(error)

    // componentDidCatch(error, info)

    render() {
      if (parent.__showStat) {
        let state = lib.cloneDeep(this.state)
        let props = lib.cloneDeep(this.props)
        let JSX = template.call(parent, state, props, this.ref)
        // if (lib.isFunction(JSX.then)) {
        if (lib.isPromise(JSX)) {
          return (
            <ReturnPromiseComponent content={JSX} loadingClass={state.loadingClass||''} />
          )
        }
        if (lib.isString(JSX.type)) {
          return JSX
          // return React.cloneElement(JSX, { ref: this.ref }) 
        } else {
          return JSX
        }
      } else {
        return null
      }
    }
  }

  return InnerClass;
}

module.exports = getReactComponentClass