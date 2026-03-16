# 请求

## 请求头相关

```ts
import koa = require('koa');
const app = new koa();
app.use(async (ctx, next) => {
  const token = ctx.request.header['x-access-token'];
  console.log(token);
  ctx.request.header['x-auth-user'] = 'PPG007';
  await next();
});
app.use(ctx => {
  console.log(ctx.request.header['x-auth-user']);
});
app.listen(8080, '0.0.0.0');
```

## http 方法相关

使用下面的代码可以实现 methodOverWrite

```ts
import koa = require('koa');
const app = new koa();
app.use(async (ctx, next) => {
  console.log(ctx.request.method);
  ctx.request.method = 'PUT';
  await next();
});
app.use(ctx => {
  console.log(ctx.request.method);
});
app.listen(8080, '0.0.0.0');
```

## 请求路径相关

```ts
app.use(async (ctx, next) => {
  const req = ctx.request;
  console.log(req.url);
  console.log(req.originalUrl);
  console.log(req.href);
  console.log(req.origin);
  console.log(req.path);
  await next();
});
```

::: tip

可以通过修改 req.url 实现对 url 的重写。

:::

## 参数相关

获取 query 参数。

```ts
import koa = require('koa');
const app = new koa();
app.use(async (ctx, next) => {
  const req = ctx.request;
  console.log(req.querystring);
  console.log(JSON.stringify(req.query)); // query get response
  console.log(req.search); // include ? prefix
  await next();
});
```

获取 body 参数：

引入一个中间件：

```shell
yarn add koa-bodyparser
yarn add -D @types/koa-bodyparser
```

```ts
import koa = require('koa');
const app = new koa();
import bodyParser = require('koa-bodyparser');
app.use(bodyParser());
app.use(async (ctx, next) => {
  console.log(ctx.request.body);
  await next();
});
app.use(ctx => {
  console.log(ctx.request.method);
});
app.listen(8080, '0.0.0.0');
```

指定参数解析选项：

```ts
app.use(
  bodyParser({
    enableTypes: ['json'],
    encoding: 'utf-8',
    jsonLimit: '2mb',
    detectJSON: ctx => {
      // 指定什么情况下解析 JSON
      return /\.json$/i.test(ctx.path);
    },
    onerror(err, ctx) {
      ctx.throw(400, err);
    },
  })
);
```

## 客户端信息相关

```ts
app.use(ctx => {
  console.log(ctx.request.ip);
});
```
