# 响应处理

## 响应内容

请求正确后的响应对象内容：

```json
{
  "data": {},
  "status": 200,
  "statusText": "OK",
  "headers": {},
  "config": {},
  "request": {}
}
```

请求错误后 error 中的内容：

```js
error.response;
error.request;
error.message;
error.config;
```

## 不使用拦截器处理

```js
axios
  .get('/demo', { headers: { token: 'token' } })
  .then(res => {
    // 请求成功
    console.log(res.data);
  })
  .catch(err => {
    // 请求失败
    console.log(err.response.status);
  });
```
