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

::: code-tabs#animal

@tab DogService

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

@tab CatService

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

:::

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

### 上下文绑定

同一个接口可能在若干类中被使用，如果希望不同的类使用不同的实现，可以使用上下文绑定：

::: code-tabs#context-binding

@tab CatController

```php
class CatController extends Controller
{
    private AnimalService $animalService;
    public function __construct(AnimalService $animalService)
    {
        $this->animalService = $animalService;
    }

    public function index()
    {
        $this->animalService->run();
        return view('welcome');
    }
}
```

@tab DogController

```php
class DogController extends Controller
{
    private AnimalService $animalService;
    public function __construct(AnimalService $animalService)
    {
        $this->animalService = $animalService;
    }

    public function index()
    {
        $this->animalService->run();
        return view('welcome');
    }
}
```

@tab AppServiceProvider

```php
public function register(): void
{
    $this->app->when(DogController::class)->needs(AnimalService::class)->give(function () {
        return new DogService();
    });
    $this->app->when([CatController::class])->needs(AnimalService::class)->give(function (){
        return new CatService();
    });
}
```

:::

Laravel 也提供了上下文绑定属性，可以直接在注入的地方指定而不需要在 Service Provider 中进行绑定：

```php
class DogController extends Controller
{
    private AnimalService $animalService;
    public function __construct(
        AnimalService $animalService,
        #[Config('app.name')] protected string $name,
        #[Log('stack')] protected LoggerInterface $log,
    )
    {
        $this->animalService = $animalService;
    }

    public function index()
    {
        $this->animalService->run();
        $this->log->info('test', [
            'appName' => $this->name,
        ]);
        return view('welcome');
    }
}
```

Laravel 提供了 `Auth`、`Cache`、`Config`、`DB`、`Log`、`RouteParameter`、`Tag`、`Storage` 属性。

::: tip

`#[...]` 是 PHP 8.0 以后的特性。

:::

### 标记

又是可能需要获取批量绑定，可以先给这一批绑定打上标记，然后通过标记来获取：

::: code-tabs#tagging

@tab AppServiceProvider

```php
public function register(): void
{
    $this->app->tag([
        CatService::class,
        DogService::class,
    ], 'animals');
}
```

@tab DemoController

```php
public function demo()
{
    $animals = App::tagged('animals');
    foreach ($animals as $animal) {
        $animal->run();
    }
    return \view('welcome');
}
```

:::

### 绑定参数

有时，被注入的类除了接收绑定的类之外，还要接收一些基础变量，例如整数，此时可以使用上下文绑定来赋值：

::: code-tabs#binding-primitives

@tab AppServiceProvider

```php
public function register(): void
{
    $this->app->bind(AnimalService::class,function (){return new DogService();});
    $this->app->when(DogController::class)->needs('$name')->give('poppy');
}
```

@tab DogController

```php
class DogController extends Controller
{
    private AnimalService $animalService;
    public function __construct(
        AnimalService $animalService,
        #[Log('stack')] protected LoggerInterface $log,
        private string $name,
    )
    {
        $this->animalService = $animalService;
    }

    public function index()
    {
        $this->animalService->run();
        $this->log->info('test', [
            'appName' => $this->name,
        ]);
        return view('welcome');
    }
}
```

:::

如果需要从配置文件中注入值，可以用 `giveConfig` 方法：

```php
$this->app->when(DogController::class)->needs('$name')->giveConfig('app.name');
```

如果需要注入被标记的数组，可以使用 `giveTagged` 方法：

::: code-tabs#binding-tagged

@tab AppServiceProvider

```php
public function register(): void
{
    $this->app->tag([
        CatService::class,
        DogService::class,
    ], 'animals');
    $this->app->when(DemoController::class)->needs('$animals')->giveTagged('animals');
}
```

@tab DemoController

```php
class DemoController extends Controller
{

    public function __construct(
        private array $animals = [],
    )
    {
    }

    public function demo()
    {
        foreach ($this->animals as $animal) {
            $animal->run();
        }
        return \view('welcome');
    }
}
```

:::

对于可变参数，可以使用 `give` 方法的回调函数来处理：

::: code-tabs#binding-variadic

@tab AppServiceProvider

```php
public function register(): void
{
    $this->app->when(DemoController::class)->needs(AnimalService::class)->give([
        DogService::class,
        DogService::class,
        DogService::class,
        DogService::class,
    ]);
}
```

@tab DemoController

```php
class DemoController extends Controller
{

    private array $animals;
    public function __construct(
        AnimalService ...$animals,
    )
    {
        $this->animals = $animals;
    }

    public function demo()
    {
        foreach ($this->animals as $animal) {
            $animal->run();
        }
        return \view('welcome');
    }
}
```

:::

::: tip

上面为可变参数赋值也可以用 `giveTagged()` 方法。

:::

### 扩展绑定

如果要对某个被绑定的类进行扩展，可以使用 `extend` 方法：

::: code-tabs#extending-bindings

@tab AppServiceProvider

```php
public function register(): void
{
    $this->app->when(DogController::class)->needs(AnimalService::class)->give(function (){return new DogService();});
    $this->app->when(CatController::class)->needs(AnimalService::class)->give(function (){return new CatService();});
    $this->app->extend(AnimalService::class, function (AnimalService $animal) {
        return new AnimalDecorator($animal);
    });
}
```

@tab AnimalDecorator

```php
class AnimalDecorator extends AnimalService
{
    public function __construct(
        private AnimalService $animal,
    )
    {
    }

    public function run(): void
    {
        Log::info('animal decorator');
        $this->animal->run();
    }
}
```

:::

### 解析

使用 `make` 方法可以从容器中解析实例，此方法接受想要解析的类或接口名，同时能够传入构造所需的参数：

