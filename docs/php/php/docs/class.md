# 类和对象

## 基本概念

以静态方式调用非静态方法在 8.0 之后将会抛出错误，之前的版本将产生一个通知同时方法中的 $this 将被声明为未定义。

### 只读类

8.2.0 后可以使用 readonly 修饰 class，标记为 readonly 的类将会向每个声明的属性添加 readonly 修饰符并禁止创建动态属性。readonly class 声明的属性必须要有类型而且不能是静态的。只有子类也是 readonly 才能继承 readonly 类。

```php
<?php

readonly class Test
{
    public int $var;
}

$t = new Test();
$t['add'] = 2; // 报错
```

### new

创建新对象时对象总是被赋值，除非该对象定义了构造函数并且抛出异常。

```php
<?php

class A {

}

var_dump(new(A::class));
var_dump(new A());
var_dump(new('A'));
```

### 属性和方法

类的属性和方法存在不同的命名空间中，所以同一个类的属性和方法可以使用相同的名字，代码中根据上下文哦按吨是属性还是方法。

```php
<?php

class A {
    public $a;
    public function a() {
        return 'hello';
    }

    public function __construct()
    {
        $this->a = 123;
    }

}

$a = new A();
var_dump($a->a); // 123
var_dump($a->a()); // "hello"
```

如果类属性是一个匿名函数需要使用括号包裹才能访问，因为访问类属性的优先级更高。

```php
<?php

class A {
    public $a;
    public function a() {
        return 'hello';
    }

    public function __construct()
    {
        $this->a = function() {
            return 123;
        };
    }

}

$obj = new A();
var_dump(($obj->a)()); // 123
var_dump($obj->a()); // "hello"
```

### 继承

使用 extends 关键字继承另一个类的方法和属性，不支持多重继承，被继承的方法和属性可以通过用同样的名字重新声明被覆盖，除非父类指定了 final。

```php
<?php

class SimpleClass {
    public function displayVar()
    {
        echo 'hello';
    }
}

class ExtendClass extends SimpleClass
{
    // 同样名称的方法，将会覆盖父类的方法
    function displayVar()
    {
        echo "Extending class\n";
        parent::displayVar();
    }
}

$extended = new ExtendClass();
$extended->displayVar();
```

### ::class

获取包含类 ClassName 的完全限定名称。

```php
<?php

namespace Test;

class SimpleClass {
    public function displayVar()
    {
        echo 'hello';
    }
}

echo SimpleClass::class; // Test\SimpleClass
```

### Nullsafe

自 PHP 8.0.0 起，类属性和方法可以通过 "nullsafe" 操作符访问： ?->。 除了一处不同，nullsafe 操作符和以上原来的属性、方法访问是一致的： 对象引用解析（dereference）为 null 时不抛出异常，而是返回 null。 并且如果是链式调用中的一部分，剩余链条会直接跳过。

```php
<?php

namespace Test;

class SimpleClass {
    public function displayVar()
    {
        echo 'hello';
    }
}

$obj = new SimpleClass();
$obj->test = null;
$obj->test?->s;
```

## 属性

::: tip

没有任何访问控制修饰符则将默认为 public。

类型属性必须在访问前初始化。

:::

```php
<?php

class Shape
{
    public int $numberOfSides;
    public string $name;

    public function setNumberOfSides(int $numberOfSides): void
    {
        $this->numberOfSides = $numberOfSides;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getNumberOfSides(): int
    {
        return $this->numberOfSides;
    }

    public function getName(): string
    {
        return $this->name;
    }
}

$circle = new Shape();
$circle->setName("circle");
var_dump($circle->getName());
var_dump($circle->getNumberOfSides()); // error
```

只读属性：

```php
<?php

class SimpleClassA {
    public readonly string $a;

    public function __construct()
    {
        $this->a = 'test';
    }

}

$obj = new SimpleClassA();

echo $obj->a;
$obj->a = '123'; // error
```

::: warning

readonly 只能修饰类型化属性，或者是 mixed 修饰的属性，不支持对静态属性设置 readonly。

:::

## 类常量

```php
<?php
class MyClass
{
    const CONSTANT = 'constant value';

    function showConstant() {
        echo  self::CONSTANT . "\n";
    }
}

echo MyClass::CONSTANT . "\n";

$classname = "MyClass";
echo $classname::CONSTANT . "\n";

$class = new MyClass();
$class->showConstant();

echo $class::CONSTANT."\n";
```

