---
outline: deep
title: "手写代码"
# sidebar: false 左边侧边栏
# aside: left
---

- 该技术要解决什么问题? why
- 怎么解决的 how
- 有什么优点
- 有什么缺点
- 如何解决这些缺点

### 手写节流

节流即`每隔一段时间就执行一次`，实现原理为设置一个定时器，约定 xx 毫秒后执行事件，如果时间到了，那么执行函数并重置定时器，和防抖的区别在于，防抖每次触发事件都重置定时器，而节流在定时器到时间后再清空定时器

考虑一个场景，滚动事件中会发起网络请求，但是我们并不希望用户在滚动过程中一直发起请求，而是隔一段时间发起一次，对于这种情况我们就可以使用节流。

```js
// 1. 计算当前时间与上次执行函数时间的间隔
// func是用户传入需要防抖的函数
// wait是等待时间
const throttle = (func, wait = 50) => {
  // 上一次执行该函数的时间
  let lastTime = 0
  return function (...args) {
    // 当前时间
    let now = +new Date()
    // 将当前时间和上一次执行函数时间对比
    // 如果差值大于设置的等待时间就执行函数
    if (now - lastTime > wait) {
      lastTime = now
      func.apply(this, args)
    }
  }
}

setInterval(
  throttle(() => {
    console.log(1)
  }, 500),
  1
)

// 2. 使用定时器
// 每隔一段时间就执行一次
function throttle(fn, wait) {
  let inThrottle // 是否处于节流限制时间内

  return function (...args) {
    // 跳出时间限制
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}
```

### 手写防抖

防抖，即`短时间内大量触发同一事件，只会执行一次函数`，实现原理为设置一个定时器，约定在 xx 毫秒后再触发事件处理，每次触发事件都会重新设置计时器，直到 xx 毫秒内无第二次操作，防抖常用于搜索框/滚动条的监听事件处理，如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费。

考虑一个场景，有一个按钮点击会触发网络请求，但是我们并不希望每次点击都发起网络请求，而是当用户点击按钮一段时间后没有再次点击的情况才去发起网络请求，对于这种情况我们就可以使用防抖。

```js
// 1. 停止触发事件n毫秒后执行回调函数
// func是用户传入需要防抖的函数
// wait是等待时间
const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer = null
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

// 2. 触发事件后立即执行回调函数, 但是触发后n毫秒内不会再执行回调函数, 如果 n 毫秒内触发了事件, 也会重新计时
function debounce(func, delay) {
  let timer = null

  return function (...args) {
    if (!timer) {
      func.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
    }, delay)
  }
}
```

### 手写 EventHub

```js
/**
 * ! API: .on(name, fn) .emit(name, data) .off(name)
 * @description 多个模块之间进行通信
 *
 * .on 订阅时: 我会把 name 作为 key 放进 cache: { name: }, 把事件推进 cache: {name: [fn, ...]}
 * .emit 发布时: 我看一下有没有被订阅, 如果被订阅, 循环执行 name 的 [fn], 没有被订阅, 就设为 [], 什么也不干
 */

class EventHub {
  // {'click': [fn1, fn2, ...], 'mouse': [fn3, fn4, ...]}
  cache = {}

  /**
   * 监听/注册
   * @param {我想接受什么东西} eventName
   * @param {接受这个东西干什么} fn
   */
  on(eventName, fn) {
    // 先看 cache 里面有没有 这个东西
    this.cache[eventName] = this.cache[eventName] || []
    this.cache[eventName].push(fn)
  }

  // 触发/发布
  emit(eventName, data) {
    if (this.cache[eventName] === undefined) return
    this.cache[eventName].forEach((fn) => fn(data))
  }

  // 销毁
  off(eventName, fn) {
    this.cache[eventName] = this.cache[eventName] || []
    const index = this.cache[eventName].indexOf(fn)

    if (index === -1) return
    this.cache[eventName].splice(index, 1) // 删除
  }
}

export default EventHub
```

