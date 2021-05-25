# AOTOO

一个react的封装库，将react组件封装成JS对象。

[GITHUB源码](https://www.github.com/webkixi/aotoo)
[中文文档](http://www.agzgz.com)

## LOG

2021.5.25 支持react native(需要aotoo-hub环境)，或者在全局中加入以下变量  

```js
import aotoo, {lib} from "@aotoo/aotoo"
import { 
  Text, 
  View, 
  PanResponder,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Button,
  Image,
  FlatList
} from 'react-native';
const {useRef, useEffect, useState} = React
const context = lib.curContext()
context.aotoo = aotoo
context.Text = Text
context.View = View
context.Image = Image
context.Button = Button
context.useRef = useRef
context.useEffect = useEffect
context.useState = useState
context.globalRNelements = {
  lib,
  PanResponder,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Button,
  FlatList
}
```

## 其他相关类库  

`@aotoo/react-cell`: 一套标准的容器组件，方便自定义各种表单组件
`@aotoo/react-pager`: 基于react, aotoo的前端路由(仿小程序)，可支持SEO  
`@aotoo/aotoo-koa-server`: 基于aotoo的server端类库，融合到aotoo-hub中使用，不支持独立使用  
`aotoo-cli`: 命令行工具，用于安装完整的大前端环境，包括编译，输出，部署等等  

## INSTALL AOTOO

```bash
yarn add @aotoo/aotoo
#
npm install @aotoo/aotoo
```

## DEMO 1  

封装REACT组件的计数器

封装react原生组件，并曝露api方法以方便外部修改组件状态  
下例是一个简单的计数器组件，为react原生组件添加了属性和api方法，其中api暴露给外部使用，如下例中的button按钮通过暴露的increase方法设置组件计数

Demo: <https://codesandbox.io/s/aotoo6jishuqi-dv1uf>

```js
import createComponent from '@aotoo/aotoo'

class Count extends React.Component {
  render() {
    return (
      <div className="container" onClick={this.env.increase}>
        {this.state.count || 0}
      </div>
    );
  }
}

const countInstance = createComponent(Count, {
  data: {  // 将转化成react组件的state
    count: 0,
  },
  increase(e) {
    let count = this.getData().count;
    count++;
    this.setData({ count });
  }
});

function Container() {
  return (
    <>
      <countInstance.UI />
      <button onClick={countInstance.increase}>计数器</button>
    </>
  );
}

ReactDOM.render(<Container />, document.getElementById('root'))
```

## DEMO 2  

配置化计数器组件

封装配置，并生成js对象及曝露该对象的api方法  
参考微信小程序组件的设计，使用配置化生成react组件，并对外曝露相关api方法  

Demo: <https://codesandbox.io/s/aotoo6jishuqi-forked-vh8n2>

```js
import createComponent from '@aotoo/aotoo'

const countTemplate = function (state, props) {
  return <div className={"container"}>{state.count}</div>;
};

const countConfig = {
  data: {
    count: 0
  },
  increase() {
    let count = this.getData().count;
    count++;
    this.setData({ count });
  }
};

let count = createComponent(countConfig, countTemplate);

function Container() {
  return (
    <>
      <count.UI />
      <button onClick={count.increase}>计数器</button>
    </>
  );
}

ReactDOM.render(<Container/>, document.getElementById('root'))
```

## WRAP

封装JSX输出真实dom，有些场景调用第三方库需要作用于真实dom  

```js
import createComponent from '@aotoo/aotoo'

let jsx = createComponent((
  <div>
    <span>文本内容</span>
  <div>
), function(dom){
  $(dom).on('click', clickHandle)
  return function(){
    $dom.off('click', clickHandle)
  }
})

ReactDOM.render(jsx, document.getElementById('root'))
```

## 生命周期

组件的生命周期，指的是组件自身的一些函数，这些函数在特殊的时间点或遇到一些特殊的框架事件时被自动触发。其中，最重要的生命周期是 `created` `attached` `detached` ，包含一个组件实例生命流程的最主要时间点。生命周期的设计参考微信小程序  

```js
import createComponent, {$$} from '@aotoo/aotoo';
createComponent({
  created: function(){
    // 在组件实例刚刚被创建时执行
  },
  attached: function() {
    // 在组件实例进入页面节点树时执行
  },
  ready: function(){
    // 在组件在视图层布局完成后执行
  },
  didUpdate: function(){
    // 在组件挂载后，每一次更新后会调用
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
},
template
)
```

## 通用属性

| 属性      |    类型 | 说明  |
| :-------- | :--------: | :-- |
| $$id  | String |  类似于$('#id')的id  |
| created      |   Function | 生命周期，同小程序组件 |
| attached      |   Function | 生命周期，同小程序组件 |
| ready      |   Function | 生命周期，同小程序组件 |
| didUpdate      |   Function | 每次更新后触发 |

## 通用API

| 方法      |    类型 | 说明  |
| :-------- | :--------: | :-- |
| parent      |   (p) | 查找父级 |
| getData      |   () | 获取元素数据 |
| show      |   () | 显示该组件 |
| hide      |   () | 隐藏该组件 |
| destory      |   () | 销毁该组件 |
| render      |   (p) | 渲染组件，与直接写jsx一致 |
| attr |  (p1, p2) |  设置/获取data-*属性 |

## 内置组件

### item  

引入`@aotoo/aotoo`后，会生成全局变量`ui_item`和全局方法组件`UI_item`, item组件将会生成一个`div`的html结构  

#### ui_item

配置化生成item组件

```js
import '@aotoo/aotoo'

const itemConfig = {
  title: '标题',
  onClick: 'changeTitle?title=新的标题',
  changeTitle(e, param, inst){
    inst.update({
   title: param.title
 })
  }
}

const item = ui_item(itemConfig)

ReactDOM.render(<item.UI />, document.getElementById('root'))
```

#### UI_item  

通过React方法组件  

```js
import '@aotoo/aotoo'

function changeTitle(e){
  this.update({
    title: '新的标题'
  })
}

const JSX = <UI_item title='标题' onClick={changeTitle}/>
```  

#### item属性

| 属性      |    类型 | 说明  |
| :-------- | :--------: | :-- |
| $$id  | String |  类似于$('#id')的id  |
| title     |   String/Object/Array |  item结构  |
| img     |   String/Object/Array |  item结构  |
| attr |  Object |  data-*属性  |
| body     |   Array |  item结构，子集均为item  |
| footer      |    Array | item结构  |
| dot      |    Array | item结构  |
| itemClass      |   String | 自定义样式 |
| itemStyle      |   String | 自定义样式 |
| methods      |   Object | 自定义方法 |
| onXXXX      |   String/Function | all events |
| created      |   Function | 生命周期，同小程序组件 |
| attached      |   Function | 生命周期，同小程序组件 |
| ready      |   Function | 生命周期，同小程序组件 |

#### item API 方法

| 方法      |    参数 | 说明  |
| :-------- | :--------: | :-- |
| reset  | (p) |  恢复初始数据  |
| update     | (p, callback) |  更新数据  |
| setData     | (p, callback)  |  与update相同  |
| attr |  (p1, p2) |  设置/获取data-*属性 |
| addClass     | (p, callback)|  新增样式类  |
| removeClass      | (p, callback) | 移除样式类名  |
| hasClass      |  (p) | 检测样式类名 |
| css      | (p) | 自定义样式 |
| toggleClass      | (p, callback) | 切换样式类名 |
| siblings      | (p) | 查找兄弟元素 |
| parent      |   (p) | 查找父级 |
| getData      |   () | 获取元素数据 |
| show      |   () | 显示该组件 |
| hide      |   () | 隐藏该组件 |
| destory      |   () | 销毁该组件 |
| render      |   (p) | 渲染组件，与直接写jsx一致 |

### list  

引入`@aotoo/aotoo`后，会生成全局变量`ui_list`和全局方法组件`UI_list`, list组件将会生成一组`div`的html结构(基于`item`组件)

#### ui_list

配置生成list组件

```js
const listConfig = {
  data: [
    {title: 'JACK', onClick: 'onItemClick?user=jack'},
    {title: 'ROSE', onClick: 'onItemClick?user=rose'}
  ],
  listClass: 'list-class',
  onItemClick(e, param, inst){
    if (param.user === 'jack') {
      this.update({
        'data[0].title': 'JACK LOVE ROSE'
      })
    }
  }
}

const list = ui_list(listConfig)  

ReactDOM.render(<list.UI />, document.getElementById('root'))
  
```

#### UI_list  

通过React方法组件

```js
import {$$} '@aotoo/aotoo'

function itemClick(e, param, inst){
  if (param.user === 'jack') {
    this.update({
      'data[0].title': 'JAKE LOVE ROSE'
    })
  }
}

const listData = [
  {title: 'JACK', onClick: 'onItemClick?user=jack'},
  {title: 'ROSE'}
]

const JSX = <UI_list
  $$id='mylist'
  data={listData}
  onItemClick={itemClick}
/>

setTimeout(() => {
  $$('#mylist').update({
    'data[1].title': 'ROSE LOVE JACK TOO'
  })
}, 4000);

ReactDOM.render(JSX, document.getElementById('root'))
```

#### list配置参数

| 属性      |    类型 | 说明  |
| :-------- | :--------: | :-- |
| $$id  | String |  类似于$('#id')的id  |
| data     |   Array |  list子集合  |
| header     |   JSX |  列表头部  |
| footer     |   JSX |  列表底部  |
| listClass     |   String |  列表样式类  |
| listStyle     |   String |  列表内联样式  |
| itemClass     |   String |  批量设置子项样式类  |
| itemMethod     |   Object |  批量设置子项事件方法  |
| methods     |   Object |  设置实例方法  |
| mode     |   String |  列表类型  |

#### list API 方法

| 方法      |    参数 | 说明  |
| :-------- | :--------: | :-- |
| reset  | (p) |  恢复初始数据  |
| update     | (p, callback) |  更新数据  |
| setData     | (p, callback)  |  与update相同  |
| insert   | (query, pay)  |  插入数据  |
| append   | (pay)  |  追加数据  |
| prepend   | (pay)  |  前置数据  |
| remove   | (query)  |  删除数据  |
| attr |  (p1, p2) |  设置/获取data-*属性 |
| addClass     | (p, callback)|  新增样式类  |
| removeClass      | (p, callback) | 移除样式类名  |
| hasClass      |  (p) | 检测样式类名 |
| css      | (p) | 自定义样式 |
| toggleClass      | (p, callback) | 切换样式类名 |
| parent      |   (p) | 查找父级 |
| getData      |   () | 获取元素数据 |
| show      |   () | 显示该组件 |
| hide      |   () | 隐藏该组件 |
| destory      |   () | 销毁该组件 |
| render      |   (p) | 渲染组件，与直接写jsx一致 |

### tree

tree组件是list组件的超集，通过扁平数据输出层次性的HTML结构，可支持多层次数据

```js
const listConfig = {
  data: [
    {title: '广东省', idf: 'gd'},
    {title: '广州市', parent: 'gd', idf: 'gz'},
      {title: '天河区', parent: 'gd', parent: 'gz'},
      {title: '白云区', parent: 'gd', parent: 'gz'},
      {title: '越秀区', parent: 'gd', parent: 'gz'},
    {title: '深圳市', parent: 'gd'},
    {title: '东莞市', parent: 'gd'},

 {title: '湖南省', idf: 'hn'},
 {title: '长沙市', parent: 'hn'},
 {title: '衡阳市', parent: 'hn'},
  ],
  mode: 'tree'
}

const tree = ui_list(listConfig)  

ReactDOM.render(<tree.UI />, document.getElementById('root'))
```

> 空格不是必须的，为展现数据层次  

关注我们，后续完善文档