## 构造函数和析构函数

::: tip

如果子类中定义了构造函数则不会隐式调用其父类的构造函数。要执行父类的构造函数，需要在子类的构造函数中调用 parent::\_\_construct()。如果子类没有定义构造函数则会如同一个普通的类方法一样从父类继承（假如没有被定义为 private 的话）。

构造函数不受签名兼容性规则的约束。

:::

```php
<?php

class SimpleClassA
{
    public function __construct()
    {
        echo 'Hello' . "\n";
    }
}

new SimpleClassA();
```

构造器属性提升：当构造器参数带有访问控制修饰符时，PHP 会将其同时当做对象属性。

```php
<?php

class SimpleClassA
{
    public function __construct(public string $a = '')
    {
        echo 'Hello' . "\n";
    }
}

echo (new SimpleClassA('World'))->a;
```

析构函数：

```php
<?php

class SimpleClassA
{
    public function __construct(public string $a = '')
    {
        echo 'Hello' . "\n";
    }

    public function __destruct()
    {
        echo 'end';
    }
}

$obj = new SimpleClassA('123');
echo $obj->a . "\n";
```

## 访问控制

public, protected, private; same with java

## 范围解析操作符

范围解析操作符（两个冒号）可以用于访问静态成员、类常量，还可以用于覆盖类中的属性和方法。

```php
<?php

class A {
    const CONST_A = 123;
    public static $a = 123;
}

class B extends A {
    public static function demo() {
        return parent::CONST_A;
    }
}

echo A::$a . A::CONST_A;
echo B::demo();
```

## static

::: warning

静态属性使用范围解析操作符访问，不能通过箭头访问。

:::

## 抽象类

HP 有抽象类和抽象方法。定义为抽象的类不能被实例化。任何一个类，如果它里面至少有一个方法是被声明为抽象的，那么这个类就必须被声明为抽象的。被定义为抽象的方法只是声明了其调用方式（参数），不能定义其具体的功能实现。

继承一个抽象类的时候，子类必须定义父类中的所有抽象方法， 并遵循常规的 继承 签名兼容性 规则。

```php
<?php

abstract class A {
    abstract public function get(): string;
    abstract public function hello($value);
    public function show() {
        echo $this->get() . "\n";
    }
}

class B extends A {
    public function show()
    {
        parent::show();
    }

    public function get(): string
    {
        return $this->value;
    }
    // 子类可以定义父类签名中不存在的可选参数
    public function hello($value = 'world', $sep = '')
    {
        echo 'hello' . $sep . $value . "\n";
    }

    public function __construct(private string $value)
    {

    }
}

$obj = new B('123');
$obj->show();
$obj->hello($sep = ',,,,');
```

## 对象接口

```php
<?php

interface MyError {
    public function string(): string;
}

interface MyError2 extends MyError {
    public function code(): int;
}

class A implements MyError2 {
    public function string(): string
    {
        return $this->message;
    }

    public function code(): int
    {
        return $this->code;
    }

    public function __construct(private string $message, private int $code)
    {
    }
}
```

::: tip

一个接口可以 extends 扩展多个接口，一个 class 可以实现多个接口。

:::

## Trait

Trait 和 Class 相似，但仅仅旨在用细粒度和一致的方式来组合功能。 无法通过 trait 自身来实例化。它为传统继承增加了水平特性的组合；也就是说，应用的几个 Class 之间不需要继承。

```php
<?php

trait Hello {
    function hello(){
        echo 'Hello' . "\n";
    }
}

trait World {
    function world() {
        echo 'world' . "\n";
    }
}

class A {
    use Hello;
    use World;
}

class B {
    use Hello;
}

$obj1 = new A();
$obj2 = new B();

$obj1->hello();
$obj1->world();
$obj2->hello();
```

::: tip 优先级

当前类成员 > trait > 被继承的方法

```php
<?php

trait Hello {
    function hello() {
        echo 'hello' . "\n";
    }
}

class Base {
    public function hello(){
        echo 'base' . "\n";
    }
}

class Sub extends Base {
    use Hello;
}

class Sub2 extends Base {
    use Hello;

    public function hello()
    {
        parent::hello();
    }

}

$obj = new Sub();
$obj->hello(); // hello
$obj = new Sub2();
$obj->hello(); // base
```

