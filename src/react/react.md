---
outline: deep
---

### SPA MPA

- `SPA` 单页面应用
  - 避免页面间切换阻断用户的体验
  - 所有的前端内容都是单次加载, 根据用户的操作, 动态组装前端资源, 局部更新
  - 组成: 一个主页面 + 多个页面片段
- `MPA` 多页面应用
  - 每个页面都是独立的页面, 访问单独的页面, 都需要重新加载前端资源, 整个页面刷新
  - 组成: 多个主页面

1. SPA 的实现

- hash
- history

```js
// hash
class Router {
  constructor() {
    this.routes = {}
    this.currentUrl = ""

    window.addEventListener("load", this.refresh)
    window.addEventListener("hashchange", this.refresh)
  }
  route(path, cb) {
    this.routes[path] = cb
  }
  push(path) {
    this.routes[path] && this.routes[path]()
  }
}

window.minRouter = new Router()
minRouter.route("/", () => console.log("1111"))

minRouter.push("/")
```

```js
// H5 history API
// history.pushstate 记录浏览器的历史变化
// history.replaceState 修改浏览器的历史中当前记录
// history.popState history.change 触发
class Router {
  constructor() {
    this.routes = {}
    this.listerPopState()
  }

  init(path) {
    history.replace({ path: path }, null, path)
    this.routes[path] && this.routes[path]()
  }

  route(path, cb) {
    this.routes[path] = cb
  }

  push(path) {
    history.pushState({ path }, null, path)
    this.routes[path] && this.routes[path]()
  }

  listerPopState() {
    window.addEventListener("popstate", (e) => {
      const path = e.state.path
      this.routes[path] && this.routes[path]()
    })
  }
}

window.minRouter = new Router()
minRouter.route("/", () => console.log("1111"))

minRouter.push("/")
```

2. SPA 的 SEO

- SSR: 组件页面通过服务端下发 `html`
- 静态化
  - 动态页面抓取 -> 保存为静态页面, 存储在硬盘
  - Web 服务器 URLRewrite 外部请求的静态地址 -> 实际的动态页面地址
- nginx 针对爬虫的处理
  - node server 完整解析 HTML user-agent

3. SPA 首屏加载 优化方案

- 减少入口文件的体积
  - 路由懒加载 不同组件拆分成不同的代码模块
- 静态资源本地缓存
  - localStorage
  - HTTP 缓存 cache-control Etag
  - service worker
- UI 按需加载
- 避免组件重复打包
- 图片资源压缩
- Gzip

```js
// 计算首屏加载时间
document.addEvenetListener("DOMContentLoad", (e) => {})

performance.getEntriesByName("first-contentful-paint")[0].startTime
{
  duration: 0
  entryType: "paint"
  name: "first-contentful-paint"
  startTime: 788.9000000059605
}

// 网络原因
// 资源文件过大
// 资源是否重复发送请求
```

### React 的理解

### JSX: 声明式语法唐

- JSX 直接利用了 JS 语句, JS 表达式能做的, JSX 都能做
- JSX 是 `createElement` 的语法唐

```jsx
React.createElement(component, props, ...children)

<header className="App-header">
  <h1>我的看板</h1>
</header>

React.createElement("header", {className: "App-header"},
  React.createElement("h1", null, "我的看板")
);
```

- JSX 子元素类型
  - 字符串, 被渲染成 HTML 标签里的字符串
  - 另一段 JSX, 嵌套渲染
  - JS 表达式, 会在渲染过程中执行, 返回值参与到渲染过程
  - 布尔值、null、undefined 不会被渲染

React 没有组件树, 只有元素树

### 虚拟 DOM

虚拟 DOM (Virtual DOM), 是相对于 `HTML DOM` 更轻量的 JS 模型,

操作真实 DOM 是比较耗费资源的, 大量调用 DOM API 绘制页面，页面很容易就卡

React 的声明式 API，在此基础上，每次有 `props、state` 等数据变动时，组件会渲染出新的元素树，React 框架会与之前的树做 `Diffing` 对比，将元素的变动最终体现在浏览器页面的 DOM 中。这一过程就称为`协调（Reconciliation）`

1. Diffing 算法

