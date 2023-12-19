## 为什么需要构建工具

- 转换 ES6 语法
- 转换 JSX
- CSS 前缀补全/预处理器
- 压缩混淆
- 图片压缩
- etc.

## 什么是 Webpack

webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具

- webpack 默认配置文件: `webpack.config.js`
- `webpack --config` 指定配置文件

```js
// webpack.config.js
module.exports = {
  entry: "./src/index.js", // 打包的入口文件, 默认值 ./src/index.js
  output: "./dist/main.js", // 打包的输出 默认值 ./dist/main.js
  mode: "production", // 环境
  module: {
    rules: [
      // Loader 配置 用于转换某些类型的模块
      { test: /\.tsx$/, use: "raw-loader" },
    ],
  },
  plugins: [
    // 插件配置
    new HtmlwebpackPlugin({}),
  ],
}
```

## Loaders

webpack 开箱即用只支持 `js json` 两种文件类型, 通过 Loaders 去支持其它文件类型并且把他们转换成有效的模块, 可以添加到依赖图中

本身是一个函数, 接受源文件作为参数, 返回转换的结果

- `babel-loader`: 转换 ES6+ 等 JS 新的语法特性
- `css-loader`: 支持 .css 文件的加载和解析
- `ts-loader`: 将 ts 转换为 js
- `raw-loader`: 将文件以字符串的形式导入

## Plugins

插件用于 bundle 文件的优化, 资源管理和环境变量注入, 作用域种鸽构建过程

- `HtmlWebpackPlugin` 快速创建 HTML 文件来服务 bundles
- `CommonsChunkPlugin` 提取 chunk 之间的公共模块用以共享
- `MiniCssExtractPlugin` 为每一个包含了 CSS 的 JS 文件创建一个 CSS 文件

## mode

指定当前的构建环境是: `production development none`

设置`mode`可以使用 webpack 内置的函数, 默认值是 `production`

- `development`
  - `process.env.NODE_ENV == development`
  - 开启 `NamedChunksPlugin NamedModulesPlugin`
- `production`
  - `process.env.NODE_ENV == production`
  - 开启 `FlagDependencyUsagePlugin NoEmitOnErrorsPlugin 等`
- `none` 不适用任何默认优化选项

## 资源解析

- 解析 ES6: `babel-loader`, 添加 babel 设置
- 解析 CSS: `css-loader style-loader`
- 加载图片和字体: `type: 'asset/resource'` webpack5 可以使用内置的 资源模块

## 文件监听

文件监听是发现原码变化, 自动构建出新的输出文件

1. 启动 webpack 命令, 带上 `--watch` 参数
2. 配置 webpack.config.js 设置 `watch: true`
3. `webpack-dev-server` 和 webpack-dev-middleware 里 Watch 模式默认开启

## 热更新 webpack-dev-server

webpack 5 中 HMR 已自动支持。无需配置

## 文件指纹

1. Hash: 和整个项目构建像个, 只要项目文件有修改, 整个项目构建的 hash 值就会更改
2. Chunkhash: 和 webpack 打包的 chunk 有关, 不同的 entry 会生成不同的 chunkhash 值
3. Contenthash: 根据文件内容定义 hash, 文件内容不变, contenthash 不变

```js
module.export = {
  output: {
    filename: "[name][chunkhash:8].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name][contenthash:8].css",
    }),
  ],
}
```

## 代码压缩

1. HTML 压缩: `html-webpack-plugin` minify 参数
2. JS 压缩: `uglifyjs-webpack-plugin`
3. CSS 压缩: `css-minimizer-webpack-plugin`

## 自动清理构建目录产物

每次构建时候不会清理目录, 造成构建的输出目录 output 文件越来越多

1. 通过 npm script 清理 `rm-rf ./dist && webpack`
2. `clean-webpack-plugin` 默认会删除 output 指定的输出目录

## PostCSS 插件 autoprefixer 自动补齐 CSS3 前缀

- `npm install postcss-loader postcss autoprefixer`

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          ,
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                    {
                      // 选项
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
}
```

## 移动端 css px 自动转 rem

之前: css 媒体查询实现响应式布局

webpack 怎么使用? 使用 `px2rem-loader` 和手淘的 `lib-flexible` 库

- lib-flexible 设置 根元素的 font-size

```js
{
  loader:'px2rem-loader',
  options:{
    remUnit:75, // 1rem对应75px,比较适合750的视觉稿，750个像素对应10rem
    remPrecision:8 // px转rem小数点后面位数
  }
}
```

## 静态资源内联

静态资源内联就是将 css js 图片等静态资源, 内联到 html

代码层面:

- 页面框架的初始化脚本
- 上报相关打点
- css 内联避免页面闪动

请求层面: 减少 http 网络请求数

- 小图片或者字体内联

HTML 和 JS 内联, html-webpack-plugin 解析语法使用的是`<%='code'%>`

- `raw-loader` 内联 html js

```js
<%=require('raw-loader!./head.html')%>

<script type="text/javascript">
  <%=require('raw-loader!babel-loader!../node_modules/lib-flexible')%>
</script>
```

- css 内联: `html-inline-css-webpack-plugin`

```js
plugins: [
  new HTMLInlineCSSWebpackPlugin(),
],
```