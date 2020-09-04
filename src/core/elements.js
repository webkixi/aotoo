import * as lib from "../lib";

function groupEelements(elements) {
  let obj = {}
  elements.forEach((item, ii)=>{
    obj[ii] = item
  })
  obj.length = elements.length
  Reflect.setPrototypeOf(obj, {
    forEach: Array.prototype.forEach,
    map: Array.prototype.map,
    filter: Array.prototype.filter,
    splice(){},
    reset(param){
      this.forEach(item => {
        if (item.reset) item.reset(param)
      })
    },
    attr(param1, param2){
      this.forEach(item => {
        if (item.attr) item.attr(param1, param2)
      })
    },
    show(){
      this.forEach(item => {
        if (item.show) item.show()
      })
    },
    hide(){
      this.forEach(item => {
        if (item.hide) item.hide()
      })
    },
    toggleClass(cls, cb){
      this.forEach(item => {
        if (item.toggleClass) item.toggleClass(cls, cb)
      })
    },
    addClass(cls, cb){
      this.forEach(item=>{
        if (item.addClass) item.addClass(cls, cb)
      })
    },
    removeClass(cls, cb){
      this.forEach(item => {
        if (item.removeClass) item.removeClass(cls, cb)
      })
    },
    update(param, cb){
      this.forEach(item => {
        if (item.update) item.update(param, cb)
      })
    },
    find(indentify){
      let targets = this.filter(item=>item.hasClass(indentify))
      return groupEelements(targets)
    }
  })
  return obj
}

class ElementsCollection {
  elements = {}
  setElement(id, instance) {
    if (id && instance) {
      this.elements[id] = instance
    }
  }
  delElement(id) {
    this.elements[id] = null
  }
  getElement(indentify, context) {
    let target = []
    if (indentify) {
      let findFromRoot = context ? (context.children||[].concat(context)) : this.elements
      indentify = indentify.replace('#', '')
      if (indentify.indexOf('.') === 0) {
        lib.forEach(findFromRoot, (ele, ii, ky) => {
          if (ele.hasClass && ele.hasClass(indentify)) {
            target.push(ele)
          }
        })
      } else {
        target = [this.elements[indentify]]
      }
      return target.length === 1 ? target[0] : groupEelements(target)
    } else {
      return groupEelements(this.elements)
    }
  }
}

let _elements = new ElementsCollection()


let memory = {}
export default function(prefix) {
  if (!memory[prefix]) {
    memory[prefix] = new ElementsCollection()
  }
  return memory[prefix]
}