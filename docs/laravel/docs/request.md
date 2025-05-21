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

## 输入

## 文件

## 配置
