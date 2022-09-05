# 变量

## 基础

PHP 中的变量用一个美元符号后面跟变量名来表示。变量名是区分大小写的。

```php
<?php
$var = 'Bob';
$Var = 'Joe';
echo "$var, $Var";      // 输出 "Bob, Joe"

$4site = 'not yet';     // 非法变量名；以数字开头
$_4site = 'not yet';    // 合法变量名；以下划线开头
$i站点is = 'mansikka';  // 合法变量名；可以用中文
```

变量默认总是传值赋值。那也就是说，当将一个表达式的值赋予一个变量时，整个原始表达式的值被赋值到目标变量。这意味着，例如，当一个变量的值赋予另外一个变量时，改变其中一个变量的值，将不会影响到另外一个变量。

PHP 也提供了另外一种方式给变量赋值：引用赋值。这意味着新的变量简单的引用（换言之，“成为其别名” 或者 “指向”）了原始变量。改动新的变量将影响到原始变量，反之亦然。

```php
<?php
$a = 1;
$b = &$a;
$b = 2;
echo $a; // 2
```

::: warning

只有有名字的变量才能引用赋值。

```php
<?php
$foo = 25;
$bar = &$foo;      // 合法的赋值
$bar = &(24 * 7);  // 非法; 引用没有名字的表达式

function test()
{
   return 25;
}

$bar = &test();    // 非法
```

:::

虽然在 PHP 中并不需要初始化变量，但对变量进行初始化是个好习惯。未初始化的变量具有其类型的默认值 - 布尔类型的变量默认值是 false，整形和浮点型变量默认值是零，字符串型变量（例如用于 echo 中）默认值是空字符串以及数组变量的默认值是空数组。

可以使用 `isset()` 方法检测一个变量是否已被初始化：

```php
<?php
$a = 1;
var_dump(isset($a)); // true
unset($a);
var_dump(isset($a)); // false
```

## 预定义变量

TODO:

## 变量范围

### global

```php
<?php
$a = 1;
$b = 2;
function Sum()
{
    global $a, $b;
    $b += $a;
}
Sum();
echo $b; // 3
```

在函数中声明了全局变量 $a 和 $b 之后，对任一变量的所有引用都会指向其全局版本。对于一个函数能够声明的全局变量的最大个数，PHP 没有限制。

在全局范围内访问变量的第二个办法，是用特殊的 PHP 自定义 $GLOBALS 数组：

```php
<?php
$a = 1;
$b = 2;
function Sum()
{
    $GLOBALS['b']+=$GLOBALS['a'];
}
Sum();
echo $b;
```

`$GLOBALS` 是一个关联数组，每一个变量为一个元素，键名对应变量名，值对应变量的内容。

### 使用静态变量

静态变量仅在局部函数域中存在，但当程序执行离开此作用域时，其值并不丢失。

```php
<?php
function test()
{
    static $a = 0;
    echo $a;
    $a++;
}

test(); // 0
test(); // 1
```

变量 $a 仅在第一次调用 test() 函数时被初始化，之后每次调用 test() 函数都会输出 $a 的值并加一。

静态变量也提供了一种处理递归函数的方法：

```php
<?php
function test()
{
    static $count = 0;

    $count++;
    echo $count;
    if ($count < 10) {
        test();
    }
    $count--;
}

test();
```

常量表达式的结果可以赋值给静态变量，但是动态表达式（比如函数调用）会导致解析错误。

```php
<?php
function foo(){
    static $int = 0;          // correct
    static $int = 1+2;        // correct
    static $int = sqrt(121);  // wrong  (as it is a function)

    $int++;
    echo $int;
}
```

::: tip

静态声明是在编译时解析的。

:::

### 全局和静态变量的引用

对于变量的 static 和 global 定义是以引用的方式实现的。例如，在一个函数域内部用 global 语句导入的一个真正的全局变量实际上是建立了一个到全局变量的引用。这有可能导致预料之外的行为：

```php
<?php
function test_global_ref() {
    global $obj;
    $new = new stdclass;
    $obj = &$new;
}

function test_global_noref() {
    global $obj;
    $new = new stdclass;
    $obj = $new;
}

test_global_ref();
var_dump($obj); // NULL
test_global_noref();
var_dump($obj); // class stdClass
```

引用并不是静态地存储的：

```php
<?php
function &get_instance_ref() {
    static $obj;

    echo 'Static object: ';
    var_dump($obj);
    if (!isset($obj)) {
        $new = new stdclass;
        // 将一个引用赋值给静态变量
        $obj = &$new;
    }
    if (!isset($obj->property)) {
        $obj->property = 1;
    } else {
        $obj->property++;
    }
    return $obj;
}

function &get_instance_noref() {
    static $obj;

    echo 'Static object: ';
    var_dump($obj);
    if (!isset($obj)) {
        $new = new stdclass;
        // 将一个对象赋值给静态变量
        $obj = $new;
    }
    if (!isset($obj->property)) {
        $obj->property = 1;
    } else {
        $obj->property++;
    }
    return $obj;
}

$obj1 = get_instance_ref(); // NULL
$still_obj1 = get_instance_ref(); // NULL
echo "\n";
$obj2 = get_instance_noref(); // NULL
$still_obj2 = get_instance_noref(); // 1
```

## 可变变量

$a 的内容是“hello”并且 $hello 的内容是“world”。

```php
<?php

$a = 'hello';
$$a = 'world';

echo "$a ${$a}"; // hello world
echo "$a $hello"; // hello world
```

::: tip

假设当前存在一个数组 $a，如果希望取其中某个下标值做可变变量应使用 `${$a[i]}`，如果希望取这个数组为可变变量得到一个新数组并从中取某个下标的值应使用 `${$a}[i]`。

:::

类的属性也可以通过可变属性名来访问。可变属性名将在该调用所处的范围内被解析。例如，对于 $foo->$bar 表达式，则会在本地范围来解析 $bar 并且其值将被用于 $foo 的属性名。对于 $bar 是数组单元时也是一样。

```php
<?php
class foo {
    var $bar = 'I am bar.';
    var $arr = array('I am A.', 'I am B.', 'I am C.');
    var $r   = 'I am r.';
}

$foo = new foo();
$bar = 'bar';
$baz = array('foo', 'bar', 'baz', 'quux');
echo $foo->$bar . "\n"; // I am bar.
echo $foo->{$baz[1]} . "\n"; // I am bar.

$start = 'b';
$end   = 'ar';
echo $foo->{$start . $end} . "\n"; // I am bar.

$arr = 'arr';
echo $foo->{$arr[1]} . "\n"; // I am r.
```

## 来自 PHP 之外的变量

[Reference](https://www.php.net/manual/zh/language.variables.external.php)。
