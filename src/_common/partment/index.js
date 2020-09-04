import * as lib from "../../lib";


/**
 * 
 * 模板中现存在太多的clone，虽然是浅层克隆，但还是会有点影响新能
 * 暂时还没有什么好的解决方案
 * 考虑 Immer 或者 Immutable， 未定 
 * 
 */

function ExtendComponent(_props) {
  let data = lib.clone((_props.data || _props))
  // let data = props.data || props
  let eleName = _props.ataKey || data.is

  if (_props.ataKey) {
    eleName = eleName.replace('@', 'UI')
    if (eval(eleName)) {
      let FunElement = eval(eleName)
      return <FunElement {...data} />
    }
  } else {
    if (eleName && eval(eleName)) {
      let Template = eval(eleName)
      return <Template {...data} />
    }
  }
}

export function UIitem(props) {
  let item = ui_item(props)
  return <item.UI />
}

function View(props) {
  return (
    <div {...props}>{props.children}</div>
  )
}

function Text(props) {
  return <span {...props}>{props.children}</span>
}

function Url(_props) {
  let props = lib.clone((_props.data || _props))
  // let props = (_props.data || _props)
  let title = props.title; delete props.title
  let url = props.url; delete props.url

  if (title) {
    title = <Title data={title} />
  }
  return (
    <a href={url} {...props}>{title}{_props.children}</a>
  )
}

function Title(_props) {
  let props = lib.clone((_props.data || _props))
  // let props = _props
  let data = props.data||props
  let state = props.state||{}
  let property = props.property||{}
  let titleClass = state.titleClass || property.titleClass || ''
  let titleStyle = state.titleStyle || property.titleStyle || undefined
  
  if (lib.isString(data) || lib.isNumber(data)) {
    return <Text className="htitle">{data}</Text>
  }

  if (React.isValidElement(data)) {
    return data
  }

  if (lib.isPlainObject(data)) {
    if (data.url) {
      let url = data.url; data.url=undefined;
      return (
        <Url {...url}>
          <Title {...data}/>
        </Url>
      )
    }
    let Item = ui_item(data)
    return <Item.UI />
  }

  if (lib.isArray(data)) {
    let tmpAry = data.map((it, ii)=>{
      let It = ui_item(it)
      let key = it.__key
      return <It.UI key={key} itemClass="t-item" />
    })

    return (
      <View className={'htitles '+ titleClass} style={titleStyle}>
        {tmpAry}
      </View>
    )
  }
}

function Img(_props) {
  let props = lib.clone((_props.data||_props))
  // let props = (_props.data || _props)

  if (lib.isPlainObject(props)) {
    if (props.url) {
      let url = props.url; props.url=undefined;
      return (
        <Url {...url}>
          <Img {...props} />
        </Url>
      )
    }
  }

  if (lib.isArray(props)) {
    props = props.filter(pic=> (lib.isString(pic) || lib.isPlainObject(pic)) )
    props = props.map((pic, ii) => {
      if (lib.isPlainObject(pic)) {
        pic.key = 'img_'+ii
        return <Img {...pic} />
      }
    })
    return (
      <View className='himgs'>
        {props}
      </View>
    )
  }

  return (
    <img {...props} />
  )
}

function Body(_props) {
  let props = lib.clone((_props.data || _props))
  // let props = (_props.data || _props)
  let state = _props.state || {}
  let property = _props.property || {}
  let bodyClass = state.bodyClass || property.bodyClass || ''
  let bodyStyle = state.bodyStyle || property.bodyStyle || undefined
  
  if (lib.isArray(props)) {
    let tmpAry = props.map((item, ii)=>{
      let it = ui_item(item)
      let key = 'body_'+ii
      return <it.UI key={key} className={'hb-item '+(item.itemClass||'')} />
    })

    return (
      <View className={'hbody '+ bodyClass} style={bodyStyle}>
        {tmpAry}
      </View>
    )
  }
}

