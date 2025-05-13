# 取消请求

```js
//声明变量
let cancel = null;
//配置项中添加cancelToken
axios({
  url: 'http://localhost/delayTest',
  cancelToken: new axios.CancelToken(function (c) {
    cancel = c;
  }),
});
//此时这个变量已经变成函数，调用即可取消请求
cancel();
```

::: tip
一个请求对应一个 cancel 对象，调用对应的 cancel 函数即可取消请求，可以通过 setTimeout 设置超时等。
:::
