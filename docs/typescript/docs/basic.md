# 基础

## 原始数据类型

```ts
let isEnabled: boolean = true;
let user: string = 'PPG007';
let age: number = 23;
function voidFunc(message: string): void {
  console.log(message);
}
let u: undefined = undefined;
let n: null = null;
```

::: tip

在非严格模式下，可以将 undefined 赋值给其他类型变量，需要在项目中有一个 `tsconfig.json` 配置文件，使用下面的配置关闭严格模式：

```json
{
  "compilerOptions": {
    "strict": false
  }
}
```

:::

## 任意值

如果是一个普通类型，在赋值过程中改变类型是不被允许的，但是对于 any 类型是可以的。

```ts
let x: any = 123;
x = '123';
```

变量如果在声明的时候没有指定类型那么就会被识别为任意类型。

## 类型推论

如果没有明确指定类型，那么会依照类型推论的规则推断出是什么类型：

```ts
let x = 1;
x = '7'; // error
```

::: tip

如果声明时不赋值那么将被推断为 any 类型。

```ts
let x;
x = 1;
x = '7';
```

:::

## 联合类型

联合类型表示取值可以是多种类型中的一种。

```ts
let x: string | number;
x = '123';
x = 123;
```

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型的共有属性或方法。

```ts
// error
function demo(x: string | number): void {
  console.log(x.length);
}
// ok
function demo(x: string | number): void {
  console.log(x.toString());
}
```

联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型。

```ts
let x: string | number;
x = '123';
console.log(x.length);
x = 123;
// error， 此时推断 x 为 number
console.log(x.length);
```

## 接口

TypeScript 使用接口来定义对象的类型。TypeScript 除了用于对类的一部分进行抽象，还可以对对象的形状进行描述。

```ts
interface Person {
  name: string;
  age: number;
}

// 定义的变量必须和接口里的一样
let me: Person = {
  name: 'PPG007',
  age: 23,
};
```

如果希望某些字段是可选的，那么可以使用可选属性：

```ts
interface Person {
  name: string;
  age: number;
  city?: string;
}

let me: Person = {
  name: 'PPG007',
  age: 23,
};
```

如果希望某些字段只能在创建的时候赋值，那么可以使用只读属性：

```ts
interface Person {
  readonly name: string;
  age: number;
  city?: string;
}

let me: Person = {
  name: 'PPG007',
  age: 23,
};
// error
me.name = '123';
```

如果希望一个接口允许任意的属性：

```ts
interface Person {
  [propName: string]: string | number;
}

let me: Person = {
  name: 'PPG007',
  age: 23,
};
```

一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型。

## 数组的类型

基础表示法：

```ts
let arr: number[];
arr = [1, 2, 3];
// error
arr.push('123');
```

数组泛型：

```ts
let arr: Array<string>;
arr.push('123');
// error
arr.push(123);
```

用接口表示数组：

```ts
interface StringArray {
  [index: number]: string;
}

let arr: StringArray = ['1', '2'];
```

any 数组：

```ts
let list: any[] = [1, '2', false, { user: '123' }];
```

## 函数的类型

### 函数声明

```ts
function sum(a: number, b: number): number {
  return a + b;
}

sum(1, 2);
```

::: warning

多余的或者少于的参数输入是不被允许的。

:::

### 函数表达式

```ts
let sum: (a: number, b: number) => number = function (a, b) {
  return a + b;
};
console.log(sum(2, 4));
```

::: tip

在 TypeScript 的类型定义中，`=>` 表示函数的定义，左边是参数类型，右边是返回值类型。

:::

### 用接口定义函数

```ts
interface Sum {
  sumNumber: (a: number, b: number) => number;
  sumString: (a: string, b: string) => string;
}

let sumImpl: Sum = {
  sumNumber(a, b) {
    return a + b;
  },
  sumString(a, b) {
    return `${a}${b}`;
  },
};

console.log(sumImpl.sumNumber(1, 2));
console.log(sumImpl.sumString('1', '2'));
```

### 可选参数

