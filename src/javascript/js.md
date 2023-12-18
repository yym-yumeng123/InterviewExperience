# JavaScript

## 异步加载 JS

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

## JS 数据类型

- 基本类型: `string number boolean undefined null symbol bigint`
  - `BigInt`: 这是一种可以表示任意大的整数的数据类型。BigInt 类型的数值在其末尾加 n
  - `null`: 这是一个表示无值或无对象的特殊值。它只有一个值，即 null
  - `undefined`: 表示未定义或未赋值的值。它只有一个值，即 undefined
  - `Symbol`: 这是一种唯一且不可变的数据类型，经常用作对象属性的键。
- 引用类型: `object`

## 为什么 `0.1 + 0.2 != 0.3`

JS 中`number`类型包括: 浮点和整数; 浮点数采用科学技术法来表示 $(1.4 * 10^9)$

JS 所采用的`IEEE 754`是二进制浮点数的算术标准, 这个标准里规定了 4 种浮点数算术方式, 这里选择 `float64`, 有 `64位 bit`, 包含了`一个比特符号位, 11个比特的有偏指数, 52个比特小数位`

十进制转化为二进制的算法是用十进制的小数乘以 2 直到没有了小数为止，所以十进制下的有些小数无法被精确地表示成二进制小数。而既然这里的浮点数是二进制，因此小数就会存在`精度丢失的问题`。

当我们使用加减法的时候，由于需要先对齐（也就是把指数对齐，过程中产生移位），再计算，所以这个精度会进一步丢失

## null undefined 区别

- `null` 是一个表示"无"的对象(空对象指针), 转为数值为 0
- `undefiend` 是一个表示"无"的原始值, 转为数值为 NaN

## 立即执行函数

- 可以形成一个作用域,和全局隔开,不会污染全局
- 另一方面也是防止命名冲突的影响

```js
;(function () {
  console.log("我是立即执行函数")
})()
```

## == 和 ===

- `==` 比较的是值, 类型会隐式转换, `别用这个, 一直使用全等`
- `===` 比较的值和类型都相等

## typeof instanceof 的作用和区别

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

## void 0 和 undefined

- `undefined` 是一种数据类型, 唯一值 undefined, 声明一个变量但不赋值, 就是 undefined, 可以被重新赋值
- `void运算` 是 js 的一种运算符, 评估一个表达式但不返回值 `void(0) void 0 void(null)` 都会返回`undefined`, 任何情况都会返回 undefiend, 更安全

## JS 作用域

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

## JS 对象

- 对象是通过 `new` 操作符构建的, 对象间不相等
- 对象是引用类型, 引用类型 => 变量存储的是地址, 地址指向实际的值
- 对象的 key 都是字符串类型 (或者 symbol)
- 对象查找属性|方法: 对象本身找 -> 构造函数中找 -> 对象原型中找 -> 构造函数原型中找 -> 对象上一层原型 (原型链)

```js
[1, 2, 3] === [1, 2, 3] // false
```

## new 操作符做了什么

1. 创建了一个空对象
2. 将空对象的原型, 指向于构造函数的原型
3. 将空对象作为构造函数的上下文(改变this指向)
4. 对构造函数有返回值的处理判断

```js
function create(fn, ...args) {
  const obj = {} // 创建空对象
  Object.setPrototypeOf(obj, fn.prototype) // 空对象的原型 指向fn的原型
  const result = fn.apply(this, args) // 空对象作为构造函数的上下文
  return result instanceof Object ? result : obj
}
```

## call apply bind 的区别

- `call | apply | bind` 都是为了改变函数体内部 this 的指向
- `call | apply` 接收的参数不同, apply 第二个参数接收数组
- `bind()`方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this
- bind 是返回对应函数，便于稍后调用; apply 、call 则是立即调用 

## JS 闭包

- 闭包是指有权访问另外一个函数作用域中的变量的函数; 闭包让开发者可以`从内部函数访问外部函数的作用域`
- 内部的函数存在外部作用域的引用就会导致闭包
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

## JS 原型链

- 理解原型对象: 无论什么时候,只要创建了新函数, 就会有一组特定的规则为该函数创建一个prototype属性, 这个属性指向函数的原型对象, 默认情况下, 所有原型对象都会自动获得一个constructor(构造函数)属性, 这个属性是指向prototyp属性所在的指针
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

## 判断变量是不是数组

- `Array.isArray()`
- `instanceof` => `arr instanceof Array`
- `Object.prototype.toString.call(arr)` 
- etc.


## JS sort()

- 对于数组的元素进行排序, 返回数组, 默认排序顺序根据字符串 `Unicode` 码点
- V8引擎 sort 函数, 数量小于10使用 `InsertSort`, 大于10 使用 `QuickSort`

```js
const arr = [1,2,34, 5, 5, '34', '35']
arr.sort()
arr.sort(function(a,b) => {
  return a - b
})
```

## 深拷贝和浅拷贝

## JS 宏任务和微任务
