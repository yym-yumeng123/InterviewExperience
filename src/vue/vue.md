---
outline: deep
---

## Vue2

### prop slot event

1. 属性 prop: prop 定义了这个组件有哪些可配置的属性，组件的核心功能也都是它来确定的。
2. 插槽 slot: `<slot>` 节点就是指定的一个插槽的位置; 当需要多个插槽时，会用到`具名 slot`
3. 自定义事件 event: `$emit`，就可以触发自定义的事件 on-click ，在父级通过 @on-click 来监听

### ref $parent $children

1. ref: 给元素或组件注册引用信息; 无法在跨级或兄弟间通信
2. $parent / $children: 访问父 / 子实例; 无法在跨级或兄弟间通信

### provide / inject

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效

```js
// A.vue
export default {
  provide: {
    name: 'Aresn'
  }
}

// B.vue
export default {
  inject: ['name'],
  mounted () {
    console.log(this.name);  // Aresn
  }
}

```

### $on $emit

`$emit` 会在当前组件实例上触发自定义事件，并传递一些参数给监听器的回调，一般来说，都是在父级调用这个组件时，使用 `@on` 的方式来监听自定义事件的，比如在子组件中触发事件

```js
// child.vue，部分代码省略
export default {
  methods: {
    handleEmitEvent() {
      this.$emit("test", "Hello Vue.js")
    },
  },
}
```

### extend

Vue.extend 的作用，就是基于 Vue 构造器，创建一个“子类”，它的参数跟 new Vue 的基本一样，但 data 要跟组件一样，是个函数，再配合 $mount ，就可以让组件渲染，并且挂载到任意指定的节点上，比如 body。

```js
import Vue from "vue"

const AlertComponent = Vue.extend({
  template: "<div>{{ message }}</div>",
  data() {
    return {
      message: "Hello, Aresn",
    }
  },
})

// 挂载到 body 下
const component = new AlertComponent().$mount()
document.body.appendChild(component.$el)

// 在 $mount 里写参数来指定挂载的节点
new AlertComponent().$mount("#app")
// 不用 $mount，直接在创建实例时指定 el 选项
new AlertComponent({ el: "#app" })
```

### 递归组件与动态组件

递归组件就是指组件在模板中调用自己，开启递归组件的必要条件，就是在组件中设置一个 name 选项

```js
<template>
  <div>
    <my-component></my-component>
  </div>
</template>
<script>
  export default {
    name: 'my-component'
  }
</script>

```

Vue.js 提供了另外一个内置的组件 `<component>` 和 `is` 特性，可以更好地实现动态组件

```js
<template>
  <component :is="tagName" v-bind="tagProps">
    <slot></slot>
  </component>
</template>
<script>
  export default {
    props: {
      // 链接地址
      to: {
        type: String,
        default: ''
      },
      // 链接打开方式，如 _blank
      target: {
        type: String,
        default: '_self'
      }
    },
    computed: {
      // 动态渲染不同的标签
      tagName () {
        return this.to === '' ? 'button' : 'a';
      },
      // 如果是链接，把这些属性都绑定在 component 上
      tagProps () {
        let props = {};

        if (this.to) {
          props = {
            target: this.target,
            href: this.to
          }
        }

        return props;
      }
    }
  }
</script>

```

### nextTick

`nextTick` 函数接收一个回调函数 cb，在下一个 DOM 更新循环之后执行。比如下面的示例：

```js
<template>
  <div>
    <p v-if="show" ref="node">内容</p>
    <button @click="handleShow">显示</button>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        show: false
      }
    },
    methods: {
      handleShow () {
        this.show = true;
        console.log(this.$refs.node);  // undefined
        this.$nextTick(() => {
          console.log(this.$refs.node);  // <p>内容</p>
        });
      }
    }
  }
</script>

```

### v-model 语法糖

`v-model` 是一个语法糖, 可以拆解为 props: value 和 events: input。就是说组件必须提供一个名为 value 的 prop，以及名为 input 的自定义事件，满足这两个条件，使用者就能在自定义组件上使用 v-model

