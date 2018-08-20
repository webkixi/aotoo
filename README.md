# aotoo
aotoo is a react library, for simpler development of react components, it is like a lightweight redux that but more better, you can use aotoo in 

# INSTALL
```
yarn install aotoo
yarn install aotoo-web-widgets
```

## NOTE
### Must install aotoo-web-widgets
Aotoo based on micro-kernel design, support `node`,  `web` and `react-native`, in the web/node side, must be used together with `aotoo-web-widgets` and in `react-native` must be used together with `aotoo-rn-widgets`

### Global Variable -- Aotoo
import `aotoo` will automatically generate the global variable `Aotoo`  

## API
1. aotoo  
  like a lightweight redux
2. aotoo.item  
  Data-based react div components method
3. aotoo.list  
  Data-based single-level list(ul.li) components method
4. aotoo.tree  
  Data-based multi-level list(ul.li) components method
5. aotoo.wrap  
  Wrap jsx dom or react class as a new react class method
6. aotoo.transTree  
  Based on some rules, single-layer data will be into multi-level(tree) data， method
7. aotoo.CombineClass  
  It is abstract class, Inheritance of this class will be very easy to implement react components
8. aotoo.render
  Encapsulated from react.render and better

----------
#### Other Api  
aotoo.find  
aotoo.findIndex  
aotoo.cloneDeep  
aotoo.filter  
aotoo.merge  
aotoo.uniqueid  
aotoo.isPlainObject  

## USAGE

### aotoo

```jsx
import aotoo from 'aotoo'
require('aotoo-web-widgets')

class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      test: '1234'
    }
  }
  render(){
    return (
      <div className='container'>
        {this.state.test}
        <button className="btn">试试看</button>
      </div>
    )
  }
}

const Actions = {
  CONTENT: function(ostate, opts){
    // ostate为原始state，不变
    // curState为当前state，变化

    let curState = this.curState
    ostate.test = opts.content
    return ostate
  }
}

// aotoo will merge `Test` and `Action` and then return a instance, it has some methods, like `$content` etc..., they be generated from `Actions` children,

const instance = aotoo(Test, Actions)

instance.rendered = function(dom){
  $(dom).find('.btn').click(function(){
    instance.$content({ content: '你好！世界' })
  })
}

instance.render('test')
```




### aotoo.item
```jsx
// 1
const testitem = Aotoo.item({
  data: {
    title: 'hello world',   // title support String or Jsx dom
    url: 'http://www.agzgz.com'
  }
})

// 2
const testitem = Aotoo.item({
  data: {
    title: 'hello world'    // title support String or Jsx dom
  }
})

Aotoo.render(
  testitem,
  'test'
)

// resault 
// 1  =>  <div><a href...>hello world</a></div>
// 2  =>  <div>hello world</div>
```




### aotoo.list
```jsx
const testlist = Aotoo.list(
  {
    data: [
      { title: 'hello'},    // title support String or Jsx dom
      { title: 'world'},
      { title: 'agzgz'}
    ]
  }
)

Aotoo.render(
  testlist,
  'test'
)

// resault 
// <ul>
//  <li>hello</li>
//  <li>world</li>
//  <li>agzgz</li>
// </ul>
```




### aotoo.tree
```jsx
const testtree = Aotoo.list(
  {
    data: [
      { title: 'hello', idf: 'root'},   // title support String or Jsx dom
      { title: 'world', parent: 'root', idf: 'second'},
      { title: 'you are', parent: 'second', idf: 'third'},
      { title: 'beautiful', parent: 'third'},
      { title: 'agzgz', attr: {id: 'index'}}
    ]
  }
)

Aotoo.render(
  testtree,
  'test'
)

// resault 
// <ul>
//  <li>    // class=level-0
      <span>hello</span>
      ul
          li         // class=level-1
              span   // world
              ul
                  li         // class=level-2
                      span   // you are
                      ul
                          li    // beautiful class=level-3
    </li>
//  <li>agzgz</li>
// </ul>
```

### aotoo.wrap

#### wrap Jsx dom
```jsx
  // case 1
  const testdiv = <div><span className="agzgz">hello world<span></div>
  const NewReactClass = aotoo.wrap(
    testdiv,
    function(dom){
      $(dom).find('.agzgz').click(()=>{
        alert(1)
      })
    }
  )

  aotoo.render( <NewReactClass />, 'testdom')

  // case 2
  const testdiv = <div><span className="agzgz">hello world<span></div>
  const NewReactClass = aotoo.wrap( testdiv )

  aotoo.render( <NewReactClass rendered={function(dom){ //... }}/>, 'testdom')
```


#### wrap react class
```jsx
  class Test extends React.Component {
    constructor(props){
      super(props)
      ...
    }
    render(){
      return (
        // ...some jsx dom
      )
    }
  }

  // case 1
  const NewReactClass = aotoo.wrap(
    Test,
    function(dom){
      $(dom).find('.agzgz').click(()=>{
        alert(1)
      })
    }
  )

  // case 2
  const NewReactClass = aotoo.wrap( Test )
  aotoo.render( <NewReactClass rendered={function(dom){ //... }}/>, 'testdom')
  
```


### aotoo.transTree

```jsx
// the data as follow that will be translated to .... 

// before
data: [
  { title: 'hello', idf: 'root'},   // title support String or Jsx dom
  { title: 'world', parent: 'root', idf: 'second'},
  { title: 'you are', parent: 'second', idf: 'third'},
  { title: 'beautiful', parent: 'third'},
  { title: 'agzgz', attr: {id: 'index'}}
]

// after
/*
data: [
  { title: 'hello', li:[
    {title: 'world', li: [
      {title: 'you are', li:[
        {title: 'beautiful'}
      ]}
    ]}
  ]}, 
  { title: 'agzgz', attr: {id: 'index'}}
]
*/

// and then will be resolved to jsx dom with multi-layer
```