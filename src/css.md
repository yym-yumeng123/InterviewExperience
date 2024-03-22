---
outline: deep
title: "HTML/CSS"
# sidebar: false 左边侧边栏
# aside: left
---

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

### css 选择器的优先级, 权重计算方式

1. !important 规则: 如果有!important 声明，那么该规则具有最高的优先级
2. 特定性: 特定性值的大小来排序，特定性值较大的规则具有更高的优先级，权重计算方式如下
    - 内联样式: 每个内联样式规则的特定性为 1000
    - ID 选择器: 每个 ID 选择器的特定性为 100
    - 类选择器、属性选择器和伪类选择器: 每个类选择器、属性选择器和伪类选择器的特定性为 10
    - 元素选择器和伪元素选择器: 每个元素选择器和伪元素选择器的特定性为 1

### css 属性的继承性

**可继承的属性**

- color
- font
- line-height
- text-align
- visibility

**不可继承属性**

- border
- margin
- padding
- width
- height
- position
- display

### 画一条 0.5px 的线

```html
<html>
  <head>
    <style type="text/css">
      .thin-line {
        height: 1px; /* 设置线的高度为1像素 */
        transform: scaleY(0.5); /* 使用scale缩放高度为0.5，模拟较细的线 */
        transform-origin: 0 0; /* 设置变换的原点为左上角，确保线的位置正确 */
        margin: 0; /* 可以根据需要调整上下外边距，以控制线的位置 */
      }
    </style>
  </head>
  <body>
    <div class="thin-line"></div>
  </body>
</html>
```

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
    - CSS3 伪类（Pseudo-classes）: 伪类用于选择文档中的特定元素，通常基于它们的状态、位置或属性
    - `:hover :active :focus :firsy-child`
    - CSS3 伪元素（Pseudo-elements）: 伪元素用于在文档中生成虚拟元素，通常用于添加样式或内容
    - `::before ::after ::first-letter`
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
    - line-height 用于控制文本行的垂直间距
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

- `opacity: 0` 透明度为 0, 看不见, 但占位置; 取值范围 0-1; 继承父元素的 opactiy; 有点击事件
- `transparent` 效果也是透明
- `rgba(0, 0, 0, 0)` red green blue; a 表示透明度 0-1; 后代不会继承
- `visibility: hidden` 元素消失, 占据原来的位置; 没有点击事件
- `display: none` 元素消失, 不占据位置; 没有点击事件
- `postion: absolute; top: -999px`: 不占位; 有点击事件

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

### overflow 不同值

- `visible` 默认值
- `hidden` 内容溢出容器, 会被隐藏, 不可见
- `scroll` 内容溢出容器, 显示滚动条
- `auto` 内容溢出容器, 显示滚动条; 未溢出, 不显示滚动条

### BFC (block formatting context) 块级格式化上下文

> 浮动、绝对定位、非块盒的块容器(例如: inline-blocks table-cells)和 `overflow != visible` 的块盒会为它们的内容建立一个新的块格式上下文

BFC 特性

- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此
- 在一个 BFC 中, 内部的 Box 会在垂直方向，一个接一个地放置。
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

### Margin 塌陷问题如何解决?

1. margin 塌陷问题: 符合 css 外边距合并规则
2. 触发 BFC, 一个独立的渲染区域, 与外部元素不会互相影响
3. 上面触发 BFC 方式随便选一个

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

### 渐进增强 优雅降级

渐进增强: 从基本的, 核心的功能开始, 然后逐渐的增强用户体验

优雅降级: 首先构建功能丰富的版本, 然后在较低能力的浏览器提供一种相对简化的版本

### iframe 有哪些优点和缺点

`<iframe>` 内联框架是 HTML 的一个标签, 用于在当前页面中嵌入另一个页面

优点:

1. 分离内容: `<iframe>` 允许将不同来源或不同内容的页面嵌套在一起。这有助于将内容分隔开，允许不同团队或服务提供商提供各自的内容。
2. 实现跨域通信: `<iframe>` 可用于实现跨域通信，例如在父页面和嵌套的 `<iframe>` 页面之间传递数据，从而创建丰富的嵌入式应用程序。
3. 安全性: `<iframe>` 可以提高安全性，因为它可以将来自不受信任的来源的内容隔离在一个独立的沙盒中，以防止对主页面的恶意攻击。
4. 无需刷新：`<iframe>` 允许在不刷新整个页面的情况下加载新内容，这对于实现动态加载内容或应用程序非常有用。

缺点:

1. 性能问题: 每个 `<iframe>` 都会加载一个新页面，这可能会导致性能问题，特别是在多个嵌套的 `<iframe>` 页面存在时。
2. 可访问性问题: `<iframe>` 可能会导致可访问性问题，因为屏幕阅读器可能不会正确处理嵌套的页面。确保提供替代文本和合适的 ARIA 标记以提高可访问性。
3. 不利于 SEO: 搜索引擎通常不会索引嵌套在 `<iframe>` 中的内容，这可能对网站的搜索引擎优化（SEO）产生负面影响。
4. 兼容性问题：某些浏览器和设备可能不正确支持 `<iframe>`，或者可能需要特殊处理以确保它们正确显示

使用场景:

- 嵌入外部内容：例如，将 YouTube 视频、Google 地图或社交媒体小部件嵌入网页。
- 分离组件：将不同部分的网页分开以进行模块化开发。这对于大型应用程序或团队协作非常有用。
- 安全沙盒：将不受信任的内容隔离在一个沙盒中，以提高安全性。
- 跨域通信：在不同源的页面之间进行数据交换，以创建富客户端应用程序。

### css3 新特性

1. 圆角边框: `border-radius`
2. 阴影: `box-shadow`
3. 渐变: `linear-gradient`
4. 多列布局: `column-count` 和 `column-width`
5. 变换: `transform`
6. 过渡: `transition`
7. 动画: `@keyframes` 和 `animation`
8. 透明度: `opacity`
9. 自定义属性 `var()`

### transition 和 animation 的区别？

transition 和 animation 是 CSS 用于创建动画效果的两种不同的属性

- 使用 `transition` 可以创建简单的状态过渡效果，适用于鼠标悬停、焦点等触发的状态变化
- 使用 `animation` 可以创建更复杂的动画，包括关键帧、持续时间、循环和更精细的控制。它适用于需要更多控制和复杂度的动画场景。

### flex 弹性布局

- flex-direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' 方向
- flex-wrap: 'wrap' | 'nowrap' 换行
- flex-flow 上面两个的简写
- justify-content: 'center' | 'space-between' | 'space-around' | 'felx-start' | 'flex-end' 主轴方向的对齐方式
- align-items: 'center' | 'stretch' | 'flex-start' | 'flex-end' | 'baseline' 侧轴对齐方式
- align-content: 多行/列内容对齐方式
- flex-grow: 增长比例(空间过多时) 默认为 0，即如果存在剩余空间，也不放大
    - 如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的 flex-grow 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。
- flwx-shrink 收缩比例(空间不够时) 默认为 1，即如果空间不足，该项目将缩小
    - 如果所有项目的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的 flex-shrink 属性为 0，其他项目都为 1，则空间不足时，前者不缩小。
- flex-basis 默认大小 auto, 一般不写; 定义了在分配多余空间之前，项目占据的主轴空间（main size）
- flex 上面三个的缩写
- order 改变的展示顺序 默认为 0
- align-self 自身的对齐方式, 已经对齐的情况下, 自己选择自己的对齐方式
