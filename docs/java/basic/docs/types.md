# 数据类型

## 基础类型

Java 中的基础类型（primitive types）包括：

- `byte`：8 位，范围 -128 到 127
- `short`：16 位，范围 -32,768 到 32,767
- `int`：32 位，范围 -2^31 到 2^31-1
- `long`：64 位，范围 -2^63 到 2^63
- `float`：32 位，单精度浮点数
- `double`：64 位，双精度浮点数
- `char`：16 位，表示单个 Unicode 字符
- `boolean`：表示真（true）或假（false）

## long 类型

当使用 `long` 类型时，必须在数字后面加上 `L` 或 `l` 来表示这是一个 long 类型的字面值。例如：

```java
long myLong = 123456789L;
```

如果不添加 `L`，编译器会将数字视为 `int` 类型，可能会导致溢出错误。

当数字过长时，数字之间可以使用下划线 `_` 来提高可读性。例如：

```java
long myLong = 1_000_000_000L;
```

## 浮点类型

Java 默认的浮点类型是 `double`，如果需要使用 `float` 类型，必须在数字后面加上 `F` 或 `f` 来表示这是一个 float 类型的字面值。例如：

```java
float myFloat = 3.14F;
```

## 类型转换

Java 支持自动类型转换（widening conversion）和强制类型转换（narrowing conversion）。自动类型转换发生在将较小范围的类型赋值给较大范围的类型时，例如：

```java
int myInt = 100;
long myLong = myInt; // 自动类型转换
```

强制类型转换需要使用括号来指定目标类型，例如：

```java
long myLong = 100L;
int myInt = (int) myLong; // 强制类型转换
```

## 包装类型

每个基础类型都有一个对应的包装类（wrapper class），用于在需要对象的场合使用：

- `Byte`：对应 `byte`
- `Short`：对应 `short`
- `Integer`：对应 `int`
- `Long`：对应 `long`
- `Float`：对应 `float`
- `Double`：对应 `double`
- `Character`：对应 `char`
- `Boolean`：对应 `boolean`

## var 关键字

从 Java 10 开始，Java 引入了 `var` 关键字，可以让编译器根据上下文自动推断变量的类型。例如：

```java
var myInt = 100; // 编译器推断为 int
var myString = "Hello, World!"; // 编译器推断为 String
```

## 字符串

在 Java 中，字符类型 `char` 保存一个 Unicode 字符，一个英文字符和一个中文字符都可以用一个 `char` 类型表示，它们都占用两个字节。

在 Java 中，字符串是由 `String` 类表示的对象。字符串可以使用双引号 `"` 来定义，例如：

```java
String myString = "Hello, World!";
```

如果要表示多行字符出纳，可以使用文本块（text block），从 Java 13 开始引入，使用三重双引号 `"""` 来定义，例如：

```java
String myTextBlock = """
    This is a text block.
    It can span multiple lines.
    """;
```

### 字符串的不可变特性

字符串类型除了只有包装类没有基础类型之外，还有一个重要的特性就是不可变（immutable）。一旦创建了一个字符串对象，它的值就不能被改变了。如果修改一个字符串的值，例如：

```java
String myString = "Hello";
myString = myString + " World!";
```

实际上是创建了一个新的字符串对象，而不是修改原来的字符串对象，然后修改了 `myString` 变量的引用指向了新的字符串对象。因此对于需要频繁修改字符串的场景，建议使用 `StringBuilder` 或 `StringBuffer` 类来提高性能。

## 空值

在 Java 中，`null` 是一个特殊的值，表示一个对象引用不指向任何对象。当一个变量被赋值为 `null` 时，它表示该变量没有指向任何对象。例如：

```java
String myString = null; // myString 不指向任何对象
```

## 数组

数组是一种数据结构，可以存储固定大小的同类型元素。在 Java 中，数组是对象，可以使用 `new` 关键字来创建。例如：

```java
int[] myArray = new int[5]; // 创建一个长度为 5 的 int 数组
```

如果在定义数组时可以直接指定初始化的元素，那么就不需要写出数组的大小，例如：

```java
int[] myArray = new int[] { 68, 79, 91, 85, 62 };
// 或者更简洁的写法
int[] myArray = {1, 2, 3, 4, 5};
```

可以通过 `.length` 属性来获取数组的长度，例如：

```java
int[] myArray = {1, 2, 3, 4, 5};
int length = myArray.length; // length 的值为 5
```

::: tip 数组的特点

- 数组所有元素初始化为默认值，整型为 0，浮点型为 0.0，布尔型为 false，引用类型为 null。
- 数组一旦创建，大小就不可改变。
- 数组可以存储基本类型和引用类型的元素。但是数组本身是引用类型。

:::

当修改数组整体时，原有的数组不会改变，而是创建了一个新的数组对象并将变量引用指向新的数组对象。例如：

```java
int[] myArray = {1, 2, 3, 4, 5};
myArray = new int[] {6, 7, 8, 9, 10}; // 创建了一个新的数组对象，myArray 变量引用指向新的数组
```
