import * as lib from "../lib";
import {attrKey, accessKey, eventName, internalKeys, isEvents, bindEvents} from '../_common/index'
import elementsCollection from './elements'
let _elements = elementsCollection('core')

function useState (od) {
  const cbRef = React.useRef();
  const [data, setData] = React.useState(od);

  React.useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  return [data, function (d, callback) {
    cbRef.current = callback;
    setData(d);
  }];
}

function getFunctionComponent(_data, parent, template, splitProps){
  let selfStateChanging = false
  let selfStateChanged = false
  let oriData = _data
  let statusCallback = null
  let $ref = parent.ref

  function BaseFunctionComponent(props){
    // 初始化，第一次渲染该组件时
    if (parent.isINmemery === undefined) { 
      parent._onload_(props)
    }

    if (parent.uiCount !== 0) {
      parent.uiCount++
    }

    let uiCount = parent.uiCount

    let propsData = props.data||{}
    let $data = Object.assign({}, parent.data, propsData)
    // let state = splitProps ? $data : Object.assign({}, $data, props);
    let state = Object.assign({}, $data, props);
    if (parent.hasMounted === false) {
      oriData = Object.assign({}, state, oriData)
    }

    const [status, setStatus] = useState(state);

    let context = {
      reset(param, cb){
        parent.children.forEach(it=>it.destory())
        parent.children = []
        this.setSelfState((param||oriData), cb)
      },
      syncParentData(param={}){
        parent.data = lib.merge({}, status, param);
        parent.hooks.emit('sync-state-data', parent.data)
      },
      setSelfState(param, cb){
        if (!parent.hasMounted) return
        selfStateChanging = true
        selfStateChanged = false

        const setMYstate = (param) => {
          let $state = lib.cloneDeep(status)
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

        setStatus(param, cb)
      }
    }
    context.syncParentData()
    parent.reactComponentInstance = context

    React.useEffect(()=>{
      const {current} = $ref||{}
      parent.dom = current
      parent.hasMounted = true;
      parent.isINmemery = false;
      parent.hooks.emit('sync-state-data', parent.data)
      if (parent.uiCount === 0) {
        parent.uiCount++
        parent._ready_()
      } else {
        parent.didUpdate()
      }

      return function(){
        if (selfStateChanging) {
          selfStateChanging = false
          selfStateChanged = true
        } else {
          if (uiCount !== parent.uiCount) return
          selfStateChanging = false
          selfStateChanged = false
          parent.hasMounted = false
          parent.isINmemery = true
          parent.removeParentChild()  // 清除父级的父级的该实例的子元素
          let unLoad = parent.onUnload || parent.componentWillUnmount || parent.detached
          if (lib.isFunction(unLoad)) {
            unLoad.call(parent)
          }
        }
      }
    })
    // }, [status])
    
    if (parent.__showStat) {
      let cloneState = lib.cloneDeep(status)
      let cloneProps = lib.cloneDeep(props)
      let JSX = template.call(parent, cloneState, cloneProps, $ref)
      if (lib.isPromise(JSX)) {
        return (
          <ReturnPromiseComponent content={JSX} loadingClass={cloneState.loadingClass||''} />
        )
      }
      if (lib.isString(JSX.type)) {
        return React.cloneElement(JSX, { ref: $ref }) 
      } else {
        return JSX
      }
    } else {
      return null
    }
  }
  // return React.forwardRef(BaseFunctionComponent)
  return BaseFunctionComponent
}

module.exports = getFunctionComponent