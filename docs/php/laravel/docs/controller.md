# Controller

## 基础

默认情况下，Controllers 保存在 `app/Http/Controllers` 目录下。

使用 `php artisan make:controller` 命令可以创建一个 Controller：

```shell
php artisan make:controller MemberController
```

每个 Controller 可以包含若干公共方法，这些方法将用于响应 HTTP 请求。

然后可以定义一个指向 Controller 的路由：

```php
Route::get('/member/{id}', [MemberController::class, 'getMember']);
```

::: tip

Controller 不需要一定要继承一个类，但是通过继承一个公共类可以方便的共享逻辑。

:::

如果一个 Controller 只想提供一个接口，那么可以在 Controller 中定义 `__invoke()` 方法：

::: code-tabs#controller-invoke

@tab MemberController.php

```php
class MemberController extends Controller
{
    public function __invoke(string $id)
    {
        return ['id' => $id];
    }
}
```

@tab api.php

```php
Route::get('/members/{id}', MemberController::class);
```

:::

上面的创建 Controller 命令可以使用 `--invokable` 选项创建一个单接口的 Controller：

```shell
php artisan make:controller MemberController --invokable
```

## 中间件

除了可以在 `api.php` 中像普通路由那样使用 `->middleware()` 方法来添加中间件，如果希望在 Controller 内部使用中间件，Controller 应该实现 `HasMiddleware` 接口，同时重写 `middleware()` 方法：

```php
class MemberController extends Controller implements HasMiddleware
{
    public function __invoke(string $id)
    {
        return ['id' => $id];
    }

    public static function middleware(){
        return [
          First::class,
          Second::class,
        ];
    }
}
```

如果同一个 Controller 中包含多个接口方法，不同接口方法又希望能使用不同的中间件，那么可以使用 `Illuminate\Routing\Controllers\Middleware` 构造中间件：

```php
public static function middleware(){
    return [
        First::class,
        Second::class,
        new Middleware(Auth::class, only: ['createMember'])
    ];
}
```

如果希望使用一个匿名内部中间件，可以在 middleware 中返回的数组里直接定义一个闭包：

```php
public static function middleware(){
    return [
        First::class,
        Second::class,
        function (Request $req, Closure $next) {
            Log::info('third');
            return $next($req);
        }
    ];
}
```

## 资源 Controller

很多时候，每个接口包含的内容就是对一个资源的 CRUD 操作，Laravel 允许创建一个 Resource Controller，不需要为 CRUD 分别绑定路由，只要使用 `resource` 方法即可。

::: code-tabs#resource-controller

@tab artisan

```shell
php artisan make:controller MemberController --resource
```

@tab api.php

```php
Route::resource('members', MemberController::class);
```

:::

以上面的 MemberController 为例，请求路径与 Controller 中的方法的对应关系：

|HTTP Method| URI | Controller 方法 |路由名称|
|:---:|:---:|:---:|:---:|
|GET| /members | index | members.index |
|GET| /members/create | create | members.create |
|POST| /members | store | members.store |
|GET| /members/{member} | show | members.show |
|GET| /members/{member}/edit | edit | members.edit |
|PUT/PATCH| /members/{member} | update | members.update |
|DELETE| /members/{member} | destroy | members.destroy |

::: tip

URI 的前缀取决于使用 `resource` 方法的定义。

同时，也可以使用 `artisan route:list` 命令查看路由。

:::

Model: TODO:

### 部分资源路由

声明资源路由时，可以使用 `only` 或 `except` 选项来指定需要生成的路由：

```php
Route::resource('members', MemberController::class)->except([
    'edit', 'create'
]);
```

在声明 API 资源 Controller 时，通常都会排除 `create` 和 `edit` 方法，可以将 `resource` 方法替换为 `apiResource`：

```php
Route::apiResource('members', MemberController::class);
```

或者，在使用 `artisan make:controller` 命令时就指定不生成 `create` 和 `edit` 方法：

```shell
php artisan make:controller MemberController --api
```

### 嵌套资源

