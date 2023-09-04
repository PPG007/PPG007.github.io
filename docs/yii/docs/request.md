# 请求处理

## 运行概述

处理 HTTP 请求的流程：

- 用户提交指向入口脚本的请求。
- 入口脚本加载配置数组并创建一个应用实例用于处理请求。
- 应用会通过 request 应用组件解析被请求的路由。
- 应用会创建一个 controller 示例具体处理请求。
- 控制器会创建一个 action 实例并为该动作执行关联的过滤器。
- 如果任何一个过滤器返回 false，动作会被取消。
- 如果全部的过滤器都通过，那么该动作会被执行。
- 动作处理。
- 返回结果给 response 组件。

## 引导

启动引导在应用开始解析并处理请求之前，一个预先准备环境的过程，引导会在两个地方进行：入口脚本和应用主体。

在入口脚本里，需要注册各个类库的类文件自动加载器，然后入口脚本会加在对应的配置然后创建一个应用主体。

在应用主体的构造函数中执行以下引导工作：

- 调用 preInit 方法，配置高优先级的属性，例如 basePath。
- 注册错误处理器。
- 通过给定的应用配置初始化应用的各个属性。
- 调用 init 方法，依次调用 bootstrap 从而运行引导组件。
    - 加载扩展清单文件 `vendor/yiisoft/extensions.php`。
    - 创建并运行每个扩展声明的引导组件。
    - 创建并运行各个应用组件以及在应用的 bootstrap 属性中生命的组件。

因为每次请求都会执行上面的引导过程，所以引导过程应该尽可能轻量化。

## 路由引导与创建 URL

当入口脚本调用 run 方法时，进行的第一个操作就是解析输入的请求，然后实例化对应的控制器动作处理这个请求，这就是引导路由的过程。

负责路由解析和创建 URL 的组件是 URL 管理器，可以在应用组件中注册并配置。

### URL 格式化

URL 管理器提供两种 URL 格式：

- 默认 URL 格式。
- 美化 URL 格式。

默认 URL 格式使用一个 query 参数 r 表示路由，默认 URL 格式不需要做任何配置并且在任意 Web 服务器中都可以正常使用。

美化 URL 是在脚本名称后面使用更多的路径信息表示路由和参数的信息，可以通过下面的设置开启：

```php
'components' => [
    'urlManager' => [
        'enablePrettyUrl' => true,
    ],
],
```

然后就可以使用 `http://localhost:8888/management/sub/sub/get` 格式进行访问了。

### 路由

路由处理包含两个步骤：

- 请求被解析成一个路由和关联的参数。
- 路由相关的一个控制器动作被创建出来处理这个请求。

如果使用默认 URL 格式，那么解析请求到路由只需要解析 query 参数 r，当使用美化 URL 格式时，URL 管理器将会检查注册的规则（urlManager 组件设置 rules 属性自定义规则）找到一条可以匹配的规则，如果找不到任何匹配的规则就会 404.

一旦请求解析成路由，系统将根据路由信息创建一个控制器动作：

1. 设置应用系统作为当前的模块。
2. 检查当前模块中控制器设置中是否存在路由对应的控制器 id，如果存在则根据这个关系创建一个控制器实例，跳转到第 5 步。
3. 检查 id 是否为当前模块下 modules 定义的子模块，如果是，创建子模块并跳转到步骤 2。
4. 将 id 作为一个控制器 id 并创建一个控制器实例。
5. 控制器在自己的 actions 方法中查找 id，如果找到就创建一个对应动作，如果没找到就尝试寻找内联动作。

以上任意步骤出现问题都将抛出 404。

缺省路由：通过 defaultRoute 属性进行配置。

catchAll 路由：设置 catchAll 属性，将所有的请求转给同一个路由：

```php
'catchAll' => [
    'site/get-token'
]
```

::: tip

catchAll 属性是一个数组，第一个元素是路由，剩下的元素为键值对格式的动作参数。

:::

### 使用美化的 URL

使用下面的配置开启美化 URL：

```php
'components' => [
    'urlManager' => [
        'enablePrettyUrl' => true,
        'showScriptName' => false,
        'enableStrictParsing' => false,
        'suffix' => '.html',
        'rules' => [
            // ...
        ],
    ],
],
```

