---
outline: deep
title: "JavaScript"
# sidebar: false 左边侧边栏
# aside: left
---

## JavaScript

### 异步加载 JS

```js {4,7,10}
// 延迟脚本可选.表示脚本可以延迟到文档完全被解析和显示之后再执行; 有顺序
// 加载后续文档元素的过程将和 script.js 的加载并行进行（异步），
// 但 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。
<script defer src="" type="text/javascript" />
// 异步脚本可选,表示立即下载脚本,但不妨碍页面中其他操作; 不保证按照它们的先后顺与执行
// 加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）
<script async src="" type="text/javascript" />
// 浏览器会立即加载并执行指定的脚本，
// 立即 指的是在渲染该 script 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行
<script src="" type="text/javascript" />
```

### JS 数据类型

- 基本类型: `string number boolean undefined null symbol bigint`
  - `BigInt`: 这是一种可以表示任意大的整数的数据类型。BigInt 类型的数值在其末尾加 n
  - `null`: 这是一个表示无值或无对象的特殊值。它只有一个值，即 null
  - `undefined`: 表示未定义或未赋值的值。它只有一个值，即 undefined
  - `Symbol`: 这是一种唯一且不可变的数据类型，经常用作对象属性的键。
- 引用类型: `object`

### 为什么 `0.1 + 0.2 != 0.3`

JS 中`number`类型包括: 浮点和整数; 浮点数采用科学技术法来表示 $(1.4 * 10^9)$

JS 所采用的`IEEE 754`是二进制浮点数的算术标准, 这个标准里规定了 4 种浮点数算术方式, 这里选择 `float64`, 有 `64位 bit`, 包含了`一个比特符号位, 11个比特的有偏指数, 52个比特小数位`

十进制转化为二进制的算法是用十进制的小数乘以 2 直到没有了小数为止，所以十进制下的有些小数无法被精确地表示成二进制小数。而既然这里的浮点数是二进制，因此小数就会存在`精度丢失的问题`。

当我们使用加减法的时候，由于需要先对齐（也就是把指数对齐，过程中产生移位），再计算，所以这个精度会进一步丢失

### null undefined 区别

- `null` 是一个表示"无"的对象(空对象指针), 转为数值为 0
- `undefiend` 是一个表示"无"的原始值, 转为数值为 NaN

### 立即执行函数

- 可以形成一个作用域,和全局隔开,不会污染全局
- 另一方面也是防止命名冲突的影响

```js
;(function () {
  console.log("我是立即执行函数")
})()
```

### == 和 ===

- `==` 比较的是值, 类型会隐式转换, `别用这个, 一直使用全等`
- `===` 比较的值和类型都相等

### typeof instanceof 的作用和区别

- 作用都是类型识别
- `typeof` 操作符
  - 可以识别原始类型(null 除外)
  - 不能识别具体的对象类型(function 除外)
- `instanceof`
  - 能够识别对象类型
  - 不能识别原始类型

```js
typeof "1" // 'string'
typeof 1 // "number"
typeof true // "boolean"
typeof undefined // "undefined"
typeof null // "object"
[] instanceof Array // true
```

### void 0 和 undefined

- `undefined` 是一种数据类型, 唯一值 undefined, 声明一个变量但不赋值, 就是 undefined, 可以被重新赋值
- `void运算` 是 js 的一种运算符, 评估一个表达式但不返回值 `void(0) void 0 void(null)` 都会返回`undefined`, 任何情况都会返回 undefiend, 更安全

### JS 作用域

- 全局作用域和函数作用域
- ES6 引入 `let const` 关键字定义的变量具有块级作用域, 在 `{}`（花括号）内部定义的变量只能在该块内访问，超出该块则无法访问
- 作用域链: 内部可以访问外部作用域; 外部不能访问内部作用域;
- 就近原则
- 优先级: `声明变量 > 声明普通函数 > 参数 > 变量提升`
- 注意: JS 有变量提升 `var`
  1. 先看本层作用域有没有此变量 `注意变量提升`
  2. 有函数作用域, 没有 if 等作用域

```js
window.a = 10
function fun(a) {
  console.log(a) // 10
  var a = 10
  function a() {}
}
fun(100)
```

### JS 对象