```ts
function sub(a: number, b: number, abs?: boolean): number {
  if (!abs) {
    return a - b;
  }
  return Math.abs(a - b);
}
console.log(sub(1, 2));
console.log(sub(1, 2, true));
```

::: warning

可选参数必须在必需参数后面，可选参数后不能再有必需参数。

:::

### 参数默认值

```ts
function sub(a: number, b: number = 100, abs?: boolean): number {
  if (!abs) {
    return a - b;
  }
  return Math.abs(a - b);
}
console.log(sub(1));
console.log(sub(1, 10, true));
```

### 剩余参数

```ts
function sum(...nums: number[]): number {
  let total: number = 0;
  nums.forEach(num => {
    total += num;
  });
  return total;
}
console.log(sum(1, 2, 3, 4));
console.log(sum());
```

::: warning

剩余参数只能是最后一个参数。

:::

### 重载

```ts
function sum(a: number, b: number): number;
function sum(a: string, b: string): string;
function sum(a: number | string, b: number | string): number | string {
  if (typeof a == 'number') {
    return Number(a) + Number(b);
  }
  return a.concat(String(b));
}
console.log(sum(1, 2));
console.log(sum('1', '2'));
```

## 类型断言

类型断言可以用来手动指定一个值的类型。

语法：`${value} as ${type}` 或者 `<${type}>${value}`，建议使用前一种。

将联合类型断言为其中一个类型：

```ts
function sum(a: number, b: number): number;
function sum(a: string, b: string): string;
function sum(a: number | string, b: number | string): number | string {
  if (typeof a == 'number') {
    return <number>a + <number>b;
  }
  return a.concat(String(b));
}
```

将一个父类断言为更加具体的子类：

```ts
class HttpError extends Error {
  code: number = 200;
}

function isHttpError(err: Error): boolean {
  if (typeof (err as HttpError).code == 'number') {
    return true;
  }
  return false;
}
console.log(isHttpError(new HttpError()));
```

将任何一个类型断言为 any：

当我们确定一个属性或者方法存在时，可以将对象断言为 any 类型，在 any 变量上，访问任何属性都是允许的。

```ts
(window as any).foo = 1;
```

将 any 断言为一个具体的类型：

```ts
let cache: any[] = ['123'];
console.log((cache[0] as string).length);
```

类型断言的限制：

- 联合类型可以被断言为其中一个类型。
- 父类可以被断言为子类。
- 任何类型都可以被断言为 any。
- 要使得 `A` 能够被断言为 `B`，只需要 `A` 兼容 `B` 或者 `B` 兼容 `A` 即可。

::: tip

兼容可以理解为结构相同。

:::

### 双重断言

any 可以断言为任意类型，任意类型可以断言为 any，所以任意类型可以断言为 any 后在断言为其他任意类型：

```ts
interface Cat {
  run(): void;
}
interface Fish {
  swim(): void;
}

function testCat(cat: Cat) {
  return (cat as any as Fish).swim();
}
```

尽管两个类型并不兼容，但是还是能断言成功，不建议使用。

### 断言与类型转换

类型断言只会影响 TypeScript 编译时的类型，类型断言语句在变异结果中会被删除。

如果真的希望类型转换应该调用类型转换的方法。

### 断言与类型声明

类型声明比断言更加严格，如果向一个 `A` 类型的变量赋值一个 `B` 类型的变量，则 `A` 必须兼容 `B`。

```ts
interface Animal {
  name: string;
}
interface Cat {
  name: string;
  run(): void;
}

const animal: Animal = {
  name: 'tom',
};
// ok
let tom1: Cat = animal as Cat;
// error
let tom2: Cat = animal;
```

## 声明文件

当使用第三方库时，需要引用它的声明文件以获得对应的代码补全、接口提示等功能。

### 示例

如果希望使用 jQuery，一般通过 script 引入后就可以使用全局变量 `$` 或者是 `jQuery` 了，但是在 TypeScript 中，编译器不知道 `$` 和 `jQuery` 是什么，这时我们需要 `declare var` 来定义它的类型。

