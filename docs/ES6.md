# ES6

## let 和 const 命令

暂时性死区：只要一个代码块中存在 let 命令，这个区块对这些命令声明的变量从一开始就形成了封闭作用域，如果在声明前使用这些变量就会报错。

区块内定义的方法只能在区块内调用（如果将函数赋给一个 let 变量才会有这个限制）。

const 命令声明一个不可变的变量，声明同时要初始化，不初始化会报错。

## 变量的解构赋值

### 数组的解构赋值

解构：按照一定模式，从数组和对象中提取值，对变量进行赋值。

只要等号两边模式相同，就能够解构成功；如果解构失败，变量就会被赋值为 undefined。

解构赋值在左边括号中可以指定默认值：

```javascript
let [x, y = 'b'] = ['a', undefined]
```

如果赋值为 undefined 则默认值仍然会生效，如果赋值为 null 则默认值失效，赋值为 null。默认值也可以引用其他变量但是这个变量必须已经声明。

### 对象的解构赋值

对象解构属性没有次序，变量与属性同名就能取到正确的值。

```javascript
let {account, password, account: username} = {account: '1658', password: '123456'}
```

如果变量名与属性名不一致要使用 `${右边已有的属性名}: ${变量名}` 的形式。

### 字符串的解构赋值

字符串也可以解构赋值，此时字符串被转换成了一个类似数组的对象：

```javascript
const [a, b, c, d, e] = 'hello'
const {length: len} = 'hello'// len = 5
```

### 数值和布尔值的解构赋值

解构赋值时，如果等号右边是数值和布尔值，则会先转为对象，只要等号右边的值不是对象或数组就先把它转为对象，由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值都会报错。

### 函数参数的解构赋值

```javascript
function add([x, y]) {
  console.log(x + y);
}
function move({x = 0, y = 0} = {}) {
  console.log([x ,y]);
}
```

## 字符串的扩展

### 模板字符串

大括号中的内部就是执行 JavaScript 的代码，如果存在错误就会报错。

### 字符串的新增方法

- includes()、startsWith()、endsWith()：
    - includes：返回布尔值，表示是否找到了参数字符串。
    - startsWith：返回布尔值，表示参数字符串是否在原字符串的头部。
    - endsWith：返回布尔值，表示参数字符串是否在原字符串的尾部。
    - 三个方法都支持通过第二个参数指定开始搜索的位置。
- repeat()：返回一个新字符串，表示将原字符串重复指定的次数，如果是小数会取证，负数会报错。
- padStart()、padEnd()：分别用于头部、尾部补全，接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。
- trimStart()、trimEnd()：消除字符串头部和尾部的空格，返回新字符串，不修改原始字符串。

## 函数的扩展

### 函数参数的默认值

```javascript
function add(x, inc = 1) {
  return x + inc
}
```

与解构赋值默认值结合：

```javascript
function add({x, y = 1}) {
  return x + y
}
console.log(add({x:1}));
```

指定了默认值以后，函数的 length 属性将返回没有指定默认值的参数个数。

### 参数的作用域

如果设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域直到初始化结束，这个作用域就会消失。

```javascript
let x = 1;
function foo(x, y = function () { x = 2;}) {
  var x = 3;
  y()
  console.log(x);
}
foo()// 3
console.log(x);// 1
```

在上面的代码中，如果函数中的 x 变量使用 var 声明，那么 foo 参数列表中的 x 变量和方法体内部的 x 变量不是一个变量，而 y 所指向的函数中操作的变量和参数列表中的 x 是一个变量，所以最后输出 3。如果不使用 var 声明，则这两个 x 是一个变量，输出 2。

### rest 参数

使用 `...变量名` 形式定义 rest 参数：

```javascript
function sum(...number) {
  let sum = 0;
  for (const n of number) {
    sum += n;
  }
  return sum;
}
console.log(sum(1,2,3,4,5,6,7,8));
```

rest 参数必须在参数列表最后，函数的 length 属性不包含 rest 参数。

### 箭头函数

由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上大括号：

