# 命名空间

::: warning

命名空间名称大小写不敏感。

:::

## 定义命名空间

虽然任意合法的 PHP 代码都可以包含在命名空间中，但只有以下类型的代码受命名空间的影响，它们是：类（包括抽象类和 trait）、接口、函数和常量。

命名空间通过关键字 namespace 来声明。如果一个文件中包含命名空间，它必须在其它所有代码之前声明命名空间，所有的非 PHP 代码包括空白符都不能出现在命名空间的声明前，除了一个以外：declare关键字。

```php
<?php
namespace PPG007\Test;
class A {

}
```

## 在同一个文件中定义多个命名空间

将全局的非命名空间中的代码与命名空间中的代码组合在一起，只能使用大括号形式的语法。全局代码必须用一个不带名称的 namespace 语句加上大括号括起来。

```php
<?php
namespace MyProject {

const CONNECT_OK = 1;
class Connection { /* ... */ }
function connect() { /* ... */  }
}

namespace { // 全局代码
session_start();
$a = MyProject\connect();
echo MyProject\Connection::start();
}
```

## 使用命名空间

a.php:

```php
<?php
namespace Foo\Bar\subnamespace;

const FOO = 1;
function foo() {}
class foo
{
    static function staticmethod() {}
}
```

b.php:

```php
<?php
namespace Foo\Bar;
include 'a.php';

const FOO = 2;
function foo() {}
class foo
{
    static function staticmethod() {}
}

/* 非限定名称 */
foo(); // 解析为函数 Foo\Bar\foo
foo::staticmethod(); // 解析为类 Foo\Bar\foo 的静态方法 staticmethod
echo FOO; // 解析为常量 Foo\Bar\FOO

/* 限定名称 */
subnamespace\foo(); // 解析为函数 Foo\Bar\subnamespace\foo
subnamespace\foo::staticmethod(); // 解析为类 Foo\Bar\subnamespace\foo,
// 以及类的方法 staticmethod
echo subnamespace\FOO; // 解析为常量 Foo\Bar\subnamespace\FOO

/* 完全限定名称 */
\Foo\Bar\foo(); // 解析为函数 Foo\Bar\foo
\Foo\Bar\foo::staticmethod(); // 解析为类 Foo\Bar\foo, 以及类的方法 staticmethod
echo \Foo\Bar\FOO; // 解析为常量 Foo\Bar\FOO
```

::: tip

注意访问任意全局类、函数或常量，都可以使用完全限定名称，例如 \strlen() 或 \Exception 或 \INI_ALL。

:::

## 命名空间与动态语言特征

```php
<?php
namespace backend;

class A
{
    public function __construct()
    {
        echo 'A' . "\n";
    }

}

function f()
{
    echo __FUNCTION__ . "\n";
}

new('backend\A'); // 动态类名必须使用限定名
f();
```

::: tip

因为在动态的类名称、函数名称或常量名称中，限定名称和完全限定名称没有区别，因此其前导的反斜杠是不必要的。

:::

## `__NAMESPACE__`

PHP支持两种抽象的访问当前命名空间内部元素的方法，__NAMESPACE__ 魔术常量和 namespace 关键字。

常量 __NAMESPACE__ 的值是包含当前命名空间名称的字符串。在全局的，不包括在任何命名空间中的代码，它包含一个空的字符串。

```php
<?php
namespace backend;

echo __NAMESPACE__;
```

```php
<?php
namespace backend;

class A {
    public function display(): void {
        echo 'wuhu';
    }
}

$obj = new(__NAMESPACE__ . '\\' . 'A');
$obj->display();
```

```php
<?php
namespace backend;

class A {
    public function display(): void {
        echo 'wuhu';
    }
}

$obj = new namespace\A();
$obj->display();
```

## 使用命名空间：别名、导入

```php
<?php
namespace foo;
use My\Full\Classname as Another;

// 下面的例子与 use My\Full\NSname as NSname 相同
use My\Full\NSname;

// 导入一个全局类
use ArrayObject;

// 导入函数
use function My\Full\functionName;

// 为函数设置别名
use function My\Full\functionName as func;

// 导入常量
use const My\Full\CONSTANT;

$obj = new namespace\Another; // 实例化 foo\Another 对象
$obj = new Another; // 实例化 My\Full\Classname　对象
NSname\subns\func(); // 调用函数 My\Full\NSname\subns\func
$a = new ArrayObject(array(1)); // 实例化 ArrayObject 对象
// 如果不使用 "use \ArrayObject" ，则实例化一个 foo\ArrayObject 对象
func(); // 调用函数 My\Full\functionName
echo CONSTANT; // 输出 My\Full\CONSTANT 的值
```

## 全局空间

如果没有定义任何命名空间，所有的类与函数的定义都是在全局空间，与 PHP 引入命名空间概念前一样。在名称前加上前缀 \ 表示该名称是全局空间中的名称，即使该名称位于其它的命名空间中时也是如此。

## 使用命名空间：后备全局函数/常量

在一个命名空间中，当 PHP 遇到一个非限定的类、函数或常量名称时，它使用不同的优先策略来解析该名称。类名称总是解析到当前命名空间中的名称。因此在访问系统内部或不包含在命名空间中的类名称时，必须使用完全限定名称。

