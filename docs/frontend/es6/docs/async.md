# async 函数

## 基本用法

async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数，当函数执行的时候，一旦遇到 await 就会先返回，等到异步操作完成再接着执行函数体内后面的语句。

```javascript
async function timeout(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 5000);
```

## 语法

async 函数返回一个 Promise 对象，函数内部 return 语句返回的值会成为 then 方法回调函数的参数。

async 函数内部抛出错误会导致返回的 Promise 对象变为 reject 状态，抛出错误的对象会被 catch 方法回调函数收到。

async 函数返回的 Promise 对象必须等到内部所有 await 命令后面的 Promise 对象执行完才会发生状态改变，除非遇到 return 语句或者抛出错误，只有 async 函数内部的异步操作执行完才会执行 then 方法指定的回调函数。

await 命令后面的 Promise 对象如果变成 reject 状态，则 reject 的参数会被 catch 方法的回调函数接收到。而且只要任何一个 await 语句后面的 Promise对象变为 reject 状态，那么整个 async 函数都会中断执行。

如果希望即使前面的异步操作失败也不中断后面的异步操作可以将前面的 await 放在 try...catch 结构里。

await 后面的异步操作出错等同于 async 函数返回的 Promise 对象被 reject。

::: tip 使用注意点：

- 最好把 await 命令放在 try 代码块中。
- 多个 await 命令后面的异步操作如果不存在先后关系最好同时触发。
- await 命令只能用在 async 函数。
- async函数可以保留运行堆栈。

:::
