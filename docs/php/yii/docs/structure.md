# 应用结构

## 入口脚本

入口脚本是应用启动的第一步，一个应用只有一个入口脚本。终端用户的请求通过入口脚本实例化应用并将请求转发到应用。

入口脚本的工作：

- 定义全局常量。
- 注册 Composer 自动加载器。
- 包含 Yii 类文件。
- 加载应用配置。
- 创建一个应用实例并启动。

例如：

```php
<?php

// comment out the following two lines when deployed to production
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../vendor/yiisoft/yii2/Yii.php';

$config = require __DIR__ . '/../config/web.php';

(new yii\web\Application($config))->run();
```

::: tip

常量定义应该在入口脚本的开头，这样引入其他 PHP 文件时常量能够生效。

:::

## 应用

应用主体是管理 Yii 应用系统整体结构和生命周期的对象。 每个 Yii 应用系统只能包含一个应用主体，应用主体在 入口脚本 中创建并能通过表达式 \Yii::$app 全局范围内访问。

在上面的入口脚本中， $config 包含了应用主体的配置。

在一个应用中，至少要配置两个属性：id 和 basePath，id 是用来区分其他应用的唯一表示 id，basePath 指定该应用的根目录。

### 其他属性

aliases：该属性允许用一个数组定义多个别名，数组的 key 为别名名称，值为对应路径，这可以替代 `Yii::setAlias()` 方法，例如配置文件中有如下定义：

```php
'aliases' => [
    '@baidu' => 'https://baidu.com'
]
```

然后可以在代码中获取别名的内容：`Yii::getAlias('@baidu')`。

::: warning

如果是使用 yii 入口文件启动的 http 服务，yii 将会使用 PHP 内置的 web 服务器启动一个 http 服务，这个服务的入口文件实际上是 web/index.php 所以如果在 controller 中使用 getAlias 方法，那么别名应该定义在 web/index.php 中指定的配置文件里。

:::

bootstrap：允许使用数组指定在启动阶段需要运行的组件，比如现在需要一个 JSON 字符串校验器，首先编写一个 JSON 字符串校验类，这个类需要继承 Validator 类：

```php
class JsonValidator extends Validator
{
    private function isJson($str) {
        return is_string($str) && (is_object(json_decode($str) || is_array(json_decode($str, true)) && json_last_error() == JSON_ERROR_NONE));
    }

    public function validateAttribute($model, $attribute)
    {
        if (!$this->isJson($model[$attribute])) {
            $this->addError($model, $attribute, 'invalid json str');
        }
    }
}
```

接下来需要将这个验证器加入到 Yii 自身的验证器列表里，这样调用 validate 方法就可以验证 json 字符串了，首先定义一个类实现 BootstrapInterface 接口，然后将其配置到 bootstrap 中即可：

```php
class Register implements BootstrapInterface
{
    public function bootstrap($app)
    {
        $customValidators = [
            'json' => 'app\validator\JsonValidator',
        ];
        Validator::$builtInValidators = array_merge(Validator::$builtInValidators, $customValidators);
    }

}
```

有多种方法可以将这个 Register 配置到 bootstrap 中。

第一种：应用组件 id。

```php
'bootstrap' => [
    'log',
    'validator'
],
'components' => [
    'validator' => [
        'class' => 'app\validator\Register',
    ]
]
```

第二种：类名。

```php
'bootstrap' => [
    'log',
    'app\validator\Register'
],
```

第三种：配置数组。

```php
'bootstrap' => [
    'log',
    [
        'class' => 'app\validator\Register'
    ]
]
```

第四种：匿名函数。

```php
'bootstrap' => [
    'log',
    function () {
        return new \app\validator\Register();
    }
]
```

controllerMap：允许覆盖 Yii 的默认控制器 id 规则，规则示例：控制器 ID admin/post 对应的控制器类全名为 app\controllers\admin\PostController，可以配置 controllerNameSpace 属性修改这个类全名的前缀，这个属性默认值为 app\controllers。

现在需要将 `test/*` 匹配到 SiteController：

```php
'controllerMap' => [
    'test' => 'app\controllers\SiteController',
]
```

params：设置一个数组，指定可以全局访问的参数。

```php
// 配置文件
$config['params']['author'] = 'PPG007';
// controller
Yii::$app->params['author']
```

timeZone：设置 PHP 运行环境中的默认时区，本质上就是调用 date_default_timezone_set 方法。

```php
[
    'timeZone' => 'Asia/Shanghai',
]
```

## 应用组件

