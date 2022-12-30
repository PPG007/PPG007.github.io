# 枚举

## 基础

定义一个枚举：

```php
<?php
enum Example {
    case A;
    case B;
    case C;
    case D;
}

$val = Example::A;

var_dump($val);
```

一个枚举可以定义零个或多个case，且没有最大数量限制。默认情况下，枚举的条目（case）本质上不是标量。 就是说 Suit::Hearts 不等同于 "0"。 其实，本质上每个条目是该名称对象的单例。由于对象间的大小比较毫无意义，这也意味着 enum 值从来不会 < 或 > 其他值。 当 enum 的值用于比较时，总是返回 false。

这类没有关联数据的条目（case），被称为“纯粹条目”（Pure Case）。 仅包含纯粹 Case 的 Enum 被称为纯粹枚举（Pure Enum）。枚举类型里所有的纯粹条目都是自身的实例。 枚举类型在内部的实现形式是一个 class。所有的 case 有个只读的属性 name。 它大小写敏感，是 case 自身的名称。

```php
<?php
enum Example {
    case A;
    case B;
    case C;
    case D;
}

echo Example::A->name;
```

## 回退枚举

默认情况下枚举条目实现形式不是标量。 它们是纯粹的对象实例。 不过，很多时候也需要在数据库、数据存储对象中来回读写枚举条目。 因此，能够内置支持标量形式也很有用（更易序列化）。

```php
<?php
enum Example: string {
    case A = 'A';
}

var_dump(Example::A->value);
```

由于有标量的条目回退（Backed）到一个更简单值，又叫回退条目（Backed Case）。 包含所有回退条目的 Enum 又叫“回退 Enum”（Backed Enum）。 回退 Enum 只能包含回退条目。 纯粹 Enum 只能包含纯粹条目。

回退枚举仅能回退到 int 或 string 里的一种类型， 且同时仅支持使用一种类型（就是说，不能联合 int|string）。 如果枚举为标量形式，所有的条目必须明确定义唯一的标量值。 无法自动生成标量（比如：连续的数字）。

条目等同的值，必须是个字面量或它的表达式。 不能是常量和常量表达式。 换言之，允许 1 + 1， 不允许 1 + SOME_CONST。

回退条目有个额外的只读属性 value， 它是定义时指定的值。

回退枚举实现了闲置的 BackendEnum 接口，暴露了两个方法：

```php
<?php
enum Example: string {
    case A = 'A';
}

$e = Example::from('A');
var_dump($e);
$e = Example::tryFrom('B');
echo $e === null; // true
```

## 枚举方法

枚举（包括纯粹枚举、回退枚举）还能包含方法， 也能实现 interface。 如果 Enum 实现了 interface，则其中的条目也能接受 interface 的类型检测。

```php
<?php
interface IExample {
    public function display(): void;
}

enum ExampleImpl: string implements IExample {
    public function display(): void
    {
        echo $this->name . ": ". $this->value . "\n";
    }
    case A = 'A';
    case B = 'B';
}

$obj = ExampleImpl::A;
$obj->display();
```

## 枚举静态方法

```php
<?php

enum Example {
    case BIGGER_THAN_ZERO;
    case LESS_THAN_ZERO;
    case ZERO;
    public static function from(int $var): Example {
        if ($var > 0) {
            return self::BIGGER_THAN_ZERO;
        } else if ($var === 0) {
            return Example::ZERO;
        }
        return self::LESS_THAN_ZERO;
    }
}

var_dump(Example::from(123));
```

## 枚举常量

仅管 enum 可以包括 public、private、protected 的常量， 但由于它不支持继承，因此在实践中 private 和 protected 效果是相同的。

```php
<?php
enum Size
{
    case Small;
    case Medium;
    case Large;

    public const Huge = self::Large;
}
```

## Trait

枚举也能使用 trait，行为和 class 一样。 留意在枚举中 use trait 不允许包含属性。 只能包含方法、静态方法。 包含属性的 trait 会导致 fatal 错误。

```php
<?php
interface Colorful
{
    public function color(): string;
}

trait Rectangle
{
    public function shape(): string {
        return "Rectangle";
    }
}

enum Suit implements Colorful
{
    use Rectangle;

    case Hearts;
    case Diamonds;
    case Clubs;
    case Spades;

    public function color(): string
    {
        return match($this) {
            Suit::Hearts, Suit::Diamonds => 'Red',
            Suit::Clubs, Suit::Spades => 'Black',
        };
    }
}
```

## 和对象的差异

- 禁止构造、析构函数。
- 不支持继承。无法 extend 一个 enum。
- 不支持静态属性和对象属性。
- 由于枚举条目是单例对象，所以不支持对象复制。
- 除了下面列举项，不能使用魔术方法。
- 枚举必须在使用前被声明。

以下对象功能可用，功能和其他对象一致：

- public、private、protected 方法。
- public、private、protected 静态方法。
- public、private、protected 类常量。
- enum 可以 implement 任意数量的 interface。
- 枚举和它的条目都可以附加 注解。 目标过滤器 TARGET_CLASS 包括枚举自身。 目标过滤器 TARGET_CLASS_CONST 包括枚举条目。
- 魔术方法：`__call`、`__callStatic`、 `__invoke`。
- 常量 `__CLASS__` 和 `__FUNCTION__` 的功能和平时无差别

## 枚举值清单

## 序列化

枚举的序列化不同于对象。 尤其是它们有新的序列化代码： "E"，指示了 enum 条目名称。 然后反序列化动作能够设置变量为现有的单例值。 确保那样：

```php
<?php

enum Example {
    case A;
}
print Example::A === unserialize(serialize(Example::A)); // true
print "\n";
print serialize(Example::A);
// E:11:"Suit:Hearts";
```

如果枚举和它的条目在反序列化时，无法匹配序列化的值， 会导致 warning 警告，并返回 false。

把纯粹枚举序列化为 JSON 将会导致错误。 把回退枚举序列化为 JSON 时，仅会用标量值的形式，以合适的类型表达。 可通过实现 JsonSerializable 来重载序列化行为。
