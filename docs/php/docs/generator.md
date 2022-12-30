# 生成器

## 语法

生成器函数看起来像普通函数——不同的是普通函数返回一个值，而生成器可以 yield 生成多个想要的值。任何包含 yield 的函数都是一个生成器函数。

当一个生成器被调用的时候，它返回一个可以被遍历的对象.当你遍历这个对象的时候(例如通过一个foreach循环)，PHP 将会在每次需要值的时候调用对象的遍历方法，并在产生一个值之后保存生成器的状态，这样它就可以在需要产生下一个值的时候恢复调用状态。

一旦不再需要产生更多的值，生成器可以简单退出，而调用生成器的代码还可以继续执行，就像一个数组已经被遍历完了。

生成器函数的核心是yield关键字。它最简单的调用形式看起来像一个return申明，不同之处在于普通return会返回值并终止函数的执行，而yield会返回一个值给循环调用此生成器的代码并且只是暂停执行生成器函数。

```php
<?php

function range100()
{
    for ($i = 0; $i < 100; $i++) {
        yield $i;
    }
}

foreach (range100() as $item) {
    echo $item . "\n";
}
```

返回键值对：

```php
<?php

function example()
{
    $arr = [
        'A' => 1,
        'B' => 2,
    ];
    foreach ($arr as $key => $value) {
        yield $key => $value;
    }
}

foreach (example() as $key => $value) {
    var_dump($key);
    var_dump($value);
}
```

返回 null：

```php
function example()
{
    $arr = [
        'A' => 1,
        'B' => 2,
    ];
    foreach ($arr as $key => $value) {
        yield ;
    }
}
```

使用引用：

```php
<?php

function &example() // 使用引用
{
    $value = 100;
    while ($value > 0) {
        yield $value;
    }
}

foreach (example() as &$value) { // 使用引用
    echo $value . "\n";
    $value--;
}
```

生成器委托允许使用 yield from 关键字从另外一个生成器、 Traversable 对象、array 通过生成值。 外部生成器将从内部生成器、object、array 中生成所有的值，直到它们不再有效， 之后将在外部生成器中继续执行。

如果生成器与 yield from 一起使用，那么 yield from 表达式将返回内部生成器返回的任何值。

```php
<?php
function count_to_ten() {
    yield 1;
    yield 2;
    yield from [3, 4];
    yield from new ArrayIterator([5, 6]);
    yield from seven_eight();
    return yield from nine_ten();
}

function seven_eight() {
    yield 7;
    yield from eight();
}

function eight() {
    yield 8;
}

function nine_ten() {
    yield 9;
    return 10;
}

$gen = count_to_ten();
foreach ($gen as $num) {
    echo "$num ";
}
echo $gen->getReturn();
```

## 与 Iterator 的比较

生成器最主要的优点是简洁。和实现一个 Iterator 类相较而言， 同样的功能，用生成器可以编写更少的代码，可读性也更强。

不过，这也付出了灵活性的代价： 生成器是一个只能向前的迭代器，一旦开始遍历就无法后退。 意思也就是说，同样的生成器无法遍历多遍：要么再次调用生成器函数，重新生成后再遍历。

## 存储到数组

yield from 不能重置 key。它保留 Traversable 对象或者 array 返回的 key。因此，某些值可能会与其他的 yield 或者 yield from 共享公共的 key，因此，在插入数组时将会用这个 key 覆盖以前的值。

一个非常重要的常见情况是 iterator_to_array() 默认返回带 key 的 array ， 这可能会造成无法预料的结果。 iterator_to_array() 还有第二个参数 use_keys ，可以设置为 false 来收集 Generator 返回的不带 key 的所有值。

```php
<?php
function inner() {
    yield 1; // key 0
    yield 2; // key 1
    yield 3; // key 2
}
function gen() {
    yield 0; // key 0
    yield from inner(); // keys 0-2
    yield 4; // key 1
}
// 传递 false 作为第二个参数获得数组 [0, 1, 2, 3, 4]
var_dump(iterator_to_array(gen()));
// array(3) {
//   [0]=>
//   int(1)
//   [1]=>
//   int(4)
//   [2]=>
//   int(3)
// }
```