```ts
declare var $: (selector: string) => any;
declare var jQuery: (selector: string) => any;
$('#foo');
jQuery('body');
```

`declare var` 并不会真的定义一个变量，只是定义了全局变量 `$` 和 `jQuery` 的类型，仅仅用作编译时的检查。

### 声明文件

通常把声明语句放到一个单独的文件中，这个文件就是声明文件，声明文件必须以 `.d.ts` 做后缀。

使用 `@types` 统一管理第三方库的声明文件，以 jQuery 为例：

```shell
# npm
npm install @types/jquery --save-dev
# yarn
yarn add @types/jquery --dev
```

### 书写声明文件

当一个第三方库没有提供声明文件时，就需要自行编写声明文件。

#### 全局变量

通过 `<script>` 标签引入第三方库，注入全局变量。

全局变量主要包含以下语法：

- `declare var` 声明全局变量。
- `declare function` 声明全局方法。
- `declare class` 声明全局类。
- `declare enum` 声明全局枚举类型。
- `declare namespce` 声明（含有子属性的）全局对象。
- `interface` 和 `type` 声明全局类型。

`declare var`：

```ts
declare var accountId: string;
declare const println: (selector: string) => void;
```

当使用 `const` 定义时，表示此全局变量是一个常量，不允许再去修改它的值了。

::: warning

声明语句里只能定义类型，不能在声明语句中定义具体的实现。

:::

`declare function`：

`declare function` 用来定义全局函数的类型。jQuery 其实就是一个函数，所以也可以用 function 来定义：

```ts
declare function jQuery(selector: string): any;
// 支持函数重载
declare function jQuery(domReadyCallback: () => any): any;
```

`declare class`：

当全局变量是一个类的时候，可以用 `declare class` 来定义它的类型。

```ts
// user.d.ts
declare class User {
  constructor(name: string);
  name: string;
  getName(): string;
}
// user.ts
class User {
  constructor(name: string) {
    this.name = name;
  }
  name: string;
  getName(): string {
    return this.name;
  }
}
// main.ts
const user: User = new User('PPG007');
console.log(user.getName());
// tsc user.ts main.ts --outFile=main.js && node main.js
```

`declare enum`：

```ts
// httpCode.d.ts
declare enum HttpCode {
  OK,
  BadRequest,
  InternalServerError,
}
// main.ts
const code: HttpCode = HttpCode.BadRequest;
```

`declare namespace`：

namespace 是早期为了解决模块化而创造的关键字，在早期没有 ES6 的时候，ts 使用 `module` 关键字表示内部模块，后来由于 ES6 也使用 `module` 关键字，ts 将 module 改为 namespace。

namespace 被淘汰了，但是在声明文件中，declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。

比如 jQuery 是一个全局变量，它是一个对象，提供了一个 jQuery.ajax 方法可以调用，那么我们就应该使用 declare namespace jQuery 来声明这个拥有多个子属性的全局变量。

```ts
// axios.d.ts
declare namespace Axios {
  const version: number;
  enum HttpCode {
    OK,
  }
  class Response {
    code: HttpCode;
    Data: any;
  }
  function get(url: string): Response;
}
// main.ts
const resp = Axios.get('url');
resp.code;
```

::: tip

namespace 中可以直接使用 function 声明函数而不是 `declare function`，类似的也可以使用 enum、class、const 等。

:::

如果对象拥有深层的层级，则需要用嵌套的 namespace 来声明深层的属性的类型。

```ts
declare namespace Axios {
  const version: number;
  enum HttpCode {
    OK,
  }
  class Response {
    code: HttpCode;
    Data: any;
  }
  function get(url: string): Response;
  namespace interceptor {
    function run(): void;
  }
}
// main.ts
Axios.interceptor.run();
```

如果只有内层 namespace，可以使用如下声明：

```ts
declare namespace Axios.interceptor {
  function run(): void;
}
```

在声明文件中可以直接使用 `interface` 和 `type` 来声明一个全局接口或类型：