- 从根元素开始, 递归对比两棵树的根元素和子元素
- 对比`不同类型`的元素, 比如对比 html 和 React 组件元素, React 会直接清理旧的元素和子树, 建立新的树
- 对比`同为HTML元素`, 但 Tag 不同的元素, 如从 `<a>` 变为 `<div>`, React 会直接清理旧的元素和子树，然后建立新的树
- 对比`同为 React 组件元素` ,但组件类或组件函数不同的元素，如从 `<KanbanNewCard />` 变成 `<KanbanCard />` , React 会卸载旧的元素和子树，然后挂载新的元素树
- 对比`Tag相同的HTML元素`, 如 `<input type="text" value="old" />` 和 `<input type="text" value="new" />` React 保留该元素, 并记录有改变的属性, 在之前, old => new
- 对比组件类或组件函数相同的组件元素, 如 `<KanbanCard title="老卡片" />` 和 `<KanbanCard title="新卡片" />`, React 会保留组件实例, 更新 props, 出发组件的声明周期或者 hoks

:::tip
强调: 对比两棵树对应节点的子元素时，如果子元素形成一个列表，那么 React 会按顺序尝试匹配新旧两个列表的元素

React 引入了 key 这个特殊属性，当有子元素列表中的元素有这个属性时，React 会利用这个 key 属性值来匹配新旧列表中的元素，以减少插入元素时的性能损耗
:::

2. 触发协调的场景

- props 从组件外面传进来 不可变(immutable)
- state 活跃在组件内部 不可变(immutable)
- context 组件外面的 Context.Provider 提供数据，组件内部则可以消费 context 数据

### React Hooks

- `useState`
  - 从 React 18 版本起，无论是在事件处理函数、异步回调，还是 setTimeout 里的多个 state 更新，默认都会被自动批处理，只触发一次重新渲染
- `useEffect`
- `useContext`
- `useRef`
- 需要性能优化, 减少不必要渲染 `useMemo useCallback`
  - useMemo 的功能是为工厂函数返回一个记忆化的计算值, 在两次渲染之前, 只有依赖值数组中的依赖值有变化时, 该 Hook 才会调用工厂函数重新计算, 将新的返回值记忆化并返回给组件
  - useCallback 会把作为第一个参数的回调函数返回给组件, 只要第二个参数依赖值数组的依赖项不改变, 就会保证一直返回同一个回调函数, 而不是新建一个函数, 保证了回调函数的闭包也是不变的, 相反, 依赖项改变, useCallbak 才会更新回调函数及其闭包
- 处理复杂 state: `useReducer`
- 需要封装命令, 对外提供命令式接口 `useRef + useImperativeHandle`
- 用户操作相关, 受到异步渲染拖累卡顿时, useDeferredvalue useTransition

```jsx
// 调用 state 更新函数后, 组件的更新是异步的, 不会马上执行
// React18 为更新 state 加入 自动批处理 功能, 多个 state 更新函数调用会被合并到一次重新渲染中
const [showAdd, setShowAdd] = useState(false)
// 更新函数使用最新的 state 来计算新 state 值
setShowAdd((prevState) => !prevState)
setTodoList((prevState) => {
  return [...prevState, aNewTodoItem]
})

// useReducer 使用
function reducer(state, action) {
  switch (action.type) {
    case "show":
      return true
    default:
      return false
  }
}
const [showAdd, dispatch] = useReducer(reducer, false)
dispatch({ type: "show" })

// useRef 可变值
const myRef = useRef(null)
// 读取可变值
const value = myRef.current
```

在 React 中，大量行为都可以被称作副作用，比如挂载、更新、卸载组件，事件处理，添加定时器，修改真实 DOM，请求远程数据，在 console 中打印调试信息，等等

```jsx
// 作为组件函数体的一部分, 每次组件渲染时都会被调用
// 作为参数的副作用回调函数在 提交阶段 才会被调用
// 副作用回调函数可以访问到组件的真实 DOM
useEffect(() => {
  /* 省略 */
})

// 副作用的条件执行, 传入一个依赖数组
// 下次渲染时会把依赖值数组里的值依次与前一次记录下来的值做浅对比（Shallow Compare）
// 依赖值数组里可以加入 props、state、context 值
useEffect(() => {
  /* 省略 */
}, [var1, var2])

// 如果不清理定时器会怎样？如果是在更新阶段，组件就可能会有多个定时器在跑，会产生竞争条件
// 如果组件已被卸载，那么有可能导致内存泄露
useEffect(() => {
  /* 省略 */ return () => {
    /* 省略 */
  }
}, [status])
```

`useLayoutEffect`。它的副作用执行时机一般早于 useEffect，是在真实 DOM 变更之后同步执行的

