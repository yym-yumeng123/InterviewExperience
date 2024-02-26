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

### 设计模式是什么?

设计模式是在软件工程中广泛使用的一种可复用的解决方案，用于解决常见的设计问题。它们是在实际开发中经过验证的最佳实践和解决方案的模板。设计模式提供了一种方法，使开发人员能够更加有效地设计、开发和维护软件，同时提高代码的质量、可维护性和可扩展性。

1. 提高代码质量：鼓励使用已经经过验证的、经过测试的解决方案，这可以提高代码的质量和可靠性。
2. 提高可维护性：通过分离关注点、减少耦合性和提供清晰的结构来增强代码的可维护性。
3. 促进可扩展性：可以使系统更容易扩展，因为它们通常是基于抽象的。当需求发生变化时，可以通过添加新的模块或修改现有模块来满足新需求，而不必改动个系统。
4. 提高复用性：鼓励重用已存在的模块，从而减少代码重复和重构的需要。这可以加速开发过程并减少错误。
5. 提高团队协作：提供了一种通用的词汇和模板，使团队成员之间更容易沟通和理解代码。
6. 降低错误率：通过使用经过验证的设计模式，可以降低代码中的错误率，因为这些模式已经被证明是有效的。
7. 提高性能：可以通过优化代码结构来提高系统的性能。
8. 提高学习效率：一种通用的方法论，可以帮助开发人员更容易理解和学习复杂的系统。
9. 建立最佳实践：反映了在面向对象编程中的最佳实践，它们鼓励开发者遵守这些实践，以创建高质量的代码

### 什么是 MVC

MVC 是一种经典的软件架构模式，它用于组织和设计应用程序的结构。MVC 代表 Model-View-Controller，它将应用程序分为三个主要组件，以分离关注点，提高代码的可维护性和可扩展性。

- `Model`: 模型代表应用程序的数据和业务逻辑。它负责管理数据的状态、操作和维护数据的完整性。模型不直接关心用户界面，它独立于视图和控制器。
- `View`: 视图是用户界面的可视化表示。它负责将数据呈现给用户，并接收用户的输入。视图通常不包含业务逻辑，它是与用户界面相关的部分。
- `Controller`: 控制器充当了模型和视图之间的中介。它接受用户的输入、处理用户请求，并根据需要更新模型和视图。控制器包含应用程序的业务逻辑，但通常不包含太多的数据处理逻辑。

### 什么是 MVVM

MVVM（Model-View-ViewModel）是一种用于构建用户界面的软件架构模式。它是一种分离关注点的模式，旨在使用户界面的开发更加模块化、可维护和可测试

- Model: 代表应用程序的数据和业务逻辑。模型负责管理数据的状态和操作，但不关心数据的展示方式。
- View: 代表用户界面。视图负责数据的展示和用户输入的处理，但不应包含业务逻辑。
- ViewModel: ViewModel 充当了模型和视图之间的中介。它包含了视图所需的数据和命令，以及处理视图和模型之间的数据交互。ViewModel 可以将模型数据适配成视图所需的形式，同时也可以监听视图的用户输入并将其转发到模型。

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