:::

使用多个 trait：

```php
<?php

trait A {
    function a() {
        echo 'a';
    }
}

trait B {
    function b() {
        echo self::class;
    }
}

class C {
    use A, B;
}

$obj = new C();
$obj->a(); // a
$obj->b(); // C
```

如果两个 trait 都插入了一个同名方法，如果没有明确解决冲突将会导致一个致命错误。

冲突的解决：

```php
<?php

trait A {
    function whoAmI(): void
    {
        echo 'a';
    }
}

trait B {
    function whoAmI(): void
    {
        echo 'b';
    }
}

class C {
    use A, B {
        B::whoAmI insteadof A;
    }
}

class D {
    use A, B {
        A::whoAmI insteadof B;
        B::whoAmI as b;
    }
}

$obj = new C();
$obj->whoAmI(); // b
$obj = new D();
$obj->whoAmI(); // a
$obj->b(); // b
```

修改方法的访问控制权限：

```php
class D {
    use A, B {
        A::whoAmI insteadof B;
        B::whoAmI as b, protected;
    }
}
```

trait 中使用 trait：

```php
<?php

trait A {
    function whoAmI(): void
    {
        echo 'a';
    }
}

trait B {
    function whoAmI(): void
    {
        echo 'b';
    }
}

trait C {
    use A, B{
        A::whoAmI insteadof B;
    }
    function c() {
        echo 'c';
    }
}

class D {
    use C;
}

$obj = new D();
$obj->c(); // c
$obj->whoAmI(); // a
```

trait 支持抽象方法：

```php
<?php

trait A {
    public function whoAmI(): void
    {
        echo $this->me();
    }
    private abstract function me(): string;
}

class B {
    use A;

    private function me(): string
    {
        return 'B';
    }
}

$obj = new B();
$obj->whoAmI(); // B
```

静态成员：

```php
<?php

trait A {
    private static string $a;
    public abstract static function getA() :string;
}

class B {
    use A;

    public static function getA(): string
    {
        return self::$a;
    }

    public static function setA($a): void
    {
        self::$a = $a;
    }

}
B::setA('123');
echo B::getA();
```

::: warning

自 PHP 8.1.0 起，弃用直接在 trait 上调用静态方法或者访问静态属性。 静态方法和属性应该仅在使用了 trait 的 class 中访问。

:::

属性：

```php
<?php

trait A {
    public string $a;
}

class B {
    use A;

    public function __construct(public string $a)
    {

    }

}

$obj = new B('123');
echo $obj->a; // 123
```

::: warning

Trait 定义了一个属性后，类就不能定义同样名称的属性，否则会产生 fatal error。 有种情况例外：属性是兼容的（同样的访问可见度、类型、readonly 修饰符和初始默认值）。

:::

常量：8.2.0 后可以定义常量。

```php
<?php
trait ConstantTrait {
    public const FLAG_MUTABLE = 1;
    final public const FLAG_IMMUTABLE = 5;
}

class ConstantExample {
    use ConstantTrait;
}

$example = new ConstantExample;
echo $example::FLAG_MUTABLE;
echo $example::FLAG_IMMUTABLE;
```

::: warning

如果 trait 定义了常量，然后类不能定义相同名称的常量，除非两者兼容（相同的可见性、初始化值和 final），否则会发出 fatal error。

:::

## 匿名类

可以传递参数到匿名类的构造器，也可以扩展其他类、使用 trait、实现接口。

```php
<?php


class SomeClass
{
}

interface SomeInterface
{
}

trait SomeTrait
{
}

var_dump(new class(10) extends SomeClass implements SomeInterface {
    private $num;

    public function __construct($num)
    {
        $this->num = $num;
    }

    use SomeTrait;
});
```

匿名类被嵌套进普通 Class 后，不能访问这个外部类（Outer class）的 private（私有）、protected（受保护）方法或者属性。 为了访问外部类（Outer class）protected 属性或方法，匿名类可以 extend（扩展）此外部类。 为了使用外部类（Outer class）的 private 属性，必须通过构造器传进来：

