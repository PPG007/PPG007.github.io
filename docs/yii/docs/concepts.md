# 关键概念

## 组件

组件是 `yii\base\Component` 类或其子类的实例，主要功能：

- 属性。
- 事件。
- 行为。

由于要处理事件和行为，因此组件比常规对象要重一些，如果不需要事件和行为，可以继承 `yii\base\Object`。

配置文件中定义的组件可以是任意类，继承 Component 类可以获得生命周期、事件、行为的支持。

建议的风格：

- 如果需要重写构造方法（Constructor），传入 $config 作为构造器方法最后一个参数， 然后把它传递给父类的构造方法。
- 永远在重写的构造方法结尾处调用一下父类的构造方法。
- 如果重写了 `yii\base\BaseObject::init()` 方法，确保在 init 方法的开头处调用了父类的 init 方法。

BaseObject 生命周期：

- 构造方法内的预初始化过程。你可以在这儿给各属性设置缺省值。
- 通过 $config 配置对象。配置的过程可能会覆盖掉先前在构造方法内设置的默认值。
- 在 init() 方法内进行初始化后的收尾工作。你可以通过重写此方法，进行一些良品检验，属性的初始化之类的工作。
- 对象方法调用。

其中，前三步都在构造方法内完成。

## 事件

### 事件处理器

事件处理器是一个 PHP 回调函数，当它所附加到的事件被触发时就会执行，可以使用以下回调函数之一：

- 字符串形式指定的 PHP 全局函数，例如：'trim'。
- 对象名和方法名数组形式指定的对象方法，例如：[$object, $method]。
- 类名和方法名数组形式指定的静态类方法，例如：[$class, $method]。
- 匿名函数，例如：function ($event){}。

### 附加事件处理器

使用 on 方法附加处理器到事件：

```php
$e = new EventComponent();
$e->on('hello', function ($event) {
    Yii::warning('hello', __METHOD__);
});
```

也可以通过配置来附加事件处理器：

```php
'eventComponent' => [
    'on hello' => function($event) {
        Yii::warning('hello', __METHOD__);
    },
    'class' => 'app\component\EventComponent',
]
```

### 事件处理器顺序

可以附加一个或多个处理器到一个事件，当事件被触发，附加的处理器将按照附加的顺序调用，如果某个处理器要停止后面处理器的调用，可以设置 event 的 handled 属性为 true。

```php
$foo->on(Foo::EVENT_HELLO, function ($event) {
    $event->handled = true;
});
```

默认新附加的事件处理器排在已存在处理器队列的最后。 因此，这个处理器将在事件被触发时最后一个调用。 在处理器队列最前面插入新处理器将使该处理器最先调用，可以传递第四个参数 $append 为假并调用 yii\base\Component::on() 方法实现：

```php
$foo->on(Foo::EVENT_HELLO, function ($event) {
    // 这个处理器将被插入到处理器队列的第一位...
}, $data, false);
```

### 触发事件

```php
class EventComponent extends Component
{
    public function triggerEvent()
    {
        $this->trigger('hello');
    }
}
```

调用此方法即可触发一个事件，也可以传递事件内容：

```php
// 自定义事件
class BaseEvent extends Event
{
    public $message;
}
// 事件处理
function($event) {
    Yii::warning('hello' . $event->message, __METHOD__);
}
```

### 移除事件处理器

```php
$event->off('hello');
// 如果希望只移除某个处理器，可以通过第二个参数指定
```

### 类级别的事件处理器

上面的内容都是实例级别的事件处理，如果希望某个类的全部实例都响应一个事件，可以通过静态方法完成：

```php
// SiteController
public function init()
{
    parent::init();
    Event::on(EventComponent::class, 'hello', function ($event) {
        Yii::warning($event->name, __METHOD__);
    });
}
public function actionView()
{
    Event::trigger(EventComponent::class, 'hello');
    return 'ok';
}
```

移除同样使用 `Event::off` 完成。

::: tip

当对象触发事件时，首先调用实例级别处理器，最后调用类级别处理器

:::

### 使用接口事件

有更多的抽象方式来处理事件。可以为特殊的事件创建一个独立的接口， 然后在需要的类中实现它。

```php
interface EventInterface
{
    const EVENT_HELLO = 'hello';
}

class Foo extends Component implements EventInterface
{
    public function triggerEvent()
    {
        $this->trigger(self::EVENT_HELLO);
    }
}
```

也可以静态触发：

