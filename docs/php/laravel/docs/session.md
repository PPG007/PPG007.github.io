# Session

## 配置

Session 的相关配置都保存在 `config/session.php` 文件中，默认情况下，Laravel 使用 database 来保存 Session，此外还有多个 Session Driver 可供选择：

- `file`：将 Session 保存到 `storage/framework/sessions` 目录下。
- `cookie`：将 Session 保存到加密的 Cookie 中。
- `database`：将 Session 保存到数据库中。
- `memcached`/`redis`：将 Session 保存到 Memcached 或 Redis 中。
- `array`：将 Session 保存到内存中，不会持久化。

使用 database 存储 Session 时，需要创建一个 Session 表，一般来说默认的 `0001_01_01_000000_create_users_table.php` 会创建这个表，如果没有，可以使用命令初始化这个表：

```shell
php artisan make:session-table
php artisan migrate
```

::: tip

在 API 路由组中使用 Session 时，由于默认情况下 api 中间件组不包含 Session 中间件，所以需要先启用 Session 中间件：

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->prependToGroup('api', [
        StartSession::class,
    ]);
})
```

:::

## 操作 Session

### 存储

使用 Request 上的 `session()->put()` 方法或者全局 `session` 方法可以在 Session 中存储数据：

```php
public function getMember(Request $request, string $id = '')
{
    $request->session()->put('memberId', $id);
    session(['tags' => ['A']]);
    return '';
}
```

`push` 方法可以将新值添加到数组的参数上：

```php
public function getMember(Request $request, string $id = '')
{
    $request->session()->push('tags', 'B');
    return '';
}
```

`pull` 方法从 session 中查找并删除一个值：

```php
public function getMember(Request $request, string $id = '')
{
    $request->session()->pull('memberId');
    $deleted = $request->session()->pull('tags');
    return '';
}
```

如果一个参数是整数，那么可以使用 `increment` 和 `decrement` 方法对 session 的值进行递增或递减：

```php
$request->session()->increment('count');
$request->session()->increment('count', $incrementBy = 2);
$request->session()->decrement('count');
$request->session()->decrement('count', $decrementBy = 2);
```

### 读取

```php
public function index(Request $request)
{
    Log::info('index', [
        'memberId' => $request->session()->get('memberId'),
        'tags' => session('tags'),
        'notExists' => session('notExists', 'default'),
        'all' => $request->session()->all(),
    ]);
    return '';
}
```

`only` 和 `except` 可以读取 session 的子集：

```php
public function index(Request $request)
{
    Log::info('index', [
        'only' => $request->session()->only(['tags']),
        'except' => $request->session()->except(['tags']),
    ]);
    return '';
}
```

使用 `has`、`exists`、`missing` 方法可以检查 session 中是否存在指定参数，如果参数存在且不为 null，`has` 返回 true，如果参数存在即使为 null，`exists` 返回 true，如果指定参数不存在，`missing` 返回 true：

```php
public function index(Request $request)
{
    Log::info('index', [
        'has' => $request->session()->has('null'),
        'exists' => $request->session()->exists('null'),
        'missing' => $request->session()->missing('null'),
    ]);
    return '';
}
```

### 删除

`forget` 方法将从 session 中删除一些数据，如果想删除所有的 session 数据，请使用 `flush` 方法：

```php
public function getMember(Request $request, string $id = '')
{
    $request->session()->forget(['tags', 'memberId']);
    $request->session()->flush();
    return '';
}
```

### Session 失效

使用 `regenerate` 方法可以刷新 session id：

```php
$request->session()->regenerate();
```

如果要重新生成 session id 并且删除所有数据可以使用 `invalidate` 方法：

```php
$request->session()->invalidate();
```

## 自定义 Session Driver

实现 `SessionHandlerInterface` 接口的类可以作为 Session Driver，然后在 Service Provider 中注册：

```php
public function boot(): void
{
    Session::extend('mongo', function (Application $app) {
        // Return an implementation of SessionHandlerInterface...
        return new MongoSessionHandler;
    });
}
```

然后修改 `config/session.php` 中的 `driver` 选项为 `mongo` 即可。

### etcd Session Driver

TODO:
