### 异步加载JS

```js
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

### 白屏 和 FOUC(无样式内容闪烁)