- 对象是通过 `new` 操作符构建的, 对象间不相等
- 对象是引用类型, 引用类型 => 变量存储的是地址, 地址指向实际的值
- 对象的 key 都是字符串类型 (或者 symbol)
- 对象查找属性|方法: 对象本身找 -> 构造函数中找 -> 对象原型中找 -> 构造函数原型中找 -> 对象上一层原型 (原型链)

```js
;[1, 2, 3] === [1, 2, 3] // false
```

### new 操作符做了什么

1. 创建了一个空对象
2. 将空对象的原型, 指向于构造函数的原型
3. 将空对象作为构造函数的上下文(改变 this 指向)
4. 对构造函数有返回值的处理判断

```js
function create(fn, ...args) {
  const obj = {} // 创建空对象
  Object.setPrototypeOf(obj, fn.prototype) // 空对象的原型 指向fn的原型
  const result = fn.apply(this, args) // 空对象作为构造函数的上下文
  return result instanceof Object ? result : obj
}
```

### call apply bind 的区别

- `call | apply | bind` 都是为了改变函数体内部 this 的指向
- `call | apply` 接收的参数不同, apply 第二个参数接收数组
- `bind()`方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this
- bind 是返回对应函数，便于稍后调用; apply 、call 则是立即调用

### JS 函数

函数是什么?

编程里子程序: 一个或多个语句组成完成特点任务 相对独立

- 函数: 有返回值
- 过程: 无返回值
- 方法: 类或对象中

JS 中, 函数都有返回值, 只有函数或方法, 返回值由什么确定

- `调用时`输入的参数 params
- `定义时`的环境 env

```js
let x = 'x'
let a = '1'
function f1(x) return x + a

{
  let a = '2'
  f1('x') // 值为多少? x1
}

// a 是定义时的 a, 不是执行时的 a
```

### JS 闭包

如果在函数里面可以访问外面的变量, 那么 `这个函数 + 这些变量 = 闭包`

- 闭包是指有权访问另外一个函数作用域中的变量的函数; 闭包让开发者可以`从内部函数访问外部函数的作用域`
- 闭包特点
  - 能够让一个函数维持一个变量; 但并不能维持这个变量的值; 尤其变量的值会变化的时候
- 保护函数的私有变量不受外部的干扰
- 可以实现方法和属性的私有化
  - 函数作为返回值; 作为参数传递
- 闭包里面的变量会在内存, 不被及时销毁, 造成内存损耗
  - 解决方法是，在退出函数之前，将不使用的局部变量全部删除

```js{2,4}
function init() {
  var name = "Mozilla"; // name 是一个被 init 创建的局部变量
  function displayName() {
    // displayName() 是内部函数，一个闭包
    alert(name); // 使用了父函数中声明的变量
  }
  displayName();
}
init();

// 使用闭包解决 for 循环打印同一个值
var list = document.getElementsByTagName("li")
for(var i = 0; i < list.length; i++) {
  (function(i) {
    list[i].onClick = () => alert(i)
  })(i)
}
```

### this

- this 是参数, 就是一个隐式参数而已, 是 call 的第一个参数
- new 重新设计了 this
- 箭头函数不接受 this
- 调用了才能确定 this, 不调用就不知道 this 指向

```js
// 显式 this
fn.call(asThis, 1, 2)
fn.bind(asThis, 1, 2)()
fn.method.call(obj, "hi")

// 隐式 this, js 自动传 this, this 指向
fn(1, 2) // => fn.call(undefined, 1, 2)
obj.method("hi") // => obj.method.call(obj, 'hi')
array[0]("hi") // array[0].call(array, 'hi')

let length = 10
function fn() {
  console.log(this.length)
}

// this 题目
let obj = {
  length: 5,
  method(fn) {
    fn() // fn.call(undefined) window.length 和 let length 没有关系; window.length 和当前 iframe 有关
    arguments[0] // arguments.0.call(arguments) fn.call(arguments) 2 arguments 实参的长度
  },
}
obj.method(fn, 1)
```

### 柯里化 Currying

让所有函数只接受一个参数, 那么怎么支持两个参数

```js
const add = ({a, b} => a + b) // 用对象实现
add({a: 1, b: 2})

const add = a => b => a + b // 用闭包实现
add(1)(2)
```

柯里化一个函数: 把多参数函数, 变成单参数函数

