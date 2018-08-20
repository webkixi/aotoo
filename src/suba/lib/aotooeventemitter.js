import {
  uniqueId,
  objTypeof,
  isArray,
  isObject,
  isFunction,
  isString,
  sizeof,
  merge,
  forEach,
  arr2json,
  deepFind,
  protectProperty
} from './util'

let eeStock = {}

function appendActions(acts){
  var eeActions = this.eeActions
  var actions = {}
  forEach(acts, function(act, ii) {
    var actValue = acts[act]
    if (isObject(actValue)) {
      actions[act] = actValue
    }

    if (isArray(actValue)) {
      var target = {}
      forEach(actValue, function(ii, item) {
        if (isFunction(item)) {
          target[(item.guid||ii)] = item
        }
      })
      actions[act] = target
    }

    if (isFunction(actValue)) {
      var target = {}
      target[actValue.guid] = actValue
      actions[act] = target
    }
  })
  this.eeActions = merge({}, eeActions, actions)
}

/**
 * AotooEventEmitter
 */
export default class AotooEventEmitter {
  constructor(config={}, instanceName) {
    this.config = config
    this._id = config._id
    this.instanceName = instanceName
    Object.defineProperty(this, 'eeData', protectProperty({}))
    Object.defineProperty(this, 'eeActions', protectProperty({}))
    Object.defineProperty(this, 'eeContext', protectProperty(null))
    this.data = this.eeData
    // this.eeData = {}
    // this.eeActions = {}
    // this.eeContext = null
  }

  destyory(){
    this.eeData = Object.create(null)
    this.eeActions = Object.create(null)
    this.eeContext = undefined
    if (this.instanceName) {
      eeStock[this.instanceName] = undefined
    }
  }

  on(key, onOpts, fun, after) {
    var tmp = {}
    if (!fun) fun = onOpts
    if (isFunction(fun)) {
      // if (!fun.guid) fun.guid = fun.name || uniqueId('event_')
      if (!fun.guid) fun.guid = uniqueId('event_')
      if (after) fun.after = after
      tmp[key] = fun
      appendActions.call(this, tmp)
    }
    
    if (isArray(fun)) {
      var myFuns = []
      fun.forEach(function (_fun) {
        if (isFunction(_fun)) {
          myFuns.push(_fun)  // if (!_fun.guid) _fun.guid = uniqueId('event_')
        }
      })
      tmp[key] = myFuns
      appendActions.call(this, tmp)
    }

    if (isObject(fun)) {
      tmp = fun
      appendActions.call(this, tmp)
    }
  }

  one(key, oneOpts, fun) {
    if (key) {
      // this.on(key, oneOpts, fun)
      // this.set('_one', {[key]: true})
      const that = this
      this.on(key, oneOpts, fun, function() {
        that.off(key, oneOpts, fun)
      })
    }
  }

  once(key, onceOpts, fun){
    if (key) {
      if (this.hasOn(key)) {
        this.off(key)
      }
      this.on(key, onceOpts, fun)
    }
  }

  off(key, offopts, ccb) {
    var _sact = this.eeActions
    if (!ccb) ccb = offopts

    if (isFunction(ccb)) {
      var valueFuns = _sact[key]
      forEach(valueFuns, function (_key, ii) {
        if (valueFuns[_key]) {
          if (valueFuns[_key].guid == ccb.guid) {
            // valueFuns[_key] = undefined
            delete valueFuns[_key]
          } else if (valueFuns[_key].name == ccb.name) {
            // valueFuns[_key] = undefined
            delete valueFuns[_key]
          }
        }
      })
    } 
    else {
      _sact[key] = undefined
    }
  }


  emit(key, param) { 
    var values = []
    var _sact = this.eeActions
    var eeContext = this.eeContext
    param = param || this.eeData
    if (_sact[key]) {
      var valueFuns = _sact[key]
      var target = deepFind(_sact, key)

      // 删除one绑定的方法
      // if (this.eeData._one && this.eeData._one[key]) {
      //   setTimeout(() => {
      //     this.off(key)
      //   }, 100);
      // }

      if (isFunction(target)) {
        if (target.after && isFunction(target.after)) {
          setTimeout(() => {
            target.after()
          }, 100);
        }
        return target.call(eeContext, param)
      }
      forEach(target, function(key, ii) {
        var fun = target[key]
        if (isFunction(fun)) {
          if (fun.after && isFunction(fun.after)) {
            setTimeout(() => {
              fun.after()
            }, 100);
          }
          values.push(fun.call(eeContext, param))
        }
      })
      return values.length == 1 ? values[0] : values
    }
  }

  roll() {
    this.emit.apply(this, arguments)
  }

  hasOn(key) {
    var _sact = this.eeActions
    return _sact[key] ? true : false
  }

  // has() { }
  pop(key) {
    console.log('======== pop api of aotoo EventEmitter that will be deprecated');
    var _sact = this.eeActions
    var result
    if (key) {
      var target = deepFind(_sact, key)
      if (target) {
        var len = sizeof(target)
        forEach(target, function(key, ii) {
          if (ii == len-1) {
            result = target[key]
            target[key] = undefined
          }
        })
      }
    }
    return result
  }

  trigger() {
    console.log('======== trigger api of aotoo EventEmitter that is an empty method');
  }

  //  =====  处理数据  ==========
  set(key, value) {
    var _sdata = this.eeData
    _sdata[key] = value
    return this
  }
  get(key) { 
    var _sdata = this.eeData
    return key ? deepFind(_sdata, key) : _sdata
  }
  append(data) {
    var _sdata = this.eeData
    // if (data) this.eeData = merge({}, _sdata, data)
    if (data) this.eeData = merge(_sdata, data)
    return this
  }
  update(key, data) {
    if (isString(key)) {
      var target = deepFind(this.eeData, key)    
      if (target) {
        this.eeData[key] = data
      }
    }
    if (isObject(key)) {
      this.eeData = key
    }
  }

  //  =====  处理上下文环境变量  ==========
  bind(obj) {
    if (isObject(obj)) this.eeContext = obj
  }
  unbind() {
    this.eeContext = null
  }
}

export function sax(instName, opts) {
  if (eeStock[instName]) return eeStock[instName]
  else {
    eeStock[instName] = new AotooEventEmitter(opts, instName)
    return eeStock[instName]
  }
}