# 语法

## 数据类型的转换

- Number() 函数：将任意类型的值转化为数值。这个函数比 parseInt 更加严格，只要有一个字符无法转换为数值，就会返回 NaN。
- String() 函数：将任意类型的值转化成字符串。
- Boolean() 函数：将任意类型的值转为布尔值，只有 undefined、null、0、NaN和空字符串会被转换成 false，所有对象的转换结果都是 true，包括 false 的布尔对象。

## 错误处理机制

Error 实例对象：所有抛出的错误都是这个构造函数的实例，`Error()` 构造函数接受一个参数表示错误提示。

throw 语句：手动中断程序执行，抛出一个错误。throw 可以抛出任何类型的值。

## console 对象与控制台

console 对象的静态方法：

- console.log()。
- console.info()。
- console.debug()。
- console.warn()。
- console.error()。
