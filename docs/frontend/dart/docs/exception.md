# 异常

与 Java 不同，Dart 中的异常都是非必检异常，方法不必声明会抛出哪些异常，也不必捕获任何异常。

Dart 提供了 Exception 和 Error 两种类型的异常以及它们一系列的子类，你也可以定义自己的异常类型。但是在 Dart 中可以将任何非 null 对象作为异常抛出而不局限于 Exception 或 Error 类型。

```dart
void exceptionDemo() => throw "wuhu";
void main() {
  exceptionDemo();
}
```

捕获异常：

```dart
void exceptionDemo() => throw "wuhu";
void main() {
  try {
    exceptionDemo();
  } on String catch (e, s) {
    print(e);
    print("stack info: $s");
  } on Error {
    rethrow;
  } catch (e) {
    print(e);
  } finally {
    print("finally");
  }
}
```

使用 on 来指定异常类型，使用 catch 来捕获异常对象，两者可以结合使用，catch 可以接受第二个参数，第一个参数是抛出的异常对象，第二个参数是栈信息。

可以使用 `rethrow` 将捕获的异常再次抛出。

::: tip
与 Java 不同，如果 finally 前没有 catch 捕获异常，则异常会在执行完 finally 后抛出。
:::