```ts
declare namespace Axios {
  const version: number;
  enum HttpCode {
    OK,
  }
  class Response {
    code: HttpCode;
    Data: any;
  }
  function get(url: string, setting: AxiosSetting): Response;
}
interface AxiosSetting {
  headers?: Object;
}
type AxiosSettingType = {
  headers?: Object;
};
// main.ts
let setting: AxiosSetting = {
  headers: {
    'x-user-name': 'PPG007',
  },
};
Axios.get('url', setting);
```

为了防止命名重复，可以将 `interface` 或 `type` 放到 `namespace` 中：

```ts
declare namespace Axios {
  const version: number;
  enum HttpCode {
    OK,
  }
  class Response {
    code: HttpCode;
    Data: any;
  }
  interface AxiosSetting {
    headers?: Object;
  }
  function get(url: string, setting: AxiosSetting): Response;
}
// main.ts
let setting: Axios.AxiosSetting = {
  headers: {
    'x-user-name': 'PPG007',
  },
};
Axios.get('url', setting);
```

对于 jQuery 这种既是一个函数可以被直接调用，又是一个对象，拥有子属性，那么可以组合多个声明语句，它们会不冲突地合并起来：

```ts
declare function jQuery(selector: string): any;
declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
}
// main.ts
jQuery('#id');
jQuery.ajax('url');
```

#### npm 包

通过 `import foo from 'foo'` 导入，符合 ES6 模块规范。

一般来说，npm 包的声明文件可能存在于两个地方：

- 与该 npm 包绑定在一起，`package.json` 中有 types 字段或者有一个 `index.d.ts` 声明文件。
- 发布到 `@types` 里，尝试安装即可：`npm install @types/XXX --save-dev`。

如果上述方式都无法找到声明文件，那么需要自行编写。

首先新建一个本地 npm 包，使用 `npm init` 或 `yarn init` 初始化，设置 package.json 中 private 为 true，编写 src/index.js（因为声明文件只有在引用 JavaScript 库时才有意义）：

```js
export class StrUtil {
  static lower = source => {
    return source.toLowerCase();
  };

  static upper = source => {
    return source.toUpperCase();
  };

  static reverse = source => {
    return source.split('').reverse().join('');
  };

  static concat = (...source) => {
    return ''.concat(...source);
  };
}
```

然后执行：`npm install -D @babel/core @babel/preset-env @babel/cli` 安装 babel，因为我们需要将 ES6 代码编译成 CommonJS，然后编写 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env"]
}
```

修改 package.json 中 main 字段，改为 dist/index.js（即编译后输出到来的地方），同时添加 scripts：

```json
"scripts": {
  "build": "babel src -d dist"
}
```

最后执行编译：`npm run build`。

然后我们在 TypeScript 项目中执行 `yarn add ../strutil` 引入本地的 JavaScript 包，新建 `types/strutil` 目录，在其中编写声明文件 index.d.ts，npm 包的声明文件有多种写法：

在此之前，需要先配置一下 TypeScript 编译选项：

```json
{
  "compilerOptions": {
    "strict": false,
    "module": "CommonJS",
    "baseUrl": "./",
    "paths": {
      "*": ["types/*"]
    }
  }
}
```

export 导出：

```ts
export class StrUtil {
  static lower(source: string): string;

  static upper(source: string): string;

  static reverse(source: string): string;

  static concat(...source: string[]): string;
}
```

::: tip

npm 包的声明文件与全局变量的声明文件有很大区别。在 npm 包的声明文件中，使用 declare 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。只有在声明文件中使用 export 导出，然后在使用方 import 导入后，才会应用到这些类型声明。

:::

在 main.ts 中引用：

```ts
import { StrUtil } from 'strutil';

console.log(StrUtil.reverse('PPG007'));
```

`declare` 与 `export` 混用：

```ts
declare class StrUtil {
  static lower(source: string): string;

  static upper(source: string): string;

  static reverse(source: string): string;

  static concat(...source: string[]): string;
}

