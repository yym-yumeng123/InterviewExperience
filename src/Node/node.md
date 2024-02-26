---
outline: deep
---

### Node 是什么

- Node 开源的 JavaScript 运行环境
- Chrome V8 引擎 事件驱动 非阻塞 异步 IO 服务端
  - 非阻塞 IO: database -> callback 回调里面执行
  - 事件驱动: 进入事件队列(同步/异步事件)

### Node 优缺点

1. 优点
   - 高并发
   - `IO` 密集型应用
2. 缺点
   - Node.js 是单线程, 不适合 CPU 密集型应用, 单核 CPU
   - 代码发生问题, 系统回崩溃

### Node 应用场景

1. 后台管理系统 (实时交互系统 高并发)
2. 基于 web canvas 的多人游戏
3. 基于 websocket 试试聊天互动平台
4. database, 返回 json api 的方式
5. 单页面浏览器应用创建服务
6. `前端 BFF（Backend For Frontend）层`: Node.js 可以用作前端 BFF 层，负责聚合多个后端 API 并向前端提供定制的数据和服务。这有助于减少前端应用程序中对后端 API 的请求数量，提高性能和用户体验

### nodejs 开放跨域白名单

```js
app.use(async (ctx, next) => {
  // 允许跨域请求的源（白名单）
  const allowedOrigins = ['http://127.0.0.1:3000'];
  const requestOrigin = ctx.headers.origin;
  // 检查请求的来源是否在允许的白名单中
  if (allowedOrigins.includes(requestOrigin)) {
    // 设置响应头以允许跨域
    ctx.set('Access-Control-Allow-Origin', requestOrigin);
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Allow-Credentials', 'true'); // 允许携带身份验证信息（例如 Cookie）
  }
  await next();
});
```

### Node fs 模块

- `fs filesystem` 操作文档文件夹
- 权限位 mode
  - `r read` 读取文件 不存在异常
  - `r+` 读取并写入文件 文件不存在 抛出异常
  - `w write` 写入文件
  - `wx`
  - `w+` 读取并写入文件, 不存在 创建文件 存在清空后写入
  - `a amend` 追加写入
  - `a+` 不存在 支持创建

```js
const fs = require("fs")

// 写入
fs.writeFileSync("2.txt", "hello")
fs.readFileSync("2.txt")

fs.writeFile("1.txt", (err, data) => {
  fs.readFile()
})

// 追加写入
fs.appendFile("3.txt", "world")

// 文件拷贝
fs.copyFile("3.txt" "4.txt")
fs.readFileSync("4.txt")

// 创建目录 父目录存在
fs.mkdirSync("a/b")

// buffer 文件 二进制 Buffer 内存 缓冲
// utf8 ascil base64 hex 各种格式
cosnt buffer = Buffer.form("123") // 123 -> 16进制 -> Buffer 1字节
buffer.toString()
const b1 = Buffer.alloc(10) // 大小是10的缓冲区
```

### JWT 鉴权

JWT (JSOM WEB TOKEN)

- 服务端返回 token 令牌
- 客户端请求携带 AUthorization: "Bearer token"

header.payload.signature

```js
// header base64编码
{
  alg: "HS256",
  type: "JWT"
}

// payload token
{
  sub: "yym",
  time: 时间戳,
  user: "12"
}

// sigunature secretKey 密文
Signature = HMACSHA356(base64Url(header)+.base64Url(payload).secretKey)
```

如何实现?

1. 生成 token
2. 验证 token

### 分页功能

```js
{
  totalCount: 1000,
  totalPage: 100,
  currentPage: 1,
  data: []
}


router.all("/api", (req, res, next) => {
  let param = ''
  if(req.method = 'POST') {
    param = req.body
  } else {
    param = req.query || req.params
  }

  const pageSize = param.pageSize || 10
  const start = (param.page - 1) * pageSize

  const sql = `select * from record limit ${pageSize} offset ${start}`

  db.query(sql, (err, res) => {})
})
```

### Stream 流

Stream 数据传输手段, 端到端信息交互方式 Buffer 单位 逐块读取

种类?

1. 可写流: `fs.createWriteStream` Response
2. 可读流: `fs.createReadStream` Request
3. 双工流: `net.Socket`
4. 转换流: 在数据写入/读取时修改数据的流

