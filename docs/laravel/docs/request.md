# 请求

`Illuminate\Http\Request` 类型参数需要通过依赖注入的方式获取，也就是说需要在 Controller 方法或者闭包方法中通过类型标注来获取。

## 基础方法

### 获取请求路径

使用 `path()` 方法可以获取当前请求的 URI：

```php
public function index(Request $request)
{
    Log::info($request->path());
    return '';
}
```

::: tip

`path()` 方法返回的字符串开头没有 `/`，同时也不包含 query 参数。

:::

使用 `is` 方法可以验证传入的路径是否与给定的正则匹配，使用 `routeIs` 方法可以验证传入的请求是否与命名路由匹配，这两个方法里都能使用 `*` 通配符：

```php
public function index(Request $request)
{
    Log::info('index', [
        'is' => $request->is('v1/*'),
        'routeIs' => $request->routeIs('accounts.*'),
    ]);
    return '';
}
```

如果需要查看完整的 URL，可以使用 `url` 或 `fullUrl` 方法，前者不返回 query 参数，后者返回：

```php
public function index(Request $request)
{
    Log::info('index', [
        'url' => $request->url(),
        'fullUrl' => $request->fullUrl(),
    ]);
    return '';
}
```

如果想要将一个 query 参数添加到 URL 中，可以使用 `fullUrlWithQuery` 方法，如果想从 URL 中删除一个 query 参数，可以使用 `fullUrlWithoutQuery` 方法：

```php
public function index(Request $request)
{
    Log::info('index', [
        'with' => $request->fullUrlWithQuery([
            'new' => false,
        ]),
        'without' => $request->fullUrlWithoutQuery('id'),
    ]);
    return '';
}
```

### 获取主机

使用 `host`、`httpHost`、`schemeAndHttpHost` 方法可以获取传入请求的 host：

```php
public function index(Request $request)
{
    Log::info('index', [
        'host' => $request->host(), // 域名或 IP
        'httpHost' => $request->httpHost(), // 域名或 IP 及端口号
        'schemeAndHttpHost' => $request->schemeAndHttpHost(), // 带有 http 或 https 的域名或 IP 及端口号
    ]);
    return '';
}
```

### 获取请求方法

使用 `method` 方法可以获取请求方法，使用 `isMethod` 可以判断请求方法是否匹配：

```php
public function index(Request $request)
{
    Log::info('index', [
        'method' => $request->method(),
        'isMethod' => $request->isMethod('OPTIONS'),
    ]);
    return '';
}
```

### 获取请求头

使用 `header` 方法可以获取请求头，如果不存在指定的请求头，此方法将会返回 null，但是可以通过传入第二个参数指定默认值，也可以使用 `hasHeader` 方法判断请求头是否存在：

```php
public function index(Request $request)
{
    Log::info('index', [
        'token' => $request->header('x-access-token'),
        'hasToken' => $request->hasHeader('x-access-token'),
        'default' => $request->header('not-exists', 'initial value')
    ]);
    return '';
}
```

### 获取 IP 地址

使用 `ip` 方法可以获取请求的客户端的 IP 地址，使用 `ips` 可以获取包括代理转发的所有客户端的 IP 地址：

```php
public function index(Request $request)
{
    Log::info('index', [
        'ip' => $request->ip(),
        'ips' => $request->ips(),
    ]);
    return '';
}
```

::: tip

不过一般来说在使用了 NGINX 等代理转发后，往往拿不到实际的客户端 IP，一般是要约定一个请求头来获取，例如 `X-Real-IP`。

:::

### 内容协商

Laravel 提供了多种方法来通过 Accept 请求头检查接受的方法：

```php
public function index(Request $request)
{
    Log::info('index', [
        'types' => $request->getAcceptableContentTypes(), // 获取所有接受的类型
        'accepts' => $request->accepts(['application/xml', 'application/json']), // 检查是否接受指定的类型
        'preferred' => $request->prefers(['application/json', 'application/xml']), // 获取请求偏好的类型，如果没有任何类型将返回 null
        'json' => $request->expectsJson(), // 检查传入请求是否需要 JSON 响应
    ]);
    return '';
}
```

## 输入

### 读取输入

