---
outline: deep
---

## 为什么需要构建工具

- 转换 ES6 语法
- 转换 JSX
- CSS 前缀补全/预处理器
- 压缩混淆
- 图片压缩
- etc.

## 什么是 Webpack

Webpack 是一个现代的前端模块打包工具，它用于构建和优化 Web 应用程序的前端资源，包括 JavaScript、CSS、图片、字体等。Webpack 的主要目标是将项目的所有依赖项（模块、资源文件）打包到一个或多个最终的静态文件中，以便在浏览器中加载。

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

## Webpack 的构建流程

1. `读取配置文件`: Webpack 首先会读取项目中的配置文件（通常是 webpack.config.js），该配置文件包含了构建过程中的各种设置，如入口文件、输出目录、加载器（loaders）、插件（plugins）等
2. `解析入口文件`: Webpack 会根据配置文件中定义的入口点（entry points）来解析应用程序的依赖关系
3. `依赖解析`: Webpack 分析入口文件和其依赖的模块，构建一个依赖关系图，以确定哪些模块依赖于其他模块，以及它们之间的依赖关系。
4. `加载器处理`: Webpack 使用加载器来处理不同类型的资源文件，如 CSS、图片、字体等。加载器允许开发人员在构建过程中转换这些资源文件，以便将它们整合到最终的输出文件中
5. `插件处理`: Webpack 提供了插件系统，插件用于执行各种任务，如代码压缩、资源优化、HTML 生成、热模块替换（HMR）等。插件可以根据需要自定义 Webpack 的构建过程
6. `生成输出文件`: Webpack 根据入口文件和依赖关系图生成一个或多个输出文件。
7. `优化和压缩`: Webpack 可以进行各种优化，包括代码压缩、Tree Shaking、懒加载等，以减小包的大小并提高性能。
8. `生成 Source Maps`: Webpack 可以生成 Source Maps，以便在开发中进行调试。Source Maps 是一种映射文件，将最终输出文件映射回原始源代码。
9. `输出到指定目录`: 最终的构建结果被输出到配置文件中指定的目录中，通常是一个名为"dist"的目录。输出文件的命名和目录结构也可以根据配置进行自定义。
10. `完成构建过程`: Webpack 构建过程完成后，它会生成构建报告，包括构建成功或失败的信息，输出文件的大小等统计信息。

## Webpack 和 Vite 的区别

- Webpack 一个打包工具（对标 Rollup），静态构建，在项目工程化，依赖，打包，构建等过程发挥作用
- Vite 是一个更上层的工具链方案，对标的是 （webpack + 针对 web 的常用配置 + webpack-dev-server）。旨在提供快速的开发体验，它使用 ES 模块（ES modules）和现代浏览器特性来实现即时开发，不需要预构建或编译

## Loaders

webpack 开箱即用只支持 `js json` 两种文件类型, 通过 Loaders 去支持其它文件类型并且把他们转换成有效的模块, 可以添加到依赖图中

本身是一个函数, 接受源文件作为参数, 返回转换的结果

- `babel-loader`: 转换 ES6+ 等 JS 新的语法特性
- `css-loader`: 支持 .css 文件的加载和解析
- `ts-loader`: 将 ts 转换为 js
- `raw-loader`: 将文件以字符串的形式导入

```js
// 1. 导出一个函数，该函数接收源代码作为参数
module.exports = function (source) {
  // 2. 执行你的转换逻辑
  // 这里我们使用正则表达式将所有的console.log语句替换为空字符串
  const modifiedSource = source.replace(/console\.log\(.+?\);/g, "")
  // 3. 返回转换后的源代码
  return modifiedSource
}
```

## Plugins

插件用于 bundle 文件的优化, 资源管理和环境变量注入, 作用于整个构建过程

Plugin 用于扩展 Webpack 的功能，执行各种自定义构建任务和优化。

- `HtmlWebpackPlugin` 快速创建 HTML 文件来服务 bundles
- `CommonsChunkPlugin` 提取 chunk 之间的公共模块用以共享
- `MiniCssExtractPlugin` 为每一个包含了 CSS 的 JS 文件创建一个 CSS 文件
- `CleanWebpackPlugin` 用于在每次构建前清理输出目录，确保输出目录中不会残留旧的文件