```jsx
// 两个参数: 工厂函数 factory 依赖值数组, 返回值就是工厂函数的返回值
const memoized = useMemo(() => createByHeavyComputing(a, b), [a, b])

const [num, setNum] = useState("0")

// 执行成本较高的计算结果存入缓存，通过减少重复计算来提升组件性能
// 如果后续其他 state 发生了改变，但 num 的值保持 '40' 不变，则 useMemo 不会执行工厂函数，直接返回缓存中的 102334155 ，减少了组件性能损耗
const sum = useMemo(() => {
  const n = parseInt(num, 10)
  return fibonacci(n)
}, [num])

// useCallback 是 useMemo 的一个马甲
const memoizedFunc = useCallback(() => {
  /*省略*/
}, [a, b])
const memoizedFunc = useMemo(
  () => () => {
    /*省略*/
  },
  [a, b]
)
```

Hooks 使用规则

- 第一，只能在 React 的函数组件中调用 Hooks
- 第二，只能在组件函数的最顶层调用 Hooks
- 第三, 不能在循环、条件分支中或者任何 return 语句之后调用 Hooks

### React 合成事件

React 内建了一套名为 `合成事件(SyntheticEvent)` 的事件系统.

原生 DOM 监听事件

```html
<!-- 原生DOM -->
<!-- 这是HTML不是JSX -->
<button onclick="handleClick()">按钮</button>
<input type="text" onkeydown="handleKeyDown(event)" />
```

在 React 中, HTML 元素也有类似的, 以 `on*` 开头的事件处理属性, 例 onClick onKeyDown 等

```js
const Component = () => {
  const handleClick = () => {}
  const handleKeyDown = (evt) => {}
  return (
    <>
      {/* 这次是JSX了 */}
      <button onClick={handleClick}>按钮</button>
      <input type='text' onKeyDown={(evt) => handleKeyDown(evt)} />
    </>
  )
}
```

上面的代码中, 用户点击按钮, React 都会`传入一个描述点击事件的对象作为函数的第一个参数。而这个对象就是 React 中的合成事件`

合成事件是`对原生 DOM 事件的一种包装`, 与原生事件的接口相同

合成事件与原生 DOM 事件区别:

1. 注册事件监听函数的方式不同
   1. `原生: addEventListener`
   2. 合成事件不能通过 addEvent 监听
2. 特定事件的行为不同
   1. React 中，`<input> 、<textarea> 和 <select>` 三种表单元素的 onChange 合成事件被规范成了一致的行为
3. 实现注册的目标 DOM 元素不同
   1. 原生 DOM 当前目标 event.currentTarget
   2. React 是合成事件, evt 参数就是一个合成事件; 通过 evt.nativeEvent 属性，可以得到这个合成事件所包装的原生事件

### 受控组件

以 React state 为单一事实来源（Single Source of Truth），并用 React 合成事件处理用户交互的组件，被称为 "受控组件"

```jsx
const KanbanNewCard = ({ onSubmit }) => {
  const [title, setTitle] = useState("")
  const handleChange = (evt) => {
    setTitle(evt.target.value)
  }

  return (
    <div>
      <input type='text' value={title} onChange={handleChange} />
    </div>
  )
}
```

### 单向数据流

**React 数据流包含哪些数据**

1. `Props`: React 组件接受一组输入参数，用于改变组件运行时的行为，这组参数就是 props
   - 形成列表的子元素 key
   - 引用 DOM 元素的 ref
   - props 的数据流向是单向的, 只能从父组件流向子组件, 而不能从子组件流向父组件
2. `State`: 组件内自己的数据
   - 对同一个对象属性的修改不会改变对象的值引用, React 都不认为是变化, 所有在更新引用类型时, 需要新建数组, 对象
3. `Context`: 上下文
   - context 的数据流向也是单向的，只能从声明了 Context.Provider 的当前组件传递给它的子组件树

```jsx
// 1. 调用 React.createContext() 创建 Context 对象
const MyContext = React.createContext("没路用的初始值")
// 2. <MyContext.Provider> 组件，定义 value 值，并将子组件声明在前者的闭合标签里
function MyComponent() {
  const [state1, setState1] = useState("文本")
  const handleClick = () => {
    setState1("更新文本")
  }
  return (
    <MyContext.Provider value={state1}>
      <ul>
        <MyChildComponent />
        <li>
          <button onClick={handleClick}>更新state</button>
        </li>
      </ul>
    </MyContext.Provider>
  )
}
// 3. 在子组件或后代组件, 使用 useContext 获取 MyContext 值, 称为 MyContext 消费者
const value = useContext(MyContext)
```

### 不可变数据

不可变数据(Immutable Data)在创建以后, 就不可以被改变

对 React 框架，不可变数据可以简化比对数据的实现，降低成本
对开发者，不可变数据在开发和调试过程中更容易被预测。

