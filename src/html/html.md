---
outline: deep
title: "HTML/CSS"
# sidebar: false 左边侧边栏
# aside: left
---

## HTML 知识点

### doctype 的作用是什么？

声明文档类型，告知浏览器用什么文档标准解析这个文档：

- 怪异模式：浏览器使用自己的模式解析文档，不加 doctype 时默认为怪异模式
- 标准模式：浏览器以 W3C 的标准解析文档

### HTML 的 meta 标签

```md
<!-- meta 元数据不会显示在客户端，但是会被浏览器解析 -->
<head>
  <!-- 定义HTML文档的字符集 -->
  <meta charset="UTF-8" >
  <!-- 定义web页面描述 -->
  <meta name="description" content="我是meta">
  <!-- 定义文档关键词，用于搜索引擎 -->
  <meta name="keywords" content="HTML,CSS,XML,JavaScript">
  <!-- 定义作者 -->
  <meta name="author" content="张三">
  <!-- width: viewport 的宽度 -->
  <!-- height: viewport 的高度  -->
  <!-- user-scalable: 是否允许缩放  -->
  <!-- initial-scale: 初始化比例 1-10  -->
  <!-- minimum-scale: 允许缩放的最小比例  -->
  <!-- maximum-scale: 允许缩放的最打比例  -->
  <meta name="viewport" 
    content="
      width=device-width,
      height=device-height, 
      user-scalable=no,
      initial-scale=1, 
      minimum-scale=1, 
      maximum-scale=1,
      target-densitydpi=device-dpi"
  >

  <!-- http-equiv：可用于模拟http请求头，可设置过期时间、缓存、刷新 -->
  <!-- 每 30s 刷新页面 -->
  <meta http-equiv="refresh" content="30">
  <!-- expires，指定缓存过期时间 -->
  <meta http-equiv="expires" content="Wed, 20 Jun 2019 22:33:00 GMT">
  <!-- 30秒后缓存过期 -->
  <meta http-equiv="expires" content="30">
  <!-- 禁止浏览器从本地计算机的缓存中访问页面内容 -->
  <meta http-equiv="Pragma" content="no-cache">
</head>
```

### 行内元素? 块级元素? 空元素?

- 参与块级布局的内容被称为块级内容
  - 有自己的宽度和高度
  - 独自占据一行高度
  - 可以包含行内元素
  - 有`<h1> <p> <ul> <div> <table> <td>` etc...
- 参与行内布局的内容被称为行级内容（inline-level content）
  - 不会独占一行, 相邻的行内元素在同一行
  - 高度无效, 可以设置行高
  - 不能包含块级元素
  - 有 `<span /> <a /> <em/> <strong>` etc...
- 空元素（empty element）是 HTML 中不能存在子节点（例如内嵌的元素或者文本节点）的元素。空元素只有开始标签且不能指定结束标签
  - 有 `<br /> <hr /> <meta /> <link> <input />` etc...
- 通过`display: block/inline/inline-block` 转换

### 导入样式, link 与 @import 区别?

1. `link` 标签作为 HTML 元素，不存在兼容性问题; `@import`是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别
2. `link` 标签引入的 CSS 被同时加载; `@import` 引入的 CSS 在页面加载完毕后被加载
3. JS 可以操作 DOM, 插入 `link`; 无法操作 `@import`

### href 和 src 有什么区别

`href（hyperReference)` 即超文本引用：当浏览器遇到 href 时，会并行的地下载资源，不会阻塞页面解析，例如我们使用`<link>`引入 CSS，浏览器会并行地下载 CSS 而不阻塞页面解析. 因此我们在引入 CSS 时建议使用`<link>`而不是`@import`

```html
<link href="style.css" rel="stylesheet" />
```

`src (resource)` 即资源，当浏览器遇到 src 时，会暂停页面解析，直到该资源下载或执行完毕，这也是 script 标签之所以放底部的原因

```html
<script src="script.js"></script>
```

### img 标签 alt 和 title 属性的区别

```md
<!-- title: 鼠标移入到图片显示的值; alt: 图片无法加载时显示的值 -->
<img src="image.jpg" alt="image description" title="image tooltip">
```

### HTML5 有哪些新特性

1. 语义化标签 `header footer nav section article aside dialog main`
2. 新增 input 输入特性 `color date tel search range 等`
3. 表单元素: `details progress meter`
4. 视频和音频 `audio video`
5. `canvas svg`
6. 地理位置: `window.navigator.geolocation`
7. 拖放 API `drag`
8. 地理定位: `getCurrentPosition()`方法来获取用户的位置，可以基于此实现计算位置距离
9. `Web Storage` 本地存储用户的浏览数据
10. etc...

### post 和 get 区别

