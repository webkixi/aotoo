"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlTOquery = urlTOquery;
exports.queryTOurl = queryTOurl;

var _util = require("./util");

function urlTOquery(url) {
  var aim = url;
  var query = {};
  var hasQuery = false;

  if (url) {
    var urls = url.split('?');
    aim = urls[0];

    if (urls[1]) {
      hasQuery = true;
      var params = urls[1].split('&');
      params.forEach(function (param) {
        var attrs = param.split('=');
        if (!attrs[1]) attrs[1] = true;
        if (attrs[1] === 'true' || attrs[1] === 'false') attrs[1] = JSON.parse(attrs[1]);
        query[attrs[0]] = attrs[1];
      });
    }
  }

  return {
    url: aim,
    query: query,
    hasQuery: hasQuery
  };
}

function queryTOurl(url) {
  var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if ((0, _util.isString)(url) && (0, _util.isObject)(param)) {
    var queryStr = '';
    Object.keys(param).forEach(function (key) {
      queryStr += "&".concat(key, "=").concat(param[key]);
    });

    if (queryStr) {
      url += '?' + queryStr;
      url = url.replace('?&', '?').replace('&&', '&');
    }
  }

  return url;
}