```js
// 题目1: 三参数函数 add(1, 2, 3) 变成 curriedAdd(1)(2)(3)
cosnt curriedArr =
  a =>
    b =>
      c =>
        add(a, b, c)

// 题目2: 对1的升级
/**
 * addTwo 接受两个参数
 * addThree 接受三个参数
 * addFour 接受四个参数
 * 写出一个 currify 函数, 使得他们分别接受 2 3 4 次参数, 比如:
 * currify(addTwo)(1)(2) // 3
 * currify(addThree)(1)(2)(3) // 6
 * currify(addFour)(1)(2)(3)(4) // 10
 */
const addTwo = (a, b) => a + b
const addThree = (a, b, c) => a + b + c
const addFour = (a, b, c, d) => a + b + c + d
const currify = (fn, params = []) => {
  return (arg) => {
    const newParams = params.concat(arg)
    if(newParams.length === fn.length) {
      return fn(...newParams)
    } else {
      return currify(fn, newParams)
    }
  }
}

const currify = (fn, params = []) => {
  // 支持多个参数
  return (...args) => {
    if(params.length + args.length === fn.length) {
      return fn(...params, ...args)
    } else {
      return currify(fn, [...params, ...args])
    }
  }
}
```

### 高阶函数

把`函数作为参数`或者`返回值的函数`

JS 内置的高阶函数

- Function.prototype.bind
- Function.prototype.apply
- Function.prototype.call
- Array.prototype.sort
- Array.prototype.map
- etc.

```js
// 理解 js call 才能真正理解 js
// 推理
const bind = Function.prototype.bind
const f1 = function () {
  console.log("this")
  console.log(this)
  console.log("arguments")
  console.log(arguments)
}

const newF1 = f1.bind({ name: "yym" }, 1, 2, 3)

// 1. 假设我认同 obj.method(a) => obj.method.call(obj, a)
// 2. obj = f1; method = bind
const newF1 = f1.bind.call(f1)

// 3. 带入参数 a = {name: 'yym'} b,c,d = 1, 2, 3
/**
 * f1
 * this = {name: 'yym'}
 * arguments = [1, 2, 3]
 */
const newF1 = f1.bind.call(f1, { name: "yym" }, 1, 2, 3)

// f1.bind === Function.prototype.bind
// const bind = Function.prototype.bind
// 上面两句 f1.bind === bind
// f1.bind.call(f1, {name: 'yym'}, 1, 2, 3)

/**
 * 接受一个函数, this, 其它参数
 * 返回一个新的函数, 会调用 fn, 并传入 this 和其它参数
 */
bind.call(f1, { name: "yym" }, 1, 2, 3)
```

### JS 原型链

- 理解原型对象: 无论什么时候,只要创建了新函数, 就会有一组特定的规则为该函数创建一个 prototype 属性, 这个属性指向函数的原型对象, 默认情况下, 所有原型对象都会自动获得一个 constructor(构造函数)属性, 这个属性是指向 prototyp 属性所在的指针
- 原型: 对象可以共享属性和方法
- 实例化对象原型`__proto__`指向构造函数的`prototype`属性; `prototype`是函数才有的属性，而`__proto__`是每个对象都有的属性
- 什么是原型链?
  - 每个构造函数都有原型对象,每个对象都会有构造函数,每个构造函数的原型都是一个对象,那么这个原型对象也会有构造函数;
  - 那么这个原型对象的构造函数也会有原型对象; 这样就会形成一个链式的结构，称为原型链.

```js
arr.__proto__ === Array.prototype

function Person(name) {
  this.name = name
}
Person.prototype.sayName = function () {
  console.log("My name is :" + this.name)
}
// p 实例化对象原型 __proto__ 指向 Person 的 prototype 属性
var p = new Person("Hello")
p.sayName()
```

### 判断变量是不是数组

- `Array.isArray()`
- `instanceof` => `arr instanceof Array`
- `Object.prototype.toString.call(arr)`
- etc.

### JS sort()

- 对于数组的元素进行排序, 返回数组, 默认排序顺序根据字符串 `Unicode` 码点
- V8 引擎 sort 函数, 数量小于 10 使用 `InsertSort`, 大于 10 使用 `QuickSort`

```js
const arr = [1,2,34, 5, 5, '34', '35']
arr.sort()
arr.sort(function(a,b) => {
  return a - b
})
```

### 深拷贝和浅拷贝

1. 浅拷贝: 只复制引用, 未复制真正的值
2. 深拷贝: 复制真正的值

