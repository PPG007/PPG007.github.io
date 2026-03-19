# 响应

## 基础

所有的路由闭包和 Controller 方法都应该返回一个响应，最基本的情况是直接返回一个字符串，如果返回一个数组，那么 Laravel 会将数组转换成 JSON 并返回。

大多数情况下，一个接口不会只返回一个字符串或一个数组，而是返回一个完整的 HTTP 响应。使用 `response` 方法可以创建一个 `Illuminate\Http\Response` 的对象实例：

```php
public function update(Request $request, string $id)
{
    return response(null, 200)->header('result', 'ok');
}
```

### 附加响应头

使用 `header` 方法可以按对添加响应头，或者使用 `withHeaders` 方法批量添加响应头：

```php
public function update(Request $request, string $id)
{
    return response(null, 200)->withHeaders([
        'a' => 1,
        'b' => 2,
    ]);
}
```

在中间件中也可以附加请求头和响应头，在一个全局中间件中将给请求头和响应头都添加一个 `X-Request-Id` 头：

```php
class First
{
    public function handle(Request $request, Closure $next): Response
    {
        $reqId = Str::uuid()->toString();
        $request->headers->set('X-Request-Id', $reqId);
        $response =  $next($request);
        $response->headers->set('X-Request-Id', $reqId);
        return $response;
    }
}
```

### 附加 Cookie

使用 `cookie` 或 `withCookie` 方法可以添加 Cookie：

```php
public function update(Request $request, string $id)
{
    return response(null, 200)->cookie(
        'accessToken', 'test', 60 * 60 * 24 * 30, '/', null, false, true
    );
}
```

参数含义：

```php
return response('Hello World')->cookie(
    'name', 'value', $minutes, $path, $domain, $secure, $httpOnly
);
```

如果需要在响应外添加 Cookie，可以使用 `Cookie::queue` 方法：

```php
public function update(Request $request, string $id)
{
    Cookie::queue('newName', 'value', 60, '/', null, false, true);
    return response(null, 200);
}
```

::: tip

如果在 API 路由中使用 `Cookie::queue`，需要将 `Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse` 这个中间件添加到 api 中间件组中：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->prependToGroup('api', AddQueuedCookiesToResponse::class);
})
```

:::

Laravel 还提供了 `cookie` 辅助函数来创建一个 `Symfony\Component\HttpFoundation\Cookie` 实例：

```php
public function update(Request $request, string $id)
{
    $cookie = cookie('cookieObj', 'value', 60, '/', null, false, true);
    return response(null, 200)->cookie($cookie);
}
```

在响应中使用 `withoutCookie` 方法可以提前过期一个 Cookie：

```php
public function update(Request $request, string $id)
{
    return response(null, 200)->withoutCookie('cookieObj');
}
```

或者也可以使用 `Cookie::expire` 方法：

```php
public function update(Request $request, string $id)
{
    Cookie::expire('accessToken');
    return response(null, 200);
}
```

::: tip

同样，`Cookie::expire` 方法在 API 路由中使用时也要注册 `Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse` 中间件。

:::

## 重定向

重定向响应是 `Illuminate\Http\RedirectResponse` 类实例，使用 `redirect` 辅助函数可以创建一个重定向响应：

```php
public function index(Request $request)
{
    return redirect('https://PPG007.github.io/');
}
```

### 重定向到命名路由

当不使用任何参数调用 `redirect` 辅助函数时，将返回一个 `Illuminate\Routing\Redirector` 实例，该实例可以调用 `route` 方法将请求重定向到命名路由：

```php
public function index(Request $request)
{
    return redirect()->route('demo.get');
}
```

如果需要传参：

```php
public function index(Request $request)
{
    return redirect()->route('demo.get', ['id' => 'test']);
}
```

### 重定向到 Controller

使用 `action` 方法可以重定向到 Controller 中的方法，第一个参数表明了要重定向到的 Controller 和方法，第二个参数是传给该方法参数：

```php
public function index(Request $request)
{
    return redirect()->action([DemoController::class, 'getMember'], ['id' => '123']);
}
```

### 重定向到外部域名

```php
public function index(Request $request)
{
    return redirect()->away('https://PPG007.github.io/');
}
```

## 其他响应类型

### JSON 响应

使用 `json` 方法可以返回 JSON 响应：

```php
public function getMember(string $id = '')
{
    return response()->json([
        'obj' => [
            'value' => false,
        ]
    ]);
}
```

`json` 方法会自动将 `Content-Type` 响应头设置为 `application/json`，并使用 `json_encode` 方法将数组转换为 JSON 字符串。

### 文件下载

`download` 方法可以强制浏览器在给定路径下载文件：

```php
return response()->download($pathToFile, $name, $headers);
```

### 文件响应

`file` 方法可以直接在浏览器中显示文件而不是启动下载，此方法接收文件的绝对路径作为第一个参数，第二个参数可以指定响应头：

```php
public function getMember(string $id = '')
{
    return response()->file('/home/user/playground/scrm/.env.example', ['test' => '123']);
}
```

### 流式响应

如果响应比较大，使用流式传输可以减少内存占用并提高性能，当前的各种 AI 对话的场景都是流式响应，不需要 AI 完整的返回结果就能看到最新生成的文本。

#### 流式返回文本

```php
public function getMember(string $id = '')
{
    return response()->stream(function () {
        $data = ['Hello', 'World'];
        foreach ($data as $item) {
            echo $item;
            ob_flush();
            flush();
            sleep(3);
        }
    });
}
```

::: tip

需要使用 `ob_flush()` 和 `flush()` 来刷新输出缓冲。

:::

可以使用 JavaScript 来读取这种响应：

```js
const main = async () => {
  const url = 'http://localhost:8000/v1/members/123';
  const resp = await fetch(url);
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    console.log(
      decoder.decode(value, {
        stream: true,
      })
    );
  }
};
main();
```

#### 流式 JSON

::: code-tabs#stream-json

@tab Controller

```php
public function getMember(string $id = '')
{
    $data = [
        ['name' => 1, 'isBlocked' => false],
        ['name' => 2, 'isBlocked' => true],
    ];
    return response()->streamJson($data);
}
```

@tab JavaScript Client

```js
const main = async () => {
  const url = 'http://localhost:8000/v1/members/123';
  const resp = await fetch(url);
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  const parts = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    parts.push(decoder.decode(value, { stream: true }));
  }
  const obj = JSON.parse(parts.join(''));
  console.log(obj);
};
main();
```

:::

#### 事件流

`eventStream` 方法可以用于返回 `text/event-stream` 类型的响应（SSE）。

关于 `Server-Sent Event` 可以参考 [SSE](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)。

::: code-tabs#stream-event

@tab Controller

```php
public function getMember(string $id = '')
{
    return response()->eventStream(function () {
        for ($i = 1; $i <= 3; $i++) {
            yield [
                'data' => ['count' => $i, 'time' => now()->toDateTimeString()]
            ];
            sleep(1);
        }
    });
}
```

@tab a.html

```html
<html>
  <head>
    <title>A</title>
    <script>
      const source = new EventSource("http://localhost:8000/v1/members/123");
      source.addEventListener("update", (event) => {
        console.log(event);
        if (event.data === '</stream>') {
          source.close();
        }
      });
    </script>
  </head>
  <body></body>
