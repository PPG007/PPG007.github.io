# 工具方法

## URL

### URL 生成

使用 `url` 方法可以生成 URL：

```php
public function getMember(string $id = '')
{
    Log::info('test', [
        'url' => url()->query('/test/{id}', ['id' => 123])
    ]);
    return ' ';
}
```

使用 `urldecode` 方法可以解码 URL：

```php
public function getMember(string $id = '')
{
    Log::info('test', [
        'url' => url()->query('/test', ['tags' => ['A', 'B']]),
        'decodedUrl' => urldecode(url()->query('/test', ['tags' => ['A', 'B']])),
    ]);
    return ' ';
}
```

### 获取当前 URL

```php
public function getMember(string $id = '')
{
    Log::info('test', [
        'currentUrlWithoutQuery' => url()->current(),
        'currentUrlWithQuery' => url()->full(),
        'fullUrlForPrevious' => url()->previous(),
        'previousPath' => url()->previousPath(),
    ]);
    return ' ';
}
```

上面的方法也能在 URL Facade 上使用：

```php
public function getMember(string $id = '')
{
    Log::info('test', [
        'currentUrlWithoutQuery' => URL::current(),
        'currentUrlWithQuery' => URL::full(),
        'fullUrlForPrevious' => URL::previous(),
        'previousPath' => URL::previousPath(),
    ]);
    return ' ';
}
```

### 命名路由

使用 `route` 方法可以为命名路由创建 URL：

```php
public function getMember(string $id = '')
{
    Log::info('test', [
        'url' => route('accounts.show', ['account' => 1 ])
    ]);
    return ' ';
}
```

### Controller

使用 `action` 方法可以创建控制器的 URL：

```php
public function getMember(string $id = '')
{
    Log::info('test', [
        'url' => action([DemoController::class, 'getMember'], ['id' => '123'])
    ]);
    return ' ';
}
```

### URL 签发

使用 URL 签发功能会在生成的 URL 的 query 中添加一个签名哈希值，这可以验证 URL 是否被修改过：

```php
public function getMember(string $id = '')
{
    return URL::signedRoute('accounts.index', absolute: false);
}
```

absolute 参数标识是否返回绝对路径，默认为 true。

可以在请求中验证签名是否有效：

```php
public function index(Request $request)
{
    if (!$request->hasValidSignature(false)) {
        return response('Bad Credentials', 400);
    }
    return '';
}
```

`hasValidSignature` 方法同样接收一个 `absolute` 参数，标识是否验证绝对路径，需要和签发时的参数一致。

如果需要生成临时链接，那么可以设置签发的 URL 的有效期：

```php
public function getMember(string $id = '')
{
    return URL::temporarySignedRoute('accounts.index', now()->addMinute());
}
```

有时需要允许对签发的 URL 的部分参数进行修改，这样验证时需要忽略这些部分的改动：

```php
public function index(Request $request)
{
    if (!$request->hasValidSignatureWhileIgnoring(['test'])) {
        return response('Bad Credentials', 400);
    }
    return '';
}
```

使用 `Illuminate\Routing\Middleware\ValidateSignature` 中间件可以自动验证 URL 签名而不是手动验证，如果签名无效将返回 403：

```php
Route::apiResource('accounts', AccountController::class)->middleware([
    ValidateSignature::class,
]);
```

如果签发 URL 时没有使用绝对路径，那么需要将 `relative` 参数传给验证中间件：

```php
Route::apiResource('accounts', AccountController::class)->middleware([
    ValidateSignature::class . ':relative',
]);
```

如果想自定义验证 URL 中间件的错误，可以修改 `bootstrap/app.php` 文件中并为 `InvalidSignatureException` 自定义行为：

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (InvalidSignatureException $e) {
        return response()->json([
            'message' => 'Invalid signature',
        ], 400);
    });
})
```

### URI 对象

Laravel 还提供了 `Uri` 类，可以方便的使用链式调用创建 URI对象：

```php
public function getMember(string $id = '')
{
    $uri = Uri::route('accounts.show', ['account' => 1])->withPort(443);
    Log::info('get', [
        'uri' => $uri->value(),
    ]);
    return URL::signedRoute('accounts.index', absolute: false);
}
```
