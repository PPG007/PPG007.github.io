# Promise 对象

## 基本用法

Promise 对象是一个构造函数，用来生成 Promise 实例。Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。

- resolve 函数的作用是将 Promise 对象的状态从“未完成”变成“成功”，在异步操作成功时调用，并将异步操作的结果作为参数传递出去。
- reject 函数的作用是将 Promise 对象的状态从“未完成”变成“失败”。

Promise 实例生成以后可以用 then 方法分别制定 resolved 状态和 rejected 状态的回调函数。then 方法接受两个回调函数作为参数，第一个回调函数对应 resolved，第二个回调函数对应 rejected。Promise 创建后会立即执行，then 方法指定的回调函数会在当前脚本所有同步任务执行完才会执行。

## then 方法

then 方法返回的是一个新的 Promise 实例，不是原来那个 Promise 实例，因此可以采用链式写法。

## catch 方法

catch 方法相当于 then 方法的第一个参数为 null 或 undefined，用于指定发生错误时的回调函数，如果 Promise 已经是 resolved 状态，再抛出错误是无效的，等于没有抛出。

Promise 对象的错误有“冒泡”性质，会一直向后传递，直到被捕获为止，错误总是会被下一个 catch 语句捕获。

如果没有使用 catch 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码。

## finally 方法

finally 方法用于指定一定会执行的操作。

## Promise.all 方法

all 方法用于将多个 Promise 实例包装成一个新的 Promise 实例。

all 方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

如果多个 Promise 中有一个是 rejected，最终结果就是 rejected。
