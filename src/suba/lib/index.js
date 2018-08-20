export {
	noop,
	uniqueId,
	objTypeof,
	isArray,
	isObject,
	isPlainObject,
	isDomElement,
	isFunction,
	isString,
	isClient,
	isReactNative,
	isServer,
	sizeof,
	merge,
	forEach,
	arr2json,
	deepFind,
	protectProperty,

	find,
	findIndex,
	filter,
	cloneDeep,
	sax,
} from './util'

export const inject = require('aotoo-inject')()

/*讲参数转换为数组
 * @param {all} a 参数
 */
export const toArray = function(a){
	if(!a)return [];
	if(a instanceof Array)return a;
	var arr = [],
		len = a.length;
	if(/string|number/.test(typeof a) || a instanceof Function || len === undefined){
		arr[0] = a;
	}else{
		for(var i = 0;i < len;i++){
			arr[i] = a[i];
		}
	}
	return arr;	
}

// module.exports = {
// 	inject: require('aotoo-inject')(),
// 	find,
// 	findIndex,
// 	filter,
// 	cloneDeep,
// 	isPlainObject: isObject,
// 	isDomElement,
// 	uniqueId,
// 	merge,
// 	toArray,
// 	objTypeof,
// 	isArray,
// 	isObject,
// 	isFunction,
// 	isString,
// 	isClient,
// 	isReactNative,
// 	isServer,
// 	sizeof,
// 	forEach,
// 	arr2json,
// 	deepFind,
// 	sax
// }