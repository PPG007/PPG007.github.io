# 起步

## 创建项目

首先安装 Laravel CLI 工具：

```bash
composer global require laravel/installer
```

创建名为 scrm 的项目：

```bash
laravel new scrm
```

启动项目：

```bash
cd scrm
npm install && npm run build
composer run dev
```

## 配置

Laravel 的所有配置文件都保存在 config 目录下。

使用 artisan 查看配置文件：

```bash
php artisan about
```

输出的配置分为若干部分，如果只想查看某个部分，例如 Storage，可以使用 `--only` 参数：

```bash
php artisan about --only=storage
```

如果要特别详细地查看特定配置，使用 `config:show`：

```bash
php artisan config:show storage
```

### 环境变量配置

Laravel 中的环境变量配置在 `.env` 文件中，项目创建时会生成一个 `.env.example` 文件，在 Laravel 安装过程中，此文件会被复制为 `.env` 文件。

::: tip

`.env` 文件中的任何变量都能被外部变量覆盖。

:::

在加载环境变量之前，Laravel 会判断是否已从外部设置了 `APP_ENV` 变量，或者是否指定了 `--env` 选项，如果设置了，`.env.[变量值]` 的文件将被加载（如果此文件存在，否则加载 `.env` 文件）。

例如，现在来创建一个 staging 测试环境的配置文件 `.env.staging`，将 `APP_NAME` 设置为 `Staging`，并且关闭 debug，然后使用以下命令启动：

```bash
APP_ENV=staging composer run dev
#  or
php artisan serve --env=staging
```

在代码中使用 `env()` 函数读取环境变量时，根据 `.env` 文件中定义的环境变量，可以读取到不同的值。如果配置的值为 true 或者 false，那么此函数返回一个布尔类型的变量；如果是保持为空，那么此函数返回一个空字符串；如果配置为 null，那么此函数返回 null，考虑如下的配置：

```dotenv
BOOL_TEST1=true
BOOL_TEST2=false
BOOL_TEST3=(true)
BOOL_TEST4=(false)
STRING_TEST1="test"
STRING_TEST2=null
STRING_TEST3=
STRING_TEST4
```

接着在代码中获取：

```php
Illuminate\Log\log('info', [
    'BOOL_TEST1' => env('BOOL_TEST1'),
    'BOOL_TEST2' => env('BOOL_TEST2'),
    'BOOL_TEST3' => env('BOOL_TEST3'),
    'BOOL_TEST4' => env('BOOL_TEST4'),
    'STRING_TEST1' => env('STRING_TEST1'),
    'STRING_TEST2' => env('STRING_TEST2'),
    'STRING_TEST3' => env('STRING_TEST3'),
    'STRING_TEST4' => env('STRING_TEST4'),
    'STRING_TEST5' => env('STRING_TEST5'),
]);
```

根据输出日志可以看到，四个布尔值都能被获取到并解析为布尔类型，STRING_TEST2 和不存在的 STRING_TEST5 被解析为 null，STRING_TEST3 倍解析为空字符串，而 STRING_TEST4 由于没有 `=` 符号被解析为 null。

如果要判断当前的环境，除了用 `env()` 方法读取 APP_ENV 的值，还可以使用 App 类的静态 `environment()` 方法：

```php
use Illuminate\Support\Facades\App;
$environment = App::environment();
```

这个方法还可以传入参数，用来判断当前环境是否匹配：

```php
$isDev = App::environment(['local', 'staging']);
$isProduction = App::environment('production');
```

