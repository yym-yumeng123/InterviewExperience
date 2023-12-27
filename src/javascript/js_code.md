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
        if (source.hasOwnproperty(key)) {
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
  // this 就是函数
  const fn = this
  if (typeof fn !== "function") {
    throw new TypeError("bind must function")
  }
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

// reduce [] 也是无值就插入
const newArr = arr.reduce((prev, cur) => {
  prev.includes(cur) ? prev : prev.concat(cur)
}, [])
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
