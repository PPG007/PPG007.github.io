# 起步

## 安装

```shell
yarn add koa
yarn add -D @types/koa
```

## Hello World

```ts
import koa = require('koa');
const app = new koa();
app.use(ctx => {
  ctx.body = 'Hello World';
});
app.listen(8080, '0.0.0.0');
```
