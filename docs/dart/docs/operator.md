# 运算符

这里主要是 Dart 中比较特别的运算符。

## 类型判断运算符

as 运算符：负责类型转换。

```dart
void main(List<String> args) {
  Object demo = "123";
  print((demo as String).length);
}
```

::: tip
当且仅当 a 实现了 b 的接口，`a as b` 才是 true，如果 b 是 Object，则必定为 true，因为所有类都是 Object 的子类。
:::

is、is! 运算符：判断对象是否是指定的类型

```dart
void main(List<String> args) {
  Object demo = "123";
  print(demo is! String); // false
  print(demo is String); // true
  if (demo is String) {
    print(demo.length);
  }
}
```

::: tip
如果在分支语句中使用 is 判断后，则在这个分支作用域内，变量的类型就确定下来了，类似于 Golang 的 switch 类型断言。
:::

as 运算符如果变量不是指定的类型或者为 null 则会抛出异常，is、is! 不会。

```dart
void main(List<String> args) {
  Object demo = 123;
  if (demo is String) {
    print(demo.length); // will not print
  }
  print((demo as String).length); // panic
}
```

## 赋值运算符

这里主要介绍 `??=` 赋值运算符，可以为值为 null 的变量赋值：

```dart
void main(List<String> args) {
  var a = null;
  a ??= 123;
  print(a); // 123
  var b = 456;
  b ??= 123;
  print(b); // 456
}
```

如果被赋值的变量不是 nulll，则这个变量会保持原来的值。

## 条件表达式

三目运算符：这里的三目运算符与 Java 等其他语言相同。

`表达式1 ?? 表达式2`：如果表达式 1 位非 null 则返回表达式 1 的值，否则执行表达式 2 病返回表达式 2 的值。

```dart
Object demoFunction(var a, b) => a ?? b;

void main(List<String> args) {
  print(demoFunction(null, 2)); // 2
  print(demoFunction(1, 2)); // 1
}
```

## 级联运算符

级联运算符 `..`，`?..` 可以在同一个对象上连续调用多个对象的变量或方法。

```dart
class User {
  late String name;
  late int age;
}

void main(List<String> args) {
  User user = User()
    ..age = 22
    ..name = "PPG";
  print(user.name);
  print(user.age);
}
```

如果要级联的对象可能为 null，可以使用 `?..` 运算符。

## 其他运算符

`?[]`：左侧调用者不为空时，访问 List 中特定位置的元素。

```dart
void main(List<String> args) {
  List<String> demo = ["123"];
  print(demo?[0]);
}
```

`?.`：左边的操作对象不能为 null，例如 foo?.bar，如果 foo 为 null 则返回 null ，否则返回 bar。

```dart
void main(List<String> args) {
  User? user = User();
  user = null;
  print(user?.age);
}

class User {
  late int age;
}
```
