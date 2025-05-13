# 错误处理

使用 async 中间件方法意味着可以使用 try catch：

```ts
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.response.body = e?.message;
    ctx.response.status = 400;
  }
});
app.use(ctx => {
  throw new Error('test');
});
```

## 错误事件

错误事件侦听器可以用 app.on('error') 指定。如果未指定错误侦听器，则使用默认错误侦听器。错误侦听器接收所有中间件链返回的错误，如果一个错误被捕获并且不再抛出，它将不会被传递给错误侦听器。如果没有指定错误事件侦听器，那么将使用 app.onerror，除非 error.expose 为 true 或 app.silent 为 true 或 error.status 为 404，否则只简单记录错误。

```ts
app.use(async (ctx, next) => {
  await next();
});
app.use(ctx => {
  throw new Error('test');
});
app.addListener('error', arg => {
  console.log(`exception: ${arg}`);
});
```
