# 进阶

## 类型别名

类型别名用于给一个类型起个新名字：

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): string {
  if (typeof n == 'string') {
    return n as Name;
  }
  return n();
}
console.log(getName('ppg007'));
console.log(
  getName(() => {
    return 'PPG007';
  })
);
```

## 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个。

```ts
type language = 'Java' | 'TypeScript';
function show(l: language): void {
  console.log(l);
}
show('Java');
```

## 元组

数组合并了相同类型的对象，元组 Tuple 合并了不同类型的对象。

```ts
let tom: [string, number] = ['Tom', 25];

console.log(tom[0].toLowerCase());
console.log(tom[1].toFixed());
```

当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型：

```ts
let tom: [string, number] = ['', 0];
tom.push(20);
console.log(tom);
```

## 枚举

```ts
enum WeekDay {
  Sunday,
  Monday,
  TuesDay,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
console.log(WeekDay['Monday'] === 1); // true
console.log(WeekDay['TuesDay'] === 2); // true
console.log(WeekDay['Saturday'] === 6); // true

console.log(WeekDay[1] === 'Monday'); // true
console.log(WeekDay[2] === 'TuesDay'); // true
console.log(WeekDay[6] === 'Saturday'); // true
```

也可以给枚举项手动赋值，未手动赋值的项的递增步长仍为 1。

```ts
enum WeekDay {
  Monday = 1,
  TuesDay,
  Wednesday,
  Thursday,
  Friday,
  // 手动赋值的枚举项可以不是数字，此时需要使用类型断言来让 tsc 无视类型检查
  Saturday = <any>'6',
}
console.log(WeekDay['Monday'] === 1); // true
console.log(WeekDay['TuesDay'] === 2); // true
console.log(WeekDay['Saturday'] === 6); // false

console.log(WeekDay[1] === 'Monday'); // true
console.log(WeekDay[2] === 'TuesDay'); // true
console.log(WeekDay['6'] === 'Saturday'); // true
```

### 常数项和计算所得项

枚举项有两种类型：常数项（constant member）和计算所得项（computed member）。

计算所得项示例：

```ts
enum Color {
  Red,
  Green,
  Blue = 'blue'.length,
}
```

::: warning

如果紧接在计算所得项后面的是未手动赋值的项，那么它就会因为无法获得初始值而报错：

```ts
enum Color {
  Red,
  Green,
  Blue = 'blue'.length,
  Yellow,
}
```

:::

当满足以下条件时，枚举成员被当作是常数：

- 不具有初始化函数并且之前的枚举成员是常数。在这种情况下，当前枚举成员的值为上一个枚举成员的值加 1。但第一个枚举元素是个例外。如果它没有初始化方法，那么它的初始值为 0。
- 枚举成员使用常数枚举表达式初始化。常数枚举表达式是 TypeScript 表达式的子集，它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常数枚举表达式：- 数字字面量。- 引用之前定义的常数枚举成员（可以是在不同的枚举类型中定义的）如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用。- 带括号的常数枚举表达式。- `+`, `-`, `~` 一元运算符应用于常数枚举表达式。- `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` 二元运算符，常数枚举表达式做为其一个操作对象。若常数枚举表达式求值后为 NaN 或 Infinity，则会在编译阶段报错。
  所有其它情况的枚举成员被当作是需要计算得出的值。

### 常数枚举

常数枚举是使用 const enum 定义的枚举类型，常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

```ts
const enum color {
  Red,
  Green,
  Blue,
}
console.log(color.Blue);
```

编译后：

```js
console.log(2 /* color.Blue */);
```

### 外部枚举

参考[npm 包声明文件 export default](./basic.md#npm-包)

## 类

[ES6 的类](../../es6/docs/class_basic.md)

[Reference](https://es6.ruanyifeng.com/#docs/class)

ES7 中有一些关于类的提案，TypeScript 也实现了它们。

实例属性：

ES6 中实例的属性只能通过构造函数中的 this.xxx 来定义，ES7 提案中可以直接在类里面定义。

```ts
class Animal {
  name = 'Jack';

  constructor() {
    // ...
  }
}

let a = new Animal();
console.log(a.name); // Jack
```

静态属性：

ES7 提案中，可以使用 static 定义一个静态属性。

```ts
class Animal {
  static num = 42;

