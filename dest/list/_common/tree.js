"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = transTree;

var _lib = require("../../lib");

var _core = require("../../core");

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
var idrecode = [];

var filter = function filter(data, callback) {
  if ((0, _lib.isArray)(data)) {
    return data.filter(callback);
  }
};

function valideClassName(clsname, level) {
  var reCls = / *level([\d]* *)?/ig;
  var myLevelCls = "level".concat(level);

  if (clsname) {
    if (reCls.test(clsname)) {
      clsname = clsname.replace(reCls, '');
      clsname += " ".concat(myLevelCls);
    }

    return clsname;
  }

  return myLevelCls;
}

function subTree(item, dataAry, deep) {
  deep = deep || 1;
  var nsons = [];
  var sons = filter(dataAry, function (o) {
    return o.parent == item.idf;
  });
  sons.forEach(function (son, ii) {
    var _clsName = son.itemClass || son.className;

    son.itemClass = valideClassName(_clsName, deep);

    if (son.idf && idrecode.indexOf(son.idf) == -1) {
      son.liClass = 'itemroot';
      idrecode.push(son.idf);
      nsons = nsons.concat([subTree(son, dataAry, ++deep)]);
      --deep;
    } else {
      nsons = nsons.concat(son);
    }
  });

  if (nsons.length) {
    item.li = nsons;
    item.liClass = 'itemroot';
  }

  return item;
}

function owerTree(item) {
  var ary = [];
  item.forEach(function (o) {
    if (Array.isArray(o)) return owerTree(item);
    ary.push(o);
  });

  if (ary.length) {
    return {
      li: ary
    };
  }
} // TreeStructor


function transTree(dataAry, state) {
  var menus = [];
  idrecode = [];
  dataAry.forEach(function (item, iii) {
    if ((0, _lib.isString)(item) || (0, _lib.isNumber)(item) || React.isValidElement(item)) {
      menus.push(item);
    } else if (_core.lib.isPlainObject(item)) {
      var treeid = item['attr'] && item['attr']['treeid'] || item['attr'] && item['attr']['data-treeid'] || (0, _lib.uniqueId)('tree_id_');

      if (item['attr']) {
        item['attr']['data-treeid'] = treeid;
      } else {
        item['attr'] = {
          'data-treeid': treeid
        };
      }

      if (item.idf && !item.parent && idrecode.indexOf(item.idf) == -1) {
        var clsName = item.itemClass || item.className;
        item.itemClass = clsName ? clsName.indexOf('level0') == -1 ? clsName + ' itemroot level0' : clsName : 'itemroot level0';
        menus.push(subTree(item, dataAry));
      } else if (!item.idf && !item.parent) {
        menus.push(item);
      }
    } else if (Array.isArray(item)) {
      var _tmp = owerTree(item);

      if (_tmp) {
        menus.push(_tmp);
      }
    }
  });
  return menus;
}