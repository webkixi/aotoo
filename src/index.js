import createComponet, { lib, _elements, ReturnPromiseComponent, extTemplate } from './core'
import './item'
import './list'

function $$(indentify) {
  return _elements.getElement(indentify)
}

export function render(jsx, id, cb){
  if (lib.isClient()) {
    let root = id
    if (lib.isString(id)) {
      root = document.getElementById(id)
    }
    if (lib.isDomElement(root)) {
      ReactDOM.unmountComponentAtNode(root);
      root.innerHTML = '';
      (typeof noserver === 'undefined'||noserver===true) ? ReactDOM.render(jsx, root, cb) : ReactDOM.hydrate(jsx, root, cb)
    }
  }

  if (lib.isNode()) {
    return ReactDomServer.renderToString(jsx)
  }
}

export function html(jsx){
  if (lib.isNode()) {
    return ReactDomServer.renderToStaticMarkup(jsx)
  }
}

export {
  lib, 
  $$,
  _elements,
  ReturnPromiseComponent,
  extTemplate
}

createComponet.lib = lib
createComponet.$$ = $$
createComponet._elements = _elements
createComponet.ReturnPromiseComponent = ReturnPromiseComponent
createComponet.LoadingComponent = ReturnPromiseComponent
createComponet.extTemplate = extTemplate

export default createComponet