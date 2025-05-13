# 生成器

当你需要延迟地生成一连串的值时，可以考虑使用 生成器函数。Dart 内置支持两种形式的生成器方法：

- 同步生成器：返回一个 Iterable 对象。
- 异步生成器：返回一个 Stream 对象。

通过在函数上加 sync\* 关键字并将返回值类型设置为 Iterable 来实现一个 同步 生成器函数，在函数中使用 yield 语句来传递值：

```dart
Iterable<int> naturalsTo(int n) sync* {
  int k = 0;
  while (k < n) {
    yield k++;
  }
}

void main(List<String> args) {
  var x = naturalsTo(10).iterator;
  while (x.moveNext()) {
    print(x.current);
  }
}
```

实现 异步 生成器函数与同步类似，只不过关键字为 async\* 并且返回值为 Stream：

```dart
Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while (k < n) {
    yield k++;
  }
}

void main(List<String> args) async {
  var numbers = asynchronousNaturalsTo(10);
  await for (var x in numbers) {
    print(x);
  }
}
```

如果生成器是递归调用的，可是使用 yield\* 语句提升执行性能：

```dart
Iterable<int> naturalsDownFrom(int n) sync* {
  if (n > 0) {
    yield n;
    yield* naturalsDownFrom(n - 1);
  }
}

void main(List<String> args) {
  var x = naturalsDownFrom(10).iterator;
  while (x.moveNext()) {
    print(x.current);
  }
}
```