export { StrUtil };
```

`export namespace`：

首先修改一下 StrUtil 包中的 index.js，增加一个内部对象：

```js
static inner = {
    author: 'PPG007'
}
```

然后重新编译、引入后，编写声明文件：

```ts
export namespace StrUtil {
  function lower(source: string): string;

  function upper(source: string): string;

  function reverse(source: string): string;

  function concat(...source: string[]): string;

  namespace inner {
    const author: string;
  }
}
```

在 main.ts 引入：

```ts
import { StrUtil } from 'strutil';

console.log(StrUtil.inner.author);
```

`export default`：

```js
// 在 StrUtil index.js 里增加一个枚举：
export default Object.freeze({
  UPPER: 'UPPER',
  LOWER: 'LOWER',
});
```

然后修改声明文件：

```ts
declare enum Case {
  UPPER,
  LOWER,
}

export default Case;
```

在 main.ts 中引用：

```ts
import Case from 'strutil';

console.log(Case.LOWER);
```

::: warning

只有 `function`、`class`、`interface` 可以直接默认导出，其他变量需要先定义出来再默认导出。

:::

`export =`：

修改一下 StrUtil，改为 CommonJS：

```js
class StrUtil {
  static lower = source => {
    return source.toLowerCase();
  };

  static upper = source => {
    return source.toUpperCase();
  };

  static reverse = source => {
    return source.split('').reverse().join('');
  };

  static concat = (...source) => {
    return ''.concat(...source);
  };
}

module.exports = StrUtil;
```

声明文件：

```ts
declare class StrUtil {
  static lower(source: string): string;

  static upper(source: string): string;

  static reverse(source: string): string;

  static concat(...source: string[]): string;
}
export = StrUtil;
```

main.ts 引用：

```ts
import StrUtil = require('strutil');
console.log(StrUtil.lower('QWE'));
```

#### UMD 库

即可以通过 `<script>` 标签引入又可以通过 `import` 导入。相比于 npm 包的声明文件，我们需要额外声明一个全局变量，`export as namespace`。

UMD 是一种模块规范,使库可以同时支持多种模块加载方案,比较流行的有

- CommonJS:用于 Node.js,通过 require() 导入。
- AMD:用于浏览器,通过 define() 定义和 require() 导入。
- 全局变量:将库暴露为一个全局变量,用于直接在浏览器中使用。

首先修改之前的 strutil：

```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StrUtil = factory();
  }
})(this, function () {
  function StrUtil() {}

  StrUtil.lower = function (source) {
    return source.toLowerCase();
  };

  StrUtil.upper = function (source) {
    return source.toUpperCase();
  };

  // 其他方法...

  return StrUtil;
});
```

然后书写声明文件：

```ts
export as namespace su;
export = su;

declare function su(): string;
declare namespace su {
  function lower(source: string): string;

  function upper(source: string): string;
}
```

然后就可以在 main.ts 中引用了：

```ts
import * as su from 'strutil';

console.log(su.upper('ppg007'));
```

#### 直接扩展全局变量

通过 `<script>` 引入后，改变一个全局变量的结构。

修改 strutil：

```js
String.prototype.reverse = function () {
  return this.split('').reverse().join('');
};
```

编写声明文件：

```ts
export as namespace su;
export class StrUtil {
  static lower(source: string): string;

  static upper(source: string): string;

  static reverse(source: string): string;

  static concat(...source: string[]): string;
}

declare global {
  interface String {
    reverse(): string;
  }
}
```

在 main.ts 中引用：

```ts
import * as su from 'strutil';

console.log(su.StrUtil.upper('ppg').reverse());
```

#### 在 npm 包或 UMD 库中扩展全局变量

引用 npm 包或者 UMD 库后，改变一个全局变量的结构。

对于一个 npm 包或者 UMD 库的声明文件，只有 export 导出的类型声明才能被导入。所以对于 npm 包或 UMD 库，如果导入此库之后会扩展全局变量，则需要使用另一种语法在声明文件中扩展全局变量的类型，那就是 declare global。

修改 strutil：

```js
export class StrUtil {
  static lower = source => {
    return source.toLowerCase();
  };

  static upper = source => {
    return source.toUpperCase();
  };