### 手写 JS 深拷贝

- 深拷贝拷贝的是值, 不是引用, 修改 b, 不会修改 a
- `JSON.parse(JOSN.stringify())` JSON 的序列化和反序列化可以实现深拷贝
  - 不支持 function
  - 不支持 undefined
  - 不支持 Date
  - 不支持 RegExp
  - json 不支持的都不支持
- 基本数据类型都是深拷贝

```js
// 缓存
const cache = []
function deepClone(source) {
  // 判断是否是 Object
  if (source instanceof Object) {
    let cacheDist = findCache(source)
    if (cacheDist) {
      // 是环
      return cacheDist
    } else {
      let dist
      if (source instanceof Array) {
        // 是数组
        dist = new Array()
      } else if (source instanceof Function) {
        // 是函数
        dist = function () {
          return source.apply(this, arguments)
        }
      } else if (source instanceof RegExp) {
        // 是正则 /hi\d+/gi  .source 获取 // 里面的数据 .flags 获取 gi
        dist = new RegExp(source.source, source.flags)
      } else if (source instanceof Date) {
        // 是日期
        dist = new Date(source)
      } else {
        // 是个普通对象
        dist = new Object()
      }
      cache.push([source, dist])
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          dist[key] = deepClone(source[key])
        }
      }
      return dist
    }
  }

  return source
}

// 环检测
function findCache(source) {
  for (let i = 0; i < cache.length; i++) {
    if (cache[i][1] === source) {
      return cache[i][1]
    }
  }
  return undefined
}
```

### 手写 Call

- 不传入第一个参数, 那么上下文默认为 `window`
- 改变了 `this` 指向, 让新的对象可以执行该函数, 并能接受参数

```js
Function.prototype.call = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // 用户不传 context 就是 window
  context = context || window
  // 将this绑定到context[fn]上，即this指向调用函数所在对象
  context.fn = this

  // 执行该函数
  cosnt args = [...argumetns].slice(1)
  const result = context.fn(...args)
  // 删除
  delete context.fn
  return result
}
```

### 手写 Apply

- apply() 方法调用一个具有给定 this 值的函数，以及作为一个数组提供的参数。

```js
Function.prototype.Apply = function (context, arr) {
  if (typeof this !== "function") {
    throw new TypeError("Error")
  }
  context = context || window
  context.fn = this
  // 判断参数是否为数组
  let result
  if (Array.isArray(arr)) {
    result = context.fn(...arr)
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```

### 手写 Bind

- bind 位于 Function.prototype 上

```js
// ES6 语法
function bind(asThis, ...args) {
  // this 就是函数
  const fn = this
  if (typeof fn !== "function") {
    throw new TypeError("bind must function")
  }
  return function (...innerargs) {
    return fn.call(asThis, ...args, ...innerargs)
  }
}

// 支持 new
function new_bind(asThis, ...args) {
  if (typeof fn !== "function") {
    throw new TypeError("bind must function")
  }
  // this 就是函数
  const fn = this
  function resultFn(...innerargs) {
    // new fn 和 普通的调用区别是 {}.__proto__ === fn.prototype
    return fn.call(
      resultFn.prototype.isPrototypeOf(this) ? this : asThis,
      ...args,
      ...innerargs
    )
  }

  resultFn.prototype = fn.prototype
  return resultFn
}

if (!Function.prototype.bind) {
  Function.prototype.bind = bind
}
```

### 手写 Promise

- 为了解决 callback 回调地狱
- 优点: 把异步代码改成同步的写法; 消灭 if(err)
- 写起来比较麻烦

Promise 完整 API

- Promise 是一个类
- 类方法: `all/allSettled/race/reject/resolve`
- 对象属性: `then/finally/catch`
- 对象内部属性: `state = pending | fulfilled | rejected`

