# 中间件

```ts
import koa = require('koa');
const app = new koa();

app.use(async (ctx, next) => {
  console.log('start');
  await next();
  console.log('end');
});
app.use(ctx => {
  ctx.body = 'Hello World';
  console.log('running');
});
app.listen(8080, '0.0.0.0');
```

::: warning

注意 use 方法的调用顺序。

:::

## 多个中间件结合

```ts
import compose = require('koa-compose');

async function random(ctx: koa.ParameterizedContext, next: koa.Next) {
  if ('/random' == ctx.path) {
    ctx.body = Math.floor(Math.random() * 10);
  } else {
    await next();
  }
}

async function backwards(ctx: koa.ParameterizedContext, next: koa.Next) {
  if ('/backwards' == ctx.path) {
    ctx.body = 'sdrawkcab';
  } else {
    await next();
  }
}

async function pi(ctx: koa.ParameterizedContext, next: koa.Next) {
  if ('/pi' == ctx.path) {
    ctx.body = String(Math.PI);
  } else {
    await next();
  }
}

const all = compose([random, backwards, pi]);

app.use(all);
```