为了防止环境变量文件被提交到 git 等版本控制工具导致泄露，环境变量配置文件支持加密，具体见[这里](https://laravel.com/docs/12.x/configuration#encrypting-environment-files)。但是我个人认为这个功能没什么卵用，一是敏感的环境变量本身就不应该对开发可见，本地测试用的环境变量如 AK、SK 等应该使用专用的、有额外限制的；二是现在基本上都会使用容器化部署，这些敏感的环境变量应该保存在容器配置文件的仓库内，例如直接通过管理 docker 配置文件或者 k8s 的配置文件来实现对敏感环境变量的控制，代码里的 `.env` 文件仅做占位即可。如果不使用容器化部署那么这个功能可能还有点用，不过不使用容器化的公司通常规模较小，我比较怀疑是否具有这个安全意识（笑）。

### 读取、配置非环境变量的配置

使用 `Config` 类的静态方法或者全局 `config()` 方法来获取配置：

```php
use Illuminate\Support\Facades\Config;
Illuminate\Log\log('info', [
    'name1' => Config::get('app.name'),
    'name2' => \config('app.name'),
    'notExists' => \config('app.notExists', 'default value')
]);
```

配置的 key 格式为 `${configFileName}.${key}...`，如果配置文件中要取的 key 是个数组，那么还能继续嵌套向内访问，例如：`app.maintenance.driver`。

也可以在运行时设置某个配置：

```php
Config::set('app.notExists', 'test');
\config(['app.notExists2' => 666]);
Illuminate\Log\log('info', [
    'notExists1' => \config('app.notExists', 'default value'),
    'notExists2' => \config('app.notExists2', 'default value'),
]);
```

`Config` 类还有直接返回具体类型值的方法：

```php
Config::string('config-key');
Config::integer('config-key');
Config::float('config-key');
Config::boolean('config-key');
Config::array('config-key');
```

### 缓存配置文件

为了提升程序的速度，可以将 config 目录下的所有配置文件合成为一个文件，使用 `php artisan config:cache` 命令可以缓存配置文件，这里可以通过 `--env` 参数来指定要生成哪个环境的配置缓存，通过 `php artisan config:clear` 来清除缓存。

::: tip

配置被缓存后，.env 文件将不会被加载，`env()` 函数也将只返回外部注入的环境变量。

:::

### 发布配置文件

默认情况下一些内置的配置文件不会生成到 config 目录中，也就不能被修改，可以通过 `config:publish` 命令将指定的配置文件生成到 config 目录内，然后可以修改他们：

```bash
php artisan config:publish

php artisan config:publish --all
```

### 调试模式与维护模式

通过将配置中的 `app.debug` 设置为 true 可以开启调试模式，默认情况下这个配置收到 APP_DEBUG 变量的影响。

通过 `php artisan down` 命令可以开启维护模式，在维护模式中，所有请求将返回 503 错误，并且会显示一个简单的页面，这个页面可以自定义。

使用 `php artisan up` 命令可以关闭维护模式。

维护模式下可以通过设置密钥来允许绕过维护模式，例如：

```bash
# 生成密钥并进入维护模式
php artisan down --with-secret
# 手动指定密钥
php artisan down --secret="1630542a-246b-4b66-afa1-dd72a4c43515"
```

设置密钥并启动服务后，可以通过放完当前应用的 /{secret} 路径绕过维护模式，例如：`http://127.0.0.1:8000/CmR4jXnQr39RKRrU`

在集群部署的情况下，如果要将所有的应用都开启维护模式，那么需要在每个实例内都执行上面的命令，或者修改 .env 文件，选择将维护模式的状态保存到所有实例都能访问的地方：

```dotenv
APP_MAINTENANCE_DRIVER=cache
APP_MAINTENANCE_STORE=database
```

如果希望维护模式下将请求重定向到其他页面，可以通过 `--redirect` 参数设置：

```bash
php artisan down --redirect=https://baidu.com
```

::: tip

可以通过自定义 `resources/views/errors/503.blade.php` 来自定义维护页面。

:::

## 项目结构

### 根目录

- app：程序核心代码，绝大多数类都将位于此目录。
- bootstrap：包含引导框架的 `app.php`，还包含一个 cache 目录，存放为性能优化生成的文件。
- config：包含所有的配置文件。
- database：数据库相关。
- public：包含 `index.php`，这是程序的入口。此外还包含一些静态文件。
- resources：包含视图和原始资源文件。
- routes：包含路由定义。

    默认只包含 `web.php` 和 `console.php`，前者会被放在 web 中间件组中，后者可以用于命令行任务。
    使用 `install:api` 和 `install:broadcasting` 可以创建 `api.php` 和 `channels.php`，前者用于无状态路由，通过 token 验证身份，后者用于注册事件广播。

- storage：包含编译后的 Blade 视图、应用程序生成的文件、以及文件日志和文件缓存，打印的日志可以在 logs 目录中找到。
- tests：包含单元测试。
- vendor：Composer 依赖。

### App 目录

默认情况下，app 目录包含 Http、Models、Providers 三个子目录，分别用于存放 HTTP 相关的类、模型和自定义服务提供者。其他目录都可以通过 artisan 生成，执行 `php artisan list make` 命令可以查看所有可用的生成命令。

- Broadcasting：包含应用程序的所有广播频道类，使用 `make:channel` 命令生成。
- Console：包含自定义 Artisan 命令，使用 `make:command` 生成。
- Events：包含事件类，使用 `event:generate` 或 `make:event` 生成。
- Exceptions：包含自定义异常，使用 `make:exception` 生成。
- Http：包含 controller、middleware等。
- Jobs：包含队列任务，使用 `make:job` 生成。
- Listeners：包含事件监听器，使用 `event:generate` 或 `make:listener` 生成。
- Mail：包含发送邮件类，使用 `make:mail` 生成。
- Models：包含模型类。
- Notifications：包含通知，使用 `make:notification` 生成。
- Rules：包含自定义验证规则，使用 `make:rule` 生成。
- Policies：包含授权策略，使用 `make:policy` 生成。
- Providers：包含服务提供者。
