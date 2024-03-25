---
outline: deep
---

## TSconfig 配置

### files

使用 `files` 我们可以描述本次包含的所有文件，但不能使用 src 或者 src/\* 这种方式，每个值都需要是完整的文件路径，适合在小型项目时使用

```json
{
  "compilerOptions": {},
  "files": ["src/index.ts", "src/handler.ts"]
}
```

### include

你的文件数量较多，或者分散在各个文件夹，此时可以使用 `include` 和 `exclude` 进行配置，在这里可以传入文件夹或者 `src/*` 这样的 `glob pattern`，也可以传入完整的文件路径

```json
// src/**/* 表示匹配 src下所有的合法文件，而无视目录层级
{
  "include": ["internal/*", "src/**/*", "generated/*.ts"]
}
```

### exclude

可以使用 exclude 配置，来从被 include 匹配到的文件中再移除一部分

```json
{
  "include": ["src/**/*", "generated/*.ts", "internal/*"],
  "exclude": ["src/file-excluded", "/**/*.test.ts", "/**/*.e2e.ts"]
}
```

### baseUrl

可以定义文件进行解析的根目录，它通常会是一个相对路径，然后配合 tsconfig.json 所在的路径来确定根目录的位置

```text
project
├── out.ts
├── src
├──── core.ts
└── tsconfig.json
```

在这个结构下，如果配置为 `"baseUrl": "./"`，根目录就会被确定为 project, 可以通过这一配置，在导入语句中使用相对 baseUrl 的解析路径

```json
{
  "baseUrl": "./"
}
```

```ts
// out.ts 中，你就可以直接使用基于根目录的绝对路径导入文件
import "src/core" // TS 会自动解析到对应的文件，即 "./src/core.ts"
```

### rootDir

rootDir 配置决定了项目文件的根目录，默认情况下它是项目内**包括**的所有 .ts 文件的最长公共路径，这里有几处需要注意：

1. **包括**指的是 include 或 files 中包括的 .ts 文件，这些文件一般来说不会和 tsconfig.json 位于同一目录层级
2. 不包括 `.d.ts` 文件，因为声明文件可能会和 tsconfig.json 位于同一层级

最长公共路径又是什么？简单地说，它就是某一个`包含了所有被包括的 .ts 文件的文件夹`，TypeScript 会找到这么一个文件夹，默认将其作为 rootDir。

```text
PROJECT
├── src
│   ├── index.ts
│   ├── app.ts
│   ├── utils
│   │   ├── helpers.ts
├── declare.d.ts
├── tsconfig.json

rootDir 会被推断为 src。
```

```text
PROJECT
├── env
│   ├── env.dev.ts
│   ├── env.prod.ts
├── app
│   ├── index.ts
├── declare.d.ts
├── tsconfig.json

rootDir 会被推断为 ., 即 tsconfig.json 所在的目录
```

构建产物的目录结构会受到这一配置的影响，假设 outDir 被配置为 dist,

在上面的第一种情况下，最终的产物会被全部放置在 dist 目录下，保持它们在 src（也就是 rootDir） 内的目录结构

```text
PROJECT
├── dist
│   ├── index.js
│   ├── index.d.ts
│   ├── app.js
│   ├── app.d.ts
│   ├── utils
│   │   ├── helpers.js
│   │   ├── helpers.d.ts
```

如果你将 rootDir 更改为推导得到的 rootDir 的父级目录，比如在这里把它更改到了项目根目录 `.`。此时 src 会被视为 rootDir 的一部分，因此最终构建目录结构中会多出 src 这一级

```text
PROJECT
├── dist
├── ├──src
│      ├── index.js
│      ├── index.d.ts
│      ├── app.js
│      ├── app.d.ts
│      ├── utils
│      │   ├── helpers.js
│      │   ├── helpers.d.ts
```

需要注意的是，如果你显式指定 rootDir ，需要确保其包含了所有 `“被包括”` 的文件，因为 TypeScript 需要确保这所有的文件都被生成在 outDir 内

```text
PROJECT
├── src
│   ├── index.ts
│   ├── app.ts
│   ├── utils
│   │   ├── helpers.ts
├── env.ts
├── tsconfig.json

如果你指定 rootDir 为 src ，会导致 env.ts 被生成到 <project>/env.js 而非 <project>/dist/env.js
```