```js
<template>
  <div>
    <button @click="increase(-1)">减 1</button>
    <span style="color: red;padding: 6px">{{ currentValue }}</span>
    <button @click="increase(1)">加 1</button>
  </div>
</template>
<script>
  export default {
    name: 'InputNumber',
    props: {
      value: {
        type: Number
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    watch: {
      value (val) {
        this.currentValue = val;
      }
    },
    methods: {
      increase (val) {
        this.currentValue += val;
        this.$emit('input', this.currentValue);
      }
    }
  }
</script>
```

### .sync 修饰符

.sync 不是真正的双向绑定，而是一个语法糖，修改数据还是在父组件完成的，并非在子组件

### $set

1. 由于 JavaScript 的限制，Vue 不能检测以下变动的数组：
   - 当利用索引直接设置一个项时，例如：this.items[index] = value;
   - 当修改数组的长度时，例如：vm.items.length = newLength
2. 由于 JavaScript 的限制，Vue 不能检测对象属性的添加或删除

```js
// 数组
export default {
  data() {
    return {
      items: ["a", "b", "c"],
    }
  },
  methods: {
    handler() {
      this.$set(this.items, 1, "x") // 是响应性的
    },
  },
}
```

### v-show 和 v-if 的区别

- v-show 只是 CSS 级别的 display: none; 和 display: block; 之间的切换
- v-if 决定是否会选择代码块的内容（或组件）
- 频繁操作时，使用 v-show，一次性渲染完的，使用 v-if
- 当 v-if="false" 时，内部组件是不会渲染的，所以在特定条件才渲染部分组件（或内容）时，可以先将条件设置为 false，需要时（或异步，比如 $nextTick）再设置为 true

### 绑定 class 的数组用法

```js
<template>
  <div :class="classes"></div>
</template>
<script>
  export default {
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          `${prefixCls}-${this.type}`,
          {
            [`${prefixCls}-long`]: this.long,
            [`${prefixCls}-${this.shape}`]: !!this.shape,
            [`${prefixCls}-${this.size}`]: this.size !== 'default',
            [`${prefixCls}-loading`]: this.loading != null && this.loading,
          }
        ];
      }
    }
  }
</script
```

### 计算属性和 watch 的区别

计算属性是自动监听依赖值的变化，从而动态返回内容，监听是一个过程，在监听的值变化时，可以触发一个回调，并做一些事情。

区别来源于用法，只是需要动态值，那就用计算属性；需要知道值的改变后执行业务逻辑，才用 watch

computed 是一个对象时, 有 get 和 set 两个选项

computed 和 methods 有什么区别？ => methods 是一个方法，它可以接受参数，而 computed 不能；computed 是可以缓存的，methods 不会；一般在 v-for 里，需要根据当前项动态绑定值时，只能用 methods 而不能用 computed，因为 computed 不能传参

watch 是一个对象时，它有哪些选项？ handle 执行的函数; deep 是否深度; immediate 是否立即执行

### 事件修饰符

```js
// .stop .prevent .capture .self
<custom-component @click.native="xxx">内容</custom-component>
```

### 组件中 data 为什么是函数

为什么组件中的 data 必须是一个函数，然后 return 一个对象，而 new Vue 实例里，data 可以直接是一个对象？

因为组件是用来复用的，JS 里对象是引用关系，这样作用域没有隔离，而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。

### Render 函数

Render 函数，就要说到虚拟 DOM（Virtual DOM）,Virtual DOM 并不是真正意义上的 DOM，而是一个轻量级的 JavaScript 对象，在状态发生变化时，Virtual DOM 会进行 Diff 运算，来更新只需要被替换的 DOM，而不是全部重绘

createElement 是 Render 函数的核心，它构成了 Vue Virtual DOM 的模板，它有 3 个参数

```js
createElement () {
  // {String | Object | Function}
  // 一个 HTML 标签，组件选项，或一个函数
  // 必须 return 上述其中一个
  'div',
    // {Object}
    // 一个对应属性的数据对象，可选
    // 您可以在 template 中使用
    {
    // 详细的属性
  },
    // {String | Array}
    // 子节点（VNodes），可选
    [
    createElement('h1', 'hello world'),
    createElement(MyComponent, {
      props: {
        someProps: 'foo'
      }
    }),
    'bar'
  ]
}
```

