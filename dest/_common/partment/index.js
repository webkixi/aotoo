"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIitem = UIitem;
exports.extendsTemplate = extendsTemplate;
exports.default = _default;

var lib = _interopRequireWildcard(require("../../lib"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var context = lib.curContext();
/**
 * 
 * 模板中现存在太多的clone，虽然是浅层克隆，但还是会有点影响新能
 * 暂时还没有什么好的解决方案
 * 考虑 Immer 或者 Immutable， 未定 
 * 
 */

function ExtendComponent(_props) {
  var data = lib.clone(_props.data || _props); // let data = props.data || props

  var eleName = _props.ataKey || data.is;

  if (_props.ataKey) {
    eleName = eleName.replace('@', 'UI');

    if (eval(eleName)) {
      var FunElement = eval(eleName);
      return /*#__PURE__*/React.createElement(FunElement, data);
    }
  } else {
    if (eleName && eval(eleName)) {
      var Template = eval(eleName);
      return /*#__PURE__*/React.createElement(Template, data);
    }
  }
}

function UIitem(props) {
  var item = ui_item(props);
  return /*#__PURE__*/React.createElement(item.UI, null);
}

function View(props) {
  return /*#__PURE__*/React.createElement("div", props, props.children);
}

function Text(props) {
  return /*#__PURE__*/React.createElement("span", props, props.children);
}

function Url(_props) {
  var props = lib.clone(_props.data || _props); // let props = (_props.data || _props)

  var title = props.title;
  delete props.title;
  var url = props.url;
  delete props.url;

  if (url && url.indexOf('__') === 0) {
    url = url.split('__')[1].trim();
    props.target = '_blank';
  }

  if (title) {
    title = /*#__PURE__*/React.createElement(Title, {
      data: title
    });
  }

  return /*#__PURE__*/React.createElement("a", _extends({
    href: url
  }, props), title, _props.children);
}

function Title(_props) {
  var props = lib.clone(_props.data || _props); // let props = _props

  var data = props.data || props;
  var state = props.state || _props.state || {};
  var property = props.property || _props.property || {};
  var titleClass = state.titleClass || property.titleClass || '';
  var titleStyle = state.titleStyle || property.titleStyle || undefined;

  if (lib.isString(data) || lib.isNumber(data)) {
    return /*#__PURE__*/React.createElement(Text, {
      className: "htitle"
    }, data);
  }

  if (React.isValidElement(data)) {
    return data;
  }

  if (lib.isPlainObject(data)) {
    if (data.url) {
      var _url = data.url;
      data.url = undefined;
      return /*#__PURE__*/React.createElement(Url, _url, /*#__PURE__*/React.createElement(Title, data));
    }

    var Item = ui_item(data);
    return /*#__PURE__*/React.createElement(Item.UI, null);
  }

  if (lib.isArray(data)) {
    var tmpAry = data.map(function (it, ii) {
      var It = ui_item(it);
      var key = it.__key || 't_item' + ii;
      return /*#__PURE__*/React.createElement(It.UI, {
        key: key,
        itemClass: 't-item ' + (it.itemClass || '')
      });
    });
    return /*#__PURE__*/React.createElement(View, {
      className: 'htitles ' + titleClass,
      style: titleStyle
    }, tmpAry);
  }
}

function Img(_props) {
  var props = lib.clone(_props.data || _props); // let props = (_props.data || _props)

  var state = _props.state || {};
  var property = _props.property || {};
  var imgClass = state.imgClass || property.imgClass || '';
  var imgStyle = state.imgStyle || property.imgStyle || undefined;

  if (lib.isPlainObject(props)) {
    if (props.url) {
      var _url2 = props.url;
      props.url = undefined;
      return /*#__PURE__*/React.createElement(Url, _url2, /*#__PURE__*/React.createElement(Img, props));
    }
  }

  if (lib.isArray(props)) {
    props = props.filter(function (pic) {
      return lib.isString(pic) || lib.isPlainObject(pic);
    });
    props = props.map(function (pic, ii) {
      if (lib.isPlainObject(pic)) {
        pic.key = pic.__key || 'img_' + ii;
        return /*#__PURE__*/React.createElement(Img, pic);
      }
    });
    return /*#__PURE__*/React.createElement(View, {
      className: 'himgs ' + imgClass,
      style: imgStyle
    }, props);
  }

  return /*#__PURE__*/React.createElement("img", props);
}

function Body(_props) {
  var props = lib.clone(_props.data || _props); // let props = (_props.data || _props)

  var state = _props.state || {};
  var property = _props.property || {};
  var bodyClass = state.bodyClass || property.bodyClass || '';
  var bodyStyle = state.bodyStyle || property.bodyStyle || undefined;

  if (lib.isArray(props)) {
    var tmpAry = props.map(function (item, ii) {
      var it = ui_item(item);
      var key = item.__key || 'body_' + ii;
      return /*#__PURE__*/React.createElement(it.UI, {
        key: key,
        itemClass: 'body-item ' + (item.itemClass || '')
      });
    });
    return /*#__PURE__*/React.createElement(View, {
      className: 'hbody ' + bodyClass,
      style: bodyStyle
    }, tmpAry);
  }
}

function Footer(_props) {
  var props = lib.clone(_props.data || _props); // let props = (_props.data || _props)

  var state = _props.state || {};
  var property = _props.property || {};
  var footerClass = state.footerClass || property.footerClass || '';
  var footerStyle = state.footerStyle || property.footerStyle || undefined;

  if (lib.isArray(props)) {
    var tmpAry = props.map(function (item, ii) {
      var it = ui_item(item);
      var key = item.__key || 'footer_' + ii;
      return /*#__PURE__*/React.createElement(it.UI, {
        key: key,
        itemClass: 'footer-item ' + (item.itemClass || '')
      });
    });
    return /*#__PURE__*/React.createElement(View, {
      className: 'hfooter ' + footerClass,
      style: footerStyle
    }, tmpAry);
  }
}

function Li(_props) {
  var props = lib.clone(_props.data || _props); // let props = (_props.data || _props)

  var state = _props.state || {};
  var property = _props.property || {};
  var liClass = props.liClass || state.liClass || property.liClass || '';
  var liStyle = state.liStyle || property.liStyle || undefined;

  if (lib.isArray(props)) {
    var tmpAry = props.map(function (item, ii) {
      var it = ui_item(item);
      var key = item.__key || 'li_' + ii;
      return /*#__PURE__*/React.createElement(it.UI, {
        key: key,
        itemClass: 'li-item ' + (item.itemClass || '')
      });
    });
    return /*#__PURE__*/React.createElement(View, {
      className: 'ul ' + liClass,
      style: liStyle
    }, tmpAry);
  }
}

function Dot(_props) {
  var props = lib.clone(_props.data || _props); // let props = (_props.data || _props)

  var state = _props.state || {};
  var property = _props.property || {};

  if (lib.isArray(props)) {
    var tmpAry = props.map(function (item, ii) {
      var it = ui_item(item);
      var key = item.__key || 'dot_' + ii;
      return /*#__PURE__*/React.createElement(it.UI, {
        key: key,
        itemClass: 'dot-item ' + (item.itemClass || '')
      });
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, tmpAry);
  }
}

var title = function title() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(Title, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var img = function img() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(Img, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var body = function body() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(Body, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var footer = function footer() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(Footer, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var dot = function dot() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(Dot, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var li = function li() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(Li, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var url = function url() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(Url, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var text = function text() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(Title, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var ext = function ext() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
  var props = arguments.length > 3 ? arguments[3] : undefined;
  return /*#__PURE__*/React.createElement(ExtendComponent, {
    key: key,
    data: value,
    state: state,
    property: props
  });
};

var innerTemplate = {
  title: title,
  img: img,
  body: body,
  footer: footer,
  dot: dot,
  li: li,
  url: url,
  text: text,
  ext: ext,
  "@item": function item() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var key = arguments.length > 1 ? arguments[1] : undefined;
    var state = arguments.length > 2 ? arguments[2] : undefined;
    var props = arguments.length > 3 ? arguments[3] : undefined;
    var ataKey = arguments.length > 4 ? arguments[4] : undefined;
    var data = lib.clone(value);
    var item = ui_item(data);
    return /*#__PURE__*/React.createElement(item.UI, {
      key: key
    });
  },
  "@list": function list() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var key = arguments.length > 1 ? arguments[1] : undefined;
    var state = arguments.length > 2 ? arguments[2] : undefined;
    var props = arguments.length > 3 ? arguments[3] : undefined;
    var ataKey = arguments.length > 4 ? arguments[4] : undefined;
    var data = lib.clone(value);
    var list = ui_list(data);
    return /*#__PURE__*/React.createElement(list.UI, {
      key: key
    });
  },
  "@tree": function tree() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var key = arguments.length > 1 ? arguments[1] : undefined;
    var state = arguments.length > 2 ? arguments[2] : undefined;
    var props = arguments.length > 3 ? arguments[3] : undefined;
    var ataKey = arguments.length > 4 ? arguments[4] : undefined;
    var data = lib.clone(value);
    var tree = ui_tree(data);
    return /*#__PURE__*/React.createElement(tree.UI, {
      key: key
    });
  }
};
var globalComponent = {
  'ui-item': function uiItem(_props) {
    var props = lib.clone(_props);
    var item = ui_item(props);
    return /*#__PURE__*/React.createElement(item.UI, null, props.children);
  },
  'ui-list': function uiList(props) {
    var list = ui_list(props);
    return /*#__PURE__*/React.createElement(list.UI, null, props.children);
  }
};
context['UI_item'] = globalComponent['ui-item'];
context['UI_list'] = globalComponent['ui-list'];
context['Item'] = globalComponent['ui-item'];
context['List'] = globalComponent['ui-list'];
context['View'] = View;
context['Text'] = Text;

function extendsTemplate() {
  var otherTemplate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var contextInnerTemplate = context._ao2_innerTemplate_ || {};
  lib.forEach(innerTemplate, function (t, ii, ky) {
    delete otherTemplate[ky];
  });
  innerTemplate = Object.assign({}, innerTemplate, contextInnerTemplate, otherTemplate);
  context._ao2_innerTemplate_ = innerTemplate;
  return innerTemplate;
}

function _default() {
  return context._ao2_innerTemplate_ || innerTemplate;
}