```js
const { Duplex } = require("stream")
const demo = new Duplex({
  read(size) {}
  write(chunk, encoding, cb) {}
})
```

使用场景:

- IO`(Input/Output)` 操作 http fs

```js
// 返回文件给客户端
const server = http.createServer((req, res) => {
  const { method } = req
  if (method === "GET") {
    const filename = path.resolve(__dirname, "data.json")
    let stream = fs.createReadStream(filename)
    stream.pipe(res)
  }
})

server.listen(8000)
```

### process

process 是全局变量

- `process.env` 环境变量
- `process.nxtTick` eventLoop
- `process.pid` 当前进程的 id
- `process.cwd()` 当前进程工作目录
- `process.stdout` 标准输出
- `process.stdin` 标准输入

```js
// A npm B包括A
process.cwd()

// 命令行入参
process.argv
```

### evnetEmitter

```js
const EventEmitter = require("events")

// 发布订阅 观察者模式
eventEmitter.emit() // 触发
eventEmitter.on() // 注册一个事件
```

```js
class EventEmitter {
  constructor() {
    this.event = {}
  }
  on(type, fn) {
    this.event[type] = this.event[type] || []
    this.event[eventName].push(fn)
  }
  emit(type, ...args) {
    this.event[type].forEach((item) => {
      Reflect.apply(item, this, args)
    })
  }
  off(type, fn) {
    this.removeListener(type, fn)
  }
  addListener(type, fn) {
    this.on(type, fn)
  }
  prependListener(type, fn) {
    if (!this.event[type]) {
      this.event[type] = []
    }
    this.event[type].unshift(fn)
  }
  removeListener(type, fn) {
    this.event[type] = this.event[type].filter((item) => itme != fn)
  }
}
```

### Node 中间件

在 NodeJS 中，中间件主要是指封装 http 请求细节处理的方法。我们都知道在 http 请求中往往会涉及很多动作, 如下:

- IP 筛选
- 查询字符串传递
- 请求体解析
- cookie 信息处理
- 权限校验
- 日志记录
- 会话管理中间件(session)
- gzip 压缩中间件(如 compress)
- 错误处理

node 中间件本质上就是在进入具体的业务处理之前，先让`特定过滤器`处理: request -> middleware1 -> middleware2 -> response

```js
const m1 = (req, res, next) => {
  console.log("m1")
  next()
}

const m2 = (req, res, next) => {
  console.log("m2")
  next()
}

const middlewares = [m1, m2]

function useApp(req, res) {
  const next = () => {
    // 获取第一个中间件
    const middleware = middlewares.shift()
    if (middleware) {
      return Promise.resolve(middleware(req, res, next))
    } else {
      return Promise.reject("end")
    }
  }
  next()
}
```

### Node 事件循环机制

EVENT_LOOP TASK_QUENE

1. timers: setTimeout setInterval
2. IO cb
3. 闲置事件: idle 系统内部
4. poll: 轮询阶段
5. check: setImmediate
6. close cb: socket.on("end")

每个阶段 都会执行对应的队列

`process.nextTick` 插队的逻辑

```js
async function async1() {
  console.log("async1 start")
  await async2()
  console.log("async1 end")
}

async function async2() {
  console.log("async2")
}

console.log("script start")

setTimeout(function () {
  console.log("setTimeout")
}, 0)

setTimeout(function () {
  console.log("setTimeout2")
}, 200)

setImmediate(() => console.log("setImmediate"))

process.nextTick(() => console.log("nextTick1"))

async1()

process.nextTick(() => console.log("nextTick2"))

new Promise((resolve) => {
  console.log("promise1")
  resolve()
  console.log("promise2")
}).then(() => {
  console.log("promise3")
})
console.log("script end")

// script start
// async1 start
// async2
// promise1
// promise2
// script end
// nextTick1
// nextTick2
// async1 end
// promise3
// setTimeout
// setImmediate
// setTimeout2
```

### Node 的优化

1. 使用最新版本的 Node.js
2. Stream
3. 代码层面
4. 内存层面

### Node 的文件上传

- `content-type: "multipart/form-data"`

```js
const html = `
<form action="" method="post" enctype="multipart/form-data"></form>
`

router.post("/upload", async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path)
  let filePath = path.join(__dirname, "public/upload/" + `/${file.name}`)
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)
  return (ctx.body = "上传成功")
})
```