### rootDirs

rootDirs 就是复数版本的 rootDir，它接收一组值，并且会将这些值均视为平级的根目录

```json
{
  "compilerOptions": {
    "rootDirs": ["src/zh", "src/en", "src/jp"]
  }
}
```

```text
PROJECT
├── src
│   ├── zh
│   │   ├── locale.ts
│   ├── en
│   │   ├── locale.ts
│   ├── jp
│   │   ├── locale.ts
│   ├── index.ts
├── tsconfig.json

使用 rootDirs，TypeScript 还是会隐式地推导 rootDir，此时它的值为 rootDirs 中所有文件夹最近的公共父文件夹，在这里即是 src
```

它主要用于实现`多个虚拟目录的合并解析`

```text
PROJECT
├── src
│   ├── locales
│   │   ├── zh.locale.ts
│   │   ├── en.locale.ts
│   │   ├── jp.locale.ts
│   ├── index.ts
│── generated
│   ├── messages
│   │   ├── main.mapper.ts
│   │   ├── info.mapper.ts
├── tsconfig.json

locales 下存放我们定义的每个语言的对应翻译

generated/messages 则是通过扫描项目获得所有需要进行代码替换位置后生成的映射关系

.locale.ts 文件中会导入其中的 mapper 文件来生成对应的导出
```

虽然现在 locale 文件和 mapper 文件被定义在不同的目录下，但在构建产物中它们实际上是位于同一层级的

```text
│── dist
│   ├── zh.locale.js
│   ├── en.locale.js
│   ├── jp.locale.js
│   ├── main.mapper.js
│   ├── info.mapper.js
```

这也就意味着，我们应当是在 locale 文件中直接通过 `./main.mapper` 的路径来引用 mapper 文件的，而不是 `../../generated/messages/main.mapper.ts` 这样

```json
// 利用 rootDirs 配置来让 TS 将这两个相隔甚远的文件夹视为处于同一目录下
// 不会影响实际的产物生成，它只会告诉 TS 将这两个模块视为同一层级下（类型定义层面）
{
  "compilerOptions": {
    "rootDirs": ["src/locales", "generated/messages"]
  }
}
```

### types 和 typeRoots

默认情况下，TypeScript 会加载 `node_modules/@types/` 下的所有声明文件，包括嵌套的 `../../node_modules/@types` 路径，这么做可以让你更方便地使用第三方库的类型。但如果你希望只加载实际使用的类型定义包，就可以通过 types 配置：

```json
// 在这种情况下，只有 @types/node、@types/jest 以及 @types/react 会被加载
{
  "compilerOptions": {
    "types": ["node", "jest", "react"]
  }
}
```

即使其他 `@types/` 包没有被包含，它们也仍然能拥有完整的类型，但其中的全局声明（如 `process，expect，describe` 等全局变量）将不会被包含，同时也无法再享受到基于类型的提示

如果你甚至希望改变加载 `@types/` 下文件的行为，可以使用 `typeRoots` 选项，其默认为 `@types`，即指定 `node_modules/@types` 下的所有文件（仍然包括嵌套的）

```json
// 会尝试加载 node_modules/@types/react 以及 ./node_modules/@team-types/react 、./typings/react 中的声明文件，注意我们需要使用相对于 baseUrl 的相对路径
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@team-types",
      "./typings"
    ],
    "types": ["react"],
    "skipLibCheck": true
  }
}
```

### moduleResolution

这一配置指定了`模块的解析策略`，可以配置为 node 或者 classic ，其中 node 为默认值，而 classic 主要作向后兼容用，基本不推荐使用。

`node` 解析模式, 假设我们有个 src/index.js，其中存在基于相对路径 const foo = require("./foo") 的导入, 按照以下顺序解析

1. `/<root>/<project>/src/foo.js` 文件是否存在？
2. `/<root>/<project>/src/foo` 是否是一个文件夹？
   1. 此文件夹内部是否包含 package.json，且其中使用 main 属性描述了这个文件夹的入口文件？
   2. 假设 main 指向 dist/index.js，那这里会尝试寻找 `/<root>/<project>/src/foo/dist/index.js` 文件
   3. 否则的话，说明这个文件不是一个模块或者没有定义模块入口，我们走默认的 /foo/index.js