```javascript
let getUser = (account = 'ppg', password = '123456')=>({account, password})
console.log(getUser());
```

箭头函数注意事项：

- 箭头函数没有自己的 this 对象。
- 不可以当做构造函数，也就是不能 new。
- 不可以使用 arguments 对象，只能用 rest。
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

关于 this：普通函数内部的 this 指向函数运行时所在的对象；箭头函数内部的 this 对象是定义时上层作用域中的 this，箭头函数内部的 this 指向是固定的。

箭头函数可以嵌套，但是无论如何嵌套，this 的指向永远都是指向外部。

箭头函数不适用的场合：

- 定义对象的方法：如果使用箭头函数定义对象的方法，因为对象不构成单独的作用域，会导致箭头函数定义时的作用域是全局作用域，其中的 this 就指向了全局对象。
- 需要动态 this 的时候，例如事件监听函数。

## 数组的扩展

### 扩展运算符

扩展运算符是三个点，将一个数组变为参数序列：

```javascript
console.log(...[1, 2, 3, 4]);
function push(array, ...items) {
  array.push(...items)
  for (const x of array) {
    console.log(x);
  }
}
function add(x, y) {
  return x + y
}
push([], ...[1, 2, 3, 4])
console.log(add(...[4, 3, 2, 1]));
```

扩展运算符的应用：

- 复制数组：

```javascript
let a1 = [1, 2, 3, 4]
let a2 = [...a1]
```

- 合并数组：

```javascript
a1 = [{foo: 1}]
a2 = [{bar: 2}]
a3 = [...a1, ...a2]
```

- 与解构赋值结合：

```javascript
const [first, ...rest] = [1, 2, 3, 4, 5]
```

- 字符串：扩展运算符可以将字符串转为真正的数组。

```javascript
console.log([...'hello']);
```

- 实现了 Iterator 接口的对象：任何定义了遍历器接口的对象都可以使用扩展运算符转为真正的数组。

```javascript
function User(name) {
  this.name=name
}

User.prototype[Symbol.iterator] = function *() {
  let i = 0;
  while (i < 10) {
    ++i
    yield this.name
  }
}
console.log([...new User('PPG')]);
```

### 数组实例的 find() 和 findIndex()

- find 方法用于找出第一个符合条件的数组成员，它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为 true 的成员，然后返回这个成员，如果没有符合条件的就返回 undefined。
- findIndex 方法返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件就返回 -1.
- 这两个方法都可以接受第二个参数，用来绑定回调函数的 this 对象。

### 数组实例的 includes()

此方法返回一个布尔值，表示某个数组是否包含给定的值。该方法可以接受第二个参数表示搜索的起始位置，如果是负数就表示倒数的位置。

## 对象的扩展

### super 关键字

指向当前对象的原型对象。super 表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错，而且只有对象方法的简写形式才可以。

### 对象的扩展运算符

解构赋值：

```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```

如果等号右边是 undefined 或 null 就会报错，因为它们无法转成对象，而且左侧解构赋值必须是最后一个参数。解构赋值的拷贝同样是浅拷贝。扩展运算符的解构赋值不能复制从原型对象继承的属性，但是普通的解构赋值可以

扩展运算符：对象的扩展运算符用于取出参数对象的所有可比案例属性拷贝到当前对象之中。由于数组是特殊的对象，所以对象的扩展运算符也可以用于数组。

## 对象的新增方法

### Object.assign()

此方法用于对象的合并，将原对象的所有*可枚举属性*复制到目标对象，第一个参数是目标对象，后面都是源对象，后面的属性会覆盖前面的属性。不可枚举和继承来的属性是不会拷贝的。

```javascript
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  },
  y: 'test'
};
const obj = {
  x: 'world',
  foo() {
    super.foo();
  }
}
Object.setPrototypeOf(obj, proto);
let backup = {}
Object.assign(backup,obj)
console.log(backup);
console.log(backup.y);
```

注意事项：

