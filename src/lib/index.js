import {
  // attrKey, 
  // accessKey, 
  // internalKeys, 
  eventName, 
  isEvents, 
  bindEvents
} from '../_common/index'

const isEvent = isEvents
const bindEvent = bindEvents

export {
  eventName,
  isEvent,
  bindEvent
}

export * from './util'

export {
  hooks 
} from './hooks'

export {
  strlen,
  subcontent
} from './string'

export {
  urlTOquery,
  queryTOurl
} from './url'


// var object = { 'a': [{ 'b': { 'c': 3 } }] };
// _.set(object, 'a[0].b.c', 4);
// console.log(object.a[0].b.c);
// // => 4

// var object = { 'a': [{ 'b': { 'c': 3 } }] };
// _.update(object, 'a[0].b.c', function(n) { return n * n; });
// console.log(object.a[0].b.c);
// // => 9
export {
  get,
  set,
  find,
  update,
  camelCase
} from 'lodash'