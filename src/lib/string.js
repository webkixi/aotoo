//计算字符变量的长度，包含处理中文
export function strlen(str, long) {
  let longtext = 'aa'
  if (long) longtext = 'aaa'
  return str.replace(/[^\x00-\xff]/g, longtext).length;
}

/* 2007-11-28 XuJian */
//截取字符串 包含中文处理
//(内容串,长度, 是否添加省略号)
export function subcontent(content, len, ellipse) {
  if (!content) return
  var newLength = 0;
  var newStr = "";
  var chineseRegex = /[^\x00-\xff]/g;
  var singleChar = "";
  var strLength = content.replace(chineseRegex, "aa").length;
  for (var i = 0; i < strLength; i++) {
    singleChar = content.charAt(i).toString();
    if (singleChar.match(chineseRegex) != null) {
      newLength += 2;
    } else {
      newLength++;
    }
    if (newLength > len) break;
    newStr += singleChar;
  }
  if (ellipse && strLength > len) {
    newStr += "...";
  }
  return newStr;
}