有时可能需要嵌套资源，例如一个客户可以有多个地址，要嵌套资源 Controller，可以如下声明：

```php
Route::apiResource('members.addresses', MemberAddressController::class);
```

与非嵌套资源类似，可以使用 `/members/{member}` 作为前缀访问 `/addresses/{address}` 等 URI。

很多时候嵌套的路由并不需要上级的参数，比如 addressId 已经足够定位到具体的 member 和 address 了，因此可以使用 `shallow` 选项来实现浅层嵌套：

```php
Route::apiResource('members.addresses', MemberAddressController::class)->shallow();
```

这种情况下路由的关联关系：

|HTTP Method| URI | Controller 方法 |路由名称|
|:---:|:---:|:---:|:---:|
|GET| /members/{member}/addresses | index | members.addresses.index |
|GET| /members/{member}/addresses/create | create | members.addresses.create |
|POST| /members/{member}/addresses | store | members.addresses.store |
|GET| /addresses/{address} | show | addresses.show |
|GET| /addresses/{address}/edit | edit | addresses.edit |
|PUT/PATCH| /addresses/{address} | update | addresses.update |
|DELETE| /addresses/{address} | destroy | addresses.destroy |

### 命名资源路由的参数

默认情况下，资源路由里的参数名称都是资源的单数形式。例如，资源名称为 members，参数名称就是 member。

如果希望自定义参数名，那么可以使用 `parameter` 或 `parameters` 方法：

```php
Route::apiResource('members', MemberController::class)->parameter('members', 'id');
Route::apiResource('members.addresses', MemberAddressController::class)->shallow()->parameters([
    'members' => 'memberId',
    'addresses' => 'id',
]);
```

### 补充资源控制器

如果默认的资源控制器已有的方法不能满足需求，需要增加其他方法，那么需要在调用 `Route::resource` 方法前定义这些路由：

```php
Route::post('/members/{id}/reward', [MemberController::class, 'reward']);
Route::apiResource('members', MemberController::class)->parameter('members', 'id');
```

### 单例资源控制器

有的资源应当是单例的，例如在多租户系统中，每个租户的系统设置应当仅有一个，而且不能删除或者创建，仅允许查看及更新，这种情况下，可以使用 `singleton` 方法来定义资源路由：

```php
Route::singleton('setting', SettingController::class);
```

这将会注册以下路由：

|HTTP Method| URI | Controller 方法 |路由名称|
|:---:|:---:|:---:|:---:|
|GET| /setting | show | setting.show |
|GET| /setting/edit | edit | setting.edit |
|PUT/PATCH| /setting | update | setting.update |

单例资源也能嵌套在非单例资源中，例如将上面的设置嵌套到租户的资源中：

```php
Route::apiResource('accounts', AccountController::class);
Route::singleton('accounts.setting', SettingController::class);
```

这样，除了 accounts 本身应该创建的路由之外，还会创建以下路由：

|HTTP Method| URI | Controller 方法 |路由名称|
|:---:|:---:|:---:|:---:|
|GET| /accounts/{account}/setting | show | accounts.setting.show |
|GET| /accounts/{account}/setting/edit | edit | accounts.setting.edit |
|PUT/PATCH| /accounts/{account}/setting | update | accounts.setting.update |

如果有时既需要单例资源控制器，有需要支持创建和删除，那么可以分别使用 `creatable` 和 `destroyable` 方法：

```php
Route::singleton('accounts.setting', SettingController::class)->creatable()->destroyable();
```

同样的，如果不需要 `create` 和 `edit` 方法，那么可以将单例控制器声明为 API 单例控制器：

```php
Route::apiSingleton('accounts.setting', SettingController::class)->creatable()->destroyable();
```

## 依赖注入

Laravel 容器会解析所有的 Controller，所以可以在 Controller 的构造函数中注入依赖。

同样的，具体的方法上也可以通过类型提示来注入依赖。

::: tip

如果具体的方法还需要路由参数，那么路由参数也要定义在注入的依赖参数之后。

:::