而对于绝对路径，即 `const foo = require("foo")`，其只会在 node_modules 中寻找，从 `/<root>/<project>/src/node_modules` 开始，到 `/<root>/<project>/node_modules` ，再逐级向上直到根目录

### moduleSuffixes

配置在 4.7 版本被引入，类似于 `moduleResolution` ，它同样影响对模块的解析策略，但仅影响模块的后缀名部分。如以下配置

```json
// 配置在解析文件时，会首先尝试查找 foo.ios.ts，然后是 foo.native.ts，最后才是 foo.ts（注意，需要最后的空字符串""配置）
{
  "compilerOptions": {
    "moduleSuffixes": [".ios", ".native", ""]
  }
}
```

这一配置主要是为了 React Native 配置中的多平台构建配置

### noResolve

默认情况下， TypeScript 会将你代码中导入的文件也解析为程序的一部分，包括 import 导入和三斜线指令的导入，你可以通过禁用这一配置来阻止这个解析过程

```ts
// 开启此配置后，这个指令指向的声明文件将不会被加载！
/// <reference path="./other.d.ts" />
```

### paths

paths 类似于 Webpack 中的 alias，允许你通过 `@/utils` 或类似的方式来简化导入路径

```json
// paths 的解析是基于 baseUrl 作为相对路径的，因此需要确保指定了 baseUrl
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/utils/*": ["src/utils/*", "src/other/utils/*"]
    }
  }
}
```

### resolveJsonModule

可以直接导入 Json 文件，并对导入内容获得完整的基于实际 Json 内容的类型推导

```json
{
  "repo": "TypeScript",
  "dry": false,
  "debug": false
}
```

```ts
import settings from "./settings.json"

settings.debug === true
// 对应的类型报错
settings.dry === 2
```

### preserveConstEnums

常量枚举会在编译时被抹除，对其成员的引用会直接使用原本的值来替换。这一配置项可以改变此行为，让常量枚举也像普通枚举那样被编译为一个运行时存在的对象。

### noEmit 与 noEmitOnError

两个选项主要控制最终是否将构建产物实际写入文件系统中，

- 其中 `noEmit` 开启时将不会写入，但仍然会执行构建过程，因此也就包括了类型检查、语法检查与实际构建过程。
- 而 `noEmitOnError` 则仅会在构建过程中有错误产生才会阻止写入。
- 一个常见的实践是，使用 ESBuild / SWC 等工具进行实际构建，使用 tsc --noEmit 进行类型检查过程

### module

控制最终 JavaScript 产物使用的模块标准，常见的包括 CommonJs、ES6、ESNext 以及 NodeNext 等（实际的值也可以是全小写的形式）。另外也支持 AMD、UMD、System 等模块标准。

### importHelpers 与 noEmitHelpers

TypeScript 在编译时除了抹除类型，还需要基于 target 进行语法降级，这一功能往往需要一些辅助函数，将新语法转换为旧语法的实现， 如 async 函数

- 在能实现语法降级的 Babel 中，这些辅助函数来自于 core-js （原@babel/polyfill） 实现的
- 在 TypeScript 中这些辅助函数被统一封装在了 tslib 中，通过启用 `importHelpers` 配置，这些辅助函数就将从 tslib 中导出而不是在源码中定义，能够有效地帮助减少构建产物体系

### downlevelIteration

ES6 新增了 `for...of` 循环，它可以用于循环遍历所有部署了 `[Symbol.iterator]` 接口的数据结构，如数组、Set、Map，甚至还包括字符串

在默认情况下，如果 target 为 ES5 或更低，for...of 循环会被`降级为`普通的基于索引的 for 循环

预期应当是仍然保留为 for...of 循环，此时就可以启用 downlevelIteration 配置，同时在运行环境中确保 `[Symbol.iterator]` 接口的存在（如通过 polyfill），这样就可以保留 for...of 循环的实现

### importsNotUsedAsValues 与 preserveValueImports