function Footer(_props) {
  let props = lib.clone((_props.data || _props))
  // let props = (_props.data || _props)
  let state = _props.state || {}
  let property = _props.property || {}
  let footerClass = state.footerClass || property.footerClass || ''
  let footerStyle = state.footerStyle || property.footerStyle || undefined
  
  if (lib.isArray(props)) {
    let tmpAry = props.map((item, ii)=>{
      let it = ui_item(item)
      let key = 'footer_'+ii
      return <it.UI key={key} className={'hf-item '+(item.itemClass||'')} />
    })

    return (
      <View className={'hfooter '+ footerClass} style={footerStyle}>
        {tmpAry}
      </View>
    )
  }
}

function Li(_props) {
  let props = lib.clone((_props.data || _props))
  // let props = (_props.data || _props)
  let state = _props.state || {}
  let property = _props.property || {}
  let liClass = state.liClass || property.liClass || ''
  let liStyle = state.liStyle || property.liStyle || undefined
  
  if (lib.isArray(props)) {
    let tmpAry = props.map((item, ii)=>{
      let it = ui_item(item)
      let key = 'li_'+ii
      return <it.UI key={key} className={'li-item '+(item.itemClass||'')} />
    })

    return (
      <View className={'ul '+ liClass} style={liStyle}>
        {tmpAry}
      </View>
    )
  }
}

function Dot(_props) {
  let props = lib.clone((_props.data || _props))
  // let props = (_props.data || _props)
  let state = _props.state || {}
  let property = _props.property || {}
  
  if (lib.isArray(props)) {
    let tmpAry = props.map((item, ii)=>{
      let it = ui_item(item)
      let key = 'dot_'+ii
      return <it.UI key={key} className={'hdot-item '+(item.itemClass||'')} />
    })

    return (
      <>
        {tmpAry}
      </>
    )
  }
}

const title = (value={}, key, state, props) => {
  return <Title key={key} data={value} state={state} property={props} />
}

const img = (value={}, key, state, props) => {
  return <Img key={key} data={value} state={state} property={props} />
}

const body = (value={}, key, state, props) => {
  return <Body key={key} data={value} state={state} property={props} />
}

const footer = (value={}, key, state, props) => {
  return <Footer key={key} data={value} state={state} property={props} />
}

const dot = (value={}, key, state, props) => {
  return <Dot key={key} data={value} state={state} property={props} />
}

const li = (value={}, key, state, props) => {
  return <Li key={key} data={value} state={state} property={props} />
}

const url = (value={}, key, state, props) => {
  return <Url key={key} data={value} state={state} property={props} />
}

const text = (value={}, key, state, props) => {
  return <Title key={key} data={value} state={state} property={props} />
}

const ext = (value={}, key, state, props) => {
  return <ExtendComponent key={key} data={value} state={state} property={props} />
}

let innerTemplate = {
  title,
  img,
  body,
  footer,
  dot,
  li,
  url,
  text,
  ext,
  "@item"(value={}, key, state, props, ataKey){
    let data = lib.clone(value)
    let item = ui_item(data)
    return <item.UI key={key} />
  }, 
  "@list"(value={}, key, state, props, ataKey){
    let data = lib.clone(value)
    let list = ui_list(data)
    return <list.UI key={key} />
  },
  "@tree"(value={}, key, state, props, ataKey){
    let data = lib.clone(value)
    let tree = ui_tree(data)
    return <tree.UI key={key} />
  }
}

const globalComponent = {
  'ui-item'(_props) {
    let props = lib.clone(_props)
    let item = ui_item(props)
    return (
      <item.UI>
        {props.children}
      </item.UI>
    )
  },
  'ui-list'(props){
    let list = ui_list(props)
    return (
      <list.UI key={key}>
        {props.children}
      </list.UI>
    )
  },
}

let context = lib.curContext()
context['UI_item'] = globalComponent['ui-item']
context['UI_list'] = globalComponent['ui-list']

export function extendsTemplate(otherTemplate={}){
  lib.forEach(innerTemplate, (t, ii, ky)=>{
    delete otherTemplate[ky]
  })
  innerTemplate = Object.assign({}, innerTemplate, otherTemplate)
}

export default innerTemplate