应用主体是服务定位器， 它部署一组提供各种不同功能的 应用组件 来处理请求。 例如，urlManager组件负责处理网页请求路由到对应的控制器。 db组件提供数据库相关服务等等。

下面来定义一个用于执行 rpc 调用的组件：

```php
class RPC
{
    public $userId;
    public function __call($name, $arguments)
    {
        return 'calling ' . $name . ' with params: ' . json_encode($arguments) . $this->userId;
    }
}
```

然后将其注册到配置文件中：

```php
'components' => [
    'rpc' => [
        'class' => 'app\component\RPC',
        'userId' => 'PPG007'
    ]
]
```

这样 $userId 的值也传递过去了，当然也可以简写配置 `'rpc' => 'app\component\RPC'`，然后可以在应用中进行调用：`Yii::$app->rpc->getMember('123')`。

## 控制器

控制器是 MVC 模式中的一部分， 是继承 yii\base\Controller 类的对象，负责处理请求和生成响应。 具体来说，控制器从应用主体 接管控制后会分析请求数据并传送到模型， 传送模型结果到视图，最后生成输出响应信息。

### 动作

控制器由操作组成，它是执行终端用户请求的最基础的单元，一个控制器可有一个或多个操作。

### 路由

终端用户通过路由寻找到动作，路由是一个包含以下部分的字符串：

- 模块 id。
- 控制器 id。
- 操作 id。

路由格式：`ControllerID/ActionID`，如果是模块下的控制器，格式为：`ModuleID/ControllerID/ActionID`。

### 创建控制器

在 WebApplication 中，控制器应该继承 `yii\web\Controller` 或其子类，ConsoleApplication 中的控制器应该继承 `yii\console\Controller` 或其子类。

控制器 id 应该仅包含英文小写字母、数字、下划线、中横杠和正斜杠。

控制器 id 根据以下规则衍生控制器类名：

- 将用正斜杠区分的每个单词的第一个字母转为大写。如果控制器ID包含正斜杠， 只将最后的正斜杠后的部分第一个字母转为大写。
- 去掉中横杠，将正斜杠替换为反斜杠。
- 增加 Controller 后缀。
- 在前面增加控制器命名空间。

假设 controllerNameSpace 属性设置为 `app\controllers`，那么有以下的对应关系：

- `article` => `app\controllers\ArticleController`。
- `post-comment` => `app\controllers\PostCommentController`。
- `admin/post-comment` => `app\controllers\admin\PostCommentController`。
- `adminPanels/post-comment` => `app\controllers\adminPanels\PostCommentController`。

::: tip

