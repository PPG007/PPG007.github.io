# 安全

## 身份验证

Laravel 内置了身份认证功能，这个功能由 Guard 和 Provider 组成。Guard 定义了每个请求中的身份认证方式，例如 Session Guard 使用 session 和 cookie 来存储用户的身份信息；Provider 则定义了如何从持久化存储中查询用户。这些配置都可以在 `config/auth.php` 中进行配置。

接下来的例子中将会实现基于 JWT 的身份认证。

### 定义用户表

默认情况下，Laravel 会初始化一个 users 表，同时也会创建一个 User Model，如果希望自定义表结构，可以重新编写 migration。

User Model 需要继承 `Illuminate\Foundation\Auth\User` 类，这个父类又继承了 Eloquent Model。

### 配置 JWT

这里使用 [jwt-auth](https://github.com/tymondesigns/jwt-auth) 包来实现。

安装依赖：

```shell
composer require tymon/jwt-auth
```

然后暴露 JWT 的配置文件：

```shell
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
```

修改 .env 文件，添加 `JWT_SECRET`，或者直接使用命令生成：

```shell
php artisan jwt:secret
```

### 配置 User Model

修改 User Model，实现 `Tymon\JWTAuth\Contracts\JWTSubject` 接口：

```php
class User extends Authenticatable implements JWTSubject
{
    use RFC3339Formatter;
    use SoftDeletes;

    protected $table = 'user';

    protected $visible = [
        'id',
        'name',
        'email',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
        ];
    }
}
```

### 配置 JWT Guard

修改 `config/auth.php` 文件，配置 JWT Guard：

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users'
    ]
],
```

然后修改 .env，设置 Guard：

```dotenv
AUTH_GUARD=api
```

这里新增了一个 api Guard，其中的 driver 设置表示使用 jwt 认证，provider 设置表示使用 users Provider，可选的 Provider 在当前配置文件的 `providers` 属性中定义。

这个 driver 的可选值取决于当前注册的 Guard，使用 Auth Facades 可以注册一个 Guard，例如：

```php
Auth::extend('jwt', function (Application $app, string $name, array $config) {
    // Return an instance of Illuminate\Contracts\Auth\Guard...
    return new JwtGuard(Auth::createUserProvider($config['provider']));
});
```

### 配置中间件

在完成配置后，需要配置中间件：

```php
use Illuminate\Auth\Middleware\Authenticate;
->withMiddleware(function (Middleware $middleware) {
    $middleware->api()->group('api', [
        RequestId::class,
        SnakeToCamel::class,
        AccessCheck::class,
        Authenticate::class,
    ]);
})
```

### 登录、登出

接下来创建一个 UserController 并配置路由：

::: code-tabs#controller

@tab UserController.php

```php
class UserController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);
        $params = $this->getParams($request);
        $token = Auth::attempt($params);
        if (!$token) {
            throw new InvalidParamException('email or password is wrong');
        }
        return response()->json([
            'token' => $token,
        ])->withCookie(ContextKey::ACCESS_TOKEN->value, $token, intval(config('jwt.ttl')), '/', null, false, true);
    }

    public function logout()
    {
        Auth::logout();
    }

    public function me()
    {
        return Auth::getUser();
    }
}
```

@tab api.php

```php
Route::controller(UserController::class)->prefix('users')->group(function () {
    Route::post('/login', 'login')->withoutMiddleware(Authenticate::class);
    Route::post('/logout', 'logout');
    Route::get('/me', 'me');
});
```

:::

使用 `Auth` Facades 的 attempt 方法并传入一个键值对数组，这个数组将被用来在数据库中查询用户，如果查询到用户且密码匹配，此方法将返回 token 字符串，否则返回 false。

::: tip

使用不同 Guard 的情况下，此方法的返回值类型会有所不同。

传入密码时，不需要手动将密码进行哈希处理，框架会自动处理

:::

### 请求中附加 token

默认情况下，Cookie 或者请求头或 query 里的 token 字段会被读取并判断是否有效，如果希望自定义 token 键名，可以在 Service Provider `boot` 方法中配置 Parser：

```php
public function boot(): void
{
    $this->app['tymon.jwt.parser']->setChain([
        (new AuthHeaders)->setHeaderName(ContextKey::ACCESS_TOKEN->value),
        (new Cookies(config('jwt.decrypt_cookies')))->setKey(ContextKey::ACCESS_TOKEN->value),
    ]);
}
```

上面的配置将只会从请求头和 Cookie 中的指定字段读取 token。

### token 有效期设置

token 有效期可以通过 `jwt.php` 配置文件中的 ttl 设置，单位是分钟，默认 60 分钟：

```php
'ttl' => intval(env('JWT_TTL', 60)),
```

同样可以通过 `JWT_TTL` 环境变量来覆盖这个值。
