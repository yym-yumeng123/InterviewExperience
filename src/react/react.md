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
  // 监听事件的回调，负责当页面hash改变时执行对应hash值的回调函数
  refresh = () => {
    this.currentUrl = location.hash.slice(1) || "/"
    this.routes[this.currentUrl]()
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

- React 是一个用于构建用户界面（UI）的 JavaScript 库 (没有第三方依赖, 比较灵活)
- JSX 语法
- 单向数据流
- 虚拟 DOM (高效)
- 声明式编程
- 一切都是组件, 可以是一个函数或者一个类
- React 帮助你把它们组合成可重用、可嵌套的 组件

### React v18.0

#### Concurrent

Concurrent 翻译为并发, 并不是 API 之类的新特性, 但很重要, 是 React18 大部分新特性的视线基础, 包括 `Suspense、transitions、流式服务端渲染等`

Concurrent 最主要的特点是 `渲染是可中断的`, update 开始了也可以中断, 晚点再继续, 中间也可能被遗弃掉

`可中断`: 对于 React 来说, 任务可能很多, 需要区分优先级, 高优先级的任务来了, 就可以先中断低优先级的任务, 对于复杂项目来说, 任务可中断这件事情很重要, 基础还是 `fiber`, 本身是链表结构, 想指向别的地方加个属性就行了

`被遗弃`: 在 Concurrent 模式下, 有些 update 可能会被遗弃掉

`状态复用`: 还支持状态复用, 有时用户想要看上一次页面状态, 可选的, React 正在用 `Offscreen` 组件来实现这个功能, 还没完成, 源码在做了

#### `reacr-dom/client` 中的 `createRoot`

```js
const root = createRoot(docuemnt.getElementById("root"))
const App = () => {}
root.render(<App />)
```

#### 自动批处理 Automatic Batching

React 会将之前未做处理的类似异步任务进行一个合并以减少渲染

批量更新: 将多次 state 更新合并到一次 render

- React18 之前: React 仅在浏览器事件处理期间才会做批量更新; 对于 Promise，setTimeout、等基础异步任务中是不会执行的
- React18 版本中: 对于基于 `createRoot` 创建出来的组件，其下的所有状态都会应用批量更新。

```js
// 关闭批处理更新
import { flushSync } from "react-dom"

function handleClick() {
  // 用 flushSync 同步更新 state
  flushSync(() => {
    setCounter((c) => c + 1)
  })
  flushSync(() => {
    setFlag((f) => !f)
  })
}
```

#### Suspense

可以等待目标 UI 加载，并且可以直接指定一个加载的界面（像是个 spinner），让它在用户等待的时候显示。

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

#### 错误处理

```js
export default class ErrorBoundaryPage extends React.Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}
```

#### transition

React 把 update 更新分为两种:

- `Urgent updates` 紧急更新，指直接交互，通常指的用户交互。如点击、输入等。这种更新一旦不及时，用户就会觉得哪里不对。
- `Transition updates` 过渡更新，如 UI 从一个视图向另一个视图的更新。通常这种更新用户并不着急看到。

```js
/**
 * startTransition可以用在任何你想更新的时候。但是从实际来说，以下是两种典型适用场景
 * 1. 渲染慢：如果你有很多没那么着急的内容要渲染更新。
 * 2. 网络慢：如果你的更新需要花较多时间从服务端获取。这个时候也可以再结合Suspense
 */
import { useTransition, useDeferredValue } from "react"

export default function Button({ refresh }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className='border'>
      <h3>Button</h3>
      <button
        onClick={() => {
          startTransition(() => {
            refresh()
          })
        }}
        disabled={isPending}
      >
        点击刷新数据
      </button> {isPending ? <div>loading...</div> : null}
    </div>
  )
}
```

#### useId

用于产生一个在服务端与 Web 端都稳定且唯一的 ID, 也支持加前缀, 多用于 ssr 的环境下

```js
const newHookAPi = () => {
  const id = useId()
  // 不支持css选择器
  return <div id={id}>Hello</div>
}
```

#### useSyncExternalStore

用于外部数据的读取和订阅, 可应用 Concurrent

```js
const state = useSyncExternalStore(subscribe, getSnapshot[, getServeSnapshot])
```

#### useInsertionEffect

函数签名同 `useEffect`, 但是它在所有 DOM 变更前同步触发, 主要用于`css-in-js`库, 往 DOM 中动态注入`<style> 或svg的 <defs>`, 由于执行时机, 不可读取 refs

```js
function useCSS(rule) {
  useInsertionEffect(() => {
    if (!isInserted.has(rule)) {
      isInserted.add(rule)
      document.head.appendChild(getStyleForRule(rule))
    }
  })
  return rule
}
function Component() {
  let className = useCSS(rule)
  return <div className={className} />
}
```

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

虚拟 DOM (Virtual DOM), 是相对于 `HTML DOM` 更轻量的 JS 模型

```js
const vDOM = React.createElement("h1", { className: "hClass" }, "hello world")
```

操作真实 DOM 是比较耗费资源的, 大量调用 DOM API 绘制页面，页面很容易就卡

React 的声明式 API，在此基础上，每次有 `props、state` 等数据变动时，组件会渲染出新的元素树，React 框架会与之前的树做 `Diffing` 对比，将元素的变动最终体现在浏览器页面的 DOM 中。这一过程就称为`协调（Reconciliation）`

1. Diffing 算法

- 从根元素开始, 递归对比两棵树的根元素和子元素
- 对比`不同类型`的元素, 比如对比 html 和 React 组件元素, React 会直接清理旧的元素和子树, 建立新的树
- 对比`同为HTML元素`, 但 Tag 不同的元素, 如从 `<a>` 变为 `<div>`, React 会直接清理旧的元素和子树，然后建立新的树
- 对比`同为 React 组件元素` ,但组件类或组件函数不同的元素，如从 `<KanbanNewCard />` 变成 `<KanbanCard />` , React 会卸载旧的元素和子树，然后挂载新的元素树
- 对比`Tag相同的HTML元素`, 如 `<input type="text" value="old" />` 和 `<input type="text" value="new" />` React 保留该元素, 并记录有改变的属性, 在之前, old => new
- 对比组件类或组件函数相同的组件元素, 如 `<KanbanCard title="老卡片" />` 和 `<KanbanCard title="新卡片" />`, React 会保留组件实例, 更新 props, 触发组件的声明周期或者 hooks

:::tip
强调: 对比两棵树对应节点的子元素时，如果子元素形成一个列表，那么 React 会按顺序尝试匹配新旧两个列表的元素

React 引入了 key 这个特殊属性，当有子元素列表中的元素有这个属性时，React 会利用这个 key 属性值来匹配新旧列表中的元素，以减少插入元素时的性能损耗
:::

2. 触发协调的场景

- props 从组件外面传进来 不可变(immutable)
- state 活跃在组件内部 不可变(immutable)
- context 组件外面的 Context.Provider 提供数据，组件内部则可以消费 context 数据

### React Hooks

> React 函数组件中, 每一次 UI 的变化, 都是通过执行整个函数来完成的

> 函数组件: 当某个状态发生变化时, 我要做什么

#### 优点

- 逻辑复用
- 关注点分离
- Class 生命周期中需要耦合的事件却被分散到不同的生命周期，如设置订阅和取消订阅, 而完全不相关的代码却在同一个生命周期中，而**Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**，而并非强制按照生命周期划分

#### 使用规则

- 只能在函数组件的`顶级作用域使用`
  - Hooks 不能在 循环 条件判断 嵌套函数内执行, 必须是顶层
  - 按顺序被执行
- 只能在函数组件或其它 Hooks 中使用
  - 函数组件
  - 自定义 Hooks

#### useState 函数有维持状态的能力

- state 永远不要保存可以`通过计算得到值`, 容易造成一致性问题;
  - 从 props 传递过来的值
  - 从 URL 中读取的值
  - 从 cookie, localStorage 中读取的值
- 从 React 18 版本起，无论是在事件处理函数、异步回调，还是 setTimeout 里的多个 state 更新，默认都会被自动批处理，只触发一次重新渲染

```jsx
import React, { useState } from "react"

function Example() {
  // 调用 state 更新函数后, 组件的更新是异步的, 不会马上执行
  // React18 为更新 state 加入 自动批处理 功能, 多个 state 更新函数调用会被合并到一次重新渲染中
  // 创建一个保存 count 的 state，并给初始值 0
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

#### useEffect 执行副作用

useEffect 是每次组件 render 完后判断依赖并执行

在 React 中，大量行为都可以被称作副作用, 比如挂载、更新、卸载组件，事件处理，添加定时器，修改真实 DOM，请求远程数据，在 console 中打印调试信息，等等

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
  /* 省略 */
  return () => {
    /* 省略 */
  }
}, [status])
```

#### useLayoutEffect 布局副作用

1. `useEffect` 在浏览器渲染`完成后`执行
2. `useLayoutEffect` 在浏览器渲染`完成前`执行
3. `useLayoutEffect` 总是比 `useEffect` 先执行
4. 使用 `useLayoutEffect` 里的任务最好影响了 Layout
5. 最好优先使用 `useEffect`
6. 它的副作用执行时机一般早于 useEffect，是在真实 DOM 变更之后同步执行的

#### useMemo 缓存计算结果

如果某个数据是通过其它数据计算得到的，那么只有当用到的数据，也就是依赖的数据发生变化的时候，才应该需要重新计算

- 避免重新计算
- 避免子组件重复渲染
- 为工厂函数返回一个记忆化的计算值, 在两次渲染之前, 只有依赖值数组中的依赖值有变化时, 该 Hook 才会调用工厂函数重新计算, 将新的返回值记忆化并返回给组件

```js
// fn 产生所需数据的一个计算函数
// 通常来说，fn 会使用  deps 中声明的一些变量来生成一个结果，用来渲染出最终的 UI
useMemo(fn, deps)

// 执行成本较高的计算结果存入缓存，通过减少重复计算来提升组件性能
// 如果后续其他 state 发生了改变，但 num 的值保持 '40' 不变，则 useMemo 不会执行工厂函数，直接返回缓存中的 102334155 ，减少了组件性能损耗
const sum = useMemo(() => {
  const n = parseInt(num, 10)
  return fibonacci(n)
}, [num])

// 使用 userMemo 缓存计算的结果
const usersToShow = useMemo(() => {
  if (!users) return null
  return users.data.filter((user) => user.first_name.includes(searchKey))
}, [users, searchKey])
```

#### useCallback 缓存回调函数

- 对于原生的 DOM 节点，比如 button、input 等，我们是不用担心重新渲染的, 不写 useCallback, 也不会有影响
- 使用自定义组件, 回调函数应用到 useCallback 封装
- 会把作为第一个参数的回调函数返回给组件, 只要第二个参数依赖值数组的依赖项不改变, 就会保证一直返回同一个回调函数, 而不是新建一个函数, 保证了回调函数的闭包也是不变的, 相反, 依赖项改变, useCallbak 才会更新回调函数及其闭包

```js
function Counter() {
  const [count, setCount] = useState(0)
  // 只有当 count 发生变化时，我们才需要重新定一个回调函数
  const handleIncrement = useCallback(() => setCount(count + 1), [count])
  // ...
  return <button onClick={handleIncrement}>+</button>
}

// useCallback 是 useMemo 的一个马甲
const memoizedFunc = useCallback(() => {
  /*省略*/
}, [a, b])
const memoizedFunc = useMemo(() => {
  // 返回一个函数作为缓存结果
  return () => {
    // 在这里进行事件处理
  }
}, [dep1, dep2])
```

#### useRef 在多次渲染之间共享数据

- useRef 保存的数据一般是和 UI 的渲染无关的，因此当 ref 的值发生变化时，是不会触发组件的重新渲染的
- 保存某个 DOM 节点的引用 => 结合 React 的 ref 属性和 useRef 这个 Hook

```js
// useRef 可变值
const myRef = useRef(null)
// 读取可变值
const value = myRef.current
```

#### forwardRef

如果你的函数组件接受别人传过来的 `ref`, 必须把自己用 `forwardRef` 包起来

```js
function App() {
  const buttonRef = useRef(null)
  return (
    <div className='App'>
      <Button2 ref={buttonRef}>按钮</Button2>
    </div>
  )
}
// 由于 props 里面不包含 ref, 需要 forwardRef
const Button2 = React.forwardRef((props, ref) => {
  return <button className='red' ref={ref} {...props} />
})
```

#### useImperativeHandle

- 对 ref 进行 设置, 也就是 `setRef` 的意思, 用于自定义 ref

```js
function App() {
  const buttonRef = useRef(null)
  useEffect(() => {
    console.log(buttonRef.current)
  })
  return (
    <div className='App'>
      <Button2 ref={buttonRef}>按钮</Button2>
      <button
        className='close'
        onClick={() => {
          console.log(buttonRef)
          buttonRef.current.x()
        }}
      >
        x
      </button>
    </div>
  )
}

const Button2 = React.forwardRef((props, ref) => {
  const realButton = createRef(null)
  const setRef = useImperativeHandle
  setRef(ref, () => {
    return {
      x: () => {
        realButton.current.remove()
      },
      realButton: realButton,
    }
  })
  return <button ref={realButton} {...props} />
})
```

#### useContext 定义全局状态

Context 提供了一个方便在多个组件之间共享数据的机制

```js
// 1. 先创建一个上下文
const MyContext = React.createContext(initialValue)

// 2. Context.Provider 作为根组件
// 创建一个 Theme 的 Context
const ThemeContext = React.createContext(themes.light)
function App() {
  // 整个应用使用 ThemeContext.Provider 作为根组件
  return (
    // 使用 themes.dark 作为当前 Context
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  )
}

// 3. 消费上下文
const value = useContext(MyContext)
```

#### useReducer 更复杂的 useState

使用 `useReducer` 分 4 步走

- 创建初始值 `initialState`
- 创建所有操作 `reducer(state, action)`
- 使用 `useReducer(reducer, initialState)` 得到读写操作
- 调用`写 ({type: 'action'})`
- 总结: `useReducer 是复杂点的 useState`

```js
import React from "react"
// 1. 创建初始值
const initial = {
  n: 1,
}
/**
 * 2. 创建操作 reducer
 * state: 旧的状态
 * action: 动作
 */
const reducer = (state, action) => {
  if (action.type === "add") {
    return { n: state.n + action.number }
  } else if (action.type === "multi") {
    return { n: state.n * action.number }
  } else {
    throw new Error("unknown type")
  }
}

export default function App() {
  /**
   * 3. 是有 useReducer
   * reducer 所有操作
   * initial 初始值
   * return [state, dispatch] 读/写操作
   */
  const [state, dispatch] = React.useReducer(reducer, initial)
  // 4. 写入 action
  const onClickAdd = () => {
    dispatch({
      type: "add",
      number: 1,
    })
  }
  const onClickMulti = () => {
    dispatch({
      type: "multi",
      number: 2,
    })
  }
  return (
    <div>
      <h1>n: {state.n}</h1>
      <button onClick={onClickAdd}>add</button>
      <button onClick={onClickMulti}>multi</button>
    </div>
  )
}
```

#### 自定义 Hooks

- 声明一个名字以 `use` 开头的函数, 比如 useCounter, 这个函数在形式上和普通的 JavaScript 函数没有任何区别，你可以传递任意参数给这个 Hook，也可以返回任何值。
- 函数内部一定调用了其它的 Hooks, 可以是内置 Hooks, 也可以是其它自定义 Hooks.

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
```

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

不受控组件就是不受我们控制的组件 `ref`

```jsx
const com = () => {
  const inputRef = useRef(null)
  return <input type='text' ref={inputRef} />
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

不管是 React 还是 Vue，它们都不是 MVVM 框架，只是有借鉴 MVVM 的思路

- View 很简单，就是用户看到的视图
- Model 同样很简单，一般就是本地数据和数据库中的数据

1. `MVC`

`MVC` 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染。当用户有输入时，会通过控制器去更新模型，并且通知视图进行更新

MVC 有一个巨大的缺陷就是控制器承担的责任太大了，随着项目愈加复杂，控制器中的代码会越来越臃肿，导致出现不利于维护的情况

2. `MVVM`

引入了 `ViewModel` 的概念。`ViewModel` 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel

以 Vue 框架来举例，ViewModel 就是组件的实例, View 就是模板，Model 的话在引入 Vuex 的情况下是完全可以和组件分离的

通过 ViewModel 将视图中的状态和用户的行为分离出一个抽象，这才是 MVVM 的精髓

### 优先级

- 事件优先级: 按照用户事件的交互紧急程度，划分的优先级
- 更新优先级: 事件导致 React 产生的更新对象（update）的优先级（update.lane）
- 任务优先级: 产生更新对象之后，React 去执行一个更新任务，这个任务所持有的优先级
- 调度优先级: Scheduler 依据 React 更新任务生成一个调度任务，这个调度任务所持有的优先级

#### 任务优先级

任务优先级被用来区分多个更新任务的紧急程度，它由更新优先级计算而来

假设产生一前一后两个 update：

- 如果后者的任务优先级高于前者，那么会让 `Scheduler` 取消前者的任务调度；
- 如果后者的任务优先级等于前者，后者不会导致前者被取消，而是会复用前者的更新任务，将两个同等优先级的更新收敛到一次任务中；
- 如果后者的任务优先级低于前者，同样不会导致前者的任务被取消，而是在前者更新完成后，再次用 Scheduler 对后者发起一次任务调度。

意义：**保证高优先级任务及时响应，收敛同等优先级的任务调度**

任务优先级在即将调度的时候去计算，代码在`ensureRootIsScheduled`函数中：

```javascript
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  ...
  // 获取nextLanes，顺便计算任务优先级
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );

  // 获取上面计算得出的任务优先级
  const newCallbackPriority = returnNextLanesPriority();
  ...
}
```

通过调用 `getNextLanes` 去计算在本次更新中应该处理的这批 `lanes（nextLanes）`, `getNextLanes` 会调用 `getHighestPriorityLanes` 去计算任务优先级。

任务优先级计算的原理是这样：更新优先级（update 的 lane），它会被并入 root.pendingLanes，root.pendingLanes 经过 getNextLanes 处理后，挑出那些应该处理的 lanes，传入 getHighestPriorityLanes，根据 nextLanes 找出这些 lanes 的优先级作为任务优先级。

```js
function getHighestPriorityLanes(lanes: Lanes | Lane): Lanes {
  ...
  // 都是这种比较赋值的过程，这里只保留两个以做简要说明
  const inputDiscreteLanes = InputDiscreteLanes & lanes;
  if (inputDiscreteLanes !== NoLanes) {
    return_highestLanePriority = InputDiscreteLanePriority;
    return inputDiscreteLanes;
  }
  if ((lanes & InputContinuousHydrationLane) !== NoLanes) {
    return_highestLanePriority = InputContinuousHydrationLanePriority;
    return InputContinuousHydrationLane;
  }
  ...
  return lanes;
}
```

`return_highestLanePriority` 就是任务优先级，它有如下这些值，值越大，优先级越高，暂时只理解任务优先级的作用即可。

```js
export const SyncLanePriority: LanePriority = 17
export const SyncBatchedLanePriority: LanePriority = 16

const InputDiscreteHydrationLanePriority: LanePriority = 15
export const InputDiscreteLanePriority: LanePriority = 14

const InputContinuousHydrationLanePriority: LanePriority = 13
export const InputContinuousLanePriority: LanePriority = 12

const DefaultHydrationLanePriority: LanePriority = 11
export const DefaultLanePriority: LanePriority = 10

const TransitionShortHydrationLanePriority: LanePriority = 9
export const TransitionShortLanePriority: LanePriority = 8

const TransitionLongHydrationLanePriority: LanePriority = 7
export const TransitionLongLanePriority: LanePriority = 6

const RetryLanePriority: LanePriority = 5

const SelectiveHydrationLanePriority: LanePriority = 4

const IdleHydrationLanePriority: LanePriority = 3
const IdleLanePriority: LanePriority = 2

const OffscreenLanePriority: LanePriority = 1

export const NoLanePriority: LanePriority = 0
```

如果已经存在一个更新任务，ensureRootIsScheduled 会在获取到新任务的任务优先级之后，去和旧任务的任务优先级去比较，从而做出是否需要重新发起调度的决定，若需要发起调度，那么会去计算调度优先级。

## Fiber

一个 DOM 节点一定对应着一个 Fiber 节点，但一个 Fiber 节点却不一定有对应的 DOM 节点

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode
) {
  /** Fiber对应组件的类型 Function/Class/HostComponent(如div)/HostText(html中的纯文本)等 */
  this.tag = tag
  /** 组件中写的key */
  this.key = key
  /** createElement的第一个参数，ReactElement 上的 type */
  this.elementType = null
  /**
   * 对于组件，指组件对应的名称，如App
   * 对于html，则type等于tagName，如div、span、h1等
   * */
  this.type = null
  /**
   * 对于 rootFiber，存储FiberRoot，
   * 对于 classComponent，是对应的类实例，
   * 对于 dom Fiber，用来存储该Fiber对应的dom节点
   *  */
  this.stateNode = null

  /** 指向父级 */
  this.return = null
  /** 指向第一个child */
  this.child = null
  /** 指向第一个兄弟 */
  this.sibling = null
  /** 一般如果没有兄弟节点的话是0 当某个父节点下的子节点是数组类型的时候会给每个子节点一个 index，index 和 key 要一起做 diff */
  this.index = 0

  this.ref = null
  /** 产生更新的props */
  this.pendingProps = pendingProps
  /** 更新后的props */
  this.memoizedProps = null
  /** 产生更新的更新队列，是一个环状链表 */
  this.updateQueue = null
  /** 组件内部的状态 */
  this.memoizedState = null
  this.dependencies = null
  /** 模式，如ConcurrentRoot模式 */
  this.mode = mode

  // 副作用相关，如Placement、Update、Delection
  // 该fiber上的flags
  this.flags = NoFlags
  // 该fiber的子树上的flags
  this.subtreeFlags = NoFlags
  /** 子节点中要删除的fiber */
  this.deletions = null
  // --------调度优先级相关 start--------
  // 该fiber上的优先级
  this.lanes = NoLanes
  // 该fiber子节点上的 优先级
  this.childLanes = NoLanes
  // --------调度优先级相关 end--------

  // 双缓存树中的另一个，WIP.alternate = current;current.alternate = WIP
  this.alternate = null
}
```

## ReactElement, Fiber, DOM 三者的关系

1. [ReactElement 对象](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactElement.js#L126-L146)(type 定义在[shared 包中](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactElementType.js#L15))
   - 所有采用`jsx`语法书写的节点, 都会被编译器转换, 最终会以`React.createElement(...)`的方式, 创建出来一个与之对应的`ReactElement`对象
2. [fiber 对象](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiber.old.js#L116-L155)(type 类型的定义在[ReactInternalTypes.js](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactInternalTypes.js#L47-L174)中)
   - `fiber对象`是通过`ReactElement`对象进行创建的, 多个`fiber对象`构成了一棵`fiber树`, `fiber树`是构造`DOM树`的数据模型, `fiber树`的任何改动, 最后都体现到`DOM树`.
3. [DOM 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model): 文档对象模型
   - `DOM`将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合, 也就是常说的`DOM树`.
   - `JavaScript`可以访问和操作存储在 DOM 中的内容, 也就是操作`DOM对象`, 进而触发 UI 渲染.

注意:

- 开发人员能够控制的是`JSX`, 也就是`ReactElement`对象.
- `fiber树`是通过`ReactElement`生成的, 如果脱离了`ReactElement`,`fiber树`也无从谈起. 所以是`ReactElement`树(不是严格的树结构, 为了方便也称为树)驱动`fiber树`.
- `fiber树`是`DOM树`的数据模型, `fiber树`驱动`DOM树`

开发人员通过编程只能控制 ReactElement 树的结构, ReactElement 树驱动 fiber 树, fiber 树再驱动 DOM 树, 最后展现到页面上. 所以 fiber 树的构造过程, 实际上就是 ReactElement 对象到 fiber 对象的转换过程.

## 双缓冲技术(double buffering)

在全局变量中有`workInProgress`, 还有不少以`workInProgress`来命名的变量. `workInProgress`的应用实际上就是`React`的双缓冲技术(`double buffering`).

内存里会同时存在 2 棵`fiber树`:

- 其一: 代表当前界面的`fiber`树(已经被展示出来, 挂载到`fiberRoot.current`上). 如果是初次构造(`初始化渲染`), 页面还没有渲染, 此时界面对应的 fiber 树为空(`fiberRoot.current = null`).
- 其二: 正在构造的`fiber`树(即将展示出来, 挂载到`HostRootFiber.alternate`上, 正在构造的节点称为`workInProgress`). 当构造完成之后, 重新渲染页面, 最后切换`fiberRoot.current = workInProgress`, 使`重新指向代表当前界面的`fiber`树.

此处涉及到 2 个全局对象`fiberRoot`和`HostRootFiber`, 在[React 应用的启动过程](https://7kms.github.io/react-illustration-series/main/bootstrap)中有详细的说明.

用图来表述`double buffering`的概念如下:

1. 构造过程中, `fiberRoot.current`指向当前界面对应的`fiber`树.

![img](https://7kms.github.io/react-illustration-series/static/fibertreecreate1-progress.c1b57b3b.png)

2. 构造完成并渲染, 切换`fiberRoot.current`指针, 使其继续指向当前界面对应的`fiber`树(原来代表界面的 fiber 树, 变成了内存中).

![img](https://7kms.github.io/react-illustration-series/static/fibertreecreate2-complete.1375a2fa.png)

## setState 到底是同步还是异步

```js
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  lane: Lane,
  eventTime: number
) {
  if (lane === SyncLane) {
    // legacy或blocking模式
    if (
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      performSyncWorkOnRoot(root)
    } else {
      ensureRootIsScheduled(root, eventTime) // 注册回调任务
      if (executionContext === NoContext) {
        flushSyncCallbackQueue() // 取消schedule调度 ,主动刷新回调队列,
      }
    }
  } else {
    // concurrent模式
    ensureRootIsScheduled(root, eventTime)
  }
}
```

当`lane === SyncLane`也就是 legacy 或 blocking 模式中, 注册完回调任务之后(`ensureRootIsScheduled(root, eventTime)`), 如果执行上下文为空, 会取消 schedule 调度, 主动刷新回调队列`flushSyncCallbackQueue()`.

这里包含了一个热点问题(`setState到底是同步还是异步`)的标准答案:

- 如果逻辑进入`flushSyncCallbackQueue`(`executionContext === NoContext`), 则会**主动取消调度, 并刷新回调, 立即进入`fiber树`构造过程. 当执行`setState`下一行代码时, `fiber树`已经重新渲染了, 故`setState`体现为同步**.
- 正常情况下, 不会取消`schedule调度`. 由于`schedule调度`是通过`MessageChannel`触发(宏任务), 故体现为异步

## completeWork

completeWork 阶段主要做的事：

- 真实 DOM 节点的创建以及挂载
- DOM 属性的处理
- effectList 的收集
- 错误处理

## commitRoot

- before mutation：读取组件变更前的状态，针对类组件，调用 getSnapshotBeforeUpdate，让我们可以在 DOM 变更前获取组件实例的信息；针对函数组件，异步调度 useEffect。
- mutation：针对 HostComponent，进行相应的 DOM 操作；针对类组件，调用 componentWillUnmount；针对函数组件，执行 useLayoutEffect 的销毁函数。
- layout：在 DOM 操作完成后，读取组件的状态，针对类组件，调用生命周期 componentDidMount 和 componentDidUpdate，调用 setState 的回调；针对函数组件调度 useEffect

_before mutation 和 layout 针对函数组件的 useEffect 调度是互斥的，只能发起一次调度_

workInProgress 树切换到 current 树的时机是在 mutation 结束后，layout 开始前。这样做的原因是在 mutation 阶段调用类组件的 componentWillUnmount 的时候，还可以获取到卸载前的组件信息；在 layout 阶段调用 componentDidMount/Update 时，获取的组件信息是更新后的

## Scheduler 是什么，作用是什么

> Scheduler 是一个独立的包，不仅仅在 React 中可以使用。

何为调度？依据任务优先级来决定哪个任务先被执行。调度的目标是**保证高优先级任务最先被执行**

何为执行？Scheduler 执行任务具备一个特点：即**根据时间片去终止任务，并判断任务是否完成，若未完成则继续调用任务函数**。它只是去做任务的中断和恢复，而任务是否已经完成则要依赖 React 告诉它。Scheduler 和 React 相互配合的模式可以让 React 的任务执行具备异步可中断的特点

Scheduler 是一个**任务调度器**，会**根据任务的优先级进行调度**。 在有多个任务的情况下，它会先执行优先级高的任务。如果一个任务执行的时间过长，Scheduler 会中断当前任务，让出线程的执行权，在下一次再恢复执行未完成的任务，避免造成用户操作时界面的卡顿。

Scheduler 的调度和 React 的调度是两个完全不同的概念，React 的调度是协调任务进入哪种 Scheduler 的调度模式，它的调度并不涉及任务的执行，而 Scheduler 是调度机制的真正核心，它是实打实地去执行任务，没有它，React 的任务再重要也无法执行

### 为什么用 MessageChannel ，而不首选 setTimeout

> 如果当前环境不支持 MessageChannel 时，会默认使用 setTimeout

React Scheduler 使用 MessageChannel 的原因为：**生成宏任务**，实现：

1. **将主线程还给浏览器，以便浏览器更新页面**。
2. **浏览器更新页面后继续执行未完成的任务**。

- 选择 MessageChannel 的原因是因为**递归执行** setTimeout 会有**至少 4ms 的执行时差**，setInterval 同理
- 代码示例：MessageChannel 总会在 setTimeout 任务之前执行，且执行消耗的时间总会小于 setTimeout

```js
// setTimeout 的执行示例
var date1 = Date.now()
console.log("setTimeout 执行的时间戳1：", date1)
setTimeout(() => {
  var date2 = Date.now()
  console.log("setTimeout 执行的时间戳2：", date2)
  console.log("setTimeout 时差：", date2 - date1)
}, 0)

// messageChannel 的执行示例
var channel = new MessageChannel()
var port1 = channel.port1
var port2 = channel.port2
port1.onmessage = () => {
  var cTime2 = Date.now()
  console.log("messageChannel 执行的时间戳2:", cTime2)
  console.log("messageChannel 时差：", cTime2 - cTime1)
}
var cTime1 = Date.now()
console.log("messageChannel 执行的时间戳1:", cTime1)
port2.postMessage(null)
```

## memo 与 shouldComponentUpdate

`React.memo`和`PureComponent`作用类似，可以用作性能优化，`React.memo` 是高阶组件，函数组件和类组件都可以使用， `React.memo`只能对`props`的情况确定是否渲染，而`PureComponent`是针对`props`和`state`。

`React.memo` 接受两个参数，第一个参数原始组件本身，第二个参数，可以根据一次更新中`props`是否相同决定原始组件是否重新渲染。是一个返回布尔值，`true` 证明组件无须重新渲染，`false`证明组件需要重新渲染，这个和类组件中的`shouldComponentUpdate()`正好相反 。

React.memo: 第二个参数 返回 `true` 组件不渲染 ， 返回 `false` 组件重新渲染。shouldComponentUpdate: 返回 `true` 组件渲染 ， 返回 `false` 组件不渲染

## lazy

> React.lazy 和 Suspense 技术还不支持服务端渲染。如果想在使用服务端渲染的应用中使用，推荐 Loadable Components 这个库

`React.lazy`和`Suspense`配合一起用，有动态加载组件的效果。`React.lazy` 接受一个函数，这个函数需要动态调用 `import()`。它必须返回一个 `Promise` ，该 `Promise` 需要 `resolve` 一个 `default export` 的 `React` 组件。

## Suspense

何为`Suspense`, `Suspense` 让组件“等待”某个异步操作，直到该异步操作结束即可渲染。

用于数据获取的 `Suspense` 是一个新特性，可以使用 `<Suspense>` 以声明的方式来“等待”任何内容，包括数据。

## Children.map

`React.Children` 提供了用于处理 `this.props.children` 不透明数据结构的实用方法

**透明的结构：**

```jsx
class Text extends React.Component {
  render() {
    return <div>hello,world</div>
  }
}
function WarpComponent(props) {
  console.log(props.children)
  return props.children
}
function Index() {
  return (
    <div>
      <WarpComponent>
        <Text />
        <Text />
        <Text />
        <span>hello,world</span>
      </WarpComponent>
    </div>
  )
}
```

```js
function WarpComponent(props) {
  const newChildren = React.Children.map(props.children, (item) => item)
  console.log(newChildren)
  return newChildren
}
```

## Children.forEach

`Children.forEach`和`Children.map` 用法类似，`Children.map`可以返回新的数组，`Children.forEach`仅停留在遍历阶段。

```js
function WarpComponent(props) {
  React.Children.forEach(props.children, (item) => console.log(item))
  return props.children
}
```

## Children.count

`children` 中的组件总数量，等同于通过 `map` 或 `forEach` 调用回调函数的次数。对于更复杂的结果，`Children.count`可以返回同一级别子组件的数量

```jsx
function WarpComponent(props) {
  const childrenCount = React.Children.count(props.children)
  console.log(childrenCount, "childrenCount")
  return props.children
}
function Index() {
  return (
    <div style={{ marginTop: "50px" }}>
      <WarpComponent>
        {new Array(3)
          .fill(0)
          .map((item, index) =>
            new Array(2)
              .fill(1)
              .map((item, index1) => <Text key={index + index1} />)
          )}
        <span>hello,world</span>
      </WarpComponent>
    </div>
  )
}
```

## Hook 对象

```js
export type Hook = {
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null,
  next: Hook | null,
}

type Update<S, A> = {
  lane: Lane,
  priority?: ReactPriorityLevel,
  action: A,
  eagerState: S | null,
  eagerReducer: ((S, A) => S) | null,
  next: Update<S, A>,
}

type UpdateQueue<S, A> = {
  pending: Update<S, A> | null,
  dispatch: ((A) => mixed) | null,
  lastRenderedReducer: ((S, A) => S) | null,
  lastRenderedState: S | null,
}
```

属性解释:

1. `Hook`

- `memoizedState`: 内存状态, 用于输出成最终的`fiber`树
- `baseState`: 基础状态, 当`Hook.queue`更新过后, `baseState`也会更新.
- `baseQueue`: 基础状态队列, 在`reconciler`阶段会辅助状态合并.
- `queue`: 指向一个`Update`队列
- `next`: 指向该`function`组件的下一个`Hook`对象, 使得多个`Hook`之间也构成了一个链表.

1. `Hook.queue`和 `Hook.baseQueue`(即`UpdateQueue`和`Update`）是为了保证`Hook`对象能够顺利更新, 与上文`fiber.updateQueue`中的`UpdateQueue和Update`是不一样的(且它们在不同的文件)

`Hook`与`fiber`的关系:

在`fiber`对象中有一个属性`fiber.memoizedState`指向`fiber`节点的内存状态. 在`function`类型的组件中, `fiber.memoizedState`就指向`Hook`队列(`Hook`队列保存了`function`类型的组件状态).

## 组件的生命周期

### 挂载

当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

- [**`constructor()`**](https://zh-hans.reactjs.org/docs/react-component.html#constructor)
- [`static getDerivedStateFromProps()`](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
- [**`render()`**](https://zh-hans.reactjs.org/docs/react-component.html#render)
- [**`componentDidMount()`**](https://zh-hans.reactjs.org/docs/react-component.html#componentdidmount)

### 更新

当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：

- [`static getDerivedStateFromProps()`](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)
- [**`render()`**](https://zh-hans.reactjs.org/docs/react-component.html#render)
- [`getSnapshotBeforeUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](https://zh-hans.reactjs.org/docs/react-component.html#componentdidupdate)

### 卸载

当组件从 DOM 中移除时会调用如下方法：

- [**`componentWillUnmount()`**](https://zh-hans.reactjs.org/docs/react-component.html#componentwillunmount)

### 错误处理

当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：

- [`static getDerivedStateFromError()`](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromerror)
- [`componentDidCatch()`](https://zh-hans.reactjs.org/docs/react-component.html#componentdidcatch)

## 面试题目精选

### 虚拟 DOM

虚拟 DOM: 本质上就是一个 JS 对象, 通过一个对象来描述了每个 DOM 节点的特征, 并且通过虚拟 DOM 就能够完整的绘制出对应真实的 DOM

优点:

> 虚拟 DOM 设计的核心就是用高效的 js 操作, 来减少低性能的 DOM 操作, 以此来提升网页性能, 然后使用 diff 算法对比新旧虚拟 DOM, 针对差异之处进行重新构建更新视图, 以此来提高页面性能, 虚拟 DOM 这让我们更关注我们的业务逻辑而非 DOM 操作, 这一点即可大大提升我们的开发效率

- 虚拟 DOM 本质上就是个对象, 对其进行任何操作不会引起页面的绘制
- 一次性更新: 当页面频繁操作时, 不去频繁操作真实 DOM, 而是构建新的虚拟 DOM 对虚拟 DOM 进行频繁操作, 然后一次性渲染, 这将大大提高性能(因为操作 DOM 比操作 JS 代价更大, 后面有讲)
- 差异化更新: 当状态改变时, 构建新的虚拟 DOM, 然后使用 diff 算法对比新旧虚拟 DOM, 针对差异之处进行重新构建更新视图, 这样也能够大大提高页面性能
- 提高开发效率: 虚拟 DOM 本质上就是个对象, 相对于直接操作 DOM 来, 直接操作对象相对来说简单又高效
- 虚拟 DOM 的总损耗等于 虚拟 DOM 增删改 + diff 算法 + 真实 DOM 差异增删改 + 排版与重绘
- 真实 DOM 的总损耗是 真实 DOM 完全增删改 + 排版与重绘
- 性能方面: 使用虚拟 DOM, 能够有效避免真实 DOM 数频繁更新, 减少多次引起重绘与回流, 提高性能
- 跨平台: 虚拟 DOM 本质上就是用一种数据结构来描述界面节点, 借助虚拟 DOM, 带来了跨平台的能力, 一套代码多端运行, 比如: 小程序、React Native

缺点:

- 极致性能: 在一些性能要求极高的应用中, 虚拟 DOM 无法进行针对性的极致优化: 因为从虚拟 DOM 到更新真实 DOM 之间还需要进行一些额外的计算(比如 diff 算法), 而这中间就多了一些消耗, 肯定没有直接操作 DOM 来得快
- 首次渲染: 首次渲染大量 DOM 时, 需要将虚拟树转换为实际的 DOM 元素, 并插入到页面中, 这个过程需要额外的计算和操作, 可能会比直接操作实际 DOM 更慢
- 适用度: 虚拟 DOM 需要在内存中创建和维护一个额外的虚拟树结构, 用于表示页面的状态。这可能会导致一定的内存消耗增加, 特别是在处理大型或复杂的应用程序时, 所以虚拟 DOM 更适用于动态或频繁变化的内容, 而对于静态内容 (几乎不会变化的部分), 虚拟 DOM 的优势可能不明显, 因为它仍然需要进行比较和更新的计算

为什么操作 DOM 会 JS 代价更大

- 访问和修改 DOM 元素需要通过浏览器的底层接口提供的 API 来实现的, 与直接在内存中操作 JavaScript 对象相比, 通过浏览器接口进行 DOM 操作涉及到更多的层级和复杂性, 从而导致性能开销增加
- DOM 操作引起页面重新渲染和重排, 当对 DOM 元素进行修改时, 浏览器需要重新计算元素的布局和样式, 并重新渲染整个页面或部分页面。这个过程称为重排 (reflow) 和重绘 (repaint), 它对于页面的性能和响应时间有一定的影响, 增加了页面的负担和性能开销
- 批量操作: 将多个 DOM 操作合并成一个批量操作, 减少页面的重排和重绘次数
- 使用文档片段 (DocumentFragment): 将多个 DOM 元素的操作放在文档片段中, 然后一次性插入到页面中, 减少页面渲染的次数
- 缓存 DOM 查询结果: 避免多次查询同一个 DOM 元素, 将查询结果缓存在变量中以提高性能
- 使用事件委托: 将事件处理程序绑定在父元素上, 通过事件冒泡机制处理子元素的事件, 减少事件绑定的数量

### diff 算法

React 在执行 render 过程中会产生新的虚拟 DOM, 在浏览器平台下, 为了尽量减少 DOM 的创建, React 会对新旧虚拟 DOM 进行 diff 算法找到它们之间的差异, 尽量复用 DOM 从而提高性能; 所以 diff 算法主要就是用于查找新旧虚拟 DOM 之间的差异

传统 diff 算法是通过循环递归对树节点进行依次对比, 效率比低下, 算法复杂度达到 O(n^3), 而在 React 中针对该算法进行一个优化, 复杂度能达到 O(n)

**diff 策略**

1. tree 层级(同层级比较): 考虑到在实际 DOM 操作中需要跨层级操作的次数很少很少, 所以在进行 diff 操作时只会对 同一层级 进行比较, 这样只需要对树遍历一次就 OK 了, 如下图, react 会按同层级进行比较, 发现新树中 R 节点下没有了 A, 那么直接删除 A 在 D 节点下创建 A 以及下属所有节点
2. component 层级: 如果是同一个类型的组件, 则会继续往下 diff 运算, 如果不是一个类型组件, 那么将直接删除这个组件下的所有子节点, 然后创建新的 DOM, 如下图所示, 当 D 类型组件换成了 G 后, 即使两者的结构非常类似, 也会将 D 类型的组件删除再重新创建 G
3. element 层级: 是同一层级的节点的比较规则, 根据每个节点在对应层级的唯一 key 作为标识, 并且对于同一层级的节点操作只有 3 种, 分别为 INSERT_MARKUP(插入)、MOVE_EXISTING(移动)、REMOVE_NODE(删除)

:::tip
key 的值必须保证 唯一 且 稳定, 有了 key 属性后, 就可以与组件建立了一种对应关系, react 根据 key 来决定是销毁还是重新创建组件, 是更新还是移动组件

index 的使用存在的问题: 大部分情况下可能没有啥问题, 但是如果涉及到数据变更(更新、新增、删除), 这时 index 作为 key 会导致展示错误的数据, 其实归根结底, 使用 index 的问题在于两次渲染的 index 是相同的, 所以组件并不会重新销毁创建, 而是直接进行更新

:::

### Fiber

首先 React 组件的渲染主要经历两个阶段:

1. 调度阶段(Reconciler): 这个阶段 React 用新数据生成新的虚拟 DOM, 遍历虚拟 DOM, 然后通过 Diff 算法, 快速找出需要更新的元素, 放到更新队列中去
2. 渲染阶段(Renderer): 这个阶段 React 根据所在的渲染环境, 遍历更新队列, 将对应元素更新(在浏览器中, 就是更新对应的 DOM 元素)

对于调度阶段, 新老架构中有不同的处理方式:

- 早期 16 之前 React 在 diff 阶段是通过一个自顶向下递归算法, 来查找需要对当前 DOM 进行更新或替换的操作列表, 一旦开始, 会持续占用主线程, 很难被中断, 当虚拟 DOM 特别庞大的时候, 主线程就被长期占用, 页面的交互、布局、渲染会被停止, 造成页面的卡顿, 这里举个例子: 假设更新一个组件需要 1ms, 如果有 200 个组件要更新, 那就需要 200ms, 在这 200ms 的更新过程中, 浏览器唯一的主线程都在专心运行更新操作, 无暇去做任何其他的事情。想象一下，在这 200ms 内，用户往一个 input 元素中输入点什么，敲击键盘也不会获得响应，因为渲染输入按键结果也是浏览器主线程的工作，但是浏览器主线程被 React 占用，抽不出空，最后的结果就是用户敲了按键看不到反应，等 React 更新过程结束之后，那些按键会一下出现在 input 元素里，这就是所谓的界面卡顿。
- Fiber 是 React 16 中采用的新的调度处理方法, 主要目标是支持虚拟 DOM 的一个渐进式渲染

**Fiber 的设计思路**

1. Fiber: 是实现了一个基于优先级和 requestIdleCallback(执行的前提条件是当前浏览器处于空闲状态) 的一个循环 任务调度 算法, 他在渲染虚拟 DOM、 diff 阶段将任务拆分为多个小任务、这样的话就可以随时进行中止和恢复、同时又根据每个任务的优先级来执行任务
2. Fiber 是把 render/update 分片, 拆解成多个小任务来执行, 每次只检查树上部分节点, 做完此部分后, 若当前一帧 (16ms) 内还有足够的时间就继续做下一个小任务, 时间不够就停止操作, 等主线程空闲时再恢复
3. Fiber 是根据一个 fiber 节点 (VDOM 节点) 进行来拆分, 以 fiber node 为一个任务单元, 一个组件实例都是一个任务单元, 任务循环中, 每处理完一个 fiber node, 可以中断/挂起/恢复
4. 不同的任务分配不同的优先级, Fiber 根据任务的优先级来动态调整任务调度, 先做高优先级的任务
   - Immediate: 最高优先级, 会马上执行的不能中断
   - UserBlocking: 这一般是用户交互的结果, 需要及时反馈
   - Normal: 普通等级的, 比如网络请求等不需要用户立即感受到变化的
   - Low: 低优先级的, 这种任务可以延后, 但最后始终是要执行的
   - Idle: 最低等级的任务, 可以被无限延迟的, 比如 console.log()

由于 Fiber 采用了全新的调度方式, 任务的更新过程可能会被打断, 这意味着在组件更新过程中, render 及其下面几个生命周期函数可能会被调用多次, 所以这几个生命周期函数中不应出现副作用:

### React State

React 的更新机制: 异步 OR 同步

1. 在组件生命周期或 React 事件中, setState 是异步
2. 在 setTimeout/setInterval 或者原生 dom 事件中, setState 是同步

本质上来讲 setState 是同步的, 之所以出现异步的假象是因为要进行 状态合并 或者说是 批处理, 需要等生命周期、事件处理器执行完毕, 再批量修改状态! 当然在实际开发中, 在合成事件和生命周期函数里, 完全可以将其视为异步的

**setState 机制**

- 在 React 的 setState 函数实现中, 会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说
- isBatchingUpdates 默认是 false, 当 React 在执行生命周期或调用事件处理函数之前会将其设置为 true, 当执行完生命周期或者事件处理函数再改为 false 然后才会一起更新状态、更新组件, 所以整个过程看起来像异步的
- 当然实际开发中如果需要, 我们可以通过第二个参数 setState(partialState, callback) 中的 callback 拿到更新后的结果
- 在原生事件中, 由于不会调用 React 批处理机制, 所以 isBatchingUpdates 一直是 false, 所以如果调用 setState 会直接更新 this.state, 整个过程看起来就像是同步
- 那么在 setTimeout/setInterval 中又为什么看起来像同步的呢? 这里主要和微任务和宏任务有关, 如下是个演示代码, setTimeout 里面回调会等到, 主体代码执行完才会执行, 这时 isBatchingUpdates 已经是 false, 这时执行 setState 后会直接修改 this.state, 所以整个过程看起来就像是同步

**为什么要设计成异步(批处理)**

- 保证 state 和 props 的一致性
- props 必然异步, 因为只有因为当父组件重渲染了我们才知道 props 是啥
- 那么保证 props 和 state 一致性就很重要了, 因为实际开发中我们经常会将状态提升到父组件, 和兄弟组件进行共享, 这时如果 state 和 props 表现不一致那么这个操作很大概率就会引起一些 bug
- 所以 React 更愿意保证内部的一致性和状态提升的安全性, 而不总是追求代码的简洁性
- 提高性能: 在渲染前会有意地进行 等待, 直到所有在组件的事件处理函数内调用的 setState() 完成之后, 统一更新 state, 这样可以通过避免不必要的重新渲染来提升性能
- 更多的可能性: 当切换当新页面, 通过 setState 异步, 让 React 幕后渲染页面

### 高阶组件

本质上就是一个函数, 是一个参数为组件, 返回值为新组件的函数

1. 属性代理: 创建新组件并渲染传入的组件, 通过 props 属性来为组件添加值或方法
2. 反向继承: 通过继承方式实现, 继承传人的组件, 然后新增一些方法、属性

### 错误边界

- 默认情况下, 若一个组件在渲染期间 render 发生错误, 会导致整个组件树全部被卸载(页面白屏), 这当然不是我们期望的结果
- 部分组件的错误不应该导致整个应用崩溃, 为了解决这个问题, React 16 引入了一个新的概念 —— 错误边界
- 错误边界是一种 React 组件, 这种组件可以捕获发生在其子组件树任何位置的异常, 我们可以针对这些异常进行打印、上报等处理, 同时渲染出一个降级(备用) UI, 而并不会渲染那些发生崩溃的子组件树
- 白话就是, 被错误边界包裹的组件, 内部如果发生异常会被错误边界捕获到, 那么这个组件就可以不被渲染, 而是渲染一个错误信息或者是一个友好提示！避免发生整个应该崩溃现象

```js
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    // 发生错误, 更新 state
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 捕获到错误: 可以打印或者上报错误
    logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>深感抱歉, 系统出现错误!! 开发小哥正在紧急维护中.... </h1>
    }
    return this.props.children
  }
}

// 错误边界使用
;<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

1. 错误边界目前只在类组件中实现了, 没有在 hooks 中实现: 因为 Error Boundaries 的实现借助了 this.setState 可以传递 callback 的特性, useState 无法传入回调, 所以无法完全对标
2. 错误边界无法捕获以下四种场景中产生的错误: 仅处理渲染子组件期间的同步错误
   - 自身的错误
   - 异步的错误
   - 事件中的错误
   - 服务端渲染的错误
