'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.didMount = didMount;
exports.unMount = unMount;

var _util = require('./util');

var findDOMNode = ReactDom.findDOMNode || function (ctx) {
  return ctx;
};

/**
 * 
 * @param {Object} rcInst:  ReactClass的实例
 */
function didMount(rcInst, opts) {
  var _this = this;

  var componentCtx = {};
  if (this && rcInst) {
    if (_util.isClient && this !== window || !_util.isClient && this !== global) {
      if (this.holdDispatchQueue && this.holdDispatchQueue.length) {
        var newState = this.holdDispatchQueue.reduce(function (p, n) {
          if ((0, _util.isArray)(n)) {
            var key = n[0];
            var param = n[1];
            var actions = _this.data('actions');
            var oState = _this.originalState;
            var curState = _this.curState || (0, _util.cloneDeep)(rcInst.state);
            var act = actions[key];
            if ((0, _util.isFunction)(act)) {
              n = act.call({ curState: curState }, oState, param, _this);
            } else {
              n = {};
            }
          }
          return (0, _util.merge)(p, n);
        }, {});
        this.holdDispatchQueue = [];
        this.curState = newState;
        rcInst.setState(newState);
        return;
      }

      // if ((typeof window !== 'undefined' && this !== window) || (typeof global !== 'undefined' && this !== global)) {
      var didMethod = rcInst.props.rendered || rcInst.props.itemMethod || this.rendered || this.config.rendered;
      componentCtx = {
        dom: findDOMNode(rcInst),
        refs: rcInst.refs,
        index: rcInst.props.idf,
        context: this,
        ctx: this
      };

      if ((0, _util.isFunction)(rcInst.on)) {
        rcInst.emit('beforeRendered', componentCtx);
        rcInst.emit('__beforeRendered', componentCtx);
        rcInst.emit('_beforeRendered', componentCtx);
        rcInst.off('__beforeRendered');
        rcInst.off('_beforeRendered');
      }

      if ((0, _util.isFunction)(didMethod)) {
        didMethod.call(this, componentCtx.dom, rcInst.intent);
      }

      if ((0, _util.isFunction)(rcInst.on)) {
        rcInst.emit('rendered', componentCtx);
        rcInst.emit('__rendered', componentCtx);
        rcInst.emit('_rendered', componentCtx);
        rcInst.off('__rendered');
        rcInst.off('_rendered');
      }
    }
  }
}

/**
 * 
 * @param {Object} rcInst ReactClass的实例
 */
function unMount(rcInst) {
  /** destory some thing */
  var operat = {
    destory: _util.noop
  };
  var leaveFunction = rcInst.props.leave || rcInst.config.leave;
  if ((0, _util.isFunction)(leaveFunction)) {
    leaveFunction(operat);
  }
  if (this && this.destory) {
    this.destory();
    this.xInst = Object.create(null);
    this.curState = Object.create(null);
    this.liveState = Object.create(null);
    this.originalState = Object.create(null);
    this.config = Object.create(null);
  }
}
//# sourceMappingURL=../../maps/suba/lib/lifecycle.js.map