  static reverse = source => {
    return source.split('').reverse().join('');
  };

  static concat = (...source) => {
    return ''.concat(...source);
  };
}

globalThis.author = 'PPG007';
```

编写声明文件：

```ts
export as namespace su;
export class StrUtil {
  static lower(source: string): string;

  static upper(source: string): string;

  static reverse(source: string): string;

  static concat(...source: string[]): string;
}

declare global {
  const author: string;
}
```

在 main.ts 中引用：

```ts
import * as su from 'strutil';

console.log(su.StrUtil.upper('ppg'));
console.log(author);
```

#### 模块插件

通过 `<script>` 或 `import` 导入后，改变另一个模块的结构。

修改 strutil：

```js
import moment from 'moment';

moment.yesterday = function () {
  return moment().subtract(1, 'day');
};
export default moment;
```

编写声明文件：

```ts
import moment = require('moment');

declare module 'moment' {
  function yesterday(): moment.Moment;
}

export default moment;
```

main.ts:

```ts
import moment from 'strutil';

console.log(moment.yesterday().toISOString());
```

#### 声明文件中的依赖

除了使用 import 导入另一个声明文件中的类型之外，还可以使用三斜线指令。

与 import 的区别是，当且仅当在以下几个场景下，我们才需要使用三斜线指令替代 import：

- 当我们在书写一个全局变量的声明文件时。
- 当我们需要依赖一个全局变量的声明文件时。

书写一个全局变量的声明文件：

在全局变量的声明文件中，是不允许出现 import, export 关键字的。一旦出现了，那么他就会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。故当我们在书写一个全局变量的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线指令了。

修改 strutil：

```js
export function foo(arg) {
  console.log(arg);
}
```

声明文件：

```ts
/// <reference types="moment"/>

export function foo(p: moment.Moment): void;
```

main.ts：

```ts
import moment = require('moment');
import { foo } from 'strutil';
foo(moment());
```

::: warning

注意，三斜线指令必须放在文件的最顶端，三斜线指令的前面只允许出现单行或多行注释。

:::

依赖一个全局变量的声明文件：

在另一个场景下，当我们需要依赖一个全局变量的声明文件时，由于全局变量不支持通过 import 导入，当然也就必须使用三斜线指令来引入了。

首先安装 nodejs 类型声明：

```shell
yarn add @types/node --dev
```

```ts
// types/node-plugin/index.d.ts

/// <reference types="node" />

export function foo(p: NodeJS.Process): string;
```

main.ts：

```ts
import { foo } from 'strutil';
foo(process);
```

#### 自动生成声明文件

如果库本身就就是 TypeScript 变下的，那么可以自动生成声明文件。

修改 strutil 为一个纯 TypeScript 项目：

src/bar/index.ts：

```ts
export function bar(): string {
  return 'bar';
}
```

src/index.ts：

```ts
export * from './bar';

export function foo(): string {
  return 'foo';
}
```

tsconfig.json：

```json
{
  "compilerOptions": {
    "strict": false,
    "outDir": "lib",
    "declaration": true,
    "module": "CommonJS"
  }
}
```

修改 package.json main 字段，指向 lib/index.js。

默认情况下，对于一个库会去先找最外层的 index.d.ts，没找到的话再去找 main 文件的目录中的 index.d.ts，如果再没有找到就会视为一个没有声明文件的库。

如果声明文件名字不是 index.d.ts，需要修改 package.json，例如修改 lib/index.d.ts 为 lib/foo.d.ts：

```json
{
  "name": "strutil",
  "version": "1.0.0",
  "main": "lib/index.js",
  "license": "MIT",
  "private": true,
  "types": "lib/foo.d.ts"
}
```

## 内置对象

TypeScript 核心库的定义文件中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。在使用一些常用的方法的时候，TypeScript 实际上已经帮你做了很多类型判断的工作。

Node.js 不是内置对象的一部分，如果想用 TypeScript 写 Node.js，则需要引入第三方声明文件。

```shell
npm install @types/node --save-dev
```
