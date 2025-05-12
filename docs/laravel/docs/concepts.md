# 概念

## 请求生命周期

对于 Laravel 应用，所有的请求入口都是 `public/index.php`，所有请求都由 Web 服务器定向到此文件。此文件加载 Composer 自动加载器、创建应用实例并运行。

第二步，根据请求的类型，使用 handleRequest 或 handleCommand 方法将传入的请求发送的 HTTP 内核或控制台内核。内核在完成初始化配置后，将请求继续向下转发。

内核初始化的其中一步就是加载 Service Providers，Service Providers 负责引导框架的各种组件，例如数据库、路由。Laravel 将遍历并实例化每个 Service Provider，然后调用其 register 方法。最后，一旦所有服务提供者都被注册，Laravel 将调用其 boot 方法。

在 Service Providers 被注册完成后，请求会被发送给路由，路由将请求转发给对应的 controller，并且相关的中间件也会被调用。

最后，在 controller 返回响应后并通过中间件传回后，响应会被发送回 Web 服务器。

## 服务容器（依赖注入）

类似于 Spring，Laravel 也提供了依赖注入的能力，同样通过构造器或者 setter 方法将依赖注入到类中。

### 基础例子

接下来看一个例子，首先在 `app/Services` 目录下新建一个 Demo 类：

```php
<?php

namespace App\Services;

class Demo
{
    public function demo() : string
    {
        return 'demo';
    }
}
```

然后在项目中的 `app/Http/Controllers` 内新建一个 DemoController：

```php
<?php

namespace App\Http\Controllers;

use App\Services\Demo;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

class DemoController extends Controller
{
    public function __construct(
        protected Demo $demo
    ){}

    public function demo(): View
    {
        Log::info('demo', [
            'result' => $this->demo->demo(),
        ]);
        return \view('welcome');
    }
}
```

接下来，到 `routes/web.php` 中添加路由：

```php
<?php

use App\Http\Controllers\DemoController;
use Illuminate\Support\Facades\Route;

Route::get('/demo', [DemoController::class, 'demo']);
```

最后，访问 `/demo` 即可在 storage/logs/laravel.log 中看到日志。

::: tip

如果一个类没有依赖项或者仅依赖于其他类而不是接口，那么不需要配置这个类的实例也能被 Laravel 容器解析。

:::

### 手动绑定的情况

通常情况下，不需要进行手动绑定，直接对参数进行类型提示即可，例如：

```php
use Illuminate\Http\Request;

Route::get('/', function (Request $request) {
    // ...
});
```

但是如果要注入的类型是接口、抽象类，那么必须告诉 Laravel 如何解析这个依赖，此时就需要使用手动绑定。

### 基础绑定

例如修改上面的例子，创建一个 AnimalService 抽象类：

```php
<?php

namespace App\Services;

abstract class AnimalService
{
    abstract public function run(): void;
}
```

接下来在 `Services/Impl` 里分别创建 DogService 和 CatService：

```php
<?php

namespace App\Services\Impl;

use App\Services\AnimalService;
use Illuminate\Support\Facades\Log;

class DogService extends AnimalService
{

    public function run(): void
    {
        Log::info('dog running');
    }
}
```

```php
<?php

namespace App\Services\Impl;

use App\Services\AnimalService;
use Illuminate\Support\Facades\Log;

class CatService extends AnimalService
{

    public function run(): void
    {
        Log::info('cat running');
    }
}
```

修改 `DemoController`：

```php
<?php

namespace App\Http\Controllers;

use App\Services\AnimalService;

class DemoController extends Controller
{
    private AnimalService $animalService;

    public function __construct(AnimalService $animalService)
    {
        $this->animalService = $animalService;
    }

    public function demo()
    {
        $this->animalService->run();
        return \view('welcome');
    }
}
```

最后，在 `Providers/AppServiceProvider.php` 中进行绑定：

```php
<?php

namespace App\Providers;

use App\Services\AnimalService;
use App\Services\Impl\DogService;
use Illuminate\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind(AnimalService::class, function (Application $app) {
            return $app->make(DogService::class);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
```

::: tip

手动绑定时，解析器参数是 `Illuminate\Foundation\Application` 类的实例，这个类继承自 `Illuminate\Container\Container`，因此可以使用 `make` 方法来解析依赖。

:::

如果不想在 Service Provider 中进行绑定，也可以使用 App 类进行绑定：

```php
public function register(): void
{
    App::bindIf(AnimalService::class, function (Application $app) {
        return $app->make(CatService::class);
    });
}
```

::: tip

bindIf 仅会在尚未绑定时生效，如果已经绑定了此方法将不做任何事。

:::

bind 方法的第一个参数也可以省略，为初始化函数指定返回值类型即可：

```php
App::bind(function (Application $app): AnimalService {
    return $app->make(CatService::class);
});
```

将接口、抽象类绑定到实现时，如果不需要其他参数来构造，可以使用 bind 方法的快捷方式：

```php
App::bind(AnimalService::class, DogService::class);
```

### 绑定单例

默认情况下，每次注入的依赖都是一个新的实例，可以通过以下的例子验证：

首先创建一个 CounterService：

```php
class CounterService
{
    private int $count = 0;

    public function incr()
    {
        $this->count++;
        Log::info('result', [
            'count' => $this->count,
        ]);
    }
}
```

然后在 Controller 中调用：

```php
class DemoController extends Controller
{
    private CounterService $counterService;

    public function __construct(CounterService $counterService)
    {
        $this->counterService = $counterService;
    }

    public function demo(CounterService $counterService)
    {
        $counterService->incr();
        $this->counterService->incr();
        return \view('welcome');
    }
}
```

通过日志可以看到，两次 `incr()` 的结果都是 1，说明每次注入的都是一个新的实例。

接下来使用单例绑定：

```php
$this->app->singleton(CounterService::class);
```

此时在观察日志输出可以看到两次结果分别是 1、2，说明此时注入的是同一个实例。

`scoped` 方法与 `singleton` 方法类似，但是它只在当前请求周期内保持单例：

```php
$this->app->scoped(CounterService::class);
```

除了这两种方法外，还可以使用 `instance` 方法来注册一个已存在的实例：

```php
$counterService = new CounterService();
$this->app->instance(CounterService::class, $counterService);
```

## Service Providers

要自定义 Service Provider，需要继承 `Illuminate\Support\ServiceProvider`，大多数情况下应该都包含 register 和 boot 两个方法。在 register 方法中，应该只绑定服务到容器中，不应该尝试注册任何事件监听器、路由或任何其他功能。

## Facades