1. get 提交的数据 url 可以看到; post 看不到
2. get 是拼接 url; post 放在 http 请求体中
3. get 最多提交 1k 数据, 浏览器限制; post 理论上无限制
4. get 提交的数据在浏览器历史记录可以看到
5. get 主要是拿数据; post 给数据

## CSS 知识点

### css 元素的宽高 & 文档流

1. 内联元素的宽高
   - 宽度由 padding, margin border 以及里面的内容影响, margin padding 不影响高度
   - 高度由行高决定
2. 块级元素的宽高
   - 宽度自适应父元素
   - 高度由`内部文档流中元素的总和决定的`
3. 文档流
   - 文档流中的内联元素会从左到右并列排成一行, 空间不够, 会换行依次排列; 块级元素从上到下
   - 脱离文档流: `浮动 绝对定位 fixed`
4. 字体的高度由设计师给一个一个行高; 字和字通过基线对齐
5. 多个 `inline-block` 元素之间有空格, 尽量不用 inline-block; 手动添加空格 `&nbsp;`

### 文字溢出省略效果

```css
/* 一行文本 */
div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多行文本 */
div {
  display: --webkit-box;
  --webkit-line-clamp: 2;
  --webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 汉字对齐

```html
<style>
  span {
    text-align: justify;
    overflow: hidden;
  }
  /* 每一个行内元素添加一个伪元素, 占据100%宽度; justify */
  span::after {
    content: "";
    dispaly: inline-block;
    width: 100%;
  }
</style>

<!-- 内容两边对齐 -->
<span>姓名</span>
<span>联系方式</span>
```

### 1 比 1 div

```css
.one {
  boder: 1px solid red;
  /* 实现高度撑起来 */
  padding-top: 100%;
}
```

### 堆叠上下文

满足某种条件的 div 或某种元素, 堆叠上下文

- 根元素(html)
- z-index != auto 的绝对/相对定位
- opacity 值 < 1 的
- podtion: fixed

div 不是平面的,三维概念, 最下到最上层 (在浏览器通过颜色, 位置调试)

1. background
2. border
3. 块级元素
4. 浮动
5. 内联
6. z-index: 0
7. z-index: +
8. 兄弟元素重叠, 后面的盖在前面的身上

### ::before 和 :after 双冒号和但冒号区别

1. `::伪元素` | `:伪类`
2. ::before 元素之前; :after 元素之后(清除浮动)

### chrome 支持小于 12px 的文字

1. `transform: scale(.3)`

### 自适应 响应式

1. 移动端自适应通过设置计算 html {font-size: "px"}, 配合使用 `rem`
2. 响应式: 一个 url 可以响应多端
   - 媒体查询 `@media`
   - 响应式图片

```js
// 自适应
window.onresize = function() {
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px'
}

// 响应式
@media only screen and (max-width 1000px) {}

// 响应式图片
<picture>
  <source srcset="1.jpg"media='(min-width:1000px)'>
  <source srcset="2.jpg"media='(min-width:700px)'>
  <img srcset="3.jpg">
</picture>
```

### 元素居中

1. 水平居中
   1. 被设置元素为文本、图片等行内元素时, 给父元素 `text-align: center`
   2. 被设置元素为 块状元素
      1. 定宽元素: `margin: value auto`
      2. 不定宽元素
         1. 在子元素上 `display: table; margin: 0 auto`
         2. 父元素 `text-align: center`, 子元素 `inline-block`
         3. `position: absolute; transform: translateX(-50%)`
         4. `display: flex`
2. 垂直居中
   1. 父元素高度确定的单行文本 `height == line-height`
   2. 父元素高度不确定的多行文本
      1. `display: table-cell; vertical-align: middle`
      2. `absolute + transform`
      3. `flex align-items`
3. 水平垂直居中: 是上面水平居中和水质居中的结合

### CSS 的盒子模型

- IE 盒子模型: `margin, width = (border + padding + content)`
- 标准 W3C 盒子模型 `margin border padding contnet-width`
- `box-sizing: content-box` 默认浏览器使用标准模型
- `box-sizing: border-box` (标准/IE)转换, 告诉浏览器使用 `border-box` 定义区域

### px em rem vw vh

1. `px` 像素单位和设备屏幕分辨率直接相关
2. `em` 相对于其父元素的字体大小, 默认`1em = 16px` 一个字的宽度
3. `rem` 相对于字体大小的 html 元素，也称为根元素
4. `vw` viewpoint width，视窗宽度，1vw=视窗宽度的 1%
5. `vh` viewpoint height，视窗高度，1vh=视窗高度的 1%

```md
<!-- 基于当前元素的(如果没设置就是继承其父元素的)font-size -->
<div style="font-size: 12px;">
    <!-- 24px -->
    <span style="font-size: 2em">em单位</span>