### 怎样理解单向数据流

概念出现在组件通信。父组件是通过 prop 把数据传递到子组件的，但是这个 prop 只能由父组件修改，子组件不能修改，否则会报错。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

### 声明周期

- 创建前 / 后（beforeCreate / created）：在 beforeCreate 阶段，Vue 实例的挂载元素 el 和数据对象 data 都为 undefined，还未初始化。在 created 阶段，Vue 实例的数据对象 data 有了，el 还没有。
- 载入前 / 后（beforeMount / mounted）：在 beforeMount 阶段，Vue 实例的 $el 和 data 都初始化了，但还是挂载之前为虚拟的 DOM 节点，data 尚未替换。在 mounted 阶段，Vue 实例挂载完成，data 成功渲染。
- 更新前 / 后（beforeUpdate / updated）：当 data 变化时，会触发 beforeUpdate 和 updated 方法。这两个不常用，且不推荐使用。
- 销毁前 / 后（beforeDestroy / destroyed）：beforeDestroy 是在 Vue 实例销毁前触发，一般在这里要通过 removeEventListener 解除手动绑定的事件。实例销毁后，触发 destroyed。

### 组件间通信

1. 父子通信
   - 父向子传递数据是通过 props，子向父是通过 events（emit）；通过父链 / 子链也可以通信（\parent / $children）；ref 也可以访问组件实例；provide / inject API。
2. 兄弟通信
   - Bus; Vuex
3. 跨级通信
   Bus; Vuex; provide/inject

### vue 响应式原理，双向绑定原理？

Vue2.x 采用数据劫持结合发布订阅模式（PubSub 模式）的方式，通过 Object.defineProperty 来劫持各个属性的 setter、getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

当把一个普通 Javascript 对象传给 Vue 实例来作为它的 data 选项时，Vue 将遍历它的属性，用 Object.defineProperty 将它们转为 getter/setter。用户看不到 getter/setter，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。

Vue 的数据双向绑定整合了 Observer，Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 的数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化->视图更新，视图交互变化（例如 input 操作）->数据 model 变更的双向绑定效果。

Vue3.x 放弃了 Object.defineProperty ，使用 ES6 原生的 Proxy，来解决以前使用 Object.defineProperty 所存在的一些问题。

### Vuex 中 mutations 和 actions 的区别

主要的区别是，actions 可以执行异步。actions 是调用 mutations，而 mutations 来修改 store。

## Vue3

### 谈一谈对 MVVM 的理解？

MVVM 是 Model-View-ViewModel 的缩写。MVVM 是一种设计思想。
Model 层代表数据模型，也可以在 Model 中定义数据修改和操作的业务逻辑;
View 代表 UI 组件，它负责将数据模型转化成 UI 展现出来，View 是一个同步 View 和 Model 的对象
在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互， Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。
对 ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的 同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作 DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

### vue3 响应式原理，双向绑定原理？

在 Vue 3.0 中采用了 Proxy，抛弃了 Object.defineProperty 方法。

Vue3 实现双向绑定的核心是 Proxy（代理的使用），它会对需要响应式处理的对象进行一层代理，对象的所有操作（get、set 等）都会被 Prxoy 代理到。在 vue 中，所有响应式对象相关的副作用函数会使用 weakMap 来存储。当执行对应的操作时，会去执行操作中所收集到的副作用函数。

- Object.defineProperty 无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应
- Object.defineProperty 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy 可以劫持整个对象，并返回一个新的对象
- Proxy 不仅可以代理对象，还可以代理数组。还可以代理动态增加的属性。
- Proxy 有多达 13 种拦截方法
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化

**Proxy 只会代理对象的第一层，那么 Vue3 又是怎样处理这个问题的呢？**

判断当前 Reflect.get 的返回值是否为 Object，如果是则再通过 reactive 方法做代理， 这样就实现了深度观测。

**监测数组的时候可能触发多次 get/set，那么如何防止触发多次呢？**