- showScriptName：是否显示脚本名称，例如默认的 /index.php/post 可以使用 /post 进行访问。
- enableStrictParsing：开启严格匹配，请求的 URL 必须至少匹配规则中设定的一条规则才能被正常解析，否则 404。
- suffix：URL 后缀，可以在 URL 后面添加 .html 等后缀（注意如果使用文件类型做后缀可能会被作为文件解析导致 404）。

URL 规则是 `yii\web\UrlRule` 或其子类的一个实例，URL manager 按照规则中定义的顺序依次检测，找到第一条匹配的规则时停止。

可以通过以下方式定义：

```php
'rules' => [
    'GET api/<controller:[\w-]+>/<id:\d+>' => '<controller>/view'
]
```

这个规则会匹配类似于 `/api/site/123` 的 URL，并将其匹配到对应控制器的 actionView 方法。

还可以进行复杂配置：

```php
'rules' => [
    [
        'pattern' => 'api/<controller:[\w-]+>/<id:\d+>',
        'route' => '<controller>/view',
        'verb' => 'GET',
        'defaults' => [
            'controller' => 'site',
            'id' => 1234,
        ]
    ]
]
```

这样，`http://localhost:8888/api` 将会匹配到 SiteController 的 actionView 方法，且 id 为 1234。

动态添加规则：

```php
public function bootstrap($app)
{
    $app->getUrlManager()->addRules([]);
}
```

### 性能考虑

- 使用参数化路由减少 URL 规则的数量。
- 调整 URL 规则的顺序，将较常用的规则放到前面。

## 请求

### 请求参数

获取 query 参数和 form 参数：

```php
public function actionView()
{
    $req = Yii::$app->request;
    Yii::warning([
        'id' => $req->get('id'),
        'name' => $req->post('name'),
    ]);
    return 'ok';
}
```

对于 restful api，通过 getBodyParam 方法获取参数：

```php
public function actionView()
{
    $req = Yii::$app->request;
    Yii::warning([
        'id' => $req->get('id'),
        'name' => $req->getBodyParam('name'),
    ]);
    return 'ok';
}
```

通过设置 request 组件解析 JSON：

```php
'request' => [
    'parsers' => [
        'application/json' => 'yii\web\JsonParser',
    ]
],
```

### 请求方法

获取请求方法：

```php
$req = Yii::$app->request;
Yii::warning([
    'isAjax' => $req->isAjax,
    'get' => $req->isGet,
    'post' => $req->isPost,
    'delete' => $req->isDelete,
    'put' => $req->isPut,
]);
```

### 请求 URLs