```js
// 浅拷贝
const arr = [1, 2, 3]
const arr1 = arr
const obj = { a: 1, b: 2 }
const obj1 = Object.assign(obj)

// 深拷贝
const obj2 = JSON.parse(JSON.stringify(obj))

// 我想要真正的值: 把源数据的每个值放到新的变量中
const newObj = {}
newObj[key] = obj[key]
```

### cookie 和 session

1. cookie 存储在浏览器端; session 存储在服务端;
2. cookie 以明文的方式存放在客户端, 安全性较低; session 存在于服务器中, 安全性较好
3. cookie 设置内容过多会增大报文体积, 影响传输效率; session 数据存储在服务器, 通过 cookie 传递 id, 不影响效率
4. 浏览器限制单个 cookie 保存数据不能超过 4k; session 存储在服务器无限制

### cookie localStorage sessionStorage

1. 都是在客户端存储数据
2. 有效期: local 持久化存储; session 浏览器关闭之前有效; cookie 可以设置过期时间
3. 大小: cookie 只有 4k; 其它两个存储 5M

## ES6+

### var let const

- 都可以声明变量
- 变量提升: var 声明的变量会提升; let/const 不会
- var 可以多次声明同一个变量; let/const 不行
- var/let 声明的变量可以再次赋值; const 常量不能重新赋值
- let/const 有块作用域; var 没有自己的作用域

### 普通函数和箭头函数

1. this 指向的问题
   - 箭头函数的 this 是在箭头函数定义时就决定的, 而且不可修改; 指向定义时, 外层第一个普通函数 this
2. 箭头函数不能 new
3. 箭头函数没有原型 prototype
4. 箭头函数没有 arguments

### find filter some every

- find 返回符合条件的第一个元素, 查找
- filter 返回新数组, 过滤
- some 元素里只要有一个元素满足条件为真, 就返回 true
- every 元素里所有元素都满足条件采薇真, 返回 true

### 宏任务和微任务

**Eventloop (事件循环)**

Eventloop: 状态变化的过程, 有哪几个阶段? 最后一个阶段再回到第一个阶段, 事件循环

1. timers
2. I/O callbacks
3. prepare
4. poll
5. check
6. close cb

我们只需了解

1. timer
   - timers 阶段会执行 `setTimeout 和 setInterval` 回调，并且是由 poll 阶段控制的
2. poll
   - 回到 timer 阶段执行回调
   - 执行 I/O 回调
3. check
   - check 阶段执行 `setImmediate`

`Node.js 的 EventLoop` 的几个阶段: `timers poll check`, 顺序是: timers -> poll -> check -> timers

```js
/**
 * 开启 eventloop
 * 执行 js
 *
 * 1. setTimeout 放入事件循环 timers 阶段
 * 2. poll 等待, 不到 1s 不执行 setTimeout
 * 3. check 阶段 也有个队列: setImmediate(fn)
 * 4. poll 等待看到 check 阶段有, 执行, 然后继续等待 1s 去执行 timers 阶段的 定时器
 * 5. 循环查看, 事件循环
 *
 * 大部分时间停留在 poll 阶段等待, setImmediate(fn)在check阶段, 先执行
 * */
setTimeout(fn, 1000)
setImmediate(fn2)
process.nextTick(fn3) // 当前阶段执行 马上执行
// fn3 fn2 fn
```

**宏任务、微任务**

- MacroTask 宏任务: setTimeout 放到 timers 阶段; setImmediate -> check 阶段
- MicroTask 微任务: process.nextTick -> 当前后面立即执行; `new Promise(fn)` 马上执行; await 把后面的转化为 promise.then()

```js
async function async1() {
  console.log(1)
  await async2() // async2.then(() => {console.log(2)}) 后面的都是 then 里面的
  console.log(2)
}

async function async2() {
  console.log(3)
}

async1()

new Promise(function (resolve) {
  console.log(4)
  resolve() // 决定执行哪个函数
}).then(function () {
  console.log(5)
})

// 1 3 4 2 5
```

### Promise

是异步编程的一种解决方案, 比传统的回调函数更强大

有三种状态: `pending、fulfilled、rejected`

一旦从等待状态变成为其他状态就永远不能更改状态了

