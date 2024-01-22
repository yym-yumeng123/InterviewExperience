---
outline: deep
---

## 设计模式

- **单一职责原则**：一个类只负责一个功能领域中的相应职责，或者可以定义为：就一个类而言，应该只有一个引起它变化的原因。
- **开放封闭原则**：核心的思想是软件实体（类、模块、函数等）是可扩展的、但不可修改的。也就是说,对扩展是开放的,而对修改是封闭的。

|  设计模式  |                    描述                    | 例子                               |
| :--------: | :----------------------------------------: | :--------------------------------- |
|  单例模式  |          一个类只能构造出唯一实例          | Redux/Vuex 的 store                |
|  工厂模式  |            对创建对象逻辑的封装            | jQuery 的$(selector)               |
| 观察者模式 | 当一个对象被修改时，会自动通知它的依赖对象 | Redux 的 subscribe、Vue 的双向绑定 |
| 装饰器模式 |       对类的包装，动态地拓展类的功能       | React 高阶组件、ES7 装饰器         |
| 适配器模式 |          兼容新旧接口，对类的包装          | 封装旧 API                         |
|  代理模式  |               控制对象的访问               | 事件代理、ES6 的 Proxy             |

### 工厂模式

假设有一份很复杂的代码需要用户去调用，但是用户并不关心这些复杂的代码，只需要你提供给我一个接口去调用，用户只负责传递需要的参数，至于这些参数怎么使用，内部有什么逻辑是不关心的，只需要你最后返回我一个实例。这个构造过程就是工厂

作用就是隐藏了创建实例的复杂度，只需要提供一个接口，简单清晰。

```js
class Man {
  constructor(name) {
    this.name = name
  }
  alertName() {
    alert(this.name)
  }
}

class Factory {
  static create(name) {
    return new Man(name)
  }
}

Factory.create("yck").alertName()
```

### 单例模式

单例模式很常用，比如全局缓存、全局状态管理等等这些只需要一个对象，就可以使用单例模式。

单例模式的核心就是`保证全局只有一个对象可以访问`。因为 JS 是门无类的语言，所以别的语言实现单例的方式并不能套入 JS 中，我们只需要用一个变量确保实例只创建一次就行，以下是如何实现单例模式的例子

```js
class Singleton {
  constructor() {}
}

Singleton.getInstance = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new Singleton()
    }
    return instance
  }
})()

let s1 = Singleton.getInstance()
let s2 = Singleton.getInstance()
console.log(s1 === s2) // true
```

### 适配器模式

适配器用来解决两个接口不兼容的情况，不需要改变已有的接口，通过包装一层的方式实现两个接口的正常协作。

```js
class Plug {
  getName() {
    return "港版插头"
  }
}

class Target {
  constructor() {
    this.plug = new Plug()
  }
  getName() {
    return this.plug.getName() + " 适配器转二脚插头"
  }
}

let target = new Target()
target.getName() // 港版插头 适配器转二脚插头
```

### 装饰模式

装饰模式不需要改变已有的接口，作用是给对象添加功能。就像我们经常需要给手机戴个保护套防摔一样，不改变手机自身，给手机添加了保护套提供防摔功能。

```js
function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Test {
  @readonly
  name = "yck"
}

let t = new Test()

t.yck = "111" // 不可修改
```

### 代理模式

代理是为了控制对对象的访问，不让外部直接访问到对象。

```js
<ul id="ul">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
</ul>
<script>
    let ul = document.querySelector('#ul')
    ul.addEventListener('click', (event) => {
        console.log(event.target);
    })
</script>
```

### 发布订阅模式

发布-订阅模式也叫做观察者模式。通过一对一或者一对多的依赖关系，当对象发生改变时，订阅方都会收到通知。

```js
<ul id="ul"></ul>
<script>
    let ul = document.querySelector('#ul')
    ul.addEventListener('click', (event) => {
        console.log(event.target);
    })
</script>
```

### 外观模式

外观模式提供了一个接口，隐藏了内部的逻辑，更加方便外部调用。

```js
function addEvent(elm, evType, fn, useCapture) {
  if (elm.addEventListener) {
    elm.addEventListener(evType, fn, useCapture)
    return true
  } else if (elm.attachEvent) {
    var r = elm.attachEvent("on" + evType, fn)
    return r
  } else {
    elm["on" + evType] = fn
  }
}
```
