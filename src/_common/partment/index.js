import * as lib from "../../lib";
let context = lib.curContext()

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

function Vview(props) {
  if (lib.isReactNative()) {
    // 需要指定React Native的全局的JSX标签
    return <View {...props}>{props.children}</View>
  }
  return (
    <div {...props}>{props.children}</div>
  )
}

function Ttext(props) {
  if (lib.isReactNative()) {
    // 需要指定React Native的全局的JSX标签
    return <Text {...props}>{props.children}</Text>
  }
  return <span {...props}>{props.children}</span>
}

function Url(_props) {
  let props = lib.clone((_props.data || _props))
  // let props = (_props.data || _props)
  let title = props.title; delete props.title
  let url = props.url; delete props.url
  if (url && url.indexOf('__')===0) {
    url = url.split('__')[1].trim()
    props.target = '_blank'
  }

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
  let state = props.state||_props.state||{}
  let property = props.property||_props.property||{}
  let titleClass = state.titleClass || property.titleClass || ''
  let titleStyle = state.titleStyle || property.titleStyle || undefined
  
  if (lib.isString(data) || lib.isNumber(data)) {
    return <Ttext className="htitle">{data}</Ttext>
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
      let key = it.__key||'t_item'+ii
      return <It.UI key={key} itemClass={'t-item '+(it.itemClass||'')} />
    })

    return (
      <Vview className={'htitles '+ titleClass} style={titleStyle}>
        {tmpAry}
      </Vview>
    )
  }
}

function Img(_props) {
  let props = lib.clone((_props.data||_props))
  // let props = (_props.data || _props)

  let state = _props.state || {}
  let property = _props.property || {}
  let imgClass = state.imgClass || property.imgClass || ''
  let imgStyle = state.imgStyle || property.imgStyle || undefined

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
        pic.key = pic.__key || 'img_'+ii
        return <Img {...pic} />
      }
    })
    return (
      <Vview className={'himgs '+ imgClass} style={imgStyle}>
        {props}
      </Vview>
    )
  }

  if (lib.isReactNative()) {
    return (
      <Image {...props} />
    )
  } else {
    return (
      <img {...props} />
    )
  }
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
      let key = item.__key || 'body_'+ii
      return <it.UI key={key} itemClass={'body-item '+(item.itemClass||'')} />
    })

    return (
      <Vview className={'hbody '+ bodyClass} style={bodyStyle}>
        {tmpAry}
      </Vview>
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
      let key = item.__key || 'footer_'+ii
      return <it.UI key={key} itemClass={'footer-item '+(item.itemClass||'')} />
    })

    return (
      <Vview className={'hfooter '+ footerClass} style={footerStyle}>
        {tmpAry}
      </Vview>
    )
  }
}

function Li(_props) {
  let props = lib.clone((_props.data || _props))
  // let props = (_props.data || _props)
  let state = _props.state || {}
  let property = _props.property || {}
  let liClass = props.liClass || state.liClass || property.liClass || ''
  let liStyle = state.liStyle || property.liStyle || undefined
  
  if (lib.isArray(props)) {
    let tmpAry = props.map((item, ii)=>{
      let it = ui_item(item)
      let key = item.__key || 'li_'+ii
      return <it.UI key={key} itemClass={'li-item '+(item.itemClass||'')} />
    })

    return (
      <Vview className={'ul '+ liClass} style={liStyle}>
        {tmpAry}
      </Vview>
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
      let key = item.__key || 'dot_'+ii
      return <it.UI key={key} itemClass={'dot-item '+(item.itemClass||'')} />
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
      <list.UI>
        {props.children}
      </list.UI>
    )
  },
}

if (!context['UI_item']) {
  context['UI_item'] = globalComponent['ui-item']
  context['UI_list'] = globalComponent['ui-list']
  context['Item'] = globalComponent['ui-item']
  context['List'] = globalComponent['ui-list']
  if (!lib.isReactNative()) {
    context['View'] = Vview
    context['Text'] = Ttext
  }
}

export function extendsTemplate(otherTemplate={}){
  let contextInnerTemplate = context._ao2_innerTemplate_||{}
  lib.forEach(innerTemplate, (t, ii, ky)=>{
    delete otherTemplate[ky]
  })
  innerTemplate = Object.assign({}, innerTemplate, contextInnerTemplate, otherTemplate)
  context._ao2_innerTemplate_ = innerTemplate
  return innerTemplate
}

export default function(){
  return context._ao2_innerTemplate_ || innerTemplate
}