```php
<?php

class Outer
{
    private $prop = 1;
    protected $prop2 = 2;

    protected function func1()
    {
        return 3;
    }

    public function func2()
    {
        return new class($this->prop) extends Outer {
            private $prop3;

            public function __construct($prop)
            {
                $this->prop3 = $prop;
            }

            public function func3()
            {
                return $this->prop2 + $this->prop3 + $this->func1();
            }
        };
    }
}

echo (new Outer)->func2()->func3();
```

## 重载

PHP所提供的重载（overloading）是指动态地创建类属性和方法。是通过魔术方法（magic methods）来实现的。

当调用当前环境下未定义或不可见的类属性或方法时，重载方法会被调用。本节后面将使用不可访问属性（inaccessible properties）和不可访问方法（inaccessible methods）来称呼这些未定义或不可见的类属性或方法。

::: warning

所有的重载方法都必须被声明为 public。

这些魔术方法的参数都不能通过引用传递。

:::

属性重载：

- `public __set(string $name, mixed $value): void`：在给不可访问（protected 或 private）或不存在的属性赋值时，\_\_set() 会被调用。。
- `public __get(string $name): mixed`：读取不可访问（protected 或 private）或不存在的属性的值时，\_\_get() 会被调用。。
- `public __isset(string $name): bool`：当对不可访问（protected 或 private）或不存在的属性调用 isset() 或 empty() 时，\_\_isset() 会被调用。
- `public __unset(string $name): void`：当对不可访问（protected 或 private）或不存在的属性调用 unset() 时，\_\_unset() 会被调用。

参数 $name 是指要操作的变量名称。\_\_set() 方法的 $value 参数指定了 $name 变量的值。

属性重载只能在对象中进行。在静态方法中，这些魔术方法将不会被调用。所以这些方法都不能被 声明为 static。将这些魔术方法定义为 static 会产生一个警告。

```php
<?php

class A
{

    const fields = [
        'a',
        'b',
    ];

    public function __construct(private string $a, protected bool $b)
    {
    }

    public function __set(string $name, $value): void
    {
        echo 'set' . ' ' . $name . ' ' . $value . "\n";
    }

    public function __get(string $name)
    {
        echo 'get' . ' ' . $name . "\n";
    }

    public function __isset(string $name): bool
    {
        echo 'isset' . ' ' . $name . "\n";
        $isset = false;
        foreach (self::fields as $field) {
            if ($field === $name) {
                $isset = true;
                break;
            }
        }
        return $isset;
    }

    public function __unset(string $name): void
    {
        echo 'unset' . ' ' . $name . "\n";
    }


}

$obj = new A('123', true);
$obj->a;
$obj->b=false;
var_dump(isset($obj->a));
var_dump(isset($obj->unset));
```

方法重载：

- `public __call(string $name, array $arguments): mixed`：在对象中调用一个不可访问方法时，\_\_call() 会被调用。
- `public static __callStatic(string $name, array $arguments): mixed`：在静态上下文中调用一个不可访问方法时，\_\_callStatic() 会被调用。

$name 参数是要调用的方法名称。$arguments 参数是一个枚举数组，包含着要传递给方法 $name 的参数。

```php
<?php

class A
{
    public function __call(string $name, array $arguments)
    {
        echo 'Calling object method, name: ' . $name . ', args: ' . implode(', ', $arguments) . "\n";
    }

    public static function __callStatic(string $name, array $arguments)
    {
        echo 'Calling static method, name: ' . $name . ', args: ' . implode(', ', $arguments) . "\n";
    }

}

$obj = new A();
$obj->unexists(1, 'a', true);
A::unexists(0, 'b', false);
```

## 遍历对象

使用 foreach 可以遍历对象在上下文中的可见属性。

```php
<?php

class A
{
    private string $strVar;
    protected int $intVar;
    public bool $booleanVar;

    public function __construct(string $strVar, int $intVar, bool $booleanVar)
    {
        $this->strVar = $strVar;
        $this->intVar = $intVar;
        $this->booleanVar = $booleanVar;
    }

    public function iterate()
    {
        foreach ($this as $key => $value) {
            echo $key . ' => ' . $value . "\n";
        }
    }
}

$obj = new(A::class)('123', 123, true);
$obj->iterate();
foreach ($obj as $key => $value) {
    echo $key . ' => ' . $value . "\n";
}
```

