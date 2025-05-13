# 路由

Koa 本身不支持路由，这里使用 koa-router 中间件：

```shell
yarn add koa-router
yarn add -D @types/koa-router
```

## 嵌套路由

```ts
import koa = require('koa');
const app = new koa();
import Router = require('koa-router');
const routerv1 = new Router({
  prefix: '/v1',
});
routerv1.get('/user', (ctx, next) => {
  ctx.response.body = 'user v1';
});
const routerv2 = new Router({
  prefix: '/v2',
});
routerv2.get('/user', (ctx, next) => {
  ctx.response.body = 'user v2';
});
const router = new Router();
router.use(routerv1.routes()).use(routerv2.routes());
app.use(router.routes()).use(router.allowedMethods());
app.listen(8080, '0.0.0.0');
```

## 同一路由多个中间件

```ts
routerv1.get(
  '/user',
  async (ctx, next) => {
    console.log('user v1');
    await next();
  },
  (ctx, next) => {
    ctx.response.body = 'user v1';
  }
);
```

## url 参数

```ts
routerv2.get('/user/:id', (ctx, next) => {
  // url: /v2/user/PPG007
  console.log(ctx.params['id']);
  ctx.response.body = 'user v2';
});
```

使用 `router.param` 方法：

```ts
routerv2
  .param('id', async (id, ctx, next) => {
    console.log(id);
    await next();
  })
  .get('/user/:id', (ctx, next) => {
    ctx.response.body = ctx.params['id'];
  });
```