- 此方法是浅拷贝，如果源对象的某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。
- 一旦遇到同名属性，那么将会进行替换，整体替换整体。
- 因为数组是特殊的对象，当为这个方法传入数组时，两个数组的对应位置上的内容会发生替换。
- 这个方法只能进行值的复制，如果要复制的值是一个 getter 函数，那么会先执行这个函数再复制而不是复制这个函数。

常见用途：

- 为对象添加属性。
- 为对象添加方法。
- 克隆对象。
- 合并多个对象。
- 为属性指定默认值。

### Object.keys()、Object.values()、Object.entries()

- Object.keys()：返回一个数组，成员是参数对象自身的所有可遍历属性的键名。

    ```javascript
    for (const key of Object.keys(obj)) {
      console.log(key);
    }
    ```

- Object.values()：返回一个数组，成员是参数对象自身的所有可遍历属性的键值。

    ```javascript
    for (const value of Object.values(obj)) {
      console.log(value);
    }
    ```

- Object.entries()：返回一个数组，成员是参数对象自身的所有可遍历属性的键值对数组。

    ```javascript
    for (const [key, value] of Object.entries(obj)) {
      console.log([key, value]);
    }
    ```

## 运算符的扩展

### 链判断运算符

```javascript
const message = {
  body: {
    user: {
      firstName: 'zhuang'
    }
  }
}
console.log(message?.body?.user?.firstName || 'null');
console.log(message?.body?.user?.lastName || 'null');
```

如果左侧对象为 null 或者 undefined，就不再往下运算而是返回 undefined。

### Null 判断运算符

只有运算符左侧的值为 null 或 undefined 时，才会返回右侧的值。

```javascript
console.log(message?.body?.demo??'no');
```

### 逻辑赋值运算符

- 或赋值运算符：`||=`。
- 与赋值运算符：`&&=`。
- Null 赋值运算符：`??=`。

逻辑赋值运算符先进行逻辑运算，再根据情况进行赋值运算。

## Map

Map 可以设置任意类型的键，而不只是字符串。任何具有 Iterator 接口且每个成员都是一个双元素的数组的数据结构都可以当做 Map 构造函数的参数。

```javascript
map.set(['a'], 555)
console.log(map.get(['a']));// undefined
```

如果键是对象类型，那么值相同的对象可能会被看作不同的键，因为它们在内存中的地址不一样。所有的 NaN 都是一个键。

### 与其他数据结构的互相转换

- Map 转数组：扩展运算符。
- 数组转 Map：将数组传入 Map 构造函数。
- Map 转为对象：如果所有的键都是字符串就可以无损的转换。
- 对象转为 Map：将对象传入 `Object.entries()` 方法并将返回值传入 Map 构造函数。
- Map 转 JSON：如果 Map 的键名都是字符串可以先转为对象再转为 JSON；如果键中存在非字符串可以选择转为数组 JSON。

    ```javascript
    const map = new Map();
    map.set('name','ppg')
    map.set(['a','b'], 555)
    map.set(message,true)
    console.log(JSON.stringify([...map]));// [["name","ppg"],[["a","b"],555],[{"body":{"user":{"firstName":"zhuang"}}},true]]
    ```

- JSON 转 Map：JSON 转对象然后再转为 Map。

## Promise 对象

### 基本用法

Promise 对象是一个构造函数，用来生成 Promise 实例。Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。

- resolve 函数的作用是将 Promise 对象的状态从“未完成”变成“成功”，在异步操作成功时调用，并将异步操作的结果作为参数传递出去。
- reject 函数的作用是将 Promise 对象的状态从“未完成”变成“失败”。

Promise 实例生成以后可以用 then 方法分别制定 resolved 状态和 rejected 状态的回调函数。then 方法接受两个回调函数作为参数，第一个回调函数对应 resolved，第二个回调函数对应 rejected。Promise 创建后会立即执行，then 方法指定的回调函数会在当前脚本所有同步任务执行完才会执行。

### then 方法

then 方法返回的是一个新的 Promise 实例，不是原来那个 Promise 实例，因此可以采用链式写法。

### catch 方法