```php
public function init()
{
    parent::init();
    Event::on(EventInterface::class, 'hello', function ($event) {
        Yii::warning('trigger event', __METHOD__);
    });
}

Event::trigger(Foo::class, 'hello');
```

::: tip

trigger 不能让所有实现这个接口的类都触发，也就是说第一个参数填接口无效。

:::

### 全局事件

所谓全局事件实际上是一个基于以上叙述的事件机制的戏法。它需要一个全局可访问的单例，如应用实例。

事件触发者不调用其自身的 trigger() 方法，而是调用单例的 trigger() 方法来触发全局事件。 类似地，事件处理器被附加到单例的事件。

```php
public function init()
{
    parent::init();
    Yii::$app->on('hello', function () {
        Yii::warning('trigger event', __METHOD__);
    });
}
public function actionView()
{
    Yii::$app->trigger('hello');
    return 'ok';
}
```

## 行为

行为是 yii\base\Behavior 或其子类的实例，可以无须改变类继承关系即可增强一个已有的组件类功能。 当行为附加到组件后，它将“注入”它的方法和属性到组件， 然后可以像访问组件内定义的方法和属性一样访问它们。 此外，行为通过组件能响应被触发的事件，从而自定义或调整组件正常执行的代码。

### 定义行为

```php
class MyBehavior extends \yii\base\Behavior
{

    public $prop1;

    public function events()
    {
        return [
            'hello' => 'helloHandler',
        ];
    }

    public function helloHandler($event)
    {
        Yii::warning('trigger hello in behavior', __METHOD__);
    }
}
```

::: tip

行为内部可以通过 $this->$owner 访问行为附加的组件。

:::

如果要让行为处理事件，就应该覆写 events 方法，事件处理器的格式：

- 指向行为类的方法名的字符串。
- 对象或类名的方法名数组，例如 `[$object, 'methodName']`。
- 匿名方法。

### 附加行为

可以静态或动态的附加行为到组件，要静态附加行为，覆写行为要附加的组件类的 behaviors 方法，此方法返回行为配置列表：

```php
public function behaviors()
{
    return [
        // 匿名行为，只有行为类名
        MyBehavior::class,
        // 命名行为，只有行为类名
        'myBehavior2' => MyBehavior::class,
        // 匿名行为，配置数组
        [
            'class' => MyBehavior::class,
            'prop1' => 'value1',
        ],
        // 命名行为，配置数组
        'myBehavior4' => [
            'class' => MyBehavior::class,
            'prop1' => 'value1',
        ]
    ];
}
```

动态附加行为：

```php
public function init()
{
    parent::init();
    // 附加行为对象
    $this->attachBehavior('myBehavior1', new MyBehavior());
    // 附加行为类
    $this->attachBehavior('myBehavior2', MyBehavior::class);
    // 附加配置数组
    $this->attachBehavior('myBehavior3', [
        'class' => MyBehavior::class,
        'prop1' => 'value1',
    ]);
    // 一次附加多个行为
    $this->attachBehaviors([
        MyBehavior::class,
        MyBehavior::class,
    ]);
}
```

也可以通过配置文件附加行为：

```php
[
    'as accessLogFilter' => [
        'class' => 'app\filters\AccessLogFilter',
        'module' => 'root',
    ],
];
```

### 使用行为

```php
$this->prop1;
$this->getBehavior('myBehavior3')->prop1;
```

::: tip

如果两个行为定义了一样的属性或方法，那么首先附加的行为访问优先级更高，可以通过 getBehavior() 方法调用某个具体行为的属性或方法。

:::

### 移除行为

```php
// 移除某个
$this->detachBehavior('myBehavior3');
// 移除全部
$this->detachBehaviors();
```

## 配置

使用 `Yii::createObject` 方法根据传入配置创建对象，例如：

```php
public function actionView()
{
    return Yii::createObject([
        'class' => Member::class,
        'nickname' => 'PPG007',
        'email' => '123456',
    ]);
}
```

如果要将配置应用到一个已经创建的对象实例上，使用 `Yii:configure` 方法：

```php
public function actionView()
{
    $member = new Member();
    Yii::configure($member, [
        'nickname' => 'ppg007',
        'email' => '123',
    ]);
    return $member;
}
```

::: warning

配置一个已经存在的对象，配置数组中不应该包含指定类名的 class 字段。

:::

### 配置的格式

```php
[
    'class' => 'ClassName',
    'propertyName' => 'propertyValue',
    'on eventName' => $eventHandler,
    'as behaviorName' => $behaviorConfig,
]
```

