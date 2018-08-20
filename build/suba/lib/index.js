'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _util = require('./util');

Object.defineProperty(exports, 'noop', {
	enumerable: true,
	get: function get() {
		return _util.noop;
	}
});
Object.defineProperty(exports, 'uniqueId', {
	enumerable: true,
	get: function get() {
		return _util.uniqueId;
	}
});
Object.defineProperty(exports, 'objTypeof', {
	enumerable: true,
	get: function get() {
		return _util.objTypeof;
	}
});
Object.defineProperty(exports, 'isArray', {
	enumerable: true,
	get: function get() {
		return _util.isArray;
	}
});
Object.defineProperty(exports, 'isObject', {
	enumerable: true,
	get: function get() {
		return _util.isObject;
	}
});
Object.defineProperty(exports, 'isPlainObject', {
	enumerable: true,
	get: function get() {
		return _util.isPlainObject;
	}
});
Object.defineProperty(exports, 'isDomElement', {
	enumerable: true,
	get: function get() {
		return _util.isDomElement;
	}
});
Object.defineProperty(exports, 'isFunction', {
	enumerable: true,
	get: function get() {
		return _util.isFunction;
	}
});
Object.defineProperty(exports, 'isString', {
	enumerable: true,
	get: function get() {
		return _util.isString;
	}
});
Object.defineProperty(exports, 'isClient', {
	enumerable: true,
	get: function get() {
		return _util.isClient;
	}
});
Object.defineProperty(exports, 'isReactNative', {
	enumerable: true,
	get: function get() {
		return _util.isReactNative;
	}
});
Object.defineProperty(exports, 'isServer', {
	enumerable: true,
	get: function get() {
		return _util.isServer;
	}
});
Object.defineProperty(exports, 'sizeof', {
	enumerable: true,
	get: function get() {
		return _util.sizeof;
	}
});
Object.defineProperty(exports, 'merge', {
	enumerable: true,
	get: function get() {
		return _util.merge;
	}
});
Object.defineProperty(exports, 'forEach', {
	enumerable: true,
	get: function get() {
		return _util.forEach;
	}
});
Object.defineProperty(exports, 'arr2json', {
	enumerable: true,
	get: function get() {
		return _util.arr2json;
	}
});
Object.defineProperty(exports, 'deepFind', {
	enumerable: true,
	get: function get() {
		return _util.deepFind;
	}
});
Object.defineProperty(exports, 'protectProperty', {
	enumerable: true,
	get: function get() {
		return _util.protectProperty;
	}
});
Object.defineProperty(exports, 'find', {
	enumerable: true,
	get: function get() {
		return _util.find;
	}
});
Object.defineProperty(exports, 'findIndex', {
	enumerable: true,
	get: function get() {
		return _util.findIndex;
	}
});
Object.defineProperty(exports, 'filter', {
	enumerable: true,
	get: function get() {
		return _util.filter;
	}
});
Object.defineProperty(exports, 'cloneDeep', {
	enumerable: true,
	get: function get() {
		return _util.cloneDeep;
	}
});
Object.defineProperty(exports, 'sax', {
	enumerable: true,
	get: function get() {
		return _util.sax;
	}
});
var inject = exports.inject = require('aotoo-inject')();

/*讲参数转换为数组
 * @param {all} a 参数
 */
var toArray = exports.toArray = function toArray(a) {
	if (!a) return [];
	if (a instanceof Array) return a;
	var arr = [],
	    len = a.length;
	if (/string|number/.test(typeof a === 'undefined' ? 'undefined' : _typeof(a)) || a instanceof Function || len === undefined) {
		arr[0] = a;
	} else {
		for (var i = 0; i < len; i++) {
			arr[i] = a[i];
		}
	}
	return arr;
};

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
//# sourceMappingURL=../../maps/suba/lib/index.js.map