```js
class BundleReportPlugin {
  constructor(options) {
    this.options = options || {}
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "BundleReportPlugin",
      (compilation, callback) => {
        const timestamp = new Date().toLocaleString()
        const moduleCount = Object.keys(compilation.modules).length

        const reportContent = `Bundle Report - ${timestamp}\nTotal Modules: ${moduleCount}`

        compilation.assets["bundle-report.txt"] = {
          source: () => reportContent,
          size: () => reportContent.length,
        }

        callback()
      }
    )
  }
}

module.exports = BundleReportPlugin
```

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

## Webpack 性能优化

### 优化 Loader

对于 Loader 来说，影响打包效率首当其冲必属 Babel 了。因为 Babel 会将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，转换代码越多，效率就越低。当然了，我们是有办法优化的。

1. 优化 Loader 的文件搜索范围

```js
module.exports = {
  module: {
    rules: [
      {
        // js 文件才使用 babel
        test: /\.js$/,
        loader: "babel-loader",
        // 只在 src 文件夹下查找
        include: [resolve("src")],
        // 不会去查找的路径
        exclude: /node_modules/,
      },
    ],
  },
}
```

### HappyPack

受限于 Node 是单线程运行的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况

`HappyPack 可以将 Loader 的同步执行转换为并行`的，这样就能充分利用系统资源来加快打包效率了

```js
module: {
  loaders: [
    {
      test: /\.js$/,
      include: [resolve('src')],
      exclude: /node_modules/,
      // id 后面的内容对应下面
      loader: 'happypack/loader?id=happybabel'
    }
  ]
},
plugins: [
  new HappyPack({
    id: 'happybabel',
    loaders: ['babel-loader?cacheDirectory'],
    // 开启 4 个线程
    threads: 4
  })
]
```

### DllPlugin

`DllPlugin 可以将特定的类库提前打包然后引入`。这种方式可以极大的减少打包类库的次数，只有当类库更新版本才有需要重新打包，并且也实现了将公共代码抽离成单独文件的优化方案。

```js
// 单独配置在一个文件中
// webpack.dll.conf.js
const path = require("path")
const webpack = require("webpack")
module.exports = {
  entry: {
    // 想统一打包的类库
    vendor: ["react"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].dll.js",
    library: "[name]-[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
      // name 必须和 output.library 一致
      name: "[name]-[hash]",
      // 该属性需要与 DllReferencePlugin 中一致
      context: __dirname,
      path: path.join(__dirname, "dist", "[name]-manifest.json"),
    }),
  ],
}

// webpack.conf.js
module.exports = {
  // ...省略其他配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest 就是之前打包出来的 json 文件
      manifest: require("./dist/vendor-manifest.json"),
    }),
  ],
}
```

### 按需加载

可以使用按需加载，将每个路由页面单独打包为一个文件

- 把整个网站划分成一个个小功能，再按照每个功能的相关程度把它们分成几类。
- 把每一类合并为一个 Chunk，按需加载对应的 Chunk
- 对于用户首次打开你的网站时需要看到的画面所对应的功能，不要对它们做按需加载，而是放到执行入口所在的 Chunk 中，以降低用户能感知的网页加载时间。
- 对于个别依赖大量代码的功能点，例如依赖 Chart.js 去画图表、依赖 flv.js 去播放视频的功能点，可再对其进行按需加载。

### Scope Hoisting

分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。 因此只有那些被引用了一次的模块才能被合并

```js
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin")

module.exports = {
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
  ],
}
```

### 基于 ESM 的 tree shaking

### 压缩资源（mini-css-extract-plugin，compression-webpack-plugin）

## 关于 babel 的理解

babel 是一个工具链，主要用于将 ES2015+代码转换为当前和旧浏览器或环境中向后兼容的 Js 版本。这句话比较官方，其实 babel 就是一个语法转换工具链，它会将我们书写的代码（vue 或 react）通过相关的解析（对应的 Preset），主要是词法解析和语法解析，通过 babel-parser 转换成对应的 AST 树，再对得到的抽象语法树根据相关的规则配置，转换成最终需要的目标平台识别的 AST 树，再得到目标代码。

在日程的 Webpack 使用主要有三个插件：`babel-loader、babel-core、babel-preset-env`。babel 本质上会运行 babel-loader 一个函数，在运行时会匹配到对应的文件，根据 babel.config.js（.balelrc）的配置（这里会配置相关的 babel-preset-env,它会告诉 babel 用什么规则去进行代码转换）去将代码进行一个解析和转换（转换依靠的是 babel-core），最终得到目标平台的代码。

### vite 和 webpak 的区别

vite 在开环境时基于 ESBuild 打包，相比 webpack 的编译方式，大大提高了项目的启动和热更新速度。
