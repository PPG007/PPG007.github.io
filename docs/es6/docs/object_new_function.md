# 对象的新增方法

## Object.assign()

此方法用于对象的合并，将原对象的所有*可枚举属性*复制到目标对象，第一个参数是目标对象，后面都是源对象，后面的属性会覆盖前面的属性。不可枚举和继承来的属性是不会拷贝的。

```javascript
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  },
  y: 'test',
};
const obj = {
  x: 'world',
  foo() {
    super.foo();
  },
};
Object.setPrototypeOf(obj, proto);
let backup = {};
Object.assign(backup, obj);
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

## Object.keys()、Object.values()、Object.entries()

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