默认情况下，TypeScript 就在编译时去抹除仅类型导入（import type），但如果你希望保留这些类型导入语句，可以通过更改 importsNotUsedAsValues 配置的值来改变其行为。默认情况下，此配置的值为 remove，即对仅类型导入进行抹除。你也可以将其更改为 preserve，这样所有的导入语句都会被导入（但是类型变量仍然会被抹除）。或者是 error，在这种情况下首先所有导入语句仍然会被保留，但会在值导入仅被用于类型时产生一个错误。

### declaration、declarationDir

- 两个选项主要控制声明文件的输出，其中 `declaration` 接受一个布尔值，即是否产生声明文件
- `declarationDir` 控制写入声明文件的路径，默认情况下声明文件会和构建代码文件在一个位置
  - src/index.ts 会构建出 dist/index.js 与 dist/index.d.ts
  - 使用 `declarationDir` 你可以将这些类型声明文件输出到一个独立的文件夹下，如 dist/types/index.d.ts dist/types/utils.d.ts

### 允许类

#### allowUmdGlobalAccess

会允许你直接使用 UMD 格式的模块而不需要先导入, 比如你通过 CDN 引入或是任何方式来确保全局一定会有这个变量

#### allowUnreachableCode

Unreachable Code 通常指的是无法执行到的代码，也称 Dead Code，常见的 Unreachable Code 包括 return 语句、throw 语句以及 process.exit 后的代码

```js
function foo() {
  return 599
  console.log("Dead Code") // Dead Code
}

function bar() {
  throw new Error("Oops!")
  console.log("Dead Code") // Dead Code
}
```

allowUnreachableCode 配置的默认值为 undefined，表现为在编译过程中并不会抛出阻止过程的错误，而只是一个警告。它也可以配置为 true（完全允许）与 false （抛出一个错误）

#### allowUnusedLabels

为了区分 label 与对象字面量，这条规则禁止了声明但没有被实际使用的 label 标记

```js
function verifyAge(age: number) {
  if (age > 18) {
    // Unused label.
    verified: true
  }
}
// 类似于 allowUnreachableCode，这条配置也可使用 undefined（默认）、true、false 三个值，且效果也一致
```

### 禁止类

#### noImplicitAny

在你没有为变量或参数指定类型，同时 TypeScript 也无法自动推导其类型时，这里变量的类型就会被推导为 any。而推导为 any 类型就意味着丧失了类型检查

你希望禁止这一类行为，可以启用 noImplicitAny 配置

#### useUnknownInCatchVariables

启用此配置后，try/catch 语句中 catch 的 error 类型会被更改为 unknown （否则是 any 类型）。这样可以在类型层面确保在 catch 语句中对 error 进行更妥当的处理

```js
try {
  // ...
  // 一个自定义的错误类
  throw new NetworkError()
} catch (err) {
  if (err instanceof NetworkError) {
  }
  if (err instanceof AuthError) {
  }
  if (err instanceof CustomError) {
  }
}
```

#### noFallthroughCasesInSwitch

确保在你的 switch case 语句中不会存在连续执行多个 case 语句的情况

#### noImplicitOverride

在派生类继承于基类时，通常我们不希望去覆盖基类已有的方法（SOLID 原则），这样可以确保在任何需要基类的地方，我们都可以放心地传入一个派生类

noImplicitOverride 这一配置的作用，就是避免你在不使用 override 关键字的情况下就覆盖了基类方法

#### noImplicitReturns

确保所有返回值类型中不包含 undefined 的函数，在其内部所有的执行路径上都需要有 return 语句

```js
// 函数缺少结束 return 语句，返回类型不包括 "undefined"。
function handle(color: "blue" | "black"): string {
  if (color === "blue") {
    return "beats"
  } else {
    ;("bose")
  }
}
```

#### noImplicitThis

noImplicitThis 配置所关注的内容，它确保你在使用 this 语法时一定能够确定 this 的具体类型

#### noPropertyAccessFromIndexSignature 与 noUncheckedIndexedAccess

让对基于索引签名类型声明的结构属性访问更安全一些