我们可以判断 key 是否为当前被代理对象 target 自身属性，也可以判断旧值与新值是否相等，只有满足以上两个条件之一时，才有可能执行 trigger。

### Proxy 相比 defineProperty 的优势在哪里

Vue3.x 改用 Proxy 替代 Object.defineProperty, 原因在于 Object.defineProperty 本身存在的一些问题：

- Object.defineProperty 只能劫持对象属性的 getter 和 setter 方法。
- Object.definedProperty 不支持数组(可以监听数组,不过数组方法无法监听自己重写)，更准确的说是不支持数组的各种 API(所以 Vue 重写了数组方法。

而相比 Object.defineProperty，Proxy 的优点在于：

- Proxy 是直接代理劫持整个对象。
- Proxy 可以直接监听对象和数组的变化，并且有多达 13 种拦截方法。

目前，Object.definedProperty 唯一比 Proxy 好的一点就是兼容性，不过 Proxy 新标准也受到浏览器厂商重点持续的性能优化当中



### 虚拟 DOM

采用虚拟 DOM 的更新技术在性能这块，理论上是不可能比原生 Js 操作 DOM 高的。不过在大部分情况下，开发者很难写出绝对优化的命令式代码。所以虚拟 DOM 就是用来解决这一问题，让开发者系的代码在性能上得到保障，甚至无限接近命令式代码的性能。
通常情况下，纯 Js 层面的操作远比 DOM 操作快。虚拟 DOM 就是用 Js 来模拟出 DOM 结构，通过 diff 算法来计算出最小的变更，通过对应的渲染器，来渲染到页面上。

同时虚拟 DOM 也为跨平台开发提供了极大的便利，开发者写的同一套代码（有些需要针对不同平台做区分），通过不同的渲染规则，就可以生成不同平台的代码。

在 vue 中会通过渲染器来将虚拟 DOM 转换为对应平台的真实 DOM。如 renderer(vnode， container)，该方法会根据 vnode 描述的信息（如 tag、props、children）来创建 DOM 元素，根据规则为对应的元素添加属性和事件，处理 vnode 下的 children。

### vue2 和 vue3 的区别有哪些？

1. vue3 的响应式是基于 Proxy 来实现的，利用代理来拦截对象的基本操作，配合 Refelect.\* 方法来完成响应式的操作。
2. 提供了 setup 的方式，配合组合式 API，可以建立组合逻辑、创建响应式数据、创建通用函数、注册生命周期钩子等。
3. diff 算法方面
   - 在 vue2 中使用的是双端 diff 算法：是一种同时比较新旧两组节点的两个端点的算法（比头、比尾、头尾比、尾头比）。一般情况下，先找出变更后的头部，再对剩下的进行双端 diff。
   - 在 vue3 中使用的是快速 diff 算法：它借鉴了文本 diff 算法的预处理思路，先处理新旧两组节点中相同的前置节点和后置节点。当前置节点和后置节点全部处理完毕后，如果无法通过简单的挂载新节点或者卸载已经不存在的节点来更新，则需要根据节点间的索引关系，构造出一个最长递增子序列。最长递增子序列所指向的节点即为不需要移动的节点。
4. 编译上的优化
   - vue3 新增了 PatchFlags 来标记节点类型（动态节点收集与补丁标志），会在一个 Block 维度下的 vnode 下收集到对应的 dynamicChildren（动态节点），在执行更新时，忽略 vnode 的 children，去直接找到动态节点数组进行更新，这是一种高效率的靶向更新。
   - vue3 提供了静态提升方式来优化重复渲染静态节点的问题，结合静态提升，还对静态节点进行预字符串化，减少了虚拟节点的性能开销，降低了内存占用。
   - vue3 会将内联事件进行缓存，每次渲染函数重新执行时会优先取缓存里的事件

### vue3 中的 ref、toRef、toRefs

1. ref:接收一个内部值，生成对应的响应式数据，该内部值挂载在 ref 对象的 value 属性上；该对象可以用于模版和 reactive。使用 ref 是为了解决值类型在 setup、computed、合成函数等情况下的响应式丢失问题。
2. toRef:为响应式对象（reactive）的一个属性创建对应的 ref，且该方式创建的 ref 与源属性保持同步。
3. toRefs：将响应式对象转换成普通对象，对象的每个属性都是对应的 ref，两者间保持同步。使用 toRefs 进行对象解构。

```js
function ref(val) {
  const wrapper = { value: val }
  Object.defineProperty(wrapper, "__v_isRef", { value: true })
  return reactive(wrapper)
}

function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    },
    set value(val) {
      obj[key] = val
    },
  }
  Object.defineProperty(wrapper, "__v_isRef", { value: true })
  return wrapper
}

function toRefs(obj) {
  const ret = {}
  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }

  return ret
}

// 自动脱ref
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      return value.__v_isRef ? value.value : value
    },
    set(target, key, newValue, receiver) {
      const value = target[key]
      if (value.__v_isRef) {
        value.value = newValue
        return true
      }
      return Reflect.set(target, key, newValue, receiver)
    },
  })
}
```

### computed 和 watch 的区别

1. computed 属性默认会走缓存，只有依赖数据发生变化，才会重新计算，不支持异步，有异步导致数据发生变化时，无法做出相应改变
2. watch 不依赖缓存，一旦数据发生变化就直接触发响应操作，支持异步


### composition Api 对比 option Api 的优势

- 更好的代码组织
- 更好的逻辑复用
- 更好的类型推导

## vue-router

### 解释 hash 模式和 history 模式的实现原理

- 后面 hash 值的变化，不会导致浏览器向服务器发出请求，浏览器不发出请求，就不会刷新页面；通过监听 hashchange 事件可以知道 hash 发生了哪些变化，然后根据 hash 变化来实现更新页面部分内容的操作。
- history 模式的实现，主要是 HTML5 标准发布的两个 API，pushState 和 replaceState，这两个 API 可以在改变 URL，但是不会发送请求。这样就可以监听 url 变化来实现更新页面部分内容的操作。

### 说一下 router 与 route 的区别

1. `$route` 对象表示当前的路由信息，包含了当前 URL 解析得到的信息。包含当前的路径，参数，query 对象等。
   - $route.hash：当前路由的 hash 值 (不带 #) ，如果没有 hash 值，则为空字符串
   - $route.name：当前路径名字
2. `$router` 对象是全局路由的实例，是 router 构造方法的实例。
   - push：向 history 栈添加一个新的记录
   - go：页面路由跳转前进或者后退
   - replace：替换当前的页面，不会向 history 栈添加一个新的记录

### vueRouter 有哪几种导航守卫？

- 全局前置/钩子：beforeEach、beforeR-esolve、afterEach
- 路由独享的守卫：beforeEnter
- 组件内的守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

```js
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // to: 即将进入的目标
  // from:当前导航正要离开的路由
  return false // 返回false用于取消导航
  return { name: "Login" } // 返回到对应name的页面
  next({ name: "Login" }) // 进入到对应的页面
  next() // 放行
})

// 全局解析守卫:类似 beforeEach
router.beforeResolve((to) => {
  if (to.meta.canCopy) {
    return false // 也可取消导航
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  logInfo(to.fullPath)
})

// 导航错误钩子
router.onError((error) => {
  logError(error)
})

// 路由独享守卫, beforeEnter可以传入单个函数，也可传入多个函数。
function dealParams(to) {
  // ...
}
function dealPermission(to) {
  // ...
}

const routes = [
  {
    path: "/home",
    component: Home,
    beforeEnter: (to, from) => {
      return false // 取消导航
    },
    // beforeEnter: [dealParams, dealPermission]
  },
]

// 组件内的守卫
const Home = {
  template: `...`,
  beforeRouteEnter(to, from) {
    // 此时组件实例还未被创建，不能获取this
  },
  beforeRouteUpdate(to, from) {
    // 当前路由改变，但是组件被复用的时候调用，此时组件已挂载好
  },
  beforeRouteLeave(to, from) {
    // 导航离开渲染组件的对应路由时调用
  },
}
```

### 解释一下 vueRouter 的完整的导航解析流程是什么

1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫（2.2+）。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫（2.5+）。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。