## 魔术方法

- `public __sleep(): array`：serialize() 函数会检查类中是否存在一个魔术方法 `__sleep()`。如果存在，该方法会先被调用，然后才执行序列化操作。此功能可以用于清理对象，并返回一个包含对象中所有应被序列化的变量名称的数组，不能返回父类的私有成员的名字。如果该方法未返回任何内容，则 null 被序列化，并产生一个 E_NOTICE 级别的错误。
- `public __wakeup(): void`：unserialize() 会检查是否存在一个 `__wakeup()` 方法。如果存在，则会先调用 `__wakeup` 方法，预先准备对象需要的资源。经常用在反序列化操作中，例如重新建立数据库连接，或执行其它初始化操作。
- `public __serialize(): array`：serialize() 函数会检查类中是否存在一个魔术方法 `__serialize()` 。如果存在，该方法将在任何序列化之前优先执行。它必须以一个代表对象序列化形式的 键/值 成对的关联数组形式来返回，如果没有返回数组，将会抛出一个 TypeError 错误。
- `public __unserialize(array $data): void`：unserialize() 检查是否存在具有名为 `__unserialize()` 的魔术方法。此函数将会传递从 `__serialize()` 返回的恢复数组。然后它可以根据需要从该数组中恢复对象的属性。
- `public __toString(): string`：same as java。
- `__invoke( ...$values): mixed`：当尝试以调用函数的方式调用一个对象时，\_\_invoke() 方法会被自动调用。
- `static __set_state(array $properties): object`：当调用 var_export() 导出类时，此静态 方法会被调用。本方法的唯一参数是一个数组，其中包含按 ['property' => value, ...] 格式排列的类属性。。
- `__debugInfo(): array`：当通过 var_dump() 转储对象，获取应该要显示的属性的时候， 该函数就会被调用。如果对象中没有定义该方法，那么将会展示所有的公有、受保护和私有的属性。。

::: warning

如果类中同时定义了 `__serialize()` 和 `__sleep()` 两个魔术方法，则只有 `__serialize()` 方法会被调用。 `__sleep()` 方法会被忽略掉。如果对象实现了 Serializable 接口，接口的 serialize() 方法会被忽略，做为代替类中的 `__serialize()` 方法会被调用。

如果类中同时定义了 `__unserialize()` 和 `__wakeup()` 两个魔术方法，则只有 `__unserialize()` 方法会生效，`__wakeup()` 方法会被忽略。

:::

```php
<?php

class A
{
    private string $strVar;
    protected int $intVar;
    public bool $booleanVar;

    public function __construct(string $strVar, int $intVar, bool $booleanVar)
    {
        $this->strVar = $strVar;
        $this->intVar = $intVar;
        $this->booleanVar = $booleanVar;
    }

    public function __sleep(): array
    {
        echo 'sleep' . "\n";
        return ['strVar', 'intVar', 'booleanVar'];
    }

    public function __wakeup(): void
    {
        echo 'wakeup' . "\n";
    }

    public function __toString(): string
    {
        return 'strVar: ' . $this->strVar . ', intVar: ' . $this->intVar . ', booleanVar: ' . $this->booleanVar;
    }

    public function __invoke($args)
    {
        echo 'invoke' . "\n";
        foreach ($args as $key => $value) {
            echo $key . ' => ' . $value . "\n";
        }
    }

    public function __debugInfo(): ?array
    {
        return ['strVar'];
    }

    public static function __set_state(array $an_array): object
    {
        return new A($an_array['strVar'], $an_array['intVar'], $an_array['booleanVar']);
    }

    public function __serialize(): array
    {
        echo 'serialize' . "\n";
        return ['a' => $this->intVar, 'b' => $this->strVar, 'c' => $this->booleanVar];
    }

    public function __unserialize(array $data): void
    {
        echo 'unserialize' . "\n";
        $this->strVar = $data['b'];
        $this->intVar = $data['a'];
        $this->booleanVar = $data['c'];
    }
}

$obj = new A('123', 123, true);
$obj([1, '123', true]);
$serialized = serialize($obj);
echo $serialized . "\n";
echo unserialize($serialized) . "\n";
var_dump($obj);
```

## Final