</div>

html {
font-size: 10px; /_ 不建议设置 font-size: 62.5%; 在 IE 9-11 上有偏差，具体表现为 1rem = 9.93px。 _/
}

.sqaure {
width: 5rem; /_ 50px _/
height: 5rem; /_ 50px _/
}
```

### 动态 REM

REM: root em 根元素(html 元素)的 font-size

```css
html {
  font-size: 16px;
}

div {
  font-size: 2rem; /** 1rem = 16 2rem = 32 */
}
```

1. 响应式: 是否有设计图, 不同尺寸的设计图
   - 0-320px 一套 css
   - 320-375px 一套 css
   - ...
   - 百分比布局 宽度百分比好写, 高度百分比不好弄
   - 整体缩放 rem
     - 一切单位以宽度为基准

```js
// html font-size = 页面宽度

// 1rem = html font-size = 1 page width
const pageWidth = window.innerWidth
document.write(`<style>html{font-size:${pageWidth}px}</style>`)

// 1rem = html font-size = 1 /10 page width
// width height margin padding 使用 rem, border 使用 px; 单位特别小, 使用 px
const pageWidth = window.innerWidth
document.write(`<style>html{font-size:${pageWidth / 10}px}</style>`)

// 移动端
/* <meta name="viewport" content="width=device-width, user-scalable=no"> */
```

### line-height 和 height 区别

- `height`: 元素的高度值
- `line-height`: 每一行文字的高度, 文字换行, 盒子高度会增大
  - `line-height为number`时,继承为直接继承,所以如果给下面的元素设置行高,等于字体大小乘以 number 值
  - `line-height:百分比`;先计算,在继承

### inline-block 有什么特性？如何去除缝隙？高度不一样的 inline-block 元素如何顶端对齐?

1. 特性

   - 既呈现 inline 的特性，不占据一整行; 宽度由内容宽度决定
   - 又呈现 block 的特性，可设置宽高, 内外边距

2. CSS 更改`非inline-block水平元素`为 inline-block 水平，元素之间会出现缝隙,

   - 元素间留白间距出现的原因就是`标签段之间的空格`，因此，去掉 HTML 中的空格，自然间距就木有了
   - 使用 margin 负值
   - 闭合标签处理
   - 使用 font-size:0

```md
a {
display: inline-block;
border: 1px solid red;
}

<div>
  <a href="">1</a>
  <a href="">2</a>
  <a href="">3</a>
</div>
```

3. 顶端对齐

```md
vertical-align:top
```

### 让一个元素看不见?

- `opacity: 0` 透明度为 0, 看不见, 但占位置; 取值范围 0-1; 继承父元素的 opactiy
- `transparent` 效果也是透明
- `rgba(0, 0, 0, 0)` red green blue; a 表示透明度 0-1; 后代不会继承
- `visibility: hidden` 元素消失, 占据原来的位置;
- `display: none` 元素消失, 不占据位置;

### 浮动元素 float

- 默认宽度为内容宽度
- 脱离文档流; float 元素在同一文档流
- 向指定方向一直移动(不能移动为止)
- 行内元素浮动后具有块级元素的特征, 可以设置宽高
- 对父容器: 如果未设置宽高,会`造成父元素高度塌陷`
- 对文字: 文字能感觉到浮动元素的存在,在文档流中,会围绕浮动元素

清除浮动

- 父级 div 定义 `overflow: auto`
- 使用伪元素: `.clearfix:after{content:'';display: block;clear: both;}`

### position 定位

- `position: static | relative | absolute | fixed`
- `relative` 仍在文档流中;参照物为元素本身;绝对定位元素的参照物
- `absolute` 脱离文档流;参照物为第一定位祖先/根元素;默认宽度为内容宽度
- `fixed` 固定定位; 脱离文档流; 参照物为视窗; 遮罩使用
- `static` 没有定位

### BFC (block formatting context) 块级格式化上下文

> 浮动、绝对定位、非块盒的块容器(例如: inline-blocks table-cells)和 `overflow != visible` 的块盒会为它们的内容建立一个新的块格式上下文

BFC 特性

- 在一个 BFC 中, 内部的 Box 会在垂直方向，一个接一个地放置。
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此
- 同一个块级格式化上下文中的相邻块级盒之间的 `竖直margin` 会合并
- 可以解决上下 margin 合并问题 `父子元素margin合并`

BFC 功能

- 父元素管住子元素 `float : 'left' | 'right'`; `display: flow-root`
  - 父元素触发了 BFC, 子元素就只能乖乖的听话
- 兄弟元素之间划清界限
  - 兄弟触发 bfc

触发 BFC

- 根元素
- 浮动元素: float 值非 `none`
- 绝对定位元素: position 值为 `absolute | fixed`
- overflow 值非 `visible`
- display 值为 `inline-block | flex | inline-flex | table-cell`
- `display: flow-root` 让当前元素触发 bfc

:::tip
从根元素开始, 就开启了`BFC`, 按照文档流排列, 子元素或者孙子元素有些布局, 可以触发自己的 BFC, 因为父亲只能管儿子, 管不了孙子

只有 `display: flow-root` 触发 BFC 没有副作用, `浮动; overflow: hidden; 定位` 等都有自己的特性
:::

### 理解 font-size line-height

下面字体的大小 `100px` 是什么的高度

- 字体不同, font-size 显示的大小不同, 每个字体有一个默认的 `推荐行高` em-square
  - font-size 即不指字体大小, 也不指字体高度, 而是设计字体时给定的
- line-height 指定一个内联元素真实的占地高度
  - 字体基于基线对齐, 不同字体基线对齐方式, 会导致父元素变大
  - 默认值 = 设计字体的给定的 normal
- `vertical-align: top` 怎么对齐的?
  - 不同字体留的行高不同, 导致实际占地面积不同, 顶部不同, 所以经常看着对不齐
- 行内元素默认基线对齐, 既使看不见元素
  - 单独一张图片下面的缝隙: 因为图片要对齐行内元素, `vertical-align: middle`

```css
span {
  vertical-align: top;
  font-size: 100px;
  font-family: 宋体、微软雅黑、...;
}
```

### 双飞翼布局

```html
<head>
  <meta charset="UTF-8" />
  <title>双飞翼</title>
  <style>
    .main-wrapper {
      float: left;
      width: 100%;
    }
    .main {
      height: 300px;
      margin-left: 210px;
      margin-right: 190px;
      background-color: red;
    }
    .sub {
      float: left;
      width: 200px;
      height: 300px;
      margin-left: -100%;
      background-color: blue;
    }
    .extra {
      float: left;
      width: 180px;
      height: 300px;
      margin-left: -180px;
      background-color: pink;
    }
  </style>