使用 `all`、`collect`、`input` 方法可以获取所有的参数，包括 query 和 body 参数：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'all' => $request->all(),
    ]);
    return '';
}
```

::: tip

`collect` 将会返回一个 `Illuminate\Support\Collection` 对象，`all` 方法返回的是数组。

```php
$request->collect('tags')->each(function ($tag) {
    Log::info('tag', [
        'tag' => $tag,
    ]);
});
```

:::

input 方法可以通过参数名来获取参数值，如果指定的参数不存在，将会返回 null，也可以指定一个默认值，同时能够通过 `.` 访问数组：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'notExists' => $request->input('notExists'),
        'defaultValue' => $request->input('notExists', 'default'),
        'valueInArray' => $request->input('tags.0'),
        'valuesInArray' => $request->input('tags.*'),
    ]);
    return '';
}
```

`query` 方法将仅从 query 参数中读取参数值，如果指定的参数名不存在，将会返回 null，也可以指定一个默认值：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'allQuery' => $request->query(),
        'notExists' => $request->query('notExists'),
        'default' => $request->query('notExists', 'default'),
    ]);
    return '';
}
```

当发送的请求是 JSON 格式时，可以通过 `input` 方法访问 JSON 参数，通知能使用 `.` 访问对象和数组：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'value' => $request->input('object.value'),
        'arrayValue' => $request->input('tags.1'),
    ]);
    return '';
}
```

使用 `string` 方法能以 `Illuminate\Support\Stringable` 对象类型获取参数值：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'name' => $request->string('name')->upper(),
    ]);
    return '';
}
```

使用 `integer` 方法能将参数值转为整数，如果参数不存在或者不能转为整数将返回默认值：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'page' => $request->integer('page', 1),
        'pageSize' => $request->integer('pageSize', 10),
    ]);
    return '';
}
```

使用 `boolean` 方法能将参数值转为布尔值，此方法对 1、"1"、true、"true"、"on"、"yes" 返回 true，其他情况返回 false：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'v1' => $request->boolean('name'),
        'v2' => $request->boolean('bool')
    ]);
    return '';
}
```

使用 date 方法可以将参数值转为 Carbon 实例，如果参数值不存在将返回 null，如果参数值存在但转换失败将抛出异常：

```php
public function update(Request $request, string $id)
{
    $date = $request->date('time');
    $date->timezone('Asia/Shanghai');
    Log::info('update', [
        'year' => $date->year,
        'month' => $date->month,
        'hour' => $date->hour,
        'local' => $date->isLocal(),
        'str' => $date->toIso8601String(),
    ]);
    return '';
}
```

`date` 的第二个和第三个参数可以指定日期的格式和时区，如果使用 ISO8601 传参可以不传。

使用 `enum` 方法可以将参数值转为枚举值，如果参数不存在或者不能转为指定的枚举类将返回 null：

::: code-tabs#input-enum

@tab Status.php

```php
<?php

namespace App\Enums;

enum Status: string
{
    case PENDING = 'pending';
    case RUNNING = 'running';
    case COMPLETED = 'completed';
}
```

@tab Controller

```php
    public function update(Request $request, string $id)
    {
        Log::info('update', [
            'status' => $request->enum('status', Status::class),
            'statusWithDefault' => $request->enum('status', Status::class),
            'enums' => $request->enums('statusList', Status::class),
        ]);
        return '';
    }
```

:::

直接在 `$request` 对象上使用参数名也可以访问到参数值，如果 query 和 body 中不包含指定的参数那么 Laravel 将会再从路由参数上查找：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'query' => $request->test,
        'body' => $request->tags,
        'route' => $request->account,
    ]);
    return '';
}
```

使用 `$request` 上的 `only` 和 `except` 方法可以获取 input 方法结果的子集：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'only' => $request->only('object'),
        'except' => $request->except('tags'),
    ]);
    return '';
}
```

::: tip

`only` 和 `except` 方法都接受单个数组或者可变参数。

`only` 将不会返回请求中不存在的键值对。

:::

如果需要合并其他内容到请求中，可以使用 `merge` 或 `mergeIfMissing` 方法：

```php
public function update(Request $request, string $id)
{
    $params = [
        'name' => 'mergedName',
        'newProp' => 'newVal',
    ];
    $request->mergeIfMissing($params);
    Log::info('update', $request->input());
    return '';
}
```

### 输入校验

`has` 方法可以判断参数是否存在值，如果传入的是数组，那么数组中所有的参数都存在才会返回 true，或者使用 `hasAny` 方法判断任一参数存在：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'has' => $request->has('name'),
        'hasAll' => $request->has(['name', 'notExists']),
        'hasAny' => $request->hasAny(['name', 'notExists']),
    ]);
    return '';
}
```