```js
class Promise2 {
  state = "pending";
  callbacks = [];

  static resolve(data){
    return new Promise2((resolve,reject)=>{
      resolve(data);
    })
  }

  static reject(reason){
    return new Promise((resolve,reject)=>{
      reject(reason);
    })
  }

  private resolveOrReject(state, data, i) {
    if (this.state !== "pending") return;
    this.state = state;
    nextTick(() => {
      // 遍历 callbacks，调用所有的 handle[0]
      this.callbacks.forEach(handle => {
        if (typeof handle[i] === "function") {
          let x;
          try {
            x = handle[i].call(undefined, data);
          } catch (e) {
            return handle[2].reject(e);
          }
          handle[2].resolveWith(x);
        }
      });
    });
  }

  resolve(result) {
    this.resolveOrReject("fulfilled", result, 0);
  }
  reject(reason) {
    this.resolveOrReject("rejected", reason, 1);
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("我只接受函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed?, fail?) {
    const handle = [];
    if (typeof succeed === "function") {
      handle[0] = succeed;
    }
    if (typeof fail === "function") {
      handle[1] = fail;
    }
    handle[2] = new Promise2(() => {});
    this.callbacks.push(handle);
    // 把函数推到 callbacks 里面
    return handle[2];
  }
  resolveWithSelf() {
    this.reject(new TypeError());
  }
  resolveWithPromise(x) {
    x.then(
      result => {
        this.resolve(result);
      },
      reason => {
        this.reject(reason);
      }
    );
  }
  private getThen(x) {
    let then;
    try {
      then = x.then;
    } catch (e) {
      return this.reject(e);
    }
    return then;
  }
  resolveWithThenable(x) {
    try {
      x.then(
        y => {
          this.resolveWith(y);
        },
        r => {
          this.reject(r);
        }
      );
    } catch (e) {
      this.reject(e);
    }
  }
  resolveWithObject(x) {
    let then = this.getThen(x);
    if (then instanceof Function) {
      this.resolveWithThenable(x);
    } else {
      this.resolve(x);
    }
  }
  resolveWith(x) {
    if (this === x) {
      this.resolveWithSelf();
    } else if (x instanceof Promise2) {
      this.resolveWithPromise(x);
    } else if (x instanceof Object) {
      this.resolveWithObject(x);
    } else {
      this.resolve(x);
    }
  }
}

// Promise.prototype.catch 用来捕获 promise 的异常，就相当于一个没有成功的 then
Promise2.prototype.catch = function (errCallback) {
  return this.then(null, errCallback)
}

// 无论成功还是失败如何都会执行的意思
// 如果返回一个 promise 会等待这个 promise 也执行完毕。
// 如果返回的是成功的 promise，会采用上一次的结果；
// 如果返回的是失败的 promise，会用这个失败的结果，传到 catch 中
Promise2.prototype.finally = function (callback) {
  return this.then(
    (value) => {
      return Promise2.reslove(callback()).then(() => value)
    },
    (reason) => {
      return Promise2.reslove(callback()).then(() => {
        throw reason
      })
    }
  )
}

// promise.all 是解决并发问题的，多个异步并发获取最终的结果（如果有一个失败则失败)
Promise2.all = function (values) {
  if (!Array.isArray(values)) {
    const type = typeof values
    return new TypeError(`TypeError: ${type} ${values} is not iterable`)
  }

  return new Promise((resolve, reject) => {
    let resultArr = []
    let orderIndex = 0
    const processResultByKey = (value, index) => {
      resultArr[index] = value
      if (++orderIndex === values.length) {
        resolve(resultArr)
      }
    }
    for (let i = 0; i < values.length; i++) {
      let value = values[i]
      if (value && typeof value.then === "function") {
        value.then((value) => {
          processResultByKey(value, i)
        }, reject)
      } else {
        processResultByKey(value, i)
      }
    }
  })
}

// Promise.race 用来处理多个请求，采用最快的（谁先完成用谁的）
Promise2.race = function (promises) {
  return new Promise((resolve, reject) => {
    // 一起执行就是for循环
    for (let i = 0; i < promises.length; i++) {
      let val = promises[i]
      if (val && typeof val.then === "function") {
        val.then(resolve, reject)
      } else {
        // 普通值
        resolve(val)
      }
    }
  })
}




function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}
```

