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
      root.innerHTML = ''
      // ReactDOM.render(jsx, root)
      // ReactDOM.hydrate(jsx, root)
      // typeof noserver === 'undefined' ? ReactDOM.hydrate(jsx, root, cb) : ReactDOM.render(jsx, root, cb)
      typeof noserver === 'undefined' ? ReactDOM.render(jsx, root, cb) : ReactDOM.hydrate(jsx, root, cb)
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

export default createComponet