---
outline: deep
title: "HTML"
# sidebar: false 左边侧边栏
# aside: left
---

## HTML 知识点

### Repaint 重绘 Reflow 回流

`重绘（repaints）`是一个元素外观的改变所触发的浏览器行为，例如改变 vidibility、outline、背景色等属性。浏览器会根据元素的新属性重新绘制，使元素呈现新的外观。重绘不会带来重新布局，并不一定伴随回流。

`回流（reflow）`布局或者几何属性需要改变就称为回流

引起重绘和回流的一些操作

- 当你增加、删除、修改 DOM 结点时，会导致 Reflow 或 Repaint
- 当你移动 DOM 的位置，或是搞个动画的时候
- 当你修改 CSS 样式的时候
- 当你 Resize 窗口的时候（移动端没有这个问题），或是滚动的时候。
- 当你修改网页的默认字体时
  - 注：`display:none 会触发 reflow，而 visibility:hidden 只会触发 repaint`，因为没有发现位置变化。

减少重绘和回流

- 使用 `transform 替代 top`
- 使用 `visibility 替换 display: none` ，因为前者只会引起重绘，后者会引发回流
- 不要把节点的属性值放在一个循环里当成循环里的变量
- 不要使用 `table 布局`，可能很小的一个小改动会造成整个 table 的重新布局
- 动画实现的速度的选择，动画速度越快，回流次数越多，也可以选择使用 requestAnimationFrame
- CSS 选择符从右往左匹配查找，避免节点层级过多

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
  - 独自占据一行; 默认宽度为父元素的宽度
  - 可以包含行内元素
  - 有`<h1> <p> <ul> <div> <table> <td>` etc...
- 参与行内布局的内容被称为行级内容（inline-level content）
  - 不会独占一行, 相邻的行内元素在同一行
  - 高度无效, 可以设置行高; 对外边距和内边距仅设置左右方向有效, 上下无效
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
6. get 请求一般会被缓存; post 请求默认是不进行缓存的
7. get 请求的参数会被保存在历史记录中; post 不会
