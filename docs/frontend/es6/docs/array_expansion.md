# 数组的扩展

## 扩展运算符

扩展运算符是三个点，将一个数组变为参数序列：

```javascript
console.log(...[1, 2, 3, 4]);
function push(array, ...items) {
  array.push(...items);
  for (const x of array) {
    console.log(x);
  }
}
function add(x, y) {
  return x + y;
}
push([], ...[1, 2, 3, 4]);
console.log(add(...[4, 3, 2, 1]));
```

扩展运算符的应用：

- 复制数组：

```javascript
let a1 = [1, 2, 3, 4];
let a2 = [...a1];
```

- 合并数组：

```javascript
a1 = [{ foo: 1 }];
a2 = [{ bar: 2 }];
a3 = [...a1, ...a2];
```

- 与解构赋值结合：

```javascript
const [first, ...rest] = [1, 2, 3, 4, 5];
```

- 字符串：扩展运算符可以将字符串转为真正的数组。

```javascript
console.log([...'hello']);
```

- 实现了 Iterator 接口的对象：任何定义了遍历器接口的对象都可以使用扩展运算符转为真正的数组。

```javascript
function User(name) {
  this.name = name;
}

User.prototype[Symbol.iterator] = function* () {
  let i = 0;
  while (i < 10) {
    ++i;
    yield this.name;
  }
};
console.log([...new User('PPG')]);
```

## 数组实例的 find() 和 findIndex()

- find 方法用于找出第一个符合条件的数组成员，它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为 true 的成员，然后返回这个成员，如果没有符合条件的就返回 undefined。
- findIndex 方法返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件就返回 -1.
- 这两个方法都可以接受第二个参数，用来绑定回调函数的 this 对象。

## 数组实例的 includes()

此方法返回一个布尔值，表示某个数组是否包含给定的值。该方法可以接受第二个参数表示搜索的起始位置，如果是负数就表示倒数的位置。