catch 方法相当于 then 方法的第一个参数为 null 或 undefined，用于指定发生错误时的回调函数，如果 Promise 已经是 resolved 状态，再抛出错误是无效的，等于没有抛出。

Promise 对象的错误有“冒泡”性质，会一直向后传递，直到被捕获为止，错误总是会被下一个 catch 语句捕获。

如果没有使用 catch 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码。

### finally 方法

finally 方法用于指定一定会执行的操作。

### Promise.all 方法

all 方法用于将多个 Promise 实例包装成一个新的 Promise 实例。

all 方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

如果多个 Promise 中有一个是 rejected，最终结果就是 rejected。

## async 函数

### 基本用法

async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数，当函数执行的时候，一旦遇到 await 就会先返回，等到异步操作完成再接着执行函数体内后面的语句。

```javascript
async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 5000);
```

### 语法

async 函数返回一个 Promise 对象，函数内部 return 语句返回的值会成为 then 方法回调函数的参数。

async 函数内部抛出错误会导致返回的 Promise 对象变为 reject 状态，抛出错误的对象会被 catch 方法回调函数收到。

async 函数返回的 Promise 对象必须等到内部所有 await 命令后面的 Promise 对象执行完才会发生状态改变，除非遇到 return 语句或者抛出错误，只有 async 函数内部的异步操作执行完才会执行 then 方法指定的回调函数。

await 命令后面的 Promise 对象如果变成 reject 状态，则 reject 的参数会被 catch 方法的回调函数接收到。而且只要任何一个 await  语句后面的 Promise对象变为 reject 状态，那么整个 async 函数都会中断执行。

如果希望即使前面的异步操作失败也不中断后面的异步操作可以将前面的 await 放在 try...catch 结构里。

await 后面的异步操作出错等同于 async 函数返回的 Promise 对象被 reject。

使用注意点：

- 最好把 await 命令放在 try 代码块中。
- 多个 await 命令后面的异步操作如果不存在先后关系最好同时触发。
- await 命令只能用在 async 函数。
- async函数可以保留运行堆栈。

## Class 的基本语法

constructor() 方法是类的默认方法，通过 new 命令生成对象实例时自动调用该方法，一个类必须具有 constructor 方法，如果没有显式定义，一个空的 constructor() 方法会被默认添加。构造器可以返回其他实例对象。

类内部可以使用 get 和 set 关键字对某个属性设置修改函数和取值函数，拦截该属性的取值行为。

注意点：

- 严格模式：类和模块的内部默认就是严格模式。
- 不存在变量提升。
- 某个方法前添加星号就表示这个方法是一个 Generator 函数。
- 类的方法内部如果含有 this，默认指向类的实例，一旦单独使用可能会报错，这样可以考虑箭头函数。

静态方法：在方法前加上 static 关键字表示该方法不会被实例继承，如果静态方法中包含 this 关键字，这个 this 指的是类而不是实例。静态方法可以被继承。

静态属性：在属性声明前面添加 static 关键字

## Class 的继承

使用 `extends` 关键字完成继承，子类必须在构造器中调用 super 方法，并且调用 super 之前不能使用 this，因为子类自己的 this 对象必须先通过父类的构造函数完成塑造然后再加工，super 中的 this 指的是子类的实例。

super 指向父类的原型对象，所以定义在父类实例上的方法或属性是无法通过 super 调用的。在子类普通方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类实例。

```javascript
class Animal{
  constructor(name){
    this.name = name
  }
  show(){
    console.log(this.name);
  }
}
class Dog extends Animal{
  constructor(name,sound){
    super(name)
    this.sound=sound
  }
  show(){
    console.log(this.name,this.sound);
  }
}
```

从子类获取父类：`Object.getPrototypeOf()`：

```javascript
Object.getPrototypeOf(Dog)
```

## Module 的语法

### export 命令

export 命令的常见写法：

- 逐个导出：

```javascript
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
```

- 合并导出：

```javascript
export { firstName, lastName, year };
```

- 重命名导出：

```javascript
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

- 默认导出：一个模块只能有一个默认导出，在 import 时可以不指定要引入的模块名。

```javascript
export default foo;
```