1. 协调过程中数据对比, `Object.is(oldVal, newVal)`

- 更新 state, 新旧 state 值不相等, 才把 Fiber 标记为更新
- 更新 `Context.Provider` 中的 value 值
- 检查 `useEffect、useMemo、useCallback` 的依赖值数组，只有每个值的新老值都检查过，其中有不同时，才执行它们的回调
- 对象: `shallowEqual(oldObj, newObj)对比新旧对象(props)`, 两个对象属性数量相同，且其中一个对象的每个属性都与另一个对象的同名属性相等时，这两个对象才算相等

2. 合成事件中的的数据对比

在触发 onSelect 合成事件前，React 用浅对比判断选中项是否真的有变化，真有变化才会触发事件，否则不会触发

3. React 纯组件

- 在 React 里，纯组件 `PureComponent` 是一个主要用于`性能优化`的独立 API：当组件的 props 和 state 没有变化时，将跳过这次渲染，直接沿用上次渲染的结果
- 纯组件只应该作为性能优化的手段，开发者不应该将任何业务逻辑建立在到纯组件的行为上
- `React.memo`: 第一个参数是一个组件, 返回一个作为高阶组件的纯组件, 第二个参数戳一个对比函数

```js
// 纯组件接受的 props 与原组件相同。每次渲染时纯组件会把 props 记录下来
// 下次渲染时会用新的 props 与老的 props 做浅对比，如果判断相等则跳过这次原组件的渲染
// 注意，原组件内部不应该有 state 和 context 操作，否则就算 props 没变，原组件还是有可能因为 props 之外的原因重新渲染

const MyPureComponent = React.memo(MyComponent)
//    ---------------              -----------
//           ^                          ^
//           |                          |
//         纯组件                       组件

// compare 函数被调用时会接受 oldProps 和 newProps 两个参数，如果返回 true，则视为相等，反之则视为不等
const MyPureComponent = React.memo(MyComponent, compare)
//    ---------------              -----------  -------
//           ^                          ^          ^
//           |                          |          |
//         纯组件                       组件      自定义对比函数
```

4. 实现不可变数据

别改原对象

```js
// 数组
const itemAdded = [...oldArray, newItem]
const itemRemoved = oldArray.filter((item) => item !== newItem)

// 对象
const propertyUpdated = { ...oldObj, property1: "newValue" }

// Map
const keyUpdated = new Map(oldMap).set("key1", "newValue")
```

### 什么是 Fiber 协调引擎

### 路由原理

前端路由实现起来其实很简单，本质就是`监听 URL 的变化`，然后`匹配路由规则`，显示相应的页面，并且无须刷新页面

1. `Hash 模式`
   - `www.test.com/#/ 就是 Hash URL`，当 # 后面的哈希值发生变化时，可以通过 `hashchange 事件来监听到 URL 的变化`，从而进行跳转页面，并且无论哈希值如何变化，服务端接收到的 URL 请求永远是 www.test.com
   ```js
   window.addEventListener("hashchange", () => {
     // ... 具体逻辑
   })
   ```
2. `History 模式`

   - History 模式是 HTML5 新推出的功能，主要使用 `history.pushState` 和 `history.replaceState` 改变 URL。

   ```js
   // 新增历史记录
   history.pushState(stateObject, title, URL)
   // 替换当前历史记录
   history.replaceState(stateObject, title, URL)

   window.addEventListener("popstate", (e) => {
     // e.state 就是 pushState(stateObject) 中的 stateObject
     console.log(e.state)
   })
   ```

3. 两种模式对比
   - Hash 模式只可以更改 # 后面的内容，History 模式可以通过 API 设置任意的同源 URL
   - History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串
   - Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 页面用于匹配不到静态资源的时候

### MVVM

- View 很简单，就是用户看到的视图
- Model 同样很简单，一般就是本地数据和数据库中的数据

1. `MVC`

`MVC` 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染。当用户有输入时，会通过控制器去更新模型，并且通知视图进行更新

MVC 有一个巨大的缺陷就是控制器承担的责任太大了，随着项目愈加复杂，控制器中的代码会越来越臃肿，导致出现不利于维护的情况

2. `MVVM`

引入了 `ViewModel` 的概念。`ViewModel` 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel

以 Vue 框架来举例，ViewModel 就是组件的实例, View 就是模板，Model 的话在引入 Vuex 的情况下是完全可以和组件分离的

通过 ViewModel 将视图中的状态和用户的行为分离出一个抽象，这才是 MVVM 的精髓