```php
$this->app->extend(AnimalService::class, function (AnimalService $animal) {
    return $this->app->make(AnimalDecorator::class, ['animal' => $animal]);
});
```

使用 `bound` 方法可以判断是否已绑定类或接口：

```php
$this->app->bound(AnimalService::class);
```

如果在 Service Provider 之外，可以使用 App 类来调用 `make` 和 `bound` 方法：

```php
public function demo()
{
    $animal = App::make(CatService::class);
    $animal->run();
    return \view('welcome');
}
// 指定参数
public function demo()
{
    $animal = App::makeWith(AnimalDecorator::class, ['animal' => App::make(CatService::class)]);
    $animal->run();
    return \view('welcome');
}
```

如果想将 Laravel 容器注入到正在解析的类中，可以在这个类的构造函数上使用 `Container` 类型提示：

```php
class AnimalDecorator extends AnimalService
{
    public function __construct(
        private Container $container,
    )
    {
    }

    public function run(): void
    {
        Log::info('animal decorator');
        $this->container->make(CatService::class)->run();
    }
}
```

::: tip

Laravel 服务容器实现了 PSR-11 接口，所以也可以在其他地方通过类型提示来注入容器实例。

:::

### 方法调用与参数注入

如果需要在类对象实例上调用方法，同时完成参数的注入，可以使用 `call` 方法：

::: code-tabs#method-call

@tab AppServiceProvider

```php
public function register(): void
{
    $this->app->bind(AnimalService::class, DogService::class);
    $this->app->when(DogController::class)->needs(AnimalService::class)->give(function (){return new DogService();});
    $this->app->when(CatController::class)->needs(AnimalService::class)->give(function (){return new CatService();});
}
```

@tab AnimalDecorator

```php
class AnimalDecorator{
    public function run(AnimalService $animal)
    {
        $animal->run();
        return ['method' => 'run'];
    }

    public static function runs(AnimalService $animal)
    {
        $animal->run();
        return ['method' => 'runs'];
    }
}
```

@tab CatController

```php
public function index()
{
    $result = App::call([AnimalDecorator::class, 'runs']);
    Log::info($result);
    $result = App::call([new AnimalDecorator(), 'run']);
    Log::info($result);
    return view('welcome');
}
```

:::

也可以传入 callable 类型闭包函数：

```php
$result = App::call(function (AnimalService $animalService){
    $animalService->run();
    return  'ok';
});
```

::: warning

`call` 方法里注入的变量不支持上下文绑定的情况。

:::

### 容器事件

容器在解析对象时会触发一些事件，可以监听这些事件来执行一些操作：

```php
$this->app->resolving(function ($object, $app) {
    // Called when container resolves object of any type...
});

$this->app->resolving(AnimalService::class, function ($animal, $app) {
    // Called when container resolves objects of type "AnimalService"...
});
```

`rebinding` 方法用于监听当一个类被重新绑定到容器时，可以执行一些操作：

```php
<?php

namespace App\Providers;

use App\Services\AnimalService;
use App\Services\Impl\CatService;
use App\Services\Impl\DogService;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AnimalService::class, DogService::class);
        App::rebinding(AnimalService::class, function (Application $app, AnimalService $instance) {
            $instance->run();
        });
        $this->app->bind(AnimalService::class, CatService::class);
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

第二个 bind 调用将会触发 rebinding 逻辑。

## Service Providers

要自定义 Service Provider，需要创建一个类并继承 `Illuminate\Support\ServiceProvider`，大多数情况下应该都包含 register 和 boot 两个方法。

::: tip

使用 `php artisan make:provider DemoProvider` 可以在 `app/Providers` 目录下创建一个 Service Provider，同时注册到 `bootstrap/providers.php` 文件中。

:::

### register 方法

在 register 方法中，应该只绑定服务到容器中，不应该尝试注册任何事件监听器、路由或任何其他功能。

除了此前可以使用 `bind()`、`singleton()` 等方法提供绑定之外，还可以使用 `$bindings` 和 `$singletons` 属性来提供绑定：

```php
class AppServiceProvider extends ServiceProvider
{
    public $bindings = [
        AnimalService::class => CatService::class,
    ];
    public $singletons = [CounterService::class];
}
```

### boot 方法

`boot()` 方法将会在所有 Service Provider 的 `register()` 方法被调用后调用，因此可以安全地使用其他服务，还可以注册事件监听器、路由和任何其他需要启动的应用程序的其他功能。

例如在自定义的 Service Provider 中使用另一个 Service Provider 绑定的内容：

```php
class DemoProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }
    public function boot(): void
    {
        $animal = $this->app->get(AnimalService::class);
        $animal->run();
    }
}
```

也可以为 boot 方法指定类型提示：

```php
public function boot(AnimalService $animalService): void
{
    $animalService->run();
}
```

### 注册 Service Provider

所有的 Service Provider 都需要在 `bootstrap/providers.php` 文件中注册，此文件返回一个包含所有需要注册的 Service Provider 的数组。

### 延迟加载

如果一个 Service Provider 只是在容器中进行绑定，那么可以选择推迟 register，直到提供的绑定被用到时才注册，这样可以提升性能。

要实现延迟加载，需要实现 `Illuminate\Contracts\Support\DeferrableProvider` 接口，并实现 `provides` 方法，此方法返回一个数组，包含所有提供的绑定。

## Facades

Facades 提供了简洁的语法来使用 Laravel 几乎所有的功能。

Facade 命名空间内的具体功能类是通过继承 `Facade` 类并重写 `getFacadeAccessor` 方法，此方法返回一个字符串，在使用任何静态方法时，Laravel 会使用这个字符串来从容器中解析出对应的绑定。