```js
new Promise(function (reslove, reject) {})

// 制造一个成功 或失败
Promise.reslove(4) // 值为 4 的 promise
// 制造一个失败
Promise.reject(result)
// 等待全部成功, 才成功
Promise.all([Promise1, Promise2, ...PromiseN])
// 等待第一个状态改变
Promise.race(数组)
```

```js
// 自己写一个 Promise.allSettled
// 无论成功失败 都返回
Promise.allSettled([Promise1, Promise2, ...PromiseN])

// 参数是 promise, 无论 promise 成功失败, 再次返回一个 promise
task = () => new Promise((reslove, reject) => ) // promise 不会立即执行
x = promise => promise.then((value) => {status: 'ok', value}, (reason) => {status: 'not ok', reason})
Promise.all([x(promise1()), x(promise2()), x(promise3())]).then(v => console.log(v))

// =>
x = promiseList => promiseList.map(
  promise => promise.then((value) => {status: 'ok', value}, (reason) => {status: 'not ok', reason})
)
Promise.all([x(promise1(), promise2(), promise3())]).then(v => console.log(v))

// =>
Promise.allSettled2 = function(promiseList) {
  return Promise.all(x(promiseList))
}
Promise.allSettled2([promise1(), promise2(), promise3()]).then(v => console.log(v))
```

**应用场景**

1. 多次处理一个结果
2. 串行: 同一个请求, 多次请求, 后面的请求比前面的请求返回结果快 任务串行
   - 保证第一个请求结果出来 再返回第二个结果
   - 把任务放进队列, 完成一个再做下一个
3. 并行
   - Promise.all
   - Promise.allSettled
4. 实际应用中, 尽量将所有异步操作进行 Promise 的封装，方便其他地方调用, 放弃以前的 callback 写法
5. 尽量将 new Promise 的操作封装在内部，而不是在业务层去实例化

**Promise 错误处理**

- `Promise.then(s1, f1)`
- `Promise.then(s1).catch(f1)`
- 尽量通过 `catch()` 去捕获 Promise 异常，需要说明的是，一旦被 catch 捕获过的异常，将不会再往外部传递，除非在 catch 中又触发了新的异常
- 如果 catch 里面在处理异常时，又发生了新的异常，将会继续往外冒，这个时候我们不可能无止尽的在后面添加 catch 来捕获，所以 Promise 有一个小的缺点就是最后一个 catch 的异常没办法捕获

### async / await

- 优点: 就像在写同步代码
- 只能和 promise 配合, 是 `promise` 语法糖
- 为了兼容旧代码 `await(promise)`, 所以官方在前面强制加了一个 `async`, 没有实际意义, 和 await 配合
- 一般通过 `async await 来配合 Promise` 使用，这样可以让代码可读性更强，彻底没有"回调"的痕迹了

```js
// 一个函数如果加上 async ，那么该函数就会返回一个 Promise
async function test() {
  return "1"
}
console.log(test()) // -> Promise {<resolved>: "1"}

const fn = async () => {
  const temp = await makePromise()
  return temp + 1
}
```

- await 错误处理

```js
// try catch 比较丑
let res
try {
  res = await axios()
} catch (err) {
  if (err) {
    throw new Error()
  }
}
```

```js
// 使用 catch 来捕获 错误

// await 只关心成功, 失败交给 catch 捕获
awiat axios.get().catch(error => {})
```

- await 传染性

```js
console.log(1)
await console.log(2)
console.log(3) // await 下面的代码 变成异步了
// promise 同样有传染性 (同步变异步)
// 回调没有传染性
```

```js
// 题目:

let a = 0
let test = async () => {
  a = a + (await 10) // a+  先执行 a = 0
  console.log(a) // 异步
}
test()

console.log(++a) // 同步先打 1

// 1
// 10
```

```js
// 错误写法
async function getData() {
  // await 不认识后面的 setTimeout，不知道何时返回
  const data = await setTimeout(() => {
    return
  }, 3000)

  console.log("3 秒到了")
}
```

```js
// 正确写法
async function getData() {
  const data = await new Promise((reslove) => {
    setTimeout(() => {
      return
    }, 3000)
  })

  console.log("3 秒到了")
}
```

:::tip

- await 同一行后面的内容对应 Promise 主体内容，即同步执行的
- await 下一行的内容对应 then()里面的内容，是异步执行的
- await 同一行后面应该跟着一个 Promise 对象，如果不是，需要转换（如果是常量会自动转换）
- async 函数的返回值还是一个 Promise 对象
  :::
