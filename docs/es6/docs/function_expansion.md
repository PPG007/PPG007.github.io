# 函数的扩展

## 函数参数的默认值

```javascript
function add(x, inc = 1) {
  return x + inc;
}
```

与解构赋值默认值结合：

```javascript
function add({ x, y = 1 }) {
  return x + y;
}
console.log(add({ x: 1 }));
```

指定了默认值以后，函数的 length 属性将返回没有指定默认值的参数个数。

## 参数的作用域

如果设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域直到初始化结束，这个作用域就会消失。

```javascript
let x = 1;
function foo(
  x,
  y = function () {
    x = 2;
  }
) {
  var x = 3;
  y();
  console.log(x);
}
foo(); // 3
console.log(x); // 1
```

在上面的代码中，如果函数中的 x 变量使用 var 声明，那么 foo 参数列表中的 x 变量和方法体内部的 x 变量不是一个变量，而 y 所指向的函数中操作的变量和参数列表中的 x 是一个变量，所以最后输出 3。如果不使用 var 声明，则这两个 x 是一个变量，输出 2。

## rest 参数

使用 `...变量名` 形式定义 rest 参数：

```javascript
function sum(...number) {
  let sum = 0;
  for (const n of number) {
    sum += n;
  }
  return sum;
}
console.log(sum(1, 2, 3, 4, 5, 6, 7, 8));
```

rest 参数必须在参数列表最后，函数的 length 属性不包含 rest 参数。

## 箭头函数

由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上大括号：

```javascript
let getUser = (account = 'ppg', password = '123456') => ({ account, password });
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
