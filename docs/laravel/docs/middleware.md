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

Laravel 包含预定义的 `web` 和 `api` 中间件组，它们分别对应于 `web` 和 `api` 路由组，这两个中间件组是默认生效的，如果希望将自定义中间件添加到这些组中，可以使用 `web` 或 `api` 方法：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(
        prepend: [Auth::class],
    );
})
```

### 中间件别名

如果一个中间件类名比较长，那么可以使用 `alias` 方法给中间件起别名：

::: code-tabs#group-middleware-alias

@tab app.php

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'a' => Auth::class,
        'f' => First::class,
        's' => Second::class,
    ]);
})
```

@tab api.php

```php
Route::controller(DemoController::class)->middleware(['a', 'f', 's'])->group(function () {
    Route::get('/members/{id}', 'getMember')->name('get');
    Route::post('/members', 'createMember')->name('create');
});
```

:::

### 中间件排序

如果需要中间件按顺序执行，那么可以在 `bootstrap/app.php` 中使用 `priority` 方法：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->priority([
        First::class,
        Second::class,
        Auth::class,
    ]);
})
```

## 中间件参数

中间件还可以接收参数，参数会在 `handle` 方法中的 $next 参数后作为参数传入：

::: code-tabs#group-middleware-param

@tabs api.php

```php
Route::controller(DemoController::class)->middleware(['a', 'f:demo', 's'])->group(function () {
    Route::get('/members/{id}', 'getMember')->name('get');
    Route::post('/members', 'createMember')->name('create');
});
```

@tabs app.php

```php
public function handle(Request $request, Closure $next, $scene): Response
{
    Log::info('first', [
        'scene' => $scene,
    ]);
    return $next($request);
}
```

:::

如果有多个参数，可以使用 `:` 分隔：

```php
Route::controller(DemoController::class)->middleware(['a', 'f:demo,test', 's'])->group(function () {
    Route::get('/members/{id}', 'getMember')->name('get');
    Route::post('/members', 'createMember')->name('create');
});
```

## 终止后执行中间件

如果需要在响应发出后继续执行一些逻辑，可以在中间件中定义 `terminate` 方法，此方法将在使用了 FastCGI 的情况下，在响应发送后自动被调用。

```php
<?php

namespace Illuminate\Session\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TerminatingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Handle tasks after the response has been sent to the browser.
     */
    public function terminate(Request $request, Response $response): void
    {
        // ...
    }
}
```

`terminate` 方法同时接收请求和响应，终止后执行中间件应该添加到全局中间件中。

在中间件上调用 `terminate` 方法时，Laravel 将会解析一个新的中间件实例，如果要在调用 `handle` 和 `terminate` 方法中使用相同的实例，应该在 AppServiceProvider 中将这个中间件注册为单例。