same as java.

## 对象复制

对象复制可以通过 clone 关键字来完成（如果可能，这将调用对象的 `__clone()` 方法）。

当对象被复制后，PHP 会对对象的所有属性执行一个浅复制（shallow copy）。所有的引用属性 仍然会是一个指向原来的变量的引用。

当复制完成时，如果定义了 `__clone()` 方法，则新创建的对象（复制生成的对象）中的 `__clone()` 方法会被调用，可用于修改属性的值（如果有必要的话）。

```php
<?php

class Reference {
    public function __construct(public string $var)
    {
    }
}

class A
{

    public function __construct(public Reference $var)
    {
    }

    public function __clone(): void
    {
        $this->var = clone $this->var;
    }


}

$obj = new A(new Reference('test'));
$obj2 = clone $obj;

$obj->var->var = '123';
var_dump($obj2->var);
```

## 对象比较

当使用比较运算符（==）比较两个对象变量时，比较的原则是：如果两个对象的属性和属性值 （值使用 == 对比）都相等，而且两个对象是同一个类的实例，那么这两个对象变量相等。

而如果使用全等运算符（===），这两个对象变量一定要指向某个类的同一个实例（即同一个对象）。

```php
<?php

class A {
    public function __construct(public string $var)
    {
    }
}
$obj1 = new A('test');
$obj2 = new A('test');

var_dump($obj1 == $obj2);
var_dump($obj1 === $obj2);
```

## 后期静态绑定

PHP 增加了一个叫做后期静态绑定的功能，用于在继承范围内引用静态调用的类。“后期绑定”的意思是说，static:: 不再被解析为定义当前方法所在的类，而是在实际运行时计算的。也可以称之为“静态绑定”，因为它可以用于（但不限于）静态方法的调用。

使用 self:: 或者 **CLASS** 对当前类的静态引用，取决于定义当前方法所在的类：

```php
<?php
class A {
    public static function who() {
        echo __CLASS__;
    }
    public static function test() {
        self::who();
    }
}

class B extends A {
    public static function who() {
        echo __CLASS__;
    }
}

B::test(); // A
```

```php
<?php
class A {
    public static function who() {
        echo __CLASS__;
    }
    public static function test() {
        static::who();
    }
}

class B extends A {
    public static function who() {
        echo __CLASS__;
    }
}

B::test(); // B
```

另一个例子：

```php
<?php
class A {
    private function foo() {
        echo "success!\n";
    }
    public function test() {
        $this->foo();
        static::foo();
    }
}

class B extends A {
    /* foo() 将复制给 B，因此它的作用域将是 A 并调用成功 */
}

class C extends A {
    private function foo() {
        /* 替换原来的方法；新的作用域是 C */
    }
}

$b = new B();
$b->test();
$c = new C();
$c->test();   //fails
```

## 对象和引用

PHP 的引用是别名，就是两个不同的变量名字指向相同的内容。在 PHP 中，一个对象变量不再保存整个对象的值。只是保存一个标识符来访问真正的对象内容。 当对象作为参数传递，作为结果返回，或者赋值给另外一个变量，另外一个变量跟原来的不是引用的关系，只是他们都保存着同一个标识符的拷贝，这个标识符指向同一个对象的真正内容，like Java。

```php
<?php
class A {
    public $foo = 1;
}

$a = new A;
$b = $a;     // $a ,$b都是同一个标识符的拷贝
$b->foo = 2;
echo $a->foo."\n"; // 2


$c = new A;
$d = &$c;    // $c ,$d是引用
$d->foo = 2;
echo $c->foo."\n"; // 2


$e = new A;

function foo($obj) {
    $obj->foo = 2;
}

foo($e);
echo $e->foo."\n"; // 2
```

## 对象序列化

```php
<?php
class A {
    public $foo = 1;
}

$obj = new A();
$temp = serialize($obj);
var_dump($temp);
$obj2 = unserialize($temp);
var_dump($obj2);
```

## 协变与逆变

在 PHP 7.2.0 里，通过对子类方法里参数的类型放宽限制，实现对逆变的部分支持。 自 PHP 7.4.0 起开始支持完整的协变和逆变。

协变使子类比父类方法能返回更具体的类型； 逆变使子类比父类方法参数类型能接受更模糊的类型。
