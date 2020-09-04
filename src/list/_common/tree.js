// 数据结构
// const _data = [
//   {title: '典型页面', content: '123', idf: 'aaa'},
//   {title: '典型页面1', content: 'aaa', idf: 'bbb', parent: 'aaa'},
//   {title: '典型页面2', content: 'bbb', parent: 'aaa', attr: {"href":'http://www.163.com'}},
//   {title: '典型页面3', content: 'ccc', parent: 'aaa'},
//   {title: '典型页面4', content: 'ddd', parent: 'bbb'},
//   {title: '典型页面5', content: 'eee', parent: 'bbb'},
//   {title: '导航', content: '111'},
//   {title: '表单', content: '333'},
//   {title: '列表', content: '444'},
//   {title: '高级搜索', content: '5555'}
// ]

// resault
// [
//   {title: '典型页面', url: undefined, li: [{title: '典型页面1', url: undefined, li:[{典型页面4..}, {典型页面5..}]}, {典型页面2..}, {典型页面3...}]},
//   {title: '导航', content: '111'},
//   {title: '表单', content: '333'},
//   {title: '列表', content: '444'},
//   {title: '高级搜索', content: '5555'}
// ]

// html
// 将结果交给widget/ListView组件,拼接 ul/li 的结构化数据
// <List data={resault} />

// <li class="item ...">
// 	<div class="itemroot">
// 		<ul>
// 			<li data-href="http://www.163.com">xxx</li>
// 		</ul>
// 	</div>
// </li>

// let idrecode = {}

import {
	isString,
	isObject,
	isArray,
	isNumber,
	isFunction,
	formatQuery,
	suid,
	resetSuidCount,
	clone,
	isPlainObject,
	uniqueId
}from '../../lib'
import { lib } from '../../core'

let idrecode = []
let filter = function(data, callback) { 
  if (isArray(data)) {
    return data.filter(callback)
  }
} 

function valideClassName(clsname, level) {
	const reCls = / *level([\d]* *)?/ig
	const myLevelCls = `level${level}`
	if (clsname) {
		if (reCls.test(clsname)) {
			clsname = clsname.replace(reCls, '')
			clsname += ` ${myLevelCls}`
		}
		return clsname
	}
	return myLevelCls
}

function subTree(item, dataAry, deep){
	deep = deep||1
	let nsons = []
	let sons = filter(dataAry, o => o.parent == item.idf)
	sons.forEach( (son, ii) => {
		var _clsName = son.itemClass || son.className
		son.itemClass = valideClassName(_clsName, deep)
		if (son.idf && idrecode.indexOf(son.idf) == -1) {
			son.liClass = 'itemroot'
			idrecode.push(son.idf)
			nsons = nsons.concat([subTree(son, dataAry, ++deep)])
			--deep
		} else {
			nsons = nsons.concat(son)
		}
	})
	if (nsons.length) {
		item.li = nsons
		item.liClass = 'itemroot'
	}
	return item
}

function owerTree(item) {
	const ary = []
	item.forEach( o => {
		if (Array.isArray(o)) return owerTree(item)
		ary.push(o)
	})
	if (ary.length) {
		return {li: ary}
	}
}

// TreeStructor
export default function transTree(dataAry, state){
	let menus = []
	idrecode = []
	dataAry.forEach( (item, iii)=>{
		if (isString(item) || isNumber(item) || React.isValidElement(item)) {
			menus.push(item)
		} else if (lib.isPlainObject(item)) {
			let treeid = (item['attr'] && item['attr']['treeid']) ||
				(item['attr'] && item['attr']['data-treeid']) || uniqueId('tree_id_');

			if (item['attr']) {
				item['attr']['data-treeid'] = treeid
			} else {
				item['attr'] = {
					'data-treeid': treeid
				}
			}

			if (item.idf && !item.parent && idrecode.indexOf(item.idf) == -1) {
				let clsName = item.itemClass || item.className
				item.itemClass = clsName ? clsName.indexOf('level0') == -1 ? clsName + ' itemroot level0' : clsName : 'itemroot level0'
				menus.push(subTree(item, dataAry))
			} else if (!item.idf && !item.parent) {
				menus.push(item)
			}
		} else if (Array.isArray(item)) {
			var _tmp = owerTree(item)
			if (_tmp) {
				menus.push(_tmp)
			}
		}
	})
	return menus
}