</html>
```

:::

::: tip

由于 NodeJs 没有 `EventSource`，所以需要在浏览器中请求。

由于浏览器中请求可能会存在跨域问题，所以可能需要配置跨域，首先需要暴露 CORS 配置文件，参考 [CORS](./routing.md#CORS)。通过修改 `config/cors.php` 可以解决跨域问题。

默认情况下，Laravel 的 EventStream 的消息事件不是 `message` 而是 `update`，所以使用 `EventSource` 的 `onmessage` 监听不到内容，同时，Laravel 结束相应的事件仍然是 `update` 但是会返回 `</stream>` 结束符，所以需要特殊处理并关闭连接防止不停重连。

:::

如果希望自定义事件名称，可以生成 `StreamedEvent` 类实例：

::: code-tabs#stream-custom-event

@tab Controller

```php
public function getMember(string $id = '')
{
    return response()->eventStream(function () {
        for ($i = 1; $i <= 3; $i++) {
            $data = [
                'data' => ['count' => $i, 'time' => now()->toDateTimeString()]
            ];
            yield new StreamedEvent(
                event: 'message',data: $data,
            );
            sleep(1);
        }
    });
}
```

@tab a.html

```html
<html>
  <head>
    <title>A</title>
    <script>
      const source = new EventSource("http://localhost:8000/v1/members/123");
      source.onmessage = function(event) {
        console.log(event);
      };
      source.addEventListener('update', () => {
        source.close();
      })
    </script>
  </head>
  <body></body>
</html>
```

:::

#### 流式下载

TODO:

## 响应宏

如果想定义一个可重用的响应，可以使用 `macro` 方法并在 ServiceProvider 的 `boot` 方法中调用：

::: code-tabs#macro

@tab AppServiceProvider.php

```php
public function boot(): void
{
    Response::macro('ppg', function ($value) {
        if (is_array($value) || is_object($value)) {
            return Response::make(json_encode($value));
        }
        if (is_string($value)) {
            return Response::make(Str::upper($value));
        }
        return Response::make([], 400);
    });
}
```

@tab DemoController.php

```php
public function getMember(string $id = '')
{
    return response()->ppg('Hello');
}
```

:::