## 数组

### JS 数组去重

```js
var arr = [1, 2, 3, 4, 5, 1]
// 1. new Set
[...new Set(arr)]

// 2. for indexOf
var newArr = []
for(let i = 0; i < arr.length; i++) {
  if(newArray.indexOf(arr[i]) === -1) {
    newArr.push(arr[i])
  }
}

// 3. reduce [] 也是无值就插入
const newArr = arr.reduce((prev, cur) =>
  prev.includes(cur) ? prev : prev.concat(cur)
, [])

// 4. filter
const newArr = arr.filter((value, index, self) => self.indexOf(value) === index)
```

### 多维数组的最大值

```js
// 大数组包含多个小数组, 找到每个小数组的最大值, 串联起来, 形成一个新数组
const arr = [
  [4, 5, 1, 3],
  [12, 27, 36],
  [1000, 800, 1],
]

arr.forEach((item, index) => {
  newArr.push(Math.max(...item))
})
```

### 多维数组拍平

```js
function flatten1(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten1(cur) : cur)
  }, [])
}

function flatten2(arr) {
  let newArr = []
  for (const item of arr) {
    newArr = newArr.concat(Array.isArray(item) ? flatten2(item) : item)
  }
  return newArr
}

function flatten3(arr) {
  while (arr.some(Array.isArray)) arr = [].concat(...arr)
  return arr
}

arr.flat(Infinity)

const arr = [1, [2, 3, 4], [5, [6, [7, [8]]]]]

console.log(flatten1(arr))
console.log(flatten2(arr))
console.log(flatten3(arr))
```

### 原地打乱数组（数组洗牌）

```js
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // 生成随机索引
    const j = Math.floor(Math.random() * i)

    ;[array[i], array[j]] = [array[j], array[i]] // 交换当前位置的元素和随机位置的元素
  }

  return array
}
```

## 字符串

### 一个字符串中出现次数最多的字符, 统计次数

```js
const str = "aaabbbbccccccdddeeeeeeeeee"
const obj = {}

// 得到一个 map
for (let i = 0; i < str.length; i++) {
  let char = str.charAt(i)
  obj[char] ? obj[char]++ : (obj[char] = 1)
}
// 循环 map, 得到最大的值
let max = 0
for (const key in obj) {
  if (max < obj[key]) {
    max = obj[key]
  }
}
```

### 找出字符串中不含有重复字符的 最长子串 的长度

```js
var lengthOfLongestSubstring = function (s) {
  let arr = []
  let max = 0
  for (let i = 0, len = s.length; i < len; ++i) {
    const sameIndex = arr.findIndex((item) => item === s[i])
    arr.push(s[i])
    if (sameIndex > -1) {
      arr = arr.splice(sameIndex + 1)
    }
    max = Math.max(arr.length, max)
  }
  return max
}
```

### 给定一个字符串，判定其能否排列成回文串

```js
var canPermutePalindrome = function (s) {
  const set = new Set()
  s.split("").forEach((key) => {
    if (set.has(key)) {
      set.delete(key)
    } else {
      set.add(key)
    }
  })
  return set.size <= 1
}
```

## 递归

- 尾递归优化
- 记忆函数

```js
// 用迭代代替递归, 尾递归
f = (n) => f_inner(2, n, 1, 0)

f_inner = (start, end, prev1, prev2) =>
  start === end ? prev1 + prev2 : f_inner(start + 1, end, prev1 + prev2, prev1)
```

```js
// 所有递归都可以改成循环
f = (n) => {
  let arr = [0, 1]
  for (let i = 0; i <= n - 2; i++) {
    arr[i + 2] = arr[i + 1] + arr[i]
  }
  return arr[arr.length - 1]
}
```

