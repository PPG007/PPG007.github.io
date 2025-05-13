# 变量的解构赋值

## 数组的解构赋值

解构：按照一定模式，从数组和对象中提取值，对变量进行赋值。

只要等号两边模式相同，就能够解构成功；如果解构失败，变量就会被赋值为 undefined。

解构赋值在左边括号中可以指定默认值：

```javascript
let [x, y = 'b'] = ['a', undefined];
```

如果赋值为 undefined 则默认值仍然会生效，如果赋值为 null 则默认值失效，赋值为 null。默认值也可以引用其他变量但是这个变量必须已经声明。

## 对象的解构赋值

对象解构属性没有次序，变量与属性同名就能取到正确的值。

```javascript
let { account, password, account: username } = { account: '1658', password: '123456' };
```

如果变量名与属性名不一致要使用 `${右边已有的属性名}: ${变量名}` 的形式。

## 字符串的解构赋值

字符串也可以解构赋值，此时字符串被转换成了一个类似数组的对象：

```javascript
const [a, b, c, d, e] = 'hello';
const { length: len } = 'hello'; // len = 5
```

## 数值和布尔值的解构赋值

解构赋值时，如果等号右边是数值和布尔值，则会先转为对象，只要等号右边的值不是对象或数组就先把它转为对象，由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值都会报错。

## 函数参数的解构赋值

```javascript
function add([x, y]) {
  console.log(x + y);
}
function move({ x = 0, y = 0 } = {}) {
  console.log([x, y]);
}
```
