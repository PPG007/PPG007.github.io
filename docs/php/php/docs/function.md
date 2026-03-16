# 函数

## 用户自定义函数

函数无需在调用前定义，除非是下面的情况：

```php
<?php
function foo()
{
  function bar()
  {
    echo "I don't exist until foo() is called.\n";
  }
}

/* 现在还不能调用 bar() 函数，因为它还不存在 */

foo();

/* 现在可以调用 bar() 函数了，因为 foo() 函数
   的执行使得 bar() 函数变为已定义的函数 */

bar();
```

PHP 中的所有函数和类都具有全局作用域，可以定义在一个函数之内而在之外调用，反之亦然。

PHP 不支持函数重载，也不可能取消定义或者重定义已声明的函数。

递归函数不要超过 100 或 200 层，否则可能因为堆栈崩溃导致程序终止。

## 函数的参数

普通传递：

```php
<?php

t([1, 2, 3]);

function t($input)
{
    var_dump($input);
}
```

引用传递：

默认情况下，函数参数通过值传递（因而即使在函数内部改变参数的值，它并不会改变函数外部的值）。如果希望允许函数修改它的参数值，必须通过引用传递参数。如果想要函数的一个参数总是通过引用传递，可以在函数定义中该参数的前面加上符号 &。

```php
<?php

$input = [1, 2, 3];
t($input);

function t(&$input)
{
    $input = [];
}

echo sizeof($input);
```

默认参数：

```php
<?php

function makecoffee($type = "cappuccino")
{
    return "Making a cup of $type.\n";
}
echo makecoffee();
echo makecoffee(null);
echo makecoffee("espresso");
```

::: tip

PHP 8.1 起允许使用对象作为默认值。

默认值必须是常量表达式，不能是诸如变量，类成员，或者函数调用等。

:::

命名参数：

PHP 8.0.0 起，命名参数可用于跳过多个可选参数。

```php
<?php
function makeyogurt($container = "bowl", $flavour = "raspberry", $style = "Greek")
{
    return "Making a $container of $flavour $style yogurt.\n";
}

echo makeyogurt(style: "natural");
```

可变数量的参数列表：

```php
<?php

function sum(...$numbers)
{
    $result = 0;
    foreach ($numbers as $number) {
        $result+=intval($number);
    }
    return $result;
}

echo sum(1, 2, 3, 4);
```

## 返回值

函数不能返回多个值，但是可以通过返回一个数组达到类似的效果：

```php
<?php

function t()
{
    return [1, 2, 3];
}

list($a, $b) = t();
echo $a . $b;
```

从函数返回一个引用：

```php
<?php
function &returns_reference()
{
    return $someref;
}

$newref =& returns_reference();
```

## 可变函数

PHP 支持可变函数的概念。这意味着如果一个变量名后有圆括号，PHP 将寻找与变量的值同名的函数，并且尝试执行它。可变函数可以用来实现包括回调函数，函数表在内的一些用途。

```php
<?php
function foo() {
    echo "In foo()<br />\n";
}

function bar($arg = '')
{
    echo "In bar(); argument was '$arg'.<br />\n";
}

// 使用 echo 的包装函数
function echoit($string)
{
    echo $string;
}

$func = 'foo';
$func();        // 调用 foo()

$func = 'bar';
$func('test');  // 调用 bar()

$func = 'echoit';
$func('test');  // 调用 echoit()
```

复杂调用：

```php
<?php
class Foo
{
    static function bar()
    {
        echo "bar\n";
    }
    function baz()
    {
        echo "baz\n";
    }
}

$func = array("Foo", "bar");
$func(); // 打印 "bar"
$func = array(new Foo, "baz");
$func(); // 打印 "baz"
$func = "Foo::bar";
$func(); // 打印 "bar"
```

## 匿名函数

闭包可以从父作用域中继承变量。 任何此类变量都应该用 use 语言结构传递进去。

```php
<?php
$message = 'hello';

// 没有 "use"
$example = function () {
    var_dump($message);
};
$example();

// 继承 $message
$example = function () use ($message) {
    var_dump($message);
};
$example();

// 当函数被定义而不是被调用的时候继承变量的值
$message = 'world';
$example();

// 重置 message
$message = 'hello';

// 通过引用继承
$example = function () use (&$message) {
    var_dump($message);
};
$example();

// 父级作用域改变的值反映在函数调用中
$message = 'world';
$example();

// 闭包函数也可以接受常规参数
$example = function ($arg) use ($message) {
    var_dump($arg . ' ' . $message);
};
$example("hello");

// 返回类型在 use 子句的后面
$example = function () use ($message): string {
    return "hello $message";
};
var_dump($example());
```

## 箭头函数

类似 JavaScript。
