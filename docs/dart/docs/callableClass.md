# 可调用类

通过实现类的 call() 方法，允许使用类似函数调用的方式来使用该类的实例。

```dart
class sum {
  int call(int a, int b) => a + b;
}

void main(List<String> args) {
  var s = sum();
  print(s(4, 6));
}
```
