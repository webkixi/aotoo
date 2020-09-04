import createComponet, { lib, _elements, ReturnPromiseComponent } from './core'
import './item'
import './list'

function $$(indentify) {
  return _elements.getElement(indentify)
}

export {
  lib, 
  $$,
  _elements,
  ReturnPromiseComponent
}

export default createComponet