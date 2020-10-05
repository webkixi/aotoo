import {
  uniqueId as suid,
  isString,
  isBoolean,
  isEmpty,
  isRegExp,
  isSymbol,
  isNumber,
  isArray,
  isObject,
  isPlainObject,
  isFunction,
  merge,
  find,
  findIndex,
  cloneDeep,
  isClient,
  isNode
} from './util'

export function urlTOquery(url) {
  let aim = url
  let query={};
  let hasQuery = false
  if (url) {
    let urls = url.split('?')
    aim = urls[0]
    if (urls[1]) {
      hasQuery = true
      let params = urls[1].split('&')
      params.forEach(param => {
        let attrs = param.split('=')
        if (!attrs[1]) attrs[1] = true
        if (attrs[1]==='true' || attrs[1] === 'false') attrs[1] = JSON.parse(attrs[1])
        query[attrs[0]] = attrs[1]
      })
    }
  }
  return {url: aim, query, hasQuery}
}

export function queryTOurl(url, param={}) {
  if (isString(url) && isObject(param)) {
    let queryStr = ''
    Object.keys(param).forEach(key=>{
      queryStr+=`&${key}=${param[key]}`
    })
    if (queryStr) {
      url += '?'+queryStr
      url = url.replace('?&', '?').replace('&&', '&')
    }
  }
  return url
}