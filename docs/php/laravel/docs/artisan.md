# Artisan Console

Artisan 是 Laravel 提供的命令行工具，提供了许多的内置命令，使用 `list` 可以查看可用的命令：

```shell
php artisan list
```

## 编写自定义命令

### 单独类命令

命令通常保存在 `app/Console/Commands` 目录下，不过也可以在 `bootstrap/app.php` 中通过 `withCommands` 方法注册命令位置。

要创建一个命令，可以使用 `make:command` 命令：

```shell
php artisan make:command ExpireScore
```

生成命令后，应该为这个类的 `signature` 和 `description` 属性定义合适的值，`handle` 方法将在命令执行时被调用：

```php
class ExpireScore extends Command
{
    protected $signature = 'member:expire-score';
    protected $description = 'expire score daily';

    public function handle(OrderService $orderService)
    {
        $this->info($orderService->genOrderNumber());
    }
}
```

`handle` 方法同样可以通过类型提示来注入依赖，接下来可以执行上面这个命令：

```shell
php artisan member:expire-score
```

`handle` 方法如果没有返回值且命令执行成功，那么此命令将以 0 作为退出状态码返回，也可以手动返回一个整数作为退出状态码。

如果想在任意地方使命令失败，可以使用 `fail` 方法：

```php
public function handle()
{
    $this->fail('123');
}
```

### 闭包命令

就像路由一样，命令也可以使用闭包来定义而不需要单独的类，闭包命令定义在 `routes/console.php` 文件中，通过 `bootstrap/app.php` 同样可以修改这个文件的位置，例如注册一个闭包命令：

```php
Artisan::command('order:generate-number', function (OrderService $orderService) {
    $this->info($orderService->genOrderNumber());
});
```

闭包方法将会绑定到基础命令的类实例上，所以闭包内可以使用 `$this` 来访问 Artisan 命令实例。

如果需要为一个闭包命令定义描述，可以使用 `purpose` 方法：

```php
Artisan::command('order:generate-number', function (OrderService $orderService) {
    $this->info($orderService->genOrderNumber());
})->purpose('Generate order number');
```

## 输入输出

### 定义输入参数

所有的参数都应该包含在花括号 `{}` 中，例如：

```php
protected $signature = 'order:generate-number {count}';
```

上面的参数是必填的，也可以定义为可选参数或者定义默认值，例如：

```php
protected $signature = 'order:generate-number {count?}';
protected $signature = 'order:generate-number {count=1}';
```

如果要定义选项，可以使用 `--` 前缀，例如：

```php
protected $signature = 'order:generate-number {count?} {--queue}';
```

选项将会被解析为布尔值，如果要定义选项的值，可以使用 `=`，例如：

```php
protected $signature = 'order:generate-number {count?} {--queue=}';
```

如果使用了 `=` 的选项没有在执行命令时提供值，那么这个选项将会被解析为 `null`。

选项同样也可以指定默认值，例如：

```php
protected $signature = 'order:generate-number {count?} {--queue=1}';
```

如果希望输入数组，那么可以使用 `*`，例如：

```php
protected $signature = 'member:expire-score {arr*}';
```

选项同样可以指定数组，例如：

```php
protected $signature = 'member:expire-score {--arr=*}';
```

如果一个命令包含了必填参数，那么在未提供这些参数时，Artisan 会提示错误信息，或者实现 `PromptsForMissingArguments` 接口来在不提供必填参数时提示用户输入：

```php
class ExpireScore extends Command implements PromptsForMissingInput
```

实现这个接口后，Artisan 会在不提供必填参数时提示用户输入这些参数，如果希望自定义提示信息，可以重写 `promptForMissingArgumentsUsing` 方法：

```php
protected function promptForMissingArgumentsUsing()
{
    return [
        'arg' => 'set the arg',
    ];
}
```

### 获取参数

使用 `argument`、`arguments`、`option`、`options` 方法可以获取参数：

```php
public function handle(OrderService $orderService)
{
    $this->info(json_encode([
        'args' => $this->arguments(),
        'arg' => $this->argument('arg'),
        'opts' => $this->options(),
        'opt' => $this->option('opt'),
    ]));
}
```

如果希望提示用户输入参数，可以使用 `ask` 方法或者 `secret` 方法，`secret` 方法会隐藏输入内容：

```php
public function handle(OrderService $orderService)
{
    $username = $this->ask('username');
    $password = $this->secret('password');
    $this->info(json_encode([
        'username' => $username,
        'password' => $password,
    ]));
}
```

如果希望在执行下一步前提示用户确认，可以使用 `confirm` 方法，此方法将返回一个布尔值，如果用户输入 `y` 或 `yes`，则返回 `true`，否则返回 `false`，默认返回 `false`：

```php
public function handle(OrderService $orderService)
{
    $username = $this->ask('username');
    $password = $this->secret('password');
    $ok = $this->confirm('print info?');
    if (!$ok) {
        return;
    }
    $this->info(json_encode([
        'username' => $username,
        'password' => $password,
    ]));
}
```

如果希望输入一个参数时提供自动完成功能，可以使用 `anticipate` 方法：

```php
$username = $this->anticipate('username', ['admin', 'test']);
```

::: tip

无论自动完成的结果是什么，用户仍然可以输入任意值。

:::

这个方法也可以接收一个闭包作为第二个参数，闭包会接收一个包含用户目前输入的字符串，同时返回一个选项数组：

```php
public function handle(OrderService $orderService)
{
    $name = $this->anticipate('username', function (string $input): array {
        return Member::query()
            ->whereLike('name', $input . '%')
            ->limit(3)
            ->pluck('name')
            ->all();
    });
    $this->info($name);
}
```

如果一个参数是一个选项，那么可以使用 `choice` 方法，此方法可以通过指定下标来设置默认值：

```php
$level = $this->choice('log level', ['info', 'warn', 'error'], 1);
call_user_func_array([$this, $level], [$name]);
```

### 输出

使用 `info`、`warn`、`error` 可以输出包含颜色的文本，使用 `line` 方法可以输出不包含颜色的文本，使用 `newLine` 方法可以输出空行。

## 注册命令

默认情况下，Laravel 会自动注册 `app/Console/Commands` 目录下的命令，如果希望扫描其他目录下的命令，可以通过修改 `bootstrap/app.php` 中的 `withCommands` 方法来实现：

```php
->withCommands([
    __DIR__ . '../app/Jobs',
])
```

或者直接把类名注册到这个方法中：

```php
->withCommands([
    ExpireScore::class,
])
```

## 代码中执行命令

如果希望在代码中而不是命令行来执行命令，可以使用 call 方法：

```php
public function expireScore(Request $request)
{
    $params = $this->getParams($request);
    $exitCode = Artisan::call('member:expire-score', $params);
    return $exitCode;
}
```

## 信号处理

操作系统允许将信号发送到正在运行的进程，Artisan 也提供了信号处理功能，可以使用 `trap` 方法来处理信号：

```php
public function handle(OrderService $orderService)
{
    $this->trap(SIGTERM, function () {
        $this->terminated = true;
    });
    while (true) {
        if ($this->terminated) {
            $this->warn('exit');
            break;
        }
        $this->info('running');
        sleep(1);
    }
}
```

然后使用 `kill` 命令发送信号即可实现进程的退出。
