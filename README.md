# aotoo
aotoo is a react library, Able to instantiate react components for js
一个react的封装库，将react组件js实例化

# INSTALL
```bash
yarn add @aotoo/aotoo
#
npm install @aotoo/aotoo
```

## USAGE 1  
将原生React组件封装成JS对象

```js
import createComponent from '@aotoo/aotoo'

class Test extends React.Component {
  render(){
    return (
      <div className='container' onClick={this.env.onTest}>
        {this.state.title}
      </div>
    )
  }
}

const testInstance = createComponent(Test, {
  data: {
    title: 'some text'
  },
  onTest(e){
    console.log('do something')
  }
})

function Container(props){
  setTimeout(()=>{
    testInstance.setData({
      title: 'change state.title'
    })
  }, 3000)

  return (
    <testInstance.UI />
  )
}

ReactDOM.render(<Container />, document.getElementById('root'))
```

## USAGE 2 
使用配置数据生成实例

```js
import createComponent from '@aotoo/aotoo'

const test = createComponent(
  {
    data: {
      title: 'some text',
      onClick: 'onTest?user=jack'
    },
    onTest(e, param, inst){
      console.log(param) // {user: jack}
      inst.setData({
        title: 'change state.title'
      })
    },
    changeTitle() {
      this.setData({
        title: 'change title again'
      })
    }
  },

  // template
  function(state, props){
    return (
      <div onClick={state.onClick}>{state.title}</div>
    )
  }
)

setTimeout(() => {
  test.changeTitle()
}, 3000);

ReactDOM.render(<test.UI />, document.getElementById('root'))
```
### 通用属性
| 属性      |    类型 | 说明  |
| :-------- | :--------: | :-- |
| $$id  | String |  类似于$('#id')的id  |
| created      |   Function | 生命周期，同小程序组件 |
| attached      |   Function | 生命周期，同小程序组件 |
| ready      |   Function | 生命周期，同小程序组件 |
| didUpdate      |   Function | 每次更新后触发 |

### 通用API
| 方法      |    类型 | 说明  |
| :-------- | :--------: | :-- |
| parent      |   (p) | 查找父级 |
| getData      |   () | 获取元素数据 |
| show      |   () | 显示该组件 |
| hide      |   () | 隐藏该组件 |
| destory      |   () | 销毁该组件 |
| render      |   (p) | 渲染组件，与直接写jsx一致 |
| attr |  (p1, p2) |  设置/获取data-*属性 |




# item  
引入`@aotoo/aotoo`后，会生成全局变量`ui_item`和全局方法组件`UI_item`, item组件将会生成一个`div`的html结构  

####  配置生成组件ui_item
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
#### 使用React方法组件UI_item  
```js
import '@aotoo/aotoo'

function changeTitle(e){
  this.update({
    title: '新的标题'
  })
}

const JSX = <UI_item title='标题' onClick={changeTitle}/>
```  

### item属性
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

### item API 方法
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

# list  
引入`@aotoo/aotoo`后，会生成全局变量`ui_list`和全局方法组件`UI_list`, list组件将会生成一组`div`的html结构(基于`item`组件)

####  配置生成组件ui_list
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

#### 使用React方法组件UI_list  
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

# tree
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

### list属性
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

### list API 方法
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

关注我们，后续完善文档