对于函数和常量来说，如果当前命名空间中不存在该函数或常量，PHP 会退而使用全局空间中的函数或常量。

```php
<?php
namespace A\B\C;
class Exception extends \Exception {}

$a = new Exception('hi'); // $a 是类 A\B\C\Exception 的一个对象
$b = new \Exception('hi'); // $b 是类 Exception 的一个对象

$c = new ArrayObject; // 致命错误, 找不到 A\B\C\ArrayObject 类
```

## 名称解析规则

一些定义：

- 非限定名称：名称中不包含命名空间分隔符的标识符。
- 限定名称：名称中包含命名空间分隔符的标识符。
- 完全限定名称：名称中包含命名空间分隔符并且以分隔符开始的标识符。
- 相对名称：以 namespace 开头的标识符。

规则：

- 完全限定名称总是会解析成没有前缀符号的命名空间名称。 \A\B 解析为 A\B。
- 解析相对名称时，会用当前命名空间的名称替换掉 namespace。 如果名称出现在全局命名空间，会截掉 namespace\ 前缀。 例如，在命名空间 X\Y 里的 namespace\A 会被解析成 X\Y\A。 在全局命名空间里，同样的名字却被解析成 A。
- 对于限定名称，名字的第一段会根据当前 class/namespace 导入表进行翻译。 比如命名空间 A\B\C 被导入为 C， 名称 C\D\E 会被翻译成 A\B\C\D\E。
- 对于限定名称，如果没有应用导入规则，就将当前命名空间添加为名称的前缀。 例如，位于命名空间 A\B 内的名称 C\D\E 会解析成 A\B\C\D\E。
- 根据符号类型和对应的当前导入表，解析非限定名称。 这也就是说，根据 class/namespace 导入表翻译类名称； 根据函数导入表翻译函数名称； 根据常量导入表翻译常量名称。 比如，在 use A\B\C; 后，类似 new C() 这样的名称会解析为 A\B\C()。 类似的，use function A\B\fn; 后， fn() 的用法，解析名称为 A\B\fn。
- 如果没有应用导入规则，对于类似 class 符号的非限定名称，会添加当前命名空间作为前缀。 比如命名空间 A\B 内的 new C() 会把名称解析为 A\B\C。
- 如果没有应用导入规则，非限定名称指向函数或常量，且代码位于全局命名空间之外，则会在运行时解析名称。 假设代码位于命名空间 A\B 中， 下面演示了调用函数 foo() 是如何解析的：
    1. 在当前命名空间中查找函数： A\B\foo()。
    2. 它会尝试找到并调用 全局 的函数 foo()。

```php
<?php
namespace A;
use B\D, C\E as F;

// 函数调用

foo();      // 首先尝试调用定义在命名空间"A"中的函数foo()
            // 再尝试调用全局函数 "foo"

\foo();     // 调用全局空间函数 "foo"

my\foo();   // 调用定义在命名空间"A\my"中函数 "foo"

F();        // 首先尝试调用定义在命名空间"A"中的函数 "F"
            // 再尝试调用全局函数 "F"

// 类引用

new B();    // 创建命名空间 "A" 中定义的类 "B" 的一个对象
            // 如果未找到，则尝试自动装载类 "A\B"

new D();    // 使用导入规则，创建命名空间 "B" 中定义的类 "D" 的一个对象
            // 如果未找到，则尝试自动装载类 "B\D"

new F();    // 使用导入规则，创建命名空间 "C" 中定义的类 "E" 的一个对象
            // 如果未找到，则尝试自动装载类 "C\E"

new \B();   // 创建定义在全局空间中的类 "B" 的一个对象
            // 如果未发现，则尝试自动装载类 "B"

new \D();   // 创建定义在全局空间中的类 "D" 的一个对象
            // 如果未发现，则尝试自动装载类 "D"

new \F();   // 创建定义在全局空间中的类 "F" 的一个对象
            // 如果未发现，则尝试自动装载类 "F"

// 调用另一个命名空间中的静态方法或命名空间函数

B\foo();    // 调用命名空间 "A\B" 中函数 "foo"

B::foo();   // 调用命名空间 "A" 中定义的类 "B" 的 "foo" 方法
            // 如果未找到类 "A\B" ，则尝试自动装载类 "A\B"

D::foo();   // 使用导入规则，调用命名空间 "B" 中定义的类 "D" 的 "foo" 方法
            // 如果类 "B\D" 未找到，则尝试自动装载类 "B\D"

\B\foo();   // 调用命名空间 "B" 中的函数 "foo"

\B::foo();  // 调用全局空间中的类 "B" 的 "foo" 方法
            // 如果类 "B" 未找到，则尝试自动装载类 "B"

// 当前命名空间中的静态方法或函数

A\B::foo();   // 调用命名空间 "A\A" 中定义的类 "B" 的 "foo" 方法
              // 如果类 "A\A\B" 未找到，则尝试自动装载类 "A\A\B"

\A\B::foo();  // 调用命名空间 "A\B" 中定义的类 "B" 的 "foo" 方法
              // 如果类 "A\B" 未找到，则尝试自动装载类 "A\B"
```
