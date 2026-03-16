# 异步

Dart 代码库中有大量返回 Future 或 Stream 对象的函数，这些函数都是异步的，它们会在耗时操作（比如 I/O）执行完毕前直接返回而不会等待耗时操作执行完毕。

## Future

通过下面的方式可以获得 Future 执行完成的结果：

- 使用 `async` 和 `await`。
- 使用 Future API。

::: warning
必须在带有 async 关键字的异步函数中使用 await。

异步函数的返回值类型应当是 Future。
:::

::: tip

- `Future<T>` 实例会返回一个类型为 T 的值。
- 如果一个 Future 实例没有可用的返回值，则这个实例的类型是 `Future<void>`。
- 一个 Future 实例可以是已完成或者是未完成状态。
- 当调用一个返回 Future 的方法时，这个方法会把任务加入队列然后返回一个未完成状态的 Future 实例。
- 当一个 Future 实例的操作完成时，这个实例会进入完成状态并附带一个值或者是错误。

:::

## 声明异步函数

异步函数是函数体被 `async` 关键字标记的函数。

```dart
import 'dart:io';

Future<String> demo({int second = 0}) async {
  sleep(Duration(seconds: second));
  return "wuhu";
}

void main(List<String> args) async {
  var d = await demo(second: 3);
  print(d);
}
```

Future 非常类似 JavaScript 中的 Promise：

```dart
Future<String> fetchUser() async {
  return Future.delayed(Duration(seconds: 3), () => "test");
}

void main(List<String> args) {
  fetchUser().then((value) => print(value)).catchError((e) {
    print(e);
  });
}
```

## Stream

从 Stream 中获取值的方法：

- 使用 `async` 关键字和一个异步循环（`await for`）。
- 使用 Stream API。

```dart
await for (varOrType identifier in expression) {
  // Executes each time the stream emits a value.
}
```

表达式的类型必须是 Stream，执行流程如下：

- 等待直到 Stream 返回一个数据。
- 使用 Stream 返回的数据执行循环体。
- 重复上面两个过程直到 Stream 的数据返回完毕。
