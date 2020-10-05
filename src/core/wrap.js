import * as lib from "../lib";
import {attrKey, accessKey, eventName, internalKeys, isEvents, bindEvents} from '../_common/index'

import elementsCollection from './elements'
let _elements = elementsCollection('core')

function CombineComponent(ORIelement, didCallback) {
  let unCallback = null
  let dom = null
  return class SomePlugin extends React.Component {
    componentDidMount() {
      dom = this.el
      if (lib.isFunction(didCallback)) {
        unCallback = didCallback(dom)
      }
    }

    componentWillUnmount() {
      if (lib.isFunction(unCallback)) {
        unCallback(dom)
      }
    }

    render() {
      let that = this
      return React.cloneElement(ORIelement, { ref: el => that.el = el })
    }
  }
}

export default function wrapElement(reactElement, didCallback) {
  let Cls = CombineComponent(reactElement, didCallback)
  return <Cls />
}