[doc](https://www.yiiframework.com/doc/guide/2.0/zh-cn/runtime-requests#request-urls)

### HTTP 头

```php
$req = Yii::$app->request;
Yii::warning([
    'accountId' => $req->headers->get('x-account-id'),
    'hasToken' => $req->headers->has('x-access-token')
]);
```

### 客户端信息

```php
$req = Yii::$app->request;
Yii::warning([
    'host' => $req->userHost,
    'ip' => $req->userIP,
    'agent' => $req->userAgent,
]);
```

## 响应

### 状态码

设置状态码：

```php
Yii::$app->response->statusCode = HttpCode::ACCEPTED;
```

大多数情况下不需要手动设置状态码，可以通过抛出异常完成，每个异常对应一个状态码，例如：

```php
throw new BadRequestHttpException();
```

如果状态码没有对应的异常，可以通过 HTTPException 实现：

```php
throw new HttpException(202);
```

### 响应头

```php
$headers = Yii::$app->response->headers;

// 增加一个 Pragma 头，已存在的Pragma 头不会被覆盖。
$headers->add('Pragma', 'no-cache');

// 设置一个Pragma 头. 任何已存在的Pragma 头都会被丢弃
$headers->set('Pragma', 'no-cache');

// 删除Pragma 头并返回删除的Pragma 头的值到数组
$values = $headers->remove('Pragma');
```

### 响应体

通过设置响应格式实现 format：

```php
$resp = Yii::$app->response;
$resp->format = Response::FORMAT_JSON;
$resp->data = [
    'message' => 'ok',
];
```

format 的支持情况：

- HTML：通过 `yii\web\HtmlResponseFormatter` 来实现。
- XML：通过 `yii\web\XmlResponseFormatter` 来实现。
- JSON：通过 `yii\web\JsonResponseFormatter` 来实现。
- JSONP：通过 `yii\web\JsonResponseFormatter` 来实现。
- RAW：如果要直接发送响应而不应用任何格式，请使用此格式。

### 发送响应

在 `yii\web\Response::send()` 方法调用前响应中的内容不会发送给用户， 该方法默认在 `yii\base\Application::run()` 结尾自动调用，尽管如此，可以明确调用该方法强制立即发送响应。

`yii\web\Response::send()` 方法使用以下步骤来发送响应：

- 触发 `yii\web\Response::EVENT_BEFORE_SEND` 事件。
- 调用 `yii\web\Response::prepare()` 来格式化 response data 为 response content。
- 触发 `yii\web\Response::EVENT_AFTER_PREPARE` 事件。
- 调用 `yii\web\Response::sendHeaders()` 来发送注册的 HTTP 头
- 调用 `yii\web\Response::sendContent()` 来发送响应主体内容
- 触发 `yii\web\Response::EVENT_AFTER_SEND` 事件。

一旦 `yii\web\Response::send()` 方法被执行后，其他地方调用该方法会被忽略， 这意味着一旦响应发出后，就不能再追加其他内容。

## Sessions

### 开启和关闭

```php
$session = Yii::$app->session;

// 检查session是否开启
if ($session->isActive) ...

// 开启session
$session->open();

// 关闭session
$session->close();

// 销毁session中所有已注册的数据
$session->destroy();
```

### 访问数据

```php
$session = Yii::$app->session;

// 获取session中的变量值，以下用法是相同的：
$language = $session->get('language');
$language = $session['language'];
$language = isset($_SESSION['language']) ? $_SESSION['language'] : null;

// 设置一个session变量，以下用法是相同的：
$session->set('language', 'en-US');
$session['language'] = 'en-US';
$_SESSION['language'] = 'en-US';

// 删除一个session变量，以下用法是相同的：
$session->remove('language');
unset($session['language']);
unset($_SESSION['language']);

// 检查session变量是否已存在，以下用法是相同的：
if ($session->has('language')) ...
if (isset($session['language'])) ...
if (isset($_SESSION['language'])) ...

// 遍历所有session变量，以下用法是相同的：
foreach ($session as $name => $value) ...
foreach ($_SESSION as $name => $value) ...
```

::: tip

当 session 数据为数组时，session 组件会限制你直接修改数据中的单元项，例如：

```php
// 如下代码不会生效
$session['captcha']['number'] = 5;
$session['captcha']['lifetime'] = 3600;
```

:::

### 自定义 Session 存储

默认情况下，session 数据被存储为文件，可以通过配置使用不同的 session 存储方式：

- `yii\web\DbSession`：存储在数据表中，例如 MySQL、PostgreSQL。
- `yii\web\CacheSession`：存储在缓存中。
- `yii\redis\Session`：存储在 Redis 中。
- `yii\mongodb\Session`：存储在 MongoDB 中。

```php
'components' => [
    'session' => [
        'class' => 'yii\web\DbSession',
        // 'db' => 'mydb',  // 数据库连接的应用组件ID，默认为'db'.
        // 'sessionTable' => 'my_session', // session 数据表名，默认为'session'.
    ],
],
```

### Flash 数据

Flash 数据是一种特别的 session 数据，它一旦在某个请求中设置后， 只会在下次请求中有效，然后该数据就会自动被删除。 常用于实现只需显示给终端用户一次的信息， 如用户提交一个表单后显示确认信息。

```php
$session = Yii::$app->session;

// 请求 #1
// 设置一个名为"postDeleted" flash 信息
$session->setFlash('postDeleted', 'You have successfully deleted your post.');

// 请求 #2
// 显示名为"postDeleted" flash 信息
echo $session->getFlash('postDeleted');

// 请求 #3
// $result 为 false，因为flash信息已被自动删除
$result = $session->hasFlash('postDeleted');
```

set 会覆盖，add 不会覆盖：

```php
// 请求 #1
// 在名称为"alerts"的flash信息增加数据
$session->addFlash('alerts', 'You have successfully deleted your post.');
$session->addFlash('alerts', 'You have successfully added a new friend.');
$session->addFlash('alerts', 'You are promoted.');

// 请求 #2
// $alerts 为名为'alerts'的flash信息，为数组格式
$alerts = $session->getFlash('alerts');
```

## Cookies

### 读取

```php
// 从 "request" 组件中获取 cookie 集合(yii\web\CookieCollection)
$cookies = Yii::$app->request->cookies;

// 获取名为 "language" cookie 的值，如果不存在，返回默认值 "en"
$language = $cookies->getValue('language', 'en');

// 另一种方式获取名为 "language" cookie 的值
if (($cookie = $cookies->get('language')) !== null) {
    $language = $cookie->value;
}

// 可将 $cookies 当作数组使用
if (isset($cookies['language'])) {
    $language = $cookies['language']->value;
}

// 判断是否存在名为 "language" 的 cookie
if ($cookies->has('language')) ...
if (isset($cookies['language'])) ...
```

### 发送

```php
// 从 "response" 组件中获取 cookie 集合(yii\web\CookieCollection)
$cookies = Yii::$app->response->cookies;

// 在要发送的响应中添加一个新的 cookie
$cookies->add(new \yii\web\Cookie([
    'name' => 'language',
    'value' => 'zh-CN',
]));

// 删除一个 cookie
$cookies->remove('language');
// 等同于以下删除代码
unset($cookies['language']);
```

### 验证

当通过 request 和 response 组件读取和发送 cookie 时， 扩展的 cookie 验证的保障安全功能使 cookie 不被客户端修改。该功能通过给每个 cookie 签发一个哈希字符串来告知服务端 cookie 是否在客户端被修改， 如果被修改，通过 request 组件的 cookie collection cookie 集合访问不到该 cookie。

Cookie 验证默认启用，可以设置 yii\web\Request::$enableCookieValidation 属性为 false 来禁用它。

当使用 cookie 验证时，必须指定 yii\web\Request::$cookieValidationKey，它是用来生成上述的哈希值， 可通过在应用配置中配置 request 组件。

```php
return [
    'components' => [
        'request' => [
            'cookieValidationKey' => 'fill in a secret key here',
        ],
    ],
];
```

## 错误处理

Yii 内置了一个 error handler 错误处理器，它使错误处理更方便， Yii 错误处理器做以下工作来提升错误处理效果：

- 所有非致命 PHP 错误（如，警告，提示）会转换成可获取异常。
- 异常和致命的PHP错误会被显示， 在调试模式会显示详细的函数调用栈和源代码行数。
- 支持使用专用的 控制器操作 来显示错误。
- 支持不同的错误响应格式。

error handler 错误处理器默认启用， 可通过在应用的入口脚本中定义常量 YII_ENABLE_ERROR_HANDLER 来禁用。

### 自定义错误显示

error handler 错误处理器根据常量 YII_DEBUG 的值调整错误显示，当 YII_DEBUG 为 true (表示在调试模式)， 错误处理器会显示异常以及详细的函数调用栈和源代码行数来帮助调试， 当YII_DEBUG 为 false，只有错误信息会被显示以防止应用的敏感信息泄漏。

使用 errorAction：

```php
return [
    'components' => [
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
    ]
];
// controller
class SiteController extends Controller
{
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }
}
```

action 也可以使用下面的方式：

```php
public function actionHandleError()
{
    $exception = Yii::$app->errorHandler->exception;
    if ($exception !== null) {
        Yii::error($exception->getMessage());
        throw $exception;
    }
    return 'ok';
}
```

也可以自定义错误处理类：

```php
// 自定义异常
class BaseException extends HttpException
{

    public function convertToArray()
    {
        return [
            'message' => $this->getMessage(),
            'status' => $this->statusCode,
            'code' => $this->getCode(),
        ];
    }
}
// 自定义错误处理类
class ErrorHandler extends \yii\web\ErrorHandler
{
    protected function convertExceptionToArray($exception)
    {
        if ($exception instanceof BaseException) {
            return $exception->convertToArray();
        }
        return parent::convertExceptionToArray($exception); // TODO: Change the autogenerated stub
    }

}
// 配置文件
'errorHandler' => [
    'class' => 'app\component\ErrorHandler',
],
```

## 日志

使用 Yii 日志框架涉及下面的几个步骤：

- 在你代码里的各个地方记录 log messages。
- 在应用配置里通过配置 log targets 来过滤和导出日志消息。
- 检查由不同的目标导出的已过滤的日志消息（例如：Yii debugger）。

### 日志消息

- `Yii::trace()`：记录一条消息去跟踪一段代码是怎样运行的。这主要在开发的时候使用。
- `Yii::info()`：记录一条消息来传达一些有用的信息。
- `Yii::warning()`：记录一个警告消息用来指示一些已经发生的意外。
- `Yii::error()`：记录一个致命的错误，这个错误应该尽快被检查。

这些日志记录方法针对 严重程度 和 类别 来记录日志消息。它们共享相同的函数签名 `function ($message, $category = 'application')`，$message 代表要被 记录的日志消息，而 $category 是日志消息的类别。

### 日志目标

一个日志目标是一个 `yii\log\Target` 类或者它的子类的实例。 它将通过他们的严重层级和类别来过滤日志消息，然后将它们导出到一些媒介中。 例如，一个 database target 目标导出已经过滤的日志消息到一个数据的表里面， 而一个 email target 目标将日志消息导出到指定的邮箱地址里。

在一个应用里，通过配置在应用配置里的 log application component，可以注册多个日志目标。

```php
// 自定义日志目标
class StdoutLogTarget extends Target
{

    /**
     * @inheritDoc
     */
    public function export()
    {
        foreach ($this->messages as $message) {
            list($text, $level, $category, $time) = $message;
            $obj = [
                'message' => $text,
                'level' => $level,
                'category' => $category,
                'time' => $time,
            ];
            $str = json_encode($obj);
            if (PHP_SAPI === 'cli') {
                echo $str . '\n';
            } else {
                file_put_contents('php://stdout', $str);
            }
        }
    }
}
// 配置文件
'log' => [
    'targets' => [
        [
            'class' => 'app\component\StdoutLogTarget',
            'levels' => ['info']
        ],
    ],
],
```

### 消息过滤

对于每一个日志目标，你可以配置它的 levels 和 categories 属性来指定哪个消息的严重程度和分类目标应该处理。

levels 属性是由一个或者若干个以下值组成的数组：

- error：相应的消息通过 Yii::error() 被记录。
- warning：相应的消息通过 Yii::warning() 被记录。
- info：相应的消息通过 Yii::info() 被记录。
- trace：相应的消息通过 Yii::trace() 被记录。
- profile：相应的消息通过 Yii::beginProfile() 和 Yii::endProfile() 被记录。更多细节将在 Profiling 分段解释。

::: tip

如果没有指定 levels 的属性， 那就意味着目标将处理*任何*严重程度的消息。

:::

categories 属性是一个包含消息分类名称或者模式的数组。 一个目标将只处理那些在这个数组中能够找到对应的分类或者其中一个相匹配的模式的消息。 一个分类模式是一个以星号 * 结尾的分类名前缀。假如一个分类名与分类模式具有相同的前缀， 那么该分类名将和分类模式相匹配。

```php
// 配置文件
'log' => [
    'traceLevel' => YII_DEBUG ? 3 : 0,
    'targets' => [
        [
            'class' => 'yii\log\FileTarget',
            'levels' => ['error', 'warning'],
        ],
        [
            'class' => 'app\component\StdoutLogTarget',
            'levels' => ['warning'],
            'categories' => ['app\controllers\*'],
        ],
    ],
],
// 调用
Yii::warning('hahaha', __METHOD__);
```

::: tip

假如没有指定 categories 属性， 这意味着目标将会处理*任何*分类的消息。

:::

除了通过 categories 属性设置白名单分类，也可以通过 except 属性来设置某些分类作为黑名单。假如一条消息的分类在这个属性中被发现或者是匹配其中一个， 那么它将不会在目标中被处理。