- noPropertyAccessFromIndexSignature 配置禁止了对未知属性（如 'unknownProp'）的访问，即使它们已在索引类型签名中被隐式声明。而对于具体声明的已知属性访问，如 name 则不会有问题
- noUncheckedIndexedAccess 配置则宽松一些，它会将一个 undefined 类型附加到对未知属性访问的类型结果上，比如 PropType1 的类型会是 string | undefined

```js
interface AllStringTypes {
  name: string;
  [key: string]: string;
}

type PropType1 = AllStringTypes["unknownProp"] // string
type PropType2 = AllStringTypes["name"] // string
```

### 严格检查

#### exactOptionalPropertyTypes

这一配置会使得 TypeScript 对可选属性（即使用 ? 修饰的属性）启用更严格检查

```ts
// 默认情况下，prefer 属性的类型实际为 "dark" | "light" | undefined
// 启用 exactOptionalPropertyTypes 配置，此时 undefined 不会再被允许作为可选属性的值
interface ITheme {
  prefer?: "dark" | "light"
}
```

#### strictNullChecks

这是在任何规模项目内都应该开启的一条规则。在这条规则关闭的情况下，null 和 undefined 会被隐式地视为任何类型的子类型

在某些可能产生 string | undefined 类型的方法中，如果关闭了 strictNullChecks 检查，就意味着很可能下面会遇到一个 cannot read property 'xxx' of undefined 的错误

### Js 相关

#### allowJs

只有在开启此配置后，你才能在 .ts 文件中去导入 .js / .jsx 文件。

#### checkJs

checkJs 通常用于配合 allowJs 使用，为 .js 文件提供尽可能全面的类型检查。我们在类型指令一节学习过 @ts-check 指令，这一配置就相当于为所有 JavaScript 文件标注了 @ts-check


## TS 内置类型工具

- never 表示一个不存在的类型
- never 与其他类型的联合后，是没有 never 的

```ts
// 将 T 所有属性编程可选的
type Partial<T> = {
  [K in keyof T]?: T[K]
}

// 将 T 所有属性变成只读的
type ReadOnly<T> = {
  readonly [K in keyof T]: T[K]
}

// 挑选一组属性组成新的类型
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 构造一个type，key为联合类型中的每个子类型，类型为T
// 值得注意的是keyof any得到的是string | number | symbol, 原因在于类型key的类型只能为string | number | symbol
type Record<K extends keyof any, T> = {
  [P in K]: T
}

// Exclude null and undefined from T
// 不能为null
type NonNullable<T> = T extends null | undefiend ? never : T

// 提取存在于 T, 但不存在于 U 的类型组成的联合类型
/**
 * 遍历T中的所有子类型，如果该子类型约束于U（存在于U、兼容于U），
 * 则返回never类型，否则返回该子类型
 */
type Exclude<T, U> = T extends U ? never : T
type Eg = Exclude<"key1" | "key2", "key2"> // key1


// Extract<T, U>提取联合类型T和联合类型U的所有交集
type Extract<T, U> = T extneds U ? T : never
type Eg = Extract<'key1' | 'key2', 'key1'> // 'key1'

// Omit<T, K>从类型T中剔除K中的所有属性
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
type Omit<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P]
}

// Parameters 获取函数的参数类型，将每个参数类型放在一个元组中
/**
 * Parameters首先约束参数T必须是个函数类型，所以(...args: any) => any>替换成Function也是可以的
 * 1. 具体实现就是，判断T是否是函数类型，如果是则使用inter P让ts推导出函数的参数类型，并将推导的结果存到类型P上，否则就返回never；
 * 2. infer关键词作用是让Ts推导类型，并将推导结果存储在其参数绑定的类型上
 * 3. infer关键词只能在extends条件类型上使用，不能在其他地方使用
 * 4. type Eg = [arg1: string, arg2: number]这是一个具名元组，多了语义化，而常见的元组是type tuple = [string, number]
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
/**
 * @example
 * type Eg = [arg1: string, arg2: number];
 */
type Eg = Parameters<(arg1: string, arg2: number) => void>;

// ReturnType 获取函数的返回值类型
/**
 * @desc ReturnType的实现其实和Parameters的基本一样
 * 无非是使用infer R的位置不一样。
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R
```