`whenHas` 可以在参数存在时执行闭包函数，此方法接收两个闭包，第一个闭包将在参数存在时执行，第二个闭包将在参数不存在时执行：

```php
public function update(Request $request, string $id)
{
    $request->whenHas('notExists', function () {
        Log::info('has notExists value');
    }, function () {
        Log::info('notExists is not present');
    });
    return '';
}
```

如果需要判断参数是否存在且不是空字符串，可以使用 `filled` 方法；如果需要判断参数是否不存在或者为空字符串，可以使用 `isNotFilled` 方法：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'filled' => $request->filled('name'),
        'allFilled' => $request->filled(['name', 'empty']),
        'notFilled' => $request->isNotFilled('empty'),
        'allNotFilled' => $request->isNotFilled(['name', 'empty']),
        'anyFilled' => $request->anyFilled(['name', 'empty']),
    ]);
    return '';
}
```

当 `filled` 参数传入数组时，只有全部的参数都不为空字符串才返回 true。

当 `isNotFilled` 参数传入数组时，只有全部的参数都为空字符串才返回 true。

如果要判断任一参数不为空字符串，使用 `anyFilled` 方法。

`whenFilled` 方法将会在传入的参数不是空字符串时执行闭包，同样接收两个闭包，第一个当参数不为空字符串时执行，第二个当参数为空字符串或为空时执行：

```php
public function update(Request $request, string $id)
{
    $request->whenFilled('empty', function () {
        Log::info('empty param not empty');
    }, function () {
        Log::info('empty param empty');
    });
    return '';
}
```

要判断请求中的是否包含某个参数可以使用 `missing` 和 `whenMissing` 方法：

```php
public function update(Request $request, string $id)
{
    Log::info('update', [
        'missing' => $request->missing('empty'),
    ]);
    $request->whenMissing('empty', function () {
        Log::info('missing empty');
    }, function () {
        Log::info('empty exists');
    });
    return '';
}
```

### Cookies

获取 Cookie 值：

```php
$value = $request->cookie('name');
```

### 参数格式转换

默认情况下，Laravel 会在全局中间件中包含 `Illuminate\Foundation\Http\Middleware\TrimStrings` 和 `Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull` 中间件，这两个中间件会对传入的字符串参数进行 trim 操作，将空字符串转换成 null。

如果希望禁用这两个中间件，可以在 `bootstrap/app.php` 中移除：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->remove([
        ConvertEmptyStringsToNull::class,
        TrimStrings::class,
    ]);
})
```

如果只想对个别情况移除上面的中间件，可以使用 `convertEmptyStringsToNull` 和 `trimStrings`，当传入的闭包函数返回 false 时，中间件将生效：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trimStrings([
        function (Request $request) {
        return $request->hasHeader('test');
        }
    ]);
    $middleware->convertEmptyStringsToNull([
        function (Request $request) {
            return $request->hasHeader('test');
        }
    ]);
})
```

## 文件

分布式集群的场景内，上传文件最好还是放入 OSS 服务内，前端使用后端签发的 URL 直传，不再经过后端。

## 配置

### 可信代理

一般来说，分布式集群或者代理转发场景中，HTTPS 请求的 TLS 验证应该止于负载均衡服务器或代理服务器，具体的业务服务只会接触到 HTTP 请求，在这种场景下，Laravel 在使用 `url` 工具时不会生成 HTTPS 的 URL，要解决此问题，可以启用 `Illuminate\Http\Middleware\TrustProxies` 中间件：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: [
        '192.168.1.1',
        '10.0.0.0/8',
    ]);
})
```

也可以设置受信任的请求头：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(headers: Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB
    );
})
```

也可以直接信任所有的代理：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})
```