</head>
<body>
  <div class="main-wrapper">
    <div class="main"></div>
  </div>
  <div class="sub"></div>
  <div class="extra"></div>
</body>
```

### 白屏 和 FOUC(无样式内容闪烁)

- 白屏
  - 把样式放在底部, 对于 IE 浏览器, 在某些场景下(刷新, 新窗口打开等)页面会出现白屏, 而不是内容逐步展现
  - 使用`@import`标签, 既使 CSS 放入 link, 并且放在头部, 也可能出现白屏
- fouc 出现的条件
  - 样式表放在页面底部,此方式由于 IE 会先加载整个 HTML 文档的 DOM，然后再去导入外部的 CSS 文件，因此，在页面 DOM 加载完成到 CSS 导入完成中间会有一段时间页面上的内容是没有样式的，这段时间的长短跟网速，电脑速度都有关系。
  - 有多个样式表, 放在 html 不同位置
  - 使用`@import`方法导入 css,

**原理**

当 css 晚于结构性 html 加载, 当加载到此样式表时，页面将停止之前的渲染。此样式表被下载和解析后，将重新渲染页面，也就出现了短暂的花屏现象。

**解决方法**

- 使用`link`标签将样式表放在文档`head`中。
- 将 JS 放在底部
  - 脚本会阻塞后面内容的呈现

### offset、scroll、client

offsetHeight = 内容高度 + padding + border

clientheight = 内容高度 + padding

scrollHeight = 内容实际尺寸 + padding

```html
<style>
  .box1 {
    width: 100px;
    height: 100px;
    padding: 20px;
    margin: 30px;
    border: 5px solid yellow;
    background-color: #ccc;
  }

  .box2 {
    width: 100px;
    height: 100px;
    padding: 20px;
    margin: 30px;
    border: 5px solid yellow;
    background-color: #ccc;
  }

  .box3 {
    width: 100px;
    height: 100px;
    padding: 20px;
    margin: 30px;
    border: 5px solid yellow;
    background-color: #ccc;
    overflow: auto;
  }
</style>

<body>
  <div class="box1">盒子1</div>
  <div class="box2">盒子2</div>
  <div class="box3">
    <div style="height: 300px;">盒子3</div>
  </div>
</body>
<script>
  const box1 = document.getElementsByClassName("box1")[0]
  const box2 = document.getElementsByClassName("box2")[0]
  const box3 = document.getElementsByClassName("box3")[0]
  console.info("盒子1的offsetHeight", box1.offsetHeight) // 150
  console.info("盒子2的clientHeight", box2.clientHeight) // 140
  console.info("盒子3的scrollHeight", box3.scrollHeight) // 340
</script>
```
