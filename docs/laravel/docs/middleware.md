# 中间件

自定义中间件通常放在 `app/Http/Middleware` 目录。

## 定义中间件

使用 `make:middleware` 命令可以创建一个中间件：

```shell
php artisan make:middleware Auth
```

可以在这个中间件中添加限定，请求 Headers 中必须包含指定的 secret 才能继续执行，否则抛出 401：

```php
class Auth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $secret = $request->header('x-secret');
        if ($secret !== 'PPG test secret') {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        return $next($request);
    }
}
```

当中间件需要继续 执行时，需要调用 `$next` 参数并传入 `$request` 参数。

通过 `$next` 和中间件的逻辑顺序的调整，可以实现前置中间件和后置中间件。

::: tip

所有的中间件都会经过容器解析，这意味着可以在构造函数里注入依赖。

:::

## 注册中间件

### 全局中间件

全局中间件会在每个 HTTP 请求中执行，可以在 `bootstrap/app.php` 中使用 `withMiddleware` 方法注册：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->append(Auth::class);
})
```

`append` 方法会将指定的中间件添加到中间件列表的最后，如果希望从列表头部添加，可以使用 `prepend` 方法：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->prepend(Auth::class);
})
```

### 路由级中间件

如果想给单个路由添加中间件，可以使用 `middleware` 方法：

```php
Route::controller(DemoController::class)->group(function () {
    Route::get('/members/{id}', 'getMember')->name('get');
    Route::post('/members', 'createMember')->name('create')->middleware([Auth::class]);
});
```

也可以给路由组添加中间件：

```php
Route::controller(DemoController::class)->middleware([Auth::class])->group(function () {
    Route::get('/members/{id}', 'getMember')->name('get');
    Route::post('/members', 'createMember')->name('create');
});
```

::: tip

给路由组添加中间件时，`middleware` 方法要在 `group` 方法之前调用。

:::

给一组路由添加中间件时，如果组中的某个路由不需要中间件，那么可以使用 `withoutMiddleware` 方法：

```php
Route::controller(DemoController::class)->middleware([Auth::class])->group(function () {
    Route::get('/members/{id}', 'getMember')->name('get')->withoutMiddleware([Auth::class]);
    Route::post('/members', 'createMember')->name('create');
});
```

::: important

移除中间件不适用于全局中间件。

:::

### 中间件组

将中间件分组后可以更简单的分配给路由，可以在 `bootstrap/app.php` 中使用 `appendToGroup` 方法：

::: code-tabs#group-middleware-group

@tab app.php

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->appendToGroup('test', [
        First::class,
        Second::class,
    ]);
})
```

@tab api.php

```php
Route::controller(DemoController::class)->middleware('test')->group(function () {
    Route::get('/members/{id}', 'getMember')->name('get');
    Route::post('/members', 'createMember')->name('create');
});
```

### 中间件别名

### 中间件排序

## 中间件参数

## 可终止中间件