  constructor() {
    // ...
  }
}

console.log(Animal.num); // 42
```

### 修饰符

TypeScript 可以使用三种访问修饰符：

- `public`：修饰的属性或方法是公有的，可以在任何地方被访问到，默认修饰符。
- `private`：修饰的属性或方法是私有的，不能在声明它的类的外部访问。
- `protocted`：修饰的属性或方法是受保护的，子类中也允许访问。

```ts
class Animal {
  protected name: string;
  public getName(): string {
    return this.name;
  }
  public constructor(name: string) {
    this.name = name;
  }
}

class Cat extends Animal {
  public constructor() {
    super('cat');
    console.log(this.name);
  }
}

console.log(new Animal('123'));
console.log(new Cat());
```

::: tip

当构造函数修饰为 `private` 时，该类不允许被继承或者实例化。

当构造函数修饰为 `protected` 时，该类只允许被继承。

:::

### 参数属性

修饰符和readonly还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值，使代码更简洁。

```ts
class Animal {
  public getName(): string {
    return this.name;
  }
  public constructor(private name: string) {
    this.name = name;
  }
}
console.log(new Animal('123').getName());
```

### readonly

只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。

```ts
class Animal {
  readonly name: string;
  public constructor(name: string) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name);
a.name = '123'; // error
```

::: warning

如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面。

```ts
class Animal {
  public constructor(public readonly name: string) {
    this.name = name;
  }
}
```

:::

### 抽象类

抽象类不能被实例化，抽象方法必须由子类实现。

```ts
abstract class Animal {
  constructor(private readonly name: string) {
    this.name = name;
  }
  public getName(): string {
    return this.name;
  }
  public abstract say(): void;
}

class Cat extends Animal {
  public say(): void {
    console.log('miao');
  }
}

let tom: Animal = new Cat('tom');
tom.say();
```

## 类与接口

### 类实现接口

```ts
interface Alarm {
  alert(): void;
}

class Door {}

class SecurityDoor extends Door implements Alarm {
  alert() {
    console.log('SecurityDoor alert');
  }
}

class Car implements Alarm {
  alert() {
    console.log('Car alert');
  }
}

let a: Alarm;
a = new SecurityDoor();
a.alert();
a = new Car();
a.alert();
```

实现多个接口：

```ts
interface Alarm {
  alert(): void;
}

interface Light {
  lightOn(): void;
  lightOff(): void;
}

class Car implements Alarm, Light {
  alert() {
    console.log('Car alert');
  }
  lightOn() {
    console.log('Car light on');
  }
  lightOff() {
    console.log('Car light off');
  }
}

let car = new Car();
let a: Alarm = car;
let l: Light = car;
a.alert();
l.lightOn();
l.lightOff();
```

### 接口继承接口

```ts
interface Alarm {
  alert(): void;
}

interface Light extends Alarm {
  lightOn(): void;
  lightOff(): void;
}

class Car implements Light {
  alert() {
    console.log('Car alert');
  }
  lightOn() {
    console.log('Car light on');
  }
  lightOff() {
    console.log('Car light off');
  }
}

let car = new Car();
let l: Light = car;
l.lightOn();
l.lightOff();
l.alert();
```

### 接口继承类

```ts
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```

在声明 class Point 时，除了会创建一个名为 Point 的类，还会创建一个名为 Point 的类型，所以接口继承类就相当于接口继承接口。

::: tip

声明类时创建的类型只包含其中的实例属性和实例方法，不包含构造函数、静态属性和静态方法。

:::

## 泛型

简单例子：

```ts
function createArray<T>(): Array<T> {
  return [];
}
let intArray = createArray<number>();
intArray.push(1);
console.log(intArray);
```

### 多个类型参数

```ts
function createTuple<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

let a = createTuple<number, boolean>(2, true);
a.pop();
console.log(a);
```

### 泛型约束

在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性，这时，我们可以对泛型进行约束，只允许这个函数传入那些包含 length 属性的变量。这就是泛型约束：

```ts
interface Alert {
  alert(): string;
}

function log<T extends Alert>(a: T): void {
  console.log(a.alert());
}

class Door implements Alert {
  public alert(): string {
    return 'Door alert';
  }
}

log<Door>(new Door());
log(new Door());
```

多个类型参数之间也可以互相约束，要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段：

```ts
function copyFields<T extends U, U>(target: T, source: U): T {
  for (let id in source) {
    target[id] = (<T>source)[id];
  }
  return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };
copyFields(x, { b: 10, d: 20 });
console.log(x);
```

### 泛型接口

```ts
import { log } from 'console';

interface createArrayFunc {
  <T>(): T[];
}

let fn: createArrayFunc = function <T>(): T[] {
  return [];
};

let arr = fn<boolean>();
arr.push(false);
log(arr);
```

泛型约束也可以放到接口上：

```ts
interface CreateArr<T> {
  create(...items: Array<T>): Array<T>;
  createEmpty(): Array<T>;
}

class CreateNumberArr implements CreateArr<number> {
  public create(...items: number[]): number[] {
    return items;
  }
  public createEmpty(): number[] {
    return [];
  }
}

const fn = new CreateNumberArr();
console.log(fn.create(1, 2, 3));
console.log(fn.createEmpty().push(4));
```

### 泛型类

```ts
class ResponseResult<T> {
  code: number;
  data: T;
  message: string;
}

let resp = new ResponseResult<Map<string, string>>();
resp.code = 200;
resp.message = 'OK';
let data = new Map<string, string>();
data.set('key', 'value');
resp.data = data;
```

### 泛型参数的默认类型

在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

```ts
class ResponseResult<T = string> {
  code: number;
  data: T;
  message: string;
}

let resp = new ResponseResult();
resp.code = 200;
resp.message = 'OK';
resp.data = '123';
console.log(JSON.stringify(resp));
```

## 声明合并

### 函数的合并

可以使用[重载](./basic.md#重载)定义多个函数类型。

### 接口的合并

接口中的属性在合并时会简单的合并到一个接口中：

```ts
interface Alarm {
  price: number;
}
interface Alarm {
  weight: number;
}
```

相当于：

```ts
interface Alarm {
  price: number;
  weight: number;
}
```

::: warning

合并的属性的类型必须是唯一的。

```ts
interface Alarm {
  price: number;
}
interface Alarm {
  price: number; // 虽然重复了，但是类型都是 `number`，所以不会报错
  weight: number;
}
```

```ts
interface Alarm {
  price: number;
}
interface Alarm {
  price: string; // 类型不一致，会报错
  weight: number;
}
```

:::

接口中方法的合并，与函数的合并一样：

```ts
interface Alarm {
  price: number;
  alert(s: string): string;
}
interface Alarm {
  weight: number;
  alert(s: string, n: number): string;
}
```

相当于：

```ts
interface Alarm {
  price: number;
  weight: number;
  alert(s: string): string;
  alert(s: string, n: number): string;
}
```

### 类的合并

类的合并与接口的合并规则一致。
