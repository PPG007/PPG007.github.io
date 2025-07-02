# Context

Laravel 提供了上下文功能，添加到上下文的信息在同一个请求内都可以访问到，例如新增一个 requestId 的中间件，这个中间件将 requestId 添加到上下文中：

::: code-tabs#set

@tab RequestId.php

```php
public function handle(Request $request, Closure $next): Response
{
    $reqId = Str::uuid()->toString();
    ContextUtil::setRequestId($reqId);
    $resp = $next($request);
    $resp->headers->set('x-request-id', $reqId);
    return $resp;
}
```

@tab ContextUtil.php

```php
class ContextUtil
{
    const REQUEST_ID = 'request-id';

    public static function setRequestId(string $reqId)
    {
        Context::add(self::REQUEST_ID, $reqId);
    }

    public static function getRequestId(): string
    {
        return Context::get(self::REQUEST_ID);
    }
}
```

:::

此功能类似 Go 语言中的 context 或者 Java 中的 ThreadLocal，可以用于在同一个请求内传递上下文信息。常见的场景包括：请求追踪、多租户系统中透传租户 id、透传 userId、在具有复制集的数据库中透传是从主库还是从库读取数据等。
