# 错误处理

Laravel 默认已经配置好了错误处理，如果希望自定义错误处理，可以在 `bootstrap/app.php` 中使用 `withExceptions` 方法，此方法接收一个 `Illuminate\Foundation\Configuration\Exceptions` 的实例。

## 处理异常

### 上报异常

使用 `report` 方法可以注册一个闭包，这个闭包将在特定类型（需要类型标注）的异常被抛出时调用：

::: code-tabs#report

@tab DemoException.php

```php
<?php

namespace App\Exception;

class DemoException extends \Exception
{
}
```

@tab bootstrap/app.php

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (DemoException $e) {
        Log::error('demo', [
            'message' => $e->getMessage(),
            'code' => $e->getCode(),
        ]);
    });
})
```

@tab AccountController.php

```php
public function store(Request $request)
{
    throw new DemoException('test', 400);
}
```

:::

在使用 `report` 方法注册异常处理回调时，Laravel 仍然会使用默认日志配置记录异常，如果希望不使用默认日志，可以使用 `stop` 方法或者在 `report` 方法的闭包中返回 `false`：

```php
$exceptions->report(function (DemoException $e) {
    Log::error('demo', [
        'message' => $e->getMessage(),
        'code' => $e->getCode(),
    ]);
})->stop();
```

如果希望上报异常但是继续执行逻辑，不给用户显示错误信息或页面，可以使用 `report` 帮助方法：

```php
public function show(Request $request, string $id)
{
    $validator = Validator::make($request->all(), [
        'id' => [new ObjectId()],
    ]);
    $validator->validate();
    return $request->all();
}
```

### 异常日志上下文

Laravel 会自动将当前用户 ID 作为上下文记录到每个异常日志消息中，如果想自定义全局日志上下文，可以使用 `context` 方法：

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->context(function () {
        return [
            'now' => now()->toIso8601String(),
        ];
    });
})
```

在异常类中定义一个 `context` 方法，此方法返回一个数组，数组中的键值对会被记录到异常日志中：

```php
class DemoException extends \Exception
{
    public function __construct(
        private string $accountId,
    )
    {
        parent::__construct('Demo Exception');
    }

    public function context(): array
    {
        return [
            'accountId' => $this->accountId,
        ];
    }
}
```

### 异常上报去重

使用 `report` 全局方法时，同一个异常可能会被上报多次，使用 `dontReportDuplicates` 方法可以忽略重复的异常：

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReportDuplicates();
})
```

上报处：

```php
public function store(Request $request)
{
    try {
        throw new DemoException(Str::uuid()->toString());
    } catch (\Exception $e) {
        report($e);
        report($e); // ignored
        report($e); // ignored
    }
    return false;
}
```

### 异常日志级别

使用 `level` 方法可以指定 Laravel 异常日志的级别：

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->level(DemoException::class, LogLevel::INFO);
})
```

### 按类型忽略

如果希望永远不要上报某个异常，可以使用 `dontReport` 方法：

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReport(DemoException::class);
})
```

或者将自定义异常类实现 `Illuminate\Contracts\Debug\ShouldntReport` 接口：

```php
<?php

namespace App\Exception;

use Illuminate\Contracts\Debug\ShouldntReport;

class DemoException extends \Exception implements ShouldntReport
{
    //
}
```

默认情况下，Laravel 已经忽略了一部分异常，例如 404 错误，如果希望不要忽略特定的异常，可以使用 `stopIgnoring` 方法：

```php
use Symfony\Component\HttpKernel\Exception\HttpException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->stopIgnoring(HttpException::class);
})
```

### 渲染异常

默认情况下，Laravel 会将异常转换为 HTTP 响应，如果希望为特定的异常注册自定义渲染逻辑，可以使用 `render` 方法，传递给这个方法的闭包应该返回一个 `Illuminate\Http\Response` 实例：

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function(DemoException $e, Request $req) {
        return response()->json([
            'accountId' => $e->getAccountId(),
            'params' => $req->all(),
        ]);
    });
})
```

::: tip

如果传入 `render` 方法的闭包没有返回值，Laravel 将使用默认的异常渲染。

:::

在渲染异常时，Laravel 将根据 `Accept` 请求头来确定应该将异常渲染为 HTML 还是 JSON，如果希望自定义这个逻辑，可以使用 `shouldRenderJsonWhen` 方法：

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(function (Request $req, Throwable $e) {
        return true;
    });
})
```

### 可上报和可渲染的异常

上面的异常处理方式都是要在 `app.php` 中进行配置，如果自定义异常较多会比较复杂，因此 Laravel 允许在自定义类中直接提供 `report` 和 `render` 方法，这样在异常处理时，可以更方便的使用这些方法：

```php
<?php

namespace App\Exception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DemoException extends \Exception
{
    public function __construct(
        private string $accountId,
    )
    {
        parent::__construct('Demo Exception');
    }

    public function report()
    {
        Log::warning('demo', [
            'accountId' => $this->accountId,
        ]);
    }

    public function render(Request $request)
    {
        return \response()->json([
            'params' => $request->all(),
        ], 400);
    }
}
```

`report` 方法可以通过返回一个布尔值来控制当前异常是否需要上报。`render` 方法也可以通过返回 `false` 来使用默认的异常渲染。

::: tip

`report` 方法可以通过类型提示进行依赖注入。

:::

## HTTP 异常

如果只是想返回一个 HTTP 错误码并抛出异常，可以使用 `abort` 函数：

```php
public function store(Request $request)
{
    abort(403);
}
```