### 阶乘

```js
/**
 * 先递 后归
 * 4 * factorial(3)
 * 4 * (3 * factorial(2))
 * 4 * (3 * (2 * factorial(1)))
 * 4 * (3 * (2 * 1))
 * 4 * (3 * 2)
 * 4 * 6
 */
const factorial = (n) => {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}
factorial(4)

// 尾递归优化
```

### 斐波那契

```js
/**
 * fibonacci(2) + fibonacci(3)
 * (fibonacci(0) + fibonacci(1)) + (fibonacci(1) + fibonacci(2))
 * (0 + 1) + (1 + (fibonacci(0) + fibonacci(1))
 * 1 + (1 + (0 + 1))
 * 3
 */
const fibonacci = (n) => {
  if (n === 0) return 0
  if (n === 1) return 1
  return fibonacci(n - 1) + fibonacci(n - 2)
}
fibonacci(4)

/**
 * 当前项基于前两项
 * f(4) = f(2, 4, 1, 0) 1, 0 是 2 的前两位
 *        f(3, 4, 1, 1) 1, 1 是 3 的前两位
 *        f(4, 4, 2, 1) 2, 1 是 4 的前两位
 */
```

## 获取 js 数据类型

```js
function getType(target) {
  return Object.prototype.toString
    .call(target)
    .replace(/\[object (.*?)\]/, "$1")
    .toLowerCase()
}

console.log(getType()) // undefined
console.log(getType(null)) // null
console.log(getType(1)) // number
console.log(getType("baozou")) // string
console.log(getType(true)) // boolean
console.log(getType(Symbol("baozou"))) // symbol
console.log(getType({})) // object
console.log(getType([])) // array
```

## 二分查找

```js
function binarySearch(arr, target) {
  let i = 0,
    j = arr.length - 1

  while (i <= j) {
    const midIndex = (i + j) >> 1
    const midValue = arr[midIndex]

    if (target === midValue) {
      return midIndex
    } else if (target < midValue) {
      j = midIndex - 1
    } else {
      i = midIndex + 1
    }
  }

  return -1
}

console.log(binarySearch([-1, 0, 3, 5, 9, 12], 9)) // 4
console.log(binarySearch([-1, 0, 3, 5, 9, 12], 1)) // -1
```

## 根据 name 获取 url 上的 search

```js
function getQueryByName(name) {
  const regExp = new RegExp(`[?&]${name}=([^&]*)(&|$)`)
  const match = location.search.match(regExp)
  return match ? decodeURIComponent(match[1]) : null
}

function getQueryByName1(name) {
  const searchParams = new URLSearchParams(location.search)
  return searchParams.get(name)
}

//https://www.baidu.com/?name=%E6%9A%B4%E8%B5%B0&sex=%E7%94%B7

console.log(getQueryByName("name")) // 暴走
console.log(getQueryByName("sex")) // 男
console.log(getQueryByName1("name")) // 暴走
console.log(getQueryByName1("sex")) // 男

console.log(getQueryByName("age")) // null
console.log(getQueryByName1("age")) // null
```

## 获取当前日期 (年-月-日 时:分:秒)

```js
function formatDateTime(currentDate) {
  // 获取年、月、日、时、分、秒
  const year = currentDate.getFullYear()
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0") // 月份从0开始，需要加1，并补零
  const day = currentDate.getDate().toString().padStart(2, "0") // 补零
  const hours = currentDate.getHours().toString().padStart(2, "0")
  const minutes = currentDate.getMinutes().toString().padStart(2, "0")
  const seconds = currentDate.getSeconds().toString().padStart(2, "0")
  // 格式化日期时间字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

console.log(formatDateTime(new Date())) // 输出格式化后的日期时间字符串
```

## 实现一个 once 函数，传入函数参数只执行一次

