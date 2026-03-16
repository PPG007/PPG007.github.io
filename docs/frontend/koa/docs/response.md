# 响应

## 响应头相关

```ts
app.use(ctx => {
  ctx.response.set({
    reqId: '123123',
  });
  ctx.response.set('wuhu', 'wuhu');
  ctx.response.append('wuhu2', 'wuhu2');
  console.log(ctx.response.get('wuhu'));
  ctx.response.remove('wuhu');
});
```

## 响应状态相关

```ts
app.use(ctx => {
  ctx.response.status = 200;
  // 通常情况下 message 与 status 关联
  ctx.response.message = '1!5!';
});
```

## 响应体相关

将响应体设置为以下之一：

- string 写入。
- Buffer 写入。
- Stream 管道。
- Object || Array JSON-字符串化。
- null 无内容响应。

```ts
app.use(ctx => {
  ctx.response.status = 200;
  ctx.response.body = {
    user: 'PPG007',
  };
});
```

## 重定向

```ts
app.use(ctx => {
  ctx.response.redirect('https://baidu.com');
  // 重定向到 referrer
  // ctx.redirect('back');
});
```
