# 流程控制

## if&else

Dart 中 if、else 与其他语言相同，需要注意的是 if 语句中的条件表达式必须是布尔类型。

```dart
void main(List<String> args) {
  var a = 10;
  if (a < 0) {
    print("a < 0");
  } else if (a == 0) {
    print("a == 0");
  } else {
    print("a > 0");
  }
}
```

## For

标准 for 循环：

```dart
void main(List<String> args) {
  String x = "Hello World";
  for (var i = 0; i < x.length; i++) {
    print(x[i]);
  }
}
```

for 循环中的闭包会自动捕获循环的 索引值 以避免 JavaScript 中一些常见的陷阱。

```dart
void main(List<String> args) {
  String x = "Hello World";
  for (var i = 0; i < x.length; i++) {
    void Print() {
      print(i);
    }

    Print();
  }
}
```

for in 与 forEach：用于可迭代对象。

```dart
void main(List<String> args) {
  var list = [1, 2, 3, 4, 5, 6];
  for (var i in list) {
    print(i);
  }
  list.forEach((element) {
    print(element);
  });
}
```

## while&do while

Dart 中 while、do while 与其他语言相同，不再赘述。

## switch

```dart
void main(List<String> args) {
  var x = "D";
  switch (x) {
    case "A":
      print(90);
      break;
    case "B":
      print(80);
      break;
    case "C":
      print(70);
      break;
    case "D":
    default:
      print(60);
      break;
  }
}
```

Dart 中每个 case 都必须要包含一个 break，或者是使用 continue、throw、return 来结束非空 case。

如果 case 语句为空，则这个 case 将会执行下一个 case 所要执行的内容。

还可以通过 continue 结合 label实现跳转：

```dart
void main(List<String> args) {
  var x = "D";
  switch (x) {
    case "A":
      print(90);
      break;
    case "B":
      print(80);
      break;
    case "C":
      print(70);
      break;
    case "D":
      continue E;
    E:
    default:
      print(60);
      break;
  }
}
```

## 断言

```dart
void main(List<String> args) {
  var x = "D";
  assert(x == "d", "x is not equal to d");
}
```

assert 第一个参数为布尔值表达式，第二个参数为可选信息；如果表达式值为 true，则断言成功，继续执行，如果表达式值为 false，则断言失败，抛出 AssertionError 异常。

::: tip
断言是否生效取决于开发工具和所使用的框架，如果使用 `dart run` 执行时希望断言生效，可以添加 `--enable-asserts` 参数：`dart run --enable-asserts hello.dart`。
:::

::: tip
生产环境中，断言会被忽略，与此同时传入 assert 的参数不被判断。
:::