控制器类必须能够被[自动加载](/yii/docs/concepts.html#类自动加载)。

:::

通过 defaultRoute 属性可以设置默认控制器，不指定路由的请求将被这个控制器处理。

```php
$config = [
    'defaultRoute' => 'site/hello'
];
```

### 创建动作

创建操作可简单地在控制器类中定义所谓的操作方法来完成，操作方法必须是以 action 开头的公有方法。 操作方法的返回值会作为响应数据发送给终端用户。

操作 id 应仅包含英文小写字母、数字、下划线和中横杠。

action 有两种类型：内联操作和独立操作，内联操作是定义在 controller 中的方法，独立操作是继承 `yii\base\Action` 或其子类的类。

#### 内联动作

内联动作方法名称由操作 id 根据以下规则衍生：

- 每个单词第一个字母转为大写。
- 去掉中横杠。
- 增加 action 前缀。

例如：

- `index` => `actionIndex`。
- `hello-world` => `actionHelloWorld`。

::: warning

操作方法名称大小写敏感，且方法必须是 public 的。

:::

#### 独立动作

下面来定义一个独立动作，首先创建 action 类：

```php
class HelloWorldAction extends Action
{
    public function run()
    {
        return 'Hello World';
    }
}
```

必须有 run 方法，Action 类的 runWithParams 方法会通过反射调用此方法。

然后在某个 controller 中重写 actions 方法：

```php
public function actions()
{
    return [
        'hello-world' => 'app\controllers\HelloWorldAction',
    ];
}
```

::: tip

独立操作的 id 可以包含任意字符。

:::

#### 动作结果

对于 WebApplication，返回值可以使任意数据，赋值给 `yii\web\Response::$data` 最终转换为字符串来展示响应内容。

对于 ConsoleApplication，返回值可以是整数，表示命令行下执行的 exit status 退出状态。

#### 动作参数

内联操作和独立操作的 run 方法可以带参数，参数值从请求中获取，对于 WebApplication，每个动作参数的值从 $\_GET 获得，对于 ConsoleApplication，参数从命令行参数获取。

```php
class HelloWorldAction extends Action
{
    public function run($message = '')
    {
        return $message ? $message : 'Hello World';
    }
}
```

::: tip

如果一个参数没有指定默认值，那么请求中必须包含这个参数，否则会报错。

:::

如果希望一个参数是数组或者是其他类型，那么应该加入类型限制：

```php
class HelloWorldAction extends Action
{
    public function run(array $message)
    {
        return $message ? json_encode($message) : 'Hello World';
    }
}
```

#### 默认动作

如果路由只包含了控制器 id，那么会使用对应控制器的默认动作，要指定默认动作，只要在控制器内定义 `public $defaultAction` 即可：

```php
class MemberController extends Controller
{

    public $defaultAction = 'get';

    public function actionGet()
    {
        return 'member';
    }
}
```

::: tip

默认情况下，defaultAction 值为 index。

:::

### 控制器生命周期

处理一个请求时，应用主体会根据请求路由创建一个控制器，控制器经过以下生命周期完成请求：

- 在控制器创建和配置后，调用 `yii\base\Controller::init()` 方法。
- 控制器根据请求操作 id 创建一个操作对象。
  - 如果操作 id 没有指定，那么会使用默认动作。
  - 如果在 actions 方法里找到独立操作，那么会创建一个独立操作。
  - 如果操作 id 对应一个方法，那么会创建一个内联操作。
  - 否则抛出 `yii\base\InvalidRouteException`。
- 控制器按照顺序调用应用主体、模块（如果控制器属于模块）、控制器的 beforeAction 方法。
  - 如果任意一个调用返回 false，后面未调用的 beforeAction 会跳过并且操作执行会被取消。
  - 默认情况下每个 beforeAction 方法会触发一个 beforeAction 事件，在事件中可以追加事件处理操作。
- 控制器执行操作，解析请求数据并填入到操作参数。
- 控制器按照顺序调用控制器、模块（如果控制器属于模块）、应用主体的 afterAction 方法，默认情况下每个 afterAction 方法会触发一个 afterAction 事件。
- 应用主体获取操作结果并赋值给响应。

## 模型

模型是 MVC 的一部分，可以通过继承 `yii\base\Model` 或它的子类定义模型类。

### 属性

每个属性是模型的公有属性，默认情况下所有的非静态公有成员变量都是属性，可以通过 attributes() 方法指定模型所拥有的属性：

```php
class Member extends Model
{
    public $name;
    public function attributes()
    {
        return [
            'name',
        ];
    }
}
```

当属性显示或获取输入时，经常要显示属性的相关标签，嘉定一个属性名为 firstName，在展示的地方可能需要展示为 First Name，可以重写 getAttributeLabel 方法实现，默认情况下标签是将驼峰式大小写变量名转换为多个首字母大写的单词。

```php
class Member extends Model
{
    public $nickname;

    public function attributeLabels()
    {
        return [
            'nickname' => 'name',
        ];
    }
}
```

### 场景

模型可能在多个场景下使用，不同场景中可能会使用不同的业务规则和逻辑，比如有的字段在不同场景中的校验规则可能不同。可以通过 $scenario 属性设置场景，通过重写 scenarios() 方法来自定义行为：

```php
class Member extends Model
{
    public $nickname;
    public $email;

    const SCENARIO_LOGIN = 'login';
    const SCENARIO_REGISTER = "register";

    public function rules()
    {
        return [
            ['nickname', 'required'],
            ['email', 'email'],
            ['email', 'required'],
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_LOGIN => ['nickname', 'email'],
            self::SCENARIO_REGISTER => ['email'],
        ];
    }
}

// 在使用时需要指定场景，指定场景后，只有这个场景下包含的字段才会校验
public function actionGet()
{
    $member = new Member();
    $member->email = '123@qq.com';
    $member->scenario = Member::SCENARIO_LOGIN;
    return $member->validate() ? 'true' : 'false';
}
```

默认场景会包含在 rules 中定义了规则的属性。

### 验证规则

当模型接收到数据，数据应当满足某种规则，如果某个属性的值不满足对应的规则，那么返回相应的错误。

调用 validate() 方法来验证接收到的数据，该方法使用 rules 方法中定义的规则来验证每个属性，如果没有错误这个方法将会返回 true，否则会将错误保存在 $errors 字段中并返回 false，例如：

```php
public function actionGet()
{
    $member = new Member();
    $member->email = '123@qq.com';
    $member->scenario = Member::SCENARIO_LOGIN;
    return $member->validate() ? 'true' : json_encode($member->errors);
}
```

一条规则可以用来验证一个或多个属性，一个属性可以有多个规则，如果希望一条规则只在某个场景下使用，可以指定 on 属性，例如：

```php
public function rules()
{
    return [
        ['nickname', 'required', 'on' => 'register'],
        ['email', 'email'],
        ['email', 'required'],
    ];
}
```

上面的例子中只有设置 $scenario 为 register 时才会校验 nickname。

::: tip

一个属性只有在 scenarios 中定义并且在 rules 中存在规则的情况下才会被校验。

:::

### 块赋值

块赋值只需要一行代码将所有输入填充到一个模型：

```php
public function actionGet()
{
    $data = [
        'nickname' => 'PPG007',
        'email' => '1658272229@qq.com',
    ];
    $member = new Member();
    $member->scenario = 'register';
    $member->attributes = $data;
    return json_encode($member);
}
```

::: tip

块赋值只会应用在 scenarios 方法包含的属性上，上面的例子中如果不指定场景则 nickname 不会被赋值（因为 nickname 在 rules 中设置了 on）。为此，可以提供一个 safe 验证器来声明哪些属性不需要被验证。

```php
public function rules()
{
    return [
        [['nickname', 'email'], 'safe']
    ];
}
```

:::

在某些情况下，可能会想验证一个属性但不想让其是安全属性，可以在 scenarios 方法中属性名前加一个叹号：

```php
public function scenarios()
{
    return [
        'default' => ['nickname', '!email']
    ];
}
```

等价于：

```php
public function rules()
{
    return [
        [['nickname', '!email'], 'safe']
    ];
}
```

这种情况下块赋值将不会对 email 生效，必须手动赋值：`$member->email = $data['email'];`。

### 数据导出

#### 字段

字段是模型通过调用 toArray() 方法生成的数组的单元名，默认情况下，字段名对应属性名，可以通过重写 fields 或 extraFields 方法来改变这种行为：

```php
public function extraFields()
{
    return [
        'email',
    ];
}

public function fields()
{
    return [
        'user' => 'nickname',
        'message' => function () {
            return $this->email . ' ' . $this->nickname;
        }
    ];
}
// 使用处
$member->toArray([], ['email'])
```

::: tip

extraFields 方法返回的字段必须在 toArray 方法的第二个参数中指定才会出现在 toArray 的结果中。

:::

## 模块

模块是独立的软件单元，可以视为小型应用主体，但是不能单独部署，必须属于某个应用主体。

### 创建模块

每个模块都有一个继承 `yii\base\Module` 的模块类，该文件放在模块的最外层目录下，并且能被自动加载，当一个模块被访问，会创建该模块类的唯一实例来帮助模块内代码共享数据和组件。

```php
<?php
namespace app\modules\management;

class Module extends \yii\base\Module
{
    public function init()
    {
        parent::init();
    }
}
```

init 中可以再读取、设置配置等。

然后在应用主体的配置文件中增加：

```php
'modules' => [
    // 指定模块 id，请求时格式为 moduleId/ControllerId/ActionId
    'management' => [
        'class' => 'app\modules\management\Module'
    ]
]
```

然后就可以访问 controller 了：

```php
// Management/AuditLogController
// http://localhost:8888/index.php?r=management/audit-log/search
<?php
namespace app\modules\management\controllers;

class AuditLogController extends \yii\web\Controller
{
    public function actionSearch()
    {
        return '123';
    }
}
```

### 使用模块

在模块中，可能需要通过模块类的实例来访问模块 id 等，可以用以下方式获取模块实例：

```php
// 首先在模块内定义一个 param
class Module extends \yii\base\Module
{
    public function init()
    {
        parent::init();
        $this->params['testParam'] = 'management';
    }
}
// 然后在模块内访问：
Yii::$app->controller->module->params['testParam']
Module::getInstance()->params['testParam']
Yii::$app->getModule('management')->params['testParam']
```

上面的模块中定义的 param 只能在模块内部获取，因为只有访问模块时才会创建模块类，可以在应用主体配置中的 bootstrap 设置，使得每次请求都会加载某个模块：

```php
'bootstrap' => [
    'management'
]
```

这样，任意位置都可以获取到这个模块的内容了。

### 模块嵌套

模块可以无限极嵌套，一个模块可以包含另一个模块，子模块必须在父模块的 modules 属性中声明，例如：

```php
$this->modules = [
    'sub' => [
        'class' => 'app\modules\management\modules\sub\Module',
    ]
];
```

::: tip

嵌套模块中的控制器的路由应该包含所有祖先模块的 id，例如：`http://localhost:8888/index.php?r=management/sub/sub/get`。

:::

### 从模块内部访问组件

Yii 应用程序本质上是一个模块树，由于每一个模块都是服务定位器，所以子模块有权限访问父模块，这允许使用 `$this->get('rpc')` 而不是使用根服务 `Yii::$app->get('rpc')`，这样可以在子模块中覆盖应用主体的配置。

```php
public function init()
{
    parent::init();
    $this->components = [
        'rpc' =>[
            'class' => RPC::class,
            'userId' => 'subUser'
        ]
    ];
}
```

这样，在子模块中使用 Module instance get 获取 rpc 组件时，rpc 组件类中的 userId 和应用主体中配置的会不同。

## 过滤器

过滤器是在控制器动作执行之前或者之后执行的对象，例如权限控制等功能的实现，过滤器可包含预过滤（发生在动作之前）或后过滤（发生在动作之后），也可以同时包含这两个。

### 使用过滤器

过滤器本质上是特殊的行为，所以使用过滤器和使用行为一样，可以在控制类中重写 behaviors 方法来声明过滤器：

```php
public function behaviors()
{
    return [
        [
            'class' => 'yii\filters\HttpCache',
            'only' => ['index', 'view'],
            'lastModified' => function ($action, $params) {
                $q = new \yii\db\Query();
                return $q->from('user')->max('updated_at');
            },
        ],
    ];
}
```

控制器类的过滤器默认应用到该类的所有动作，可以配置 only 属性明确指定应用过滤器的那些动作，上面的例子中只会应用到 actionIndex 和 actionView，也可以使用 except 属性指定一些动作不适用过滤器。

::: warning

如果是在应用主体或者模块的配置中（behaviors 数组）声明过滤器，那么 only 和 except 属性中应该使用路由而不是 actionId，因为模块或者应用主体中只用 actionId 不一定能唯一确定一个具体的动作。

:::

当一个动作配置了多个过滤器时，根据以下规则先后执行：

- 预过滤：
  - 按顺序执行应用主体中 behaviors 列出的过滤器。
  - 按顺序执行模块中 behaviors 列出的过滤器。
  - 按顺序执行控制器中 behaviors 列出的过滤器。
  - 如果任意过滤器终止动作执行，后面的预过滤器和后过滤器都不会再执行。
- 成功通过预过滤后执行动作。
- 后过滤：
  - 倒序执行控制器中 behaviors 列出的过滤器。
  - 倒序执行模块中 behaviors 列出的过滤器。
  - 倒序执行应用主体中 behaviors 列出的过滤器。

### 创建过滤器

要创建一个过滤器，需要创建一个继承 `yii\base\ActionFilter` 类并重写 beforeAction 或 afterAction 方法的类，这两个方法分别对应预过滤和后过滤，两个方法返回布尔值，如果返回 false，那么之后的过滤器和动作不会再执行。

```php
<?php
namespace app\filters;

use yii\base\ActionFilter;

class AccessLogFilter extends ActionFilter
{
    public $module;
    public function beforeAction($action)
    {
        \Yii::warning('before action ' . $this->module . ' ' . $action->id);
        return parent::beforeAction($action);
    }

    public function afterAction($action, $result)
    {
        \Yii::warning('after action ' . $this->module . ' ' . $action->id);
        return parent::afterAction($action, $result);
    }
}
```

然后分别在应用主体和各级模块中引入这个过滤器：

```php
// config/web.php
'as accessLogFilter' => [
    'class' => 'app\filters\AccessLogFilter',
    'module' => 'root',
]
// modules/management/Module.php
public function behaviors()
{
    return array_merge(
        parent::behaviors(),
        [
            'accessLog' => [
                'class' => AccessLogFilter::class,
                'module' => 'management',
            ]
        ]
    );
}
// modules/management/modules/sub/Module.php
public function behaviors()
{
    return array_merge(
        parent::behaviors(),
        [
            'accessLog' => [
                'class' => AccessLogFilter::class,
                'module' => 'sub',
            ]
        ]
    );
}
```

### 核心过滤器

一些内置的过滤器，例如权限控制，缓存、限流、HTTP 方法校验、CORS 等，[doc](https://www.yiiframework.com/doc/guide/2.0/zh-cn/structure-filters#core-filters)。

## 扩展

一些 Yii 维护的扩展，包含 redis、MongoDB 等使用的支持，[doc](https://www.yiiframework.com/doc/guide/2.0/zh-cn/structure-extensions#core-extensions)。