```js
function once(fn) {
  let called = false // 记录函数是否被调用

  return (...args) => {
    if (!called) {
      called = true
      return fn(...args)
    }
  }
}

// 使用示例
const doSomethingOnce = once(function () {
  console.log("This will only be executed once.")
})

doSomethingOnce() // 打印 "This will only be executed once."
doSomethingOnce() // 这次不会执行
```

## 实现一个私有变量，用 get 、set 可以访问，不能直接访问

```js
const privateName = Symbol()

class Person {
  constructor(name) {
    // 使用 symbol 作为属性名
    this[privateName] = name
  }

  getName() {
    return this[privateName]
  }

  setName(name) {
    this[privateName] = name
  }
}

const myPerson = new Person("yym")

console.log(myPerson.getName()) // 通过 get 方法访问私有变量 输出 yym
myPerson.setName("sam") // 通过 set 方法修改私有变量
console.log(myPerson.getName()) // 输出: "sam"
```

## 原生的 ajax 封装成 promise

```js
function ajax(url, method, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        reslove(xhr.responseText)
      } else {
        reject(xhr.statusText)
      }
    }

    xhr.onerror = () => reject(xhr.statusText)

    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      xhr.send(JSON.stringify(data))
    } else {
      xhr.send()
    }
  })
}

// 使用示例
ajax("https://jsonplaceholder.typicode.com/posts/1", "GET")
  .then(function (response) {
    console.log("Success:", response)
  })
  .catch(function (error) {
    console.error("Error:", error)
  })
```

## 实现 Sleep 效果

```js
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      reslove()
    }, time)
  })
}

;(async () => {
  await sleep(3000)
  console.log("yym")
})()
```

## 实现图片下载功能

```js
function downloadImage(src, imgName){
    let image = new Image();
    image.src = src;
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function() {
      let c = document.createElement("canvas");
      c.width = image.width;
      c.height = image.height;
      c.getContext("2d").drawImage(image, 0, 0, image.width, image.height);
      let a = document.createElement("a");
      a.download = imgName;
      a.href = c.toDataURL("image/png");
      a.click();
    }​
  }
```

## 算法题

### 青蛙爬台阶

```js
// 一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 n 级的台阶总共有多少种跳法
function numWats(n) {
  if (n <= 1) return 1
  if (n <= 2) return 2

  return numWays(n - 1) + numWays(n - 2)
}
```

### 反转一个链表

```js
const node = {
  val: "",
  next: "",
}

var reverseList = function (head) {
  if (!head) {
    return head
  }

  let pre = null
  let cur = head

  while (cur) {
    const { next } = cur
    cur.next = pre
    pre = cur
    cur = next
  }

  return pre
}
```

### 实现一个全排列

给定的数组，生成包含数组中所有元素的所有可能排列的过程。每个排列都是数组中元素的不同排列顺序。例如，对于数组 [1, 2, 3] 的全排列包括:

- 123 132 213 231 321 312

```js
function permute(arr) {
  const result = [] // 用于存储生成的全排列

  function backtrack(subarr, remaining) {
    // 如果没有剩余元素，当前排列就是一个全排列
    if (remaining.length === 0) {
      result.push(subarr.slice()) // 将当前排列添加到结果数组
    } else {
      for (let i = 0; i < remaining.length; i++) {
        subarr.push(remaining[i]) // 将当前元素添加到排列
        const newRemaining = [
          ...remaining.slice(0, i),
          ...remaining.slice(i + 1),
        ] // 生成剩余元素的新数组
        backtrack(subarr, newRemaining) // 递归生成剩余元素的排列
        subarr.pop() // 回溯，移除刚添加的元素，以尝试其他排列方式
      }
    }
  }

  // 调用回溯函数开始生成全排列
  backtrack([], arr)
  return result // 返回所有生成的全排列
}

const inputArray = [1, 2, 3]
const permutations = permute(inputArray)
console.log(permutations)
```
