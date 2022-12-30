# 流程控制

## if、else、elseif、else if

```php
if ($a > $b) {
    echo "a is bigger than b";
} elseif ($a == $b) {
    echo "a is equal to b";
} else {
    echo "a is smaller than b";
}
```

## while、do while

same as C.

## for、foreach

for is same as C.

foreach 只能用于数组和对象，有两种语法：

```php
foreach (iterable_expression as $value)
    statement
foreach (iterable_expression as $key => $value)
    statement
```

foreach 不支持用 “@” 来抑制错误信息的能力。

## break、continue

same as C.

## switch

::: warning

switch/case 使用的是 == 松散比较。

:::

same as C，如果满足条件的 case 没有 break，那么后面的 case 都会被执行。

多个 case 可以共用代码块。

## match(PHP 8)

```php
<?php
$food = 'cake';

$return_value = match ($food) {
    'apple' => 'This food is an apple',
    'bar' => 'This food is a bar',
    'cake' => 'This food is a cake',
    default => '12312',
};

var_dump($return_value);
```

::: warning

- match 是严格比较。
- match 会返回一个值。
- match 的分支不像 switch，不受 break 影响。
- match 表达式必须列举所有情况，否则会抛出异常。

:::

非一致性检查：

```php
<?php

$age = 23;

$result = match (true) {
    $age >= 65 => 'senior',
    $age >= 25 => 'adult',
    $age >= 18 => 'young adult',
    default => 'kid',
};

var_dump($result);

$text = 'Bienvenue chez nous';

$result = match (true) {
    str_contains($text, 'Welcome') || str_contains($text, 'Hello') => 'en',
    str_contains($text, 'Bienvenue') || str_contains($text, 'Bonjour') => 'fr',
    // ...
};

var_dump($result);
```

## declare

TODO:

## include

vars.php:

```php
<?php

$color = 'green';
$fruit = 'apple';
```

test.php:

```php
<?php

echo "A $color $fruit"; // A

include 'vars.php';

echo "A $color $fruit"; // A green apple
```

当一个文件被包含时，其中所包含的代码继承了 include 所在行的变量范围。从该处开始，调用文件在该行处可用的任何变量在被调用的文件中也都可用。不过所有在包含文件中定义的函数和类都具有全局作用域。

如果 include 出现于调用文件中的一个函数里，则被调用的文件中所包含的所有代码将表现得如同它们是在该函数内部定义的一样。所以它将遵循该函数的变量范围。此规则的一个例外是魔术常量，它们是在发生包含之前就已被解析器处理的。

```php
<?php

function foo()
{
    global $color;

    include 'vars.php';

    echo "A $color $fruit";
}

/* vars.php 在 foo() 范围内，所以 $fruit 在范围为不可用。 *
 * $color 能用是因为声明成全局变量。 */

foo();                    // A green apple
echo "A $color $fruit";   // A green
```

## require

require 和 include 几乎完全一样，require 在出错时产生 E_COMPILE_ERROR 级别的错误，将导致脚本中止而 include 只产生警告（E_WARNING），脚本会继续运行。

## include_once

include_once 语句在脚本执行期间包含并运行指定文件。此行为和 include 语句类似，唯一区别是如果该文件中已经被包含过，则不会再次包含，且 include_once 会返回 true。 顾名思义，require_once，文件仅仅包含（require）一次。

## require_once

require_once 表达式和 require 表达式完全相同，唯一区别是 PHP 会检查该文件是否已经被包含过，如果是则不会再次包含。

## goto

same as C.
