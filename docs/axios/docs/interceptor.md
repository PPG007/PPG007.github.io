# 拦截器

[Interceptor](https://github.com/axios/axios#interceptors)

## 请求拦截器

::: tip
use() 方法的两个参数都是函数，要返回参数类型的变量。
:::

```js
axios.interceptors.request.use(
  config => {
    // 对请求做配置
    config.headers[UserInfoKeys.TOKENKEY] = sessionStorage.getItem(UserInfoKeys.TOKENKEY);
    return config;
  },
  // 错误处理
  error => Promise.reject(error)
);
```

## 响应拦截器

```js
axios.interceptors.response.use(
  // 正常情况下直接返回响应
  response => response,
  // 出错后再处理
  error => {
    if (error.response === 401) {
      message.warn('请先登录');
    } else {
      message.error('网络错误');
    }
    return Promise.reject(error);
  }
);
```

::: warning 注意
在配置了拦截器后，要将配置过的 axios 导出：

```js
export default axios;
```

:::