- class 元素指定了将要创建的对象的完全限定类名。
- propertyName 元素指定了对象属性的初始值。键名是属性名，值是该属性对应的初始值。只有公共成员变量以及通过 getter/setter 定义的属性可以被配置。
- on eventName 元素指定了附加到对象事件上的句柄是什么。
- as behaviorName 元素指定了附加到对象的行为。

### 配置文件

如果配置文件内容十分复杂，可以将配置存储在一个或多个 PHP 文件中，一个配置文件返回的是 PHP 数组，例如：

```php
<?php

return [
    'adminEmail' => 'admin@example.com',
    'senderEmail' => 'noreply@example.com',
    'senderName' => 'Example.com mailer',
];
```

通过 require 引入：

```php
public function actionView()
{
    return require __DIR__ . '/../config/params.php';
}
```

## 别名

别名用来表示文件路径和 URL，避免硬编码。别名必须以 `@` 符号开头。

### 定义别名

```php
Yii::setAlias('@foo', 'https://google.com');
```

别名可以衍生别名：

```php
Yii::setAlias('@foobar', '@foo/module');
```

别名也可以在配置文件中配置：

```php
'aliases' => [
    '@bower' => '@vendor/bower-asset',
    '@npm'   => '@vendor/npm-asset',
    '@baidu' => 'https://baidu.com'
],
```

使用 setAlias 定义的别名是**根别名**。

### 解析别名

```php
Yii::setAlias('@foo', '/path/to/foo');
Yii::setAlias('@foo/bar', '/path2/bar');
echo Yii::getAlias('@foo/test/file.php');  // 输出：/path/to/foo/test/file.php
echo Yii::getAlias('@foo/bar/file.php');   // 输出：/path2/bar/file.php
```

如果第二行不把 @foo/bar 定义为根别名，那么最后一行会输出 /path/to/foo/bar/file.php。

## 类自动加载

要使用 Yii 的类自动加载器，你需要在创建和命名类的时候遵循两个简单的规则：

- 每个类都必须置于命名空间之下 (比如 foo\bar\MyClass)。
- 每个类都必须保存为单独文件，且其完整路径能用以下算法取得：

  ```php
  // $className 是一个开头包含反斜杠的完整类名
  $classFile = Yii::getAlias('@' . str_replace('\\', '/', $className) . '.php');
  ```

  举例来说，若某个类名为 foo\bar\MyClass，对应类的文件路径别名会是 @foo/bar/MyClass.php。 为了让该别名能被正确解析为文件路径，@foo 或 @foo/bar 中的一个必须是根别名。

Yii 类自动加载器支持类映射表功能，该功能会建立一个从类的名字到类文件路径的映射。当自动加载器加载一个文件时，首先检查映射表里有没有该类。如果有，对应的文件路径就直接加载了，省掉了进一步的检查。这让类的自动加载变得超级快。

```php
Yii::$classMap['foo\bar\MyClass'] = 'path/to/MyClass.php';
```

## 服务定位器

服务定位器是一个了解如何提供各种应用所需的服务（或组件）的对象。在服务定位器中， 每个组件都只有一个单独的实例，并通过ID 唯一地标识。 用这个 ID 就能从服务定位器中得到这个组件。服务定位器就是 `yii\di\ServiceLocator` 或其子类的实例。

例如这样一个场景：RPC 微服务有多个子服务，例如 AccountService、MemberService 等，希望提供一个组件能够以类似 Yii::$app->account->method 的形式执行调用，因为微服务数量众多，每个都封装成组件比较复杂，可以通过服务定位器实现，调用类似 Yii::$app->rpc->account->method。

首先定义 RPC 类：

```php
class RPC
{
    public $serviceName;
    public function __call($name, $arguments)
    {
        \Yii::warning('calling ' . $this->serviceName . $name, __METHOD__);
    }
}
```

然后定义 ServiceLocator：

```php
class RPCLocator extends ServiceLocator
{
    public function has($id, $checkInstance = false)
    {
        if (parent::has(id, $checkInstance)) {
            return true;
        }
        $this->set($id, [
            'class' => RPC::class,
            'serviceName' => $id,
        ]);
        return true;
    }
}
```

将 ServiceLocator 注册到组件：

```php
'rpc' => [
    'class' => 'app\component\RPCLocator',
]
```

调用：

```php
Yii::$app->rpc->account->login();
Yii::$app->rpc->member->active();
```
