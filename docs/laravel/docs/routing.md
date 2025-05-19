# 路由

## 基础

所有的路由都在路由文件中定义，路由文件位于 `routes` 目录中，这些文件被 `bootstrap/app.php` 文件加载。

`routes/web.php` 文件定义适用于 web 页面的路由，这些路由被分配了 web 中间件组，它们提供会话状态和 CSRF 保护等功能。

::: tip

具体是那个文件定义 web 页面路由取决于 `bootstrap/app.php` 中 `withRouting` 方法的设置，默认是 `web.php`。

:::

### API 路由

使用 `php artisan install:api` 可以创建 api 路由，此命令会安装一个令牌身份验证库，并创建 `routes/api.php` 文件。

::: tip

默认情况下，api 路由的路径会自动添加 `/api` 前缀，可以在 `bootstrap/app.php` 中去掉或者修改：

```php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: '',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

:::

可以注册任意 HTTP 方法：

```php
Route::get($uri, $callback);
Route::post($uri, $callback);
Route::put($uri, $callback);
Route::patch($uri, $callback);
Route::delete($uri, $callback);
Route::options($uri, $callback);
```

如果需要给一个路由同时注册多个方法，可以使用 `match` 方法：

```php
Route::match(['get', 'post'], '/demo', function () {
    return 'ok';
});
```

或者使用 `any` 接收所有方法：

```php
Route::any('/demo', function () {
    return 'ok';
});
```

### 重定向路由

使用 `redirect` 方法可以快速重定向到其他路径：

```php
Route::redirect('/redirect', '/demo');

Route::get('/demo', function () {
    return 'get';
});
```

默认情况下，重定向会使用 302 状态码，可以使用第三个参数修改状态码：

```php
Route::redirect('/redirect', '/demo', 301);
```

### 视图路由

`Route::view('/welcome', 'welcome')`

### 查看路由列表

使用 `php artisan route:list` 可以查看所有路由列表。

默认情况下，此命令不会输出中间件信息，可以通过 `-v` 参数显示中间件信息：

```shell
php artisan route:list -v

# 展开中间件组
php artisan route:list -vv
```

也可以指定只显示给定 URI 开头的路由：

```shell
php artisan route:list --path=api
```

也可以查看第三方库暴露的路由：

```shell
# 仅显示第三方库的路由
php artisan route:list --only-vendor
# 不显示第三方库的路由
php artisan route:list --except-vendor
```

### 自定义路由

可以使用 `withRouting` 方法的 `using` 属性来完全手动控制路由，这种情况下，Laravel 不会自动加载任何路由：

```php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        using: function () {
            Route::prefix('custom')->group(base_path('routes/api.php'));
        },
    )
```

## 路由参数

### 必传参数

路由参数用 `{}` 包裹，参数名应该由字母字符或者`_`组成，路由参数根据顺序注入到路由处理回调中，回调中的参数名无关紧要。

```php
Route::post('/{username}/hello', function (string $name) {
    return 'Hello' . $name;
});
```

如果路由回调中需要容器注入参数，那么路由参数应该排在注入参数后面：

```php
Route::post('/{username}/hello', function (AnimalService $animalService, string $name) {
    $animalService->run();
    return 'Hello ' . $name;
});
```

### 可选参数

如果一个路由参数可以不传，那么需要在参数名称后添加 `?` 标记并在回调函数中指定默认值：

```php
Route::post('/hello/{username?}', function (AnimalService $animalService, string $name = 'PPG007') {
    $animalService->run();
    return 'Hello ' . $name;
});
```

::: tip

可选参数必须在路由的末尾。

:::

### 正则表达式限制

可以使用 where 方法来指定一个路由中参数需要满足的正则表达式，例如限制传入的 id 是 objectId：

```php
Route::get('/orders/{id}', function (string $id) {
    return $id;
})->where([
    'id' => '[a-f,0-9]{24}'
]);
```

Laravel 也提供了一些内置的规则：

```php
Route::get('/orders/{type}/{id}', function (string $type, string $id) {
    return $id;
})->where([
    'id' => '[a-f,0-9]{24}'
])->whereIn('type', ['customer', 'business']);
```

::: info

如果传入的参数不能匹配正则表达式，那么会返回 404。

:::

如果希望路由参数始终受到正则表达式限制，那么可以在 Service Provider 中使用 `pattern` 方法：

```php
public function boot(): void
{
    Route::pattern('id', '[a-f,0-9]{24}');
}
```

Laravel 路由允许路由参数中出现 `/` 之外的所有字符，如果需要在路由参数中包含 `/` 字符， 那么需要设置正则表达式明确允许：

```php
Route::post('/proxy/{path}', function (string $path) {
    return $path;
})->where('path', '.*');
```

::: tip

与可选参数相同，出现 `/` 字符的参数也必须在路由的末尾。

:::
