# 内置类型

由于 Dart 中每个变量引用都指向一个对象（一个类的实例），通常也可以使用 构造器 来初始化变量。

此外，由于都是对象，所以变量也有方法。

## Numbers(int double)

```dart
int a = 10;
double b = 3.14;
```

int 和 double 都是 num 的子类。

::: tip
在 Dart 2.1 之前，在浮点数上下文中使用整数字面量是错误的。
:::

Numbers 和字符串互相转换：

```dart
void main(List<String> args) {
// String -> int
var one = int.parse('1');
// String -> double
var onePointOne = double.parse('1.1');
// int -> String
String oneAsString = 1.toString();
// double -> String
String piAsString = 3.14159.toStringAsFixed(2);
}
```

## Strings(String)

String 对象是 UTF-16 编码的字符序列。可以使用单引号或者双引号来创建字符串。

在字符串中，以 ${表达式} 的形式使用表达式，如果表达式是一个标识符，可以省略掉 {}。如果表达式的结果为一个对象，则 Dart 会调用该对象的 toString 方法来获取一个字符串。

```dart
void main(List<String> args) {
  // Dart 中字符串的比较直接使用等号即可，例如true
  String a = "test";
  String b = "test";
  print("Dart 中字符串的比较直接使用等号即可，例如${a == b}");
}
```

使用 + 连接字符串：

```dart
void main(List<String> args) {
  String a = "test";
  String b = "test";
  print(a+b);
}
```

使用三个单引号或者三个双引号创建多行字符串：

```dart
void main(List<String> args) {
  String a = """
这是一个
多行字符串
  """;
  print(a);
}
```

字符串前面加 r 创建不转义的字符串：

```dart
void main(List<String> args) {
  // /n 会被输出而不是换行
  String a = r"test\nstring";
  print(a);
}
```

::: warning
如果要把插值字符串字面量赋值给一个 const 字符串，则插值的内容必须都是 const。
:::

## 布尔类型

```dart
void main(List<String> args) {
  bool condition = false;
  if (condition) {
    print("true");
  }
}
```

## Lists

```dart
void main(List<String> args) {
  List<int> list = [1, 2, 3];
  print(list);
  print(list.length);
  print(list.first);
}
```

下面两组语句都会报错，但是注意，不要使用第三种写法，这涉及到 const 的冗余。

```dart
const List<int> list = [1, 2, 3];
list[1] = 3;

List<int> list2 = const [1, 2, 3];
list2[1] = 3;

const List<int> list3 = const [1, 2, 3];
```

扩展操作符（...）和 空感知扩展操作符（...?）：

```dart
void main(List<String> args) {
  const List<int> list = [1, 2, 3];
  // [0, 1, 2, 3]
  var list2 = [0, ...list];
  // [0, 1, 2, 3]
  var list3 = [0, ...?list]; // 可以防止扩展操作符右面为 null
}
```

集合中的 if 和 for 操作：

```dart
void main(List<String> args) {
  // [test, true]
  var list = ["test", if (true) "true"];
  print(list);
  // [value is test, value is true]
  var list2 = [for (var i in list) 'value is $i'];
  print(list2);
}
```

## Sets

Dart 支持的集合由集合的字面量和 Set 类提供。

::: tip
Set 字面量在 2.2 加入。
:::

```dart
void main(List<String> args) {
  var demoSet = {0};
  var list = [0, 1, 2];
  for (var i = 0; i < 10; i++) {
    demoSet.add(i);
  }
  demoSet.addAll(list);
  print(demoSet);
}
```

可以使用在 {} 前加上类型参数的方式创建一个空的 Set，或者将 {} 赋值给一个 Set 类型的变量：

```dart
void main(List<String> args) {
  var set1 = <String>{};
  Set<String> set2 = {};
}
```

set 也支持 if、for 以及扩展操作符：

```dart
void main(List<String> args) {
  Set<int> demoSet = {
    for (var i = 0; i < 100; i++)
      if (i.isOdd) i
  };
  print(demoSet);
  Set<int> anotherSet = {...?demoSet};
  print(anotherSet);
}
```

## Maps

Dart 中 Map 提供了 Map 字面量以及 Map 类型两种形式的 Map。

```dart
void main(List<String> args) {
  var user = {
    "name": "PPG007",
    "email": "1658272229@qq.com",
  };
  var user2 = Map<String, String>();
}
```

添加与获取元素：

```dart
void main(List<String> args) {
  var user = {
    "name": "PPG007",
    "email": "1658272229@qq.com",
  };
  user["password"] = "123";
  for (var item in user.entries) {
    print("Key: ${item.key}");
    print("Value: ${item.value}");
  }
  // 不存在的键会返回 null
  print(user["null"] == null); // true
}
```

## Runes 与 grapheme clusters

类似 Golang。

```dart
void main(List<String> args) {
  var hi = '🇩🇰';
  print(hi.length); // 2
  print(hi.runes.length); // 4
}
```

## Symbols

Symbol 表示 Dart 中声明的操作符或者标识符。你几乎不会需要 Symbol，但是它们对于那些通过名称引用标识符的 API 很有用，因为代码压缩后，尽管标识符的名称会改变，但是它们的 Symbol 会保持不变。

```dart
void main(List<String> args) {
  String a = "123";
  print(#a); // Symbol("a")
}
```
