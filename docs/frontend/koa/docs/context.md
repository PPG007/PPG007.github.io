# 上下文

Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。

## API

`ctx.req`：

Node 的 `request` 对象。

`ctx.res`：

Node 的 `response` 对象。

绕过 koa 的 response 处理是不被支持的，应避免使用以下 node 属性：

- `res.statusCode`。
- `res.writeHead()`。
- `res.write()`。
- `res.end()`。

`ctx.request`：

Koa 的 Request 对象。

`ctx.response`：

Koa 的 Response 对象。

`ctx.state`：

推荐的命名空间，用于通过中间件传递信息，例如：

```ts
import koa = require('koa');
const app = new koa();

app.use(async (ctx, next) => {
  ctx.state.userId = '123';
  await next();
});
app.use(ctx => {
  ctx.body = ctx.state.userId;
});
app.listen(8080, '0.0.0.0');
```

`ctx.app`：

应用程序的实例引用：

```ts
import koa = require('koa');
const app = new koa();

app.use(async (ctx, next) => {
  ctx.app.emit('wuhu', new Date(), 1, '2');
  await next();
});
app.use(ctx => {
  ctx.body = ctx.state.userId;
});
app.addListener('wuhu', (a, b, c) => {
  console.log(a, b, c);
});
app.listen(8080, '0.0.0.0');
```

`ctx.cookie`：

```ts
import koa = require('koa');
const app = new koa();

app.use(async (ctx, next) => {
  console.log(ctx.cookies.get('token', { signed: true }));
  await next();
  ctx.cookies.set('user', 'PPG007', {
    maxAge: Date.now(),
    expires: new Date(),
    path: '/',
    domain: 'github.io',
    secure: true,
    httpOnly: true,
    sameSite: true,
    signed: true,
    overwrite: true,
  });
});
app.use(ctx => {
  ctx.body = ctx.state.userId;
});
```

所有选项：

- maxAge: 一个数字, 表示从 Date.now() 得到的毫秒数。
- expires: 一个 Date 对象, 表示 cookie 的到期日期 (默认情况下在会话结束时过期)。
- path: 一个字符串, 表示 cookie 的路径 (默认是/)。
- domain: 一个字符串, 指示 cookie 的域 (无默认值)。
- secure: 一个布尔值, 表示 cookie 是否仅通过 HTTPS 发送 (HTTP 下默认为 false, HTTPS 下默认为 true)。
- httpOnly: 一个布尔值, 表示 cookie 是否仅通过 HTTP(S) 发送，, 且不提供给客户端 JavaScript (默认为 true)。
- sameSite: 一个布尔值或字符串, 表示该 cookie 是否为 "相同站点" cookie (默认为 false). 可以设置为 'strict', 'lax', 'none', 或 true (映射为 'strict')。
- signed: 一个布尔值, 表示是否要对 cookie 进行签名 (默认为 false). 如果为 true, 则还会发送另一个后缀为 .sig 的同名 cookie, 使用一个 27-byte url-safe base64 SHA1 值来表示针对第一个 Keygrip 键的 cookie-name=cookie-value 的哈希值. 此签名密钥用于检测下次接收 cookie 时的篡改。
- overwrite: 一个布尔值, 表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（无论路径或域）是否在设置此Cookie 时从 Set-Cookie 消息头中过滤掉。

`ctx.throw`：

```ts
import koa = require('koa');
const app = new koa();

app.use(async (ctx, next) => {
  ctx.throw(400, new Error('Invalid token'));
  await next();
});
app.use(ctx => {
  ctx.body = ctx.state.userId;
});

app.listen(8080, '0.0.0.0');
```
